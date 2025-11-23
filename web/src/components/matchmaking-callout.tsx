"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useSupabase } from "./providers/supabase-provider";

const moods = ["Deep", "Playful", "Fast-paced", "Mentorship"];

export function MatchmakingCallout() {
  const [selected, setSelected] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { session, openAuth } = useSupabase();

  const toggleMood = (mood: string) => {
    setSelected((prev) => (prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]));
  };

  const handleSubmit = async () => {
    if (!session) {
      openAuth();
      return;
    }
    if (!selected.length) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const response = await fetch("/api/matchmaking/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moods: selected,
          topic,
          userId: session.user.id,
        }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_30px_80px_rgba(34,34,59,0.12)]">
      <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">matchmaking beta</p>
      <h3 className="mt-2 text-2xl font-bold text-[#22223B]">Topic + mood signals for 1:1 chats.</h3>
      <p className="text-sm text-[#22223B]/70">
        Requests land in <code>match_requests</code> so the LiveKit controller can pair you automatically.
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

      <div className="mt-4">
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-[#22223B]/60">Topic focus</label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Faith, startups, health..."
          className="mt-2 w-full rounded-2xl border border-[#22223B]/10 bg-white px-4 py-2 text-sm text-[#22223B]"
        />
      </div>

      <Button className="mt-5" variant="secondary" onClick={handleSubmit} disabled={status === "loading"}>
        {status === "loading" ? "Submitting..." : status === "success" ? "Request queued!" : "Join waitlist"}
      </Button>

      {status === "error" && (
        <p className="mt-2 text-xs text-[#e63946]">Pick at least one mood (and sign in) to join the matchmaking queue.</p>
      )}
      {status === "success" && (
        <p className="mt-2 text-xs text-[#22223B]/60">
          Saved! We’ll pair you automatically when another host with similar preferences is available.
        </p>
      )}
    </div>
  );
}

