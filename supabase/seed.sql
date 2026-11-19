-- UPHF Seed Data — supabase/seed.sql
-- Run after migration: psql $DATABASE_URL -f supabase/seed.sql

-- ============================================================
-- CAMPAIGNS (4 flagship)
-- ============================================================
insert into campaigns (slug, title, category, short_description, description, image_url, target_amount_ngn, amount_raised_ngn, donor_count, is_active, is_featured, naming_tiers)
values
(
  'golden-jubilee-endowment-fund',
  'The Golden Jubilee Endowment Fund',
  'ENDOWMENT',
  'A ₦5 billion perpetual endowment to secure UNIPORT''s next 50 years of academic excellence.',
  'Launched ahead of the University of Port Harcourt''s Golden Jubilee, this perpetual endowment anchors the University''s long-term financial independence. Principal is preserved in ring-fenced fiduciary accounts; only audited investment income funds professorial chairs, library acquisitions, laboratory renewal, and competitive student bursaries. Every gift is receipted, ring-fenced, and reported quarterly. Donors of ₦50M+ are recognised with named endowment windows and permanent inscription in the Advancement Centre Founders Gallery.',
  null,
  5000000000, 1287500000, 342, true, true,
  '[{"tier":"Founders Circle","min_ngn":100000000,"benefit":"Named Endowment Window + Founders Gallery inscription + annual Vice-Chancellor''s dinner"},{"tier":"Gold Laureate","min_ngn":50000000,"benefit":"Named professorial chair support fund + plaque in Advancement Centre"},{"tier":"Jubilee Patron","min_ngn":10000000,"benefit":"Named bursary line + certificate + annual impact report dedication"},{"tier":"Friend of the Jubilee","min_ngn":1000000,"benefit":"Digital Donor Wall of Honor + jubilee lapel insignia"}]'::jsonb
),
(
  'unique-uniport-indigent-scholars-fund',
  'Unique UNIPORT Indigent Scholars Fund',
  'SCHOLARSHIP',
  'Keep brilliant but indigent students in school — full and partial scholarships, upkeep stipends, and emergency aid.',
  'No brilliant Unique should drop out for lack of funds. This fund provides full-tuition scholarships, accommodation support, upkeep stipends, and emergency grants to rigorously verified indigent students across all faculties. Disbursement is need-tested by the Student Affairs and Advancement offices, with each scholar paired to a donor stewardship file showing enrolment, GPA progression, and graduation outcomes. ₦350,000 keeps one student fully enrolled for an academic year.',
  null,
  750000000, 214600000, 891, true, true,
  '[{"tier":"Full Scholar Patron","min_ngn":1400000,"benefit":"Name one 4-year scholar + annual scholar letter + graduation invitation"},{"tier":"Annual Bursary Sponsor","min_ngn":350000,"benefit":"Fund one student for a full session + progress report"},{"tier":"Upkeep Partner","min_ngn":100000,"benefit":"Stipend + emergency aid pool + termly impact brief"}]'::jsonb
),
(
  'stem-digital-innovation-labs-upgrade',
  'STEM & Digital Innovation Labs Upgrade',
  'INFRASTRUCTURE',
  'Re-tool 12 science and engineering laboratories with modern instrumentation and campus-wide digital fabrication capacity.',
  'In partnership with industry and the Faculties of Science, Engineering, and Computing, this campaign re-tools twelve teaching and research laboratories — instrumentation, power conditioning, fume extraction, high-speed connectivity, and a shared digital fabrication (Fab) studio at Delta Park. Each lab upgrade is delivered as a milestone tranche with independent quantity-surveyor certification, photographic evidence, and commissioning reports published to donors before the next tranche is released.',
  null,
  1800000000, 642300000, 187, true, true,
  '[{"tier":"Named Laboratory","min_ngn":150000000,"benefit":"Full lab naming rights for 15 years + commissioning plaque + annual open-day"},{"tier":"Innovation Bay","min_ngn":50000000,"benefit":"Named fabrication bay / instrumentation suite + branding wall"},{"tier":"Equipment Patron","min_ngn":5000000,"benefit":"Named equipment line + calibration certificate dedication"}]'::jsonb
),
(
  'class-of-1998-legacy-research-chairs',
  'Alumni Class Legacy — Research Chairs & Lecture Wing',
  'ALUMNI_CLASS',
  'Class-set reunion giving: endow two industry-linked research chairs and refurbish the Delta Park lecture wing.',
  'The reunion-giving vehicle for anniversary class sets (10th, 20th, 25th, 30th). The pilot cohort — friends of the University across the 1988–1998 sets — is endowing two industry-linked Research Chairs (Energy Transition; Public Health & Environment) and refurbishing the Delta Park lecture wing with tiered seating, acoustic treatment, and solar-backed power. Class captains receive a reunion toolkit: pledge cards, peer-to-peer pages, and a legacy plaque listing every class donor.',
  null,
  900000000, 187450000, 264, true, true,
  '[{"tier":"Legacy Chair Founder","min_ngn":75000000,"benefit":"Co-name a research chair + inaugural lecture honour"},{"tier":"Lecture Wing Patron","min_ngn":25000000,"benefit":"Named row + reunion plaque + convocation recognition"},{"tier":"Class Donor","min_ngn":250000,"benefit":"Class legacy roll + reunion yearbook feature"}]'::jsonb
)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  short_description = excluded.short_description,
  description = excluded.description,
  target_amount_ngn = excluded.target_amount_ngn,
  amount_raised_ngn = excluded.amount_raised_ngn,
  donor_count = excluded.donor_count,
  is_active = excluded.is_active,
  is_featured = excluded.is_featured,
  naming_tiers = excluded.naming_tiers;

-- ============================================================
-- LEADERSHIP — 2026 INSTITUTIONAL & FOUNDATION UPDATE
-- ============================================================
-- Groups: BOARD_OF_TRUSTEES (institutional patrons & trustees),
--         DIRECTORATE (University Advancement Centre), PAST_DIRECTORS (heritage archive:
--         founding incorporated trustees from RC 61670 + the directors' line of succession).
-- IDs are deterministic so re-running this seed updates in place instead of duplicating.
-- Requires migration 002_leadership_2026.sql (adds credentials + "group").

-- Clear superseded pre-2026 placeholder records by name (legacy rows had random UUIDs).
delete from leadership_members
where full_name in (
  'Professor Nimi Dimkpa Briggs',
  'Professor Ngozi Odu',
  'Professor Henry E. Alapiki',
  'Professor Leo Osuji',
  'Professor Uzoma D. Chima',
  'Mrs. Gloria O. Jim-Daniels'
);

insert into leadership_members
  (id, full_name, credentials, role, category, "group", bio, tenure, display_order, is_active)
values
  -- ── ACTIVE 2026 · INSTITUTIONAL PATRONS & BOARD OF TRUSTEES ──
  -- Order: Pro-Chancellor (Chairman of Council) → Vice-Chancellor (Institutional Patron) → DVC
  (
    '20260002-0000-4000-a000-000000000002',
    'Senator Mao Arukwe Ohuabunwa',
    'PhD, KSC, DSSRS',
    'Pro-Chancellor & Chairman, 17th Governing Council',
    'TRUSTEE', 'BOARD_OF_TRUSTEES',
    'Pro-Chancellor and Chairman of the 17th Governing Council of the University of Port Harcourt, providing institutional governance and strategic oversight alongside the Foundation''s Board of Trustees.',
    '17th Governing Council', 1, true
  ),
  (
    '20260001-0000-4000-a000-000000000001',
    'Prof. Chike Princewill Rewhuamwhu Chike',
    'B.Med.Sc., M.B., B.S., M.Sc., MD (UPH), FAGP, FIIA, DMP, DSSRS',
    '10th Vice-Chancellor, University of Port Harcourt & Institutional Patron, UPHF',
    'TRUSTEE', 'BOARD_OF_TRUSTEES',
    'Professor of Cardiovascular and Tissue Perfusion Physiology and three-time Commissioner for Health in Rivers State. Inaugurated in July 2026 as the 10th Vice-Chancellor of UNIPORT, championing the "Shared Vision for a Globally Respected University" and an Eight-Point Strategic Agenda focused on technological innovation, impactful research, societal relevance, and sustainable development.',
    'Assumed Office: July 2026', 2, true
  ),
  (
    '20260003-0000-4000-a000-000000000003',
    'Prof. Chukwudi Ochi Onyeaso',
    'BDS, FWACS, FMCDS',
    'Deputy Vice-Chancellor (Administration & Advancement)',
    'TRUSTEE', 'BOARD_OF_TRUSTEES',
    'Oversees university administration, institutional advancement coordination, and external stakeholder linkages in support of UPHF''s resource mobilization mandate.',
    'Deputy Vice-Chancellor', 3, true
  ),
  -- ── ACTIVE 2026 · EXECUTIVE DIRECTORATE ──
  (
    '20260004-0000-4000-a000-000000000004',
    'Prof. Friday Nwafor',
    'BA, MA, PhD (UPH)',
    'Director, University of Port Harcourt Foundation (UPHF)',
    'DIRECTORATE', 'DIRECTORATE',
    'Professor of Drama, Theatre and Film Studies (BA, MA, PhD, UPH). Listed as the current Director of the University of Port Harcourt Foundation in the University''s 36th Combined Convocation Brochure (June 2026). Leads day-to-day operations at the University Advancement Centre, Delta Park, driving endowment growth, alumni relations, corporate CSR partnerships, and donor stewardship.',
    'Director, UPHF · 2025/2026 – present', 4, true
  ),
-- ── INSTITUTIONAL HERITAGE · FOUNDING INCORPORATED TRUSTEES (RC 61670) ──
  (
    '20260101-0000-4000-a000-000000000101',
    'Prof. Nimi Dimkpa Briggs',
    null,
    'Founding Incorporated Trustee & 5th Vice-Chancellor (Late)',
    'HERITAGE', 'PAST_DIRECTORS',
    'Founding Incorporated Trustee of the Foundation and 5th Vice-Chancellor of the University of Port Harcourt. Spearheaded the 2002 MacArthur Foundation Advancement Centre initiative — the intervention still remembered on campus as the “UNIPORT Miracle” — and signed the Foundation into being at its CAC incorporation on 5 June 2013.',
    'Vice-Chancellor 2000–2005 · Trustee from 2013', 101, true
  ),
  (
    '20260102-0000-4000-a000-000000000102',
    'Rev. (Dr.) Walter Patrick Eneji',
    null,
    'Founding Incorporated Trustee',
    'HERITAGE', 'PAST_DIRECTORS',
    'Founding Incorporated Trustee of the University of Port Harcourt Foundation, named in the CAC registry at the 2013 incorporation that established the Foundation as an independent fiduciary trust under RC 61670.',
    'Trustee from 2013', 102, true
  ),
  (
    '20260107-0000-4000-a000-000000000107',
    'Prof. Joseph Atubokiki Ajienka',
    null,
    'Founding Incorporated Trustee & 7th Vice-Chancellor',
    'HERITAGE', 'PAST_DIRECTORS',
    '7th Vice-Chancellor of the University of Port Harcourt (2010–2015) and a founding Incorporated Trustee of the Foundation, presiding over the University at the moment UPHF was incorporated on 5 June 2013.',
    'Vice-Chancellor 2010–2015 · Trustee from 2013', 107, true
  ),
  (
    '20260108-0000-4000-a000-000000000108',
    'Dr. Emmanuel Egbogah',
    null,
    'Founding Incorporated Trustee & Benefactor',
    'HERITAGE', 'PAST_DIRECTORS',
    'Petroleum geologist, benefactor of the University and founding Incorporated Trustee of the Foundation, listed as a board member in the public CAC registry for RC 61670.',
    'Trustee from 2013', 108, true
  ),
  (
    '20260109-0000-4000-a000-000000000109',
    'Mrs. Matilda Nnodim',
    null,
    'Founding Incorporated Trustee & Former Registrar',
    'HERITAGE', 'PAST_DIRECTORS',
    'Former Registrar of the University of Port Harcourt and a founding Incorporated Trustee of the Foundation, named in the public CAC registry for RC 61670.',
    'Trustee from 2013', 109, true
  ),
  -- ── INSTITUTIONAL HERITAGE · DIRECTORS OF THE FOUNDATION (LINE OF SUCCESSION) ──
  (
    '20260103-0000-4000-a000-000000000103',
    'Prof. (Mrs.) Ngozi Nma Odu',
    null,
    'Pioneer / First Acting Executive Director, UPHF',
    'HERITAGE', 'PAST_DIRECTORS',
    'Professor of Food and Public Health Microbiology who served as the Foundation''s first Acting Executive Director following its establishment. Later Deputy Governor of Rivers State.',
    'Pioneer term · from the 2013 incorporation', 110, true
  ),
  (
    '20260104-0000-4000-a000-000000000104',
    'Prof. Henry E. Alapiki',
    null,
    'Executive Director / Director, UPHF',
    'HERITAGE', 'PAST_DIRECTORS',
    'Professor of Political Science and former Dean of the Faculty of Social Sciences. Listed as Executive Director / Director of UPHF in the University''s 31st Convocation Brochure (2014/2015 & 2015/2016 sessions) and on the Institute of Petroleum Studies (IPS) Governing Board. Expanded the MacArthur and Nigeria Higher Education Foundation (NHEF) partnerships that anchored early advancement capacity building.',
    'c. 2015–2017', 111, true
  ),
  (
    '20260110-0000-4000-a000-000000000110',
    'Prof. Chukwudi Ochi Onyeaso',
    'BDS, FWACS, FMCDS',
    'Director, UPHF (2020–2022)',
    'HERITAGE', 'PAST_DIRECTORS',
    'Professor of Orthodontics and Dentistry who served as Director of the Foundation during the 2021 administration, as documented in official UNIPORT/OWSD institutional briefings. Subsequently appointed Deputy Vice-Chancellor (Administration & Advancement) and now sits on the Board of Trustees.',
    'c. 2020–2022 · now DVC (Administration & Advancement)', 112, true
  ),
  (
    '20260105-0000-4000-a000-000000000105',
    'Prof. Leo C. Osuji',
    null,
    'Director, UPHF (2022–2024)',
    'HERITAGE', 'PAST_DIRECTORS',
    'Professor of Industrial and Environmental Chemistry. Served as Director of the Foundation and represented UPHF on the Governing Board of the Institute of Petroleum and Energy Studies (IPES).',
    'c. 2022–2024', 113, true
  ),
  (
    '20260106-0000-4000-a000-000000000106',
    'Prof. Uzoma D. Chima',
    'B.For, MF, PhD',
    'Director, UPHF (2024–2025)',
    'HERITAGE', 'PAST_DIRECTORS',
    'Professor of Forestry and Wildlife Management. Listed as Director of the University of Port Harcourt Foundation in the University''s 35th Convocation Brochure (published July 2025 for the 2021/2022 & 2022/2023 sessions). Currently the Senate Representative on the University''s 17th Governing Council.',
    '2024–2025 · 35th Convocation cycle', 114, true
  )
on conflict (id) do update set
  full_name = excluded.full_name,
  credentials = excluded.credentials,
  role = excluded.role,
  category = excluded.category,
  "group" = excluded."group",
  bio = excluded.bio,
  tenure = excluded.tenure,
  display_order = excluded.display_order,
  is_active = excluded.is_active;

-- ============================================================
-- STEWARDSHIP REPORTS
-- ============================================================
insert into stewardship_reports (title, fiscal_year, report_type, file_url, file_size, summary)
values
  ('Annual Impact Report 2024 — Advancing Excellence', '2024', 'ANNUAL_IMPACT', '/reports/uphf-annual-impact-2024.pdf', '4.2 MB', 'Scholarships disbursed, lab milestones commissioned, and endowment growth with audited highlights.'),
  ('Audited Financial Statements FY 2024', '2024', 'AUDITED_FINANCIAL', '/reports/uphf-audited-financials-2024.pdf', '1.8 MB', 'Independent external audit opinion, statement of financial position, and fund-by-fund accounting.'),
  ('Q4 2024 Stewardship & Milestone Bulletin', '2024', 'QUARTERLY', '/reports/uphf-q4-2024-bulletin.pdf', '2.1 MB', 'Quarterly tranche releases, lab commissioning photos, and scholar progression notes.'),
  ('Annual Impact Report 2023 — The Stewardship Year', '2023', 'ANNUAL_IMPACT', '/reports/uphf-annual-impact-2023.pdf', '3.9 MB', 'Foundations of the ring-fenced reporting protocol and class-set reunion giving pilots.'),
  ('Audited Financial Statements FY 2023', '2023', 'AUDITED_FINANCIAL', '/reports/uphf-audited-financials-2023.pdf', '1.6 MB', 'Prior-year audited statements and comparative fund performance.'),
  ('Endowment Performance Statement H1 2025', '2025', 'ENDOWMENT_STATEMENT', '/reports/uphf-endowment-h1-2025.pdf', '0.9 MB', 'Interim endowment principal, yield, and disbursement schedule.')
on conflict do nothing;

-- ============================================================
-- SAMPLE VERIFIED DONOR WALL ENTRIES (opted-in)
-- ============================================================
-- Attached to the Golden Jubilee campaign for display purposes
do $$
declare
  jubilee_id uuid;
begin
  select id into jubilee_id from campaigns where slug = 'golden-jubilee-endowment-fund' limit 1;
  if jubilee_id is not null then
    insert into donations (campaign_id, donor_name, donor_email, organization, amount, currency, amount_ngn_equivalent, is_alumni, graduation_year, display_on_donor_wall, payment_status, payment_gateway, gateway_reference, pledge_reference, verified_at)
    values
      (jubilee_id, 'Engr. Tamunoemi Horsfall', 'donor.wall+1@example.org', 'Horsfall Energy Ltd', 5000000, 'NGN', 5000000, true, 1994, true, 'VERIFIED', 'PAYSTACK', 'seed-ref-0001', 'UPHF-2024-0001', now()),
      (jubilee_id, 'Dr. (Mrs.) Adaeze Okonkwo', 'donor.wall+2@example.org', null, 2500, 'USD', 3750000, true, 2001, true, 'VERIFIED', 'STRIPE', 'seed-ref-0002', 'UPHF-2024-0002', now()),
      (jubilee_id, 'Class of 1998 Reunion Committee', 'donor.wall+3@example.org', 'UNIPORT Alumni — Class of 1998', 12000000, 'NGN', 12000000, true, 1998, true, 'VERIFIED', 'BANK_WIRE', 'seed-ref-0003', 'UPHF-2024-0003', now()),
      (jubilee_id, 'Anonymous Friend of UNIPORT', 'donor.wall+4@example.org', null, 1000, 'GBP', 1900000, false, null, false, 'VERIFIED', 'STRIPE', 'seed-ref-0004', 'UPHF-2024-0004', now())
    on conflict (gateway_reference) do nothing;
  end if;
end $$;
