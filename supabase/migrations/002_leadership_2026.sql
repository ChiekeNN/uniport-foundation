-- 002_leadership_2026.sql
-- 2026 Leadership & Institutional Update for the UPHF portal.
-- Adds credential + governance-group columns to leadership_members and widens the
-- category check to include 'HERITAGE' (founding stewards / past directors).
-- Safe to run repeatedly (idempotent).

alter table leadership_members
  add column if not exists credentials text;

alter table leadership_members
  add column if not exists "group" text not null default 'BOARD_OF_TRUSTEES';

-- Widen the category constraint to admit the institutional-heritage archive.
alter table leadership_members
  drop constraint if exists leadership_members_category_check;

alter table leadership_members
  add constraint leadership_members_category_check
  check (category in ('TRUSTEE','DIRECTORATE','HERITAGE'));

alter table leadership_members
  drop constraint if exists leadership_members_group_check;

alter table leadership_members
  add constraint leadership_members_group_check
  check ("group" in ('BOARD_OF_TRUSTEES','DIRECTORATE','PAST_DIRECTORS'));

create index if not exists idx_leadership_group
  on leadership_members ("group", is_active, display_order);
