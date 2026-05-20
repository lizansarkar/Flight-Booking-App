"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { submitBookingAction } from "@/app/booking/actions";
import { rehydrateBookingStore, useBookingStore } from "@/stores/use-booking-store";

const inputClass =
  "h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none ring-0 placeholder:text-foreground/40 focus:border-sky-500 dark:border-white/10 dark:bg-black/20";

function formatDepart(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function BookingCheckoutForm() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [fullName, setFullName] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedFlight = useBookingStore((s) => s.selectedFlight);
  const selectedSeat = useBookingStore((s) => s.selectedSeat);
  const passenger = useBookingStore((s) => s.passenger);
  const updatePassenger = useBookingStore((s) => s.updatePassenger);
  const resetBooking = useBookingStore((s) => s.resetBooking);

  useEffect(() => {
    rehydrateBookingStore();
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setFullName(passenger?.full_name ?? "");
    setPassportNumber(passenger?.passport_number ?? "");
  }, [hydrated, passenger?.full_name, passenger?.passport_number]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!selectedFlight) {
      setError("Select a flight first (use Search, then set a flight in Booking demo or wire search → store).");
      return;
    }

    setLoading(true);
    try {
      const result = await submitBookingAction({
        flightId: selectedFlight.id,
        seatId: selectedSeat?.id ?? null,
        fullName,
        passportNumber,
        totalPrice: Number(selectedFlight.base_price),
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      updatePassenger({ full_name: fullName, passport_number: passportNumber });
      resetBooking();
      router.push(
        `/booking/confirmation?bookingId=${encodeURIComponent(result.bookingId)}&pnr=${encodeURIComponent(result.pnr)}`,
      );
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated) {
    return <p className="text-sm text-foreground/60">Loading booking details…</p>;
  }

  if (!selectedFlight) {
    return (
      <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
        <p>No flight selected. Search for flights, then pick one for checkout.</p>
        <div className="flex flex-wrap gap-3">
          <Link
            className="font-medium text-sky-800 underline dark:text-sky-300"
            href="/search"
          >
            Search flights
          </Link>
          <Link
            className="font-medium text-sky-800 underline dark:text-sky-300"
            href="/booking"
          >
            Booking demo (set test flight)
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-black/10 bg-zinc-50 p-4 text-sm dark:border-white/10 dark:bg-black/20">
        <p className="font-semibold">
          {selectedFlight.flight_number}: {selectedFlight.origin} →{" "}
          {selectedFlight.destination}
        </p>
        <p className="mt-1 text-foreground/70">
          Departs {formatDepart(selectedFlight.depart_at)}
        </p>
        {selectedSeat ? (
          <p className="mt-1 text-foreground/70">Seat {selectedSeat.seat_number}</p>
        ) : (
          <p className="mt-1 text-foreground/60">No seat selected</p>
        )}
        <p className="mt-2 font-medium">
          Total: ${Number(selectedFlight.base_price).toFixed(2)}
        </p>
      </div>

      <form className="grid gap-4" onSubmit={onSubmit}>
        <label className="grid gap-1">
          <span className="text-sm font-medium">Passenger name</span>
          <input
            autoComplete="name"
            className={inputClass}
            name="fullName"
            onChange={(e) => {
              setFullName(e.target.value);
              updatePassenger({ full_name: e.target.value });
            }}
            placeholder="Jane Doe"
            required
            value={fullName}
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium">Passport number</span>
          <input
            autoComplete="off"
            className={inputClass}
            name="passportNumber"
            onChange={(e) => {
              setPassportNumber(e.target.value);
              updatePassenger({ passport_number: e.target.value });
            }}
            placeholder="AB1234567"
            required
            value={passportNumber}
          />
        </label>

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        <p className="text-xs text-foreground/60">
          You must be signed in. Booking is saved to Supabase with a generated PNR.
        </p>

        <button
          className="inline-flex h-11 items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-70"
          disabled={loading}
          type="submit"
        >
          {loading ? "Booking…" : "Confirm booking"}
        </button>
      </form>
    </div>
  );
}
