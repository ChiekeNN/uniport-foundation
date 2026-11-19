import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Merriweather, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const serif = Merriweather({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://uphf.uniport.edu.ng");
const SITE_NAME = "University of Port Harcourt Foundation";
const SHARE_DESCRIPTION =
  "The official advancement, endowment, and alumni relations arm of the University of Port Harcourt. Strategic philanthropy, audited stewardship, and global partnerships. RC 61670.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "University of Port Harcourt Foundation (RC 61670) — Advancing Academic Excellence",
    template: "%s | UPHF — University of Port Harcourt Foundation",
  },
  description: SHARE_DESCRIPTION,
  keywords: ["UNIPORT", "University of Port Harcourt Foundation", "endowment", "scholarships", "alumni", "philanthropy Nigeria"],
  manifest: "/manifest.webmanifest",
  // `src/app/favicon.ico`, `src/app/icon.png` and `src/app/apple-icon.png` are picked
  // up automatically; these declarations make the intent explicit and list the sizes.
  icons: {
    icon: [
      { url: "/icon.png", sizes: "256x256", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/icons/icon-maskable-512.png", color: "#003366" }],
  },
  appleWebApp: {
    capable: true,
    title: "UNIPORT Foundation",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "University of Port Harcourt Foundation — Advancing Academic Excellence",
    description: "Strategic philanthropy & global partnerships for UNIPORT. RC 61670.",
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_NG",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "University of Port Harcourt Foundation crest — For Enlightenment and Self-Reliance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "University of Port Harcourt Foundation",
    description: "Strategic philanthropy & global partnerships for UNIPORT. RC 61670.",
    images: ["/og-image.png"],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#003366" },
    { media: "(prefers-color-scheme: dark)", color: "#00284f" },
  ],
  width: "device-width",
  initialScale: 1,
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
  url: SITE_URL,
  logo: `${SITE_URL}/brand/uniport-logo.png`,
  image: `${SITE_URL}/og-image.png`,
  slogan: "For Enlightenment and Self-Reliance",
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
