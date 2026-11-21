import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle2, ArrowRight, ReceiptText } from "lucide-react";
import { Card } from "@/components/ui";

export const metadata = { title: "Gift confirmed" };
export const dynamic = "force-dynamic";

function SuccessBody({ gateway, reference, demo }: { gateway: string; reference: string; demo: string }) {
  const simulated = demo === "1" || gateway === "demo";
  return (
    <section className="mx-auto max-w-2xl px-4 py-14">
      <Card className="p-8 md:p-10 text-center border-emerald-200">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
        <h1 className="mt-4 font-serif text-3xl md:text-4xl text-[#26206B]">Thank you. Your gift is being stewarded.</h1>
        <p className="mt-3 text-slate-600 leading-relaxed">
          {simulated
            ? "Simulated payment confirmed — no real money moved. Your gift has been marked verified, so it now counts toward the campaign, appears on the Donor Wall if you opted in, and is listed in the Advancement Centre's gift register."
            : "Your payment was received and your receipt is on its way by email. Verified gifts post to campaign totals and the Donor Wall (if you opted in) automatically."}
        </p>
        {simulated ? (
          <p className="mt-2 rounded-lg border border-[#D6A419]/40 bg-[#D6A419]/10 px-3 py-2 text-[11.5px] font-semibold text-[#7a5f14]">
            Demo run · this entry is tagged for a one-click reset from the admin dashboard.
          </p>
        ) : null}
        <div className="mx-auto mt-6 grid max-w-md gap-2 rounded-2xl bg-slate-50 border border-slate-200 p-5 text-sm text-left">
          <p><span className="font-semibold text-slate-500">Channel:</span> <strong className="text-[#26206B] uppercase">{gateway || "—"}</strong></p>
          <p className="break-all"><span className="font-semibold text-slate-500">Reference:</span> <strong className="font-mono text-[#26206B]">{reference || "—"}</strong></p>
          <p className="flex items-center gap-1.5 text-xs text-slate-500"><ReceiptText className="h-4 w-4" /> Keep this reference for all correspondence with the Advancement Centre.</p>
        </div>
        <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/stewardship" className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#26206B] px-6 py-3 text-sm font-bold text-white hover:bg-[#1B1650]">
            Visit the Donor Wall <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/campaigns" className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-6 py-3 text-sm font-bold text-[#26206B] hover:border-[#D6A419]">
            Explore more campaigns
          </Link>
        </div>
      </Card>
    </section>
  );
}

export default async function DonateSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const gateway = typeof sp.gateway === "string" ? sp.gateway : typeof sp.gateway === "undefined" ? "" : "";
  const reference =
    (typeof sp.reference === "string" ? sp.reference : "") ||
    (typeof sp.trxref === "string" ? sp.trxref : "") ||
    "";
  const demo = typeof sp.demo === "string" ? sp.demo : "";
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Confirming…</div>}>
      <SuccessBody gateway={gateway} reference={reference} demo={demo} />
    </Suspense>
  );
}
