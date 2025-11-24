"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { useSupabase } from "./providers/supabase-provider";

type MatchRequest = {
  id: string;
  user_id: string;
  moods: string[] | null;
  topic: string | null;
  status: string;
  created_at: string;
  sphere_slug?: string | null;
  room_slug?: string | null;
};

export function MatchmakingQueueList({ initialQueue }: { initialQueue: MatchRequest[] }) {
  const [queue, setQueue] = useState(initialQueue);
  const [message, setMessage] = useState<string | null>(null);
  const { session, openAuth, supabase } = useSupabase();

  const sortedQueue = useMemo(
    () => queue.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [queue],
  );

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel("match-requests-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "match_requests" },
        ({ eventType, new: newRow, old }) => {
          setQueue((prev) => {
            if (eventType === "DELETE") {
              return prev.filter((req) => req.id !== old?.id);
            }
            if (!newRow) {
              return prev;
            }
            const updated = prev.some((req) => req.id === newRow.id)
              ? prev.map((req) => (req.id === newRow.id ? { ...req, ...(newRow as MatchRequest) } : req))
              : [newRow as MatchRequest, ...prev];
            return updated.slice(0, 50);
          });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

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
      const participants: Array<{ requestId: string; userId: string; sphereSlug: string | null }> = json.participants || [];
      setQueue((prev) =>
        prev.map((req) => (participants.find((p) => p.requestId === req.id) ? { ...req, status: "paired", room_slug: json.roomSlug } : req)),
      );
      setMessage(json.message || "Paired!");

      await fetch("/api/matchmaking/livekit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomSlug: json.roomSlug,
          sphereSlug: json.sphereSlug,
          participants: participants.map((p) => p.userId),
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
        {sortedQueue.length === 0 && <p className="text-sm text-[#22223B]/60">No active requests.</p>}
        {sortedQueue.map((req) => (
          <div key={req.id} className="rounded-2xl border border-[#FFD166]/50 bg-[#FFF1EB]/70 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#22223B]">{req.topic || "Untitled topic"}</p>
                <p className="text-xs text-[#22223B]/60">
                  {req.moods?.join(", ") || "No moods"} • {req.status}
                </p>
                {req.sphere_slug && (
                  <a href={`/spheres/${req.sphere_slug}`} className="text-xs font-semibold text-[#e63946] underline">
                    {req.sphere_slug}
                  </a>
                )}
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

