"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "./providers/supabase-provider";
import { Button } from "./ui/button";

type UserStats = {
  minutes_remaining: number;
  minutes_used_this_month: number;
  account_tier: string;
};

export function PlanUsagePanel() {
  const { supabase, session, openAuth } = useSupabase();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const loggedIn = Boolean(session);

  useEffect(() => {
    if (!supabase || !session) {
      return;
    }

    let active = true;

    const fetchStats = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("user_stats")
        .select("minutes_remaining, minutes_used_this_month, account_tier")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!active) return;
      setStats(data);
      setLoading(false);
    };

    fetchStats();

    return () => {
      active = false;
    };
  }, [supabase, session]);

  if (!loggedIn) {
    return (
      <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(34,34,59,0.1)]">
        <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">plan usage</p>
        <h3 className="mt-2 text-xl font-semibold text-[#22223B]">Sign in to view minutes and limits.</h3>
        <p className="text-sm text-[#22223B]/70">Supabase auth is required to sync with your LiveKit + Firebase usage.</p>
        <Button className="mt-4" onClick={openAuth}>
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(34,34,59,0.1)]">
      <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">plan usage</p>
      {session && loading ? (
        <p className="mt-2 text-sm text-[#22223B]/70">Loading your stats…</p>
      ) : stats ? (
        <>
          <h3 className="mt-2 text-2xl font-semibold text-[#22223B]">
            {stats.account_tier?.toUpperCase() || "SPARK"} plan
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm text-[#22223B]">
            <div>
              <p className="text-3xl font-extrabold text-[#22223B]">{stats.minutes_used_this_month ?? 0}</p>
              <p className="uppercase tracking-[0.3em] text-[#22223B]/60 text-[10px]">minutes used</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-[#22223B]">{stats.minutes_remaining ?? 0}</p>
              <p className="uppercase tracking-[0.3em] text-[#22223B]/60 text-[10px]">minutes left</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-[#22223B]">
                {stats.minutes_used_this_month + (stats.minutes_remaining ?? 0)}
              </p>
              <p className="uppercase tracking-[0.3em] text-[#22223B]/60 text-[10px]">monthly pool</p>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-2 text-sm text-[#22223B]/70">
          We couldn’t find stats for your account yet. Host a conversation to start tracking.
        </p>
      )}
    </div>
  );
}

