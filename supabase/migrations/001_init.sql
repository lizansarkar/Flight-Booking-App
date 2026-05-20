-- Simple schema for a flight booking app (Supabase Postgres)
-- Paste into Supabase Dashboard → SQL Editor → Run

create extension if not exists "pgcrypto";

-- FLIGHTS (public read; no RLS needed for this simple starter)
create table if not exists public.flights (
  id uuid primary key default gen_random_uuid(),
  flight_number text not null,
  origin text not null,
  destination text not null,
  depart_at timestamptz not null,
  arrive_at timestamptz,
  base_price numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

-- SEATS (simple seat inventory per flight)
create table if not exists public.seats (
  id uuid primary key default gen_random_uuid(),
  flight_id uuid not null references public.flights(id) on delete cascade,
  seat_number text not null,
  cabin_class text not null default 'economy',
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  unique (flight_id, seat_number)
);

-- BOOKINGS (owned by auth.users)
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  flight_id uuid not null references public.flights(id) on delete restrict,
  seat_id uuid references public.seats(id) on delete set null,
  status text not null default 'pending',
  total_price numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists bookings_user_id_idx on public.bookings(user_id);
create index if not exists bookings_flight_id_idx on public.bookings(flight_id);

-- PASSENGERS (belong to a booking)
create table if not exists public.passengers (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  full_name text not null,
  dob date,
  passport_number text,
  created_at timestamptz not null default now()
);

create index if not exists passengers_booking_id_idx on public.passengers(booking_id);

-- ------------------------------------------------------------
-- RLS: users can only read/write their own bookings (and passengers)
-- ------------------------------------------------------------

alter table public.bookings enable row level security;
alter table public.passengers enable row level security;

-- BOOKINGS policies
drop policy if exists "bookings_select_own" on public.bookings;
create policy "bookings_select_own"
on public.bookings
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "bookings_insert_own" on public.bookings;
create policy "bookings_insert_own"
on public.bookings
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "bookings_update_own" on public.bookings;
create policy "bookings_update_own"
on public.bookings
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "bookings_delete_own" on public.bookings;
create policy "bookings_delete_own"
on public.bookings
for delete
to authenticated
using (auth.uid() = user_id);

-- PASSENGERS policies (must belong to a booking owned by the user)
drop policy if exists "passengers_select_own_booking" on public.passengers;
create policy "passengers_select_own_booking"
on public.passengers
for select
to authenticated
using (
  exists (
    select 1
    from public.bookings b
    where b.id = passengers.booking_id
      and b.user_id = auth.uid()
  )
);

drop policy if exists "passengers_insert_own_booking" on public.passengers;
create policy "passengers_insert_own_booking"
on public.passengers
for insert
to authenticated
with check (
  exists (
    select 1
    from public.bookings b
    where b.id = passengers.booking_id
      and b.user_id = auth.uid()
  )
);

drop policy if exists "passengers_update_own_booking" on public.passengers;
create policy "passengers_update_own_booking"
on public.passengers
for update
to authenticated
using (
  exists (
    select 1
    from public.bookings b
    where b.id = passengers.booking_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.bookings b
    where b.id = passengers.booking_id
      and b.user_id = auth.uid()
  )
);

drop policy if exists "passengers_delete_own_booking" on public.passengers;
create policy "passengers_delete_own_booking"
on public.passengers
for delete
to authenticated
using (
  exists (
    select 1
    from public.bookings b
    where b.id = passengers.booking_id
      and b.user_id = auth.uid()
  )
);

