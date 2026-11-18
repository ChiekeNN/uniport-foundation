import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Merriweather, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const serif = Merriweather({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "University of Port Harcourt Foundation (RC 61670) — Advancing Academic Excellence",
    template: "%s | UPHF — University of Port Harcourt Foundation",
  },
  description:
    "The official advancement, endowment, and alumni relations arm of the University of Port Harcourt. Strategic philanthropy, audited stewardship, and global partnerships. RC 61670.",
  keywords: ["UNIPORT", "University of Port Harcourt Foundation", "endowment", "scholarships", "alumni", "philanthropy Nigeria"],
  openGraph: {
    title: "University of Port Harcourt Foundation — Advancing Academic Excellence",
    description: "Strategic philanthropy & global partnerships for UNIPORT. RC 61670.",
    type: "website",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "NGO"],
  name: "University of Port Harcourt Foundation",
  alternateName: "UPHF",
  taxID: "RC 61670",
  parentOrganization: {
    "@type": "EducationalOrganization",
    name: "University of Port Harcourt",
  },
  email: "advancement@uniport.edu.ng",
  address: {
    "@type": "PostalAddress",
    streetAddress: "University Advancement Centre Building, Delta Park, East-West Road, PMB 5323, Choba",
    addressLocality: "Port Harcourt",
    addressRegion: "Rivers State",
    addressCountry: "NG",
  },
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://uphf.uniport.edu.ng",
  foundingDate: "2013-06-05",
  nonprofitStatus: "NonprofitType",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body className="bg-[#F8FAFC] font-sans text-[#0F172A] antialiased">
        <SiteHeader />
        <main className="min-h-[70vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
