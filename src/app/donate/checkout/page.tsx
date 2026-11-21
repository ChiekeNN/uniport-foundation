import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";
import { DemoCheckoutForm } from "./form";

export const metadata = { title: "Demo checkout" };
export const dynamic = "force-dynamic";

export default function DemoCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Preparing checkout…</div>}>
      <Body searchParams={searchParams} />
    </Suspense>
  );
}

async function Body({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const reference = typeof sp.reference === "string" ? sp.reference : "";

  return (
    <section className="mx-auto max-w-lg px-4 py-12">
      <Card>
        <div className="rounded-t-2xl bg-gradient-to-r from-[#26206B] to-[#0C76B4] px-6 py-5 text-white">
          <p className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-[#D6A419]">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Secure checkout</span>
            <span>DEMO</span>
          </p>
          <p className="mt-2 font-serif text-xl">University of Port Harcourt Foundation</p>
          <p className="text-xs text-white/70">Simulated payment gateway — practice run</p>
        </div>

        <div className="p-6">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11.5px] leading-relaxed text-amber-900">
            <strong>No real money moves.</strong> This screen rehearses the live Paystack/Stripe
            journey. Confirming here marks your gift as verified so it appears on the Donor Wall
            and in the Advancement Centre dashboard.
          </div>

          <DemoCheckoutForm reference={reference} />

          <Link
            href="/donate"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#26206B]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Cancel and return to the giving form
          </Link>
        </div>
      </Card>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <CreditCard className="h-3.5 w-3.5" /> Reference <span className="font-mono">{reference || "—"}</span>
      </p>
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(38,32,107,0.10)]">
      {children}
    </div>
  );
}
