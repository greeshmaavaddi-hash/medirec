"""Recommendation engine: red-flag check -> safety filter -> weighted ranking."""

RED_FLAGS = {"chest pain", "difficulty breathing", "shortness of breath",
             "severe bleeding", "fainting", "confusion", "blood in stool"}

def _norm(xs):
    return {x.strip().lower() for x in xs if x and x.strip()}

def check_safety(m, allergies, conditions, age):
    """Return a reason string if the medicine is unsafe for this person, else None."""
    if allergies & _norm([m["name"], m["generic"]]):
        return "matches a stated allergy"
    hit = conditions & _norm(m.get("contraindications", []))
    if hit:
        return "not advised with: " + ", ".join(sorted(hit))
    if age is not None and age < m.get("min_age", 0):
        return f"minimum age is {m['min_age']}"
    return None

def recommend(symptoms, profile, medicines, top_k=5):
    symptoms = _norm(symptoms)
    if not symptoms:
        return {"urgent": False, "recommendations": [], "excluded": []}
    if symptoms & RED_FLAGS:
        return {"urgent": True, "recommendations": [], "excluded": []}

    allergies = _norm(profile.get("allergies", []))
    conditions = _norm(profile.get("conditions", []))
    age = profile.get("age")

    ranked, excluded = [], []
    for m in medicines:
        ind = _norm(m["indications"])
        matched = symptoms & ind
        if not matched:
            continue
        reason = check_safety(m, allergies, conditions, age)
        if reason:
            excluded.append({"name": m["name"], "reason": reason})
            continue
        coverage = len(matched) / len(symptoms)   # how much of the problem it covers
        precision = len(matched) / len(ind)       # how targeted the drug is
        ranked.append({
            "id": m["id"], "name": m["name"], "generic": m["generic"],
            "score": round(0.7 * coverage + 0.3 * precision, 3),
            "matched_symptoms": sorted(matched),
            "otc": m.get("otc", True),
        })
    ranked.sort(key=lambda r: r["score"], reverse=True)
    return {"urgent": False, "recommendations": ranked[:top_k], "excluded": excluded}
