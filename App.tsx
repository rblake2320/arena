import { Router } from "express";
import { db } from "./db.js";

export const apiRouter = Router();

apiRouter.get("/races", (req, res) => {
  const races = db.prepare(`
    SELECT r.*, COUNT(c.id) as candidate_count 
    FROM races r 
    LEFT JOIN candidates c ON r.id = c.race_id 
    GROUP BY r.id
  `).all();
  res.json(races);
});

apiRouter.get("/candidates", (req, res) => {
  const candidates = db.prepare(`
    SELECT c.*, r.name as race_name, r.state as race_state 
    FROM candidates c
    JOIN races r ON c.race_id = r.id
  `).all();
  res.json(candidates);
});

apiRouter.post("/races", (req, res) => {
  const { name, office, district, state } = req.body;
  const id = `race-${Date.now()}`;
  
  try {
    db.prepare(`
      INSERT INTO races (id, name, office, district, state, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, name, office, district || "", state, "active");
    
    const newRace = db.prepare("SELECT * FROM races WHERE id = ?").get(id);
    res.json(newRace);
  } catch (e) {
    res.status(500).json({ error: "Failed to create race" });
  }
});

apiRouter.post("/ads", (req, res) => {
  const { race_id, candidate_id, media_url, disclaimer_text, budget } = req.body;
  const id = `ad-${Date.now()}`;
  
  try {
    db.prepare(`
      INSERT INTO ad_flights (id, race_id, candidate_id, media_url, start_date, end_date, disclaimer_text, budget, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, 
      race_id, 
      candidate_id, 
      media_url, 
      new Date().toISOString(), 
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), 
      disclaimer_text, 
      budget, 
      "active"
    );
    res.json({ success: true, id });
  } catch (e) {
    res.status(500).json({ error: "Failed to create ad" });
  }
});

apiRouter.get("/races/:id", (req, res) => {
  const race = db.prepare("SELECT * FROM races WHERE id = ?").get(req.params.id);
  if (!race) return res.status(404).json({ error: "Race not found" });
  
  const candidates = db.prepare("SELECT * FROM candidates WHERE race_id = ?").all(req.params.id);
  const ads = db.prepare("SELECT * FROM ad_flights WHERE race_id = ?").all(req.params.id);
  const rebuttals = db.prepare("SELECT * FROM rebuttal_ads WHERE race_id = ?").all(req.params.id);
  const challenges = db.prepare("SELECT * FROM challenges WHERE race_id = ?").all(req.params.id);
  const challengeResponses = db.prepare(`
    SELECT cr.* FROM challenge_responses cr
    JOIN challenges c ON cr.challenge_id = c.id
    WHERE c.race_id = ?
  `).all(req.params.id);

  res.json({
    ...race,
    candidates,
    ads,
    rebuttals,
    challenges,
    challengeResponses
  });
});

apiRouter.post("/challenges", (req, res) => {
  const { race_id, challenger_candidate_id, target_candidate_id, challenge_text } = req.body;
  const id = `chal-${Date.now()}`;
  
  try {
    db.prepare(`
      INSERT INTO challenges (id, race_id, challenger_candidate_id, target_candidate_id, challenge_text, created_at, expires_at, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, 
      race_id, 
      challenger_candidate_id, 
      target_candidate_id, 
      challenge_text, 
      new Date().toISOString(), 
      new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), 
      "open"
    );
    res.json({ success: true, id });
  } catch (e) {
    res.status(500).json({ error: "Failed to issue challenge" });
  }
});

apiRouter.post("/challenges/:id/respond", (req, res) => {
  const { id } = req.params;
  const { candidate_id, response_text, media_url } = req.body;
  const responseId = `resp-${Date.now()}`;
  
  try {
    db.prepare(`
      INSERT INTO challenge_responses (id, challenge_id, candidate_id, media_url, response_text, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(responseId, id, candidate_id, media_url || "", response_text, new Date().toISOString());
    
    db.prepare(`
      UPDATE challenges SET status = 'responded' WHERE id = ?
    `).run(id);
    
    res.json({ success: true, id: responseId });
  } catch (e) {
    res.status(500).json({ error: "Failed to respond to challenge" });
  }
});

apiRouter.post("/reactions", (req, res) => {
  const { user_id, content_type, content_id, reaction_type } = req.body;
  const id = `react-${Date.now()}`;
  
  try {
    db.prepare(`
      INSERT INTO reactions (id, user_id, content_type, content_id, reaction_type, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, user_id || "anonymous", content_type, content_id, reaction_type, new Date().toISOString());
    res.json({ success: true, id });
  } catch (e) {
    res.status(500).json({ error: "Failed to save reaction" });
  }
});

apiRouter.get("/reactions/:contentType/:contentId", (req, res) => {
  const { contentType, contentId } = req.params;
  const reactions = db.prepare(`
    SELECT reaction_type, count(*) as count 
    FROM reactions 
    WHERE content_type = ? AND content_id = ?
    GROUP BY reaction_type
  `).all(contentType, contentId);
  
  res.json(reactions);
});
