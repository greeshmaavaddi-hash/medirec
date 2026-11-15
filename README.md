# MediRec: Personalised Medicine Recommendation System

| Layer | Tech | Folder |
|---|---|---|
| Frontend | React + Vite | `frontend/` |
| Backend API | Node + Express | `backend/` |
| Recommendation engine | Python + FastAPI | `ml-service/` |
| Database | PostgreSQL | `db/` |
| Version control | Git (feature branches + PRs) | root |

Flow: React form -> Node `/api/recommend` -> reads medicines from Postgres -> Python `/recommend` (safety filter + ranking) -> result logged in Postgres -> shown in React.

## Run it
```bash
# Option A: everything but the UI in Docker
docker compose up --build
cd frontend && npm install && npm run dev      # http://localhost:5173

# Option B: manually
# 1) Postgres running, then: psql -f db/init.sql
# 2) cd ml-service && pip install -r requirements.txt && uvicorn app:app --port 8000
# 3) cd backend && npm install && cp .env.example .env && npm start
# 4) cd frontend && npm install && npm run dev
```
Tests: `cd ml-service && pytest`

## Module split (one owner per module, one branch each)
| Module | Branch | Today's task |
|---|---|---|
| Frontend | `feature/frontend` | Form, results cards, loading/error states |
| Backend | `feature/backend` | API routes, validation, logging |
| ML service | `feature/ml` | Scoring, allergy/age/condition filters, tests |
| Database | `feature/db` | Schema, seed data, history queries |
| DevOps/Docs | `feature/devops` | Docker, README, demo script |

Git flow: `main` stays demo-ready. Branch from `main`, open a PR, merge after one review.

## EOD plan
1. Morning: agree on the API contract (`POST /api/recommend`) and schema; everyone branches.
2. Midday: each module works alone (ML has tests, backend can be tested with curl).
3. Afternoon: integrate on `main`, run end to end, fix bugs.
4. Last hour: rehearse the demo, record a screen capture as a backup.

## Demo script (5 min)
1. Show architecture table above.
2. Enter `fever, headache`, age 30: Crocin ranks first.
3. Add allergy `paracetamol`: Crocin disappears (personalisation).
4. Set age 5 with `fever`: Brufen is excluded (age rule).
5. Show git log/branches and the `recommendation_log` table.

## Next steps (after demo)
User accounts and auth, real drug database (e.g. verified interaction data), drug-drug interaction checks, ML ranking trained on real data, deployment.

> Sample data only. This is a decision-support demo, not medical advice.
