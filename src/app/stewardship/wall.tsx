"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { DonorWallEntry, StewardshipReportDTO } from "@/types/database";
import { formatNgn } from "@/lib/currency";
import { Card, inputCls } from "@/components/ui";
import { cn } from "@/lib/utils";

export function WallAndReports({
  wall,
  reports,
}: {
  wall: DonorWallEntry[];
  reports: StewardshipReportDTO[];
}) {
  const [q, setQ] = useState("");
  const [year, setYear] = useState("ALL");
  const [type, setType] = useState("ALL");

  const filteredWall = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return wall;
    return wall.filter(
      (w) =>
        w.donorName.toLowerCase().includes(needle) ||
        (w.organization ?? "").toLowerCase().includes(needle) ||
        (w.campaignTitle ?? "").toLowerCase().includes(needle)
    );
  }, [q, wall]);

  const years = useMemo(() => ["ALL", ...Array.from(new Set(reports.map((r) => r.fiscalYear))).sort().reverse()], [reports]);
  const types = useMemo(() => ["ALL", ...Array.from(new Set(reports.map((r) => r.reportType)))], [reports]);
  const filteredReports = useMemo(
    () => reports.filter((r) => (year === "ALL" || r.fiscalYear === year) && (type === "ALL" || r.reportType === type)),
    [reports, year, type]
  );

  return (
    <div className="mt-8">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className={cn(inputCls, "pl-9")}
          placeholder="Search honorees, organisations, campaigns…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {filteredWall.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
          No matching honorees. Verified, opted-in gifts appear here automatically after payment confirmation.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredWall.map((w) => (
            <Card key={w.id} className="relative overflow-hidden p-5">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#26206B] via-[#0C76B4] to-[#D6A419]" />
              <p className="font-serif text-lg text-[#26206B]">{w.donorName}</p>
              {w.organization ? <p className="text-xs font-semibold text-slate-500">{w.organization}</p> : null}
              <p className="mt-2 text-sm font-bold text-[#7a5f14]">{formatNgn(w.amountNgnEquivalent)}</p>
              {w.campaignTitle ? <p className="mt-1 text-xs text-slate-500">→ {w.campaignTitle}</p> : null}
              <p className="mt-2 text-[11px] uppercase tracking-wider text-emerald-600 font-bold">✓ Verified gift</p>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-12 flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Filter reports:</span>
        {years.map((y) => (
          <button key={y} onClick={() => setYear(y)} className={cn("rounded-full px-3.5 py-1.5 text-xs font-bold cursor-pointer border", year === y ? "bg-[#26206B] text-white border-[#26206B]" : "bg-white text-slate-600 border-slate-200")}>
            {y === "ALL" ? "All years" : `FY ${y}`}
          </button>
        ))}
        <span className="mx-1 text-slate-300">|</span>
        {types.map((t) => (
          <button key={t} onClick={() => setType(t)} className={cn("rounded-full px-3.5 py-1.5 text-xs font-bold cursor-pointer border", type === t ? "bg-[#D6A419] text-[#26206B] border-[#D6A419]" : "bg-white text-slate-600 border-slate-200")}>
            {t === "ALL" ? "All types" : t.replaceAll("_", " ")}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-slate-500">
        Showing <strong className="text-[#26206B]">{filteredReports.length}</strong> of {reports.length} reports. Full archive below ↓
      </p>
    </div>
  );
}
