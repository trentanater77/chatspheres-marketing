"use client";

import { ShieldCheck, Hammer, Palette } from "lucide-react";
import { ButtonLink } from "./ui/button";

const features = [
  {
    icon: ShieldCheck,
    title: "Realtime moderation",
    copy: "Ban, mute, or spotlight speakers in one tap. Actions sync to Supabase + LiveKit instantly.",
  },
  {
    icon: Hammer,
    title: "Policy audit trail",
    copy: "Every action is logged to moderation_logs so you can review context inside the dashboard.",
  },
  {
    icon: Palette,
    title: "Theme controls",
    copy: "Flip between compact/dense or warm/dark layouts so your community feels at home.",
  },
];

export function ModeratorToolkit() {
  return (
    <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_35px_90px_rgba(34,34,59,0.12)]">
      <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">moderator ui</p>
      <h3 className="mt-3 text-2xl font-bold text-[#22223B]">Build the Reddit-to-video control center.</h3>
      <p className="text-sm text-[#22223B]/70">
        Permissions, logs, and theming all run through Supabase so Xano is no longer required.
      </p>

      <div className="mt-5 space-y-4">
        {features.map((feature) => (
          <div key={feature.title} className="flex gap-4 rounded-2xl border border-[#22223B]/10 bg-[#FFF1EB]/70 p-4">
            <feature.icon className="h-10 w-10 text-[#e63946]" />
            <div>
              <p className="text-base font-semibold text-[#22223B]">{feature.title}</p>
              <p className="text-sm text-[#22223B]/70">{feature.copy}</p>
            </div>
          </div>
        ))}
      </div>

      <ButtonLink href="/pricing" variant="secondary" className="mt-6">
        See moderator roadmap
      </ButtonLink>
    </div>
  );
}

