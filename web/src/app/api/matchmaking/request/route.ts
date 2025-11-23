import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceRoleClient();
    const body = await request.json();
    const { moods, topic, userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const { error } = await supabase.from("match_requests").insert({
      user_id: userId,
      moods,
      topic,
      status: "waiting",
      created_at: new Date().toISOString(),
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to queue matchmaking request", error);
    return NextResponse.json({ error: "Unable to submit request" }, { status: 500 });
  }
}

