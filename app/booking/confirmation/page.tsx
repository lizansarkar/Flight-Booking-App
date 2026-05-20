import Link from "next/link";
import { redirect } from "next/navigation";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ConfirmationPageProps = {
  searchParams: Promise<{ bookingId?: string; pnr?: string }>;
};

function formatDepart(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function BookingConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const { bookingId, pnr: pnrFromUrl } = await searchParams;

  if (!bookingId) {
    redirect("/booking/checkout");
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">Booking confirmed</h1>
        {pnrFromUrl ? (
          <p className="mt-4 font-mono text-lg font-bold tracking-widest">{pnrFromUrl}</p>
        ) : null}
        <p className="mt-4 text-sm text-foreground/70">Supabase is not configured.</p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/booking/confirmation?bookingId=${encodeURIComponent(bookingId)}`);
  }

  const { data: booking, error } = await supabase
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
      ),
      passengers (
        full_name,
        passport_number
      ),
      seats (
        seat_number
      )
    `,
    )
    .eq("id", bookingId)
    .maybeSingle();

  if (error || !booking) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">Booking not found</h1>
        <p className="mt-4 text-sm text-foreground/70">
          {error?.message ?? "This booking may not exist or you do not have access."}
        </p>
        <Link className="mt-6 inline-block text-sky-700 underline" href="/booking/checkout">
          Try again
        </Link>
      </div>
    );
  }

  const flight = Array.isArray(booking.flights) ? booking.flights[0] : booking.flights;
  const passenger = Array.isArray(booking.passengers)
    ? booking.passengers[0]
    : booking.passengers;
  const seat = Array.isArray(booking.seats) ? booking.seats[0] : booking.seats;
  const pnr = booking.pnr ?? pnrFromUrl ?? "—";

  return (
    <div className="bg-zinc-50 font-sans text-foreground dark:bg-black">
      <div className="mx-auto w-full max-w-lg px-6 py-10 sm:py-14">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-2xl text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            ✓
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Booking confirmed</h1>
          <p className="mt-2 text-sm text-foreground/70">
            Your reservation has been saved. Use your PNR to look up this trip.
          </p>
        </div>

        <section className="rounded-2xl border border-black/10 bg-white p-6 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-medium uppercase tracking-wide text-foreground/60">
            Confirmation (PNR)
          </p>
          <p className="mt-2 font-mono text-3xl font-bold tracking-[0.2em] text-sky-700 dark:text-sky-400">
            {pnr}
          </p>
        </section>

        <section className="mt-6 space-y-3 rounded-2xl border border-black/10 bg-white p-6 text-sm shadow-sm dark:border-white/10 dark:bg-white/5">
          {flight ? (
            <>
              <p className="font-semibold">
                {flight.flight_number}: {flight.origin} → {flight.destination}
              </p>
              <p className="text-foreground/70">Departs {formatDepart(flight.depart_at)}</p>
            </>
          ) : null}
          {seat?.seat_number ? (
            <p className="text-foreground/70">Seat {seat.seat_number}</p>
          ) : null}
          {passenger ? (
            <p className="text-foreground/70">
              Passenger: {passenger.full_name}
              {passenger.passport_number
                ? ` · Passport ${passenger.passport_number}`
                : null}
            </p>
          ) : null}
          <p className="font-medium">
            Total paid: ${Number(booking.total_price).toFixed(2)}
          </p>
          <p className="text-xs text-foreground/50">
            Status: {booking.status} · Ref {booking.id.slice(0, 8)}…
          </p>
        </section>

        <div className="mt-8 flex flex-col items-center gap-3 text-sm">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 font-medium text-background hover:bg-foreground/90"
            href="/dashboard"
          >
            Go to dashboard
          </Link>
          <Link className="text-sky-700 underline dark:text-sky-400" href="/search">
            Book another flight
          </Link>
        </div>
      </div>
    </div>
  );
}
