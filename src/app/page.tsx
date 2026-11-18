import Link from "next/link";
import {
  ArrowRight,
  Award,
  Building2,
  Globe2,
  GraduationCap,
  Handshake,
  Landmark,
  ShieldCheck,
  Sparkles,
  Microscope,
  Cpu,
  Quote,
} from "lucide-react";
import { getFeaturedCampaigns, getStats, getCampaigns } from "@/lib/data";
import { formatNgn } from "@/lib/currency";
import { CampaignCard } from "@/components/campaign-card";
import { Badge, Button, SectionHeading, Card } from "@/components/ui";
import { STRATEGIC_2026 } from "@/lib/constants/leadership";

export const revalidate = 60;

const IMPACT = [
  { value: "2002", label: "Advancement Office Established via MacArthur Foundation Initiative" },
  { value: "RC 61670", label: "Independently Incorporated Fiduciary Trust" },
  { value: "300,000+", label: "Global UNIPORT Alumni Network" },
  { value: "100%", label: "Audited Donor Stewardship" },
];

/** UPHF fundraising pillars mapped onto the 10th Vice-Chancellor's Eight-Point Strategic Agenda. */
const AGENDA_ALIGNMENT = [
  {
    icon: Landmark,
    title: "Endowments",
    body: "Perpetual capital and professorial chairs that underwrite the University's long-term financial independence.",
  },
  {
    icon: Microscope,
    title: "Research Grants",
    body: "Competitive research funding directed at impactful scholarship and problem-solving science.",
  },
  {
    icon: Cpu,
    title: "Technological Innovation",
    body: "Digital fabrication studios, modern instrumentation, and innovation infrastructure for a 21st-century campus.",
  },
  {
    icon: GraduationCap,
    title: "Scholarships",
    body: "Need-tested access that keeps brilliant Uniques in the classroom, irrespective of family income.",
  },
];

const FOCUS = [
  {
    icon: Landmark,
    title: "Endowment & Infrastructure",
    body: "Perpetual endowments, professorial chairs, and milestone-tranched laboratory and lecture-hall renewal — every tranche independently certified before the next is released.",
    href: "/campaigns",
  },
  {
    icon: GraduationCap,
    title: "Student Scholarships & Fellowships",
    body: "Need-tested full and partial scholarships, upkeep stipends, and emergency aid that keep brilliant Uniques enrolled — with GPA-tracked stewardship files for every scholar.",
    href: "/campaigns",
  },
  {
    icon: Handshake,
    title: "Industry & Global Linkages",
    body: "Structured CSR, tax-efficient giving, and R&D collaborations with TotalEnergies, NNPC Ltd, PTDF, IFP School France, MacArthur, NHEF, and Fulbright networks.",
    href: "/partnerships",
  },
];

export default async function HomePage() {
  const [featured, stats, all] = await Promise.all([
    getFeaturedCampaigns(3),
    getStats(),
    getCampaigns("ALL"),
  ]);
  const display = featured.length ? featured : all.slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#003366] text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #C59B27 0, transparent 40%), radial-gradient(circle at 85% 15%, #0055A5 0, transparent 45%), radial-gradient(circle at 60% 90%, #ffffff22 0, transparent 40%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:py-24 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="animate-fade-up">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="gold">RC 61670 • Fiduciary Trust</Badge>
              <Badge tone="green">Est. 2002 • Incorporated 2013</Badge>
              <Badge tone="slate">Golden Jubilee Era • 2026</Badge>
            </div>
            <h1 className="mt-5 font-serif text-4xl leading-[1.12] md:text-5xl lg:text-[3.4rem]">
              Advancing Academic Excellence Through{" "}
              <span className="text-[#C59B27]">Strategic Philanthropy</span> &amp;
              Global Partnerships.
            </h1>
            <p className="mt-5 max-w-xl text-white/80 leading-relaxed">
              The University of Port Harcourt Foundation is the official
              advancement, endowment, and alumni relations arm of UNIPORT —
              stewarding every gift in ring-fenced accounts with quarterly
              milestone reporting and public recognition. In this{" "}
              <strong className="text-white">{STRATEGIC_2026.milestone}</strong> era we
              fund the{" "}
              <strong className="text-white">{STRATEGIC_2026.agenda}</strong> of the 10th
              Vice-Chancellor, {STRATEGIC_2026.viceChancellorShortName}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/donate">
                <Button variant="gold" className="px-7 py-3.5 text-base">
                  Give Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/campaigns">
                <Button
                  variant="outline"
                  className="border-white/30 bg-white/10 px-7 py-3.5 text-base text-white hover:bg-white hover:text-[#003366]"
                >
                  Explore Campaigns
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/60">
              {formatNgn(stats.totalRaisedNgn)} raised across {stats.activeCampaigns} active campaigns •{" "}
              {stats.totalDonors.toLocaleString()} verified donors
            </p>
          </div>

          <Card className="animate-fade-up-2 border-white/10 bg-white/[0.07] p-6 backdrop-blur text-white !bg-white/10">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#C59B27]">
              Stewardship at a glance
            </p>
            <ul className="mt-4 space-y-4 text-sm">
              {[
                { icon: ShieldCheck, t: "Ring-fenced fiduciary accounts", d: "No co-mingling. Every fund tracked naira-for-naira." },
                { icon: Award, t: "Quarterly milestone reporting", d: "Photos, QS certificates & scholar progression notes." },
                { icon: Globe2, t: "Multi-currency giving", d: "NGN via Paystack • USD/GBP/EUR via Stripe • Bank wire." },
              ].map((r) => (
                <li key={r.t} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C59B27]/20 text-[#C59B27]">
                    <r.icon className="h-4.5 w-4.5" />
                  </span>
                  <span>
                    <span className="block font-bold">{r.t}</span>
                    <span className="block text-white/70">{r.d}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/stewardship"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#C59B27] hover:text-white"
            >
              Read the Stewardship Charter <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        </div>
      </section>

      {/* IMPACT STRIP */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px lg:grid-cols-4">
          {IMPACT.map((s, i) => (
            <div
              key={s.value}
              className={`px-6 py-8 text-center animate-fade-up-${i % 3}`}
            >
              <p className="font-serif text-3xl md:text-4xl font-black text-[#003366]">{s.value}</p>
              <p className="mx-auto mt-2 max-w-[240px] text-xs font-semibold leading-relaxed text-slate-600">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 2026 INSTITUTIONAL ALIGNMENT — GOLDEN JUBILEE */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <SectionHeading
          eyebrow={`${STRATEGIC_2026.milestone} • 2026 Administration`}
          title={`A shared vision for a globally respected university`}
          lede={`UNIPORT's ${STRATEGIC_2026.milestone} milestone coincides with the inauguration of the 10th Vice-Chancellor. The Foundation's four fundraising pillars are deliberately mapped to the ${STRATEGIC_2026.agenda} — so every naira raised answers a named institutional priority.`}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {AGENDA_ALIGNMENT.map((a) => (
            <Card key={a.title} className="p-6 hover:shadow-[0_12px_40px_rgba(0,51,102,0.12)] hover:-translate-y-1 transition-all">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#003366] text-[#C59B27]">
                <a.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-serif text-lg text-[#003366]">{a.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{a.body}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-l-4 !border-l-[#C59B27] p-7">
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#003366]">
              <Quote className="h-4 w-4 text-[#C59B27]" /> {STRATEGIC_2026.vision}
            </p>
            <p className="mt-3 font-serif text-xl leading-snug text-[#003366]">
              “A globally respected university — built on technological innovation,
              impactful research, societal relevance, and sustainable development.”
            </p>
            <p className="mt-3 text-sm text-slate-600">
              — {STRATEGIC_2026.viceChancellor}, {STRATEGIC_2026.viceChancellorOffice} &amp;
              Institutional Patron, UPHF (assumed office July 2026).
            </p>
            <p className="mt-4 text-[13px] leading-relaxed text-slate-600">
              The {STRATEGIC_2026.agenda}: {STRATEGIC_2026.agendaPillars.join(" · ")}.
            </p>
          </Card>

          <Card className="bg-[#003366] !border-[#003366] p-7 text-white">
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#C59B27]">
              <Building2 className="h-4 w-4" /> Host Community & Town-and-Gown Synergy
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              Alongside corporate and international donors, UPHF supports host-community
              development and bilateral partnerships across the{" "}
              <strong className="text-white">{STRATEGIC_2026.hostCommunities.join(", ")}</strong>{" "}
              kingdoms — so that the University&apos;s growth stays socially rooted and
              mutually beneficial.
            </p>
            <Link
              href="/partnerships"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#C59B27] hover:text-white"
            >
              Partner with UPHF <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        </div>
      </section>

      {/* FOCUS AREAS */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <SectionHeading
          eyebrow="Core Focus Areas"
          title="Three pillars. One mandate: excellence."
          lede="Gifts are structured for permanence and traceability — endowment principal is preserved, scholarships are need-tested, and industry projects are milestone-certified."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {FOCUS.map((f) => (
            <Card key={f.title} className="p-7 hover:shadow-[0_12px_40px_rgba(0,51,102,0.12)] hover:-translate-y-1 transition-all">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#003366] text-[#C59B27]">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-serif text-xl text-[#003366]">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.body}</p>
              <Link href={f.href} className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#0055A5] hover:text-[#003366]">
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* FEATURED CAMPAIGNS */}
      <section className="bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-[0.22em] uppercase text-[#C59B27]">Featured Active Campaigns</p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl text-[#003366]">Give where it moves the needle</h2>
              <p className="mt-3 text-slate-600">Live funding progress across NGN & USD. Every campaign page includes naming tiers and a quick-pledge widget.</p>
            </div>
            <Link href="/campaigns">
              <Button variant="navy">View all campaigns <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {display.map((c) => (
              <CampaignCard key={c.id} campaign={c} currency="NGN" />
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BANNER */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#003366] to-[#0055A5] p-8 md:p-12 text-white">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#C59B27]/25 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] items-center">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold tracking-[0.22em] uppercase text-[#C59B27]">
                <Building2 className="h-4 w-4" /> Donor Trust & Fiduciary Governance
              </p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl leading-tight">
                Your gift is a covenant. We treat it like one.
              </h2>
              <p className="mt-4 max-w-2xl text-white/80 leading-relaxed">
                Independently incorporated as RC 61670 on June 5, 2013. Ring-fenced
                accounts, external audit, quarterly milestone evidence, and a public
                Donor Wall of Honor for opted-in donors. Download the audited reports
                and see exactly where every naira went.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link href="/stewardship">
                <Button variant="gold" className="w-full justify-center">View Stewardship Reports</Button>
              </Link>
              <Link href="/donate">
                <Button variant="outline" className="w-full justify-center border-white/40 bg-transparent text-white hover:bg-white hover:text-[#003366]">
                  Make a gift today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
