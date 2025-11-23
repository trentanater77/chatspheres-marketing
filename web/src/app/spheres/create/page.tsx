import { CreateSphereForm } from "@/components/create-sphere-form";
import { ButtonLink } from "@/components/ui/button";

export const metadata = {
  title: "Create a Sphere — Chatspheres",
};

export default function CreateSpherePage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-4 py-16">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">create</p>
        <h1 className="text-4xl font-bold text-[#22223B]">Claim your sphere slug.</h1>
        <p className="text-sm text-[#22223B]/70">
          This writes directly to Supabase, so LiveKit and the marketing site stay in sync without Xano.
        </p>
      </div>
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
    </div>
  );
}

