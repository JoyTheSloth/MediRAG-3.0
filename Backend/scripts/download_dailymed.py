"""
scripts/download_dailymed.py
============================
Downloads FDA DailyMed drug labels for common clinical drugs via the
DailyMed API and saves them as chunks.jsonl ready for ingestion into
the MediRAG FAISS index.

Sections extracted per drug:
  - DOSAGE AND ADMINISTRATION
  - CONTRAINDICATIONS
  - WARNINGS AND PRECAUTIONS
  - INDICATIONS AND USAGE
  - DRUG INTERACTIONS

Usage:
    python scripts/download_dailymed.py
    python scripts/download_dailymed.py --drugs metformin aspirin warfarin
    python scripts/download_dailymed.py --output data/dailymed_chunks.jsonl
"""
from __future__ import annotations

import argparse
import json
import logging
import time
import xml.etree.ElementTree as ET
from pathlib import Path

import requests

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Top 200 common clinical drugs (priority list)
# ---------------------------------------------------------------------------
TOP_DRUGS = [
    "metformin", "atorvastatin", "lisinopril", "levothyroxine", "amlodipine",
    "omeprazole", "metoprolol", "albuterol", "losartan", "gabapentin",
    "sertraline", "simvastatin", "montelukast", "pantoprazole", "alprazolam",
    "furosemide", "escitalopram", "rosuvastatin", "acetaminophen", "ibuprofen",
    "amoxicillin", "azithromycin", "doxycycline", "prednisone", "warfarin",
    "clopidogrel", "aspirin", "tamsulosin", "insulin glargine", "glipizide",
    "hydrochlorothiazide", "amlodipine", "venlafaxine", "bupropion", "duloxetine",
    "clonazepam", "lorazepam", "zolpidem", "quetiapine", "aripiprazole",
    "olanzapine", "risperidone", "fluoxetine", "paroxetine", "citalopram",
    "tramadol", "oxycodone", "morphine", "fentanyl", "naloxone",
    "ciprofloxacin", "levofloxacin", "clindamycin", "metronidazole", "trimethoprim",
    "enalapril", "ramipril", "carvedilol", "bisoprolol", "digoxin",
    "spironolactone", "diltiazem", "verapamil", "nifedipine", "hydralazine",
    "nitroglycerin", "isosorbide", "clopidogrel", "apixaban", "rivaroxaban",
    "dabigatran", "heparin", "enoxaparin", "atorvastatin", "pravastatin",
    "ezetimibe", "fenofibrate", "niacin", "gemfibrozil", "cholestyramine",
    "allopurinol", "colchicine", "indomethacin", "naproxen", "celecoxib",
    "hydroxychloroquine", "methotrexate", "leflunomide", "sulfasalazine",
    "prednisolone", "dexamethasone", "budesonide", "fluticasone", "beclomethasone",
    "ipratropium", "tiotropium", "salmeterol", "formoterol", "theophylline",
    "insulin aspart", "insulin lispro", "sitagliptin", "saxagliptin", "empagliflozin",
    "canagliflozin", "dapagliflozin", "liraglutide", "exenatide", "pioglitazone",
    "acarbose", "repaglinide", "nateglinide", "glimepiride", "glyburide",
    "levothyroxine", "methimazole", "propylthiouracil", "calcitonin", "alendronate",
    "risedronate", "ibandronate", "denosumab", "teriparatide", "raloxifene",
    "tamoxifen", "letrozole", "anastrozole", "exemestane", "fulvestrant",
    "rituximab", "trastuzumab", "bevacizumab", "imatinib", "erlotinib",
    "ondansetron", "metoclopramide", "promethazine", "prochlorperazine",
    "loperamide", "bismuth subsalicylate", "lactulose", "polyethylene glycol",
    "docusate", "senna", "mesalamine", "sulfasalazine", "infliximab",
    "adalimumab", "etanercept", "ustekinumab", "secukinumab",
    "acyclovir", "valacyclovir", "oseltamivir", "ribavirin", "sofosbuvir",
    "fluconazole", "itraconazole", "voriconazole", "amphotericin b",
    "vancomycin", "linezolid", "daptomycin", "meropenem", "piperacillin",
    "phenytoin", "valproic acid", "carbamazepine", "levetiracetam", "lamotrigine",
    "topiramate", "oxcarbazepine", "lacosamide", "brivaracetam",
    "donepezil", "memantine", "rivastigmine", "galantamine",
    "carbidopa levodopa", "pramipexole", "ropinirole", "rasagiline", "selegiline",
    "baclofen", "tizanidine", "cyclobenzaprine", "methocarbamol",
    "sildenafil", "tadalafil", "vardenafil", "finasteride", "dutasteride",
    "testosterone", "estradiol", "progesterone", "medroxyprogesterone",
    "methylphenidate", "amphetamine", "atomoxetine", "guanfacine", "clonidine",
]

# DailyMed sections we care about (LOINC codes)
SECTION_CODES = {
    "34068-7": "DOSAGE AND ADMINISTRATION",
    "34070-3": "CONTRAINDICATIONS",
    "43685-7": "WARNINGS AND PRECAUTIONS",
    "34067-9": "INDICATIONS AND USAGE",
    "34073-7": "DRUG INTERACTIONS",
    "34071-1": "WARNINGS",
    "34084-4": "ADVERSE REACTIONS",
    "34088-5": "OVERDOSAGE",
    "34080-2": "USE IN SPECIFIC POPULATIONS",
}

DAILYMED_API = "https://dailymed.nlm.nih.gov/dailymed/services/v2"


def search_drug(drug_name: str) -> str | None:
    """Return the SPL set_id for the first matching drug label."""
    try:
        r = requests.get(
            f"{DAILYMED_API}/spls.json",
            params={"drug_name": drug_name, "pagesize": 1},
            timeout=10,
        )
        r.raise_for_status()
        data = r.json()
        results = data.get("data", [])
        if results:
            return results[0].get("setid")
    except Exception as e:
        logger.warning("Search failed for '%s': %s", drug_name, e)
    return None


def fetch_label_xml(set_id: str) -> str | None:
    """Download the full SPL XML for a given set_id."""
    try:
        r = requests.get(
            f"{DAILYMED_API}/spls/{set_id}.xml",
            timeout=15,
        )
        r.raise_for_status()
        return r.text
    except Exception as e:
        logger.warning("XML fetch failed for set_id '%s': %s", set_id, e)
    return None


def extract_sections(xml_text: str, drug_name: str, set_id: str = "unknown") -> list[dict]:
    """Parse SPL XML and extract clinical sections as chunk dicts."""
    chunks = []
    try:
        root = ET.fromstring(xml_text)
        ns = {"hl7": "urn:hl7-org:v3"}

        # Get brand/generic name from XML
        title_el = root.find(".//hl7:title", ns)
        label_title = title_el.text.strip() if title_el is not None and title_el.text else drug_name.title()

        for section in root.findall(".//hl7:section", ns):
            code_el = section.find("hl7:code", ns)
            if code_el is None:
                continue
            code = code_el.get("code", "")
            section_name = SECTION_CODES.get(code)
            if not section_name:
                continue

            # Extract text — handle tables specially so row data isn't lost
            texts = []
            for el in section.iter("{urn:hl7-org:v3}text"):
                # Extract tables as readable rows before falling back to itertext
                for table in el.findall(".//{urn:hl7-org:v3}table"):
                    rows = []
                    for tr in table.iter("{urn:hl7-org:v3}tr"):
                        cells = [" ".join(td.itertext()).strip()
                                 for td in tr.iter("{urn:hl7-org:v3}td")]
                        if not cells:
                            cells = [" ".join(th.itertext()).strip()
                                     for th in tr.iter("{urn:hl7-org:v3}th")]
                        row = " | ".join(c for c in cells if c)
                        if row:
                            rows.append(row)
                    if rows:
                        texts.append(" ; ".join(rows))
                    # Remove table from tree to avoid double-counting via itertext
                    el.remove(table) if table in list(el) else None

                # Non-table text
                text = " ".join(el.itertext()).strip()
                if text:
                    texts.append(text)
            full_text = " ".join(texts).strip()

            if len(full_text) < 50:
                continue

            # Truncate to 1500 chars per chunk (BioBERT max ~512 tokens)
            for i in range(0, min(len(full_text), 6000), 1500):
                segment = full_text[i:i+1500].strip()
                if len(segment) < 50:
                    continue
                chunk_id = f"fda_{drug_name.replace(' ', '_')}_{set_id}_{code}_{i}"
                chunks.append({
                    "chunk_id":     chunk_id,
                    "doc_id":       f"fda_{drug_name.replace(' ', '_')}_{set_id}",
                    "chunk_text":   f"[FDA DailyMed | {drug_name.title()} | {section_name}] {drug_name.title()} {section_name}: {segment}",
                    "chunk_index":  i // 1500,
                    "total_chunks": max(1, min(4, len(full_text) // 1500 + 1)),
                    "pub_type":     "drug_label",
                    "source":       "FDA DailyMed",
                    "title":        f"{label_title} — {section_name}",
                    "pub_year":     2024,
                    "journal":      "FDA DailyMed",
                    "drug_name":    drug_name,
                    "section":      section_name,
                })
    except ET.ParseError as e:
        logger.warning("XML parse error for '%s': %s", drug_name, e)
    return chunks


def download_dailymed(drug_list: list[str], output_path: str) -> None:
    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)

    total_chunks = 0
    failed = []

    with open(out, "w", encoding="utf-8") as f:
        for i, drug in enumerate(drug_list):
            logger.info("[%d/%d] Processing: %s", i + 1, len(drug_list), drug)

            set_id = search_drug(drug)
            if not set_id:
                logger.warning("  No DailyMed entry found for '%s'", drug)
                failed.append(drug)
                time.sleep(0.3)
                continue

            xml_text = fetch_label_xml(set_id)
            if not xml_text:
                failed.append(drug)
                time.sleep(0.3)
                continue

            chunks = extract_sections(xml_text, drug, set_id=set_id)
            for chunk in chunks:
                f.write(json.dumps(chunk) + "\n")

            total_chunks += len(chunks)
            logger.info("  → %d chunks extracted (set_id: %s)", len(chunks), set_id)
            time.sleep(0.4)  # Be polite to the API

    logger.info("Done. %d total chunks written to %s", total_chunks, out)
    if failed:
        logger.warning("Failed drugs (%d): %s", len(failed), ", ".join(failed))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--drugs", nargs="*", default=None,
                        help="Specific drug names (default: full TOP_DRUGS list)")
    parser.add_argument("--output", default="data/dailymed_chunks.jsonl",
                        help="Output JSONL path")
    parser.add_argument("--limit", type=int, default=None,
                        help="Limit number of drugs to download")
    args = parser.parse_args()

    drug_list = args.drugs or TOP_DRUGS
    # Deduplicate while preserving order
    seen: set[str] = set()
    drug_list = [d for d in drug_list if not (d in seen or seen.add(d))]
    if args.limit:
        drug_list = drug_list[:args.limit]

    logger.info("Downloading DailyMed labels for %d drugs...", len(drug_list))
    download_dailymed(drug_list, args.output)
