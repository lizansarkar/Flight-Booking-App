-- Fake PNR stored on each booking for confirmation display
alter table public.bookings
  add column if not exists pnr text;

create unique index if not exists bookings_pnr_idx on public.bookings (pnr)
  where pnr is not null;
