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

    const fallbackSpheres = featuredSpheres;
    const fallbackStats = mockStats;
    const fallbackRecordings = mockRecordings;

    return {
      spheres: spheresError ? fallbackSpheres : normalizeSpheres(spheres),
      stats: statsError ? fallbackStats : statsRows ?? fallbackStats,
      recordings: recError ? fallbackRecordings : normalizeRecordings(recs),
    };
  } catch (error) {
    console.warn("Failed to fetch landing data, using mock defaults", error);
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
    return featuredSpheres;
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
      return featuredSpheres;
    }
    return normalizeSpheres(data);
  } catch (error) {
    console.warn("Failed to load spheres, using mock data", error);
    return featuredSpheres;
  }
});

export const getRecordingLibrary = cache(async () => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return mockRecordings;
  }

  try {
    const { data, error } = await supabase
      .from("recordings_public_view")
      .select("id, title, sphere_title, playback_url, duration_label")
      .order("recorded_at", { ascending: false })
      .limit(24);

    if (error) {
      console.warn("Failed to load recordings, using mock data", error);
      return mockRecordings;
    }
    return normalizeRecordings(data);
  } catch (error) {
    console.warn("Failed to load recordings, using mock data", error);
    return mockRecordings;
  }
});

function normalizeSpheres(rows: SphereRow[] | null): LandingSphere[] {
  if (!rows?.length) {
    return featuredSpheres;
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
    return mockRecordings;
  }

  return rows.map((row) => ({
    title: row.title,
    sphere: row.sphere_title,
    length: row.duration_label || "Replay",
    url: row.playback_url || "#",
  }));
}

