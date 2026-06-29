-- ============================================================
-- Homestead Concrete & Excavation — Supabase Setup
-- Run this in Supabase SQL Editor (supabase.com -> SQL Editor)
-- ============================================================

-- 1. LEADS TABLE
create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  phone text not null,
  email text,
  service text,
  details text,
  source text default 'website',
  status text default 'new'
);

-- 2. ROW LEVEL SECURITY
alter table leads enable row level security;

create policy "Anyone can submit a lead"
  on leads for insert
  with check (true);

create policy "Authenticated users can view leads"
  on leads for select
  using (auth.role() = 'authenticated');

-- 3. ENABLE HTTP EXTENSION (needed to call Edge Function)
create extension if not exists http with schema extensions;

-- 4. TRIGGER FUNCTION — calls Edge Function on new lead
-- Replace YOUR_PROJECT_REF with your actual Supabase project ref
-- (the part before .supabase.co in your project URL)
create or replace function notify_new_lead()
returns trigger language plpgsql security definer as $$
begin
  perform
    extensions.http_post(
      url    := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/notify-lead',
      body   := row_to_json(NEW)::text,
      params := ARRAY[
        extensions.http_header('Content-Type', 'application/json'),
        extensions.http_header('Authorization', 'Bearer ' || current_setting('app.service_role_key', true))
      ]
    );
  return NEW;
end;
$$;

-- 5. ATTACH TRIGGER TO TABLE
drop trigger if exists on_new_lead on leads;
create trigger on_new_lead
  after insert on leads
  for each row execute procedure notify_new_lead();

-- ============================================================
-- DONE. See README.md for Edge Function deploy instructions.
-- ============================================================
