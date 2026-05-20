import type { FlightRow } from "@/types/flight";

/** Seat chosen in the UI (maps to `public.seats`). */
export type SelectedSeat = {
  id: string;
  seat_number: string;
  cabin_class?: string;
};

/** Traveler details for checkout (maps to `public.passengers`). */
export type PassengerData = {
  full_name: string;
  dob: string | null;
  /** Kept in memory only — excluded from persist `partialize`. */
  passport_number: string | null;
};

/** Shape written to localStorage for passenger (no passport). */
export type PersistedPassengerData = Omit<PassengerData, "passport_number">;

export type BookingPersistedState = {
  selectedFlight: FlightRow | null;
  selectedSeat: SelectedSeat | null;
  passenger: PersistedPassengerData | null;
};
