import { NextResponse } from "next/server";
import { getCampaigns } from "@/lib/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = (searchParams.get("category") ?? "ALL") as "ALL" | "ENDOWMENT" | "SCHOLARSHIP" | "INFRASTRUCTURE" | "RESEARCH" | "ALUMNI_CLASS";
  const list = await getCampaigns(category);
  return NextResponse.json({ campaigns: list });
}
