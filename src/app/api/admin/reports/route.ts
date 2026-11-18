import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { stewardshipReports } from "@/db/schema";

const schema = z.object({
  title: z.string().min(4).max(220),
  fiscalYear: z.string().min(4).max(9),
  reportType: z.enum(["ANNUAL_IMPACT", "AUDITED_FINANCIAL", "QUARTERLY", "ENDOWMENT_STATEMENT"]),
  fileUrl: z.string().min(4).max(500),
  fileSize: z.string().max(20).optional().default(""),
  summary: z.string().max(600).optional().default(""),
});

export async function GET() {
  const jar = await cookies();
  if (jar.get("uphf_admin")?.value !== "authenticated")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const rows = await db.select().from(stewardshipReports);
    return NextResponse.json({ reports: rows });
  } catch {
    return NextResponse.json({ reports: [] });
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
    await db.insert(stewardshipReports).values({
      title: parsed.data.title,
      fiscalYear: parsed.data.fiscalYear,
      reportType: parsed.data.reportType,
      fileUrl: parsed.data.fileUrl,
      fileSize: parsed.data.fileSize || null,
      summary: parsed.data.summary || null,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin reports]", e);
    return NextResponse.json({ error: "DB write failed" }, { status: 500 });
  }
}
