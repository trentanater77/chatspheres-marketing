import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceRoleClient();
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q") ?? "";
    const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);
    const cursor = searchParams.get("cursor");
    const sort = searchParams.get("sort") ?? "new";
    const slug = searchParams.get("slug");

    let query = supabase
      .from("spheres_public_view")
      .select(
        "id, slug, title, description, tags, creator_handle, live_count, spectator_count, recordings_count, last_recording_at, accent, created_at",
      )
      .limit(limit);

    if (slug) {
      query = query.eq("slug", slug);
    }

    if (q) {
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,tags.cs.{${q}}`);
    }

    if (cursor) {
      query = query.gt("created_at", cursor);
    }

    if (sort === "live") {
      query = query.order("live_count", { ascending: false });
    } else if (sort === "popular") {
      query = query.order("spectator_count", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    return NextResponse.json({ spheres: data });
  } catch (error) {
    console.error("Failed to search spheres", error);
    return NextResponse.json(
      { error: "Unable to load spheres right now. Please try again shortly." },
      { status: 500 },
    );
  }
}

