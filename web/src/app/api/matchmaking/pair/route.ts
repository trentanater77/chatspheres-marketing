import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceRoleClient();
    const { requestId } = await request.json();

    if (!requestId) {
      return NextResponse.json({ error: "requestId required" }, { status: 400 });
    }

    const { data: current, error: currentError } = await supabase
      .from("match_requests")
      .select("*")
      .eq("id", requestId)
      .maybeSingle();
    if (currentError || !current) {
      return NextResponse.json({ error: "Current request not found" }, { status: 404 });
    }

    const { data: partner, error: partnerError } = await supabase
      .from("match_requests")
      .select("*")
      .eq("status", "waiting")
      .neq("id", requestId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (partnerError || !partner) {
      return NextResponse.json({ error: "No partner request available yet" }, { status: 409 });
    }

    const roomSlug = `match-${nanoid(8)}`;
    const updates = [
      supabase.from("match_requests").update({ status: "paired", room_slug: roomSlug }).eq("id", current.id),
      supabase.from("match_requests").update({ status: "paired", room_slug: roomSlug }).eq("id", partner.id),
    ];
    const results = await Promise.all(updates);
    const failed = results.find(({ error }) => error);
    if (failed?.error) {
      throw failed.error;
    }

    return NextResponse.json({
      roomSlug,
      pairedIds: [current.id, partner.id],
      message: "Match found! LiveKit controller can now open the room.",
    });
  } catch (error) {
    console.error("Failed to pair matchmaking request", error);
    return NextResponse.json({ error: "Unable to pair right now" }, { status: 500 });
  }
}

