import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chatspheres.com";

const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured yet." }, { status: 500 });
  }

  const { priceId, planName } = await request.json();

  if (!priceId) {
    return NextResponse.json({ error: "Missing priceId parameter" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      success_url: `${siteUrl}/pricing?status=success`,
      cancel_url: `${siteUrl}/pricing?status=cancelled`,
      metadata: {
        planName: planName || "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Stripe error";
    console.error("Stripe checkout session failed", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

