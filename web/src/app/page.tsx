import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ButtonLink } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { PricingTable } from "@/components/pricing-table";
import { featuredSpheres, marketingPoints, recordings, statBlocks } from "@/data/mock";
import { siteLinks } from "@/lib/utils";

export default function HomePage() {
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-4 py-12">
        <section className="rounded-[40px] border border-white/60 bg-white/70 p-10 shadow-[0_40px_120px_rgba(34,34,59,0.15)]">
          <div className="grid gap-10 md:grid-cols-2">
            <div className="space-y-6">
              <Tag className="bg-[#FFB6B9] text-[#22223B]">Topic-driven video forums</Tag>
              <h1 className="text-4xl font-extrabold leading-tight text-[#22223B] md:text-5xl">
                Talk with purpose. <span className="text-[#e63946]">Connect with heart.</span>
              </h1>
              <p className="text-lg text-[#22223B]/80">
                Chatspheres blends Reddit-style forums with 1:1 video chats. Create a sphere by
                typing its slug (like <span className="font-semibold">sphere/faith-and-focus</span>)
                —no dropdowns, no gatekeeping. Spin up rooms inside it and let spectators watch in
                real time.
              </p>
              <div className="flex flex-wrap gap-4">
                <ButtonLink href={siteLinks.app}>Launch video chat</ButtonLink>
                <ButtonLink href="#pricing" variant="secondary">
                  See pricing
                </ButtonLink>
              </div>
              <div className="flex flex-wrap gap-8 text-sm text-[#22223B]/80">
                <p>Supabase auth mandatory • LiveKit rooms • Firebase replays • Netlify deploy.</p>
                <p>Shareable links, recordings, spectator stats, and cat-powered maintenance mode.</p>
              </div>
            </div>
            <div className="glass-panel rounded-[36px] p-6">
              <p className="text-sm uppercase tracking-[0.4em] text-[#e63946] font-bold">
                create a sphere
              </p>
              <div className="mt-4 space-y-4">
                <div className="rounded-3xl bg-[#FCE2E5] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#22223B]/60">
                    step 1
                  </p>
                  <p className="text-lg font-semibold text-[#22223B]">Type your sphere slug</p>
                  <div className="mt-2 rounded-2xl bg-white px-4 py-3 font-mono text-sm text-[#e63946]">
                    sphere/{`{your-topic}`}
                  </div>
                  <p className="mt-2 text-sm text-[#22223B]/70">
                    Just like typing r/ on Reddit. You own the namespace around your topic.
                  </p>
                </div>
                <div className="rounded-3xl bg-white/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#22223B]/60">
                    step 2
                  </p>
                  <p className="text-lg font-semibold text-[#22223B]">
                    Add prompts + seed rooms
                  </p>
                  <p className="mt-2 text-sm text-[#22223B]/70">
                    Prompts behave like posts. Members jump straight into video rooms or spectate.
                  </p>
                </div>
                <div className="rounded-3xl bg-[#FFD166]/50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#22223B]/60">
                    step 3
                  </p>
                  <p className="text-lg font-semibold text-[#22223B]">Auto-publish recordings</p>
                  <p className="mt-2 text-sm text-[#22223B]/70">
                    Upload your own or surface community replays directly inside the sphere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {statBlocks.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/50 bg-white/60 p-6 text-center shadow-md"
            >
              <p className="text-3xl font-extrabold text-[#22223B]">{stat.value}</p>
              <p className="text-sm uppercase tracking-[0.4em] text-[#e63946] font-bold">
                {stat.label}
              </p>
              <p className="text-sm text-[#22223B]/70">{stat.subtext}</p>
            </div>
          ))}
        </section>

        <section id="explore" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">
                explore
              </p>
              <h2 className="text-3xl font-bold text-[#22223B]">
                Spheres live now. Yours is one slug away.
              </h2>
            </div>
            <ButtonLink href="/explore" variant="secondary">
              Browse all spheres
            </ButtonLink>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredSpheres.map((sphere) => (
              <div
                key={sphere.slug}
                className="rounded-[32px] border border-white/60 bg-white/70 p-6 shadow-[0_25px_60px_rgba(34,34,59,0.15)]"
              >
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
                    <p className="text-xs uppercase tracking-[0.3em] text-[#22223B]/60">
                      spectators
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{sphere.recordings}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#22223B]/60">
                      recordings
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{sphere.lastRecordingAt}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#22223B]/60">
                      last replay
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] border border-white/60 bg-white/70 p-8 shadow-[0_35px_80px_rgba(34,34,59,0.12)]">
          <div className="grid gap-8 md:grid-cols-3">
            {marketingPoints.map((point) => (
              <div key={point.title}>
                <h3 className="text-xl font-semibold text-[#22223B]">{point.title}</h3>
                <p className="mt-2 text-sm text-[#22223B]/75">{point.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="recordings" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">
                recordings
              </p>
              <h2 className="text-3xl font-bold text-[#22223B]">
                Upload your own or surface community replays.
              </h2>
            </div>
            <ButtonLink href="/recordings" variant="secondary">
              View library
            </ButtonLink>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {recordings.map((rec) => (
              <div key={rec.title} className="rounded-3xl border border-white/50 bg-white/80 p-5">
                <p className="text-xs uppercase tracking-[0.4em] text-[#22223B]/60">
                  {rec.sphere}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[#22223B]">{rec.title}</h3>
                <p className="text-sm text-[#22223B]/70">{rec.length}</p>
                <ButtonLink href={rec.url} variant="ghost" className="mt-4 px-0">
                  Watch replay →
                </ButtonLink>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing">
          <PricingTable />
        </section>

        <section className="rounded-[36px] border border-white/60 bg-[#FCE2E5]/80 p-10 text-center shadow-[0_25px_80px_rgba(34,34,59,0.15)]">
          <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">ready?</p>
          <h2 className="mt-4 text-3xl font-bold text-[#22223B]">
            Spin up a sphere, drop in a prompt, invite your people.
          </h2>
          <p className="mt-2 text-lg text-[#22223B]/80">
            We’ll keep building toward matchmaking, Supabase limits, and the Xano sunset while you
            grow your orbit.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <ButtonLink href={siteLinks.sparkSignup}>Start free (Spark)</ButtonLink>
            <ButtonLink href={siteLinks.app} variant="secondary">
              Jump to video app
            </ButtonLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
