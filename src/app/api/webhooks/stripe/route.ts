import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { db } from "@/db";
import { donations } from "@/db/schema";
import { sendDonorReceipt } from "@/lib/email";
import { formatMoney } from "@/lib/currency";
import type { Currency } from "@/types/database";

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  let reference: string | null = null;

  if (stripeKey && webhookSecret && signature) {
    try {
      const stripe = new Stripe(stripeKey);
      const event = stripe.webhooks.constructEvent(raw, signature, webhookSecret);
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        reference = (session.metadata?.reference as string | undefined) ?? (session.id as string);
      } else {
        return NextResponse.json({ received: true, ignored: event.type });
      }
    } catch (err) {
      console.error("[stripe webhook] signature failed", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } else {
    // Demo / unconfigured mode: accept JSON { reference }
    try {
      const j = JSON.parse(raw) as { reference?: string; type?: string };
      reference = j.reference ?? null;
      if (!reference) return NextResponse.json({ received: true });
    } catch {
      return NextResponse.json({ received: true });
    }
  }

  if (!reference) return NextResponse.json({ received: true });

  try {
    // Match by gateway reference OR stripe session id
    const rows = await db.select().from(donations).where(eq(donations.gatewayReference, reference)).limit(1);
    const donation = rows[0];
    if (!donation) return NextResponse.json({ received: true, unknown: true });
    if (donation.paymentStatus === "VERIFIED") {
      return NextResponse.json({ received: true, already: true });
    }

    await db
      .update(donations)
      .set({ paymentStatus: "VERIFIED", verifiedAt: new Date() })
      .where(eq(donations.gatewayReference, reference));

    try {
      await sendDonorReceipt({
        to: donation.donorEmail,
        donorName: donation.donorName,
        amountLabel: formatMoney(Number(donation.amount), (donation.currency ?? "USD") as Currency),
        campaignTitle: "University of Port Harcourt Foundation",
        reference,
        gateway: "Stripe",
      });
    } catch (e) {
      console.error("[stripe webhook] receipt failed", e);
    }

    revalidatePath("/campaigns");
    revalidatePath("/stewardship");
    revalidatePath("/");
  } catch (err) {
    console.error("[stripe webhook]", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
