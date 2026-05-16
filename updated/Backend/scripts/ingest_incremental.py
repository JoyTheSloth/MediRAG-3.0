"""
scripts/ingest_incremental.py
==============================
Adds new chunks to an EXISTING FAISS index without rebuilding from scratch.
Only the new chunks are embedded — existing vectors are untouched.

Usage:
    python scripts/ingest_incremental.py --input data/dailymed_chunks.jsonl
    python scripts/ingest_incremental.py --input data/dailymed_chunks.jsonl --dry-run
"""
from __future__ import annotations

import argparse
import json
import logging
import pickle
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import faiss
import numpy as np
import yaml

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


def load_config() -> dict:
    with open("config.yaml", "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def load_new_chunks(path: str) -> list[dict]:
    chunks = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                chunks.append(json.loads(line))
    logger.info("Loaded %d new chunks from %s", len(chunks), path)
    return chunks


def embed_chunks(chunks: list[dict], model_name: str) -> np.ndarray:
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer(model_name)
    texts = [c["chunk_text"] for c in chunks]
    logger.info("Embedding %d new chunks with %s...", len(texts), model_name)
    embeddings = model.encode(
        texts,
        batch_size=32,
        show_progress_bar=True,
        normalize_embeddings=True,
        convert_to_numpy=True,
    )
    return embeddings.astype(np.float32)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="JSONL file of new chunks")
    parser.add_argument("--dry-run", action="store_true",
                        help="Show what would be added without writing to disk")
    parser.add_argument("--force-update-section", default=None,
                        help="Force-update chunk_text for existing chunks matching this section keyword (e.g. 'ADVERSE REACTIONS')")
    args = parser.parse_args()

    cfg = load_config()
    idx_path   = cfg["retrieval"]["index_path"]
    meta_path  = cfg["retrieval"]["metadata_path"]
    model_name = cfg["retrieval"]["embedding_model"]

    if not Path(idx_path).exists():
        logger.error("FAISS index not found at %s. Run embedder.py first.", idx_path)
        sys.exit(1)

    # Load existing index + metadata
    logger.info("Loading existing FAISS index from %s ...", idx_path)
    index = faiss.read_index(idx_path)
    existing_count = index.ntotal
    logger.info("Existing index: %d vectors", existing_count)

    with open(meta_path, "rb") as f:
        metadata_store: dict[int, dict] = pickle.load(f)

    # Force-update existing chunk_text for a specific section (no new FAISS vectors needed)
    all_input_chunks = load_new_chunks(args.input)
    if args.force_update_section:
        section_kw = args.force_update_section.upper()
        # Primary lookup: chunk_id → FAISS key (works for FDA with deterministic IDs)
        id_to_meta = {v.get("chunk_id"): k for k, v in metadata_store.items()}
        # Secondary lookup: (doc_id, chunk_index) → FAISS key (works for guidelines with random UUID IDs)
        docidx_to_meta = {(v.get("doc_id", ""), v.get("chunk_index", 0)): k
                          for k, v in metadata_store.items()}
        updated = 0
        for chunk in all_input_chunks:
            if section_kw in chunk.get("chunk_text", "").upper():
                # Try primary match first
                faiss_key = id_to_meta.get(chunk.get("chunk_id"))
                # Fallback to (doc_id, chunk_index) match
                if faiss_key is None:
                    faiss_key = docidx_to_meta.get((chunk.get("doc_id", ""), chunk.get("chunk_index", 0)))
                if faiss_key is not None:
                    metadata_store[faiss_key]["chunk_text"] = chunk["chunk_text"]
                    updated += 1
        logger.info("Force-updated chunk_text for %d '%s' entries", updated, section_kw)
        if not args.dry_run:
            with open(meta_path, "wb") as f:
                pickle.dump(metadata_store, f, protocol=pickle.HIGHEST_PROTOCOL)
            logger.info("Metadata store saved.")
            # Invalidate BM25 cache
            bm25_cache = Path(meta_path).parent / "bm25_cache.pkl"
            if bm25_cache.exists():
                bm25_cache.unlink()
                logger.info("BM25 cache invalidated — will rebuild on next startup.")
        return

    # Deduplicate — skip chunks already in the index.
    # Primary key: chunk_id. Secondary key: (doc_id, chunk_index) handles
    # re-ingestion of the same document with new UUIDs (e.g. FDA label updates).
    existing_ids = {v.get("chunk_id", "") for v in metadata_store.values()}
    existing_docidx = {
        (v.get("doc_id", ""), v.get("chunk_index", -1))
        for v in metadata_store.values()
        if v.get("doc_id") and v.get("chunk_index", -1) >= 0
    }

    def _is_duplicate(c: dict) -> bool:
        if c.get("chunk_id") in existing_ids:
            return True
        key = (c.get("doc_id", ""), c.get("chunk_index", -1))
        return key[0] != "" and key[1] >= 0 and key in existing_docidx

    new_chunks = [c for c in all_input_chunks if not _is_duplicate(c)]

    if not new_chunks:
        logger.info("All chunks already in index. Nothing to add.")
        return

    logger.info("%d new chunks to add (%d duplicates skipped)",
                len(new_chunks), len(all_input_chunks) - len(new_chunks))

    if args.dry_run:
        logger.info("DRY RUN — no changes written.")
        for c in new_chunks[:5]:
            logger.info("  Would add: %s | %s", c.get("chunk_id"), c.get("title", "")[:60])
        return

    # Embed new chunks only
    embeddings = embed_chunks(new_chunks, model_name)

    # Add to existing FAISS index
    index.add(embeddings)
    logger.info("Index now has %d vectors (+%d)", index.ntotal, len(new_chunks))

    # Extend metadata store (new keys start from existing_count)
    for i, chunk in enumerate(new_chunks):
        metadata_store[existing_count + i] = {
            "chunk_id":     chunk.get("chunk_id", f"chunk_{existing_count + i}"),
            "doc_id":       chunk.get("doc_id", ""),
            "source":       chunk.get("source", ""),
            "title":        chunk.get("title", ""),
            "pub_type":     chunk.get("pub_type", "unknown"),
            "pub_year":     chunk.get("pub_year"),
            "journal":      chunk.get("journal", ""),
            "chunk_index":  chunk.get("chunk_index", 0),
            "total_chunks": chunk.get("total_chunks", 1),
            "chunk_text":   chunk.get("chunk_text", ""),
        }

    # Save updated artifacts
    faiss.write_index(index, idx_path)
    logger.info("FAISS index saved to %s", idx_path)

    with open(meta_path, "wb") as f:
        pickle.dump(metadata_store, f, protocol=pickle.HIGHEST_PROTOCOL)
    logger.info("Metadata store saved (%d total entries)", len(metadata_store))

    # Also append to chunks.jsonl for future full rebuilds
    chunks_jsonl = Path("data/processed/chunks.jsonl")
    with open(chunks_jsonl, "a", encoding="utf-8") as f:
        for chunk in new_chunks:
            f.write(json.dumps(chunk) + "\n")
    logger.info("Appended %d chunks to %s", len(new_chunks), chunks_jsonl)

    logger.info("Done. Restart the backend to reload the updated index.")


if __name__ == "__main__":
    main()
