import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export interface StripeSessionParams {
  amountMinor: number; // cents/pence
  currency: string; // usd | gbp | eur (lowercase)
  donorEmail: string;
  donorName: string;
  reference: string;
  campaignTitle: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createStripeCheckoutSession(
  params: StripeSessionParams
): Promise<{ url: string; sessionId: string }> {
  const stripe = getStripe();
  if (!stripe) {
    return {
      url: `/donate/success?gateway=stripe&reference=${encodeURIComponent(
        params.reference
      )}&demo=1`,
      sessionId: params.reference,
    };
  }
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: params.donorEmail,
    line_items: [
      {
        price_data: {
          currency: params.currency.toLowerCase(),
          product_data: {
            name: `UPHF Gift — ${params.campaignTitle}`,
            description: `Donor: ${params.donorName} • Ref ${params.reference}`,
          },
          unit_amount: Math.round(params.amountMinor),
        },
        quantity: 1,
      },
    ],
    metadata: { reference: params.reference, donorName: params.donorName },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });
  return { url: session.url ?? params.cancelUrl, sessionId: session.id };
}

export function verifyStripeSignature(
  rawBody: string,
  signature: string | null
): boolean {
  // Full verification happens in the webhook handler via stripe.webhooks.constructEvent.
  // This helper is a lightweight presence check used by middleware/logging.
  if (!process.env.STRIPE_WEBHOOK_SECRET) return true;
  return Boolean(signature);
}
