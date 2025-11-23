"use client";

import { useState } from "react";
import { Button, ButtonLink } from "./ui/button";
import { cn } from "@/lib/utils";

const modes = [
  { value: "spectator", label: "Spectator link" },
  { value: "participant", label: "Participant invite" },
  { value: "recording", label: "Recording replay" },
] as const;

export function ShareLinkLab() {
  const [slug, setSlug] = useState("faith-and-focus");
  const [mode, setMode] = useState<(typeof modes)[number]["value"]>("spectator");
  const [copied, setCopied] = useState(false);

  const baseMarketing = process.env.NEXT_PUBLIC_SITE_URL || "https://chatspheres.com";
  const baseApp = process.env.NEXT_PUBLIC_VIDEO_APP_URL || "https://sphere.chatspheres.com";

  const url =
    mode === "recording"
      ? `${baseMarketing}/recordings?sphere=${encodeURIComponent(slug)}`
      : `${baseApp}/?mode=${mode}&sphere=${encodeURIComponent(slug)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_30px_80px_rgba(34,34,59,0.12)]">
      <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">shareable links</p>
      <h3 className="mt-3 text-2xl font-bold text-[#22223B]">Spin up a sphere link in seconds.</h3>
      <p className="text-sm text-[#22223B]/70">
        Create spectator invites, participant drops, or recording deep links your community can open instantly.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-semibold text-[#22223B]">
          Sphere slug
          <div className="flex rounded-full border border-[#22223B]/10 bg-white px-4 py-2">
            <span className="text-[#e63946] font-bold">sphere/</span>
            <input
              className="ml-1 flex-1 bg-transparent text-[#22223B] outline-none"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              placeholder="faith-and-focus"
            />
          </div>
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-[#22223B]">
          Link type
          <div className="flex rounded-full border border-[#22223B]/10 bg-white p-1 text-xs font-bold uppercase tracking-wide text-[#22223B]/70">
            {modes.map((option) => (
              <button
                key={option.value}
                className={cn(
                  "flex-1 rounded-full px-3 py-2 transition",
                  mode === option.value ? "bg-[#FFD166] text-[#22223B]" : "hover:text-[#e63946]",
                )}
                onClick={() => setMode(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </label>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-[#22223B]/20 bg-[#FCE2E5]/60 p-4">
        <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">link preview</p>
        <p className="mt-2 break-all font-mono text-sm text-[#22223B]">{url}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={handleCopy}>{copied ? "Copied!" : "Copy link"}</Button>
          <ButtonLink href={url} variant="secondary">
            Open link
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

