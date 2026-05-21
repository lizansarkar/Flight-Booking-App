"use client";

import { useEffect, useState } from "react";

import { useBookingStore } from "@/stores/use-booking-store";

/** True after Zustand persist has rehydrated from localStorage. */
export function usePersistHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() =>
    useBookingStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsubFinish = useBookingStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    if (!useBookingStore.persist.hasHydrated()) {
      void useBookingStore.persist.rehydrate();
    }

    return unsubFinish;
  }, []);

  return hydrated;
}
