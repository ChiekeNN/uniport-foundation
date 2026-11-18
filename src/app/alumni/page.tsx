import { Globe2, PartyPopper, Users } from "lucide-react";
import { Badge, Card, SectionHeading } from "@/components/ui";
import { AlumniForm } from "./form";

export const metadata = { title: "Global Alumni Hub" };

const CHAPTERS = [
  { region: "Nigeria", chapters: ["Lagos Chapter", "Abuja / FCT Chapter", "Port Harcourt (Home) Chapter", "Enugu & South-East Chapter", "Ibadan & South-West Chapter", "Kano & Northern Chapter"], note: "Homecoming & Founders Weekends at Delta Park" },
  { region: "United Kingdom", chapters: ["London & South-East", "Manchester & North", "Scotland Chapter"], note: "Annual UK Uniques Gala — London" },
  { region: "North America", chapters: ["Houston / Texas Chapter", "New York Tri-State Chapter", "DMV (DC–Maryland–Virginia)", "Toronto & Canada Chapter"], note: "Diaspora scholarship telethons" },
  { region: "Europe & Rest of World", chapters: ["EU / Schengen Chapter", "Middle East Chapter", "Asia–Pacific Friends of UNIPORT"], note: "Virtual reunions + research webinars" },
];

const TOOLKIT = [
  { milestone: "10th Anniversary", project: "Smart classroom retrofit — one hall, full AV + solar backup", ticket: "₦250k / donor" },
  { milestone: "20th Anniversary", project: "Lecture-wing row naming + bursary line for 10 indigent students", ticket: "₦500k / donor" },
  { milestone: "25th Anniversary", project: "Silver Jubilee lab bay or digital studio endowment window", ticket: "₦1M / donor" },
  { milestone: "30th Anniversary", project: "Co-found a Research Chair + legacy plaque in Founders Gallery", ticket: "₦2.5M / donor" },
];

export default function AlumniPage() {
  return (
    <div>
      <section className="bg-[#003366] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <Badge tone="gold">Global Alumni Hub • 300,000+ Uniques</Badge>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl md:text-5xl leading-tight">Once a Unique, always a Unique.</h1>
          <p className="mt-4 max-w-2xl text-white/75">Update your record, find your chapter, and rally your class set behind a legacy project the next generation will inherit.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading eyebrow="Chapters" title="Find your chapter" lede="National and diaspora chapters coordinate homecomings, mentoring, and class-set reunion giving with the Advancement Centre." />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {CHAPTERS.map((c) => (
            <Card key={c.region} className="p-6">
              <p className="flex items-center gap-2 font-bold text-[#003366]"><Globe2 className="h-5 w-5 text-[#C59B27]" /> {c.region}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.chapters.map((ch) => (
                  <span key={ch} className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">{ch}</span>
                ))}
              </div>
              <p className="mt-3 text-xs italic text-slate-500">{c.note}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.22em] uppercase text-[#C59B27]"><Users className="h-4 w-4" /> Alumni record update</p>
            <h2 className="mt-3 font-serif text-3xl text-[#003366]">Keep the Foundation in reach</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Update your graduation record so your chapter, class captain, and the
              Advancement Centre can reach you with reunion plans, mentoring calls,
              and giving toolkits. Records are stored securely and never published
              without consent.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-slate-600">
              <li>✓ Chapter invitations & reunion calendars</li>
              <li>✓ Class-set legacy project toolkits</li>
              <li>✓ Mentoring & industry-linkage calls</li>
            </ul>
          </div>
          <AlumniForm />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading eyebrow="Reunion giving" title="Class Set Reunion Giving Toolkit" lede="Anniversary classes convert nostalgia into endowment. Pick your milestone, name your legacy, and let the Advancement Centre handle pledge cards, peer pages, and plaques." />
        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#003366] text-white text-left">
                <th className="px-5 py-3.5">Milestone</th>
                <th className="px-5 py-3.5">Legacy project</th>
                <th className="px-5 py-3.5 hidden md:table-cell">Guide ticket</th>
              </tr>
            </thead>
            <tbody>
              {TOOLKIT.map((t, i) => (
                <tr key={t.milestone} className={i % 2 ? "bg-slate-50" : "bg-white"}>
                  <td className="px-5 py-4 font-bold text-[#003366]"><span className="inline-flex items-center gap-1.5"><PartyPopper className="h-4 w-4 text-[#C59B27]" />{t.milestone}</span></td>
                  <td className="px-5 py-4 text-slate-700">{t.project}</td>
                  <td className="px-5 py-4 font-semibold text-[#7a5f14] hidden md:table-cell">{t.ticket}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">Class captains: email <a className="font-bold text-[#0055A5]" href="mailto:advancement@uniport.edu.ng">advancement@uniport.edu.ng</a> with subject “Class Legacy — [Your Set]”.</p>
      </section>
    </div>
  );
}
