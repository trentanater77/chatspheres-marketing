import { PricingTable } from "@/components/pricing-table";
import { ButtonLink } from "@/components/ui/button";
import { getStripeSession } from "@/lib/stripe";
import { updateUserPlan } from "@/lib/subscription";
import { getExploreSpheres } from "@/lib/data";
import { PageWithSidebar } from "@/components/page-with-sidebar";

type PricingPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export const metadata = {
  title: "Chatspheres Pricing",
};

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const status = typeof searchParams.status === "string" ? searchParams.status : undefined;
  const sessionId = typeof searchParams.session_id === "string" ? searchParams.session_id : undefined;
  const spheresPromise = getExploreSpheres();
  let upgradedPlan: string | null = null;

  if (sessionId) {
    const session = await getStripeSession(sessionId);
    if (session?.metadata?.userId) {
      upgradedPlan = session.metadata.planName || null;
      await updateUserPlan(session.metadata.userId, upgradedPlan || undefined);
    }
  }

  const spheres = await spheresPromise;
  const featuredSphere = spheres[0];

  return (
    <PageWithSidebar initialSphere={featuredSphere} contentClassName="gap-12">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">pricing</p>
        <h1 className="mt-4 text-4xl font-extrabold text-[#22223B]">Generous free tier. Paid when you scale.</h1>
        <p className="mt-2 text-base text-[#22223B]/80">
          Supabase-enforced limits, Stripe billing, and ad-supported Spark for limitless experiments.
        </p>
        {status === "success" && (
          <p className="mt-4 rounded-full bg-[#d4f8d4] px-4 py-2 text-sm font-semibold text-[#1B5E20]">
            Payment complete!{upgradedPlan ? ` Upgraded to ${upgradedPlan}.` : ""} Your new plan will reflect shortly.
          </p>
        )}
        {status === "cancelled" && (
          <p className="mt-4 rounded-full bg-[#FFE5D9] px-4 py-2 text-sm font-semibold text-[#e63946]">
            Checkout cancelled. You can upgrade again any time.
          </p>
        )}
      </div>
      <PricingTable />
      <div className="rounded-[32px] border border-white/60 bg-white/80 p-10 text-center shadow-lg">
        <h2 className="text-2xl font-bold text-[#22223B]">Need Enterprise media campaigns?</h2>
        <p className="mt-2 text-sm text-[#22223B]/80">
          Custom hero placements, newsletter slots, and curated sphere sponsorships are available.
        </p>
        <ButtonLink href="mailto:hello@chatspheres.com" className="mt-4">
          Contact sales
        </ButtonLink>
      </div>
    </PageWithSidebar>
  );
}

