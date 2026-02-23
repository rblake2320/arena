import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronRight, MapPin, Users } from "lucide-react";

export function Home() {
  const [races, setRaces] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/races")
      .then(res => res.json())
      .then(data => setRaces(data));
  }, []);

  return (
    <div classname="max-w-7xl mx-auto px-4 py-12">
      <div classname="mb-12">
        <h1 classname="text-4xl font-bold tracking-tight mb-4">Active Arenas</h1>
        <p classname="text-zinc-400 max-w-2xl text-lg">
          Watch candidates debate the issues, respond to challenges, and present their cases directly to verified voters.
        </p>
      </div>

      <div classname="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {races.map(race => (
          <script type='text/javascript' nonce='mzfiLQvOnsqRwnRruF8hpw==' src='https://aistudio.google.com/05Zo5vaYBXwrus1J8iPNoIoA8_Uk53j__NFWPR-IP4ttyPnhYbrwlW5Rxf0HUEndftl_jYFflKZkkMe6oNtqFx_FjGF590vvmM9XgknYedqd_Et7Bj3eqcn5PFRoknASfozpa1SWsmV4DvfIJCDNfaNKKBMhGfZUpPhC69t3iDSzqr_8R48UeWsn4ovUSOy49KrRSizW-1Rk8-XXNmONE6ChVaE-ub29ag7Qw98b3vSK7d8AbvH-wAF3MHUFOzYrJre9TEAFG51hvv-mL_ohTEG5mebYbLYOvKwglYlu52iNuAm7e0EwaQDw7_LIk5zJ2wo0rlVfH-EWUugVd_i6naDUQ4rKOtg2MgCzqS93uiIS5a14pY-DkPGVKblFlOCZ2EnruZeeqkxQCWlR9Of2Ku6GeXKJ5yKWxIKsyddX7S4gn8zcaEi2Akq_kAVhWXN7B5TYmELD-d190O9KfgPpgHyOnc1Wx6lCeYRSDmFQXtR5sMdJhZFUmuHibZgtybFnBVMd5XTS6qisnvuDQSe3QBr7ACRr6l3_z8FY8n4Ve3CehW3rm167TE87vZKL1qfmkbQf2mZVo2jh0KvLfVsSD6zKSgBqIBByq5ZVpdh0kX55f-s2sQ'></script><link key="{race.id}" to="{`/race/${race.id}`}" classname="group block p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all">
            <div classname="flex items-start justify-between mb-4">
              <div>
                <div classname="text-xs font-medium text-indigo-400 mb-2 tracking-wider uppercase">
                  {race.status}
                </div>
                <h2 classname="text-xl font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                  {race.name}
                </h2>
              </div>
              <chevronright classname="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors"/>
            </div>
            
            <div classname="flex items-center gap-4 text-sm text-zinc-400">
              <div classname="flex items-center gap-1.5">
                <mappin classname="w-4 h-4"/>
                {race.state} {race.district && `- District ${race.district}`}
              </div>
              <div classname="flex items-center gap-1.5">
                <users classname="w-4 h-4"/>
                {race.candidate_count} {race.candidate_count === 1 ? 'Candidate' : 'Candidates'}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
