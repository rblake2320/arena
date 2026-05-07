import { useEffect, useState } from "react";
import { Link } from "react-router";

type Race = {
  id: string;
  name: string;
  office: string;
  district: string;
  state: string;
  status: string;
  candidate_count: number;
};

export function Home() {
  const [races, setRaces] = useState<Race[]>([]);

  useEffect(() => {
    fetch("/api/races")
      .then((res) => res.json())
      .then((data: Race[]) => setRaces(data));
  }, []);

  return (
    <section>
      <h1 className="mb-2 text-3xl font-bold">Live Races</h1>
      <p className="mb-6 text-zinc-400">
        Compare candidates, ad activity, and active challenges.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {races.map((race) => (
          <article
            key={race.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-indigo-300">
              {race.status}
            </p>
            <h2 className="mt-2 text-xl font-semibold">{race.name}</h2>
            <p className="mt-1 text-sm text-zinc-400">
              {race.office} • {race.state}
              {race.district ? `- District ${race.district}` : ""}
            </p>
            <p className="mt-3 text-sm text-zinc-300">
              {race.candidate_count} candidates participating
            </p>
            <Link
              className="mt-4 inline-block text-sm text-indigo-300 hover:text-indigo-200"
              to={`/candidate/cand-1`}
            >
              Open sample dashboard →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
