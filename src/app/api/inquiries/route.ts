import { NextResponse } from "next/server";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { inquirySchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") },
        { status: 400 }
      );
    }
    const v = parsed.data;
    try {
      const rows = await db
        .insert(inquiries)
        .values({
          fullName: v.fullName,
          email: v.email,
          phone: v.phone || null,
          organization: v.organization || null,
          category: v.category,
          subject: v.subject || null,
          message: v.message,
          status: "NEW",
        })
        .returning({ id: inquiries.id });
      return NextResponse.json({ ok: true, id: rows[0]?.id });
    } catch (err) {
      console.error("[inquiries] db insert failed (demo-ack)", err);
      return NextResponse.json({ ok: true, demo: true });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
