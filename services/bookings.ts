import { generatePnr } from "@/lib/booking/generate-pnr";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeSeatId(seatId: string | null): string | null {
  if (!seatId || !UUID_RE.test(seatId)) return null;
  return seatId;
}

export type CreateBookingInput = {
  flightId: string;
  seatId: string | null;
  fullName: string;
  passportNumber: string;
  totalPrice: number;
};

export type CreateBookingResult =
  | { ok: true; bookingId: string; pnr: string }
  | { ok: false; error: string };

export async function createBooking(
  input: CreateBookingInput,
): Promise<CreateBookingResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error:
        "Supabase is not configured. Add credentials to .env.local and restart the dev server.",
    };
  }

  const fullName = input.fullName.trim();
  const passportNumber = input.passportNumber.trim();

  if (!fullName || !passportNumber) {
    return { ok: false, error: "Passenger name and passport number are required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, error: "You must be signed in to complete a booking." };
  }

  const pnr = generatePnr();
  const seatId = normalizeSeatId(input.seatId);

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      user_id: user.id,
      flight_id: input.flightId,
      seat_id: seatId,
      status: "confirmed",
      total_price: input.totalPrice,
      pnr,
    })
    .select("id, pnr")
    .single();

  if (bookingError || !booking) {
    return {
      ok: false,
      error: bookingError?.message ?? "Could not create booking.",
    };
  }

  const { error: passengerError } = await supabase.from("passengers").insert({
    booking_id: booking.id,
    full_name: fullName,
    passport_number: passportNumber,
  });

  if (passengerError) {
    await supabase.from("bookings").delete().eq("id", booking.id);
    return { ok: false, error: passengerError.message };
  }

  if (seatId) {
    await supabase.from("seats").update({ is_available: false }).eq("id", seatId);
  }

  return {
    ok: true,
    bookingId: booking.id,
    pnr: booking.pnr ?? pnr,
  };
}
