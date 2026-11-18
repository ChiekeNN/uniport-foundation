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
-- LEADERSHIP (historical + recent)
-- ============================================================
insert into leadership_members (full_name, role, category, bio, tenure, display_order, is_active)
values
  ('Professor Nimi Dimkpa Briggs', 'Chairman, Board of Trustees', 'TRUSTEE', 'Former Vice-Chancellor of the University of Port Harcourt and eminent scholar in Obstetrics & Gynaecology. Provided founding fiduciary leadership to the Foundation, anchoring its governance in academic integrity and public accountability.', 'Founding Chairman', 1, true),
  ('Professor Ngozi Odu', 'Member, Board of Trustees', 'TRUSTEE', 'Distinguished academic and public administrator; former Deputy Vice-Chancellor (Administration), UNIPORT and former Deputy Governor of Rivers State. Championed scholarship access and women-in-academia advancement.', 'Trustee', 2, true),
  ('Professor Henry E. Alapiki', 'Member, Board of Trustees', 'TRUSTEE', 'Professor of Political Science and former Dean, Faculty of Social Sciences. Long-standing adviser on governance, institutional linkages, and advancement ethics.', 'Trustee', 3, true),
  ('Professor Leo Osuji', 'Director, University Advancement Centre', 'DIRECTORATE', 'Professor of Petroleum & Environmental Chemistry. Leads industry–university R&D structuring, including petroleum, environment, and energy-transition partnerships.', 'Directorate', 4, true),
  ('Professor Uzoma D. Chima', 'Director, Advancement & Linkages Programmes', 'DIRECTORATE', 'Professor of Forestry & Environment. Coordinates alumni relations, class-set reunion giving, and the endowment stewardship reporting cycle.', 'Directorate', 5, true),
  ('Mrs. Gloria O. Jim-Daniels', 'Secretary / Head, Advancement Operations', 'DIRECTORATE', 'Custodian of donor records, receipting, and quarterly milestone reporting. Oversees the ring-fenced accounts protocol and Donor Wall of Honor verification.', 'Directorate', 6, true)
on conflict do nothing;

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
