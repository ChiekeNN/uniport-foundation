import { sql } from "drizzle-orm";
import { db } from "@/db";

/**
 * Idempotent database preparation for the demo environment.
 *
 * Runs the subset of the Supabase schema the portal needs to accept, verify and
 * report on gifts. Every statement is `if not exists`, so it is safe to run on a
 * database that is already populated — it never overwrites data.
 */
const STATEMENTS: string[] = [
  `create extension if not exists "pgcrypto"`,

  `create table if not exists campaigns (
     id uuid primary key default gen_random_uuid(),
     slug text not null unique,
     title text not null,
     category text not null,
     short_description text not null default '',
     description text not null default '',
     image_url text,
     target_amount_ngn bigint not null default 0,
     amount_raised_ngn bigint not null default 0,
     donor_count integer not null default 0,
     is_active boolean not null default true,
     is_featured boolean not null default false,
     naming_tiers jsonb not null default '[]'::jsonb,
     created_at timestamptz not null default now(),
     updated_at timestamptz not null default now()
   )`,

  `create table if not exists donations (
     id uuid primary key default gen_random_uuid(),
     campaign_id uuid references campaigns(id) on delete set null,
     donor_name text not null,
     donor_email text not null,
     organization text,
     amount numeric(14,2) not null,
     currency text not null default 'NGN',
     amount_ngn_equivalent bigint not null default 0,
     is_alumni boolean not null default false,
     graduation_year integer,
     display_on_donor_wall boolean not null default false,
     payment_status text not null default 'PENDING',
     payment_gateway text not null default 'PAYSTACK',
     gateway_reference text unique,
     pledge_reference text unique,
     created_at timestamptz not null default now(),
     verified_at timestamptz
   )`,

  `create table if not exists leadership_members (
     id uuid primary key default gen_random_uuid(),
     full_name text not null,
     credentials text,
     role text not null,
     category text not null default 'TRUSTEE',
     "group" text not null default 'BOARD_OF_TRUSTEES',
     bio text not null default '',
     tenure text,
     image_url text,
     display_order integer not null default 0,
     is_active boolean not null default true,
     created_at timestamptz not null default now()
   )`,

  `create table if not exists stewardship_reports (
     id uuid primary key default gen_random_uuid(),
     title text not null,
     fiscal_year text not null,
     report_type text not null,
     file_url text not null,
     file_size text,
     summary text default '',
     created_at timestamptz not null default now()
   )`,

  `create table if not exists alumni_submissions (
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
   )`,

  `create table if not exists inquiries (
     id uuid primary key default gen_random_uuid(),
     full_name text not null,
     email text not null,
     phone text,
     organization text,
     category text not null default 'GENERAL',
     subject text,
     message text not null,
     status text not null default 'NEW',
     created_at timestamptz not null default now()
   )`,

  // Columns added after the first release (migration 002 parity).
  `alter table leadership_members add column if not exists credentials text`,
  `alter table leadership_members add column if not exists "group" text not null default 'BOARD_OF_TRUSTEES'`,

  // Campaign totals must move exactly once, on PENDING → VERIFIED.
  `create or replace function increment_campaign_totals()
   returns trigger language plpgsql as $$
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
   $$`,
  `drop trigger if exists trg_increment_campaign_totals on donations`,
  `create trigger trg_increment_campaign_totals
     before update of payment_status on donations
     for each row execute function increment_campaign_totals()`,

  `create index if not exists idx_donations_status on donations (payment_status)`,
  `create index if not exists idx_donations_wall on donations (display_on_donor_wall, payment_status)`,
  `create index if not exists idx_leadership_active on leadership_members (is_active, display_order)`,
];

const CAMPAIGN_SEED = [
  {
    slug: "golden-jubilee-endowment-fund",
    title: "The Golden Jubilee Endowment Fund",
    category: "ENDOWMENT",
    shortDescription: "A ₦5 billion perpetual endowment to secure UNIPORT's next 50 years of academic excellence.",
    targetAmountNgn: 5_000_000_000,
    amountRaisedNgn: 1_287_500_000,
    donorCount: 342,
  },
  {
    slug: "unique-uniport-indigent-scholars-fund",
    title: "Unique UNIPORT Indigent Scholars Fund",
    category: "SCHOLARSHIP",
    shortDescription: "Keep brilliant but indigent students in school — full and partial scholarships and upkeep stipends.",
    targetAmountNgn: 750_000_000,
    amountRaisedNgn: 214_600_000,
    donorCount: 891,
  },
  {
    slug: "stem-digital-innovation-labs-upgrade",
    title: "STEM & Digital Innovation Labs Upgrade",
    category: "INFRASTRUCTURE",
    shortDescription: "Re-tool 12 science and engineering laboratories with modern instrumentation and a Fab studio.",
    targetAmountNgn: 1_800_000_000,
    amountRaisedNgn: 642_300_000,
    donorCount: 187,
  },
  {
    slug: "class-of-1998-legacy-research-chairs",
    title: "Alumni Class Legacy — Research Chairs & Lecture Wing",
    category: "ALUMNI_CLASS",
    shortDescription: "Class-set reunion giving: endow two research chairs and refurbish the Delta Park lecture wing.",
    targetAmountNgn: 900_000_000,
    amountRaisedNgn: 187_450_000,
    donorCount: 264,
  },
];

export interface SetupReport {
  ok: boolean;
  campaigns: number;
  statementsRun: number;
  warnings?: string[];
  error?: string;
}

type SqlRunner = { execute: typeof db.execute };

/** Creates any missing tables and returns the current campaign count. */
export async function prepareDatabase(target: SqlRunner = db): Promise<SetupReport> {
  let statementsRun = 0;
  const warnings: string[] = [];
  try {
    for (const statement of STATEMENTS) {
      try {
        await target.execute(sql.raw(statement));
        statementsRun += 1;
      } catch (e) {
        // Some managed providers restrict extensions; gen_random_uuid() is
        // built into PostgreSQL 13+, so a missing pgcrypto is not fatal.
        const cause = (e as { cause?: { message?: string } })?.cause?.message ?? "";
        warnings.push(`${statement.split("\n")[0].slice(0, 60)} → ${cause || (e instanceof Error ? e.message : "failed")}`.slice(0, 180));
      }
    }

    const existing = await target.execute<{ count: string }>(sql`select count(*)::text as count from campaigns`);
    const count = Number(existing.rows?.[0]?.count ?? 0);
    if (count === 0) {
      for (const c of CAMPAIGN_SEED) {
        try {
          await target.execute(sql`
          insert into campaigns (slug, title, category, short_description, description, target_amount_ngn, amount_raised_ngn, donor_count, is_active, is_featured)
          values (${c.slug}, ${c.title}, ${c.category}, ${c.shortDescription}, ${c.shortDescription}, ${c.targetAmountNgn}, ${c.amountRaisedNgn}, ${c.donorCount}, true, true)
          on conflict (slug) do nothing
          `);
        } catch (e) {
          const cause = (e as { cause?: { message?: string } })?.cause?.message ?? "";
          warnings.push(`seed ${c.slug} → ${cause || "failed"}`);
        }
      }
    }

    const after = await target.execute<{ count: string }>(sql`select count(*)::text as count from campaigns`);
    return { ok: true, campaigns: Number(after.rows?.[0]?.count ?? 0), statementsRun, warnings };
  } catch (e) {
    console.error("[db-setup]", e);
    return {
      ok: false,
      campaigns: 0,
      statementsRun,
      warnings,
      error: e instanceof Error ? e.message.slice(0, 300) : "Unknown database error",
    };
  }
}
