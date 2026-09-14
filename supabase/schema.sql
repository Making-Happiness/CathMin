-- Sacred Heart Catholic Ministries
-- Run this entire file once in the Supabase SQL Editor.

create extension if not exists pgcrypto;

do $$ begin
  create type public.ministry_role as enum ('BEC', 'CFD', 'YFC');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.post_kind as enum ('announcement', 'article', 'photo');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  ministry_role public.ministry_role,
  created_at timestamptz not null default now()
);

create table if not exists public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) >= 2),
  course_program text not null check (char_length(trim(course_program)) >= 2),
  year_level_section text not null check (char_length(trim(year_level_section)) >= 1),
  contact_number text,
  email text not null check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  birthday date,
  organization public.ministry_role not null,
  facebook_profile text,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 120),
  body_html text not null check (char_length(trim(body_html)) between 1 and 20000),
  kind public.post_kind not null,
  ministry public.ministry_role not null,
  image_path text,
  published_by uuid not null references auth.users(id) on delete restrict,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((kind = 'photo' and image_path is not null) or kind <> 'photo')
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_role public.ministry_role not null,
  type text not null check (type in ('membership_application', 'system')),
  title text not null,
  message text not null,
  application_id uuid references public.membership_applications(id) on delete cascade,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists membership_applications_newest_idx on public.membership_applications (created_at desc);
create index if not exists membership_applications_organization_newest_idx on public.membership_applications (organization, created_at desc);
create index if not exists posts_public_feed_idx on public.posts (published_at desc) where published_at is not null;
create index if not exists posts_ministry_newest_idx on public.posts (ministry, published_at desc);
create index if not exists notifications_recipient_unread_idx on public.notifications (recipient_role, read_at, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at before update on public.posts
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists auth_user_profile on auth.users;
create trigger auth_user_profile after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.current_ministry_role()
returns public.ministry_role language sql stable security definer set search_path = public as $$
  select ministry_role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_ministry_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select auth.uid() is not null and public.current_ministry_role() is not null
$$;

create or replace function public.notify_for_membership_application()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.notifications (recipient_role, type, title, message, application_id)
  values (
    new.organization,
    'membership_application',
    'New membership application',
    new.full_name || ' submitted an application for ' || new.organization || '.',
    new.id
  );
  return new;
end;
$$;

drop trigger if exists membership_application_notification on public.membership_applications;
create trigger membership_application_notification after insert on public.membership_applications
for each row execute function public.notify_for_membership_application();

do $$ begin
  alter publication supabase_realtime add table public.notifications;
exception when duplicate_object then null;
end $$;

-- This view is the canonical public feed query. Photo posts auto-hide after 30 days;
-- announcements and articles remain visible indefinitely.
create or replace view public.live_posts with (security_invoker = true) as
  select * from public.posts
  where published_at is not null
    and (kind <> 'photo' or created_at >= now() - interval '30 days');

alter table public.profiles enable row level security;
alter table public.membership_applications enable row level security;
alter table public.posts enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "Profiles are readable by their owner" on public.profiles;
create policy "Profiles are readable by their owner" on public.profiles
for select to authenticated using (id = auth.uid());

drop policy if exists "Anyone can submit a membership application" on public.membership_applications;
create policy "Anyone can submit a membership application" on public.membership_applications
for insert to anon, authenticated with check (true);

drop policy if exists "Admins read their ministry applications" on public.membership_applications;
create policy "Admins read their ministry applications" on public.membership_applications
for select to authenticated using (organization = public.current_ministry_role());

drop policy if exists "Admins update their ministry applications" on public.membership_applications;
create policy "Admins update their ministry applications" on public.membership_applications
for update to authenticated using (organization = public.current_ministry_role())
with check (organization = public.current_ministry_role());

drop policy if exists "Visitors read live published posts" on public.posts;
create policy "Visitors read live published posts" on public.posts
for select to anon, authenticated using (
  published_at is not null and (kind <> 'photo' or created_at >= now() - interval '30 days')
);

drop policy if exists "Admins create posts for their ministry" on public.posts;
create policy "Admins create posts for their ministry" on public.posts
for insert to authenticated with check (
  public.is_ministry_admin() and ministry = public.current_ministry_role() and published_by = auth.uid()
);

drop policy if exists "Admins update their ministry posts" on public.posts;
create policy "Admins update their ministry posts" on public.posts
for update to authenticated using (ministry = public.current_ministry_role())
with check (ministry = public.current_ministry_role() and published_by = auth.uid());

drop policy if exists "Admins delete their ministry posts" on public.posts;
create policy "Admins delete their ministry posts" on public.posts
for delete to authenticated using (ministry = public.current_ministry_role());

drop policy if exists "Admins read their notifications" on public.notifications;
create policy "Admins read their notifications" on public.notifications
for select to authenticated using (recipient_role = public.current_ministry_role());

drop policy if exists "Admins mark their notifications read" on public.notifications;
create policy "Admins mark their notifications read" on public.notifications
for update to authenticated using (recipient_role = public.current_ministry_role())
with check (recipient_role = public.current_ministry_role());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('ministry-media', 'ministry-media', false, 31457280, array['image/png', 'image/jpeg'])
on conflict (id) do update set
  public = false,
  file_size_limit = 31457280,
  allowed_mime_types = array['image/png', 'image/jpeg'];

drop policy if exists "Visitors read media for live posts" on storage.objects;
create policy "Visitors read media for live posts" on storage.objects
for select to anon, authenticated using (
  bucket_id = 'ministry-media' and exists (
    select 1 from public.posts
    where posts.image_path = storage.objects.name
      and posts.published_at is not null
      and (posts.kind <> 'photo' or posts.created_at >= now() - interval '30 days')
  )
);

drop policy if exists "Admins upload media for their ministry" on storage.objects;
create policy "Admins upload media for their ministry" on storage.objects
for insert to authenticated with check (
  bucket_id = 'ministry-media'
  and public.is_ministry_admin()
  and (storage.foldername(name))[1] = public.current_ministry_role()::text
);

drop policy if exists "Admins update their ministry media" on storage.objects;
create policy "Admins update their ministry media" on storage.objects
for update to authenticated using (
  bucket_id = 'ministry-media'
  and (storage.foldername(name))[1] = public.current_ministry_role()::text
);

drop policy if exists "Admins remove their ministry media" on storage.objects;
create policy "Admins remove their ministry media" on storage.objects
for delete to authenticated using (
  bucket_id = 'ministry-media'
  and (storage.foldername(name))[1] = public.current_ministry_role()::text
);

-- After creating a user in Supabase Auth, grant its ministry role from the SQL editor:
-- update public.profiles set ministry_role = 'BEC' where id = '<auth-user-uuid>';
