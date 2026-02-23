import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "arena.db");
export const db = new Database(dbPath);

export function setupDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      role TEXT, -- 'voter', 'candidate_staff', 'admin'
      name TEXT
    );

    CREATE TABLE IF NOT EXISTS races (
      id TEXT PRIMARY KEY,
      name TEXT,
      office TEXT,
      district TEXT,
      state TEXT,
      status TEXT
    );

    CREATE TABLE IF NOT EXISTS candidates (
      id TEXT PRIMARY KEY,
      name TEXT,
      party TEXT,
      office TEXT,
      race_id TEXT,
      biography TEXT,
      issue_positions TEXT,
      FOREIGN KEY(race_id) REFERENCES races(id)
    );

    CREATE TABLE IF NOT EXISTS ad_flights (
      id TEXT PRIMARY KEY,
      race_id TEXT,
      candidate_id TEXT,
      media_url TEXT,
      start_date TEXT,
      end_date TEXT,
      disclaimer_text TEXT,
      budget REAL,
      status TEXT,
      FOREIGN KEY(race_id) REFERENCES races(id),
      FOREIGN KEY(candidate_id) REFERENCES candidates(id)
    );

    CREATE TABLE IF NOT EXISTS rebuttal_ads (
      id TEXT PRIMARY KEY,
      parent_ad_id TEXT,
      race_id TEXT,
      candidate_id TEXT,
      media_url TEXT,
      response_text TEXT,
      status TEXT,
      FOREIGN KEY(parent_ad_id) REFERENCES ad_flights(id),
      FOREIGN KEY(race_id) REFERENCES races(id),
      FOREIGN KEY(candidate_id) REFERENCES candidates(id)
    );

    CREATE TABLE IF NOT EXISTS challenges (
      id TEXT PRIMARY KEY,
      race_id TEXT,
      challenger_candidate_id TEXT,
      target_candidate_id TEXT,
      challenge_text TEXT,
      created_at TEXT,
      expires_at TEXT,
      status TEXT,
      FOREIGN KEY(race_id) REFERENCES races(id),
      FOREIGN KEY(challenger_candidate_id) REFERENCES candidates(id),
      FOREIGN KEY(target_candidate_id) REFERENCES candidates(id)
    );

    CREATE TABLE IF NOT EXISTS challenge_responses (
      id TEXT PRIMARY KEY,
      challenge_id TEXT,
      candidate_id TEXT,
      media_url TEXT,
      response_text TEXT,
      created_at TEXT,
      FOREIGN KEY(challenge_id) REFERENCES challenges(id),
      FOREIGN KEY(candidate_id) REFERENCES candidates(id)
    );

    CREATE TABLE IF NOT EXISTS reactions (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      content_type TEXT, -- 'ad', 'rebuttal', 'challenge', 'response'
      content_id TEXT,
      reaction_type TEXT,
      created_at TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // Seed initial data if empty
  const raceCount = db.prepare("SELECT count(*) as count FROM races").get() as { count: number };
  if (raceCount.count === 0) {
    seedData();
  }
}

function seedData() {
  const insertRace = db.prepare(`
    INSERT INTO races (id, name, office, district, state, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertRace.run("race-1", "2026 Alabama Senate Race", "Senate", "", "AL", "active");
  insertRace.run("race-2", "2026 Texas Governor Race", "Governor", "", "TX", "active");

  const insertCandidate = db.prepare(`
    INSERT INTO candidates (id, name, party, office, race_id, biography, issue_positions)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  // Race 1 Candidates
  insertCandidate.run(
    "cand-1",
    "Jane Doe",
    "Democrat",
    "Senate",
    "race-1",
    "Jane is a lifelong Alabamian dedicated to improving education and healthcare.",
    JSON.stringify(["Education", "Healthcare"])
  );
  insertCandidate.run(
    "cand-2",
    "John Smith",
    "Republican",
    "Senate",
    "race-1",
    "John is a business owner focused on economic growth and reducing regulations.",
    JSON.stringify(["Economy", "Deregulation"])
  );

  // Race 2 Candidates
  insertCandidate.run(
    "cand-3",
    "Maria Garcia",
    "Democrat",
    "Governor",
    "race-2",
    "Maria is a former teacher and state representative fighting for working families.",
    JSON.stringify(["Jobs", "Education"])
  );
  insertCandidate.run(
    "cand-4",
    "Robert Johnson",
    "Republican",
    "Governor",
    "race-2",
    "Robert is a rancher and entrepreneur who wants to lower taxes and secure the border.",
    JSON.stringify(["Taxes", "Security"])
  );

  const insertAd = db.prepare(`
    INSERT INTO ad_flights (id, race_id, candidate_id, media_url, start_date, end_date, disclaimer_text, budget, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  // Race 1 Ad
  insertAd.run(
    "ad-1",
    "race-1",
    "cand-1",
    "https://picsum.photos/seed/ad1/800/450",
    new Date().toISOString(),
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    "Paid for by Jane Doe for Senate",
    5000,
    "active"
  );

  // Race 2 Ad
  insertAd.run(
    "ad-2",
    "race-2",
    "cand-4",
    "https://picsum.photos/seed/ad2/800/450",
    new Date().toISOString(),
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    "Paid for by Robert Johnson for Texas",
    10000,
    "active"
  );

  const insertRebuttal = db.prepare(`
    INSERT INTO rebuttal_ads (id, parent_ad_id, race_id, candidate_id, media_url, response_text, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  // Rebuttal to Race 1 Ad
  insertRebuttal.run(
    "reb-1",
    "ad-1",
    "race-1",
    "cand-2",
    "https://picsum.photos/seed/reb1/800/450",
    "My opponent's healthcare plan will bankrupt our state. Here are the facts.",
    "active"
  );

  const insertChallenge = db.prepare(`
    INSERT INTO challenges (id, race_id, challenger_candidate_id, target_candidate_id, challenge_text, created_at, expires_at, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  // Race 1 Challenge
  insertChallenge.run(
    "chal-1",
    "race-1",
    "cand-2",
    "cand-1",
    "I challenge my opponent to debate the economic impact of their proposed healthcare policies.",
    new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    "responded"
  );

  // Race 1 Challenge 2 (Open)
  insertChallenge.run(
    "chal-3",
    "race-1",
    "cand-1",
    "cand-2",
    "I challenge my opponent to explain how their deregulation plan won't harm our local environment.",
    new Date().toISOString(),
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    "open"
  );

  // Race 2 Challenge
  insertChallenge.run(
    "chal-2",
    "race-2",
    "cand-3",
    "cand-4",
    "Will you commit to fully funding our public schools without raising property taxes?",
    new Date().toISOString(),
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    "open"
  );

  const insertResponse = db.prepare(`
    INSERT INTO challenge_responses (id, challenge_id, candidate_id, media_url, response_text, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Response to Race 1 Challenge
  insertResponse.run(
    "resp-1",
    "chal-1",
    "cand-1",
    "https://picsum.photos/seed/resp1/800/450",
    "I'm happy to debate. My plan saves families an average of $2,000 a year.",
    new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  );
}
