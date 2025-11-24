import { ProfileSettingsForm } from "@/components/profile-settings-form";
import { PlanUsagePanel } from "@/components/plan-usage";
import { getExploreSpheres } from "@/lib/data";
import { PageWithSidebar } from "@/components/page-with-sidebar";

export const metadata = {
  title: "Profile Settings — Chatspheres",
};

export default async function ProfileSettingsPage() {
  const spheres = await getExploreSpheres();
  const featuredSphere = spheres[0];

  return (
    <PageWithSidebar initialSphere={featuredSphere} contentClassName="gap-10">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">settings</p>
        <h1 className="text-4xl font-bold text-[#22223B]">Update your profile + plan.</h1>
        <p className="text-sm text-[#22223B]/70">
          Changes are stored in Supabase so the LiveKit app and marketing site stay in sync.
        </p>
      </div>
      <ProfileSettingsForm />
      <PlanUsagePanel />
    </PageWithSidebar>
  );
}

