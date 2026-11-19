import type { MetadataRoute } from "next";

const SITE_URL =
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : null) ??
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
  "https://uniport-foundation.vercel.app";

/**
 * Link-preview crawlers (WhatsApp, Facebook, LinkedIn) respect robots.txt.
 * Everything public is crawlable; only the CMS and its API are off-limits.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
      // Messengers and social crawlers must be able to fetch the preview image
      // and the page itself, so they are named explicitly.
      { userAgent: ["WhatsApp", "facebookexternalhit", "Twitterbot", "LinkedInBot", "TelegramBot"], allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
