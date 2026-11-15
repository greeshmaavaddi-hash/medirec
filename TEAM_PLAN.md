# Team Plan: MediRec (3 people, equal vertical slices)

**Idea:** many people self-medicate for common problems and miss allergies, age limits or existing conditions. MediRec suggests OTC medicines for stated symptoms and filters out unsafe ones for that person. Always shown as decision support, not medical advice.

## Who does what
Each person owns one slice end to end: build it, test it, document it, and review one teammate's PR.

| | Person 1: Data + ML | Person 2: Backend + DevOps | Person 3: Frontend + Product |
|---|---|---|---|
| Stack | Python, PostgreSQL | Node/Express, Docker, GitHub Actions | React, Vite |
| Folders | `ml-service/`, `db/` | `backend/`, `docker-compose.yml`, `.github/` | `frontend/`, `README.md` |
| Branch | `feature/ml-data` | `feature/backend-devops` | `feature/frontend-product` |
| Build | Replace sample data with a verified drug list; add more allergy/condition rules; add drug-drug interaction check; unit tests | Input validation, error handling, history endpoint, rate limiting, CI passing, Docker compose runs clean | Form UX, results cards, history page, loading/error states, mobile layout |
| Present | How the ranking and safety filter work | Architecture and the request flow | Live demo and the problem story |

## Agree first (30 min, all three)
- API contract: `POST /api/recommend` with `{symptoms[], age, allergies[], conditions[]}` returns `{recommendations[{id,name,generic,score,matched_symptoms}]}`.
- DB schema in `db/init.sql`.
- Naming, branch rules, and who reviews whom: P1 reviews P2, P2 reviews P3, P3 reviews P1.

## EOD timeline
| Time | Goal |
|---|---|
| Hour 0-0.5 | Kickoff, contract, repo created, everyone cloned |
| Hour 0.5-3 | Each person builds their slice on their own branch, small commits |
| Hour 3-4 | Open PRs, cross-review, merge to `main` |
| Hour 4-5 | Integration: run the full stack, fix bugs together |
| Hour 5-6 | Rehearse demo (5 min, each person speaks ~1.5 min), record a backup screen capture |

## GitHub: step by step
**One person (repo owner), once:**
```bash
cd medirec
git init -b main
git add -A && git commit -m "Initial scaffold"
# create an empty repo named medirec on github.com (no README), then:
git remote add origin https://github.com/<owner>/medirec.git
git push -u origin main
```
On GitHub: Settings > Collaborators > add the other two. Settings > Branches > protect `main` (require a pull request before merging).

**Teammates, once:** `git clone https://github.com/<owner>/medirec.git`

**Everyone, daily flow:**
```bash
git checkout main && git pull
git checkout -b feature/<your-branch>
# work, then:
git add -A && git commit -m "Short clear message"
git push -u origin feature/<your-branch>
# open a Pull Request on GitHub, ask your reviewer, merge when approved
git checkout main && git pull
```
Commit often with clear messages; the commit history is part of what you show.

## Demo script (5 min)
1. Problem and idea (Person 3).
2. Architecture: React -> Node -> Python -> Postgres (Person 2).
3. Live: `fever, headache`, age 30 -> Crocin ranks first. Add paracetamol allergy -> it disappears. Age 5 -> ibuprofen excluded (Person 3 drives, Person 1 explains why).
4. Show GitHub: branches, PRs, green CI check (Person 2).
5. Next steps: accounts, verified drug data, interactions, deployment.
