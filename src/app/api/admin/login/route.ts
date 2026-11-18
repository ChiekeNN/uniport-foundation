import { NextResponse } from "next/server";
import { adminLoginSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = adminLoginSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    const expected = process.env.ADMIN_PASSWORD ?? "uphf-admin-2026";
    if (parsed.data.password !== expected) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set("uphf_admin", "authenticated", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("uphf_admin", "", { path: "/", maxAge: 0 });
  return res;
}
