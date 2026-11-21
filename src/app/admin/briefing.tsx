"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  DatabaseZap,
  RotateCcw,
  RefreshCw,
  Radio,
  Check,
  AlertTriangle,
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
          tone === "gold" ? "bg-gradient-to-r from-[#D6A419] to-[#e0bb56]" : "bg-gradient-to-r from-[#173377] to-[#0C76B4]"
        )}
      />
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            tone === "gold" ? "bg-[#D6A419]/12 text-[#96700F]" : "bg-[#173377]/8 text-[#173377]"
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>
        {delta != null ? <Delta value={delta} /> : null}
      </div>
      <p className="mt-3 font-serif text-2xl leading-tight text-[#173377]">{children}</p>
      <p className="mt-0.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
      {spark ? <Sparkline values={spark} className="mt-2" stroke={tone === "gold" ? "#D6A419" : "#0C76B4"} /> : null}
    </Card>
  );
}

function SectionTitle({ icon: Icon, title, hint }: { icon: React.ComponentType<{ className?: string }>; title: string; hint?: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="flex items-center gap-2 text-sm font-bold text-[#173377]">
          <Icon className="h-4 w-4 text-[#D6A419]" /> {title}
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
  partnership: "bg-[#0C76B4]/10 text-[#0C76B4]",
  programme: "bg-[#D6A419]/15 text-[#96700F]",
  governance: "bg-[#173377]/8 text-[#173377]",
  compliance: "bg-violet-50 text-violet-700",
} as const;

function prettyDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

/* ────────────────────────── live portal gifts ────────────────────────── */

interface LiveGift {
  id: string;
  donorName: string;
  donorEmail: string;
  organization: string | null;
  amount: string;
  currency: string;
  amountNgnEquivalent: number;
  displayOnDonorWall: boolean;
  paymentStatus: string;
  paymentGateway: string;
  gatewayReference: string | null;
  pledgeReference: string | null;
  createdAt: string;
  campaignTitle: string | null;
  isDemo: boolean;
}

interface LiveStats {
  total: number;
  verified: number;
  pending: number;
  onWall: number;
  verifiedNgn: number;
}

const CHANNEL_LABEL: Record<string, GiftRow["channel"]> = {
  PAYSTACK: "Paystack",
  STRIPE: "Stripe",
  BANK_WIRE: "Bank wire",
};

function toRow(g: LiveGift): GiftRow & { live?: boolean; demo?: boolean; email?: string } {
  return {
    id: g.id,
    donor: g.donorName,
    organization: g.organization,
    campaign: g.campaignTitle ?? "Untied General Endowment Fund",
    amountNgn: Number(g.amountNgnEquivalent ?? 0),
    channel: CHANNEL_LABEL[g.paymentGateway] ?? "Paystack",
    status: g.paymentStatus === "VERIFIED" ? "VERIFIED" : "PENDING",
    date: (g.createdAt ?? "").slice(0, 10),
    live: true,
    demo: g.isDemo,
    email: g.donorEmail,
  };
}

function useLiveGifts() {
  const [gifts, setGifts] = useState<LiveGift[]>([]);
  const [stats, setStats] = useState<LiveStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/gifts", { cache: "no-store" });
      if (res.status === 401) {
        setError("session");
        return;
      }
      const j = await res.json();
      setGifts(j.gifts ?? []);
      setStats(j.stats ?? null);
      setError(j.error ?? null);
    } catch {
      setError("offline");
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;
    const tick = async () => {
      if (cancelled) return;
      await load();
      if (!cancelled) timer = setTimeout(tick, 20000);
    };
    void tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [load]);

  return { gifts, stats, error, syncing, reload: load };
}

/* ────────────────────────── the briefing ────────────────────────── */

export function BoardBriefing() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("FY 2026");
  const t = totalsFor(period);
  const { gifts: liveGifts, stats: liveStats, error: liveError, syncing: syncingLive, reload: reloadLive } = useLiveGifts();

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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#10275C] via-[#173377] to-[#0C76B4] p-6 text-white shadow-lg animate-fade-up">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 20%, #D6A419 0, transparent 38%), radial-gradient(circle at 88% 10%, #ffffff33 0, transparent 42%)",
          }}
        />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#D6A419]/60 bg-[#D6A419]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#F3DFA6]">
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
                    period === p ? "bg-[#D6A419] text-[#173377] shadow" : "text-white/80 hover:bg-white/10"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="flex items-center gap-2 text-[11px] text-white/50">
              Updated {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 font-bold text-emerald-100">
                <Radio className="h-3 w-3 animate-pulse" />
                {liveError ? "ledger offline" : `${liveStats?.total ?? 0} portal gifts`}
              </span>
            </p>
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
                <p className="text-sm font-bold text-[#173377]">{shortNgn(c.v)}</p>
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
                color: ["#173377", "#D6A419", "#0C76B4", "#7aa7d4"][i],
              }))}
              centerLabel="Total verified"
              centerValue={shortNgn(TOTAL_RAISED_NGN)}
            />
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Endowment corpus ring-fenced</p>
            <p className="mt-0.5 font-serif text-lg text-[#173377]">₦1.15bn</p>
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
                { name: "Online", color: "#0C76B4" },
                { name: "Corporate CSR", color: "#D6A419" },
                { name: "Bank wire", color: "#173377" },
              ]}
            />
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle icon={Megaphone} title="Gift pipeline · FY2026" hint="From first inquiry to tranche release." />
          <div className="mt-5">
            <Funnel steps={PIPELINE} />
          </div>
          <div className="mt-4 rounded-xl border border-[#D6A419]/40 bg-[#D6A419]/8 p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#96700F]">Open pipeline value</p>
            <p className="mt-0.5 font-serif text-lg text-[#173377]">₦486.5m</p>
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
                    <p className="text-sm font-bold text-[#173377]">{c.name}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#D6A419]">{c.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold tabular-nums text-[#173377]">
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
        <GiftTable
          liveRows={liveGifts.map(toRow)}
          liveStats={liveStats}
          liveError={liveError}
          syncing={syncingLive}
          onReload={reloadLive}
        />
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
                    <p className="text-[13px] font-bold leading-snug text-[#173377]">
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
                    <span className="font-semibold text-[#173377]">{u.label}</span>
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
                  <p className="text-[12px] font-bold tabular-nums text-[#173377]">{u.value}%</p>
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
                  <p className={cn("text-[12px] font-bold tabular-nums", c.value === 100 ? "text-emerald-700" : "text-[#96700F]")}>
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
                  <p className="text-[12px] font-bold tabular-nums text-[#173377]">{shortNgn(p.amountNgn)}</p>
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
                  <p className="text-[12px] font-bold text-[#173377]">{c.name}</p>
                  <p className="text-[12px] font-bold tabular-nums text-slate-600">{c.donors}</p>
                </div>
                <div className="mt-1.5">
                  <ProgressBar value={(c.donors / CHAPTERS[0].donors) * 100} delay={i * 70} tone={i % 2 ? "gold" : "navy"} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-[#173377] p-5 text-white !border-[#173377]">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#D6A419]">
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
                <span className="font-serif text-base font-bold text-[#D6A419]">{s.v}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-1.5 text-[11px] text-white/60">
            <ArrowUpRight className="h-3.5 w-3.5 text-[#D6A419]" /> Host-community synergy across Choba, Aluu and Akpor.
          </p>
        </Card>
      </div>

      <DemoControls onChanged={reloadLive} />

      <p className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-[11px] text-slate-500">
        <ArrowDownRight className="h-3.5 w-3.5" />
        <strong className="font-bold text-slate-600">Illustrative board briefing.</strong>
        Figures on this tab are a demonstration dataset for presentation purposes; the
        <em className="mx-1 not-italic font-semibold text-[#173377]">Live operations</em> tab always reflects the
        connected database.
      </p>
    </div>
  );
}

/* ────────────────────────── gift table ────────────────────────── */

type SortKey = "donor" | "amount" | "date";

type RegisterRow = GiftRow & { live?: boolean; demo?: boolean; email?: string };

function GiftTable({
  liveRows,
  liveStats,
  liveError,
  syncing,
  onReload,
}: {
  liveRows: RegisterRow[];
  liveStats: LiveStats | null;
  liveError: string | null;
  syncing: boolean;
  onReload: () => void;
}) {
  const [status, setStatus] = useState<"ALL" | GiftRow["status"] | "LIVE">("ALL");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "date", dir: "desc" });

  const all = useMemo<RegisterRow[]>(() => [...liveRows, ...RECENT_GIFTS], [liveRows]);

  const rows = useMemo(() => {
    const filtered = all.filter((g) => {
      const okStatus =
        status === "ALL" ? true : status === "LIVE" ? Boolean(g.live) : g.status === status;
      const hay = `${g.donor} ${g.organization ?? ""} ${g.campaign}`.toLowerCase();
      return okStatus && hay.includes(q.toLowerCase());
    });
    return [...filtered].sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      if (sort.key === "amount") return (a.amountNgn - b.amountNgn) * dir;
      if (sort.key === "date") return (a.date < b.date ? -1 : a.date > b.date ? 1 : 0) * dir;
      return a.donor.localeCompare(b.donor) * dir;
    });
  }, [all, status, q, sort]);

  const toggle = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));

  const total = rows.reduce((s, r) => s + r.amountNgn, 0);
  const liveCount = liveRows.length;

  return (
    <Card className="p-5 lg:col-span-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <SectionTitle
          icon={Wallet}
          title="Gift register"
          hint="Gifts completed on the donor portal land here automatically — verified, walled and counted."
        />
        <button
          onClick={onReload}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-600 transition hover:border-[#D6A419] hover:text-[#173377]"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", syncing ? "animate-spin" : "")} /> Sync
        </button>
      </div>

      {/* live banner */}
      <div
        className={cn(
          "mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border px-3 py-2 text-[11.5px]",
          liveError
            ? "border-amber-200 bg-amber-50 text-amber-900"
            : "border-emerald-200 bg-emerald-50 text-emerald-900"
        )}
      >
        {liveError ? <AlertTriangle className="h-3.5 w-3.5" /> : <Radio className="h-3.5 w-3.5 animate-pulse" />}
        <span className="font-bold">
          {liveError
            ? "Live ledger unreachable — run “Prepare database” in Demo controls below, then retry."
            : `${liveCount} gift${liveCount === 1 ? "" : "s"} received from the donor portal`}
        </span>
        {!liveError && liveStats ? (
          <>
            <span className="text-emerald-800/80">· {liveStats.verified} verified</span>
            <span className="text-emerald-800/80">· {liveStats.pending} pending</span>
            <span className="text-emerald-800/80">· {liveStats.onWall} on the Donor Wall</span>
            <span className="font-bold">· {formatNgn(liveStats.verifiedNgn)} banked</span>
          </>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search donor, company or fund…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-[12.5px] text-slate-700 shadow-sm outline-none transition focus:border-[#0C76B4] focus:ring-2 focus:ring-[#0C76B4]/15"
          />
        </div>
        {(["ALL", "LIVE", "VERIFIED", "PENDING"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[11px] font-bold transition",
              status === s ? "border-[#173377] bg-[#173377] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-[#D6A419]"
            )}
          >
            {s === "ALL" ? "All" : s === "LIVE" ? "Portal" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-[12.5px]">
          <thead>
            <tr className="border-b border-slate-200 text-left text-[10px] uppercase tracking-wider text-slate-400">
              <th className="cursor-pointer py-2 pr-2 font-bold hover:text-[#173377]" onClick={() => toggle("donor")}>
                Donor {sort.key === "donor" ? (sort.dir === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="py-2 pr-2 font-bold">Fund</th>
              <th className="cursor-pointer py-2 pr-2 text-right font-bold hover:text-[#173377]" onClick={() => toggle("amount")}>
                Amount {sort.key === "amount" ? (sort.dir === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="py-2 pr-2 font-bold">Channel</th>
              <th className="cursor-pointer py-2 text-right font-bold hover:text-[#173377]" onClick={() => toggle("date")}>
                Date {sort.key === "date" ? (sort.dir === "asc" ? "↑" : "↓") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((g, i) => (
              <tr
                key={g.id}
                className={cn(
                  "animate-fade-up border-b border-slate-50 transition hover:bg-slate-50/80",
                  g.live ? "bg-emerald-50/30" : ""
                )}
                style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
              >
                <td className="py-2.5 pr-2">
                  <p className="flex items-center gap-1.5 font-semibold text-[#173377]">
                    {g.live ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" /> : null}
                    {g.donor}
                  </p>
                  {g.organization ? <p className="text-[10.5px] text-slate-400">{g.organization}</p> : null}
                  {g.email ? <p className="text-[10px] text-slate-400">{g.email}</p> : null}
                </td>
                <td className="py-2.5 pr-2 text-slate-600">{g.campaign}</td>
                <td className="py-2.5 pr-2 text-right font-bold tabular-nums text-[#173377]">{formatNgn(g.amountNgn)}</td>
                <td className="py-2.5 pr-2">
                  <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10.5px] font-semibold text-slate-600">{g.channel}</span>
                  {g.live && g.demo ? (
                    <span className="ml-1 rounded-md bg-[#D6A419]/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#96700F]">demo</span>
                  ) : null}
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
                <td colSpan={5} className="py-6 text-center text-slate-400">
                  No gifts match that filter. Completed portal gifts appear here automatically.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
        <span>
          Showing <strong className="text-slate-700">{rows.length}</strong> of {all.length} entries
        </span>
        <span>
          Sub-total <strong className="font-bold text-[#173377]">{formatNgn(total)}</strong>
        </span>
      </div>
    </Card>
  );
}

/* ────────────────────────── demo controls ────────────────────────── */

function DemoControls({ onChanged }: { onChanged: () => void }) {
  const [busy, setBusy] = useState<"" | "setup" | "demo" | "all">("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function run(kind: "setup" | "demo" | "all") {
    setBusy(kind);
    setMsg(null);
    try {
      if (kind === "setup") {
        const res = await fetch("/api/admin/setup", { method: "POST" });
        const j = await res.json();
        setMsg({
          ok: Boolean(j.ok),
          text: j.ok
            ? `Database ready — ${j.campaigns} campaigns, ${j.statementsRun} statements applied${
                j.warnings?.length ? ` (${j.warnings.length} non-fatal warnings)` : ""
              }.`
            : `Setup failed: ${j.error ?? "unknown error"}`,
        });
      } else {
        if (kind === "all" && !window.confirm("Delete EVERY gift in the ledger? This cannot be undone.")) {
          setBusy("");
          return;
        }
        const res = await fetch("/api/admin/demo-reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scope: kind }),
        });
        const j = await res.json();
        setMsg({
          ok: Boolean(j.ok),
          text: j.ok
            ? `Cleared ${j.cleared} ${kind === "demo" ? "demo" : ""} gift${j.cleared === 1 ? "" : "s"}. Campaign totals have been adjusted.`
            : `Reset failed: ${j.error ?? "unknown error"}`,
        });
      }
      onChanged();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Request failed" });
    } finally {
      setBusy("");
    }
  }

  return (
    <Card className="border-dashed p-5">
      <p className="flex items-center gap-2 text-sm font-bold text-[#173377]">
        <DatabaseZap className="h-4 w-4 text-[#D6A419]" /> Demo controls
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Prepare the database before the board tests the donor journey, then wipe the rehearsal
        gifts once approval is given. Only <span className="font-mono">demo_</span> references are
        removed by the demo reset — real gifts are never touched.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => run("setup")}
          disabled={busy !== ""}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#173377] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#10275C] disabled:opacity-50"
        >
          {busy === "setup" ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <DatabaseZap className="h-3.5 w-3.5" />}
          Prepare database
        </button>
        <button
          onClick={() => run("demo")}
          disabled={busy !== ""}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-[#173377] transition hover:border-[#D6A419] disabled:opacity-50"
        >
          {busy === "demo" ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
          Reset demo gifts
        </button>
        <button
          onClick={() => run("all")}
          disabled={busy !== ""}
          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
        >
          {busy === "all" ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <AlertTriangle className="h-3.5 w-3.5" />}
          Reset all gifts
        </button>
      </div>
      {msg ? (
        <p
          className={cn(
            "mt-3 flex items-start gap-1.5 rounded-lg px-3 py-2 text-[11.5px]",
            msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"
          )}
        >
          {msg.ok ? <Check className="mt-0.5 h-3.5 w-3.5" /> : <AlertTriangle className="mt-0.5 h-3.5 w-3.5" />}
          {msg.text}
        </p>
      ) : null}
    </Card>
  );
}
