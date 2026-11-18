import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { campaigns } from "@/db/schema";
import { campaignUpsertSchema } from "@/lib/validations";

function authed(cookieVal: string | undefined): boolean {
  return cookieVal === "authenticated";
}

export async function GET() {
  const jar = await cookies();
  if (!authed(jar.get("uphf_admin")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const rows = await db.select().from(campaigns);
    return NextResponse.json({ campaigns: rows });
  } catch (e) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const jar = await cookies();
  if (!authed(jar.get("uphf_admin")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const parsed = campaignUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") },
      { status: 400 }
    );
  }
  const v = parsed.data;
  try {
    const existing = await db.select().from(campaigns).where(eq(campaigns.slug, v.slug)).limit(1);
    if (existing[0]) {
      await db
        .update(campaigns)
        .set({
          title: v.title,
          category: v.category,
          shortDescription: v.shortDescription,
          description: v.description,
          targetAmountNgn: v.targetAmountNgn,
          isActive: v.isActive,
          isFeatured: v.isFeatured,
          updatedAt: new Date(),
        })
        .where(eq(campaigns.slug, v.slug));
      return NextResponse.json({ ok: true, updated: true });
    }
    await db.insert(campaigns).values({
      slug: v.slug,
      title: v.title,
      category: v.category,
      shortDescription: v.shortDescription,
      description: v.description,
      targetAmountNgn: v.targetAmountNgn,
      amountRaisedNgn: 0,
      donorCount: 0,
      isActive: v.isActive,
      isFeatured: v.isFeatured,
      namingTiers: [],
    });
    return NextResponse.json({ ok: true, created: true });
  } catch (err) {
    console.error("[admin campaigns]", err);
    return NextResponse.json({ error: "DB write failed" }, { status: 500 });
  }
}
