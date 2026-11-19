import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prepareDatabase } from "@/lib/db-setup";
import { isDemoPayments } from "@/lib/payments/demo";
import { isStripeConfigured } from "@/lib/payments/stripe";
import { isPaystackConfigured } from "@/lib/payments/paystack";

export const dynamic = "force-dynamic";

/** Creates any missing tables + seeds campaigns. Safe to run repeatedly. */
export async function POST() {
  const jar = await cookies();
  if (jar.get("uphf_admin")?.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const report = await prepareDatabase();
  return NextResponse.json(
    {
      ...report,
      payments: {
        demo: isDemoPayments(),
        paystack: isPaystackConfigured(),
        stripe: isStripeConfigured(),
      },
    },
    { status: report.ok ? 200 : 500 }
  );
}
