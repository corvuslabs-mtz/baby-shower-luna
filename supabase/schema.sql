-- Baby Shower Invitation & Gift Registry — Supabase schema
-- Run this whole file once in your Supabase project's SQL Editor.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists gifts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  quantity_needed int not null check (quantity_needed > 0),
  unit_label text not null default '',
  icon text not null default 'star',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists pledges (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid not null references gifts(id) on delete cascade,
  guest_name text not null,
  quantity_pledged int not null check (quantity_pledged > 0),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  guest_count int not null default 1 check (guest_count > 0),
  contact text,
  message text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Guard against over-pledging under concurrent submissions.
-- Locks the parent gift row so two guests can't both squeeze in the "last" unit.
-- ---------------------------------------------------------------------------

create or replace function check_pledge_quantity()
returns trigger as $$
declare
  needed int;
  already_pledged int;
begin
  select quantity_needed into needed
  from gifts
  where id = new.gift_id
  for update;

  if needed is null then
    raise exception 'Gift not found';
  end if;

  select coalesce(sum(quantity_pledged), 0) into already_pledged
  from pledges
  where gift_id = new.gift_id;

  if already_pledged + new.quantity_pledged > needed then
    raise exception 'Only % left on this gift — % was requested', (needed - already_pledged), new.quantity_pledged;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_check_pledge_quantity on pledges;
create trigger trg_check_pledge_quantity
  before insert on pledges
  for each row execute function check_pledge_quantity();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Gifts & pledges are public to read (it's a shared registry); anyone can
-- add a pledge or an RSVP, but nobody can read other guests' RSVPs, and
-- nobody can edit the gift list itself from the client (manage that from
-- the Supabase dashboard as the host).
-- ---------------------------------------------------------------------------

alter table gifts enable row level security;
alter table pledges enable row level security;
alter table rsvps enable row level security;

drop policy if exists "gifts are publicly readable" on gifts;
create policy "gifts are publicly readable"
  on gifts for select
  using (true);

drop policy if exists "pledges are publicly readable" on pledges;
create policy "pledges are publicly readable"
  on pledges for select
  using (true);

drop policy if exists "anyone can add a pledge" on pledges;
create policy "anyone can add a pledge"
  on pledges for insert
  with check (true);

drop policy if exists "anyone can rsvp" on rsvps;
create policy "anyone can rsvp"
  on rsvps for insert
  with check (true);

-- ---------------------------------------------------------------------------
-- Realtime — so every guest's pledge shows up live for everyone else.
-- If these error with "already a member", that's fine, it just means
-- realtime was already enabled for the table.
-- ---------------------------------------------------------------------------

alter publication supabase_realtime add table gifts;
alter publication supabase_realtime add table pledges;

-- ---------------------------------------------------------------------------
-- Seed data — matches the sample registry from the spec. Edit freely,
-- or delete this block and add your own gifts from the Table Editor.
-- ---------------------------------------------------------------------------

insert into gifts (name, quantity_needed, unit_label, icon, sort_order) values
  ('Crib', 1, '', 'star', 1),
  ('Baby Clothes (0-3 months)', 5, 'sets', 'bootie', 2),
  ('Diapers (Newborn size)', 10, 'packs', 'cloud', 3),
  ('Stroller', 1, '', 'star', 4),
  ('Baby Bottles', 6, 'pcs', 'heart', 5),
  ('Baby Blankets', 3, 'pcs', 'cloud', 6)
on conflict do nothing;
