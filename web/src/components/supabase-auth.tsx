"use client";

import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Button } from "./ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  supabase: SupabaseClient | null;
  setSession: (session: Session | null) => void;
};

export function SupabaseAuthPortal({ open, onClose, supabase, setSession }: Props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        onClose();
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase, setSession, onClose]);

  if (!supabase) return null;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-[999]">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
          <Dialog.Title className="text-center text-2xl font-bold text-[#22223B]">
            Sign in to Chatspheres
          </Dialog.Title>
          <p className="mt-1 text-center text-sm text-[#22223B]/70">
            Use Supabase auth for both marketing and sphere experiences.
          </p>
          <div className="mt-6">
            {loading ? (
              <p className="text-center text-sm text-[#22223B]/70">Loading auth widget…</p>
            ) : (
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: "#E63946",
                        brandAccent: "#FFD166",
                      },
                    },
                  },
                }}
                providers={["github", "google"]}
                redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL || "https://chatspheres.com"}/auth/callback`}
              />
            )}
          </div>
          <Button variant="ghost" className="mt-4 w-full" onClick={onClose}>
            Close
          </Button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}



