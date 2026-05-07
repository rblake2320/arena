import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";

type Candidate = {
  id: string;
  name: string;
  office: string;
  race_id: string;
};

type RaceData = {
  id: string;
  name: string;
  candidates: Candidate[];
  ads: {
    id: string;
    disclaimer_text: string;
    budget: number;
    status: string;
  }[];
  challenges: { id: string; challenge_text: string; status: string }[];
};

export function CandidateDashboard() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [race, setRace] = useState<RaceData | null>(null);

  useEffect(() => {
    fetch("/api/candidates")
      .then((res) => res.json())
      .then((candidates: Candidate[]) => {
        const selected = candidates.find((entry) => entry.id === id) ?? null;
        setCandidate(selected);

        if (selected) {
          fetch(`/api/races/${selected.race_id}`)
            .then((res) => res.json())
            .then((raceData: RaceData) => setRace(raceData));
        }
      });
  }, [id]);

  const candidateStats = useMemo(() => {
    if (!candidate || !race) {
      return { ads: 0, openChallenges: 0 };
    }

    return {
      ads: race.ads.length,
      openChallenges: race.challenges.filter((entry) => entry.status === "open")
        .length,
    };
  }, [candidate, race]);

  if (!candidate || !race) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        Loading dashboard…
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">{candidate.name}</h1>
        <p className="text-zinc-400">
          {candidate.office} candidate in{" "}
          <span className="text-zinc-200">{race.name}</span>
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard label="Ads running" value={candidateStats.ads.toString()} />
        <StatCard
          label="Open challenges"
          value={candidateStats.openChallenges.toString()}
        />
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <h2 className="mb-3 text-lg font-semibold">Recent challenges</h2>
        <ul className="space-y-2 text-sm text-zinc-300">
          {race.challenges.map((challenge) => (
            <li key={challenge.id} className="rounded-md bg-zinc-950 p-3">
              <p>{challenge.challenge_text}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-indigo-300">
                {challenge.status}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </article>
  );
}
