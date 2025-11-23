import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceRoleClient();
    const { moderatorId, targetUserId, action, reason, sphereId } = await request.json();

    if (!moderatorId || !targetUserId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { error } = await supabase.from("moderation_logs").insert({
      moderator_id: moderatorId,
      target_user_id: targetUserId,
      action,
      reason,
      sphere_id: sphereId || null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to log moderation action", error);
    return NextResponse.json({ error: "Unable to log action" }, { status: 500 });
  }
}

