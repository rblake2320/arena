import { BrowserRouter, Link, Route, Routes } from "react-router";
import { Home } from "./Home";
import { CandidateDashboard } from "./CandidateDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <header className="border-b border-zinc-800 bg-zinc-900/60">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link
              to="/"
              className="text-sm font-semibold tracking-wide text-indigo-300"
            >
              Verified Voter Arena
            </Link>
            <Link
              to="/candidate/cand-1"
              className="text-sm text-zinc-300 hover:text-white"
            >
              Candidate Dashboard
            </Link>
          </nav>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/candidate/:id" element={<CandidateDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
