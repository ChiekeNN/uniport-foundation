import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { ContactForm } from "./form";

export const metadata = { title: "Contact the Advancement Office" };

export default function ContactPage() {
  return (
    <div>
      <section className="bg-[#003366] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <Badge tone="gold">Advancement Office & Inquiry Routing</Badge>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl">Talk to the stewards of your gift.</h1>
          <p className="mt-3 max-w-2xl text-white/75">Choose a routing category and your message lands directly with the right desk — major gifts, CSR, scholarships, or alumni chapters.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] items-start">
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="font-serif text-xl text-[#003366]">Visit / Write</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="flex gap-2.5"><MapPin className="h-5 w-5 shrink-0 text-[#C59B27]" /> <span>University Advancement Centre Building, Delta Park, University of Port Harcourt, East-West Road, PMB 5323, Choba, Port Harcourt, Rivers State, Nigeria</span></li>
              <li className="flex gap-2.5"><Mail className="h-5 w-5 shrink-0 text-[#C59B27]" /> <a className="font-semibold text-[#0055A5]" href="mailto:advancement@uniport.edu.ng">advancement@uniport.edu.ng</a></li>
              <li className="flex gap-2.5"><Phone className="h-5 w-5 shrink-0 text-[#C59B27]" /> +234 (0) 84 XXX XXX</li>
              <li className="flex gap-2.5"><Clock className="h-5 w-5 shrink-0 text-[#C59B27]" /> Mon–Fri, 8:00–16:00 WAT (excluding public holidays)</li>
            </ul>
          </Card>
          <Card className="p-6 bg-[#003366] !border-[#003366] text-white">
            <p className="text-xs font-bold tracking-[0.22em] uppercase text-[#C59B27]">Routing promise</p>
            <p className="mt-2 text-sm leading-relaxed text-white/85">
              <strong>Major Gift / Endowment</strong> → Director, Advancement Centre<br />
              <strong>Corporate CSR / Partnership</strong> → Linkages desk<br />
              <strong>Scholarship Sponsorship</strong> → Scholarships desk<br />
              <strong>Alumni Chapter</strong> → Alumni relations desk<br />
              <strong>General</strong> → Front office (24–48h response)
            </p>
          </Card>
        </div>
        <ContactForm />
      </section>
    </div>
  );
}
