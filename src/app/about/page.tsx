import Link from "next/link";
import {
  BookOpen,
  Eye,
  Target,
  Landmark,
  Users,
  Handshake,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Building2,
  Microscope,
  Cpu,
} from "lucide-react";
import { getLeadership } from "@/lib/data";
import { Badge, Card, SectionHeading } from "@/components/ui";
import { LEADERSHIP_GROUPS, STRATEGIC_2026, leadershipByGroup } from "@/lib/constants/leadership";

export const revalidate = 120;
export const metadata = { title: "About UPHF" };

const PILLARS = [
  { icon: Landmark, title: "Endowment Building", body: "Growing perpetual capital whose audited yield funds chairs, bursaries, and renewal in perpetuity." },
  { icon: GraduationCap, title: "Scholarships & Access", body: "Need-tested aid that keeps brilliant indigent Uniques enrolled through graduation." },
  { icon: BookOpen, title: "Infrastructure & Learning Environments", body: "Milestone-tranched labs, libraries, and lecture wings with QS-certified delivery." },
  { icon: Handshake, title: "Industry & Government Linkages", body: "Structured CSR, R&D chairs, and energy-transition collaborations with global partners." },
  { icon: Users, title: "Alumni Relations & Class Giving", body: "300,000+ Uniques worldwide mobilised through chapters and reunion legacy projects." },
  { icon: Building2, title: "Host Community & Town-and-Gown Synergy", body: "Bilateral partnerships across Choba, Aluu, and Akpor kingdoms that keep the University socially rooted." },
];

/** Fundraising pillars re-aligned to the 10th Vice-Chancellor's Eight-Point Strategic Agenda. */
const AGENDA_ALIGNMENT = [
  { icon: Landmark, title: "Endowments", body: "Perpetual capital and professorial chairs that underwrite the University's financial independence." },
  { icon: Microscope, title: "Research Grants", body: "Competitive research funding aimed at impactful, problem-solving scholarship." },
  { icon: Cpu, title: "Technological Innovation", body: "Digital fabrication, instrumentation renewal, and innovation infrastructure for a modern Uniport." },
  { icon: GraduationCap, title: "Scholarships", body: "Need-tested access that keeps talent in the classroom regardless of family income." },
];

function Initials({ name }: { name: string }) {
  const clean = name
    .replace(/^Prof\.\s+/, "")
    .replace(/^Professor\s+/, "")
    .replace(/^Senator\s+/, "")
    .replace(/^Rev\.\s+\(Dr\.\)\s+/, "")
    .replace(/^Mrs\.\s+/, "")
    .replace(/^Dr\.\s+/, "");
  const parts = clean.split(" ").filter(Boolean);
  return <>{(parts[0]?.charAt(0) ?? "") + (parts[1]?.charAt(0) ?? "")}</>;
}

export default async function AboutPage() {
  const leaders = await getLeadership();
  const trustees = leadershipByGroup(leaders, "BOARD_OF_TRUSTEES");
  const directorate = leadershipByGroup(leaders, "DIRECTORATE");
  const heritage = leadershipByGroup(leaders, "PAST_DIRECTORS");

  return (
    <div>
      <section className="bg-[#003366] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="gold">About the Foundation • RC 61670</Badge>
            <Badge tone="green">Golden Jubilee Era • 2026 Administration</Badge>
          </div>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl md:text-5xl leading-tight">
            From the “UNIPORT Miracle” to a perpetual fiduciary trust.
          </h1>
          <p className="mt-4 max-w-2xl text-white/75 leading-relaxed">
            The University of Port Harcourt Foundation is the official advancement,
            endowment, and alumni relations arm of UNIPORT — born of a 2002
            philanthropy catalyst, incorporated on June 5, 2013, and now aligned with the
            {" "}<strong className="text-white">“{STRATEGIC_2026.vision}”</strong> of the 10th
            Vice-Chancellor, {STRATEGIC_2026.viceChancellorShortName}.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:py-18">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] uppercase text-[#C59B27]">Our History</p>
            <h2 className="mt-3 font-serif text-3xl text-[#003366]">2002: the MacArthur catalyst</h2>
            <div className="mt-5 space-y-4 text-slate-700 leading-relaxed text-[15px]">
              <p>
                In 2002, the MacArthur Foundation selected the University of Port
                Harcourt for a landmark institutional-strengthening initiative —
                an intervention so transformative that campus chroniclers still
                call it the <strong>“UNIPORT Miracle.”</strong> At its heart was a
                radical idea for Nigerian higher education at the time: a
                professional <strong>Advancement Office</strong> that would
                systematically cultivate alumni, industry, and philanthropic
                partnerships rather than depend solely on subventions.
              </p>
              <p>
                The Advancement Office, seeded at Delta Park, proved the model.
                Alumni chapters re-engaged, industry partners co-funded chairs and
                laboratories, and scholarship pipelines opened. To give this work
                permanence and fiduciary independence, the University moved to
                incorporate a dedicated trust.
              </p>
              <h3 className="font-serif text-2xl text-[#003366] pt-2">June 5, 2013: RC 61670</h3>
              <p>
                On <strong>June 5, 2013</strong>, the Corporate Affairs Commission
                formally incorporated the <strong>University of Port Harcourt
                Foundation (RC 61670)</strong> as an independent, non-profit
                fiduciary trust. Its mandate: to receive, invest, and steward
                philanthropic capital for the University — with ring-fenced
                accounts, external audit, and public reporting as constitutional
                obligations, not courtesies.
              </p>
              <p>
                Today the Foundation operates from the{" "}
                <strong>University Advancement Centre, Delta Park</strong>,
                coordinating endowments, scholarships, industry linkages, and a
                global alumni network of more than <strong>300,000 Uniques</strong>.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <Card className="p-6 border-l-4 !border-l-[#C59B27]">
              <p className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#003366]"><Eye className="h-4 w-4 text-[#C59B27]" /> Vision</p>
              <p className="mt-2 font-serif text-lg text-[#003366] leading-snug">
                A world-class African university, sustainably resourced by its own
                community of alumni, friends, and partners — a{" "}
                <em>globally respected university</em>.
              </p>
            </Card>
            <Card className="p-6 border-l-4 !border-l-[#0055A5]">
              <p className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#003366]"><Target className="h-4 w-4 text-[#0055A5]" /> Mission</p>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                To mobilise, invest, and steward philanthropic capital for
                scholarships, endowments, infrastructure, and research — with
                absolute fiduciary discipline and transparent public accountability.
              </p>
            </Card>
            <Card className="p-6 bg-[#003366] !border-[#003366] text-white">
              <p className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#C59B27]"><ShieldCheck className="h-4 w-4" /> Fiduciary Promise</p>
              <ul className="mt-3 space-y-2 text-sm text-white/85">
                <li>• Ring-fenced accounts per fund — never co-mingled</li>
                <li>• Independent external audit, published annually</li>
                <li>• Quarterly milestone evidence before next tranche</li>
                <li>• Public Donor Wall of Honor (opt-in only)</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* 2026 STRATEGIC ALIGNMENT */}
      <section className="bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-18">
          <SectionHeading
            eyebrow="2026 Strategic Alignment"
            title="Golden Jubilee, and a shared vision for a globally respected university"
            lede={`As UNIPORT marks its ${STRATEGIC_2026.milestone} milestone, the Foundation aligns every fundraising pillar with the ${STRATEGIC_2026.agenda} of the 10th Vice-Chancellor — technological innovation, impactful research, societal relevance, and sustainable development.`}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {AGENDA_ALIGNMENT.map((a) => (
              <Card key={a.title} className="p-6 hover:shadow-lg transition">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#003366] text-[#C59B27]">
                  <a.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-serif text-lg text-[#003366]">{a.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{a.body}</p>
              </Card>
            ))}
          </div>
          <Card className="mt-8 border-l-4 !border-l-[#C59B27] p-6">
            <p className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#003366]">
              <Sparkles className="h-4 w-4 text-[#C59B27]" /> Eight-Point Strategic Agenda
            </p>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              The 2026 administration is organised around an{" "}
              <strong>{STRATEGIC_2026.agenda}</strong> under the{" "}
              <strong>“{STRATEGIC_2026.vision}”</strong>. The Foundation funds the pillars
              of that agenda it can move fastest:{" "}
              {STRATEGIC_2026.agendaPillars.join(" · ")}.
            </p>
          </Card>
          <Card className="mt-5 p-6">
            <p className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#003366]">
              <Building2 className="h-4 w-4 text-[#0055A5]" /> Host Community & Town-and-Gown Synergy
            </p>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              UPHF also supports host-community development and bilateral partnerships
              across the <strong>{STRATEGIC_2026.hostCommunities.join(", ")}</strong> kingdoms,
              working alongside corporate and international donors so that the
              University&apos;s growth remains socially rooted and mutually beneficial.
            </p>
            <Link href="/partnerships" className="mt-4 inline-flex text-sm font-bold text-[#0055A5] hover:text-[#003366]">
              Explore partnership pathways →
            </Link>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading eyebrow="How we work" title="Six operational pillars" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Card key={p.title} className="p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#003366]/8 text-[#003366] font-serif font-black">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 flex items-center gap-1.5 text-sm font-bold text-[#003366]"><p.icon className="h-4 w-4 text-[#C59B27]" />{p.title}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{p.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* GOVERNANCE */}
      <span id="leadership" className="block scroll-mt-24" aria-hidden="true" />
      <section id="governance" className="bg-white border-t border-slate-200 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-18">
          <SectionHeading
            eyebrow="Governance & Leadership • 2026"
            title="Institutional Patrons, Executive Directorate & Institutional Heritage"
            lede="Fiduciary leadership drawn from UNIPORT's most distinguished scholars and administrators. Historic officeholders are preserved in the archive so institutional continuity is visible, not erased. Profiles are maintained by the Advancement office and editable via the admin CMS."
          />

          {/* Quick-jump tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              { href: "#governance-trustees", label: "Institutional Patrons & Board of Trustees", count: trustees.length },
              { href: "#governance-directorate", label: "Executive Directorate", count: directorate.length },
              { href: "#governance-heritage", label: "Founding Stewards & Past Directors", count: heritage.length },
            ].map((t) => (
              <a
                key={t.href}
                href={t.href}
                className="rounded-full border border-[#003366]/20 bg-[#003366]/5 px-4 py-2 text-xs font-bold tracking-wide text-[#003366] transition hover:border-[#C59B27] hover:text-[#0055A5]"
              >
                {t.label} <span className="ml-1 text-[#C59B27]">{t.count}</span>
              </a>
            ))}
          </div>

          {/* 1 — Institutional Patrons & Board of Trustees */}
          <div id="governance-trustees" className="mt-12 scroll-mt-28">
            <h3 className="font-serif text-2xl text-[#003366]">1. Institutional Patrons & Board of Trustees</h3>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              {LEADERSHIP_GROUPS[0].caption}
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {trustees.map((m) => (
                <Card key={m.id} className="p-6 hover:shadow-lg transition">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#003366] to-[#0055A5] font-serif text-xl font-bold text-[#C59B27]">
                    <Initials name={m.fullName} />
                  </span>
                  <h4 className="mt-4 font-serif text-lg text-[#003366]">{m.fullName}</h4>
                  {m.credentials ? (
                    <p className="mt-1 text-[11px] font-semibold tracking-wide text-slate-500">{m.credentials}</p>
                  ) : null}
                  <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#C59B27]">{m.role}</p>
                  {m.tenure ? <p className="mt-1 text-xs text-slate-500 italic">{m.tenure}</p> : null}
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{m.bio}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* 2 — Executive Directorate */}
          <div id="governance-directorate" className="mt-14 scroll-mt-28">
            <h3 className="font-serif text-2xl text-[#003366]">2. Executive Directorate (University Advancement Centre)</h3>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              {LEADERSHIP_GROUPS[1].caption}
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {directorate.map((m) => (
                <Card key={m.id} className="p-6 hover:shadow-lg transition">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#C59B27] to-[#8a6d1c] font-serif text-xl font-bold text-white">
                    <Initials name={m.fullName} />
                  </span>
                  <h4 className="mt-4 font-serif text-lg text-[#003366]">{m.fullName}</h4>
                  {m.credentials ? (
                    <p className="mt-1 text-[11px] font-semibold tracking-wide text-slate-500">{m.credentials}</p>
                  ) : null}
                  <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#0055A5]">{m.role}</p>
                  {m.tenure ? <p className="mt-1 text-xs text-slate-500 italic">{m.tenure}</p> : null}
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{m.bio}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* 3 — Founding Stewards & Past Directors */}
          <div id="governance-heritage" className="mt-14 scroll-mt-28">
            <h3 className="font-serif text-2xl text-[#003366]">3. Founding Stewards & Past Directors (2002–Present)</h3>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              {LEADERSHIP_GROUPS[2].caption}
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {heritage.map((m) => (
                <Card key={m.id} className="p-6 bg-slate-50 hover:shadow-lg transition">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#003366]/20 bg-white font-serif text-lg font-bold text-[#003366]">
                    <Initials name={m.fullName} />
                  </span>
                  <h4 className="mt-4 font-serif text-base text-[#003366]">{m.fullName}</h4>
                  {m.credentials ? (
                    <p className="mt-1 text-[11px] font-semibold tracking-wide text-slate-500">{m.credentials}</p>
                  ) : null}
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">{m.role}</p>
                  {m.tenure ? <p className="mt-1 text-xs text-slate-500 italic">{m.tenure}</p> : null}
                  <p className="mt-3 text-[13px] leading-relaxed text-slate-600">{m.bio}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
