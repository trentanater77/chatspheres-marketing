import Link from "next/link";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/50 bg-[#FFE5D9]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#e63946] font-bold">
            chatspheres
          </p>
          <p className="text-base text-[#22223B]/80">{siteConfig.tagline}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[#22223B]">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <a href={siteConfig.socials.twitter}>Twitter</a>
          <a href={siteConfig.socials.discord}>Discord</a>
          <a href={`mailto:${siteConfig.socials.email}`}>Email us</a>
        </div>
      </div>
    </footer>
  );
}

