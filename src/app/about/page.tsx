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
import { STRATEGIC_2026 } from "@/lib/constants/leadership";
import { GovernanceSection } from "@/components/governance-section";

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

export default async function AboutPage() {
  const leaders = await getLeadership();

  return (
    <div>
      <section className="bg-[#26206B] text-white">
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
            <p className="text-xs font-bold tracking-[0.22em] uppercase text-[#D6A419]">Our History</p>
            <h2 className="mt-3 font-serif text-3xl text-[#26206B]">2002: the MacArthur catalyst</h2>
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
              <h3 className="font-serif text-2xl text-[#26206B] pt-2">June 5, 2013: RC 61670</h3>
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
                The register of <strong>Incorporated Trustees</strong> was signed by
                {" "}Prof. Nimi Dimkpa Briggs (5th Vice-Chancellor), Prof. Joseph
                Atubokiki Ajienka (7th Vice-Chancellor), Dr. Emmanuel Egbogah
                (benefactor), Rev. (Dr.) Walter Patrick Eneji and Mrs. Matilda
                Nnodim (Former Registrar).
              </p>
              <h3 className="font-serif text-2xl text-[#26206B] pt-2">2013 to today: the directors</h3>
              <p>
                Six directors have carried the Foundation since incorporation:{" "}
                <strong>Prof. (Mrs.) Ngozi Nma Odu</strong> as the first Acting
                Executive Director, then <strong>Prof. Henry E. Alapiki</strong>,{" "}
                <strong>Prof. Chukwudi Ochi Onyeaso</strong>,{" "}
                <strong>Prof. Leo C. Osuji</strong> and{" "}
                <strong>Prof. Uzoma D. Chima</strong> — with{" "}
                <strong>Prof. Friday Nwafor</strong> as the current Director, listed
                in the University&apos;s 36th Combined Convocation Brochure (June
                2026). Terms before 2020 are approximate, drawn from convocation
                brochures and official institutional briefings.
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
            <Card className="p-6 border-l-4 !border-l-[#D6A419]">
              <p className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#26206B]"><Eye className="h-4 w-4 text-[#D6A419]" /> Vision</p>
              <p className="mt-2 font-serif text-lg text-[#26206B] leading-snug">
                A world-class African university, sustainably resourced by its own
                community of alumni, friends, and partners — a{" "}
                <em>globally respected university</em>.
              </p>
            </Card>
            <Card className="p-6 border-l-4 !border-l-[#0C76B4]">
              <p className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#26206B]"><Target className="h-4 w-4 text-[#0C76B4]" /> Mission</p>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                To mobilise, invest, and steward philanthropic capital for
                scholarships, endowments, infrastructure, and research — with
                absolute fiduciary discipline and transparent public accountability.
              </p>
            </Card>
            <Card className="p-6 bg-[#26206B] !border-[#26206B] text-white">
              <p className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#D6A419]"><ShieldCheck className="h-4 w-4" /> Fiduciary Promise</p>
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
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#26206B] text-[#D6A419]">
                  <a.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-serif text-lg text-[#26206B]">{a.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{a.body}</p>
              </Card>
            ))}
          </div>
          <Card className="mt-8 border-l-4 !border-l-[#D6A419] p-6">
            <p className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#26206B]">
              <Sparkles className="h-4 w-4 text-[#D6A419]" /> Eight-Point Strategic Agenda
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
            <p className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#26206B]">
              <Building2 className="h-4 w-4 text-[#0C76B4]" /> Host Community & Town-and-Gown Synergy
            </p>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              UPHF also supports host-community development and bilateral partnerships
              across the <strong>{STRATEGIC_2026.hostCommunities.join(", ")}</strong> kingdoms,
              working alongside corporate and international donors so that the
              University&apos;s growth remains socially rooted and mutually beneficial.
            </p>
            <Link href="/partnerships" className="mt-4 inline-flex text-sm font-bold text-[#0C76B4] hover:text-[#26206B]">
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
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#26206B]/8 text-[#26206B] font-serif font-black">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 flex items-center gap-1.5 text-sm font-bold text-[#26206B]"><p.icon className="h-4 w-4 text-[#D6A419]" />{p.title}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{p.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* GOVERNANCE */}
      <span id="leadership" className="block scroll-mt-24" aria-hidden="true" />
      <section id="governance" className="bg-white border-t border-slate-200 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-18">
          <GovernanceSection leaders={leaders} />
        </div>
      </section>
    </div>
  );
}
