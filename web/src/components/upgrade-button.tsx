"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useSupabase } from "./providers/supabase-provider";

type Props = {
  priceId?: string | null;
  label: string;
  planName: string;
  variant?: "primary" | "secondary" | "ghost";
};

export function UpgradeButton({ priceId, label, planName, variant = "primary" }: Props) {
  const [loading, setLoading] = useState(false);
  const { openAuth, session } = useSupabase();

  const handleClick = async () => {
    if (!session) {
      openAuth();
      return;
    }

    if (!priceId) {
      alert("Stripe price ID is not configured yet. Please contact support.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          planName,
          userId: session.user.id,
          customerEmail: session.user.email,
        }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert("Unable to start checkout. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <Button variant={variant} disabled={loading} onClick={handleClick}>
      {loading ? "Redirecting..." : label}
    </Button>
  );
}

