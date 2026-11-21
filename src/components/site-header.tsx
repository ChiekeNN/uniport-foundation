"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Mail, MapPin, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About UPHF" },
  { href: "/campaigns", label: "Giving" },
  { href: "/partnerships", label: "Partnerships" },
  { href: "/alumni", label: "Alumni" },
  { href: "/stewardship", label: "Stewardship" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Crest ribbon — the green, ocean blue and indigo of the University arms */}
      <div
        aria-hidden
        className="h-[3px] w-full bg-gradient-to-r from-[#049949] via-[#1AA9E5] to-[#26206B]"
      />
      {/* Top utility bar */}
      <div className="bg-[#26206B] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-1.5 text-[11px] sm:text-xs">
          <p className="flex items-center gap-1.5 font-medium tracking-wide">
            <ShieldCheck className="h-3.5 w-3.5 text-[#D6A419]" />
            <span className="hidden sm:inline">RC No. 61670</span>
            <span className="sm:hidden">RC 61670</span>
            <span className="text-white/40">|</span>
            <MapPin className="h-3.5 w-3.5 text-[#D6A419]" />
            <span className="truncate">University Advancement Centre, Delta Park, UNIPORT</span>
          </p>
          <a
            href="mailto:advancement@uniport.edu.ng"
            className="flex items-center gap-1.5 text-white/90 hover:text-[#D6A419] transition"
          >
            <Mail className="h-3.5 w-3.5" />
            advancement@uniport.edu.ng
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className="border-b border-[#D6A419]/30 bg-white/95 backdrop-blur shadow-[0_2px_16px_rgba(38,32,107,0.08)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/uniport-logo.png"
              alt="University of Port Harcourt Foundation crest"
              width={44}
              height={44}
              priority
              className="h-11 w-11 shrink-0 object-contain drop-shadow-sm"
            />
            <span className="leading-tight">
              <span className="block max-w-[190px] font-serif text-[13px] font-bold leading-snug text-[#26206B] sm:max-w-[240px] sm:text-[15px] lg:max-w-none lg:text-base">
                University of Port Harcourt Foundation
              </span>
              <span className="block text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase text-[#D6A419]">
                Advancement • Endowment • Alumni
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => {
              const active =
                n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "rounded-lg px-3.5 py-2 text-sm font-semibold transition",
                    active
                      ? "bg-[#26206B]/8 text-[#26206B] underline decoration-[#D6A419] decoration-2 underline-offset-8"
                      : "text-slate-600 hover:text-[#26206B] hover:bg-slate-100"
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/donate"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#26206B] to-[#0C76B4] border border-[#D6A419]/60 px-5 py-2.5 text-sm font-bold text-white shadow hover:shadow-lg hover:brightness-110 transition"
            >
              Give Now
              <span className="h-2 w-2 rounded-full bg-[#D6A419] animate-pulse" />
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden rounded-lg border border-slate-200 p-2 text-[#26206B]"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-sm font-semibold",
                  pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href))
                    ? "bg-[#26206B] text-white"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/donate"
              onClick={() => setOpen(false)}
              className="block rounded-lg bg-[#D6A419] px-3 py-2.5 text-sm font-bold text-[#26206B] text-center"
            >
              Give Now
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
