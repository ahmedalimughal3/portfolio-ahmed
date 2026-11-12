-- Run this file in Supabase Dashboard > SQL Editor.
-- Create/invite your Auth user first, then replace the email below and run
-- the final INSERT once to grant that user admin access.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_content (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('projects', 'experience', 'skills', 'services', 'contact', 'site', 'blogs')),
  slug text not null,
  title text not null,
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  sort_order integer not null default 0 check (sort_order between 0 and 10000),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (section, slug)
);

alter table public.portfolio_content
  drop constraint if exists portfolio_content_section_check;

alter table public.portfolio_content
  add constraint portfolio_content_section_check
  check (section in ('projects', 'experience', 'skills', 'services', 'contact', 'site', 'blogs'));

create index if not exists portfolio_content_published_order_idx
  on public.portfolio_content (section, published, sort_order);

alter table public.admin_users enable row level security;
alter table public.portfolio_content enable row level security;

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

grant select on public.admin_users to authenticated;
grant select on public.portfolio_content to anon, authenticated;
grant insert, update, delete on public.portfolio_content to authenticated;

drop policy if exists "Admins can read their own admin record" on public.admin_users;
create policy "Admins can read their own admin record"
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Anyone can read published portfolio content" on public.portfolio_content;
create policy "Anyone can read published portfolio content"
  on public.portfolio_content for select to anon, authenticated
  using (published or (select public.is_portfolio_admin()));

drop policy if exists "Admins can create portfolio content" on public.portfolio_content;
create policy "Admins can create portfolio content"
  on public.portfolio_content for insert to authenticated
  with check ((select public.is_portfolio_admin()));

drop policy if exists "Admins can update portfolio content" on public.portfolio_content;
create policy "Admins can update portfolio content"
  on public.portfolio_content for update to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

drop policy if exists "Admins can delete portfolio content" on public.portfolio_content;
create policy "Admins can delete portfolio content"
  on public.portfolio_content for delete to authenticated
  using ((select public.is_portfolio_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can view portfolio media" on storage.objects;
create policy "Anyone can view portfolio media"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'portfolio-media');

drop policy if exists "Admins can upload portfolio media" on storage.objects;
create policy "Admins can upload portfolio media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and (select public.is_portfolio_admin())
  );

drop policy if exists "Admins can remove portfolio media" on storage.objects;
create policy "Admins can remove portfolio media"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (select public.is_portfolio_admin())
  );

-- After creating/inviting your Supabase Auth user, replace the email below:
-- insert into public.admin_users (user_id)
-- select id from auth.users where email = 'you@example.com'
-- on conflict (user_id) do nothing;
