"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    const syncSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!cancelled) {
        setSession(session);
      }
    };

    syncSession();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        setAuthOpen(false);
      }
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

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
      {supabase && <AuthPortal open={isAuthOpen} onClose={() => setAuthOpen(false)} supabase={supabase} />}
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

