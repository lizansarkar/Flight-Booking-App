"use client";

import { useCallback, useState } from "react";

export type SeatMapSeat = {
  id: string;
  /** Short label shown in the cell, e.g. "12A" */
  label: string;
  occupied?: boolean;
};

export type SeatMapProps = {
  seats: SeatMapSeat[];
  /** Number of columns in the grid (default 6). */
  columns?: number;
  /**
   * Controlled selection. When this prop is passed (including `null`), the parent
   * owns selection and should update it from `onSelectSeat`.
   */
  selectedSeatId?: string | null;
  onSelectSeat?: (seatId: string | null) => void;
  /** Optional heading for accessibility / layout. */
  title?: string;
};

export function SeatMap({
  seats,
  columns = 6,
  selectedSeatId: controlledSelected,
  onSelectSeat,
  title = "Seat map",
}: SeatMapProps) {
  const [internalSelected, setInternalSelected] = useState<string | null>(null);

  const isControlled = controlledSelected !== undefined;
  const selectedSeatId = isControlled ? controlledSelected : internalSelected;

  const setSelected = useCallback(
    (next: string | null) => {
      if (!isControlled) {
        setInternalSelected(next);
      }
      onSelectSeat?.(next);
    },
    [isControlled, onSelectSeat],
  );

  const handleSeatClick = (seat: SeatMapSeat) => {
    if (seat.occupied) return;
    const next = selectedSeatId === seat.id ? null : seat.id;
    setSelected(next);
  };

  return (
    <div className="w-full max-w-3xl space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/70">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-6 rounded border border-black/15 bg-white dark:border-white/20 dark:bg-white/5" />
            Available
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-6 rounded border border-black/10 bg-zinc-200 dark:bg-zinc-700" />
            Occupied
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-6 rounded border-2 border-sky-600 bg-sky-100 dark:bg-sky-950/60" />
            Selected
          </span>
        </div>
      </div>

      <div
        className="grid gap-2"
        role="group"
        aria-label={title}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {seats.map((seat) => {
          const occupied = Boolean(seat.occupied);
          const selected = !occupied && selectedSeatId === seat.id;

          return (
            <button
              key={seat.id}
              type="button"
              disabled={occupied}
              aria-pressed={selected}
              aria-disabled={occupied}
              onClick={() => handleSeatClick(seat)}
              className={[
                "relative flex h-11 min-w-0 items-center justify-center rounded-lg border text-xs font-semibold transition-colors",
                occupied
                  ? "cursor-not-allowed border-black/10 bg-zinc-200 text-zinc-500 line-through dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-500"
                  : selected
                    ? "z-10 border-2 border-sky-600 bg-sky-100 text-sky-900 shadow-sm ring-2 ring-sky-400/40 dark:border-sky-500 dark:bg-sky-950/50 dark:text-sky-100 dark:ring-sky-500/30"
                    : "cursor-pointer border-black/15 bg-white text-foreground hover:border-sky-500/60 hover:bg-sky-50/80 dark:border-white/20 dark:bg-white/5 dark:hover:border-sky-400/50 dark:hover:bg-sky-950/30",
              ].join(" ")}
            >
              {seat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
