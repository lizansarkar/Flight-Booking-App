"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  BookingPersistedState,
  PassengerData,
  SelectedSeat,
} from "@/types/booking";
import type { FlightRow } from "@/types/flight";

const STORAGE_KEY = "skybooker-booking";

const emptyPassenger = (): PassengerData => ({
  full_name: "",
  dob: null,
  passport_number: null,
});

type BookingState = {
  selectedFlight: FlightRow | null;
  selectedSeat: SelectedSeat | null;
  passenger: PassengerData | null;
};

type BookingActions = {
  setSelectedFlight: (flight: FlightRow | null) => void;
  setSelectedSeat: (seat: SelectedSeat | null) => void;
  setPassenger: (passenger: PassengerData | null) => void;
  updatePassenger: (patch: Partial<PassengerData>) => void;
  resetBooking: () => void;
};

const initialState: BookingState = {
  selectedFlight: null,
  selectedSeat: null,
  passenger: null,
};

function partializeForPersist(state: BookingState): BookingPersistedState {
  return {
    selectedFlight: state.selectedFlight,
    selectedSeat: state.selectedSeat,
    passenger: state.passenger
      ? {
          full_name: state.passenger.full_name,
          dob: state.passenger.dob,
        }
      : null,
  };
}

function mergeRehydratedPassenger(
  persisted: BookingPersistedState["passenger"],
): PassengerData | null {
  if (!persisted) return null;
  return {
    full_name: persisted.full_name,
    dob: persisted.dob,
    passport_number: null,
  };
}

export const useBookingStore = create<BookingState & BookingActions>()(
  persist(
    (set) => ({
      ...initialState,

      setSelectedFlight: (selectedFlight) => set({ selectedFlight }),

      setSelectedSeat: (selectedSeat) => set({ selectedSeat }),

      setPassenger: (passenger) => set({ passenger }),

      updatePassenger: (patch) =>
        set((state) => ({
          passenger: { ...(state.passenger ?? emptyPassenger()), ...patch },
        })),

      resetBooking: () => set(initialState),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => partializeForPersist(state),
      merge: (persisted, current) => {
        const p = persisted as BookingPersistedState;
        return {
          ...current,
          selectedFlight: p.selectedFlight ?? null,
          selectedSeat: p.selectedSeat ?? null,
          passenger: mergeRehydratedPassenger(p.passenger),
        };
      },
      skipHydration: true,
    },
  ),
);

/** Call once on the client so persisted state loads without SSR mismatch. */
export function rehydrateBookingStore(): void {
  void useBookingStore.persist.rehydrate();
}
