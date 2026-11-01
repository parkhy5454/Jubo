-- Neon DB 무료 Postgres 최종 원본 - 복사본 없음
create extension if not exists pgcrypto;
create table if not exists jubo_docs (id uuid primary key default gen_random_uuid(), file_path text, church_name text, date_text text, created_at timestamptz default now());
create table if not exists qt_records (id uuid primary key default gen_random_uuid(), today_start int, today_end int, prayer text, god_is text, lesson text, decision text, created_at timestamptz default now());
create table if not exists donation_issue_log (id uuid primary key default gen_random_uuid(), donor_name text, amount int, hmac_signature text, issued_at timestamptz default now());
create table if not exists church_members (id uuid primary key default gen_random_uuid(), name text, phone text, district int, role text, created_at timestamptz default now());
create table if not exists church_admins (user_id uuid primary key default gen_random_uuid());
