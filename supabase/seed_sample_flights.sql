-- Optional sample rows for local / dashboard testing (run in SQL Editor after `001_init.sql`).
-- Adjust `depart_at` to dates around when you test the /search page.

insert into public.flights (flight_number, origin, destination, depart_at, arrive_at, base_price)
values
  ('SB101', 'DAC', 'DXB', (now() at time zone 'utc') + interval '7 days', (now() at time zone 'utc') + interval '7 days' + interval '5 hours', 420.00),
  ('SB102', 'DAC', 'DXB', (now() at time zone 'utc') + interval '8 days', (now() at time zone 'utc') + interval '8 days' + interval '5 hours', 395.00),
  ('SB201', 'Dhaka', 'Dubai', (now() at time zone 'utc') + interval '14 days', (now() at time zone 'utc') + interval '14 days' + interval '5 hours 10 minutes', 450.00);
