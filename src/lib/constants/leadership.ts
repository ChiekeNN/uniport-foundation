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
 * Within the Board, the Pro-Chancellor (Chairman of Council) is seated first,
 * followed by the Vice-Chancellor (Institutional Patron), then the DVC.
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
    label: "Founding Trustees & Past Directors (2002–Present)",
    caption:
      "Institutional heritage archive: the Incorporated Trustees named in the CAC registry at the 2013 incorporation, and the directors whose stewardship carried the Advancement model from the 2002 MacArthur catalyst to the present day.",
  },
];

export const LEADERSHIP_2026: LeadershipDTO[] = [
  // ───────────────────────── ACTIVE 2026 — BOARD OF TRUSTEES ─────────────────────────
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
    displayOrder: 1,
  },
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
    bio: "Professor of Drama, Theatre and Film Studies (BA, MA, PhD, UPH). Listed as the current Director of the University of Port Harcourt Foundation in the University's 36th Combined Convocation Brochure (June 2026). Leads day-to-day operations at the University Advancement Centre, Delta Park, driving endowment growth, alumni relations, corporate CSR partnerships, and donor stewardship.",
    tenure: "Director, UPHF · 2025/2026 – present",
    imageUrl: null,
    displayOrder: 4,
  },

  // ───────────────────────── INSTITUTIONAL HERITAGE — FOUNDING INCORPORATED TRUSTEES ─────────────────────────
  // Named in the CAC registry at incorporation on 5 June 2013 (RC 61670).
  {
    id: "20260101-0000-4000-a000-000000000101",
    fullName: "Prof. Nimi Dimkpa Briggs",
    credentials: null,
    role: "Founding Incorporated Trustee & 5th Vice-Chancellor (Late)",
    category: "HERITAGE",
    group: "PAST_DIRECTORS",
    bio: "Founding Incorporated Trustee of the Foundation and 5th Vice-Chancellor of the University of Port Harcourt. Spearheaded the 2002 MacArthur Foundation Advancement Centre initiative — the intervention still remembered on campus as the “UNIPORT Miracle” — and signed the Foundation into being at its CAC incorporation on 5 June 2013.",
    tenure: "Vice-Chancellor 2000–2005 · Trustee from 2013",
    imageUrl: null,
    displayOrder: 101,
  },
  {
    id: "20260102-0000-4000-a000-000000000102",
    fullName: "Rev. (Dr.) Walter Patrick Eneji",
    credentials: null,
    role: "Founding Incorporated Trustee",
    category: "HERITAGE",
    group: "PAST_DIRECTORS",
    bio: "Founding Incorporated Trustee of the University of Port Harcourt Foundation, named in the CAC registry at the 2013 incorporation that established the Foundation as an independent fiduciary trust under RC 61670.",
    tenure: "Trustee from 2013",
    imageUrl: null,
    displayOrder: 102,
  },
  {
    id: "20260107-0000-4000-a000-000000000107",
    fullName: "Prof. Joseph Atubokiki Ajienka",
    credentials: null,
    role: "Founding Incorporated Trustee & 7th Vice-Chancellor",
    category: "HERITAGE",
    group: "PAST_DIRECTORS",
    bio: "7th Vice-Chancellor of the University of Port Harcourt (2010–2015) and a founding Incorporated Trustee of the Foundation, presiding over the University at the moment UPHF was incorporated on 5 June 2013.",
    tenure: "Vice-Chancellor 2010–2015 · Trustee from 2013",
    imageUrl: null,
    displayOrder: 107,
  },
  {
    id: "20260108-0000-4000-a000-000000000108",
    fullName: "Dr. Emmanuel Egbogah",
    credentials: null,
    role: "Founding Incorporated Trustee & Benefactor",
    category: "HERITAGE",
    group: "PAST_DIRECTORS",
    bio: "Petroleum geologist, benefactor of the University and founding Incorporated Trustee of the Foundation, listed as a board member in the public CAC registry for RC 61670.",
    tenure: "Trustee from 2013",
    imageUrl: null,
    displayOrder: 108,
  },
  {
    id: "20260109-0000-4000-a000-000000000109",
    fullName: "Mrs. Matilda Nnodim",
    credentials: null,
    role: "Founding Incorporated Trustee & Former Registrar",
    category: "HERITAGE",
    group: "PAST_DIRECTORS",
    bio: "Former Registrar of the University of Port Harcourt and a founding Incorporated Trustee of the Foundation, named in the public CAC registry for RC 61670.",
    tenure: "Trustee from 2013",
    imageUrl: null,
    displayOrder: 109,
  },

  // ───────────────────────── INSTITUTIONAL HERITAGE — DIRECTORS OF THE FOUNDATION ─────────────────────────
  // Line of succession, oldest first. `leadershipByGroup` sorts on displayOrder,
  // so 110–114 stays in chronological order ahead of nothing else in this group.
  {
    id: "20260103-0000-4000-a000-000000000103",
    fullName: "Prof. (Mrs.) Ngozi Nma Odu",
    credentials: null,
    role: "Pioneer / First Acting Executive Director, UPHF",
    category: "HERITAGE",
    group: "PAST_DIRECTORS",
    bio: "Professor of Food and Public Health Microbiology who served as the Foundation's first Acting Executive Director following its establishment. Later Deputy Governor of Rivers State.",
    tenure: "Pioneer term · from the 2013 incorporation",
    imageUrl: null,
    displayOrder: 110,
  },
  {
    id: "20260104-0000-4000-a000-000000000104",
    fullName: "Prof. Henry E. Alapiki",
    credentials: null,
    role: "Executive Director / Director, UPHF",
    category: "HERITAGE",
    group: "PAST_DIRECTORS",
    bio: "Professor of Political Science and former Dean of the Faculty of Social Sciences. Listed as Executive Director / Director of UPHF in the University's 31st Convocation Brochure (2014/2015 & 2015/2016 sessions) and on the Institute of Petroleum Studies (IPS) Governing Board. Expanded the MacArthur and Nigeria Higher Education Foundation (NHEF) partnerships that anchored early advancement capacity building.",
    tenure: "c. 2015–2017",
    imageUrl: null,
    displayOrder: 111,
  },
  {
    id: "20260110-0000-4000-a000-000000000110",
    fullName: "Prof. Chukwudi Ochi Onyeaso",
    credentials: "BDS, FWACS, FMCDS",
    role: "Director, UPHF (2020–2022)",
    category: "HERITAGE",
    group: "PAST_DIRECTORS",
    bio: "Professor of Orthodontics and Dentistry who served as Director of the Foundation during the 2021 administration, as documented in official UNIPORT/OWSD institutional briefings. Subsequently appointed Deputy Vice-Chancellor (Administration & Advancement) and now sits on the Board of Trustees.",
    tenure: "c. 2020–2022 · now DVC (Administration & Advancement)",
    imageUrl: null,
    displayOrder: 112,
  },
  {
    id: "20260105-0000-4000-a000-000000000105",
    fullName: "Prof. Leo C. Osuji",
    credentials: null,
    role: "Director, UPHF (2022–2024)",
    category: "HERITAGE",
    group: "PAST_DIRECTORS",
    bio: "Professor of Industrial and Environmental Chemistry. Served as Director of the Foundation and represented UPHF on the Governing Board of the Institute of Petroleum and Energy Studies (IPES).",
    tenure: "c. 2022–2024",
    imageUrl: null,
    displayOrder: 113,
  },
  {
    id: "20260106-0000-4000-a000-000000000106",
    fullName: "Prof. Uzoma D. Chima",
    credentials: "B.For, MF, PhD",
    role: "Director, UPHF (2024–2025)",
    category: "HERITAGE",
    group: "PAST_DIRECTORS",
    bio: "Professor of Forestry and Wildlife Management. Listed as Director of the University of Port Harcourt Foundation in the University's 35th Convocation Brochure (published July 2025 for the 2021/2022 & 2022/2023 sessions). Currently the Senate Representative on the University's 17th Governing Council.",
    tenure: "2024–2025 · 35th Convocation cycle",
    imageUrl: null,
    displayOrder: 114,
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

/**
 * Heritage split: the archive holds two different populations, and they read
 * better apart — the Incorporated Trustees who called the Foundation into being
 * in 2013, and the directors who have run it since.
 */
export function isFoundingTrustee(member: LeadershipDTO): boolean {
  return /founding/i.test(member.role);
}

/**
 * Directors of the Foundation in chronological order, ending with the sitting
 * Director (who lives in the DIRECTORATE group, not the archive).
 */
export function directorsSuccession(leaders: LeadershipDTO[]): LeadershipDTO[] {
  const past = leadershipByGroup(leaders, "PAST_DIRECTORS").filter((m) => !isFoundingTrustee(m));
  const sitting = leadershipByGroup(leaders, "DIRECTORATE");
  return [...past, ...sitting];
}

/** Corporate Affairs Commission record referenced across the governance UI. */
export const INCORPORATION = {
  body: "Corporate Affairs Commission",
  rcNumber: "RC 61670",
  date: "5 June 2013",
  note: "Registered as an independent, non-profit fiduciary trust — ring-fenced accounts, external audit and public reporting as constitutional obligations.",
} as const;

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
