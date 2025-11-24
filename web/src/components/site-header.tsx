"use client";

import Link from "next/link";
import { useState } from "react";
import { cn, siteLinks } from "@/lib/utils";
import { Button } from "./ui/button";
import { useSupabase } from "./providers/supabase-provider";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Home", href: "#top" },
  { label: "Explore", href: "#explore" },
  { label: "Recordings", href: "#recordings" },
  { label: "Pricing", href: "#pricing" },
  { label: "Moderation", href: "/moderation" },
  { label: "Profile", href: "/settings/profile" },
];

export function SiteHeader() {
  const { session, openAuth } = useSupabase();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleAuthClick = () => {
    if (session) {
      router.push(siteLinks.dashboard);
      return;
    }
    openAuth();
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#FFE5D9]/70 border-b border-white/40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="#top" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full border-[6px] border-white relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[4px] border-[#e63946]" />
            <div className="absolute inset-0 translate-x-3 rounded-full border-[6px] border-white" />
            <div className="absolute inset-0 translate-x-3 rounded-full border-[4px] border-[#e63946]" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#e63946] font-bold">
              chatspheres
            </p>
            <p className="text-xs text-[#22223B]/80">Talk with purpose</p>
          </div>
        </Link>

        <nav className="hidden gap-6 text-sm font-semibold text-[#22223B] md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="tracking-wide transition hover:text-[#e63946]"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex flex-col items-end gap-1 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span className="block h-0.5 w-8 bg-[#22223B]" />
          <span className="block h-0.5 w-6 bg-[#22223B]" />
          <span className="block h-0.5 w-4 bg-[#22223B]" />
        </button>

        <div
          className={cn(
            "fixed inset-0 z-20 bg-black/40 backdrop-blur-sm opacity-0 pointer-events-none transition md:hidden",
            mobileOpen && "pointer-events-auto opacity-100",
          )}
          onClick={() => setMobileOpen(false)}
        />

        <nav
          className={cn(
            "fixed right-4 top-20 z-30 w-[calc(100%-2rem)] max-w-sm rounded-3xl border border-white/60 bg-white/95 p-6 shadow-2xl transition md:hidden",
            mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none",
          )}
        >
          <div className="flex flex-col gap-6 text-lg font-medium text-[#22223B]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="tracking-wide transition hover:text-[#e63946]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Button variant="secondary" onClick={handleAuthClick}>
              {session ? "Dashboard" : "Sign in"}
            </Button>
          </div>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/pricing"
            className={cn(
              "pill hidden md:inline-flex bg-white/80 shadow-sm hover:shadow-md transition",
            )}
          >
            Pricing
          </Link>
          <Button variant="secondary" onClick={handleAuthClick} className="hidden md:inline-flex">
            {session ? "Dashboard" : "Sign in"}
          </Button>
        </div>
      </div>
    </header>
  );
}

