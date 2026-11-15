import { Router } from "express";
import { pool } from "../db.js";

const router = Router();
const ML_URL = process.env.ML_URL || "http://localhost:8000";
const clean = (xs) =>
  Array.isArray(xs) ? xs.map((s) => String(s).trim().toLowerCase()).filter(Boolean) : [];

// POST /api/recommend
router.post("/recommend", async (req, res) => {
  try {
    const symptoms = clean(req.body.symptoms);
    if (!symptoms.length) return res.status(400).json({ error: "Provide at least one symptom" });

    // 1) Start from the logged-in user's saved profile (Person 1's `profiles` table)
    const userId = req.user?.id ?? null;
    let saved = {};
    if (userId) {
      try {
        const { rows } = await pool.query(
          "SELECT age, allergies, conditions FROM profiles WHERE user_id = $1", [userId]);
        saved = rows[0] || {};
      } catch (e) {
        console.warn("profiles table not available yet:", e.message);
      }
    }

    // 2) Anything typed on the form for this check overrides the saved profile
    const bodyAge = req.body.age === "" || req.body.age == null ? null : Number(req.body.age);
    const age = bodyAge ?? saved.age ?? null;
    if (age !== null && (!Number.isFinite(age) || age < 0 || age > 120))
      return res.status(400).json({ error: "Age must be between 0 and 120" });

    const pick = (fromForm, fromProfile) => {
      const f = clean(fromForm);
      return f.length ? f : clean(fromProfile);
    };
    const profile = {
      age,
      allergies: pick(req.body.allergies, saved.allergies),
      conditions: pick(req.body.conditions, saved.conditions),
    };
    const { rows: medicines } = await pool.query("SELECT * FROM medicines");

    const ml = await fetch(`${ML_URL}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms, profile, medicines }),
    });
    if (!ml.ok) throw new Error(`ML service error ${ml.status}`);
    const result = await ml.json();

    await pool.query(
      "INSERT INTO recommendation_log (user_id, request, result) VALUES ($1, $2, $3)",
      [userId, { symptoms, profile }, result]
    );
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not generate recommendations" });
  }
});

export default router;
