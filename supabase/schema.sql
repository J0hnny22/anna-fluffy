-- Supabase-ready schema for Anna & Fluffy's Grooming.
-- This file is not applied automatically. Review RLS policies and run against a configured
-- Supabase project when real appointment storage is connected.

create extension if not exists pgcrypto;

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  specialties text[] not null default '{}',
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  price_from numeric(8, 2),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.availability (
  id uuid primary key default gen_random_uuid(),
  team_member_id uuid not null references public.team_members(id) on delete cascade,
  date date not null,
  start_time time not null,
  end_time time not null,
  available boolean not null default true,
  created_at timestamptz not null default now(),
  constraint availability_time_order check (end_time > start_time),
  constraint availability_unique_slot unique (team_member_id, date, start_time)
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  team_member_id uuid not null references public.team_members(id),
  service_id uuid not null references public.services(id),
  customer_name text not null,
  pet_name text not null,
  phone text not null,
  email text not null,
  breed text not null,
  pet_size text not null check (pet_size in ('pequeno', 'mediano', 'grande', 'gigante')),
  date date not null,
  start_time time not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz not null default now()
);

create unique index if not exists appointments_no_double_booking
  on public.appointments (team_member_id, date, start_time)
  where status in ('pending', 'confirmed');

alter table public.team_members enable row level security;
alter table public.services enable row level security;
alter table public.availability enable row level security;
alter table public.appointments enable row level security;

-- Suggested public read policies for active catalog data.
create policy "Public can read active team members"
  on public.team_members for select
  to anon, authenticated
  using (active = true);

create policy "Public can read active services"
  on public.services for select
  to anon, authenticated
  using (active = true);

create policy "Public can read available slots"
  on public.availability for select
  to anon, authenticated
  using (available = true);

-- Appointment insert/update/admin policies should be completed with the final auth model.
