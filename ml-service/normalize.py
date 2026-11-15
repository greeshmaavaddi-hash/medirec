"""Turns drug names people type (brands, typos) into one standard generic name."""
import difflib

SYNONYMS = {
    "acetaminophen": "paracetamol", "paracetamol": "paracetamol", "pcm": "paracetamol",
    "tylenol": "paracetamol", "crocin": "paracetamol", "dolo": "paracetamol", "calpol": "paracetamol",
    "ibuprofen": "ibuprofen", "brufen": "ibuprofen", "advil": "ibuprofen", "motrin": "ibuprofen",
    "cetirizine": "cetirizine", "zyrtec": "cetirizine",
    "diphenhydramine": "diphenhydramine", "benadryl": "diphenhydramine",
    "antacid": "antacid", "digene": "antacid",
    "oral rehydration salts": "oral rehydration salts", "ors": "oral rehydration salts",
}

def normalize_term(term):
    t = " ".join(term.strip().lower().split())
    if not t:
        return ""
    if t in SYNONYMS:
        return SYNONYMS[t]
    close = difflib.get_close_matches(t, SYNONYMS.keys(), n=1, cutoff=0.85)
    return SYNONYMS[close[0]] if close else t

def normalize_terms(terms):
    seen, out = set(), []
    for term in terms:
        n = normalize_term(term)
        if n and n not in seen:
            seen.add(n)
            out.append(n)
    return out
