import type { LeadershipDTO, LeadershipGroup } from "@/types/database";

/**
 * 2026 INSTITUTIONAL & FOUNDATION LEADERSHIP (verified)
 * ----------------------------------------------------
 * Single source of truth for UPHF governance. This array powers:
 *   1. `src/lib/fallback.ts` → FALLBACK_LEADERSHIP (renders before Supabase/Postgres is wired)
 *   2. `supabase/seed.sql` → `leadership_members` (mirrors these records 1:1 by deterministic UUID)
 *   3. `/about#governance` → Institutional Patrons & Board of Trustees,
 *      Executive Directorate, and Founding Stewards & Past Directors
 *
 * Order of precedence inside the UI is `displayOrder`, then `fullName`.
 * Do not renumber historical records below 100 — the archive is intentionally
 * sorted after the active 2026 officeholders.
 */

export const LEADERSHIP_GROUPS: {
  id: LeadershipGroup;
  label: string;
  caption: string;
}[] = [
  {
    id: "BOARD_OF_TRUSTEES",
    label: "Institutional Patrons & Board of Trustees",
    caption:
      "The 2026 principal institutional anchors of the University of Port Harcourt, seated on the Foundation's Board of Trustees as patrons and fiduciary overseers.",
  },
  {
    id: "DIRECTORATE",
    label: "Executive Directorate (University Advancement Centre)",
    caption:
      "The operating directorate at the University Advancement Centre, Delta Park — responsible for endowment growth, alumni relations, corporate CSR, and donor stewardship.",
  },
  {
    id: "PAST_DIRECTORS",
    label: "Founding Stewards & Past Directors (2002–Present)",
    caption:
      "Institutional heritage archive: the founding trustees and past directors whose stewardship carried the Advancement model from the 2002 MacArthur catalyst to the 2013 incorporation and beyond.",
  },
];

export const LEADERSHIP_2026: LeadershipDTO[] = [
  // ───────────────────────── ACTIVE 2026 — BOARD OF TRUSTEES ─────────────────────────
  {
    id: "20260001-0000-4000-a000-000000000001",
    fullName: "Prof. Chike Princewill Rewhuamwhu Chike",
    credentials: "B.Med.Sc., M.B., B.S., M.Sc., MD (UPH), FAGP, FIIA, DMP, DSSRS",
    role: "10th Vice-Chancellor, University of Port Harcourt & Institutional Patron, UPHF",
    category: "TRUSTEE",
    group: "BOARD_OF_TRUSTEES",
    bio: "Professor of Cardiovascular and Tissue Perfusion Physiology and three-time Commissioner for Health in Rivers State. Inaugurated in July 2026 as the 10th Vice-Chancellor of UNIPORT, championing the “Shared Vision for a Globally Respected University” and an Eight-Point Strategic Agenda focused on technological innovation, impactful research, societal relevance, and sustainable development.",
    tenure: "Assumed Office: July 2026",
    imageUrl: null,
    displayOrder: 1,
  },
  {
    id: "20260002-0000-4000-a000-000000000002",
    fullName: "Senator Mao Arukwe Ohuabunwa",
    credentials: "PhD, KSC, DSSRS",
    role: "Pro-Chancellor & Chairman, 17th Governing Council",
    category: "TRUSTEE",
    group: "BOARD_OF_TRUSTEES",
    bio: "Pro-Chancellor and Chairman of the 17th Governing Council of the University of Port Harcourt, providing institutional governance and strategic oversight alongside the Foundation's Board of Trustees.",
    tenure: "17th Governing Council",
    imageUrl: null,
    displayOrder: 2,
  },
  {
    id: "20260003-0000-4000-a000-000000000003",
    fullName: "Prof. Chukwudi Ochi Onyeaso",
    credentials: "BDS, FWACS, FMCDS",
    role: "Deputy Vice-Chancellor (Administration & Advancement)",
    category: "TRUSTEE",
    group: "BOARD_OF_TRUSTEES",
    bio: "Oversees university administration, institutional advancement coordination, and external stakeholder linkages in support of UPHF's resource mobilization mandate.",
    tenure: "Deputy Vice-Chancellor",
    imageUrl: null,
    displayOrder: 3,
  },

  // ───────────────────────── ACTIVE 2026 — EXECUTIVE DIRECTORATE ─────────────────────────
  {
    id: "20260004-0000-4000-a000-000000000004",
    fullName: "Prof. Friday Nwafor",
    credentials: "BA, MA, PhD (UPH)",
    role: "Director, University of Port Harcourt Foundation (UPHF)",
    category: "DIRECTORATE",
    group: "DIRECTORATE",
    bio: "Leads day-to-day operations of the University of Port Harcourt Foundation at the University Advancement Centre, Delta Park, driving endowment growth, alumni relations, corporate CSR partnerships, and donor stewardship.",
    tenure: "Director, UPHF",
    imageUrl: null,
    displayOrder: 4,
  },

  // ───────────────────────── INSTITUTIONAL HERITAGE — FOUNDING STEWARDS & PAST DIRECTORS ─────────────────────────
  {
    id: "20260101-0000-4000-a000-000000000101",
    fullName: "Prof. Nimi Dimkpa Briggs",
    credentials: null,
    role: "Founding Board Member & 5th Vice-Chancellor (Late)",
    category: "HERITAGE",
    group: "PAST_DIRECTORS",
    bio: "Founding Board Member of the Foundation and 5th Vice-Chancellor of the University of Port Harcourt. Spearheaded the 2002 MacArthur Foundation Advancement Centre initiative — the intervention still remembered on campus as the “UNIPORT Miracle.”",
    tenure: "Vice-Chancellor 2000–2005",
    imageUrl: null,
    displayOrder: 101,
  },
  {
    id: "20260102-0000-4000-a000-000000000102",
    fullName: "Rev. (Dr.) Walter Patrick Eneji",
    credentials: null,
    role: "Founding Board Member / Trustee",
    category: "HERITAGE",
    group: "PAST_DIRECTORS",
    bio: "Founding Board Member and Trustee of the University of Port Harcourt Foundation, present at the 2013 CAC incorporation that established the Foundation as an independent fiduciary trust under RC 61670.",
    tenure: "Founding Trustee · 2013 Incorporation",
    imageUrl: null,
    displayOrder: 102,
  },
  {
    id: "20260103-0000-4000-a000-000000000103",
    fullName: "Prof. Ngozi Nma Odu",
    credentials: null,
    role: "Former Executive Director, UPHF",
    category: "HERITAGE",
    group: "PAST_DIRECTORS",
    bio: "Former Executive Director of the Foundation and distinguished academic and public administrator; later served as Deputy Governor of Rivers State. Championed scholarship access and women-in-academia advancement.",
    tenure: "Executive Director · later Deputy Governor, Rivers State",
    imageUrl: null,
    displayOrder: 103,
  },
  {
    id: "20260104-0000-4000-a000-000000000104",
    fullName: "Prof. Henry E. Alapiki",
    credentials: null,
    role: "Former Director, UPHF",
    category: "HERITAGE",
    group: "PAST_DIRECTORS",
    bio: "Former Director of the Foundation and Professor of Political Science. Expanded the MacArthur and Nigeria Higher Education Foundation (NHEF) partnerships that anchored early advancement capacity building.",
    tenure: "MacArthur & NHEF Partnership Expansion",
    imageUrl: null,
    displayOrder: 104,
  },
  {
    id: "20260105-0000-4000-a000-000000000105",
    fullName: "Prof. Leo C. Osuji",
    credentials: null,
    role: "Former Director, UPHF",
    category: "HERITAGE",
    group: "PAST_DIRECTORS",
    bio: "Former Director of the Foundation and Professor of Petroleum & Environmental Chemistry. Represented UPHF on the Governing Board of the Institute of Petroleum and Energy Studies (IPES).",
    tenure: "UPHF Representative, IPES Governing Board",
    imageUrl: null,
    displayOrder: 105,
  },
  {
    id: "20260106-0000-4000-a000-000000000106",
    fullName: "Prof. Uzoma D. Chima",
    credentials: "B.For, MF, PhD",
    role: "Former Director, UPHF",
    category: "HERITAGE",
    group: "PAST_DIRECTORS",
    bio: "Former Director of the Foundation, serving through the 35th Convocation cycle. Currently the Senate Representative on the University's 17th Governing Council.",
    tenure: "35th Convocation Cycle · Senate Rep., 17th Governing Council",
    imageUrl: null,
    displayOrder: 106,
  },
];

/** Convenience selector used by the /about governance tabs and landed sections. */
export function leadershipByGroup(
  members: LeadershipDTO[],
  group: LeadershipGroup
): LeadershipDTO[] {
  return members
    .filter((m) => m.group === group)
    .sort((a, b) => a.displayOrder - b.displayOrder || a.fullName.localeCompare(b.fullName));
}

/** 2026 strategic framing shared by the homepage and /about. */
export const STRATEGIC_2026 = {
  viceChancellor: "Prof. Chike Princewill Rewhuamwhu Chike",
  viceChancellorShortName: "Prof. Chike Princewill R. Chike",
  viceChancellorOffice: "10th Vice-Chancellor, University of Port Harcourt",
  vision: "Shared Vision for a Globally Respected University",
  agenda: "Eight-Point Strategic Agenda",
  agendaPillars: [
    "Technological Innovation",
    "Impactful Research",
    "Societal Relevance",
    "Sustainable Development",
    "Teaching & Learning Excellence",
    "Human Capital Development",
    "Digital Transformation",
    "Global Partnerships",
  ],
  milestone: "Golden Jubilee",
  hostCommunities: ["Choba", "Aluu", "Akpor"],
} as const;
