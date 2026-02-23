import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import { Shield, AlertCircle, ThumbsUp, ThumbsDown, MessageSquare, Play, Plus, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CandidateContext } from "../App";

export function Race() {
  const { id } = useParams();
  const [raceData, setRaceData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"ads" | "challenges">("ads");
  const { activeCandidateId } = useContext(CandidateContext);
  const [isIssueChallengeModalOpen, setIsIssueChallengeModalOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/races/${id}`)
      .then(res => res.json())
      .then(data => setRaceData(data));
  }, [id]);

  if (!raceData) return <div classname="p-12 text-center text-zinc-500">Loading arena...</div>;

  const isCandidateInRace = activeCandidateId && raceData.candidates.some((c: any) => c.id === activeCandidateId);

  return (
    <div classname="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div classname="mb-8">
        <div classname="flex items-center gap-3 mb-4">
          <span classname="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium uppercase tracking-wider">
            {raceData.state} {raceData.office}
          </span>
          <span classname="flex items-center gap-1.5 text-xs text-zinc-400">
            <shield classname="w-3.5 h-3.5"/> Verified Voters Only
          </span>
        </div>
        <h1 classname="text-4xl font-bold tracking-tight mb-6">{raceData.name}</h1>
        
        {/* Candidates Overview */}
        <div classname="flex gap-4 overflow-x-auto pb-4">
          {raceData.candidates.map((c: any) => (
            <div key="{c.id}" classname="flex-shrink-0 w-64 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
              <div classname="flex items-center gap-3 mb-3">
                <div classname="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <div classname="font-medium text-white">{c.name}</div>
                  <div classname="text-xs text-zinc-400">{c.party}</div>
                </div>
              </div>
              <div classname="text-xs text-zinc-500 line-clamp-2">{c.biography}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div classname="flex gap-6 border-b border-zinc-800 mb-8">
        <button onclick="{()" ==""> setActiveTab("ads")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "ads" ? "border-indigo-500 text-white" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}
        >
          Ads & Rebuttals
        </button>
        <button onclick="{()" ==""> setActiveTab("challenges")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "challenges" ? "border-indigo-500 text-white" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}
        >
          Challenges
        </button>
      </div>

      {/* Content */}
      {activeTab === "ads" && (
        <div classname="space-y-8">
          {raceData.ads.length === 0 ? (
            <div classname="p-12 text-center border border-zinc-800 rounded-2xl bg-zinc-900/30">
              <div classname="text-zinc-400 mb-2">No ads yet</div>
              <div classname="text-sm text-zinc-500">Be the first to run an ad in this race.</div>
            </div>
          ) : (
            raceData.ads.map((ad: any) => {
              const candidate = raceData.candidates.find((c: any) => c.id === ad.candidate_id);
            return (
              <div key="{ad.id}" classname="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                <div classname="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
                  <div classname="flex items-center gap-3">
                    <div classname="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
                      {candidate?.name.charAt(0)}
                    </div>
                    <div>
                      <div classname="text-sm font-medium text-white">{candidate?.name}</div>
                      <div classname="text-xs text-zinc-500">Sponsored Ad</div>
                    </div>
                  </div>
                  <div classname="text-xs text-zinc-500">{formatDistanceToNow(new Date(ad.start_date))} ago</div>
                </div>
                
                <div classname="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
                  {/* Main Ad */}
                  <div classname="p-6">
                    <div classname="aspect-video bg-zinc-950 rounded-lg mb-4 relative group overflow-hidden border border-zinc-800">
                      <img src="{ad.media_url}" alt="Ad thumbnail" classname="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity"/>
                      <div classname="absolute inset-0 flex items-center justify-center">
                        <div classname="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/20 text-white">
                          <play classname="w-5 h-5 ml-1"/>
                        </div>
                      </div>
                    </div>
                    <div classname="text-[10px] text-zinc-500 uppercase tracking-wider mb-4 border border-zinc-800 p-2 rounded bg-zinc-950/50">
                      {ad.disclaimer_text}
                    </div>
                    <div classname="flex gap-4">
                      <reactionbutton type="helpful" icon="{&lt;ThumbsUp" classname="w-4 h-4"/>} count={124} contentId={ad.id} contentType="ad" />
                      <reactionbutton type="misleading" icon="{&lt;ThumbsDown" classname="w-4 h-4"/>} count={12} contentId={ad.id} contentType="ad" />
                    </div>
                  </div>

                  {/* Rebuttal Slot */}
                  {raceData.rebuttals.find((r: any) => r.parent_ad_id === ad.id) ? (
                    (() => {
                      const rebuttal = raceData.rebuttals.find((r: any) => r.parent_ad_id === ad.id);
                      const rebuttalCandidate = raceData.candidates.find((c: any) => c.id === rebuttal.candidate_id);
                      return (
                        <div classname="p-6 bg-zinc-900/30">
                          <div classname="flex items-center gap-3 mb-4">
                            <div classname="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
                              {rebuttalCandidate?.name.charAt(0)}
                            </div>
                            <div>
                              <div classname="text-sm font-medium text-white">{rebuttalCandidate?.name}</div>
                              <div classname="text-xs text-emerald-400">Rebuttal</div>
                            </div>
                          </div>
                          <div classname="aspect-video bg-zinc-950 rounded-lg mb-4 relative group overflow-hidden border border-zinc-800">
                            <img src="{rebuttal.media_url}" alt="Rebuttal thumbnail" classname="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity"/>
                            <div classname="absolute inset-0 flex items-center justify-center">
                              <div classname="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/20 text-white">
                                <play classname="w-5 h-5 ml-1"/>
                              </div>
                            </div>
                          </div>
                          <p classname="text-sm text-zinc-300 mb-4">"{rebuttal.response_text}"</p>
                          <div classname="flex gap-4">
                            <reactionbutton type="helpful" icon="{&lt;ThumbsUp" classname="w-4 h-4"/>} count={89} contentId={rebuttal.id} contentType="rebuttal" />
                            <reactionbutton type="misleading" icon="{&lt;ThumbsDown" classname="w-4 h-4"/>} count={45} contentId={rebuttal.id} contentType="rebuttal" />
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div classname="p-6 bg-zinc-900/30 flex flex-col justify-center items-center text-center min-h-[300px]">
                      <div classname="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4 text-zinc-500">
                        <messagesquare classname="w-5 h-5"/>
                      </div>
                      <h3 classname="text-sm font-medium text-white mb-2">Rebuttal Slot Available</h3>
                      <p classname="text-xs text-zinc-500 max-w-[200px] mb-4">
                        Opposing candidates can purchase this slot to respond directly to this ad.
                      </p>
                      <button classname="text-xs font-medium text-indigo-400 hover:text-indigo-300">
                        Claim Rebuttal Slot
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
          )}
        </div>
      )}

      {activeTab === "challenges" && (
        <div classname="space-y-6">
          {isCandidateInRace && (
            <div classname="flex justify-end mb-4">
              <button onclick="{()" ==""> setIsIssueChallengeModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
              >
                <plus classname="w-4 h-4"/>
                Issue Challenge
              </button>
            </div>
          )}
          {raceData.challenges.length === 0 ? (
            <div classname="p-12 text-center border border-zinc-800 rounded-2xl bg-zinc-900/30">
              <div classname="text-zinc-400 mb-2">No challenges yet</div>
              <div classname="text-sm text-zinc-500">Candidates haven't issued any challenges in this race.</div>
            </div>
          ) : (
            raceData.challenges.map((challenge: any) => {
              const challenger = raceData.candidates.find((c: any) => c.id === challenge.challenger_candidate_id);
            const target = raceData.candidates.find((c: any) => c.id === challenge.target_candidate_id);
            
            return (
              <div key="{challenge.id}" classname="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                <div classname="flex items-center justify-between mb-4">
                  <div classname="flex items-center gap-2 text-sm">
                    <span classname="font-medium text-white">{challenger?.name}</span>
                    <span classname="text-zinc-500">challenged</span>
                    <span classname="font-medium text-white">{target?.name}</span>
                  </div>
                  <span classname="{`px-2" py-1="" rounded="" text-[10px]="" font-medium="" uppercase="" tracking-wider="" ${="" challenge.status="==" 'open'="" ?="" 'bg-amber-500="" 10="" text-amber-400="" border="" border-amber-500="" 20'="" :="" 'bg-zinc-800="" text-zinc-400'="" }`}="">
                    {challenge.status}
                  </span>
                </div>
                
                {challenge.status === 'open' ? (
                  <>
                    <div classname="pl-4 border-l-2 border-indigo-500/30 py-2 mb-6">
                      <p classname="text-lg text-zinc-200 font-serif italic">"{challenge.challenge_text}"</p>
                    </div>
                    <div classname="flex items-center gap-3 p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                      <alertcircle classname="w-5 h-5 text-amber-500"/>
                      <div classname="text-sm">
                        <span classname="text-zinc-400">Awaiting response. Expires in </span>
                        <span classname="text-amber-400 font-medium">
                          {formatDistanceToNow(new Date(challenge.expires_at))}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  raceData.challengeResponses.find((r: any) => r.challenge_id === challenge.id) && (
                    (() => {
                      const response = raceData.challengeResponses.find((r: any) => r.challenge_id === challenge.id);
                      return (
                        <div classname="grid grid-cols-1 md:grid-cols-2 gap-6 relative mt-4">
                          <div classname="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-800 -translate-x-1/2 hidden md:block"></div>
                          <div classname="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hidden md:block z-10">
                            VS
                          </div>
                          
                          {/* Challenger Side */}
                          <div classname="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
                            <div classname="flex items-center gap-3 mb-4">
                              <div classname="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
                                {challenger?.name.charAt(0)}
                              </div>
                              <div>
                                <div classname="text-sm font-medium text-white">{challenger?.name}</div>
                                <div classname="text-xs text-amber-400">Challenger</div>
                              </div>
                            </div>
                            <p classname="text-lg text-zinc-200 font-serif italic mb-4">"{challenge.challenge_text}"</p>
                          </div>
                          
                          {/* Response Side */}
                          <div classname="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
                            <div classname="flex items-center gap-3 mb-4">
                              <div classname="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                                {target?.name.charAt(0)}
                              </div>
                              <div>
                                <div classname="text-sm font-medium text-white">{target?.name}</div>
                                <div classname="text-xs text-emerald-400">Response</div>
                              </div>
                            </div>
                            {response.media_url && (
                              <div classname="aspect-video bg-zinc-900 rounded-lg mb-4 relative group overflow-hidden border border-zinc-800 w-full">
                                <img src="{response.media_url}" alt="Response thumbnail" classname="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity"/>
                                <div classname="absolute inset-0 flex items-center justify-center">
                                  <div classname="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/20 text-white">
                                    <play classname="w-4 h-4 ml-1"/>
                                  </div>
                                </div>
                              </div>
                            )}
                            <p classname="text-sm text-zinc-300">"{response.response_text}"</p>
                          </div>
                        </div>
                      );
                    })()
                  )
                )}
              </div>
            );
          })
          )}
        </div>
      )}

      {isIssueChallengeModalOpen && (
        <issuechallengemodal onclose="{(refresh)" ==""> {
            setIsIssueChallengeModalOpen(false);
            if (refresh) {
              fetch(`/api/races/${id}`)
                .then(res => res.json())
                .then(data => setRaceData(data));
            }
          }} 
          raceId={id!} 
          challengerId={activeCandidateId!} 
          candidates={raceData.candidates.filter((c: any) => c.id !== activeCandidateId)}
        />
      )}
    </div>
  );
}

function IssueChallengeModal({ onClose, raceId, challengerId, candidates }: { onClose: (refresh?: boolean) => void, raceId: string, challengerId: string, candidates: any[] }) {
  const [formData, setFormData] = useState({
    target_candidate_id: candidates.length > 0 ? candidates[0].id : "",
    challenge_text: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, race_id: raceId, challenger_candidate_id: challengerId })
      });
      
      if (res.ok) {
        onClose(true);
      }
    } catch (err) {
      console.error("Failed to issue challenge", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div classname="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div classname="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden">
        <div classname="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 classname="text-lg font-semibold text-white">Issue Challenge</h2>
          <button onclick="{()" ==""> onClose()} className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-zinc-800 transition-colors">
            <x classname="w-5 h-5"/>
          </button>
        </div>
        
        <form onsubmit="{handleSubmit}" classname="p-6 space-y-4">
          <div>
            <label classname="block text-sm font-medium text-zinc-400 mb-1.5">Target Candidate</label>
            <select required="" classname="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" value="{formData.target_candidate_id}" onchange="{e" ==""> setFormData({...formData, target_candidate_id: e.target.value})}
            >
              {candidates.map(c => (
                <option key="{c.id}" value="{c.id}">{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label classname="block text-sm font-medium text-zinc-400 mb-1.5">Challenge Statement</label>
            <textarea required="" rows="{4}" placeholder="Type your challenge here..." classname="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none" value="{formData.challenge_text}" onchange="{e" ==""> setFormData({...formData, challenge_text: e.target.value})}
            />
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => onClose()}
              className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Issue Challenge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ReactionButton({ icon, count, type, contentId, contentType }: { icon: React.ReactNode, count: number, type: string, contentId: string, contentType: string }) {
  const [localCount, setLocalCount] = useState(count);
  const [reacted, setReacted] = useState(false);

  const handleReact = async () => {
    if (reacted) return;
    setReacted(true);
    setLocalCount(prev => prev + 1);
    try {
      await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_type: contentType,
          content_id: contentId,
          reaction_type: type
        })
      });
    } catch (e) {
      setReacted(false);
      setLocalCount(prev => prev - 1);
    }
  };

  return (
    <button 
      onClick={handleReact}
      className={`flex items-center gap-2 text-xs font-medium transition-colors px-3 py-1.5 rounded-full border ${
        reacted 
          ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" 
          : "text-zinc-400 hover:text-white bg-zinc-950 border-zinc-800 hover:border-zinc-700"
      }`}
    >
      {icon}
      <span>{localCount}</span>
    </button>
  );
}
