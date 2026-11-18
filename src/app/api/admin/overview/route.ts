import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { alumniSubmissions, campaigns, donations, inquiries } from "@/db/schema";

export async function GET() {
  const jar = await cookies();
  if (jar.get("uphf_admin")?.value !== "authenticated")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const [c, d, a, iq] = await Promise.all([
      db.select().from(campaigns),
      db.select().from(donations),
      db.select().from(alumniSubmissions),
      db.select().from(inquiries),
    ]);
    const verified = d.filter((x) => x.paymentStatus === "VERIFIED");
    return NextResponse.json({
      campaigns: c.length,
      donations: d.length,
      verifiedGifts: verified.length,
      verifiedTotalNgn: verified.reduce((s, x) => s + Number(x.amountNgnEquivalent ?? 0), 0),
      pendingPledges: d.filter((x) => x.paymentStatus === "PENDING").length,
      alumniRecords: a.length,
      openInquiries: iq.filter((x) => x.status === "NEW").length,
      recentDonations: d.slice(-8).reverse(),
      recentInquiries: iq.slice(-6).reverse(),
    });
  } catch (e) {
    console.error("[admin overview]", e);
    return NextResponse.json({
      campaigns: 0, donations: 0, verifiedGifts: 0, verifiedTotalNgn: 0,
      pendingPledges: 0, alumniRecords: 0, openInquiries: 0,
      recentDonations: [], recentInquiries: [],
    });
  }
}
