import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db.js";
import { signToken } from "../auth.js";

const router = Router();
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const getEmail = (req) => String(req.body.email || "").trim().toLowerCase();

// POST /api/auth/register
router.post("/auth/register", async (req, res) => {
  try {
    const email = getEmail(req);
    const password = String(req.body.password || "");
    if (!emailOk(email)) return res.status(400).json({ error: "Enter a valid email" });
    if (password.length < 8)
      return res.status(400).json({ error: "Password must be at least 8 characters" });

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, hash]
    );
    const user = rows[0];
    await pool.query("INSERT INTO profiles (user_id) VALUES ($1)", [user.id]);
    res.status(201).json({ token: signToken(user), user });
  } catch (e) {
    if (e.code === "23505") return res.status(409).json({ error: "That email is already registered" });
    console.error(e);
    res.status(500).json({ error: "Could not register" });
  }
});

// POST /api/auth/login
router.post("/auth/login", async (req, res) => {
  try {
    const email = getEmail(req);
    const password = String(req.body.password || "");
    const { rows } = await pool.query(
      "SELECT id, email, password_hash FROM users WHERE email = $1", [email]);
    const row = rows[0];
    const ok = row && (await bcrypt.compare(password, row.password_hash));
    if (!ok) return res.status(401).json({ error: "Wrong email or password" });
    const user = { id: row.id, email: row.email };
    res.json({ token: signToken(user), user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not log in" });
  }
});

export default router;
