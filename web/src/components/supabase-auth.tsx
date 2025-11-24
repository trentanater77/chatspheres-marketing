"use client";

import { Dialog } from "@headlessui/react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Button } from "./ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  supabase: SupabaseClient | null;
};

export function SupabaseAuthPortal({ open, onClose, supabase }: Props) {
  if (!supabase) return null;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "") ||
    "https://chatspheres.com";
  const redirectTo = `${siteUrl.replace(/\/$/, "")}/auth/callback`;

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
              redirectTo={redirectTo}
            />
          </div>
          <Button variant="ghost" className="mt-4 w-full" onClick={onClose}>
            Close
          </Button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}



