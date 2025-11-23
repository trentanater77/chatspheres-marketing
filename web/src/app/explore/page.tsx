import { ButtonLink } from "@/components/ui/button";
import { getExploreSpheres } from "@/lib/data";
import { siteLinks } from "@/lib/utils";
import { ExploreClient } from "@/components/explore-client";

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
      <ExploreClient initialSpheres={spheres} />
    </div>
  );
}

