"use client";

import { useEffect, useState } from "react";

type SidebarStat = {
  label: string;
  value: string;
  badge?: string;
};

const baseStats: SidebarStat[] = [
  { label: "Spectators", value: "58", badge: "Live" },
  { label: "Recordings", value: "22" },
  { label: "Followers", value: "1.4k" },
];

export function SidebarPreview() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const dynamicValue = (base: string, index: number) => {
    const baseNum = Number(base.replace(/[^\d]/g, ""));
    if (Number.isNaN(baseNum)) return base;
    return (baseNum + ((tick + index) % 3)).toString();
  };

  return (
    <div className="rounded-[32px] border border-white/60 bg-[#FFF1EB]/70 p-6 shadow-[0_25px_70px_rgba(34,34,59,0.08)]">
      <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">sidebar preview</p>
      <h3 className="mt-2 text-xl font-semibold text-[#22223B]">Consistent stats across every surface.</h3>
      <p className="text-sm text-[#22223B]/70">Once you tweak the sidebar on Home, it mirrors Explore, Pricing, and forum pages.</p>

      <div className="mt-5 space-y-3">
        {baseStats.map((stat, idx) => (
          <div
            key={stat.label}
            className="flex items-center justify-between rounded-2xl border border-white/80 bg-white/80 px-4 py-3"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#22223B]/60">{stat.label}</p>
              <p className="text-2xl font-bold text-[#22223B]">{dynamicValue(stat.value, idx)}</p>
            </div>
            {stat.badge && (
              <span className="rounded-full bg-[#e63946]/10 px-3 py-1 text-xs font-bold uppercase text-[#e63946]">
                {stat.badge}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

