import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { getUserBookings } from "@/services/user-bookings";

export const dynamic = "force-dynamic";

function formatDepart(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">My trips</h1>
        <p className="mt-4 text-sm text-foreground/70">
          Configure Supabase in <code className="text-xs">.env.local</code> first.
        </p>
        <Link className="mt-6 inline-block text-sm text-sky-700 underline" href="/">
          Home
        </Link>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login?next=/dashboard");
  }

  const { bookings, error: bookingsError } = await getUserBookings();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My trips</h1>
          <p className="mt-2 text-sm text-foreground/70">
            Signed in as <span className="font-medium">{user.email}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex h-10 items-center justify-center rounded-full bg-sky-600 px-4 text-sm font-semibold text-white hover:bg-sky-700"
            href="/search"
          >
            Book a flight
          </Link>
          <SignOutButton />
        </div>
      </div>

      {bookingsError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {bookingsError}
        </p>
      ) : null}

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
          <p className="text-foreground/70">No bookings yet.</p>
          <Link
            className="mt-4 inline-flex text-sm font-medium text-sky-700 underline dark:text-sky-400"
            href="/search"
          >
            Search flights
          </Link>
        </div>
      ) : (
        <ul className="grid gap-3">
          {bookings.map((b) => (
            <li
              key={b.id}
              className="flex flex-col gap-2 rounded-xl border border-black/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/5"
            >
              <div>
                <p className="font-mono text-sm font-bold text-sky-700 dark:text-sky-400">
                  {b.pnr ?? "—"}
                </p>
                <p className="mt-1 font-medium">
                  {b.flight_number}: {b.origin} → {b.destination}
                </p>
                <p className="text-sm text-foreground/70">
                  {formatDepart(b.depart_at)} · {b.status}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-semibold">${b.total_price.toFixed(2)}</p>
                <Link
                  className="mt-2 inline-block text-xs font-medium text-sky-700 underline dark:text-sky-400"
                  href={`/booking/confirmation?bookingId=${encodeURIComponent(b.id)}${b.pnr ? `&pnr=${encodeURIComponent(b.pnr)}` : ""}`}
                >
                  View confirmation
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
