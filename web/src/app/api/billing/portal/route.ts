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
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }
    const supabase = getSupabaseServiceRoleClient();
    const { data, error } = await supabase.from("profiles").select("stripe_customer_id").eq("user_id", userId).maybeSingle();
    if (error) {
      throw error;
    }
    if (!data?.stripe_customer_id) {
      return NextResponse.json({ error: "No Stripe customer on file yet." }, { status: 404 });
    }
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: `${siteUrl}/pricing`,
    });
    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Failed to create billing portal session", error);
    return NextResponse.json({ error: "Unable to open billing portal" }, { status: 500 });
  }
}



