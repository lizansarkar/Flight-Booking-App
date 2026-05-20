/** Row shape for `public.flights` (see `supabase/migrations/001_init.sql`). */
export type FlightRow = {
  id: string;
  flight_number: string;
  origin: string;
  destination: string;
  depart_at: string;
  arrive_at: string | null;
  base_price: number;
  created_at: string;
};
