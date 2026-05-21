"use client";

import { useRouter } from "next/navigation";
import { usePersistHydrated } from "@/hooks/use-persist-hydrated";
import { useBookingStore } from "@/stores/use-booking-store";
import type { FlightRow } from "@/types/flight";

type SelectFlightButtonProps = {
  flight: FlightRow;
};

export function SelectFlightButton({ flight }: SelectFlightButtonProps) {
  const router = useRouter();
  const ready = usePersistHydrated();
  const setSelectedFlight = useBookingStore((s) => s.setSelectedFlight);
  const setSelectedSeat = useBookingStore((s) => s.setSelectedSeat);

  function onSelect() {
    setSelectedFlight(flight);
    setSelectedSeat(null);
    router.push("/booking/checkout");
  }

  return (
    <button
      className="inline-flex h-9 items-center justify-center rounded-lg bg-sky-600 px-4 text-xs font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
      disabled={!ready}
      onClick={onSelect}
      type="button"
    >
      Book
    </button>
  );
}
