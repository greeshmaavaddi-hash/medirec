from normalize import normalize_terms

def test_brand_and_synonym():
    assert normalize_terms(["Acetaminophen", "Crocin"]) == ["paracetamol"]

def test_typo_is_fixed():
    assert normalize_terms(["ibuprofin"]) == ["ibuprofen"]

def test_unknown_kept_and_empty_dropped():
    assert normalize_terms(["  ", "penicillin"]) == ["penicillin"]
