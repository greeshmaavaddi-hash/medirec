import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import recommendRouter from "./routes/recommend.js";   // Person 2

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api", recommendRouter);                       // Person 2

// Person 3 will move these into their own route files
app.get("/api/medicines", async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM medicines ORDER BY name");
  res.json(rows);
});
app.get("/api/history", async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM recommendation_log ORDER BY id DESC LIMIT 20");
  res.json(rows);
});

app.listen(process.env.PORT || 4000, () => console.log("API on :" + (process.env.PORT || 4000)));
