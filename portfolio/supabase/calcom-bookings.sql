-- Run this file in Supabase Dashboard > SQL Editor to enable Cal.com booking records.

create table if not exists public.calcom_bookings (
  booking_uid text primary key,
  attendee_name text not null,
  attendee_email text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null,
  event_title text not null,
  meeting_url text,
  notes text,
  status text not null default 'confirmed'
    check (status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists calcom_bookings_starts_at_idx
  on public.calcom_bookings (starts_at desc);

alter table public.calcom_bookings enable row level security;
grant select on public.calcom_bookings to authenticated;

drop policy if exists "Admins can read Cal.com bookings" on public.calcom_bookings;
create policy "Admins can read Cal.com bookings"
  on public.calcom_bookings for select to authenticated
  using ((select public.is_portfolio_admin()));
