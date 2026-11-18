import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { campaigns, donations } from "@/db/schema";
import { donationInitSchema } from "@/lib/validations";
import { toNgn, formatMoney } from "@/lib/currency";
import { initializePaystackTransaction } from "@/lib/payments/paystack";
import { createStripeCheckoutSession } from "@/lib/payments/stripe";
import type { Currency } from "@/types/database";

function pledgeRef(): string {
  const d = new Date();
  const y = d.getFullYear();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `UPHF-${y}-${rand}`;
}

function gatewayRef(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

const MINOR_PER_UNIT: Record<Currency, number> = { NGN: 100, USD: 100, GBP: 100, EUR: 100 };

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = donationInitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") },
        { status: 400 }
      );
    }
    const input = parsed.data;
    const currency = input.currency as Currency;

    // Resolve campaign (null = untied general endowment)
    let campaignId: string | null = null;
    let campaignTitle = "Untied General Endowment Fund";
    if (input.campaignSlug) {
      try {
        const rows = await db.select().from(campaigns).where(eq(campaigns.slug, input.campaignSlug)).limit(1);
        if (rows[0]) {
          campaignId = rows[0].id;
          campaignTitle = rows[0].title;
        }
      } catch {
        // DB unavailable — proceed with untied fund labelling
        campaignTitle = input.campaignSlug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      }
    }

    const amountNgn = toNgn(input.amount, currency);
    const pledge = pledgeRef();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;

    // BANK WIRE — create PENDING pledge, return instructions (verified later by admin)
    if (input.gateway === "BANK_WIRE") {
      const ref = gatewayRef("wire");
      try {
        await db.insert(donations).values({
          campaignId,
          donorName: input.donorName,
          donorEmail: input.donorEmail,
          organization: input.organization || null,
          amount: String(input.amount),
          currency,
          amountNgnEquivalent: amountNgn,
          isAlumni: input.isAlumni,
          graduationYear: input.graduationYear ?? null,
          displayOnDonorWall: input.displayOnDonorWall,
          paymentStatus: "PENDING",
          paymentGateway: "BANK_WIRE",
          gatewayReference: ref,
          pledgeReference: pledge,
        });
      } catch {
        // DB unavailable in demo — still return pledge so UX continues
      }
      return NextResponse.json({
        mode: "wire",
        pledgeReference: pledge,
        gatewayReference: ref,
        amountLabel: formatMoney(input.amount, currency),
        campaignTitle,
      });
    }

    // NGN → Paystack
    if (currency === "NGN") {
      const ref = gatewayRef("ps");
      try {
        await db.insert(donations).values({
          campaignId,
          donorName: input.donorName,
          donorEmail: input.donorEmail,
          organization: input.organization || null,
          amount: String(input.amount),
          currency,
          amountNgnEquivalent: amountNgn,
          isAlumni: input.isAlumni,
          graduationYear: input.graduationYear ?? null,
          displayOnDonorWall: input.displayOnDonorWall,
          paymentStatus: "PENDING",
          paymentGateway: "PAYSTACK",
          gatewayReference: ref,
          pledgeReference: pledge,
        });
      } catch {
        // continue in demo mode
      }
      const callbackUrl = `${appUrl}/donate/success?gateway=paystack&reference=${encodeURIComponent(ref)}`;
      const { authorizationUrl } = await initializePaystackTransaction({
        email: input.donorEmail,
        amountKobo: Math.round(input.amount * MINOR_PER_UNIT.NGN),
        reference: ref,
        callbackUrl,
        metadata: { pledgeReference: pledge, campaignTitle, donorName: input.donorName },
      });
      return NextResponse.json({ mode: "redirect", checkoutUrl: authorizationUrl, reference: ref, pledgeReference: pledge });
    }

    // USD/GBP/EUR → Stripe Checkout
    const ref = gatewayRef("st");
    try {
      await db.insert(donations).values({
        campaignId,
        donorName: input.donorName,
        donorEmail: input.donorEmail,
        organization: input.organization || null,
        amount: String(input.amount),
        currency,
        amountNgnEquivalent: amountNgn,
        isAlumni: input.isAlumni,
        graduationYear: input.graduationYear ?? null,
        displayOnDonorWall: input.displayOnDonorWall,
        paymentStatus: "PENDING",
        paymentGateway: "STRIPE",
        gatewayReference: ref,
        pledgeReference: pledge,
      });
    } catch {
      // continue in demo mode
    }
    const successUrl = `${appUrl}/donate/success?gateway=stripe&reference=${encodeURIComponent(ref)}`;
    const cancelUrl = `${appUrl}/donate?campaign=${encodeURIComponent(input.campaignSlug ?? "")}`;
    const { url } = await createStripeCheckoutSession({
      amountMinor: Math.round(input.amount * 100),
      currency: currency.toLowerCase(),
      donorEmail: input.donorEmail,
      donorName: input.donorName,
      reference: ref,
      campaignTitle,
      successUrl,
      cancelUrl,
    });
    return NextResponse.json({ mode: "redirect", checkoutUrl: url, reference: ref, pledgeReference: pledge });
  } catch (err) {
    console.error("[donations/init]", err);
    return NextResponse.json({ error: "Could not initialise donation" }, { status: 500 });
  }
}
