"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useSupabase } from "./providers/supabase-provider";

type MatchRequest = {
  id: string;
  user_id: string;
  moods: string[] | null;
  topic: string | null;
  status: string;
  created_at: string;
};

export function MatchmakingQueueList({ initialQueue }: { initialQueue: MatchRequest[] }) {
  const [queue, setQueue] = useState(initialQueue);
  const [message, setMessage] = useState<string | null>(null);
  const { session, openAuth } = useSupabase();

  const pairRequest = async (requestId: string) => {
    setMessage(null);
    try {
      if (!session) {
        openAuth();
        return;
      }

      const response = await fetch("/api/matchmaking/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || "Pairing failed");
      }
      const pairedIds: string[] = json.pairedIds || [];
      setQueue((prev) =>
        prev.map((req) => (pairedIds.includes(req.id) ? { ...req, status: "paired" } : req)),
      );
      setMessage(json.message || "Paired!");

      await fetch("/api/matchmaking/livekit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantA: pairedIds[0],
          participantB: pairedIds[1],
          roomSlug: json.roomSlug,
        }),
      });
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Pairing failed");
    }
  };

  return (
    <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_30px_80px_rgba(34,34,59,0.12)]">
      <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">match requests</p>
      <p className="text-sm text-[#22223B]/70">
        This reads directly from the <code>match_requests</code> table.
      </p>
      <div className="mt-4 space-y-3">
        {queue.length === 0 && <p className="text-sm text-[#22223B]/60">No active requests.</p>}
        {queue.map((req) => (
          <div key={req.id} className="rounded-2xl border border-[#FFD166]/50 bg-[#FFF1EB]/70 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#22223B]">{req.topic || "Untitled topic"}</p>
                <p className="text-xs text-[#22223B]/60">
                  {req.moods?.join(", ") || "No moods"} • {req.status}
                </p>
              </div>
              {req.status === "waiting" && (
                <Button variant="secondary" onClick={() => pairRequest(req.id)}>
                  Pair now
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {message && <p className="mt-3 text-xs text-[#22223B]/60">{message}</p>}
    </div>
  );
}

