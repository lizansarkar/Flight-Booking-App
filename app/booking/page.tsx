import Link from "next/link";

import { BookingStorePanel } from "@/components/booking/booking-store-panel";

export const dynamic = "force-dynamic";

/** Main booking flow lives at checkout; this page is for store testing. */
export default function BookingPage() {
  return (
    <div className="bg-zinc-50 font-sans text-foreground dark:bg-black">
      <div className="mx-auto w-full max-w-3xl px-6 py-10 sm:py-14">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Booking</h1>
          <p className="text-sm text-foreground/70">
            For a real booking: <strong>Search</strong> → <strong>Book</strong>{" "}
            → <strong>Checkout</strong>. This page tests the Zustand store only.
          </p>
        </div>

        <p className="mb-6">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-xl bg-sky-600 px-6 text-sm font-semibold text-white hover:bg-sky-700"
            href="/booking/checkout"
          >
            Go to checkout
          </Link>
        </p>

        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <BookingStorePanel />
        </section>

        <p className="mt-8 text-center text-sm text-foreground/50">
          <Link
            className="text-sky-700 underline dark:text-sky-400"
            href="/search"
          >
            ← Flight search
          </Link>
        </p>
      </div>
    </div>
  );
}
