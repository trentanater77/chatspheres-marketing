import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

export async function getStripeSession(sessionId: string) {
  if (!stripe) {
    return null;
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error("Failed to retrieve Stripe session", error);
    return null;
  }
}

