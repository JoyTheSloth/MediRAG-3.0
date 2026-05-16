"""
scripts/fix_fda_chunk_text.py
==============================
One-time fix: replaces the verbose FDA boilerplate prefix in all FDA DailyMed
chunk_text entries in the metadata store with a clean, BM25-friendly prefix.

Before: [FDA DRUG LABEL — These highlights do not include all the information
         needed to use WARFARIN SODIUM TABLETS safely and effectively...]
         CONTRAINDICATIONS: actual content...

After:  [FDA DailyMed | Warfarin | CONTRAINDICATIONS] actual content...

Usage:
    python scripts/fix_fda_chunk_text.py
    python scripts/fix_fda_chunk_text.py --dry-run
"""
from __future__ import annotations

import argparse
import logging
import pickle
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import yaml

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

SECTION_CODES = {
    "34068-7": "DOSAGE AND ADMINISTRATION",
    "34070-3": "CONTRAINDICATIONS",
    "43685-7": "WARNINGS AND PRECAUTIONS",
    "34067-9": "INDICATIONS AND USAGE",
    "34073-7": "DRUG INTERACTIONS",
    "34071-1": "WARNINGS",
}

# Matches both old boilerplate and previously-fixed format
_BOILERPLATE_RE = re.compile(r"^\[FDA[^\]]*\]\s*(?:[A-Za-z][^:]*:\s*)?", re.DOTALL)


def fix_chunk_text(chunk_id: str, old_text: str) -> str:
    """Return cleaned chunk_text with a compact, keyword-rich prefix."""
    # Extract drug name from chunk_id: fda_{drug_name}_{set_id}_{code}_{offset}
    parts = chunk_id.split("_")
    # parts[0] = "fda", parts[1] = drug_name (may be multi-word), then UUID parts, then code, then offset
    # Find the section code in parts
    section_name = None
    drug_name_parts = []
    for i, part in enumerate(parts[1:], 1):
        if part in SECTION_CODES:
            section_name = SECTION_CODES[part]
            drug_name_parts = parts[1:i]
            break

    # Filter out UUID parts (set_id format: 8hex-4hex-...) from drug name
    _UUID_RE = re.compile(r'^[0-9a-f]{8}-', re.I)
    drug_name_parts = [p for p in drug_name_parts if not _UUID_RE.match(p)]
    drug_name = " ".join(drug_name_parts).replace("_", " ").title() if drug_name_parts else "Unknown"

    if not section_name:
        m = _BOILERPLATE_RE.match(old_text)
        section_name = m.group(1).strip() if m else "DRUG INFORMATION"

    # Strip the old boilerplate prefix and get just the content
    m = _BOILERPLATE_RE.match(old_text)
    content = old_text[m.end():].strip() if m else old_text.strip()

    # Prepend drug name into content so BM25 finds it even in continuation chunks
    # e.g. chunk starting "Bleeding tendencies..." now reads "Warfarin CONTRAINDICATIONS: Bleeding..."
    return f"[FDA DailyMed | {drug_name} | {section_name}] {drug_name} {section_name}: {content}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    with open("config.yaml") as f:
        cfg = yaml.safe_load(f)
    meta_path = cfg["retrieval"]["metadata_path"]

    logger.info("Loading metadata store from %s ...", meta_path)
    with open(meta_path, "rb") as f:
        store: dict = pickle.load(f)

    fda_keys = [k for k, v in store.items() if v.get("source") == "FDA DailyMed"]
    logger.info("Found %d FDA DailyMed entries to fix", len(fda_keys))

    fixed = 0
    for key in fda_keys:
        entry = store[key]
        old_text = entry.get("chunk_text", "")
        # Re-run on both old boilerplate AND previously-fixed entries (to fix UUID + add drug name to content)
        if not (old_text.startswith("[FDA DRUG LABEL") or old_text.startswith("[FDA DailyMed |")):
            continue
        new_text = fix_chunk_text(entry.get("chunk_id", ""), old_text)
        if args.dry_run:
            if fixed < 3:
                logger.info("BEFORE: %s", old_text[:120])
                logger.info("AFTER:  %s", new_text[:120])
                logger.info("---")
        else:
            store[key]["chunk_text"] = new_text
        fixed += 1

    logger.info("%d entries %s", fixed,
                "would be fixed (dry run)" if args.dry_run else "fixed")

    if not args.dry_run:
        with open(meta_path, "wb") as f:
            pickle.dump(store, f, protocol=pickle.HIGHEST_PROTOCOL)
        logger.info("Metadata store saved. Restart backend to rebuild BM25 index.")


if __name__ == "__main__":
    main()
