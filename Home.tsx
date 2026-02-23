import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } from "react-router";
import React, { useEffect, useState, createContext, useContext } from "react";
import { Home } from "./pages/Home";
import { Race } from "./pages/Race";
import { CandidateDashboard } from "./pages/CandidateDashboard";

interface CandidateContextType {
  candidates: any[];
  activeCandidateId: string | null;
  setActiveCandidateId: (id: string) => void;
}

export const CandidateContext = createContext<candidatecontexttype>({
  candidates: [],
  activeCandidateId: null,
  setActiveCandidateId: () => {}
});

function Navigation() {
  const { candidates, activeCandidateId, setActiveCandidateId } = useContext(CandidateContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCandidateChange = (e: React.ChangeEvent<htmlselectelement>) => {
    const id = e.target.value;
    setActiveCandidateId(id);
    if (location.pathname.startsWith("/candidate")) {
      navigate(`/candidate/${id}`);
    }
  };

  return (
    <header classname="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
      <div classname="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <link to="/" classname="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span classname="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-xs">A</span>
          Arena
        </Link>
        <nav classname="flex items-center gap-6 text-sm font-medium">
          <link to="/" classname="text-zinc-400 hover:text-white transition-colors">Races</Link>
          {activeCandidateId && (
            <script type='text/javascript' nonce='Zu1DbYLcQ0HWieAD95YYFA==' src='https://aistudio.google.com/87_HbxEMLvc-usZIWpjIm20KG_lY-5fBcHHD52_E5bqlAedDDvOJ3MaS8PhenaxqRjHneWsEFEapDAZHKmhDYcDRnSak8yUkSRboj7x3aURiPIK3lBG_UfdbniAp1XCEfiCNcYAG1YkGUJup4rDitFo6hThE9uhLfr6L6SvW3kTYAU4E_RcC6F316ji50oNklRQf1UaWH-w0Tmni7FLNUDlZ68sds9o2ybjlb_pT1KHXMM-FKc1kFYFICqiW7fmvvEK_fdyHH_YMZVEqDzl5lvCboPMr3SIh5sXe0YK7-baY06jNcG2S4gte_voUArcfKhMMeXnqRNRqVqDbyYk7QYuP_K4S1bMc7gE79VFbM8Esc6xNgKZDHbIfz2of-1e2orJYOEhwub1UvMv1SvPRjAp5m2Sn1y-oQ3Yn_J7YurSkuwQU6UpJ-p7bZ78Lko7chG1GBEFtG2YN_clEA-OY5SMYnWAt581V1t5JLb-ynugCFQcxC-c8_OQRrJ9jsZUWUODsRV7KltPLImr6z5F7ebmjhb4x0QDvDgNItPn6PKhNSs-eoAENTJdcNBkTZWCyQgHoKwd6JcYMMd_KkKjHsRuDxEj9P9CZyriU21_70Ppy_vPpGA'></script><link to="{`/candidate/${activeCandidateId}`}" classname="text-zinc-400 hover:text-white transition-colors">
              Candidate Portal
            </Link>
          )}
          <div classname="h-4 w-px bg-zinc-800"></div>
          <div classname="flex items-center gap-2">
            <span classname="text-xs text-zinc-500 uppercase tracking-wider">Test As:</span>
            <select classname="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-indigo-500" value="{activeCandidateId" ||="" ""}="" onchange="{handleCandidateChange}">
              {candidates.map(c => (
                <option key="{c.id}" value="{c.id}">{c.name} ({c.race_state})</option>
              ))}
            </select>
          </div>
        </nav>
      </div>
    </header>
  );
}

function AppContent() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [activeCandidateId, setActiveCandidateId] = useState<string |="" null="">(localStorage.getItem("activeCandidateId"));
  const location = useLocation();

  useEffect(() => {
    fetch("/api/candidates")
      .then(res => res.json())
      .then(data => {
        setCandidates(data);
        if (!activeCandidateId && data.length > 0) {
          setActiveCandidateId(data[0].id);
        }
      });
  }, []);

  useEffect(() => {
    if (activeCandidateId) {
      localStorage.setItem("activeCandidateId", activeCandidateId);
    }
  }, [activeCandidateId]);

  useEffect(() => {
    const match = location.pathname.match(/\/candidate\/(cand-\d+)/);
    if (match && match[1] !== activeCandidateId) {
      setActiveCandidateId(match[1]);
    }
  }, [location.pathname]);

  return (
    <candidatecontext.provider value="{{" candidates,="" activecandidateid,="" setactivecandidateid="" }}="">
      <div classname="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500/30">
        <navigation/>
        <main>
          <routes>
            <route path="/" element="{&lt;Home"/>} />
            <route path="/race/:id" element="{&lt;Race"/>} />
            <route path="/candidate/:id" element="{&lt;CandidateDashboard"/>} />
            <route path="/candidate" element="{&lt;Navigate" to="/" replace=""/>} />
          </Routes>
        </main>
      </div>
    </CandidateContext.Provider>
  );
}

export default function App() {
  return (
    <browserrouter>
      <appcontent/>
    </BrowserRouter>
  );
}
