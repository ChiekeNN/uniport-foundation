import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { asc } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { leadershipMembers } from "@/db/schema";

const schema = z.object({
  fullName: z.string().min(2).max(140),
  role: z.string().min(2).max(140),
  category: z.enum(["TRUSTEE", "DIRECTORATE"]),
  bio: z.string().max(2000).default(""),
  tenure: z.string().max(120).optional().default(""),
  displayOrder: z.number().int().min(0).max(100).default(0),
});

export async function GET() {
  const jar = await cookies();
  if (jar.get("uphf_admin")?.value !== "authenticated")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const rows = await db.select().from(leadershipMembers).orderBy(asc(leadershipMembers.displayOrder));
    return NextResponse.json({ members: rows });
  } catch {
    return NextResponse.json({ members: [] });
  }
}

export async function POST(req: Request) {
  const jar = await cookies();
  if (jar.get("uphf_admin")?.value !== "authenticated")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  try {
    await db.insert(leadershipMembers).values({
      fullName: parsed.data.fullName,
      role: parsed.data.role,
      category: parsed.data.category,
      bio: parsed.data.bio,
      tenure: parsed.data.tenure || null,
      displayOrder: parsed.data.displayOrder,
      isActive: true,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin leadership]", e);
    return NextResponse.json({ error: "DB write failed" }, { status: 500 });
  }
}
