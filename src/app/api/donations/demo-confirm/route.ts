import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { donations } from "@/db/schema";
import { isDemoPayments, isDemoReference } from "@/lib/payments/demo";
import { sendDonorReceipt } from "@/lib/email";
import { formatMoney } from "@/lib/currency";
import type { Currency } from "@/types/database";

/**
 * Simulated payment confirmation for the demo gateway.
 *
 * Only rehearsal gifts (reference prefix `demo_`) can be confirmed here, and
 * only while demo payments are enabled — so this endpoint can never be used to
 * mark a real gateway gift as paid.
 */
export async function POST(req: Request) {
  if (!isDemoPayments()) {
    return NextResponse.json({ error: "Demo payments are disabled" }, { status: 403 });
  }

  let reference = "";
  try {
    const body = (await req.json()) as { reference?: string };
    reference = body.reference ?? "";
  } catch {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }

  if (!isDemoReference(reference)) {
    return NextResponse.json({ error: "Not a demo reference" }, { status: 400 });
  }

  try {
    const rows = await db.select().from(donations).where(eq(donations.gatewayReference, reference)).limit(1);
    const donation = rows[0];
    if (!donation) {
      return NextResponse.json({ error: "Gift not found. Was the database reachable?" }, { status: 404 });
    }

    if (donation.paymentStatus !== "VERIFIED") {
      // The increment_campaign_totals() trigger bumps campaign totals exactly once.
      await db
        .update(donations)
        .set({ paymentStatus: "VERIFIED", verifiedAt: new Date() })
        .where(eq(donations.id, donation.id));

      try {
        await sendDonorReceipt({
          to: donation.donorEmail,
          donorName: donation.donorName,
          amountLabel: formatMoney(Number(donation.amount), (donation.currency ?? "NGN") as Currency),
          campaignTitle: "University of Port Harcourt Foundation",
          reference: donation.pledgeReference ?? reference,
          gateway: "Demo gateway (simulated)",
        });
      } catch (e) {
        console.error("[demo-confirm] receipt skipped", e);
      }
    }

    revalidatePath("/");
    revalidatePath("/campaigns");
    revalidatePath("/stewardship");
    revalidatePath("/donate/success");

    return NextResponse.json({
      ok: true,
      reference,
      pledgeReference: donation.pledgeReference,
      displayOnDonorWall: donation.displayOnDonorWall,
      amountNgn: Number(donation.amountNgnEquivalent ?? 0),
    });
  } catch (err) {
    console.error("[demo-confirm]", err);
    return NextResponse.json({ error: "Could not confirm the simulated payment" }, { status: 500 });
  }
}
