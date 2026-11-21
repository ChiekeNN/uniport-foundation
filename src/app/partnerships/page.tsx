import { Building2, FileCheck, FlaskConical, Handshake, Landmark, ArrowRight } from "lucide-react";
import { Badge, Card, SectionHeading } from "@/components/ui";
import { PartnershipDrawer } from "./drawer";

export const metadata = { title: "University–Industry–Government Linkages" };

const PARTNERS = [
  {
    name: "Institute of Petroleum & Energy Studies (IPES)",
    detail: "Flagship university–industry governance: TotalEnergies, NNPC Limited, PTDF, and IFP School France co-deliver postgraduate energy education, sponsored chairs, and industry-embedded research at UNIPORT.",
    tag: "Flagship",
  },
  { name: "MacArthur Foundation", detail: "Foundational 2002 institutional-strengthening grant — the “UNIPORT Miracle” that seeded the Advancement Office and modern governance systems.", tag: "Founding Funder" },
  { name: "Nigeria Higher Education Foundation (NHEF)", detail: "Scholars Programme and industry-immersion pipelines placing Uniques in leading Nigerian firms.", tag: "Talent" },
  { name: "Fulbright & Global Exchange Networks", detail: "Faculty exchanges, visiting lectureships, and joint research windows connecting UNIPORT to U.S. and European universities.", tag: "Global" },
];

export default function PartnershipsPage() {
  return (
    <div>
      <section className="bg-[#173377] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <Badge tone="gold">University–Industry–Government Linkages</Badge>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl md:text-5xl leading-tight">
            Structure your CSR for measurable academic impact.
          </h1>
          <p className="mt-4 max-w-2xl text-white/75 leading-relaxed">
            Tax-deductible giving, R&D collaborations, sponsored chairs, and
            workforce pipelines — engineered by the Advancement Centre with
            audited milestone reporting your board can publish.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading
          eyebrow="Corporate vehicles"
          title="Three ways to partner"
          lede="Every engagement begins with a briefing, proceeds under a Deed of Gift or MoU, and reports quarterly with photographic and financial evidence."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { icon: Landmark, t: "CSR Structuring & Tax-Deductible Giving", d: "We structure donations to recognised university advancement purposes with full documentation for tax treatment under Nigerian law, board-ready impact memos, and naming recognition scaled to gift size." },
            { icon: FlaskConical, t: "R&D Collaborations & Sponsored Chairs", d: "Co-fund Energy Transition, Public Health & Environment, and Digital Innovation research — with joint IP frameworks, postgraduate fellowships, and annual industry open-days at Delta Park." },
            { icon: FileCheck, t: "Workforce & Talent Pipelines", d: "NHEF-style immersion, SIWES enhancement, and graduate placement tracks that turn CSR into recruitment advantage while funding student upkeep." },
          ].map((c) => (
            <Card key={c.t} className="p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#173377] text-[#D6A419]"><c.icon className="h-6 w-6" /></span>
              <h3 className="mt-4 font-serif text-lg text-[#173377]">{c.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.d}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <SectionHeading eyebrow="Track record" title="Institutional partnerships that endure" />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {PARTNERS.map((p) => (
              <Card key={p.name} className="p-6 border-l-4 !border-l-[#D6A419]">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-lg text-[#173377]">{p.name}</h3>
                  <span className="shrink-0 rounded-full bg-[#D6A419]/15 border border-[#D6A419]/40 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#7a5f14]">{p.tag}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.detail}</p>
              </Card>
            ))}
          </div>

          <div className="mt-10 rounded-3xl bg-gradient-to-r from-[#173377] to-[#0C76B4] p-8 md:p-10 text-white grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold tracking-[0.22em] uppercase text-[#D6A419]"><Building2 className="h-4 w-4" /> IPES Governance Model</p>
              <h3 className="mt-2 font-serif text-2xl md:text-3xl">A template for Nigerian university–industry governance</h3>
              <p className="mt-3 text-white/80 text-sm leading-relaxed">
                The Institute of Petroleum and Energy Studies demonstrates how
                TotalEnergies, NNPC Limited, PTDF, and IFP School France can
                jointly govern postgraduate training inside a federal university —
                with shared curricula, industry faculty, and sponsored facilities.
                The Foundation replicates this structure for new chairs and labs.
              </p>
              <a href="/stewardship" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#D6A419] hover:text-white">See audited outcomes <ArrowRight className="h-4 w-4" /></a>
            </div>
            <Card className="p-6 !bg-white/10 !border-white/20 text-white backdrop-blur">
              <p className="flex items-center gap-2 font-bold"><Handshake className="h-5 w-5 text-[#D6A419]" /> Schedule a Corporate Briefing</p>
              <p className="mt-2 text-sm text-white/75">A 30-minute session with the Advancement directorate — CSR structuring, naming inventory, and milestone reporting walkthrough.</p>
              <PartnershipDrawer />
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
