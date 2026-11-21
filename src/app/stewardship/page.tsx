import { FileText, Medal, ShieldCheck, Download } from "lucide-react";
import { getDonorWall, getReports } from "@/lib/data";
import { formatNgn } from "@/lib/currency";
import { Badge, Card, SectionHeading } from "@/components/ui";
import { WallAndReports } from "./wall";

export const revalidate = 60;
export const metadata = { title: "Accountability & Donor Recognition" };

const CHARTER = [
  { t: "Ring-fenced accounts", d: "Every fund holds its own fiduciary account. Endowment principal is never co-mingled with operating cash, and each disbursement references its Deed of Gift." },
  { t: "Quarterly milestone reporting", d: "Donors receive photographic evidence, quantity-surveyor certificates, and scholar progression notes before the next tranche is released." },
  { t: "Independent external audit", d: "Annual audited financial statements are published in full and presented at the Vice-Chancellor's stewardship session." },
  { t: "Public recognition — opt-in only", d: "The Digital Donor Wall of Honor lists only verified donors who explicitly consent. Emails are never published." },
];

export default async function StewardshipPage() {
  const [wall, reports] = await Promise.all([getDonorWall(30), getReports()]);

  return (
    <div>
      <section className="bg-[#173377] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <Badge tone="gold">Accountability & Donor Recognition</Badge>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl md:text-5xl leading-tight">Stewardship you can audit.</h1>
          <p className="mt-4 max-w-2xl text-white/75">The Stewardship Charter is our constitution for trust — and the Donor Wall and report repository are its public evidence.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading eyebrow="The Charter" title="Donor Stewardship Charter" lede="Adopted by the Board of Trustees. Every gift — from ₦5,000 to ₦500M — is governed identically." />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {CHARTER.map((c, i) => (
            <Card key={c.t} className="p-6 flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#173377] text-[#D6A419] font-serif font-black">{i + 1}</span>
              <span>
                <span className="flex items-center gap-1.5 font-bold text-[#173377]"><ShieldCheck className="h-4 w-4 text-[#D6A419]" />{c.t}</span>
                <span className="mt-1.5 block text-sm leading-relaxed text-slate-600">{c.d}</span>
              </span>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <SectionHeading eyebrow="Recognition" title="Digital Donor Wall of Honor" lede="Verified donors who opted in. To join the wall, tick “Display my name on the Donor Wall” when you give." />
          <WallAndReports wall={wall} reports={reports} />
        </div>
      </section>

      <section id="reports" className="mx-auto max-w-7xl px-4 py-14 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.22em] uppercase text-[#D6A419]"><FileText className="h-4 w-4" /> Repository</p>
            <h2 className="mt-2 font-serif text-3xl text-[#173377]">Annual Impact & Audited Financial Reports</h2>
          </div>
          <p className="text-sm text-slate-500 flex items-center gap-1.5"><Medal className="h-4 w-4 text-[#D6A419]" /> {reports.length} documents • {wall.length} honorees • {formatNgn(wall.reduce((s, w) => s + w.amountNgnEquivalent, 0))} wall-visible</p>
        </div>
        <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-slate-500">
          Every report below is a print-ready PDF — open it in the browser or download it. These are
          preview editions prepared for this demonstration site: they show exactly how the Foundation
          reports on a gift, with figures drawn from the giving data on this site.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <Card key={r.id} className="p-5 hover:shadow-md transition">
              <div className="flex items-start justify-between gap-2">
                <Badge tone={r.reportType === "AUDITED_FINANCIAL" ? "navy" : r.reportType === "ANNUAL_IMPACT" ? "gold" : "slate"}>
                  {r.reportType.replaceAll("_", " ")}
                </Badge>
                <span className="text-xs font-bold text-slate-500">FY {r.fiscalYear}</span>
              </div>
              <h3 className="mt-3 font-serif text-base text-[#173377] leading-snug">{r.title}</h3>
              {r.summary ? <p className="mt-1.5 text-[13px] text-slate-600">{r.summary}</p> : null}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">{r.fileSize ?? "PDF"}</span>
                <a
                  href={r.fileUrl}
                  download
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0C76B4] hover:text-[#173377]"
                >
                  <Download className="h-4 w-4" /> Download
                </a>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
