"use client";

import { ButtonLink, Button } from "./ui/button";
import { siteLinks } from "@/lib/utils";
import { useSupabase } from "./providers/supabase-provider";
import { useRouter } from "next/navigation";

export function HeroCtas() {
  const { session, openAuth } = useSupabase();
  const router = useRouter();

  const handleSparkClick = () => {
    if (session) {
      router.push(siteLinks.dashboard);
      return;
    }
    openAuth();
  };

  return (
    <div className="flex flex-wrap gap-4">
      <ButtonLink href={siteLinks.launchHost()}>{`Launch ${siteLinks.defaultSphereSlug}`}</ButtonLink>
      <Button variant="secondary" onClick={handleSparkClick}>
        {session ? "Open your dashboard" : "Start free (Spark)"}
      </Button>
    </div>
  );
}

