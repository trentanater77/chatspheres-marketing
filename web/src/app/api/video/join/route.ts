import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";

export const runtime = "nodejs";

type JoinPayload = {
  sphereId?: string;
  sphereSlug?: string;
  topicName?: string;
  description?: string;
  tags?: string[];
  userId?: string;
  username?: string;
  isPrivate?: boolean;
};

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceRoleClient();
    const body = (await request.json()) as JoinPayload;
    const now = new Date().toISOString();

    let sphereId = body.sphereId;
    let sphereSlug = body.sphereSlug;

    let sphere = null;

    if (sphereId) {
      const { data, error } = await supabase
        .from("spheres")
        .select("*")
        .eq("id", sphereId)
        .maybeSingle();
      if (error) throw error;
      sphere = data;
      sphereSlug = sphere?.slug ?? sphereSlug;
    }

    if (!sphere) {
      const slug = sphereSlug || (body.topicName ? body.topicName.toLowerCase().replace(/\s+/g, "-") : `sphere-${nanoid(6)}`);
      const { data, error } = await supabase
        .from("spheres")
        .insert({
          slug,
          topic_name: body.topicName || "New Sphere",
          description: body.description || "Conversation awaiting a description",
          tags: body.tags || [],
          created_at: now,
          user_id: body.userId || null,
        })
        .select()
        .single();
      if (error) throw error;
      sphere = data;
      sphereId = data.id;
      sphereSlug = data.slug;
    }

    const livekitRoomName = `sphere-${sphereSlug}-${nanoid(8)}`;
    const slug = `${sphereSlug}-${nanoid(10)}`;

    const { data: videoRoom, error: roomError } = await supabase
      .from("video_rooms")
      .insert({
        sphere_id: sphereId,
        slug,
        title: body.topicName || sphere.topic_name || "Chatsphere Room",
        description: body.description || sphere.description,
        participant_1_id: body.userId || null,
        status: "waiting",
        is_private: body.isPrivate ?? false,
        livekit_room_name: livekitRoomName,
        created_at: now,
      })
      .select()
      .single();

    if (roomError) {
      throw roomError;
    }

    return NextResponse.json({
      sphere,
      room: videoRoom,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to join room";
    console.error("Failed to join room", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

