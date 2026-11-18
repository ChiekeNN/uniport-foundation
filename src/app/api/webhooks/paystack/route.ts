import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { donations } from "@/db/schema";
import { verifyPaystackSignature } from "@/lib/payments/paystack";
import { sendDonorReceipt } from "@/lib/email";
import { formatMoney } from "@/lib/currency";
import type { Currency } from "@/types/database";

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!verifyPaystackSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string; status?: string; amount?: number; customer?: { email?: string } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }

  // Idempotent: only act on successful charge events
  if (event.event !== "charge.success" || !event.data?.reference) {
    return NextResponse.json({ received: true });
  }

  const reference = event.data.reference;

  try {
    const rows = await db.select().from(donations).where(eq(donations.gatewayReference, reference)).limit(1);
    const donation = rows[0];
    if (!donation) return NextResponse.json({ received: true, unknown: true });

    // Idempotency: already verified → no-op (trigger also guards double-count)
    if (donation.paymentStatus === "VERIFIED") {
      return NextResponse.json({ received: true, already: true });
    }

    // Transition PENDING → VERIFIED. The `increment_campaign_totals()` trigger
    // atomically bumps campaigns.amount_raised_ngn + donor_count.
    await db
      .update(donations)
      .set({ paymentStatus: "VERIFIED", verifiedAt: new Date() })
      .where(eq(donations.gatewayReference, reference));

    try {
      await sendDonorReceipt({
        to: donation.donorEmail,
        donorName: donation.donorName,
        amountLabel: formatMoney(Number(donation.amount), (donation.currency ?? "NGN") as Currency),
        campaignTitle: "University of Port Harcourt Foundation",
        reference,
        gateway: "Paystack",
      });
    } catch (e) {
      console.error("[paystack webhook] receipt failed", e);
    }

    revalidatePath("/campaigns");
    revalidatePath("/stewardship");
    revalidatePath("/");
  } catch (err) {
    console.error("[paystack webhook]", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
