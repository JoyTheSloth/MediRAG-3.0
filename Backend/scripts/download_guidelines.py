"""
scripts/download_guidelines.py
================================
Downloads clinical guidelines from PubMed Central (PMC) open-access API
and chunks them for ingestion into the MediRAG FAISS index.

Sources:
  - ADA Standards of Medical Care in Diabetes 2024 (16 sections via PMC)
  - More guidelines can be added to GUIDELINE_SOURCES below

Chunking strategy (based on structural analysis):
  - Primary boundary: H2 clinical topic + Recommendations block + evidence narrative
  - Never split a Recommendations block
  - Store evidence grades (A/B/C/E) and recommendation numbers as metadata

Usage:
    python scripts/download_guidelines.py
    python scripts/download_guidelines.py --source ada_diabetes
    python scripts/download_guidelines.py --dry-run
"""
from __future__ import annotations

import argparse
import json
import logging
import re
import time
import uuid
from pathlib import Path

import requests

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Guideline sources — PMC IDs for ADA 2024 Standards of Care
# ---------------------------------------------------------------------------
GUIDELINE_SOURCES = {
    "ada_diabetes": {
        "name": "ADA Standards of Medical Care in Diabetes 2024",
        "key": "ada",
        "pub_type": "clinical_guideline",
        "source": "American Diabetes Association",
        "pub_year": 2024,
        "journal": "Diabetes Care",
        "sections": [
            {"pmcid": "PMC10725812", "section": "2", "title": "Diagnosis and Classification of Diabetes"},
            {"pmcid": "PMC10725809", "section": "4", "title": "Comprehensive Medical Evaluation and Assessment of Comorbidities"},
            {"pmcid": "PMC10725816", "section": "5", "title": "Facilitating Positive Health Behaviors and Well-being"},
            {"pmcid": "PMC10725808", "section": "6", "title": "Glycemic Goals and Hypoglycemia"},
            {"pmcid": "PMC10725813", "section": "7", "title": "Diabetes Technology"},
            {"pmcid": "PMC10725806", "section": "8", "title": "Obesity and Weight Management for the Prevention and Treatment of Type 2 Diabetes"},
            {"pmcid": "PMC10725810", "section": "9", "title": "Pharmacologic Approaches to Glycemic Treatment"},
            {"pmcid": "PMC10725804", "section": "13", "title": "Older Adults"},
            {"pmcid": "PMC10725814", "section": "14", "title": "Children and Adolescents"},
            {"pmcid": "PMC10725801", "section": "15", "title": "Management of Diabetes in Pregnancy"},
            {"pmcid": "PMC10725815", "section": "16", "title": "Diabetes Care in the Hospital"},
            {"pmcid": "PMC10725798", "section": "1", "title": "Improving Care and Promoting Health in Populations"},
        ],
    },
    "acc_aha_cholesterol": {
        "name": "2018 ACC/AHA Guideline on Management of Blood Cholesterol",
        "key": "acc_aha_chol",
        "pub_type": "clinical_guideline",
        "source": "American College of Cardiology/American Heart Association",
        "pub_year": 2018,
        "journal": "Circulation",
        "sections": [
            # PMC7403606: Grundy et al. 2018 executive summary, freely accessible full text
            {"pmcid": "PMC7403606", "section": "1", "title": "Management of Blood Cholesterol — Statin Therapy and LDL Targets"},
        ],
    },
    "acc_aha_prevention": {
        "name": "2019 ACC/AHA Guideline on Primary Prevention of Cardiovascular Disease",
        "key": "acc_aha_prev",
        "pub_type": "clinical_guideline",
        "source": "American College of Cardiology/American Heart Association",
        "pub_year": 2019,
        "journal": "Journal of the American College of Cardiology",
        "sections": [
            # PMC7685565: Arnett et al. 2019, full guideline open access
            {"pmcid": "PMC7685565", "section": "1", "title": "Primary Prevention — Blood Pressure, Cholesterol, Aspirin, Lifestyle"},
        ],
    },
}

PMC_API = "https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_json/{pmcid}/unicode"
PMC_EFETCH = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"

# Evidence grade pattern: single letter A/B/C/E at end of recommendation
_GRADE_RE = re.compile(r'\b([ABCE])\s*$')
# Recommendation number pattern: e.g. "9.18", "2.1a", "6.5b"
_REC_NUM_RE = re.compile(r'^(\d+\.\d+[a-z]?)\s+')


PMC_HTML_URL = "https://www.ncbi.nlm.nih.gov/pmc/articles/{pmcid}/"


def fetch_pmc_xml(pmcid: str) -> str | None:
    """Fetch PMC article HTML page and extract clean structured text."""
    try:
        from lxml import html as lxml_html
        url = PMC_HTML_URL.format(pmcid=pmcid)
        r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=30)
        r.raise_for_status()
        return _extract_pmc_html_text(lxml_html.fromstring(r.content))
    except Exception as e:
        logger.warning("PMC HTML fetch failed for %s: %s", pmcid, e)
        return None


def _extract_pmc_html_text(tree) -> str:
    """
    Extract clean structured text from PMC article HTML.
    Uses lxml XPath to navigate the <article> element.
    Deduplicates recommendation paragraphs (PMC renders them twice).
    """
    # Get main article element
    articles = tree.xpath('//article')
    root = articles[0] if articles else tree

    lines = []
    seen_texts: set[str] = set()  # Deduplication for repeated elements

    def clean(el) -> str:
        return " ".join(el.text_content().split()).strip()

    def add_line(text: str) -> None:
        if text and len(text) > 10 and text not in seen_texts:
            seen_texts.add(text)
            lines.append(text)

    def extract_table(table_el):
        """Extract a table element as readable pipe-separated rows."""
        caption = table_el.xpath('.//caption')
        if caption:
            add_line(f"[Table: {clean(caption[0])}]")
        for tr in table_el.xpath('.//tr'):
            cells = [" ".join(td.text_content().split()).strip()
                     for td in tr.xpath('.//td | .//th')]
            row = " | ".join(c for c in cells if c)
            if row:
                add_line(row)

    def process_section(sec, depth=0):
        # Deep-search for tables first (they may be nested inside divs/figures)
        for table in sec.xpath('.//table'):
            # Only process tables whose nearest section ancestor is this sec
            ancestors = table.xpath('ancestor::section')
            if not ancestors or ancestors[-1] == sec:
                extract_table(table)

        for child in sec:
            tag = child.tag.lower() if isinstance(child.tag, str) else ""

            if tag in ("h1", "h2", "h3", "h4"):
                text = clean(child)
                if text and text not in ("Abstract", "References", "Footnotes"):
                    lines.append(f"\n{'#' * (depth + 2)} {text}")

            elif tag == "p":
                text = clean(child)
                add_line(text)

            elif tag in ("ul", "ol"):
                for li in child.xpath('.//li'):
                    text = clean(li)
                    add_line(f"• {text}")

            elif tag == "section":
                process_section(child, depth + 1)

            elif tag == "table":
                pass  # Already handled above via deep-search

            elif tag == "div":
                # Recurse into divs that might contain content
                cls = child.get("class", "")
                if any(k in cls for k in ("content", "body", "text", "article")):
                    process_section(child, depth)

    for sec in root.xpath('.//section'):
        # Only process top-level sections (not deeply nested)
        parent = sec.getparent()
        if parent is not None and parent.tag.lower() not in ("section",):
            process_section(sec)

    # If no sections found, fall back to all paragraphs
    if len(lines) < 5:
        for p in root.xpath('.//article//p | .//p[@class]'):
            add_line(clean(p))

    return "\n\n".join(l for l in lines if l.strip())


def extract_recommendations(text: str) -> list[dict]:
    """Extract individual recommendations with their numbers and grades."""
    recs = []
    for line in text.split('\n'):
        line = line.strip()
        m = _REC_NUM_RE.match(line)
        if m:
            rec_num = m.group(1)
            rec_text = line[m.end():].strip()
            grade_m = _GRADE_RE.search(rec_text)
            grade = grade_m.group(1) if grade_m else "E"
            recs.append({"number": rec_num, "text": rec_text, "grade": grade})
    return recs


def chunk_guideline_text(
    text: str,
    section_meta: dict,
    guideline_meta: dict,
    max_chunk_chars: int = 2000,
) -> list[dict]:
    """
    Chunk guideline text at ## heading boundaries produced by _extract_pmc_html_text.
    Each chunk = H2/H3 topic + its paragraphs/recommendations.
    """
    chunks = []
    section_num = section_meta["section"]
    section_title = section_meta["title"]
    guideline_name = guideline_meta["name"]
    source = guideline_meta["source"]
    pub_year = guideline_meta["pub_year"]
    pub_type = guideline_meta["pub_type"]
    source_key = guideline_meta.get("key", "ada")
    journal = guideline_meta.get("journal", "Diabetes Care")

    # Split text into blocks at any ## heading
    # Each block starts with a heading line and contains the following paragraphs
    _HEADING_RE = re.compile(r'^(#{1,4})\s+(.+)$', re.MULTILINE)

    # Find all heading positions
    heading_matches = list(_HEADING_RE.finditer(text))

    if not heading_matches:
        # No headings found — chunk by size
        blocks = [(section_title, text)]
    else:
        blocks = []
        for i, m in enumerate(heading_matches):
            heading_text = m.group(2).strip()
            # Skip metadata headings
            if heading_text in ("Abstract", "References", "Footnotes", "Author notes",
                                "Conflicts of interest", "Acknowledgments"):
                continue
            start = m.end()
            end = heading_matches[i + 1].start() if i + 1 < len(heading_matches) else len(text)
            content = text[start:end].strip()
            if content:
                blocks.append((heading_text, content))

    def make_chunk(heading: str, content: str, part_idx: int = 0) -> dict:
        recs = extract_recommendations(content)
        rec_nums = [r["number"] for r in recs]
        grades = {r["number"]: r["grade"] for r in recs}
        grade_summary = "/".join(sorted(set(r["grade"] for r in recs))) if recs else ""

        prefix = f"[{guideline_name} | Section {section_num}: {section_title} | {heading}]"
        if grade_summary:
            prefix += f" [Evidence: {grade_summary}]"

        return {
            "chunk_id":           f"guideline_{source_key}_{section_num}_{uuid.uuid4().hex[:8]}_{part_idx}",
            "doc_id":             f"guideline_{source_key}_section_{section_num}",
            "chunk_text":         f"{prefix}\n{content}",
            "chunk_index":        len(chunks),
            "total_chunks":       0,
            "pub_type":           pub_type,
            "source":             source,
            "title":              f"{guideline_name} — Section {section_num}: {heading}",
            "pub_year":           pub_year,
            "journal":            journal,
            "section_number":     section_num,
            "section_title":      section_title,
            "h2_heading":         heading,
            "recommendation_numbers": rec_nums,
            "evidence_grades":    grades,
        }

    for heading, content in blocks:
        if len(content) <= max_chunk_chars:
            chunks.append(make_chunk(heading, content))
        else:
            # Split long blocks at paragraph boundaries
            paras = [p.strip() for p in re.split(r'\n{2,}', content) if p.strip()]
            current: list[str] = []
            part = 0
            for para in paras:
                current.append(para)
                if len("\n\n".join(current)) >= max_chunk_chars:
                    chunks.append(make_chunk(heading, "\n\n".join(current[:-1]), part))
                    current = [para]
                    part += 1
            if current:
                chunks.append(make_chunk(heading, "\n\n".join(current), part))

    for chunk in chunks:
        chunk["total_chunks"] = len(chunks)

    return chunks


def download_guidelines(source_key: str, output_path: str, dry_run: bool = False) -> None:
    source = GUIDELINE_SOURCES[source_key]
    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)

    total_chunks = 0
    failed_sections = []

    with open(out, "w", encoding="utf-8") as f:
        for section in source["sections"]:
            pmcid = section["pmcid"]
            logger.info("Fetching %s — Section %s: %s", pmcid, section["section"], section["title"])

            text = fetch_pmc_xml(pmcid)

            if not text or len(text) < 200:
                logger.warning("No text retrieved for %s — skipping", pmcid)
                failed_sections.append(section["title"])
                time.sleep(0.5)
                continue

            logger.info("  Retrieved %d chars", len(text))

            chunks = chunk_guideline_text(text, section, source)
            logger.info("  → %d chunks extracted", len(chunks))

            if dry_run:
                if chunks:
                    logger.info("  Sample chunk:\n%s\n...", chunks[0]["chunk_text"][:300])
                continue

            for chunk in chunks:
                f.write(json.dumps(chunk) + "\n")

            total_chunks += len(chunks)
            time.sleep(0.5)  # Be polite to NCBI API

    if not dry_run:
        logger.info("Done. %d total chunks written to %s", total_chunks, out)
    if failed_sections:
        logger.warning("Failed sections: %s", failed_sections)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", default=None,
                        choices=list(GUIDELINE_SOURCES.keys()),
                        help="Guideline source to download (default: all sources)")
    parser.add_argument("--all", action="store_true",
                        help="Download all guideline sources")
    parser.add_argument("--output", default="data/guidelines_chunks.jsonl")
    parser.add_argument("--dry-run", action="store_true",
                        help="Fetch and parse but don't write output")
    args = parser.parse_args()

    sources_to_run = list(GUIDELINE_SOURCES.keys()) if (args.all or args.source is None) else [args.source]

    for source_key in sources_to_run:
        logger.info("Downloading: %s", GUIDELINE_SOURCES[source_key]["name"])
        # For multi-source runs, append non-ada sources to the same output file
        if source_key == sources_to_run[0]:
            download_guidelines(source_key, args.output, dry_run=args.dry_run)
        else:
            # Append to existing file by re-opening in append mode
            out = Path(args.output)
            source = GUIDELINE_SOURCES[source_key]
            total_chunks = 0
            failed_sections = []
            with open(out, "a", encoding="utf-8") as f:
                for section in source["sections"]:
                    pmcid = section["pmcid"]
                    logger.info("Fetching %s — Section %s: %s", pmcid, section["section"], section["title"])
                    text = fetch_pmc_xml(pmcid)
                    if not text or len(text) < 200:
                        logger.warning("No text retrieved for %s — skipping", pmcid)
                        failed_sections.append(section["title"])
                        time.sleep(0.5)
                        continue
                    logger.info("  Retrieved %d chars", len(text))
                    chunks = chunk_guideline_text(text, section, source)
                    logger.info("  → %d chunks extracted", len(chunks))
                    if args.dry_run:
                        if chunks:
                            logger.info("  Sample chunk:\n%s\n...", chunks[0]["chunk_text"][:300])
                        continue
                    for chunk in chunks:
                        f.write(json.dumps(chunk) + "\n")
                    total_chunks += len(chunks)
                    time.sleep(0.5)
            if not args.dry_run:
                logger.info("Done. %d total chunks written for %s", total_chunks, source_key)
            if failed_sections:
                logger.warning("Failed sections: %s", failed_sections)
