-- UPHF Schema Migration — 001_uphf_schema.sql
-- Supabase (PostgreSQL) + local parity. Run with: psql $DATABASE_URL -f supabase/migrations/001_uphf_schema.sql
-- or: npx drizzle-kit push (then apply trigger section manually)

-- Extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null check (category in ('ENDOWMENT','SCHOLARSHIP','INFRASTRUCTURE','RESEARCH','ALUMNI_CLASS')),
  short_description text not null default '',
  description text not null default '',
  image_url text,
  target_amount_ngn bigint not null default 0 check (target_amount_ngn >= 0),
  amount_raised_ngn bigint not null default 0 check (amount_raised_ngn >= 0),
  donor_count integer not null default 0 check (donor_count >= 0),
  is_active boolean not null default true,
  is_featured boolean not null default false,
  naming_tiers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_campaigns_slug on campaigns (slug);
create index if not exists idx_campaigns_category on campaigns (category);
create index if not exists idx_campaigns_active on campaigns (is_active);

create table if not exists donations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete set null,
  donor_name text not null,
  donor_email text not null,
  organization text,
  amount numeric(14,2) not null check (amount > 0),
  currency text not null default 'NGN' check (currency in ('NGN','USD','GBP','EUR')),
  amount_ngn_equivalent bigint not null default 0 check (amount_ngn_equivalent >= 0),
  is_alumni boolean not null default false,
  graduation_year integer,
  display_on_donor_wall boolean not null default false,
  payment_status text not null default 'PENDING' check (payment_status in ('PENDING','VERIFIED','FAILED')),
  payment_gateway text not null default 'PAYSTACK' check (payment_gateway in ('PAYSTACK','STRIPE','BANK_WIRE')),
  gateway_reference text unique,
  pledge_reference text unique,
  created_at timestamptz not null default now(),
  verified_at timestamptz
);
create index if not exists idx_donations_campaign on donations (campaign_id);
create index if not exists idx_donations_status on donations (payment_status);
create index if not exists idx_donations_gateway_ref on donations (gateway_reference);
create index if not exists idx_donations_pledge_ref on donations (pledge_reference);
create index if not exists idx_donations_wall on donations (display_on_donor_wall, payment_status);

create table if not exists leadership_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text not null,
  category text not null default 'TRUSTEE' check (category in ('TRUSTEE','DIRECTORATE')),
  bio text not null default '',
  tenure text,
  image_url text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_leadership_active on leadership_members (is_active, display_order);

create table if not exists stewardship_reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  fiscal_year text not null,
  report_type text not null check (report_type in ('ANNUAL_IMPACT','AUDITED_FINANCIAL','QUARTERLY','ENDOWMENT_STATEMENT')),
  file_url text not null,
  file_size text,
  summary text default '',
  created_at timestamptz not null default now()
);
create index if not exists idx_reports_year on stewardship_reports (fiscal_year);
create index if not exists idx_reports_type on stewardship_reports (report_type);

create table if not exists alumni_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  graduation_year integer not null,
  department text not null,
  faculty text,
  city text,
  country text,
  industry text,
  chapter_interest text,
  phone text,
  created_at timestamptz not null default now()
);
create index if not exists idx_alumni_year on alumni_submissions (graduation_year);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  organization text,
  category text not null default 'GENERAL' check (category in ('MAJOR_GIFT','CORPORATE_CSR','SCHOLARSHIP','ALUMNI_CHAPTER','GENERAL')),
  subject text,
  message text not null,
  status text not null default 'NEW' check (status in ('NEW','IN_REVIEW','RESPONDED','CLOSED')),
  created_at timestamptz not null default now()
);
create index if not exists idx_inquiries_category on inquiries (category);
create index if not exists idx_inquiries_status on inquiries (status);

-- ============================================================
-- TRIGGER: atomic campaign totals on verification
-- ONLY increments when payment_status transitions TO 'VERIFIED'
-- Idempotent: repeat VERIFIED updates do not double-count
-- ============================================================
create or replace function increment_campaign_totals()
returns trigger
language plpgsql
as $$
begin
  if new.payment_status = 'VERIFIED' and (old.payment_status is distinct from 'VERIFIED') then
    if new.campaign_id is not null then
      update campaigns
      set amount_raised_ngn = amount_raised_ngn + coalesce(new.amount_ngn_equivalent, 0),
          donor_count = donor_count + 1,
          updated_at = now()
      where id = new.campaign_id;
    end if;
    new.verified_at = coalesce(new.verified_at, now());
  end if;
  return new;
end;
$$;

drop trigger if exists trg_increment_campaign_totals on donations;
create trigger trg_increment_campaign_totals
  before update of payment_status on donations
  for each row
  execute function increment_campaign_totals();

-- Keep updated_at fresh on campaigns
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_campaigns_touch on campaigns;
create trigger trg_campaigns_touch before update on campaigns
  for each row execute function touch_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- Donor emails + unverified records stay protected.
-- Active campaigns, leadership, opted-in wall entries are public.
-- ============================================================
alter table campaigns enable row level security;
alter table donations enable row level security;
alter table leadership_members enable row level security;
alter table stewardship_reports enable row level security;
alter table alumni_submissions enable row level security;
alter table inquiries enable row level security;

-- Campaigns: public read for active; service role full access
drop policy if exists "public_read_active_campaigns" on campaigns;
create policy "public_read_active_campaigns" on campaigns
  for select using (is_active = true);
drop policy if exists "service_full_campaigns" on campaigns;
create policy "service_full_campaigns" on campaigns
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Donations: public may INSERT pending gifts; public read ONLY verified + wall-opted-in (email redacted at app layer);
-- service role full access. No public UPDATE/DELETE.
drop policy if exists "public_insert_donations" on donations;
create policy "public_insert_donations" on donations
  for insert with check (payment_status = 'PENDING');
drop policy if exists "public_read_donor_wall" on donations;
create policy "public_read_donor_wall" on donations
  for select using (payment_status = 'VERIFIED' and display_on_donor_wall = true);
drop policy if exists "service_full_donations" on donations;
create policy "service_full_donations" on donations
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Leadership: public read active profiles
drop policy if exists "public_read_leadership" on leadership_members;
create policy "public_read_leadership" on leadership_members
  for select using (is_active = true);
drop policy if exists "service_full_leadership" on leadership_members;
create policy "service_full_leadership" on leadership_members
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Reports: public read all
drop policy if exists "public_read_reports" on stewardship_reports;
create policy "public_read_reports" on stewardship_reports
  for select using (true);
drop policy if exists "service_full_reports" on stewardship_reports;
create policy "service_full_reports" on stewardship_reports
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Alumni + inquiries: public may INSERT; only service role may read
drop policy if exists "public_insert_alumni" on alumni_submissions;
create policy "public_insert_alumni" on alumni_submissions
  for insert with check (true);
drop policy if exists "service_full_alumni" on alumni_submissions;
create policy "service_full_alumni" on alumni_submissions
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists "public_insert_inquiries" on inquiries;
create policy "public_insert_inquiries" on inquiries
  for insert with check (true);
drop policy if exists "service_full_inquiries" on inquiries;
create policy "service_full_inquiries" on inquiries
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
