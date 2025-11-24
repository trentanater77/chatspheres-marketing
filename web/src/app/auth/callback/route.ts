import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/spheres";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase env vars missing for auth callback");
    return NextResponse.redirect(new URL(`/auth?error=missing-config&next=${encodeURIComponent(next)}`, request.url));
  }

  if (code) {
    try {
      const cookieStore = await cookies();
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      });

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("Supabase callback exchange failed", error);
        return NextResponse.redirect(new URL(`/auth?error=callback&next=${encodeURIComponent(next)}`, request.url));
      }
    } catch (error) {
      console.error("Auth callback blew up", error);
      return NextResponse.redirect(new URL(`/auth?error=callback&next=${encodeURIComponent(next)}`, request.url));
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
