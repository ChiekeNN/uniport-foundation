/**
 * BOARD BRIEFING — illustrative operations dataset for the Foundation Operations
 * Dashboard. Figures are realistic FY2026 figures aligned with the public campaign
 * numbers on the marketing site (Golden Jubilee Endowment, Indigent Scholars,
 * STEM Labs, Class of 1998 Legacy).
 *
 * This module powers the "Board briefing" tab only. It is intentionally labelled
 * illustrative in the UI so nobody mistakes a demo for live ledger data — the
 * "Live operations" tab continues to read the real database.
 */

export interface MonthPoint {
  key: string;
  label: string;
  /** Total verified intake in NGN for the month. */
  ngn: number;
  /** New verified donors in the month. */
  donors: number;
  online: number;
  corporate: number;
  wire: number;
}

const MONTHS: Array<[string, string, number, number]> = [
  // key, label, total NGN, new donors
  ["2026-01", "Jan", 96_500_000, 92],
  ["2026-02", "Feb", 118_200_000, 104],
  ["2026-03", "Mar", 142_700_000, 118],
  ["2026-04", "Apr", 165_400_000, 131],
  ["2026-05", "May", 189_000_000, 142],
  ["2026-06", "Jun", 246_800_000, 168],
  ["2026-07", "Jul", 302_500_000, 196],
  ["2026-08", "Aug", 228_400_000, 151],
  ["2026-09", "Sep", 268_900_000, 163],
  ["2026-10", "Oct", 341_200_000, 224],
  ["2026-11", "Nov", 232_250_000, 195],
];

/** Channel mix per month (share of intake). Remaining share is bank wire. */
const CHANNEL_SHARE: Array<[number, number]> = [
  [0.34, 0.41],
  [0.36, 0.4],
  [0.31, 0.46],
  [0.35, 0.44],
  [0.38, 0.39],
  [0.29, 0.52], // MacArthur anniversary corporate push
  [0.27, 0.55], // VC inauguration corporate pledges
  [0.33, 0.45],
  [0.36, 0.42],
  [0.3, 0.5], // Golden Jubilee campaign launch
  [0.4, 0.37],
];

export const MONTHLY_2026: MonthPoint[] = MONTHS.map(([key, label, ngn, donors], i) => {
  const [onlineShare, corporateShare] = CHANNEL_SHARE[i];
  const online = Math.round((ngn * onlineShare) / 1000) * 1000;
  const corporate = Math.round((ngn * corporateShare) / 1000) * 1000;
  return { key, label, ngn, donors, online, corporate, wire: ngn - online - corporate };
});

export const QUARTERS: Record<string, string[]> = {
  "FY 2026": ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10", "2026-11"],
  "Q3 2026": ["2026-07", "2026-08", "2026-09"],
  "Q4 to date": ["2026-10", "2026-11"],
};

export const PERIODS = Object.keys(QUARTERS) as Array<keyof typeof QUARTERS>;

export interface CampaignPerf {
  slug: string;
  name: string;
  category: string;
  raisedNgn: number;
  targetNgn: number;
  donors: number;
  /** Tranche status shown in the board pack. */
  tranche: string;
}

export const CAMPAIGNS: CampaignPerf[] = [
  {
    slug: "golden-jubilee-endowment-fund",
    name: "Golden Jubilee Endowment Fund",
    category: "Endowment",
    raisedNgn: 1_287_500_000,
    targetNgn: 5_000_000_000,
    donors: 342,
    tranche: "Corpus ring-fenced · Q4 income release",
  },
  {
    slug: "unique-uniport-indigent-scholars-fund",
    name: "Unique UNIPORT Indigent Scholars Fund",
    category: "Scholarship",
    raisedNgn: 214_600_000,
    targetNgn: 750_000_000,
    donors: 891,
    tranche: "1,284 scholars confirmed · 2026/27 session",
  },
  {
    slug: "stem-digital-innovation-labs-upgrade",
    name: "STEM & Digital Innovation Labs",
    category: "Infrastructure",
    raisedNgn: 642_300_000,
    targetNgn: 1_800_000_000,
    donors: 187,
    tranche: "12 of 12 labs commissioned · certification filed",
  },
  {
    slug: "class-of-1998-legacy-research-chairs",
    name: "Class of 1998 Legacy — Research Chairs",
    category: "Alumni class",
    raisedNgn: 187_450_000,
    targetNgn: 900_000_000,
    donors: 264,
    tranche: "2 chairs endowed · lecture wing at tender",
  },
];

export const TOTAL_RAISED_NGN = CAMPAIGNS.reduce((s, c) => s + c.raisedNgn, 0);
export const TOTAL_TARGET_NGN = CAMPAIGNS.reduce((s, c) => s + c.targetNgn, 0);
export const TOTAL_DONORS = CAMPAIGNS.reduce((s, c) => s + c.donors, 0);

export const FY_TARGET_NGN = 4_000_000_000;

export const FUND_MIX = CAMPAIGNS.map((c) => ({
  label: c.category,
  value: c.raisedNgn,
  share: c.raisedNgn / TOTAL_RAISED_NGN,
}));

/** Where released funds went (board pack utilisation statement). */
export const UTILISATION = [
  { label: "Scholarships & bursaries", value: 46 },
  { label: "Laboratory & infrastructure tranches", value: 29 },
  { label: "Research grants & chairs", value: 14 },
  { label: "Advancement operations", value: 7 },
  { label: "External audit & compliance", value: 4 },
];

export const PIPELINE = [
  { stage: "Inquiries", count: 412, note: "Major gifts, CSR, alumni" },
  { stage: "Qualified", count: 268, note: "Discovery visit completed" },
  { stage: "Pledges", count: 176, note: "₦486.5m in pipeline" },
  { stage: "Verified", count: 121, note: "Receipted & banked" },
  { stage: "Disbursed", count: 96, note: "Tranche released" },
];

export interface GiftRow {
  id: string;
  donor: string;
  organization: string | null;
  campaign: string;
  amountNgn: number;
  channel: "Paystack" | "Stripe" | "Bank wire";
  status: "VERIFIED" | "PENDING";
  date: string;
}

export const RECENT_GIFTS: GiftRow[] = [
  { id: "g1", donor: "Engr. Tamunoemi Horsfall", organization: "Horsfall Energy Ltd", campaign: "Golden Jubilee Endowment Fund", amountNgn: 250_000_000, channel: "Bank wire", status: "VERIFIED", date: "2026-11-17" },
  { id: "g2", donor: "Dr. (Mrs.) Adaeze Okonkwo", organization: null, campaign: "Golden Jubilee Endowment Fund", amountNgn: 37_500_000, channel: "Stripe", status: "VERIFIED", date: "2026-11-16" },
  { id: "g3", donor: "TotalEnergies Nigeria", organization: "Corporate CSR", campaign: "STEM & Digital Innovation Labs", amountNgn: 150_000_000, channel: "Bank wire", status: "VERIFIED", date: "2026-11-14" },
  { id: "g4", donor: "Class of 1998 Reunion Committee", organization: "UNIPORT Alumni", campaign: "Class of 1998 Legacy — Research Chairs", amountNgn: 45_000_000, channel: "Bank wire", status: "VERIFIED", date: "2026-11-12" },
  { id: "g5", donor: "Barr. Nkemdilim Eze", organization: null, campaign: "Unique UNIPORT Indigent Scholars Fund", amountNgn: 3_500_000, channel: "Paystack", status: "VERIFIED", date: "2026-11-11" },
  { id: "g6", donor: "Nigeria LNG Limited", organization: "Corporate CSR", campaign: "STEM & Digital Innovation Labs", amountNgn: 120_000_000, channel: "Bank wire", status: "VERIFIED", date: "2026-11-09" },
  { id: "g7", donor: "Dr. Ifeanyi Amaechi", organization: null, campaign: "Golden Jubilee Endowment Fund", amountNgn: 12_000_000, channel: "Bank wire", status: "PENDING", date: "2026-11-08" },
  { id: "g8", donor: "Mrs. Boma Lawson-Whyte", organization: "Lawson Whyte Foundation", campaign: "Unique UNIPORT Indigent Scholars Fund", amountNgn: 7_000_000, channel: "Stripe", status: "VERIFIED", date: "2026-11-06" },
  { id: "g9", donor: "Petroleum Technology Development Fund", organization: "Federal agency", campaign: "STEM & Digital Innovation Labs", amountNgn: 60_000_000, channel: "Bank wire", status: "VERIFIED", date: "2026-11-04" },
  { id: "g10", donor: "UNIPORT Class of 2001 (UK Chapter)", organization: "Alumni chapter", campaign: "Class of 1998 Legacy — Research Chairs", amountNgn: 9_250_000, channel: "Stripe", status: "PENDING", date: "2026-11-03" },
  { id: "g11", donor: "Arc. Chinedu Nwosu", organization: null, campaign: "Golden Jubilee Endowment Fund", amountNgn: 5_000_000, channel: "Paystack", status: "VERIFIED", date: "2026-11-02" },
  { id: "g12", donor: "FirstBank of Nigeria", organization: "Corporate CSR", campaign: "Unique UNIPORT Indigent Scholars Fund", amountNgn: 75_000_000, channel: "Bank wire", status: "VERIFIED", date: "2026-10-30" },
];

export interface ActivityEvent {
  id: string;
  date: string;
  title: string;
  detail: string;
  kind: "gift" | "partnership" | "programme" | "governance" | "compliance";
}

export const ACTIVITY: ActivityEvent[] = [
  { id: "a1", date: "2026-11-17", title: "₦250m endowment gift received", detail: "Horsfall Energy Ltd — Golden Jubilee Endowment Fund. Receipted and posted to corpus.", kind: "gift" },
  { id: "a2", date: "2026-11-14", title: "TotalEnergies CSR tranche banked", detail: "₦150m released for the STEM labs programme; milestone certification attached.", kind: "partnership" },
  { id: "a3", date: "2026-11-12", title: "Energy Transition Chair MoU executed", detail: "Signed at the Advancement Centre with the Faculty of Engineering.", kind: "partnership" },
  { id: "a4", date: "2026-11-08", title: "12 STEM laboratories commissioned", detail: "Independent QS certification filed; donors notified with photographic evidence.", kind: "programme" },
  { id: "a5", date: "2026-11-05", title: "Golden Jubilee Gala Committee inaugurated", detail: "22-member committee constituted; 14 February 2027 date confirmed.", kind: "governance" },
  { id: "a6", date: "2026-10-31", title: "Q3 stewardship bulletin published", detail: "Distributed to all 1,684 verified donors with fund-by-fund accounting.", kind: "compliance" },
  { id: "a7", date: "2026-10-24", title: "1,284 scholars confirmed for 2026/27", detail: "Need-testing completed with Student Affairs; 386 new scholars admitted.", kind: "programme" },
  { id: "a8", date: "2026-10-18", title: "Board of Trustees extraordinary session", detail: "Endowment investment policy and ring-fencing protocol ratified.", kind: "governance" },
];

export const UPCOMING = [
  { date: "2026-12-05", label: "Board of Trustees quarterly meeting", place: "Advancement Centre, Delta Park" },
  { date: "2027-01-12", label: "External audit field work begins", place: "FY2026 statutory audit" },
  { date: "2027-02-14", label: "Golden Jubilee Gala & Donor Wall unveiling", place: "Delta Park, UNIPORT" },
  { date: "2027-03-03", label: "Q1 scholarship tranche release", place: "1,284 scholars" },
];

export const PARTNERS = [
  { name: "TotalEnergies Nigeria", amountNgn: 250_000_000, focus: "Energy Transition Chair" },
  { name: "Nigeria LNG Limited", amountNgn: 120_000_000, focus: "STEM labs" },
  { name: "NNPC Limited", amountNgn: 180_000_000, focus: "Research grants" },
  { name: "Shell Nigeria", amountNgn: 150_000_000, focus: "Scholarships" },
  { name: "FirstBank of Nigeria", amountNgn: 75_000_000, focus: "Indigent scholars" },
  { name: "PTDF", amountNgn: 60_000_000, focus: "Petroleum & energy studies" },
];

export const CHAPTERS = [
  { name: "Lagos", donors: 412 },
  { name: "Abuja", donors: 268 },
  { name: "Port Harcourt", donors: 231 },
  { name: "United Kingdom", donors: 188 },
  { name: "North America", donors: 154 },
  { name: "Houston", donors: 97 },
];

export const COMPLIANCE = [
  { label: "Gifts receipted same-day", value: 100 },
  { label: "Funds ring-fenced", value: 100 },
  { label: "Quarterly reports published", value: 100 },
  { label: "Donor files with GPA tracking", value: 96 },
  { label: "Tranche evidence before release", value: 100 },
];

export interface BriefingTotals {
  raisedNgn: number;
  donors: number;
  online: number;
  corporate: number;
  wire: number;
  months: MonthPoint[];
}

export function totalsFor(period: keyof typeof QUARTERS): BriefingTotals {
  const keys = QUARTERS[period];
  const months = MONTHLY_2026.filter((m) => keys.includes(m.key));
  return {
    months,
    raisedNgn: months.reduce((s, m) => s + m.ngn, 0),
    donors: months.reduce((s, m) => s + m.donors, 0),
    online: months.reduce((s, m) => s + m.online, 0),
    corporate: months.reduce((s, m) => s + m.corporate, 0),
    wire: months.reduce((s, m) => s + m.wire, 0),
  };
}
