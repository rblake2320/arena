import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "arena.db");
export const db = new Database(dbPath);

export function setupDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS races (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      office TEXT NOT NULL,
      district TEXT,
      state TEXT NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS candidates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      party TEXT,
      office TEXT NOT NULL,
      race_id TEXT NOT NULL,
      biography TEXT,
      FOREIGN KEY(race_id) REFERENCES races(id)
    );

    CREATE TABLE IF NOT EXISTS ad_flights (
      id TEXT PRIMARY KEY,
      race_id TEXT NOT NULL,
      candidate_id TEXT NOT NULL,
      media_url TEXT,
      disclaimer_text TEXT,
      budget REAL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(race_id) REFERENCES races(id),
      FOREIGN KEY(candidate_id) REFERENCES candidates(id)
    );

    CREATE TABLE IF NOT EXISTS challenges (
      id TEXT PRIMARY KEY,
      race_id TEXT NOT NULL,
      challenger_candidate_id TEXT NOT NULL,
      target_candidate_id TEXT NOT NULL,
      challenge_text TEXT NOT NULL,
      created_at TEXT NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY(race_id) REFERENCES races(id)
    );
  `);

  const raceCount = db.prepare("SELECT COUNT(*) AS count FROM races").get() as {
    count: number;
  };

  if (raceCount.count > 0) {
    return;
  }

  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO races (id, name, office, district, state, status) VALUES (?, ?, ?, ?, ?, ?)",
  ).run("race-1", "Texas Senate Showdown", "Senate", "", "TX", "active");

  const insertCandidate = db.prepare(
    "INSERT INTO candidates (id, name, party, office, race_id, biography) VALUES (?, ?, ?, ?, ?, ?)",
  );

  insertCandidate.run(
    "cand-1",
    "Sarah Mitchell",
    "Independent",
    "Senate",
    "race-1",
    "Focused on healthcare affordability and infrastructure modernization.",
  );
  insertCandidate.run(
    "cand-2",
    "Robert Johnson",
    "Libertarian",
    "Senate",
    "race-1",
    "Campaigning on fiscal restraint, tax reform, and local control.",
  );

  db.prepare(
    "INSERT INTO ad_flights (id, race_id, candidate_id, media_url, disclaimer_text, budget, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  ).run(
    "ad-1",
    "race-1",
    "cand-1",
    "https://picsum.photos/seed/ad1/800/450",
    "Paid for by Sarah Mitchell for Senate",
    2500,
    "active",
    now,
  );

  db.prepare(
    "INSERT INTO challenges (id, race_id, challenger_candidate_id, target_candidate_id, challenge_text, created_at, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
  ).run(
    "chal-1",
    "race-1",
    "cand-2",
    "cand-1",
    "Will you commit to publishing a fully itemized healthcare funding plan?",
    now,
    "open",
  );
}
