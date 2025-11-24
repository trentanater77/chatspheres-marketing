import { cache } from "react";
import { getSupabaseServiceRoleClient } from "./supabase/server";
import { featuredSpheres, recordings as mockRecordings, statBlocks as mockStats } from "@/data/mock";

type SphereRow = {
  slug: string;
  title: string;
  description: string;
  tags: string[] | null;
  creator_handle: string | null;
  live_count: number | null;
  spectator_count: number | null;
  recordings_count: number | null;
  last_recording_at: string | null;
  accent?: string | null;
};

export type LandingSphere = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  creator: string;
  liveCount: number;
  spectators: number;
  recordings: number;
  lastRecordingAt: string;
  category: string;
  accent?: string;
  isLive: boolean;
};

export type LandingRecording = {
  id: string;
  title: string;
  sphere_title: string;
  playback_url: string;
  duration_label: string;
};

export type LandingStats = {
  label: string;
  value: string;
  subtext: string;
};

type VideoRoom = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  status: string | null;
  is_private: boolean | null;
  created_at: string | null;
};

type MatchRequestRow = {
  id: string;
  user_id: string;
  moods: string[] | null;
  topic: string | null;
  status: string;
  created_at: string;
  room_slug?: string | null;
  sphere_slug?: string | null;
};

type ModerationLogRow = {
  id: number;
  moderator_id: string;
  target_user_id: string;
  action: string;
  reason: string | null;
  sphere_id: string | null;
  created_at: string;
  sphere_slug?: string | null;
  spectra?: number | null;
};

const allowMockData = process.env.NEXT_PUBLIC_ALLOW_MOCKS === "true" || process.env.NODE_ENV !== "production";
const hasSupabaseEnv =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function getSupabaseClient() {
  if (!hasSupabaseEnv) {
    return null;
  }
  try {
    return getSupabaseServiceRoleClient();
  } catch (error) {
    console.warn("Unable to instantiate Supabase client", error);
    return null;
  }
}

export const getLandingData = cache(async () => {
  const supabase = getSupabaseClient();

  if (!supabase) {
    console.warn("Supabase env vars missing or invalid, using mock landing data.");
    if (!allowMockData) {
      return {
        spheres: [],
        stats: [],
        recordings: [],
      };
    }
    return {
      spheres: featuredSpheres,
      stats: mockStats,
      recordings: mockRecordings,
    };
  }

  try {
    const [{ data: spheres, error: spheresError }, { data: statsRows, error: statsError }, { data: recs, error: recError }] =
      await Promise.all([
        supabase
          .from("spheres_public_view")
          .select(
            "slug, title, description, tags, creator_handle, live_count, spectator_count, recordings_count, last_recording_at, accent",
          )
          .order("live_count", { ascending: false })
          .limit(8),
        supabase.from("metrics_public_view").select("label, value, subtext").order("position").limit(6),
        supabase
          .from("recordings_public_view")
          .select("id, title, sphere_title, playback_url, duration_label")
          .order("recorded_at", { ascending: false })
          .limit(6),
      ]);

    const fallbackSpheres = allowMockData ? featuredSpheres : [];
    const fallbackStats = allowMockData ? mockStats : [];
    const fallbackRecordings = allowMockData ? mockRecordings : [];

    return {
      spheres: spheresError ? fallbackSpheres : normalizeSpheres(spheres),
      stats: statsError ? fallbackStats : statsRows ?? fallbackStats,
      recordings: recError ? fallbackRecordings : normalizeRecordings(recs),
    };
  } catch (error) {
    console.warn("Failed to fetch landing data, using mock defaults", error);
    if (!allowMockData) {
      return {
        spheres: [],
        stats: [],
        recordings: [],
      };
    }
    return {
      spheres: featuredSpheres,
      stats: mockStats,
      recordings: mockRecordings,
    };
  }
});

export const getExploreSpheres = cache(async () => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return allowMockData ? featuredSpheres : [];
  }

  try {
    const { data, error } = await supabase
      .from("spheres_public_view")
      .select(
        "slug, title, description, tags, creator_handle, live_count, spectator_count, recordings_count, last_recording_at, accent",
      )
      .order("live_count", { ascending: false })
      .limit(40);

    if (error) {
      console.warn("Failed to load spheres, using mock data", error);
      return allowMockData ? featuredSpheres : [];
    }
    return normalizeSpheres(data);
  } catch (error) {
    console.warn("Failed to load spheres, using mock data", error);
    return allowMockData ? featuredSpheres : [];
  }
});

export const getRecordingLibrary = cache(async () => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return allowMockData ? mockRecordings : [];
  }

  try {
    const { data, error } = await supabase
      .from("recordings_public_view")
      .select("id, title, sphere_title, playback_url, duration_label")
      .order("recorded_at", { ascending: false })
      .limit(24);

    if (error) {
      console.warn("Failed to load recordings, using mock data", error);
      return allowMockData ? mockRecordings : [];
    }
    return normalizeRecordings(data);
  } catch (error) {
    console.warn("Failed to load recordings, using mock data", error);
    return allowMockData ? mockRecordings : [];
  }
});

export const getSphereBySlug = cache(async (slug: string) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    const fallback = featuredSpheres.find((s) => s.slug === slug);
    if (!allowMockData) {
      return { sphere: null, rooms: [] as VideoRoom[] };
    }
    return { sphere: fallback || null, rooms: [] as VideoRoom[] };
  }

  try {
    const { data: sphere, error } = await supabase
      .from("spheres_public_view")
      .select(
        "id, slug, title, description, tags, creator_handle, live_count, spectator_count, recordings_count, last_recording_at, accent, created_at",
      )
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw error;
    }
    if (!sphere) {
      return { sphere: null, rooms: [] as VideoRoom[] };
    }

    const { data: rooms, error: roomError } = await supabase
      .from("video_rooms")
      .select("id, slug, title, description, status, is_private, created_at")
      .eq("sphere_id", sphere.id)
      .order("created_at", { ascending: false })
      .limit(24);

    if (roomError) {
      throw roomError;
    }

    const normalized = normalizeSpheres([sphere as SphereRow])[0];
    return { sphere: normalized, rooms: rooms ?? [] };
  } catch (error) {
    console.warn("Failed to fetch sphere detail", error);
    return { sphere: null, rooms: [] as VideoRoom[] };
  }
});

export const getMatchRequests = cache(async (limit = 20) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return [] as MatchRequestRow[];
  }
  try {
    const { data, error } = await supabase
      .from("match_requests")
      .select("id, user_id, moods, topic, status, created_at, room_slug, sphere_slug")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      throw error;
    }
    return data ?? [];
  } catch (error) {
    console.warn("Failed to load match requests", error);
    return [];
  }
});

export const getModerationLogs = cache(async (limit = 20) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return [] as ModerationLogRow[];
  }
  try {
    const { data, error } = await supabase
      .from("moderation_logs")
      .select("id, moderator_id, target_user_id, action, reason, sphere_id, created_at, sphere_slug")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      throw error;
    }
    return data ?? [];
  } catch (error) {
    console.warn("Failed to load moderation logs", error);
    return [];
  }
});

function normalizeSpheres(rows: SphereRow[] | null): LandingSphere[] {
  if (!rows?.length) {
    return [];
  }

  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    description: row.description,
    tags: Array.isArray(row.tags) ? row.tags : [],
    creator: row.creator_handle || "Chatspheres Creator",
    liveCount: row.live_count ?? 0,
    spectators: row.spectator_count ?? 0,
    recordings: row.recordings_count ?? 0,
    category: "community",
    accent: row.accent || undefined,
    lastRecordingAt: row.last_recording_at || "Recently",
    isLive: (row.live_count ?? 0) > 0,
  }));
}

function normalizeRecordings(rows: LandingRecording[] | null) {
  if (!rows?.length) {
    return allowMockData ? mockRecordings : [];
  }

  return rows.map((row) => ({
    title: row.title,
    sphere: row.sphere_title,
    length: row.duration_label || "Replay",
    url: row.playback_url || "#",
  }));
}

