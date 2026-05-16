"""
src/pipeline/privacy.py — PHI/PII Privacy Shield (The Sanitizer)
==============================================================
Detects and redacts sensitive patient information before external API calls.
Supports names, dates, contact info, and generic medical IDs.
"""
from __future__ import annotations
import re
import logging
from typing import Dict, Tuple

logger = logging.getLogger(__name__)

class PrivacyShield:
    def __init__(self):
        # Basic patterns for common PII
        self.patterns = {
            "EMAIL": r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+',
            "PHONE": r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
            "SSN": r'\b\d{3}-\d{2}-\d{4}\b',
            "DOB": r'\b\d{2}/\d{2}/\d{4}\b|\b\d{4}-\d{2}-\d{2}\b',
            "ID": r'\bPT-\d{4,8}\b|\bID:\s?\d{4,8}\b'
        }
        # Names are harder without heavy NER, so we start with common indicators or capital patterns
        # In a production app, we would use a dedicated medical NER model.
        self.name_pattern = r'\b(?:Mr\.|Ms\.|Mrs\.|Dr\.)\s[A-Z][a-z]+(?:\s[A-Z][a-z]+)?\b'

    def redact(self, text: str) -> Tuple[str, Dict[str, str]]:
        """
        Redacts PHI in text and returns (redacted_text, placeholder_map).
        """
        mapping = {}
        redacted = text
        
        # 1. Redact specific patterns
        for label, pattern in self.patterns.items():
            matches = re.findall(pattern, redacted)
            for i, match in enumerate(set(matches)):
                placeholder = f"[{label}_{i+1}]"
                mapping[placeholder] = match
                redacted = redacted.replace(match, placeholder)

        # 2. Redact potential names
        name_matches = re.findall(self.name_pattern, redacted)
        for i, match in enumerate(set(name_matches)):
            placeholder = f"[PATIENT_NAME_{i+1}]"
            mapping[placeholder] = match
            redacted = redacted.replace(match, placeholder)

        if mapping:
            logger.info("Privacy Shield: Redacted %d sensitive items.", len(mapping))
        
        return redacted, mapping

    def restore(self, text: str, mapping: Dict[str, str]) -> str:
        """
        Replaces placeholders in the AI response with original values.
        """
        restored = text
        for placeholder, original in mapping.items():
            restored = restored.replace(placeholder, original)
        return restored

# Singleton instance
shield = PrivacyShield()
