-- ============================================================
-- Homestead Concrete & Excavation — Supabase Setup
-- Run this in your Supabase SQL Editor (supabase.com -> SQL Editor)
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
  status text default 'new'  -- new | contacted | quoted | won | lost
);

-- 2. ROW LEVEL SECURITY (anyone can insert, only authenticated users can read)
alter table leads enable row level security;

create policy "Anyone can submit a lead"
  on leads for insert
  with check (true);

create policy "Authenticated users can view leads"
  on leads for select
  using (auth.role() = 'authenticated');

-- 3. NOTIFY FUNCTION — sends a webhook on new lead
-- This triggers your text/email notification
-- Replace YOUR_WEBHOOK_URL with your Supabase Edge Function URL
create or replace function notify_new_lead()
returns trigger language plpgsql as $$
begin
  perform net.http_post(
    url := 'YOUR_WEBHOOK_URL',
    body := json_build_object(
      'name', NEW.name,
      'phone', NEW.phone,
      'email', NEW.email,
      'service', NEW.service,
      'details', NEW.details,
      'created_at', NEW.created_at
    )::text,
    headers := '{"Content-Type":"application/json"}'::jsonb
  );
  return NEW;
end;
$$;

create trigger on_new_lead
  after insert on leads
  for each row execute procedure notify_new_lead();

-- ============================================================
-- DONE. Next step: create the Edge Function for notifications.
-- See README.md for instructions.
-- ============================================================
