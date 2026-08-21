-- ============================================================
--  Portfolio — Supabase schema
--  Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- 1) Content table -------------------------------------------------
-- A single row holds the entire portfolio content as JSON.
-- id = 1 is the only row used by the site.
create table if not exists public.portfolio_content (
  id          integer primary key default 1,
  content     jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into public.portfolio_content (id, content)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- 2) Storage bucket for uploaded images ---------------------------
-- Created via Dashboard → Storage → New bucket (name: portfolio-images)
-- or uncomment and run once (requires storage schema):
-- insert into storage.buckets (id, name, public) values ('portfolio-images','portfolio-images', true);

-- 3) Row Level Security --------------------------------------------
alter table public.portfolio_content enable row level security;

-- Public can READ the single content row (so visitors see the portfolio).
drop policy if exists "public read" on public.portfolio_content;
create policy "public read"
  on public.portfolio_content
  for select
  to anon, authenticated
  using (true);

-- Only authenticated users can WRITE (i.e. the admin).
drop policy if exists "auth write" on public.portfolio_content;
create policy "auth write"
  on public.portfolio_content
  for all
  to authenticated
  using (true)
  with check (true);

-- 4) Storage RLS ---------------------------------------------------
-- Public read, authenticated write for the portfolio-images bucket.
-- Run these after the bucket exists:
-- create policy "public read images" on storage.objects for select to anon, authenticated using (bucket_id = 'portfolio-images');
-- create policy "auth write images"  on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-images');
