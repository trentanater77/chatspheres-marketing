import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceRoleClient();
    const body = await request.json();
    const { topicName, description, tags, userId } = body;

    if (!topicName || !userId) {
      return NextResponse.json({ error: "topicName and userId are required" }, { status: 400 });
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

