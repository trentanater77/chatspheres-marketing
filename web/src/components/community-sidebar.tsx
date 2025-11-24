"use client";

import { useEffect, useMemo, useState } from "react";
import type { LandingSphere } from "@/lib/data";
import { ButtonLink } from "./ui/button";

type SidebarSnapshot = {
  slug: string;
  title: string;
  tags: string[];
  liveCount: number;
  spectators: number;
  recordings: number;
};

type SidebarApiSphere = {
  slug: string;
  title: string;
  tags?: string[] | null;
  live_count?: number | null;
  spectator_count?: number | null;
  recordings_count?: number | null;
};

const FALLBACK_SNAPSHOT: SidebarSnapshot = {
  slug: "spark-lounge",
  title: "Spark Lounge",
  tags: ["founders", "faith", "daily-reset"],
  liveCount: 0,
  spectators: 54,
  recordings: 18,
};

function landingToSnapshot(sphere?: LandingSphere | null): SidebarSnapshot {
  if (!sphere) {
    return FALLBACK_SNAPSHOT;
  }
  return {
    slug: sphere.slug,
    title: sphere.title,
    tags: Array.isArray(sphere.tags) ? sphere.tags : [],
    liveCount: sphere.liveCount ?? 0,
    spectators: sphere.spectators ?? 0,
    recordings: sphere.recordings ?? 0,
  };
}

function apiRowToSnapshot(row?: SidebarApiSphere | null): SidebarSnapshot | null {
  if (!row) return null;
  return {
    slug: row.slug,
    title: row.title,
    tags: Array.isArray(row.tags) ? row.tags : [],
    liveCount: row.live_count ?? 0,
    spectators: row.spectator_count ?? 0,
    recordings: row.recordings_count ?? 0,
  };
}

export function CommunitySidebar({ initialSphere }: { initialSphere?: LandingSphere | null }) {
  const [snapshot, setSnapshot] = useState<SidebarSnapshot>(() => landingToSnapshot(initialSphere));
  const [lastUpdated, setLastUpdated] = useState<string>("Just now");

  useEffect(() => {
    setSnapshot(landingToSnapshot(initialSphere));
  }, [initialSphere]);

  useEffect(() => {
    let cancelled = false;
    async function refreshSidebar() {
      try {
        const response = await fetch("/api/spheres/search?sort=live&limit=1", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const json = await response.json();
        const nextSnapshot = apiRowToSnapshot(json.spheres?.[0]);
        if (!cancelled && nextSnapshot) {
          setSnapshot(nextSnapshot);
          setLastUpdated(new Date().toLocaleTimeString());
        }
      } catch (error) {
        console.warn("Community sidebar refresh failed", error);
      }
    }
    refreshSidebar();
    const interval = setInterval(refreshSidebar, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const isLive = snapshot.liveCount >= 2;
  const liveLabel = isLive ? `Live • ${snapshot.liveCount} hosts` : snapshot.liveCount === 1 ? "1 host warming up" : "Offline";

  const statBlocks = useMemo(
    () => [
      { label: "Spectators", value: snapshot.spectators.toLocaleString(), badge: isLive ? "Live" : undefined },
      { label: "Recordings", value: snapshot.recordings.toString() },
      { label: "Live hosts", value: snapshot.liveCount.toString() },
    ],
    [snapshot, isLive],
  );

  return (
    <aside className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_30px_80px_rgba(34,34,59,0.15)] backdrop-blur lg:sticky lg:top-24">
      <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">live sidebar</p>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#22223B]/60">sphere/{snapshot.slug}</p>
          <h3 className="mt-1 text-2xl font-bold text-[#22223B]">{snapshot.title}</h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
            isLive ? "bg-[#e63946]/10 text-[#e63946]" : "bg-[#FCE2E5] text-[#22223B]"
          }`}
        >
          {liveLabel}
        </span>
      </div>
      <p className="mt-3 text-xs text-[#22223B]/60">Auto refreshes every 15s. Last sync {lastUpdated}.</p>

      <div className="mt-5 space-y-3">
        {statBlocks.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-inner"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#22223B]/60">{stat.label}</p>
              <p className="text-2xl font-bold text-[#22223B]">{stat.value}</p>
            </div>
            {stat.badge && (
              <span className="rounded-full bg-[#e63946]/10 px-3 py-1 text-[10px] font-bold uppercase text-[#e63946]">
                {stat.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {snapshot.tags.length > 0 && (
        <div className="mt-5 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#22223B]/60">Tags</p>
          <div className="flex flex-wrap gap-2">
            {snapshot.tags.slice(0, 6).map((tag) => (
              <span key={tag} className="rounded-full bg-[#FFD166] px-3 py-1 text-xs font-bold uppercase text-[#22223B]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        <ButtonLink href={`/spheres/${snapshot.slug}`} variant="secondary">
          View sphere
        </ButtonLink>
        <ButtonLink href={`https://sphere.chatspheres.com/?mode=spectator&sphere=${snapshot.slug}`} variant="ghost">
          Watch live →
        </ButtonLink>
      </div>
    </aside>
  );
}

