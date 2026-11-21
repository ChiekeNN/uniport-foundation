import type { MetadataRoute } from "next";

/**
 * PWA / installable-app manifest.
 * Served at /manifest.webmanifest and linked from `src/app/layout.tsx`.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "University of Port Harcourt Foundation (UPHF)",
    short_name: "UNIPORT Foundation",
    description:
      "The official advancement, endowment, and alumni relations arm of the University of Port Harcourt. RC 61670.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#F8FAFC",
    theme_color: "#173377",
    lang: "en-NG",
    dir: "ltr",
    categories: ["education", "nonprofit", "philanthropy"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: "Give Now", short_name: "Donate", url: "/donate" },
      { name: "Active Campaigns", short_name: "Campaigns", url: "/campaigns" },
      { name: "Stewardship Reports", short_name: "Reports", url: "/stewardship" },
    ],
  };
}
