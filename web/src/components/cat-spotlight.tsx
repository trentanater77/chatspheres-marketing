"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";

const DEFAULT_CAT_API = "https://cataas.com/cat/gif?type=smile";

export function CatSpotlight() {
  const [catUrl, setCatUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_CAT_API || DEFAULT_CAT_API;

  const loadCat = useCallback(() => {
    setLoading(true);
    const urlWithCacheBust = `${apiUrl}${apiUrl.includes("?") ? "&" : "?"}t=${Date.now()}`;
    setCatUrl(urlWithCacheBust);
  }, [apiUrl]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCat();
    }, 100);
    return () => clearTimeout(timer);
  }, [loadCat]);

  return (
    <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_30px_80px_rgba(34,34,59,0.12)]">
      <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">cat comfort</p>
      <h3 className="mt-3 text-2xl font-bold text-[#22223B]">Maintenance mascot is always on-call.</h3>
      <p className="text-sm text-[#22223B]/70">Need a serotonin bump while rooms spin up? Tap for a fresh cat gif.</p>

      <div className="mt-4 flex flex-col items-center gap-4">
        <div className="w-full rounded-[24px] border border-[#FFD166]/60 bg-[#FFF1EB] p-3">
          <div className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-[#FFE5D9]/60">
            {catUrl ? (
              <Image
                src={catUrl}
                alt="Chatspheres cat gif"
                fill
                unoptimized
                className="object-cover"
                onLoadingComplete={() => setLoading(false)}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-[#22223B]/60">
                Loading cat magic…
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-[#22223B]/60">
                Loading cat magic…
              </div>
            )}
          </div>
        </div>
        <Button variant="secondary" onClick={loadCat}>
          {loading ? "Fetching…" : "New cat please"}
        </Button>
      </div>
    </div>
  );
}

