import { Suspense } from "react";
import { getCampaigns } from "@/lib/data";
import { DonateForm } from "./form";

export const metadata = { title: "Donate" };
export const dynamic = "force-dynamic";

export default async function DonatePage() {
  const campaigns = await getCampaigns("ALL");
  return (
    <div>
      <section className="bg-[#26206B] text-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <p className="text-xs font-bold tracking-[0.22em] uppercase text-[#D6A419]">Multi-currency donation portal</p>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl">Your gift, your currency, full traceability.</h1>
          <p className="mt-3 max-w-2xl text-white/75 text-sm md:text-base">
            NGN routes to Paystack • USD / GBP / EUR route to Stripe Checkout • Institutions may wire directly and receive an instant pledge reference. Receipts are emailed automatically.
          </p>
        </div>
      </section>
      <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-12 text-slate-500">Loading secure checkout…</div>}>
        <DonateForm campaigns={campaigns} />
      </Suspense>
    </div>
  );
}
