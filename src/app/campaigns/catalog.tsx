"use client";

import { useMemo, useState } from "react";
import type { CampaignDTO, Currency } from "@/types/database";
import { CampaignCard } from "@/components/campaign-card";
import { cn } from "@/lib/utils";

const FILTERS = ["ALL", "ENDOWMENT", "SCHOLARSHIP", "INFRASTRUCTURE", "RESEARCH", "ALUMNI_CLASS"] as const;
const CURRENCIES: Currency[] = ["NGN", "USD", "GBP", "EUR"];

export function CampaignCatalog({ initial }: { initial: CampaignDTO[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const [currency, setCurrency] = useState<Currency>("NGN");

  const list = useMemo(
    () => (filter === "ALL" ? initial : initial.filter((c) => c.category === filter)),
    [filter, initial]
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-bold tracking-wide transition cursor-pointer",
                filter === f
                  ? "bg-[#003366] text-white shadow"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-[#C59B27] hover:text-[#003366]"
              )}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-bold cursor-pointer transition",
                currency === c ? "bg-[#C59B27] text-[#003366]" : "text-slate-500 hover:text-[#003366]"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Showing <strong className="text-[#003366]">{list.length}</strong> campaign{list.length === 1 ? "" : "s"} • amounts in <strong>{currency}</strong>
      </p>

      {list.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          No campaigns in this pillar yet. Please check back — or give to the Untied General Endowment Fund.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <CampaignCard key={c.id} campaign={c} currency={currency} />
          ))}
        </div>
      )}
    </section>
  );
}
