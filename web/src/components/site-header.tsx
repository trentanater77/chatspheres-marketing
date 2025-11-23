"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useSupabase } from "./providers/supabase-provider";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Home", href: "#top" },
  { label: "Explore", href: "#explore" },
  { label: "Recordings", href: "#recordings" },
  { label: "Pricing", href: "#pricing" },
];

export function SiteHeader() {
  const { session, openAuth } = useSupabase();
  const router = useRouter();

  const handleAuthClick = () => {
    if (session) {
      router.push("https://sphere.chatspheres.com/dashboard");
      return;
    }
    openAuth();
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
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
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
          <Link
            href="https://sphere.chatspheres.com"
            className="rounded-full bg-[#FFD166] px-5 py-2 text-sm font-bold text-[#22223B] transition hover:bg-[#e63946] hover:text-white shadow-[0_15px_30px_rgba(230,57,70,0.15)]"
          >
            Launch video chat
          </Link>
        </div>
      </div>
    </header>
  );
}

