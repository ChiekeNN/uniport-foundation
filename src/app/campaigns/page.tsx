import { getCampaigns } from "@/lib/data";
import { CampaignCatalog } from "./catalog";

export const revalidate = 60;
export const metadata = { title: "Giving & Campaigns" };

export default async function CampaignsPage() {
  const campaigns = await getCampaigns("ALL");
  return (
    <div>
      <section className="bg-[#003366] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <p className="text-xs font-bold tracking-[0.22em] uppercase text-[#C59B27]">Giving & Campaigns</p>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl">Fund what matters. Track every naira.</h1>
          <p className="mt-4 max-w-2xl text-white/75">
            Filter by pillar, open any campaign for naming tiers and a quick-pledge
            widget, and toggle NGN / USD / GBP / EUR to see live progress in your currency.
          </p>
        </div>
      </section>
      <CampaignCatalog initial={campaigns} />
    </div>
  );
}
