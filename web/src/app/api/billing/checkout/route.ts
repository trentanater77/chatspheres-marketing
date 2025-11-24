import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chatspheres.com";

const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured yet." }, { status: 500 });
  }

  const { priceId, planName, userId, customerEmail } = await request.json();

  if (!priceId) {
    return NextResponse.json({ error: "Missing priceId parameter" }, { status: 400 });
  }

  const supabase = getSupabaseServiceRoleClient();

  const getOrCreateCustomer = async () => {
    if (!userId || !supabase) return null;
    const { data } = await supabase.from("profiles").select("stripe_customer_id").eq("user_id", userId).maybeSingle();
    let customerId = data?.stripe_customer_id ?? null;

    if (!customerId) {
      const customer = await stripe!.customers.create({
        email: customerEmail || undefined,
        metadata: { userId },
      });
      customerId = customer.id;
      await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("user_id", userId);
    }
    return customerId;
  };

  try {
    const customerId = await getOrCreateCustomer();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      customer: customerId || undefined,
      customer_email: customerId ? undefined : customerEmail || undefined,
      success_url: `${siteUrl}/pricing?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing?status=cancelled`,
      metadata: {
        planName: planName || "",
        userId: userId || "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Stripe error";
    console.error("Stripe checkout session failed", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

