-- Run this ONLY if flight search fails with "permission denied" or empty results
-- while rows exist in Table Editor (RLS blocking anon read).

-- Flights: allow read for search page
alter table public.flights enable row level security;

drop policy if exists "flights_select_public" on public.flights;
create policy "flights_select_public"
on public.flights
for select
to anon, authenticated
using (true);

-- Seats: allow read; allow authenticated to mark seat taken after booking
alter table public.seats enable row level security;

drop policy if exists "seats_select_public" on public.seats;
create policy "seats_select_public"
on public.seats
for select
to anon, authenticated
using (true);

drop policy if exists "seats_update_authenticated" on public.seats;
create policy "seats_update_authenticated"
on public.seats
for update
to authenticated
using (true)
with check (true);
