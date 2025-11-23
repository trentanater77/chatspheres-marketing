import { recordings } from "@/data/mock";
import { ButtonLink } from "@/components/ui/button";

export const metadata = {
  title: "Recordings — Chatspheres",
};

export default function RecordingsPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-4 py-16">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">recordings</p>
        <h1 className="mt-3 text-4xl font-bold text-[#22223B]">Community-sourced replays</h1>
        <p className="mt-2 text-sm text-[#22223B]/70">
          Upload your own sessions or auto-publish from the LiveKit controller. Spark tier includes
          14-day retention by default.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {recordings.map((rec) => (
          <div key={rec.title} className="rounded-[24px] border border-white/60 bg-white/80 p-5">
            <p className="text-xs uppercase tracking-[0.4em] text-[#22223B]/60">{rec.sphere}</p>
            <h3 className="mt-2 text-lg font-semibold text-[#22223B]">{rec.title}</h3>
            <p className="text-sm text-[#22223B]/70">{rec.length}</p>
            <ButtonLink href={rec.url} variant="ghost" className="mt-4 px-0">
              Watch replay →
            </ButtonLink>
          </div>
        ))}
      </div>
    </div>
  );
}

