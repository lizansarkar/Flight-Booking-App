import { createClient } from "@/lib/supabase/server";

export type UserBookingRow = {
  id: string;
  pnr: string | null;
  status: string;
  total_price: number;
  created_at: string;
  flight_number: string;
  origin: string;
  destination: string;
  depart_at: string;
};

export async function getUserBookings(): Promise<{
  bookings: UserBookingRow[];
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { bookings: [], error: "Not signed in." };
  }

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      id,
      pnr,
      status,
      total_price,
      created_at,
      flights (
        flight_number,
        origin,
        destination,
        depart_at
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { bookings: [], error: error.message };
  }

  const bookings: UserBookingRow[] = (data ?? []).flatMap((row) => {
    const flight = Array.isArray(row.flights) ? row.flights[0] : row.flights;
    if (!flight) return [];
    return [
      {
        id: row.id,
        pnr: row.pnr,
        status: row.status,
        total_price: Number(row.total_price),
        created_at: row.created_at,
        flight_number: flight.flight_number,
        origin: flight.origin,
        destination: flight.destination,
        depart_at: flight.depart_at,
      },
    ];
  });

  return { bookings, error: null };
}
