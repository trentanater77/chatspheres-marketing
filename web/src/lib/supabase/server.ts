import "server-only";

import { createServerClient } from "@supabase/ssr";

export function getSupabaseServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase service role env vars are missing");
  }

  return createServerClient(url, key, {
    cookies: {
      get() {
        return "";
      },
      set() {},
      remove() {},
    },
  });
}

