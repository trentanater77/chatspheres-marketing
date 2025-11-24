"use client";

import { useState } from "react";
import { planTiers } from "@/config/site";
import { Button } from "./ui/button";
import { useSupabase } from "./providers/supabase-provider";
import { UpgradeButton } from "./upgrade-button";

export function PricingTable() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { openAuth, session } = useSupabase();

  return (
    <div className="rounded-3xl border border-white/50 bg-white/70 p-6 shadow-[0_25px_80px_rgba(34,34,59,0.12)]">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-[#e63946] font-bold">
            pricing
          </p>
          <h2 className="text-3xl font-extrabold text-[#22223B]">
            Generous by default, paid when you scale.
          </h2>
        </div>
        <div className="inline-flex rounded-full border border-[#22223B]/10 bg-white/80 p-1 text-xs font-bold uppercase">
          <button
            className={`rounded-full px-4 py-1 ${
              billingCycle === "monthly" ? "bg-[#FFD166]" : "text-[#22223B]/60"
            }`}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </button>
          <button
            className={`rounded-full px-4 py-1 ${
              billingCycle === "yearly" ? "bg-[#FFD166]" : "text-[#22223B]/60"
            }`}
            onClick={() => setBillingCycle("yearly")}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {planTiers.map((plan) => {
          const price =
            billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly || plan.priceMonthly;
          const isFree = price === 0;
          const priceId =
            billingCycle === "monthly" ? plan.priceMonthlyId ?? plan.productIdMonthly : plan.priceYearlyId ?? plan.productIdYearly;

          return (
            <div
              key={plan.name}
              className="flex h-full flex-col rounded-3xl border border-[#22223B]/10 bg-white/80 p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#22223B]/70">
                  {plan.name}
                </p>
                {plan.tag && (
                  <span className="rounded-full bg-[#FFB6B9]/40 px-3 py-1 text-xs font-bold text-[#e63946]">
                    {plan.tag}
                  </span>
                )}
              </div>

              <p className="text-4xl font-extrabold text-[#22223B]">
                {isFree ? (
                  "Free"
                ) : (
                  <>
                    ${price}
                    <span className="text-base font-semibold text-[#22223B]/70">
                      /{billingCycle === "monthly" ? "mo" : "yr"}
                    </span>
                  </>
                )}
              </p>
              <p className="mt-2 text-sm text-[#22223B]/80">{plan.description}</p>

              <ul className="mt-4 flex-1 space-y-2 text-sm text-[#22223B]">
                {plan.limits.map((limit) => (
                  <li key={limit} className="flex gap-2">
                    <span className="text-[#e63946]">•</span>
                    <span>{limit}</span>
                  </li>
                ))}
              </ul>

              {isFree ? (
                <Button
                  className="mt-6"
                  variant={plan.adSupported ? "secondary" : "primary"}
                  onClick={() => (session ? window.location.assign(plan.freeRedirect || "/") : openAuth())}
                >
                  {session ? "Open dashboard" : "Get started"}
                </Button>
              ) : (
                <div className="mt-6">
                  <UpgradeButton
                    priceId={priceId}
                    label={`Upgrade to ${plan.name}`}
                    planName={plan.name}
                    variant={plan.adSupported ? "secondary" : "primary"}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

