import { ModerationPanelPreview } from "@/components/moderation-panel-preview";
import { MatchmakingCallout } from "@/components/matchmaking-callout";
import { PlanUsagePanel } from "@/components/plan-usage";
import { getExploreSpheres, getMatchRequests, getModerationLogs } from "@/lib/data";
import { MatchmakingQueueList } from "@/components/matchmaking-queue-list";
import { ModerationLogTable } from "@/components/moderation-log-table";
import { PageWithSidebar } from "@/components/page-with-sidebar";

export const metadata = {
  title: "Moderator Toolkit — Chatspheres",
};

export default async function ModerationPage() {
  const [queue, logs, spheres] = await Promise.all([getMatchRequests(), getModerationLogs(), getExploreSpheres()]);
  const featuredSphere = spheres[0];

  return (
    <PageWithSidebar initialSphere={featuredSphere}>
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-[#e63946] font-bold">moderation</p>
        <h1 className="text-4xl font-bold text-[#22223B]">Consistent tools across every surface.</h1>
        <p className="text-sm text-[#22223B]/70">
          Adjust density, ban flows, and matchmaking toggles all from one Supabase-backed panel.
        </p>
      </div>

      <ModerationPanelPreview />
      <PlanUsagePanel />
      <MatchmakingCallout />
      <MatchmakingQueueList initialQueue={queue} />
      <ModerationLogTable logs={logs} />
    </PageWithSidebar>
  );
}

