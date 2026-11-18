import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, or } from "drizzle-orm";
import { db } from "@/db";
import { donations } from "@/db/schema";
import { sendDonorReceipt } from "@/lib/email";
import { formatMoney } from "@/lib/currency";
import type { Currency } from "@/types/database";

export async function GET() {
  const jar = await cookies();
  if (jar.get("uphf_admin")?.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const rows = await db.select().from(donations).where(eq(donations.paymentStatus, "PENDING"));
    // Redact emails for non-service contexts? Admin is authorised — return full rows (newest first, capped).
    return NextResponse.json({ pledges: rows.slice(0, 100) });
  } catch {
    return NextResponse.json({ pledges: [] });
  }
}

export async function POST(req: Request) {
  const jar = await cookies();
  if (jar.get("uphf_admin")?.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { reference, action } = (await req.json()) as { reference?: string; action?: "verify" | "fail" };
    if (!reference) return NextResponse.json({ error: "reference required" }, { status: 400 });
    const rows = await db
      .select()
      .from(donations)
      .where(or(eq(donations.gatewayReference, reference), eq(donations.pledgeReference, reference)))
      .limit(1);
    const donation = rows[0];
    if (!donation) return NextResponse.json({ error: "Pledge not found" }, { status: 404 });
    if (donation.paymentStatus === "VERIFIED" && action === "verify") {
      return NextResponse.json({ ok: true, already: true });
    }
    await db
      .update(donations)
      .set({
        paymentStatus: action === "fail" ? "FAILED" : "VERIFIED",
        verifiedAt: action === "fail" ? null : new Date(),
      })
      .where(eq(donations.id, donation.id));

    if (action !== "fail") {
      try {
        await sendDonorReceipt({
          to: donation.donorEmail,
          donorName: donation.donorName,
          amountLabel: formatMoney(Number(donation.amount), (donation.currency ?? "NGN") as Currency),
          campaignTitle: "University of Port Harcourt Foundation",
          reference: donation.pledgeReference ?? reference,
          gateway: "Bank Wire (verified)",
        });
      } catch (e) {
        console.error("[verify-pledge] receipt failed", e);
      }
    }

    revalidatePath("/campaigns");
    revalidatePath("/stewardship");
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[verify-pledge]", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
