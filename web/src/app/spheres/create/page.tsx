import { CreateSphereForm } from "@/components/create-sphere-form";
import { ButtonLink } from "@/components/ui/button";
import { getExploreSpheres } from "@/lib/data";
import { PageWithSidebar } from "@/components/page-with-sidebar";
import { PlanLimitCard } from "@/components/plan-limit-card";

export const metadata = {
  title: "Create a Sphere — Chatspheres",
};

export default async function CreateSpherePage() {
  const spheres = await getExploreSpheres();
  const featuredSphere = spheres[0];

  return (
    <PageWithSidebar initialSphere={featuredSphere} contentClassName="gap-8">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">create</p>
        <h1 className="text-4xl font-bold text-[#22223B]">Claim your sphere slug.</h1>
        <p className="text-sm text-[#22223B]/70">
          This writes directly to Supabase, so LiveKit and the marketing site stay in sync without Xano.
        </p>
      </div>
      <PlanLimitCard accountTier={null} spheresUsed={0} />
      <CreateSphereForm />
      <div className="rounded-[32px] border border-white/60 bg-[#FFF1EB]/70 p-6 text-center shadow-[0_20px_60px_rgba(34,34,59,0.1)]">
        <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">already live?</p>
        <p className="text-sm text-[#22223B]/70">
          Jump to the Explore list to see how new spheres show up instantly.
        </p>
        <ButtonLink href="/spheres" className="mt-4">
          View spheres
        </ButtonLink>
      </div>
    </PageWithSidebar>
  );
}

