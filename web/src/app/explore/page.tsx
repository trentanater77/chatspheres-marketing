import { ButtonLink } from "@/components/ui/button";
import { getExploreSpheres } from "@/lib/data";
import { siteLinks } from "@/lib/utils";

export const metadata = {
  title: "Explore Spheres — Chatspheres",
};

export default async function ExplorePage() {
  const spheres = await getExploreSpheres();

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">explore</p>
          <h1 className="mt-3 text-4xl font-bold text-[#22223B]">Top community spheres</h1>
          <p className="mt-2 text-sm text-[#22223B]/70">
            Each sphere is typed into existence by its creator. No templates, no pre-defined topics.
          </p>
        </div>
        <ButtonLink href={siteLinks.sparkSignup}>Create your sphere</ButtonLink>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {spheres.map((sphere) => (
          <div key={sphere.slug} className="rounded-[28px] border border-white/60 bg-white/70 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[#22223B]/60">
                  {sphere.creator}
                </p>
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
                <span
                  key={tag}
                  className="rounded-full bg-[#FCE2E5] px-3 py-1 text-xs font-semibold text-[#22223B]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-6 text-sm text-[#22223B]">
              <div>
                <p className="text-xl font-bold">{sphere.spectators}</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#22223B]/60">spectators</p>
              </div>
              <div>
                <p className="text-xl font-bold">{sphere.recordings}</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#22223B]/60">recordings</p>
              </div>
              <div>
                <p className="text-xl font-bold">{sphere.lastRecordingAt}</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#22223B]/60">last replay</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

