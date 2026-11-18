import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Target, Crown } from "lucide-react";
import { getCampaignBySlug, getCampaigns } from "@/lib/data";
import { formatNgn, progressPct } from "@/lib/currency";
import { Badge, Card } from "@/components/ui";
import { QuickPledge } from "./quick-pledge";

export const revalidate = 30;

export async function generateStaticParams() {
  try {
    const all = await getCampaigns("ALL");
    return all.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getCampaignBySlug(slug);
  return { title: c ? c.title : "Campaign" };
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) notFound();

  const pct = progressPct(campaign.amountRaisedNgn, campaign.targetAmountNgn);

  return (
    <div>
      <section className="bg-[#003366] text-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <Link href="/campaigns" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-[#C59B27]">
            <ArrowLeft className="h-4 w-4" /> All campaigns
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge tone="gold">{campaign.category.replace("_", " ")}</Badge>
            {campaign.isFeatured ? <Badge tone="green">Featured</Badge> : null}
          </div>
          <h1 className="mt-4 max-w-3xl font-serif text-3xl md:text-5xl leading-tight">{campaign.title}</h1>
          <p className="mt-4 max-w-2xl text-white/75">{campaign.shortDescription}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <Card className="p-7">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <Target className="h-4 w-4 text-[#0055A5]" /> Live progress
                </p>
                <p className="mt-2 font-serif text-3xl text-[#003366]">
                  {formatNgn(campaign.amountRaisedNgn)}
                  <span className="text-base text-slate-500 font-sans"> of {formatNgn(campaign.targetAmountNgn)}</span>
                </p>
              </div>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                <Users className="h-4 w-4 text-[#C59B27]" /> {campaign.donorCount.toLocaleString()} donors
              </p>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#003366] via-[#0055A5] to-[#C59B27]"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-sm font-bold text-[#003366]">{pct.toFixed(1)}% funded</p>

            <div className="prose prose-slate mt-6 max-w-none">
              <h3 className="font-serif text-xl text-[#003366]">About this campaign</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-700 whitespace-pre-line">{campaign.description}</p>
            </div>
          </Card>

          <Card className="mt-6 p-7">
            <h3 className="flex items-center gap-2 font-serif text-xl text-[#003366]">
              <Crown className="h-5 w-5 text-[#C59B27]" /> Naming Opportunities
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Enduring recognition for transformative gifts — sponsoring labs, chairs, bursary lines, or lecture-wing rows.
            </p>
            {campaign.namingTiers.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">Naming tiers for this campaign are being finalised. Contact the Advancement Centre to discuss bespoke recognition.</p>
            ) : (
              <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#003366] text-left text-white">
                      <th className="px-4 py-3 font-semibold">Tier</th>
                      <th className="px-4 py-3 font-semibold">Minimum Gift</th>
                      <th className="px-4 py-3 font-semibold hidden sm:table-cell">Recognition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaign.namingTiers.map((t, i) => (
                      <tr key={t.tier} className={i % 2 ? "bg-slate-50" : "bg-white"}>
                        <td className="px-4 py-3 font-bold text-[#003366]">{t.tier}</td>
                        <td className="px-4 py-3 font-semibold text-[#7a5f14]">{formatNgn(t.min_ngn)}</td>
                        <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">{t.benefit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="mt-4 text-xs text-slate-500">
              Naming gifts are confirmed by Deed of Gift and recognised at the annual Vice-Chancellor’s stewardship dinner.
            </p>
          </Card>
        </div>

        <div className="lg:sticky lg:top-32 self-start">
          <QuickPledge campaignSlug={campaign.slug} campaignTitle={campaign.title} />
          <Card className="mt-4 p-5 bg-[#003366] !border-[#003366] text-white text-sm">
            <p className="font-bold text-[#C59B27]">Prefer a bank wire?</p>
            <p className="mt-1 text-white/75">Institutions and diaspora donors can wire directly and receive a pledge reference instantly.</p>
            <Link href={`/donate?campaign=${campaign.slug}&gateway=wire`} className="mt-3 inline-block font-bold text-white underline decoration-[#C59B27] decoration-2 underline-offset-4 hover:text-[#C59B27]">
              Get wire instructions →
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}
