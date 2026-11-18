import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import type { CampaignDTO, Currency } from "@/types/database";
import { formatNgnAs, progressPct } from "@/lib/currency";
import { Badge, Card } from "./ui";

const CATEGORY_LABEL: Record<string, string> = {
  ENDOWMENT: "Endowment",
  SCHOLARSHIP: "Scholarship",
  INFRASTRUCTURE: "Infrastructure",
  RESEARCH: "Research",
  ALUMNI_CLASS: "Alumni Class",
};

export function CampaignCard({
  campaign,
  currency = "NGN",
}: {
  campaign: CampaignDTO;
  currency?: Currency;
}) {
  const pct = progressPct(campaign.amountRaisedNgn, campaign.targetAmountNgn);
  return (
    <Card className="group flex flex-col overflow-hidden hover:shadow-[0_12px_40px_rgba(0,51,102,0.14)] hover:-translate-y-1 transition-all duration-300">
      <div className="relative bg-gradient-to-br from-[#003366] via-[#004080] to-[#0055A5] p-6 text-white overflow-hidden">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#C59B27]/20 blur-2xl" />
        <div className="absolute -left-6 -bottom-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <Badge tone="gold">{CATEGORY_LABEL[campaign.category] ?? campaign.category}</Badge>
          <span className="flex items-center gap-1 text-xs text-white/80">
            <Users className="h-3.5 w-3.5" /> {campaign.donorCount.toLocaleString()} donors
          </span>
        </div>
        <h3 className="relative mt-4 font-serif text-xl leading-snug">{campaign.title}</h3>
        <p className="relative mt-2 line-clamp-2 text-sm text-white/75">{campaign.shortDescription}</p>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-end justify-between text-sm">
          <p className="font-bold text-[#003366]">{formatNgnAs(campaign.amountRaisedNgn, currency)}</p>
          <p className="text-xs text-slate-500">of {formatNgnAs(campaign.targetAmountNgn, currency)}</p>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#003366] via-[#0055A5] to-[#C59B27] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs font-semibold text-slate-500">{pct.toFixed(1)}% funded</p>
        <Link
          href={`/campaigns/${campaign.slug}`}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#0055A5] hover:text-[#003366] group-hover:gap-2.5 transition-all"
        >
          View campaign & give <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}
