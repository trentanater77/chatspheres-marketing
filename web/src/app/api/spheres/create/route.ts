import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";

export const runtime = "nodejs";

const PLAN_LIMITS: Record<string, number | null> = {
  spark: 5,
  "spark+": 10,
  orbit: 25,
  constellation: null,
};

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceRoleClient();
    const body = await request.json();
    const { topicName, description, tags, userId } = body;

    if (!topicName || !userId) {
      return NextResponse.json({ error: "topicName and userId are required" }, { status: 400 });
    }

    const { data: statsRow } = await supabase
      .from("user_stats")
      .select("account_tier")
      .eq("user_id", userId)
      .maybeSingle();
    const tier = (statsRow?.account_tier || "spark").toLowerCase();
    const maxSpheres = PLAN_LIMITS[tier] ?? PLAN_LIMITS.spark;

    if (maxSpheres !== null) {
      const { count } = await supabase
        .from("spheres")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);
      if ((count ?? 0) >= maxSpheres) {
        return NextResponse.json(
          {
            error: `Your ${tier.toUpperCase()} plan allows up to ${maxSpheres} spheres. Upgrade in the Plan Usage panel for more headroom.`,
            code: "sphere_limit_reached",
          },
          { status: 403 },
        );
      }
    }

    const slugBase = topicName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const slug = `${slugBase || "sphere"}-${nanoid(4)}`;

    const { data, error } = await supabase
      .from("spheres")
      .insert({
        topic_name: topicName,
        description: description || "",
        tags: tags || [],
        slug,
        user_id: userId,
        created_at: new Date().toISOString(),
      })
      .select("id, slug")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ sphere: data });
  } catch (error) {
    console.error("Failed to create sphere", error);
    return NextResponse.json({ error: "Unable to create sphere" }, { status: 500 });
  }
}

