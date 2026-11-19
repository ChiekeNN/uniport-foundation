import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { campaigns, donations } from "@/db/schema";
import { isDemoReference } from "@/lib/payments/demo";

export const dynamic = "force-dynamic";

/**
 * Live gift register for the admin dashboard.
 * Distinct from the illustrative board-briefing dataset: everything here comes
 * from the database, including gifts submitted through the donor portal.
 */
export async function GET() {
  const jar = await cookies();
  if (jar.get("uphf_admin")?.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await db
      .select({
        id: donations.id,
        donorName: donations.donorName,
        donorEmail: donations.donorEmail,
        organization: donations.organization,
        amount: donations.amount,
        currency: donations.currency,
        amountNgnEquivalent: donations.amountNgnEquivalent,
        isAlumni: donations.isAlumni,
        graduationYear: donations.graduationYear,
        displayOnDonorWall: donations.displayOnDonorWall,
        paymentStatus: donations.paymentStatus,
        paymentGateway: donations.paymentGateway,
        gatewayReference: donations.gatewayReference,
        pledgeReference: donations.pledgeReference,
        verifiedAt: donations.verifiedAt,
        createdAt: donations.createdAt,
        campaignTitle: campaigns.title,
      })
      .from(donations)
      .leftJoin(campaigns, eq(donations.campaignId, campaigns.id))
      .orderBy(desc(donations.createdAt))
      .limit(250);

    const gifts = rows.map((r) => ({
      ...r,
      isDemo: isDemoReference(r.gatewayReference),
    }));

    return NextResponse.json({
      ok: true,
      gifts,
      stats: {
        total: gifts.length,
        verified: gifts.filter((g) => g.paymentStatus === "VERIFIED").length,
        pending: gifts.filter((g) => g.paymentStatus === "PENDING").length,
        onWall: gifts.filter((g) => g.paymentStatus === "VERIFIED" && g.displayOnDonorWall).length,
        verifiedNgn: gifts
          .filter((g) => g.paymentStatus === "VERIFIED")
          .reduce((s, g) => s + Number(g.amountNgnEquivalent ?? 0), 0),
      },
    });
  } catch (e) {
    console.error("[admin/gifts]", e);
    // Surface the failure instead of silently showing an empty register.
    return NextResponse.json(
      { ok: false, gifts: [], stats: { total: 0, verified: 0, pending: 0, onWall: 0, verifiedNgn: 0 }, error: "database_unavailable" },
      { status: 200 }
    );
  }
}
