-- Run in Supabase Dashboard > SQL Editor to enable blog posts
-- on a project that already has portfolio_content.
alter table public.portfolio_content
  drop constraint if exists portfolio_content_section_check;

alter table public.portfolio_content
  add constraint portfolio_content_section_check
  check (section in ('projects', 'experience', 'skills', 'services', 'contact', 'site', 'blogs'));
