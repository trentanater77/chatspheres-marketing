"use client";

import { useMemo } from "react";
import { planTiers } from "@/config/site";

type Props = {
  accountTier?: string | null;
  spheresUsed: number;
};

export function PlanLimitCard({ accountTier, spheresUsed }: Props) {
  const currentTier = useMemo(() => {
    const tier = accountTier?.toLowerCase() || "spark";
    return planTiers.find((p) => p.name.toLowerCase() === tier) ?? planTiers[0];
  }, [accountTier]);

  const nextTier = useMemo(() => {
    const tiers = planTiers.map((t) => t.name.toLowerCase());
    const currentIndex = tiers.indexOf(currentTier.name.toLowerCase());
    return tiers[currentIndex + 1] ? planTiers[currentIndex + 1] : null;
  }, [currentTier]);

  const limit = useMemo(() => {
    if (currentTier.name === "Constellation") return Infinity;
    if (currentTier.name === "Orbit") return 25;
    if (currentTier.name === "Spark+") return 10;
    return 5;
  }, [currentTier.name]);

  const pct = limit === Infinity ? 0 : Math.min(100, Math.round((spheresUsed / limit) * 100));

  return (
    <div className="rounded-[28px] border border-white/60 bg-white/80 p-5 shadow">
      <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">Sphere capacity</p>
      <div className="mt-2 flex items-center justify-between text-sm text-[#22223B]/70">
        <span>{currentTier.name} plan</span>
        <span>
          {spheresUsed} / {limit === Infinity ? "∞" : limit} spheres
        </span>
      </div>
      {limit !== Infinity && (
        <div className="mt-2 h-2 w-full rounded-full bg-[#FCE2E5]">
          <div className="h-full rounded-full bg-[#e63946]" style={{ width: `${pct}%` }} />
        </div>
      )}
      {nextTier && (
        <p className="mt-3 text-xs text-[#22223B]/60">
          Need more than {limit === Infinity ? "this" : limit}? {nextTier.name} unlocks{" "}
          {nextTier.limits?.[0]?.toLowerCase() ?? "larger communities"}.
        </p>
      )}
    </div>
  );
}



