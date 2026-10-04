-- Anna & Fluffy's lightweight CMS schema.
-- Run this in the Supabase SQL editor after creating a free project.

create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Public visitors do not read this table directly. The Next.js backend reads it
-- with the service role key and exposes only the public website content.

drop policy if exists "Deny direct anon reads" on public.site_content;
create policy "Deny direct anon reads"
  on public.site_content for select
  to anon
  using (false);

drop policy if exists "Deny direct authenticated reads" on public.site_content;
create policy "Deny direct authenticated reads"
  on public.site_content for select
  to authenticated
  using (false);

insert into public.site_content (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-assets',
  'site-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read site assets" on storage.objects;
create policy "Public can read site assets"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'site-assets');

-- Uploads happen only from the Next.js backend using SUPABASE_SERVICE_ROLE_KEY.
