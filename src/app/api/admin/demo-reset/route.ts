import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, eq, like, sql } from "drizzle-orm";
import { db } from "@/db";
import { campaigns, donations } from "@/db/schema";
import { DEMO_REF_PREFIX } from "@/lib/payments/demo";

export const dynamic = "force-dynamic";

/**
 * Reset rehearsal data.
 *
 * Default scope removes only gifts created by the demo gateway (`demo_…`
 * references) and backs their value out of campaign totals, leaving anything
 * real untouched. `scope: "all"` clears the entire gift ledger — use that only
 * after the board has finished testing.
 */
export async function POST(req: Request) {
  const jar = await cookies();
  if (jar.get("uphf_admin")?.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let scope: "demo" | "all" = "demo";
  try {
    const body = (await req.json()) as { scope?: "demo" | "all" };
    if (body.scope === "all") scope = "all";
  } catch {
    // default scope
  }

  try {
    const where = scope === "all" ? undefined : like(donations.gatewayReference, `${DEMO_REF_PREFIX}%`);

    // Reverse verified demo gifts out of campaign totals first — the increment
    // trigger only fires on the PENDING → VERIFIED transition, not on delete.
    const verified = await db
      .select({
        campaignId: donations.campaignId,
        amountNgn: donations.amountNgnEquivalent,
      })
      .from(donations)
      .where(
        where
          ? and(where, eq(donations.paymentStatus, "VERIFIED"))
          : eq(donations.paymentStatus, "VERIFIED")
      );

    const perCampaign = new Map<string, { total: number; count: number }>();
    for (const row of verified) {
      if (!row.campaignId) continue;
      const cur = perCampaign.get(row.campaignId) ?? { total: 0, count: 0 };
      cur.total += Number(row.amountNgn ?? 0);
      cur.count += 1;
      perCampaign.set(row.campaignId, cur);
    }

    for (const [campaignId, agg] of perCampaign) {
      await db
        .update(campaigns)
        .set({
          amountRaisedNgn: sql`greatest(0, ${campaigns.amountRaisedNgn} - ${agg.total})`,
          donorCount: sql`greatest(0, ${campaigns.donorCount} - ${agg.count})`,
        })
        .where(eq(campaigns.id, campaignId));
    }

    const deleted = where ? await db.delete(donations).where(where) : await db.delete(donations);

    revalidatePath("/");
    revalidatePath("/campaigns");
    revalidatePath("/stewardship");
    revalidatePath("/admin");

    return NextResponse.json({ ok: true, scope, cleared: deleted.rowCount ?? 0 });
  } catch (e) {
    console.error("[admin/demo-reset]", e);
    return NextResponse.json({ error: "Reset failed — is the database reachable?" }, { status: 500 });
  }
}
