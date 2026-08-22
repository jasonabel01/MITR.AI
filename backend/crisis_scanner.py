"""
MitrAI Crisis Circuit Breaker Module
Provides sub-2ms deterministic crisis keyword scanning using Aho-Corasick Automaton & Regex Patterns.
Covers English, Hindi, and transliterated Hinglish crisis cues.
"""

import re
from typing import Dict, Any, List, Optional

try:
    import ahocorasick
    HAS_AHOCORASICK = True
except ImportError:
    HAS_AHOCORASICK = False


CRISIS_PATTERNS = [
    # English crisis keywords
    "kill myself",
    "suicide",
    "end my life",
    "want to die",
    "hanging myself",
    "cutting myself",
    "overdose",
    "slit my wrist",
    "no reason to live",
    "better off dead",
    "jump off a bridge",
    "jump from building",
    "end it all",
    "wanna die",
    "hang myself",
    "take my life",
    "don't want to live",
    "dont want to live",
    "kill me",
    "self harm",
    "self-harm",
    "shoot myself",

    # Hinglish & Hindi transliterated crisis keywords
    "mar jaana chahta hoon",
    "mar jana chahta hu",
    "marne ka mann kar raha",
    "marne ka man kar raha",
    "apni jaan lena",
    "apni jaan le luga",
    "apni jaan le lunga",
    "khudkushi",
    "jaan de dunga",
    "jaan de dungi",
    "zindagi khatam karna",
    "zindagi khatam",
    "suicide kar lunga",
    "suicide karungi",
    "jeene ka mann nahi",
    "jeene ki iccha nahi",
    "faansi laga lunga",
    "zeher kha lunga",
    "kisi ko meri parwah nahi mar raha hu",
    "mar jana hai",
    "mar jau"
]

REGEX_CRISIS_PATTERNS = [
    r"\b(want|wish|going)\s+to\s+(die|end\s+it|kill\s+myself)\b",
    r"\b(better\s+off|rather\s+be)\s+dead\b",
    r"\b(take|end)\s+my\s+own\s+life\b",
    r"\b(no\s+point|no\s+reason)\s+in\s+living\b",
    r"\b(mar\s+jana|khud\s*kushi|jaan\s+de\s*du)\b",
]

COMPILED_REGEXES = [re.compile(p, re.IGNORECASE) for p in REGEX_CRISIS_PATTERNS]


class CrisisScanner:
    def __init__(self):
        self.automaton = None
        self.patterns = [p.lower() for p in CRISIS_PATTERNS]
        if HAS_AHOCORASICK:
            self.automaton = ahocorasick.Automaton()
            for idx, pattern in enumerate(self.patterns):
                self.automaton.add_word(pattern, (idx, pattern))
            self.automaton.make_automaton()

    def scan(self, text: str) -> Dict[str, Any]:
        """
        Scans input string for crisis keywords.
        Returns:
            {
                "is_crisis": bool,
                "detected_phrase": Optional[str],
                "confidence": float,
                "helplines": List[Dict[str, str]]
            }
        """
        if not text:
            return {"is_crisis": False, "detected_phrase": None, "confidence": 0.0, "helplines": []}

        cleaned_text = text.lower().strip()

        # Stage 1: Aho-Corasick match (< 1ms)
        if self.automaton:
            for end_index, (idx, original_phrase) in self.automaton.iter(cleaned_text):
                return {
                    "is_crisis": True,
                    "detected_phrase": original_phrase,
                    "confidence": 0.99,
                    "helplines": self.get_helplines()
                }
        else:
            # Fallback substring search
            for p in self.patterns:
                if p in cleaned_text:
                    return {
                        "is_crisis": True,
                        "detected_phrase": p,
                        "confidence": 0.98,
                        "helplines": self.get_helplines()
                    }

        # Stage 2: Regex patterns
        for regex in COMPILED_REGEXES:
            match = regex.search(cleaned_text)
            if match:
                return {
                    "is_crisis": True,
                    "detected_phrase": match.group(0),
                    "confidence": 0.95,
                    "helplines": self.get_helplines()
                }

        return {
            "is_crisis": False,
            "detected_phrase": None,
            "confidence": 0.0,
            "helplines": []
        }

    @staticmethod
    def get_helplines() -> List[Dict[str, str]]:
        return [
            {
                "name": "Tele-MANAS (Govt. of India)",
                "number": "14416",
                "description": "Toll-Free 24/7 National Mental Health Helpline (20+ Languages)",
                "action": "tel:14416",
                "primary": True
            },
            {
                "name": "KIRAN Mental Health Helpline",
                "number": "1800-599-0019",
                "description": "24/7 National Toll-Free Support for Distress & Crisis",
                "action": "tel:18005990019",
                "primary": False
            },
            {
                "name": "Vandrevala Foundation",
                "number": "+91 9999 666 555",
                "description": "24/7 Free Crisis Counseling via Call & WhatsApp",
                "action": "tel:+919999666555",
                "primary": False
            }
        ]


# Global singleton instance
crisis_scanner = CrisisScanner()
