import { BookOpen, Eye, Target, Landmark, Users, Handshake, GraduationCap, ShieldCheck } from "lucide-react";
import { getLeadership } from "@/lib/data";
import { Badge, Card, SectionHeading } from "@/components/ui";

export const revalidate = 120;
export const metadata = { title: "About UPHF" };

const PILLARS = [
  { icon: Landmark, title: "Endowment Building", body: "Growing perpetual capital whose audited yield funds chairs, bursaries, and renewal in perpetuity." },
  { icon: GraduationCap, title: "Scholarships & Access", body: "Need-tested aid that keeps brilliant indigent Uniques enrolled through graduation." },
  { icon: BookOpen, title: "Infrastructure & Learning Environments", body: "Milestone-tranched labs, libraries, and lecture wings with QS-certified delivery." },
  { icon: Handshake, title: "Industry & Government Linkages", body: "Structured CSR, R&D chairs, and energy-transition collaborations with global partners." },
  { icon: Users, title: "Alumni Relations & Class Giving", body: "300,000+ Uniques worldwide mobilised through chapters and reunion legacy projects." },
];

export default async function AboutPage() {
  const leaders = await getLeadership();
  const trustees = leaders.filter((l) => l.category === "TRUSTEE");
  const directorate = leaders.filter((l) => l.category === "DIRECTORATE");

  return (
    <div>
      <section className="bg-[#003366] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
          <Badge tone="gold">About the Foundation • RC 61670</Badge>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl md:text-5xl leading-tight">
            From the “UNIPORT Miracle” to a perpetual fiduciary trust.
          </h1>
          <p className="mt-4 max-w-2xl text-white/75 leading-relaxed">
            The University of Port Harcourt Foundation is the official advancement,
            endowment, and alumni relations arm of UNIPORT — born of a 2002
            philanthropy catalyst and incorporated on June 5, 2013.
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
                community of alumni, friends, and partners.
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

      <section className="bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <SectionHeading eyebrow="How we work" title="Five operational pillars" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
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
        </div>
      </section>

      <section id="leadership" className="mx-auto max-w-7xl px-4 py-14 md:py-18 scroll-mt-24">
        <SectionHeading
          eyebrow="Governance"
          title="Board of Trustees & Directorate"
          lede="Fiduciary leadership drawn from UNIPORT's most distinguished scholars and administrators. Profiles are maintained by the Advancement office and editable via the admin CMS."
        />
        <h3 className="mt-12 font-serif text-2xl text-[#003366]">Board of Trustees</h3>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {trustees.map((m) => (
            <Card key={m.id} className="p-6 hover:shadow-lg transition">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#003366] to-[#0055A5] font-serif text-xl font-bold text-[#C59B27]">
                {m.fullName.replace("Professor ", "").charAt(0)}
              </span>
              <h4 className="mt-4 font-serif text-lg text-[#003366]">{m.fullName}</h4>
              <p className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">{m.role}</p>
              {m.tenure ? <p className="mt-1 text-xs text-slate-500 italic">{m.tenure}</p> : null}
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{m.bio}</p>
            </Card>
          ))}
        </div>
        <h3 className="mt-12 font-serif text-2xl text-[#003366]">Directorate — Advancement Centre</h3>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {directorate.map((m) => (
            <Card key={m.id} className="p-6 hover:shadow-lg transition">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#C59B27] to-[#8a6d1c] font-serif text-xl font-bold text-white">
                {m.fullName.replace("Professor ", "").replace("Mrs. ", "").charAt(0)}
              </span>
              <h4 className="mt-4 font-serif text-lg text-[#003366]">{m.fullName}</h4>
              <p className="text-xs font-bold uppercase tracking-wider text-[#0055A5]">{m.role}</p>
              {m.tenure ? <p className="mt-1 text-xs text-slate-500 italic">{m.tenure}</p> : null}
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{m.bio}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
