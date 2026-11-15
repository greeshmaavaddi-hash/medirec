import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../auth.js";

const router = Router();
const ML_URL = process.env.ML_URL || "http://localhost:8000";
const clean = (xs) =>
  Array.isArray(xs) ? xs.map((s) => String(s).trim().toLowerCase()).filter(Boolean) : [];

// Ask the Python engine to turn brands/typos into standard names (acetaminophen -> paracetamol).
// If the engine is not running, just keep what the user typed.
async function normalizeAllergies(list) {
  if (!list.length) return list;
  try {
    const r = await fetch(`${ML_URL}/normalize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ terms: list }),
      signal: AbortSignal.timeout(2000),
    });
    if (!r.ok) return list;
    return (await r.json()).terms;
  } catch {
    return list;
  }
}

// GET /api/profile
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT age, allergies, conditions FROM profiles WHERE user_id = $1", [req.user.id]);
    res.json(rows[0] || { age: null, allergies: [], conditions: [] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not load profile" });
  }
});

// PUT /api/profile
router.put("/profile", requireAuth, async (req, res) => {
  try {
    const age = req.body.age === "" || req.body.age == null ? null : Number(req.body.age);
    if (age !== null && (!Number.isInteger(age) || age < 0 || age > 120))
      return res.status(400).json({ error: "Age must be a whole number between 0 and 120" });

    const allergies = await normalizeAllergies(clean(req.body.allergies));
    const conditions = clean(req.body.conditions);

    const { rows } = await pool.query(
      `INSERT INTO profiles (user_id, age, allergies, conditions)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE
         SET age = $2, allergies = $3, conditions = $4, updated_at = now()
       RETURNING age, allergies, conditions`,
      [req.user.id, age, allergies, conditions]
    );
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not save profile" });
  }
});

export default router;
