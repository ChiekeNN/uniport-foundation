"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  FileCheck2,
  FlaskConical,
  Gauge,
  GraduationCap,
  Handshake,
  Landmark,
  Megaphone,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import { formatNgn } from "@/lib/currency";
import {
  AreaTrend,
  Delta,
  Donut,
  Funnel,
  ProgressBar,
  Sparkline,
  StackedBars,
  shortNgn,
  useCountUp,
} from "@/components/dashboard/charts";
import {
  ACTIVITY,
  CAMPAIGNS,
  CHAPTERS,
  COMPLIANCE,
  FY_TARGET_NGN,
  MONTHLY_2026,
  PARTNERS,
  PERIODS,
  PIPELINE,
  QUARTERS,
  RECENT_GIFTS,
  TOTAL_DONORS,
  TOTAL_RAISED_NGN,
  TOTAL_TARGET_NGN,
  UPCOMING,
  UTILISATION,
  totalsFor,
  type GiftRow,
} from "@/lib/demo/board-briefing";

/* ────────────────────────── small building blocks ────────────────────────── */

function Money({ value, className }: { value: number; className?: string }) {
  const v = useCountUp(value);
  return <span className={cn("tabular-nums", className)}>{formatNgn(Math.round(v))}</span>;
}

function Number_({ value, className }: { value: number; className?: string }) {
  const v = useCountUp(value);
  return <span className={cn("tabular-nums", className)}>{Math.round(v).toLocaleString()}</span>;
}

function KpiCard({
  icon: Icon,
  label,
  children,
  spark,
  delta,
  tone = "navy",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
  spark?: number[];
  delta?: number;
  tone?: "navy" | "gold";
}) {
  return (
    <Card className="group relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1",
          tone === "gold" ? "bg-gradient-to-r from-[#C59B27] to-[#e0bb56]" : "bg-gradient-to-r from-[#003366] to-[#0055A5]"
        )}
      />
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            tone === "gold" ? "bg-[#C59B27]/12 text-[#a07c17]" : "bg-[#003366]/8 text-[#003366]"
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>
        {delta != null ? <Delta value={delta} /> : null}
      </div>
      <p className="mt-3 font-serif text-2xl leading-tight text-[#003366]">{children}</p>
      <p className="mt-0.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
      {spark ? <Sparkline values={spark} className="mt-2" stroke={tone === "gold" ? "#C59B27" : "#0055A5"} /> : null}
    </Card>
  );
}

function SectionTitle({ icon: Icon, title, hint }: { icon: React.ComponentType<{ className?: string }>; title: string; hint?: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="flex items-center gap-2 text-sm font-bold text-[#003366]">
          <Icon className="h-4 w-4 text-[#C59B27]" /> {title}
        </p>
        {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      </div>
    </div>
  );
}

const ACTIVITY_ICON = {
  gift: Wallet,
  partnership: Handshake,
  programme: GraduationCap,
  governance: Landmark,
  compliance: ShieldCheck,
} as const;

const ACTIVITY_TONE = {
  gift: "bg-emerald-50 text-emerald-700",
  partnership: "bg-[#0055A5]/10 text-[#0055A5]",
  programme: "bg-[#C59B27]/15 text-[#a07c17]",
  governance: "bg-[#003366]/8 text-[#003366]",
  compliance: "bg-violet-50 text-violet-700",
} as const;

function prettyDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

/* ────────────────────────── the briefing ────────────────────────── */

export function BoardBriefing() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("FY 2026");
  const t = totalsFor(period);

  const delta = useMemo(() => {
    if (period === "FY 2026") return { raised: 31.2, donors: 24.8 };
    const keys = QUARTERS[period];
    const start = MONTHLY_2026.findIndex((m) => m.key === keys[0]);
    const prev = MONTHLY_2026.slice(Math.max(0, start - keys.length), start);
    if (!prev.length) return { raised: 0, donors: 0 };
    const prevRaised = prev.reduce((s, m) => s + m.ngn, 0);
    const prevDonors = prev.reduce((s, m) => s + m.donors, 0);
    return {
      raised: ((t.raisedNgn - prevRaised) / prevRaised) * 100,
      donors: ((t.donors - prevDonors) / prevDonors) * 100,
    };
  }, [period, t]);

  const gifts = Math.round(t.donors * 1.26);
  const avgGift = Math.round(t.raisedNgn / Math.max(1, gifts));
  const periodTarget = Math.round((FY_TARGET_NGN * t.months.length) / 12);
  const goalPct = Math.min(100, (t.raisedNgn / periodTarget) * 100);

  return (
    <div className="space-y-6">
      {/* ── header strip ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00284f] via-[#003366] to-[#0055A5] p-6 text-white shadow-lg animate-fade-up">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 20%, #C59B27 0, transparent 38%), radial-gradient(circle at 88% 10%, #ffffff33 0, transparent 42%)",
          }}
        />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#C59B27]/60 bg-[#C59B27]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#F3DFA6]">
                Board pack · FY2026
              </span>
              <span className="rounded-full border border-emerald-300/40 bg-emerald-400/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-100">
                Golden Jubilee year
              </span>
              <span className="rounded-full border border-white/25 bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/80">
                Illustrative demo data
              </span>
            </div>
            <h2 className="mt-3 font-serif text-2xl md:text-3xl leading-tight">
              Advancement Centre — operating brief
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/75">
              Verified intake, gift pipeline, fund utilisation and stewardship compliance for the
              2026 Golden Jubilee administration. Prepared for the Board of Trustees and
              University Management.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/60">Reporting period</p>
            <div className="flex rounded-xl border border-white/20 bg-white/10 p-1 backdrop-blur">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-bold transition",
                    period === p ? "bg-[#C59B27] text-[#003366] shadow" : "text-white/80 hover:bg-white/10"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-white/50">Updated {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
          </div>
        </div>
      </div>

      {/* ── hero KPIs ────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={Wallet} label="Verified intake" delta={delta.raised} spark={t.months.map((m) => m.ngn)}>
          <Money value={t.raisedNgn} />
        </KpiCard>
        <KpiCard icon={Users} label="Verified donors" delta={delta.donors} spark={t.months.map((m) => m.donors)} tone="gold">
          <Number_ value={t.donors} />
        </KpiCard>
        <KpiCard icon={FileCheck2} label={`Gifts receipted (avg ${formatNgn(avgGift)})`}>
          <Number_ value={gifts} />
        </KpiCard>
        <KpiCard icon={Gauge} label={`of ${formatNgn(periodTarget)} board target`}>
          <span className="tabular-nums">{goalPct.toFixed(1)}%</span>
          <span className="mt-2 block">
            <ProgressBar value={goalPct} tone="gold" />
          </span>
        </KpiCard>
      </div>

      {/* ── headline charts ─────────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <SectionTitle
            icon={TrendingUp}
            title="Verified intake trajectory"
            hint="Hover any month for the exact figure. Dashed line marks the board's straight-line target pace."
          />
          <div className="mt-4">
            <AreaTrend
              data={t.months.map((m) => ({ label: m.label, value: m.ngn }))}
              target={periodTarget / Math.max(1, t.months.length)}
              targetLabel="Target pace / month"
            />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 border-t border-slate-100 pt-3 text-center">
            {[
              { l: "Online (Paystack/Stripe)", v: t.online },
              { l: "Corporate CSR", v: t.corporate },
              { l: "Bank wire", v: t.wire },
            ].map((c) => (
              <div key={c.l}>
                <p className="text-sm font-bold text-[#003366]">{shortNgn(c.v)}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{c.l}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle icon={Landmark} title="Where the money sits" hint="Verified intake by fund." />
          <div className="mt-5">
            <Donut
              segments={CAMPAIGNS.map((c, i) => ({
                label: c.category,
                value: c.raisedNgn,
                color: ["#003366", "#C59B27", "#0055A5", "#7aa7d4"][i],
              }))}
              centerLabel="Total verified"
              centerValue={shortNgn(TOTAL_RAISED_NGN)}
            />
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Endowment corpus ring-fenced</p>
            <p className="mt-0.5 font-serif text-lg text-[#003366]">₦1.15bn</p>
            <p className="text-[11px] text-slate-500">Principal untouched — only audited investment income is released.</p>
          </div>
        </Card>
      </div>

      {/* ── channel + pipeline ──────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <SectionTitle icon={Building2} title="Monthly intake by channel" hint="Stacked by payment channel. Hover a column to break it down." />
          <div className="mt-5">
            <StackedBars
              data={t.months.map((m) => ({ label: m.label, values: [m.online, m.corporate, m.wire] }))}
              series={[
                { name: "Online", color: "#0055A5" },
                { name: "Corporate CSR", color: "#C59B27" },
                { name: "Bank wire", color: "#003366" },
              ]}
            />
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle icon={Megaphone} title="Gift pipeline · FY2026" hint="From first inquiry to tranche release." />
          <div className="mt-5">
            <Funnel steps={PIPELINE} />
          </div>
          <div className="mt-4 rounded-xl border border-[#C59B27]/40 bg-[#C59B27]/8 p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#a07c17]">Open pipeline value</p>
            <p className="mt-0.5 font-serif text-lg text-[#003366]">₦486.5m</p>
            <p className="text-[11px] text-slate-600">176 pledges awaiting verification or tranche release.</p>
          </div>
        </Card>
      </div>

      {/* ── campaign performance ────────────────────────────────── */}
      <Card className="p-5">
        <SectionTitle
          icon={Sparkles}
          title="Campaign performance"
          hint={`${CAMPAIGNS.length} active vehicles · ₦${(TOTAL_TARGET_NGN / 1e9).toFixed(1)}bn combined goal · ${TOTAL_DONORS.toLocaleString()} donors`}
        />
        <div className="mt-5 space-y-5">
          {CAMPAIGNS.map((c, i) => {
            const pct = (c.raisedNgn / c.targetNgn) * 100;
            return (
              <div key={c.slug} className="group">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-[#003366]">{c.name}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C59B27]">{c.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold tabular-nums text-[#003366]">
                      {shortNgn(c.raisedNgn)} <span className="text-xs font-medium text-slate-400">of {shortNgn(c.targetNgn)}</span>
                    </p>
                    <p className="text-[11px] font-bold text-slate-500">
                      {pct.toFixed(1)}% funded · {c.donors.toLocaleString()} donors
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <ProgressBar value={pct} delay={i * 120} tone={pct > 60 ? "emerald" : i % 2 ? "gold" : "navy"} />
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" /> {c.tranche}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── gifts + activity ────────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-5">
        <GiftTable />
        <Card className="p-5 lg:col-span-2">
          <SectionTitle icon={CalendarClock} title="Advancement activity log" hint="Latest recorded activities at the Centre." />
          <ol className="mt-4 space-y-3">
            {ACTIVITY.map((a, i) => {
              const Icon = ACTIVITY_ICON[a.kind];
              return (
                <li
                  key={a.id}
                  className="flex gap-3 animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", ACTIVITY_TONE[a.kind])}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold leading-snug text-[#003366]">
                      {a.title} <span className="ml-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{prettyDate(a.date)}</span>
                    </p>
                    <p className="text-[11.5px] leading-relaxed text-slate-600">{a.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="mt-4 border-t border-slate-100 pt-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Next on the calendar</p>
            <ul className="mt-2 space-y-1.5">
              {UPCOMING.map((u) => (
                <li key={u.label} className="flex items-start justify-between gap-2 text-[12px]">
                  <span className="text-slate-700">
                    <span className="font-semibold text-[#003366]">{u.label}</span>
                    <span className="block text-[10.5px] text-slate-500">{u.place}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                    {new Date(`${u.date}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* ── utilisation + compliance ─────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5">
          <SectionTitle icon={Wallet} title="Fund utilisation" hint="Share of released funds, FY2026." />
          <div className="mt-4 space-y-3">
            {UTILISATION.map((u, i) => (
              <div key={u.label}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[12px] font-semibold text-slate-700">{u.label}</p>
                  <p className="text-[12px] font-bold tabular-nums text-[#003366]">{u.value}%</p>
                </div>
                <div className="mt-1">
                  <ProgressBar value={u.value} delay={i * 90} tone={i === 0 ? "navy" : i === 1 ? "gold" : "emerald"} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-800">
            ₦1.42bn deployed to date · 100% of tranches backed by independent certification.
          </p>
        </Card>

        <Card className="p-5">
          <SectionTitle icon={ShieldCheck} title="Stewardship compliance" hint="Board-adopted service standards." />
          <div className="mt-4 space-y-3">
            {COMPLIANCE.map((c, i) => (
              <div key={c.label}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[12px] font-semibold text-slate-700">{c.label}</p>
                  <p className={cn("text-[12px] font-bold tabular-nums", c.value === 100 ? "text-emerald-700" : "text-[#a07c17]")}>
                    {c.value}%
                  </p>
                </div>
                <div className="mt-1">
                  <ProgressBar value={c.value} delay={i * 80} tone={c.value === 100 ? "emerald" : "gold"} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-slate-500">
            FY2026 interim external review returned a clean opinion; statutory audit field work opens 12 Jan 2027.
          </p>
        </Card>

        <Card className="p-5">
          <SectionTitle icon={Handshake} title="Top institutional partners" hint="Corporate CSR commitments, FY2026." />
          <ul className="mt-4 space-y-3">
            {PARTNERS.map((p, i) => (
              <li key={p.name}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[12px] font-semibold text-slate-700">{p.name}</p>
                  <p className="text-[12px] font-bold tabular-nums text-[#003366]">{shortNgn(p.amountNgn)}</p>
                </div>
                <div className="mt-1">
                  <ProgressBar
                    value={(p.amountNgn / PARTNERS[0].amountNgn) * 100}
                    delay={i * 80}
                    tone={i % 2 ? "gold" : "navy"}
                  />
                </div>
                <p className="mt-0.5 text-[10.5px] text-slate-500">{p.focus}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ── alumni chapters + closing ───────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <SectionTitle icon={Users} title="Alumni chapter mobilisation" hint="Verified donors by chapter, FY2026." />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {CHAPTERS.map((c, i) => (
              <div key={c.name} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <div className="flex items-baseline justify-between">
                  <p className="text-[12px] font-bold text-[#003366]">{c.name}</p>
                  <p className="text-[12px] font-bold tabular-nums text-slate-600">{c.donors}</p>
                </div>
                <div className="mt-1.5">
                  <ProgressBar value={(c.donors / CHAPTERS[0].donors) * 100} delay={i * 70} tone={i % 2 ? "gold" : "navy"} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-[#003366] p-5 text-white !border-[#003366]">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#C59B27]">
            <FlaskConical className="h-4 w-4" /> Programme delivery
          </p>
          <ul className="mt-3 space-y-2.5 text-sm">
            {[
              { l: "Scholars maintained in session", v: "1,284" },
              { l: "STEM laboratories commissioned", v: "12 of 12" },
              { l: "Research chairs endowed", v: "2" },
              { l: "Corporate MoUs executed", v: "38" },
              { l: "Host-community programmes", v: "6" },
            ].map((s) => (
              <li key={s.l} className="flex items-baseline justify-between gap-2 border-b border-white/10 pb-2 last:border-0">
                <span className="text-white/75">{s.l}</span>
                <span className="font-serif text-base font-bold text-[#C59B27]">{s.v}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-1.5 text-[11px] text-white/60">
            <ArrowUpRight className="h-3.5 w-3.5 text-[#C59B27]" /> Host-community synergy across Choba, Aluu and Akpor.
          </p>
        </Card>
      </div>

      <p className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-[11px] text-slate-500">
        <ArrowDownRight className="h-3.5 w-3.5" />
        <strong className="font-bold text-slate-600">Illustrative board briefing.</strong>
        Figures on this tab are a demonstration dataset for presentation purposes; the
        <em className="mx-1 not-italic font-semibold text-[#003366]">Live operations</em> tab always reflects the
        connected database.
      </p>
    </div>
  );
}

/* ────────────────────────── gift table ────────────────────────── */

type SortKey = "donor" | "amount" | "date";

function GiftTable() {
  const [status, setStatus] = useState<"ALL" | GiftRow["status"]>("ALL");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "date", dir: "desc" });

  const rows = useMemo(() => {
    const filtered = RECENT_GIFTS.filter((g) => {
      const okStatus = status === "ALL" || g.status === status;
      const hay = `${g.donor} ${g.organization ?? ""} ${g.campaign}`.toLowerCase();
      return okStatus && hay.includes(q.toLowerCase());
    });
    return [...filtered].sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      if (sort.key === "amount") return (a.amountNgn - b.amountNgn) * dir;
      if (sort.key === "date") return (a.date < b.date ? -1 : 1) * dir;
      return a.donor.localeCompare(b.donor) * dir;
    });
  }, [status, q, sort]);

  const toggle = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));

  const total = rows.reduce((s, r) => s + r.amountNgn, 0);

  return (
    <Card className="p-5 lg:col-span-3">
      <SectionTitle icon={Wallet} title="Gift register" hint="Search, filter and sort the latest verified and pending gifts." />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search donor, company or fund…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-[12.5px] text-slate-700 shadow-sm outline-none transition focus:border-[#0055A5] focus:ring-2 focus:ring-[#0055A5]/15"
          />
        </div>
        {(["ALL", "VERIFIED", "PENDING"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[11px] font-bold transition",
              status === s ? "border-[#003366] bg-[#003366] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-[#C59B27]"
            )}
          >
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-[12.5px]">
          <thead>
            <tr className="border-b border-slate-200 text-left text-[10px] uppercase tracking-wider text-slate-400">
              <th className="cursor-pointer py-2 pr-2 font-bold hover:text-[#003366]" onClick={() => toggle("donor")}>
                Donor {sort.key === "donor" ? (sort.dir === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="py-2 pr-2 font-bold">Fund</th>
              <th className="cursor-pointer py-2 pr-2 text-right font-bold hover:text-[#003366]" onClick={() => toggle("amount")}>
                Amount {sort.key === "amount" ? (sort.dir === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="py-2 pr-2 font-bold">Channel</th>
              <th className="cursor-pointer py-2 text-right font-bold hover:text-[#003366]" onClick={() => toggle("date")}>
                Date {sort.key === "date" ? (sort.dir === "asc" ? "↑" : "↓") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((g, i) => (
              <tr
                key={g.id}
                className="animate-fade-up border-b border-slate-50 transition hover:bg-slate-50/80"
                style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
              >
                <td className="py-2.5 pr-2">
                  <p className="font-semibold text-[#003366]">{g.donor}</p>
                  {g.organization ? <p className="text-[10.5px] text-slate-400">{g.organization}</p> : null}
                </td>
                <td className="py-2.5 pr-2 text-slate-600">{g.campaign}</td>
                <td className="py-2.5 pr-2 text-right font-bold tabular-nums text-[#003366]">{formatNgn(g.amountNgn)}</td>
                <td className="py-2.5 pr-2">
                  <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10.5px] font-semibold text-slate-600">{g.channel}</span>
                </td>
                <td className="py-2.5 text-right">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                      g.status === "VERIFIED" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    )}
                  >
                    {g.status === "VERIFIED" ? "Verified" : "Pending"}
                  </span>
                  <span className="mt-0.5 block text-[10.5px] text-slate-400">{prettyDate(g.date)}</span>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-400">No gifts match that filter.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
        <span>
          Showing <strong className="text-slate-700">{rows.length}</strong> of {RECENT_GIFTS.length} entries
        </span>
        <span>
          Sub-total <strong className="font-bold text-[#003366]">{formatNgn(total)}</strong>
        </span>
      </div>
    </Card>
  );
}
