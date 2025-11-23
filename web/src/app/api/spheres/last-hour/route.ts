import { NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = getSupabaseServiceRoleClient();
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("spheres_public_view")
      .select(
        "id, slug, title, description, tags, creator_handle, live_count, spectator_count, recordings_count, last_recording_at, created_at, accent",
      )
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      throw error;
    }

    return NextResponse.json({ spheres: data });
  } catch (error) {
    console.error("Failed to fetch last hour spheres", error);
    return NextResponse.json({ error: "Unable to fetch spheres" }, { status: 500 });
  }
}

