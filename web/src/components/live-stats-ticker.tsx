"use client";

import { useEffect, useState } from "react";

type LastHourResponse = {
  spheres: Array<{
    slug: string;
    title: string;
    live_count: number;
    spectator_count: number;
  }>;
};

export function LiveStatsTicker() {
  const [count, setCount] = useState(0);
  const [liveList, setLiveList] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        const response = await fetch("/api/spheres/last-hour");
        const json = (await response.json()) as LastHourResponse;
        if (!mounted) return;
        setCount(json.spheres.length);
        setLiveList(json.spheres.slice(0, 3).map((sphere) => sphere.title));
      } catch (error) {
        console.warn("Live ticker failed", error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 15_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="rounded-3xl border border-white/60 bg-[#FFF1EB]/70 p-4 shadow">
      <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">live past hour</p>
      <p className="mt-1 text-sm text-[#22223B]/70">
        {count} new spheres spun up recently {liveList.length ? `→ ${liveList.join(", ")}` : ""}
      </p>
    </div>
  );
}



