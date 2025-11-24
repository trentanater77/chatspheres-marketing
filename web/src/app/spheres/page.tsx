import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { getExploreSpheres } from "@/lib/data";
import { PageWithSidebar } from "@/components/page-with-sidebar";

export const metadata = {
  title: "Communities — Chatspheres",
};

export default async function SpheresIndexPage() {
  const spheres = await getExploreSpheres();
  const featuredSphere = spheres[0];

  return (
    <PageWithSidebar initialSphere={featuredSphere}>
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">communities</p>
        <h1 className="text-4xl font-bold text-[#22223B]">Build your sphere, then spin up rooms.</h1>
        <p className="text-sm text-[#22223B]/70">
          Each sphere mirrors a subreddit-like feed, but with built-in LiveKit rooms and spectator slots.
        </p>
        <ButtonLink href="/spheres/create" variant="secondary">
          Create a sphere
        </ButtonLink>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {spheres.map((sphere) => (
          <Link
            href={`/spheres/${sphere.slug}`}
            key={sphere.slug}
            className="rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-[0_25px_60px_rgba(34,34,59,0.1)] transition hover:-translate-y-1 hover:shadow-[0_35px_80px_rgba(34,34,59,0.15)]"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-[#22223B]/60">{sphere.creator}</p>
            <h3 className="mt-1 text-2xl font-semibold text-[#22223B]">{sphere.title}</h3>
            <p className="mt-2 text-sm text-[#22223B]/75 line-clamp-2">{sphere.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {sphere.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full bg-[#FCE2E5] px-3 py-1 text-xs font-semibold text-[#22223B]">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-6 text-sm text-[#22223B]">
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
          </Link>
        ))}
      </div>

      <div className="rounded-[32px] border border-white/60 bg-[#FFF1EB]/80 p-6 text-center shadow-[0_20px_60px_rgba(34,34,59,0.1)]">
        <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">launch</p>
        <h3 className="mt-2 text-2xl font-semibold text-[#22223B]">Ready to claim a slug?</h3>
        <p className="text-sm text-[#22223B]/70">
          Use the Share Link Lab or click below to authenticate and start hosting within Spark.
        </p>
        <ButtonLink href="/spheres/create" className="mt-4">
          Create a sphere
        </ButtonLink>
      </div>
    </PageWithSidebar>
  );
}

