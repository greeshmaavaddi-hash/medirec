from recommender import recommend

MEDS = [
 {"id":1,"name":"Crocin","generic":"paracetamol","indications":["fever","headache"],"contraindications":["liver disease"],"min_age":1},
 {"id":2,"name":"Brufen","generic":"ibuprofen","indications":["headache","fever","inflammation"],"contraindications":["ulcer"],"min_age":12},
]
names = lambda r: [x["name"] for x in r["recommendations"]]

def test_ranking():
    assert names(recommend(["fever","headache"], {"age":30}, MEDS))[0] == "Crocin"

def test_allergy_excluded_with_reason():
    r = recommend(["fever"], {"age":30,"allergies":["paracetamol"]}, MEDS)
    assert "Crocin" not in names(r)
    assert any(e["name"] == "Crocin" for e in r["excluded"])

def test_condition_filter():
    r = recommend(["fever"], {"age":30,"conditions":["ulcer"]}, MEDS)
    assert names(r) == ["Crocin"]

def test_age_filter():
    assert "Brufen" not in names(recommend(["fever"], {"age":5}, MEDS))

def test_red_flag_is_urgent():
    r = recommend(["chest pain"], {"age":30}, MEDS)
    assert r["urgent"] and r["recommendations"] == []

def test_empty_symptoms():
    assert recommend([], {}, MEDS)["recommendations"] == []
