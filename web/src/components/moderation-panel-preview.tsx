"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const themes = [
  { value: "warm", label: "Warm" },
  { value: "noir", label: "Noir" },
  { value: "compact", label: "Compact" },
] as const;

export function ModerationPanelPreview() {
  const [theme, setTheme] = useState<typeof themes[number]["value"]>("warm");
  const [density, setDensity] = useState(70);

  const accent =
    theme === "noir" ? "bg-[#22223B] text-white" : theme === "compact" ? "bg-white text-[#22223B]" : "bg-[#FFF1EB] text-[#22223B]";

  return (
    <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_30px_80px_rgba(34,34,59,0.12)]">
      <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">moderation studio</p>
      <h3 className="mt-2 text-2xl font-bold text-[#22223B]">Theme + density controls for moderators.</h3>
      <p className="text-sm text-[#22223B]/70">
        Supabase profiles store per-moderator theme preferences so every route reuses the exact sidebar + panel layout.
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
        {themes.map((option) => (
          <button
            key={option.value}
            className={cn(
              "rounded-full border border-[#22223B]/10 px-3 py-1 transition",
              theme === option.value ? "bg-[#FFD166]" : "bg-white hover:text-[#e63946]",
            )}
            onClick={() => setTheme(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-[24px] border border-[#FFD166]/40 bg-[#FFF1EB]/80 p-4">
      <p className="text-xs uppercase tracking-[0.4em] text-[#22223B]/60">preview</p>
        <div
          className={cn(
            "mt-3 grid gap-4 rounded-2xl border border-white/80 p-4 text-sm shadow-sm",
            accent,
            density > 70 ? "space-y-4" : "space-y-2",
          )}
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold">Spectator chat</p>
            <Button variant="ghost" className="px-3 py-1 text-xs">
              Mute all
            </Button>
          </div>
          <div className="rounded-xl border border-white/60 bg-white/50 p-3 text-xs text-[#22223B]">
            “Keep prompts focused” — AI helper suggests soft interventions before a ban.
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-white/50 bg-white/60 p-3 text-xs text-[#22223B]">
              <p className="font-semibold text-sm">Actions</p>
              <ul className="mt-1 list-disc pl-4">
                <li>Shadow-ban spectator</li>
                <li>Escalate to cat-mode 🐾</li>
              </ul>
            </div>
            <div className="rounded-xl border border-white/50 bg-white/60 p-3 text-xs text-[#22223B]">
              <p className="font-semibold text-sm">Theme</p>
              <input
                type="range"
                value={density}
                min={40}
                max={100}
                onChange={(e) => setDensity(Number(e.target.value))}
                className="mt-2 w-full"
              />
              <p className="mt-1 text-[10px] uppercase tracking-[0.4em] text-[#22223B]/60">density</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

