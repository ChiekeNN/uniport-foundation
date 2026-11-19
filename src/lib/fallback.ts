import type {
  CampaignDTO,
  LeadershipDTO,
  StewardshipReportDTO,
} from "@/types/database";
import { LEADERSHIP_2026 } from "@/lib/constants/leadership";

export const FALLBACK_CAMPAIGNS: CampaignDTO[] = [
  {
    id: "seed-jubilee",
    slug: "golden-jubilee-endowment-fund",
    title: "The Golden Jubilee Endowment Fund",
    category: "ENDOWMENT",
    shortDescription:
      "A ₦5 billion perpetual endowment to secure UNIPORT's next 50 years of academic excellence.",
    description:
      "Launched ahead of the University of Port Harcourt's Golden Jubilee, this perpetual endowment anchors the University's long-term financial independence. Principal is preserved in ring-fenced fiduciary accounts; only audited investment income funds professorial chairs, library acquisitions, laboratory renewal, and competitive student bursaries. Every gift is receipted, ring-fenced, and reported quarterly.",
    imageUrl: null,
    targetAmountNgn: 5000000000,
    amountRaisedNgn: 1287500000,
    donorCount: 342,
    isActive: true,
    isFeatured: true,
    namingTiers: [
      { tier: "Founders Circle", min_ngn: 100000000, benefit: "Named Endowment Window + Founders Gallery inscription + annual Vice-Chancellor's dinner" },
      { tier: "Gold Laureate", min_ngn: 50000000, benefit: "Named professorial chair support fund + plaque in Advancement Centre" },
      { tier: "Jubilee Patron", min_ngn: 10000000, benefit: "Named bursary line + certificate + annual impact report dedication" },
      { tier: "Friend of the Jubilee", min_ngn: 1000000, benefit: "Digital Donor Wall of Honor + jubilee lapel insignia" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-scholars",
    slug: "unique-uniport-indigent-scholars-fund",
    title: "Unique UNIPORT Indigent Scholars Fund",
    category: "SCHOLARSHIP",
    shortDescription:
      "Keep brilliant but indigent students in school — full and partial scholarships and upkeep stipends.",
    description:
      "No brilliant Unique should drop out for lack of funds. This fund provides full-tuition scholarships, accommodation support, upkeep stipends, and emergency grants to rigorously verified indigent students across all faculties. ₦350,000 keeps one student fully enrolled for an academic year.",
    imageUrl: null,
    targetAmountNgn: 750000000,
    amountRaisedNgn: 214600000,
    donorCount: 891,
    isActive: true,
    isFeatured: true,
    namingTiers: [
      { tier: "Full Scholar Patron", min_ngn: 1400000, benefit: "Name one 4-year scholar + annual scholar letter + graduation invitation" },
      { tier: "Annual Bursary Sponsor", min_ngn: 350000, benefit: "Fund one student for a full session + progress report" },
      { tier: "Upkeep Partner", min_ngn: 100000, benefit: "Stipend + emergency aid pool + termly impact brief" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-stem",
    slug: "stem-digital-innovation-labs-upgrade",
    title: "STEM & Digital Innovation Labs Upgrade",
    category: "INFRASTRUCTURE",
    shortDescription:
      "Re-tool 12 science and engineering laboratories with modern instrumentation and a Fab studio.",
    description:
      "In partnership with industry and the Faculties of Science, Engineering, and Computing, this campaign re-tools twelve teaching and research laboratories — instrumentation, power conditioning, fume extraction, high-speed connectivity, and a shared digital fabrication studio at Delta Park. Each lab upgrade is delivered as a milestone tranche with independent certification.",
    imageUrl: null,
    targetAmountNgn: 1800000000,
    amountRaisedNgn: 642300000,
    donorCount: 187,
    isActive: true,
    isFeatured: true,
    namingTiers: [
      { tier: "Named Laboratory", min_ngn: 150000000, benefit: "Full lab naming rights for 15 years + commissioning plaque" },
      { tier: "Innovation Bay", min_ngn: 50000000, benefit: "Named fabrication bay + branding wall" },
      { tier: "Equipment Patron", min_ngn: 5000000, benefit: "Named equipment line + calibration certificate dedication" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-legacy",
    slug: "class-of-1998-legacy-research-chairs",
    title: "Alumni Class Legacy — Research Chairs & Lecture Wing",
    category: "ALUMNI_CLASS",
    shortDescription:
      "Class-set reunion giving: endow two research chairs and refurbish the Delta Park lecture wing.",
    description:
      "The reunion-giving vehicle for anniversary class sets (10th, 20th, 25th, 30th). The pilot cohort is endowing two industry-linked Research Chairs (Energy Transition; Public Health & Environment) and refurbishing the Delta Park lecture wing with tiered seating, acoustic treatment, and solar-backed power.",
    imageUrl: null,
    targetAmountNgn: 900000000,
    amountRaisedNgn: 187450000,
    donorCount: 264,
    isActive: true,
    isFeatured: true,
    namingTiers: [
      { tier: "Legacy Chair Founder", min_ngn: 75000000, benefit: "Co-name a research chair + inaugural lecture honour" },
      { tier: "Lecture Wing Patron", min_ngn: 25000000, benefit: "Named row + reunion plaque + convocation recognition" },
      { tier: "Class Donor", min_ngn: 250000, benefit: "Class legacy roll + reunion yearbook feature" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * 2026 leadership fallback.
 * Sourced from `src/lib/constants/leadership.ts` so the /about governance page
 * always renders the current administration even before Postgres/Supabase is
 * connected or seeded. Deep-cloned to keep the module-level constant immutable.
 */
export const FALLBACK_LEADERSHIP: LeadershipDTO[] = LEADERSHIP_2026.map((m) => ({ ...m }));

export const FALLBACK_REPORTS: StewardshipReportDTO[] = [
  { id: "r1", title: "Annual Impact Report 2024 — Advancing Excellence", fiscalYear: "2024", reportType: "ANNUAL_IMPACT", fileUrl: "/reports/uphf-annual-impact-2024.pdf", fileSize: "70 KB", summary: "Scholarships disbursed, lab milestones commissioned, and endowment growth.", createdAt: new Date().toISOString() },
  { id: "r2", title: "Audited Financial Statements FY 2024", fiscalYear: "2024", reportType: "AUDITED_FINANCIAL", fileUrl: "/reports/uphf-audited-financials-2024.pdf", fileSize: "64 KB", summary: "Independent external audit opinion and fund-by-fund accounting.", createdAt: new Date().toISOString() },
  { id: "r3", title: "Q4 2024 Stewardship & Milestone Bulletin", fiscalYear: "2024", reportType: "QUARTERLY", fileUrl: "/reports/uphf-q4-2024-bulletin.pdf", fileSize: "63 KB", summary: "Quarterly tranche releases and scholar progression notes.", createdAt: new Date().toISOString() },
  { id: "r4", title: "Annual Impact Report 2023 — The Stewardship Year", fiscalYear: "2023", reportType: "ANNUAL_IMPACT", fileUrl: "/reports/uphf-annual-impact-2023.pdf", fileSize: "64 KB", summary: "Foundations of the ring-fenced reporting protocol.", createdAt: new Date().toISOString() },
  { id: "r5", title: "Audited Financial Statements FY 2023", fiscalYear: "2023", reportType: "AUDITED_FINANCIAL", fileUrl: "/reports/uphf-audited-financials-2023.pdf", fileSize: "58 KB", summary: "Prior-year audited statements.", createdAt: new Date().toISOString() },
  { id: "r6", title: "Endowment Performance Statement H1 2025", fiscalYear: "2025", reportType: "ENDOWMENT_STATEMENT", fileUrl: "/reports/uphf-endowment-h1-2025.pdf", fileSize: "62 KB", summary: "Interim endowment principal, yield, and disbursement.", createdAt: new Date().toISOString() },
];

export const FALLBACK_WALL = [
  { id: "w1", donorName: "Engr. Tamunoemi Horsfall", organization: "Horsfall Energy Ltd", amountNgnEquivalent: 5000000, currency: "NGN" as const, campaignTitle: "The Golden Jubilee Endowment Fund", createdAt: new Date().toISOString() },
  { id: "w2", donorName: "Dr. (Mrs.) Adaeze Okonkwo", organization: null, amountNgnEquivalent: 3750000, currency: "USD" as const, campaignTitle: "The Golden Jubilee Endowment Fund", createdAt: new Date().toISOString() },
  { id: "w3", donorName: "Class of 1998 Reunion Committee", organization: "UNIPORT Alumni — Class of 1998", amountNgnEquivalent: 12000000, currency: "NGN" as const, campaignTitle: "The Golden Jubilee Endowment Fund", createdAt: new Date().toISOString() },
];
