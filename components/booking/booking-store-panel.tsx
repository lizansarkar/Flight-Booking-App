"use client";

import { usePersistHydrated } from "@/hooks/use-persist-hydrated";
import { useBookingStore } from "@/stores/use-booking-store";
import type { FlightRow } from "@/types/flight";

const inputClass =
  "h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black/20";

const demoFlight: FlightRow = {
  id: "demo-flight-1",
  flight_number: "SB101",
  origin: "DAC",
  destination: "DXB",
  depart_at: new Date().toISOString(),
  arrive_at: null,
  base_price: 420,
  created_at: new Date().toISOString(),
};

export function BookingStorePanel() {
  const hydrated = usePersistHydrated();

  const selectedFlight = useBookingStore((s) => s.selectedFlight);
  const selectedSeat = useBookingStore((s) => s.selectedSeat);
  const passenger = useBookingStore((s) => s.passenger);
  const setSelectedFlight = useBookingStore((s) => s.setSelectedFlight);
  const setSelectedSeat = useBookingStore((s) => s.setSelectedSeat);
  const updatePassenger = useBookingStore((s) => s.updatePassenger);
  const resetBooking = useBookingStore((s) => s.resetBooking);

  if (!hydrated) {
    return (
      <p className="text-sm text-foreground/60">Loading booking state from storage…</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
          onClick={() => setSelectedFlight(demoFlight)}
          type="button"
        >
          Set demo flight
        </button>
        <button
          className="rounded-lg border border-black/15 px-3 py-2 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          onClick={() =>
            setSelectedSeat({ id: "seat-12a", seat_number: "12A", cabin_class: "economy" })
          }
          type="button"
        >
          Set seat 12A
        </button>
        <button
          className="rounded-lg border border-black/15 px-3 py-2 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          onClick={() => resetBooking()}
          type="button"
        >
          Reset store
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Full name</span>
          <input
            className={inputClass}
            onChange={(e) => updatePassenger({ full_name: e.target.value })}
            value={passenger?.full_name ?? ""}
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Date of birth</span>
          <input
            className={inputClass}
            onChange={(e) => updatePassenger({ dob: e.target.value || null })}
            type="date"
            value={passenger?.dob ?? ""}
          />
        </label>
        <label className="grid gap-1 text-sm sm:col-span-2">
          <span className="font-medium">
            Passport number{" "}
            <span className="font-normal text-foreground/60">(not saved to localStorage)</span>
          </span>
          <input
            className={inputClass}
            onChange={(e) =>
              updatePassenger({ passport_number: e.target.value || null })
            }
            placeholder="AB1234567"
            value={passenger?.passport_number ?? ""}
          />
        </label>
      </div>

      <div className="rounded-xl border border-black/10 bg-zinc-50 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/30">
        <p className="mb-2 font-sans text-sm font-semibold">Current Zustand state</p>
        <pre className="overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(
            { selectedFlight, selectedSeat, passenger },
            null,
            2,
          )}
        </pre>
        <p className="mt-3 font-sans text-xs text-foreground/60">
          Reload the page: name and DOB should return; passport should be empty after reload.
          Check DevTools → Application → Local Storage → key{" "}
          <code className="rounded bg-black/5 px-1 dark:bg-white/10">{`skybooker-booking`}</code>.
        </p>
      </div>
    </div>
  );
}
