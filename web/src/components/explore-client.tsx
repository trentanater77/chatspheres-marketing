"use client";

import { useCallback, useEffect, useState } from "react";
import type { LandingSphere } from "@/lib/data";
import { ButtonLink } from "./ui/button";

type Props = {
  initialSpheres: LandingSphere[];
};

export function ExploreClient({ initialSpheres }: Props) {
  const [spheres, setSpheres] = useState(initialSpheres);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("live");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSpheres = useCallback(
    async (overrideQuery = query, overrideSort = sort) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (overrideQuery) params.set("q", overrideQuery);
      params.set("sort", overrideSort);
      const response = await fetch(`/api/spheres/search?${params.toString()}`, { cache: "no-store" });
      const json = await response.json();
      setSpheres(json.spheres || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.warn("Search failed", error);
    } finally {
      setLoading(false);
    }
    },
    [query, sort],
  );

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    fetchSpheres();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSpheres();
    }, 20000);
    return () => clearInterval(interval);
  }, [fetchSpheres]);

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="rounded-[28px] border border-white/60 bg-white/80 p-4 shadow">
        <div className="flex flex-wrap gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search spheres…"
            className="flex-1 rounded-full border border-[#22223B]/10 bg-white px-4 py-2 text-sm text-[#22223B]"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-[#22223B]/10 bg-white px-4 py-2 text-sm text-[#22223B]"
          >
            <option value="live">Most live</option>
            <option value="popular">Most spectators</option>
            <option value="new">Newest</option>
          </select>
          <button
            type="submit"
            className="rounded-full bg-[#FFD166] px-5 py-2 text-sm font-bold text-[#22223B] transition hover:bg-[#e63946] hover:text-white"
          >
            {loading ? "Refreshing…" : "Search"}
          </button>
        </div>
      </form>

      {lastUpdated && (
        <p className="text-xs uppercase tracking-[0.3em] text-[#22223B]/50">
          Auto-refresh • Last updated {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {spheres.map((sphere) => (
          <div key={sphere.slug} className="rounded-[28px] border border-white/60 bg-white/70 p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[#22223B]/60">{sphere.creator}</p>
                <h3 className="text-2xl font-semibold text-[#22223B]">{sphere.title}</h3>
              </div>
              {sphere.isLive && (
                <span className="rounded-full bg-[#e63946]/10 px-3 py-1 text-xs font-bold uppercase text-[#e63946]">
                  Live • {sphere.liveCount}
                </span>
              )}
            </div>
            <p className="mt-3 text-sm text-[#22223B]/80">{sphere.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {sphere.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[#FCE2E5] px-3 py-1 text-xs font-semibold text-[#22223B]">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-6 text-sm text-[#22223B]">
              <div>
                <p className="text-xl font-bold">{sphere.spectators}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-[#22223B]/60">spectators</p>
              </div>
              <div>
                <p className="text-xl font-bold">{sphere.recordings}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-[#22223B]/60">recordings</p>
              </div>
              <div>
                <p className="text-xl font-bold">{sphere.lastRecordingAt}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-[#22223B]/60">last replay</p>
              </div>
            </div>
            <ButtonLink href={`/spheres/${sphere.slug}`} variant="secondary" className="mt-4">
              Visit sphere →
            </ButtonLink>
          </div>
        ))}
        {!spheres.length && <p className="text-sm text-[#22223B]/60">No spheres match this search yet.</p>}
      </div>
    </div>
  );
}

