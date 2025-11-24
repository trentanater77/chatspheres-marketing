"use client";

import { useEffect, useMemo, useState } from "react";
import { useSupabase } from "./providers/supabase-provider";
import { Button } from "./ui/button";
import { planTiers } from "@/config/site";
import { UpgradeButton } from "./upgrade-button";

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
    const interval = setInterval(fetchStats, 30000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [supabase, session]);

  const totals = useMemo(() => {
    if (!stats) return null;
    const remaining = stats.minutes_remaining ?? 0;
    const used = stats.minutes_used_this_month ?? 0;
    const total = remaining + used;
    const pct = total ? Math.min(100, Math.round((used / total) * 100)) : 0;
    return { remaining, used, total, pct };
  }, [stats]);

  const currentTier = useMemo(() => {
    if (!stats?.account_tier) return "spark";
    return stats.account_tier.toLowerCase();
  }, [stats?.account_tier]);

  const nextTier = useMemo(() => {
    if (currentTier === "spark") return planTiers.find((p) => p.name === "Spark+");
    if (currentTier === "spark+") return planTiers.find((p) => p.name === "Orbit");
    if (currentTier === "orbit") return planTiers.find((p) => p.name === "Constellation");
    return null;
  }, [currentTier]);

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
      ) : stats && totals ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="mt-2 text-2xl font-semibold text-[#22223B]">{stats.account_tier?.toUpperCase() || "SPARK"} plan</h3>
            {nextTier?.priceMonthlyId && (
              <UpgradeButton
                planName={nextTier.name}
                label={`Upgrade to ${nextTier.name}`}
                priceId={nextTier.priceMonthlyId}
                variant="secondary"
              />
            )}
          </div>
          <div className="mt-3 rounded-2xl bg-[#FCE2E5]/60 p-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-[#22223B]/70">
              <span>usage this month</span>
              <span>{totals.pct}%</span>
            </div>
            <div className="mt-2 h-3 w-full rounded-full bg-white/60">
              <div
                className="h-full rounded-full bg-[#e63946]"
                style={{ width: `${totals.pct}%` }}
                aria-label="Minutes used"
              />
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm text-[#22223B]">
            <div>
              <p className="text-3xl font-extrabold text-[#22223B]">{totals.used}</p>
              <p className="uppercase tracking-[0.3em] text-[#22223B]/60 text-[10px]">minutes used</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-[#22223B]">{totals.remaining}</p>
              <p className="uppercase tracking-[0.3em] text-[#22223B]/60 text-[10px]">minutes left</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-[#22223B]">{totals.total}</p>
              <p className="uppercase tracking-[0.3em] text-[#22223B]/60 text-[10px]">monthly pool</p>
            </div>
          </div>
          {nextTier && (
            <p className="mt-3 text-xs text-[#22223B]/70">
              Need more headroom? {nextTier.name} unlocks {nextTier.limits[0]?.toLowerCase()} plus sponsored boosts.
            </p>
          )}
        </>
      ) : (
        <p className="mt-2 text-sm text-[#22223B]/70">
          We couldn’t find stats for your account yet. Host a conversation to start tracking.
        </p>
      )}
    </div>
  );
}

