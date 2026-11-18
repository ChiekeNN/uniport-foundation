import { NextResponse } from "next/server";
import { db } from "@/db";
import { alumniSubmissions } from "@/db/schema";
import { alumniSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = alumniSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") },
        { status: 400 }
      );
    }
    const v = parsed.data;
    try {
      const rows = await db
        .insert(alumniSubmissions)
        .values({
          fullName: v.fullName,
          email: v.email,
          graduationYear: v.graduationYear,
          department: v.department,
          faculty: v.faculty || null,
          city: v.city || null,
          country: v.country || null,
          industry: v.industry || null,
          chapterInterest: v.chapterInterest || null,
          phone: v.phone || null,
        })
        .returning({ id: alumniSubmissions.id });
      return NextResponse.json({ ok: true, id: rows[0]?.id });
    } catch (err) {
      console.error("[alumni] db insert failed (demo-ack)", err);
      return NextResponse.json({ ok: true, demo: true });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
