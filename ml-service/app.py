from fastapi import FastAPI
from pydantic import BaseModel
from recommender import recommend
from normalize import normalize_terms

app = FastAPI(title="MediRec ML service")

class Profile(BaseModel):
    age: int | None = None
    allergies: list[str] = []
    conditions: list[str] = []

class Req(BaseModel):
    symptoms: list[str]
    profile: Profile = Profile()
    medicines: list[dict]

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/recommend")
def rec(req: Req):
    return recommend(req.symptoms, req.profile.model_dump(), req.medicines)

class NormReq(BaseModel):
    terms: list[str]

@app.post("/normalize")
def norm(req: NormReq):
    return {"terms": normalize_terms(req.terms)}
