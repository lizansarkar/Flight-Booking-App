import Link from "next/link";

import { BookingStorePanel } from "@/components/booking/booking-store-panel";

export default function BookingPage() {
  return (
    <div className="bg-zinc-50 font-sans text-foreground dark:bg-black">
      <div className="mx-auto w-full max-w-3xl px-6 py-10 sm:py-14">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Booking store</h1>
          <p className="text-sm text-foreground/70">
            Zustand + <code className="text-xs">persist</code> with{" "}
            <code className="text-xs">partialize</code> (passport excluded from localStorage).
          </p>
        </div>

        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <BookingStorePanel />
        </section>

        <p className="mt-6 text-center">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-xl bg-sky-600 px-6 text-sm font-semibold text-white hover:bg-sky-700"
            href="/booking/checkout"
          >
            Go to checkout
          </Link>
        </p>

        <p className="mt-4 text-center text-sm text-foreground/50">
          <Link className="text-sky-700 underline hover:no-underline dark:text-sky-400" href="/search">
            ← Flight search
          </Link>
        </p>
      </div>
    </div>
  );
}
