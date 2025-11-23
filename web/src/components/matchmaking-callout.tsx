"use client";

import { useState } from "react";
import { Button } from "./ui/button";

const moods = ["Deep", "Playful", "Fast-paced", "Mentorship"];

export function MatchmakingCallout() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleMood = (mood: string) => {
    setSelected((prev) => (prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]));
  };

  return (
    <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_30px_80px_rgba(34,34,59,0.12)]">
      <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">matchmaking beta</p>
      <h3 className="mt-2 text-2xl font-bold text-[#22223B]">Topic + mood signals for 1:1 chats.</h3>
      <p className="text-sm text-[#22223B]/70">
        Supabase will log requests in <code>match_requests</code> and the LiveKit controller will pair them asynchronously.
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
        {moods.map((mood) => (
          <button
            key={mood}
            onClick={() => toggleMood(mood)}
            className={`rounded-full border border-[#22223B]/10 px-3 py-1 transition ${
              selected.includes(mood) ? "bg-[#FFD166]" : "bg-white hover:text-[#e63946]"
            }`}
          >
            {mood}
          </button>
        ))}
      </div>

      <Button className="mt-5" variant="secondary" onClick={() => alert("Captured interest — wiring to Supabase next!")}>
        Join waitlist
      </Button>
    </div>
  );
}

