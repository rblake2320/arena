import { Router } from "express";
import { db } from "./db.js";

export const apiRouter = Router();

apiRouter.get("/races", (_req, res) => {
  const races = db
    .prepare(
      `SELECT r.*, COUNT(c.id) as candidate_count
       FROM races r
       LEFT JOIN candidates c ON r.id = c.race_id
       GROUP BY r.id
       ORDER BY r.name`,
    )
    .all();

  res.json(races);
});

apiRouter.get("/races/:id", (req, res) => {
  const race = db
    .prepare("SELECT * FROM races WHERE id = ?")
    .get(req.params.id);
  if (!race) {
    return res.status(404).json({ error: "Race not found" });
  }

  const candidates = db
    .prepare("SELECT * FROM candidates WHERE race_id = ? ORDER BY name")
    .all(req.params.id);
  const ads = db
    .prepare(
      "SELECT * FROM ad_flights WHERE race_id = ? ORDER BY created_at DESC",
    )
    .all(req.params.id);
  const challenges = db
    .prepare(
      "SELECT * FROM challenges WHERE race_id = ? ORDER BY created_at DESC",
    )
    .all(req.params.id);

  return res.json({ ...race, candidates, ads, challenges });
});

apiRouter.get("/candidates", (_req, res) => {
  const candidates = db
    .prepare(
      `SELECT c.*, r.name as race_name, r.state as race_state
       FROM candidates c
       JOIN races r ON c.race_id = r.id
       ORDER BY c.name`,
    )
    .all();

  res.json(candidates);
});
