import "server-only";

import { createServerClient } from "@supabase/ssr";

function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }
  return url;
}

function noopCookies() {
  return {
    get() {
      return undefined;
    },
    set() {},
    remove() {},
  };
}

export function getSupabaseServerClient() {
  const url = getSupabaseUrl();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createServerClient(url, anonKey, {
    cookies: noopCookies(),
  });
}

export function getSupabaseServiceRoleClient() {
  const url = getSupabaseUrl();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    throw new Error("Supabase service role env vars are missing");
  }

  return createServerClient(url, serviceKey, {
    cookies: noopCookies(),
  });
}


