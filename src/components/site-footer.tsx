import Link from "next/link";
import { GraduationCap, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-[#0a1f3d] text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C59B27] text-[#003366]">
              <GraduationCap className="h-6 w-6" />
            </span>
            <div className="leading-tight">
              <p className="font-serif text-lg font-bold text-white">UNIPORT Foundation</p>
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#C59B27] font-semibold">
                RC 61670 • Est. 2013
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            The official advancement, endowment, and alumni relations arm of the
            University of Port Harcourt — advancing academic excellence through
            strategic philanthropy and global partnerships.
          </p>
          <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#C59B27]">
            <ShieldCheck className="h-4 w-4" /> 100% Audited Donor Stewardship
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white">Give</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className="hover:text-[#C59B27]" href="/campaigns">Active Campaigns</Link></li>
            <li><Link className="hover:text-[#C59B27]" href="/donate">Donate Now</Link></li>
            <li><Link className="hover:text-[#C59B27]" href="/partnerships">Corporate Partnerships</Link></li>
            <li><Link className="hover:text-[#C59B27]" href="/stewardship">Donor Wall of Honor</Link></li>
            <li><Link className="hover:text-[#C59B27]" href="/alumni">Alumni Class Giving</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white">Foundation</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className="hover:text-[#C59B27]" href="/about">About UPHF & History</Link></li>
            <li><Link className="hover:text-[#C59B27]" href="/about#governance">Governance &amp; Leadership (2026)</Link></li>
            <li><Link className="hover:text-[#C59B27]" href="/stewardship">Stewardship Charter</Link></li>
            <li><Link className="hover:text-[#C59B27]" href="/stewardship#reports">Audited Reports</Link></li>
            <li><Link className="hover:text-[#C59B27]" href="/admin">Advancement CMS</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white">Advancement Office</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-[#C59B27]" /> University Advancement Centre Building, Delta Park, UNIPORT, East-West Road, PMB 5323, Choba, Port Harcourt, Nigeria</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0 text-[#C59B27]" /> advancement@uniport.edu.ng</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0 text-[#C59B27]" /> +234 (0) 84 XXX XXX</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} University of Port Harcourt Foundation (RC 61670). All rights reserved.</p>
          <p>A fiduciary trust of the University of Port Harcourt • Parent Organization: University of Port Harcourt</p>
        </div>
      </div>
    </footer>
  );
}
