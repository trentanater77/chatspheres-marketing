"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/components/providers/supabase-provider";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSearchParams, useRouter } from "next/navigation";

export default function AuthPage() {
  const { supabase, session } = useSupabase();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const plan = searchParams.get("plan");
  const next = searchParams.get("next");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session) {
      // If logged in, redirect to where they came from or pricing if plan is set
      if (plan) {
        router.push(`/pricing?plan=${plan}`);
      } else if (next) {
        router.push(next);
      } else {
        router.push("/spheres");
      }
    }
  }, [session, plan, next, router]);

  if (!mounted) return null;

  if (!supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F1DE] p-4 text-[#22223B]">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Connecting to authentication...</h1>
          <p className="mt-2 text-sm opacity-70">Please ensure your environment variables are set.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F1DE] p-4">
      <div className="w-full max-w-md rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-[0_20px_60px_rgba(34,34,59,0.1)] backdrop-blur-xl">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-[#22223B]">Welcome to Chatspheres</h1>
          <p className="mt-2 text-sm text-[#22223B]/70">
            {plan ? `Sign in to upgrade to the ${plan} plan` : "Sign in to join the conversation"}
          </p>
        </div>

        <div className="mt-8">
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
              className: {
                button: "rounded-full",
                input: "rounded-xl",
              },
            }}
            providers={["github", "google"]}
            redirectTo={`${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`}
            onlyThirdPartyProviders={false}
          />
        </div>
      </div>
    </div>
  );
}

