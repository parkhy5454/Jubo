
create extension if not exists pgcrypto;
create or replace function is_admin() returns boolean language sql security definer as $$
  select exists (select 1 from church_admins where user_id=auth.uid());
$$;
create table if not exists jubo_docs (id uuid primary key default gen_random_uuid(), file_path text, church_name text, date_text text, created_at timestamptz default now());
create table if not exists qt_records (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users, today_start int, today_end int, prayer text, god_is text, lesson text, decision text, created_at timestamptz default now());
create table if not exists donation_issue_log (id uuid primary key default gen_random_uuid(), donor_name text, amount int, hmac_signature text, issued_at timestamptz default now());
create table if not exists church_members (id uuid primary key default gen_random_uuid(), name text, phone text, district int, role text, created_at timestamptz default now());
create table if not exists church_admins (user_id uuid primary key references auth.users);
create table if not exists bible_text (id serial primary key, book_id int, book_name text, chapter int, verse int, text text);
alter table jubo_docs enable row level security;
alter table qt_records enable row level security;
alter table donation_issue_log enable row level security;
alter table church_members enable row level security;
alter table bible_text enable row level security;
create policy "public read jubo" on jubo_docs for select using (true);
create policy "auth insert jubo" on jubo_docs for insert with check (auth.role()='authenticated');
create policy "own qt insert" on qt_records for insert with check (auth.uid()=user_id);
create policy "own qt select" on qt_records for select using (auth.uid()=user_id);
create policy "public bible read" on bible_text for select using (true);
