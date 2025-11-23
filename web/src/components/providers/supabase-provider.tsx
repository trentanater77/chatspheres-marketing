"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type SupabaseContextValue = {
  supabase: SupabaseClient | null;
  session: Session | null;
  setSession: (session: Session | null) => void;
  openAuth: () => void;
};

const SupabaseContext = createContext<SupabaseContextValue | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthOpen, setAuthOpen] = useState(false);

  const value = useMemo(
    () => ({
      supabase,
      session,
      setSession,
      openAuth: () => setAuthOpen(true),
    }),
    [supabase, session],
  );

  return (
    <SupabaseContext.Provider value={value}>
      {children}
      {supabase && (
        <AuthPortal open={isAuthOpen} onClose={() => setAuthOpen(false)} supabase={supabase} setSession={setSession} />
      )}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const ctx = useContext(SupabaseContext);
  if (!ctx) {
    throw new Error("useSupabase must be used within SupabaseProvider");
  }
  return ctx;
}

import dynamic from "next/dynamic";

const AuthPortal = dynamic(() => import("../supabase-auth").then((mod) => mod.SupabaseAuthPortal), {
  ssr: false,
});

