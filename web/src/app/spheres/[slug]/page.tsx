import { notFound } from "next/navigation";
import { getSphereBySlug } from "@/lib/data";
import { Tag } from "@/components/ui/tag";
import { ButtonLink } from "@/components/ui/button";
import { VideoRoomCard } from "@/components/video-room-card";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props) {
  const { sphere } = await getSphereBySlug(params.slug);
  if (!sphere) {
    return { title: "Sphere not found — Chatspheres" };
  }
  return {
    title: `${sphere.title} — Chatspheres`,
    description: sphere.description || "Chatspheres community hub",
  };
}

export default async function SphereDetailPage({ params }: Props) {
  const { sphere, rooms } = await getSphereBySlug(params.slug);
  if (!sphere) {
    notFound();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-4 py-16">
      <section className="rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-[0_35px_90px_rgba(34,34,59,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">sphere</p>
            <h1 className="mt-2 text-4xl font-bold text-[#22223B]">{sphere.title}</h1>
            <p className="mt-2 text-sm text-[#22223B]/75">{sphere.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {sphere.tags?.map((tag: string) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>
          <ButtonLink
            href={`https://sphere.chatspheres.com/?mode=participant&sphere=${sphere.slug}`}
            variant="secondary"
          >
            Launch in video app
          </ButtonLink>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm text-[#22223B]">
          <div>
            <p className="text-3xl font-extrabold text-[#22223B]">{sphere.spectators}</p>
            <p className="uppercase tracking-[0.3em] text-[#22223B]/60 text-[10px]">spectators</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-[#22223B]">{sphere.recordings}</p>
            <p className="uppercase tracking-[0.3em] text-[#22223B]/60 text-[10px]">recordings</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-[#22223B]">{sphere.lastRecordingAt}</p>
            <p className="uppercase tracking-[0.3em] text-[#22223B]/60 text-[10px]">last replay</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#22223B]">Rooms inside this sphere</h2>
          <ButtonLink href={`https://sphere.chatspheres.com/?mode=participant&sphere=${sphere.slug}`} variant="ghost">
            Start room →
          </ButtonLink>
        </div>
        {rooms.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#22223B]/20 bg-[#FFF1EB]/70 p-6 text-center text-sm text-[#22223B]/70">
            No video rooms yet. Be the first to go live!
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {rooms.map((room) => (
              <VideoRoomCard key={room.id} room={room} sphereSlug={sphere.slug} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

