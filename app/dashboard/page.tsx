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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My trips</h1>
        <p className="mt-4 text-sm font-medium text-slate-700 dark:text-white/70">
          Configure Supabase in <code className="text-xs bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded">.env.local</code> first.
        </p>
        <Link className="mt-6 inline-block text-sm font-semibold text-sky-600 hover:text-sky-700 cursor-pointer dark:text-sky-400" href="/">
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
    <>
      {/* Reusable CSS Animation for the continuous shine effect on primary action buttons */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .animate-shine {
          position: relative;
          overflow: hidden;
        }
        .animate-shine::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
          animation: shine 3s infinite linear;
        }
      `}} />

      {/* Main Layout Container */}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 sm:py-14 text-slate-900 dark:text-white">
        
        {/* Top Profile / Action Header row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">My trips</h1>
            <p className="text-sm font-medium text-white dark:text-white/70">
              Signed in as <span className="font-bold text-sky-700 dark:text-sky-400">{user.email}</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            {/* Primary Action Button with Continuous Shine effect */}
            <Link
              className="animate-shine inline-flex h-10 items-center justify-center rounded-full bg-sky-600 px-5 text-sm font-bold text-white shadow-md shadow-sky-600/20 hover:bg-sky-700 transition-all active:scale-98 cursor-pointer"
              href="/search"
            >
              Book a flight
            </Link>
            
            {/* Ensured container handles SignOutButton with interactive cursor */}
            <div className="cursor-pointer text-white">
              <SignOutButton />
            </div>
          </div>
        </div>

        {/* Dynamic Error Message Box */}
        {bookingsError ? (
          <p className="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm font-medium text-red-800 backdrop-blur-md dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200 shadow-sm">
            {bookingsError}
          </p>
        ) : null}

        {/* Conditional Layout: Empty State vs Booking Records */}
        {bookings.length === 0 ? (
          <div className="rounded-3xl border border-white/30 bg-white/50 p-8 text-center shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/30">
            <p className="text-base font-medium text-slate-600 dark:text-white/70">No bookings yet.</p>
            <Link
              className="mt-4 inline-flex text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer dark:text-sky-400 dark:hover:text-sky-300"
              href="/search"
            >
              Search flights &rarr;
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 w-full">
            {bookings.map((b) => (
              // Glassmorphic Booking Item Row
              <li
                key={b.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/40 bg-white/60 p-5 shadow-md backdrop-blur-lg sm:flex-row sm:items-center sm:justify-between transition-all hover:border-sky-500/30 dark:border-white/10 dark:bg-black/20"
              >
                <div className="space-y-1">
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    PNR: {b.pnr ?? "—"}
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {b.flight_number}: <span className="font-semibold">{b.origin} → {b.destination}</span>
                  </p>
                  <p className="text-xs font-semibold text-slate-600 dark:text-white/60">
                    {formatDepart(b.depart_at)} · <span className="text-emerald-600 dark:text-emerald-400 uppercase tracking-wide text-[10px] font-bold">{b.status}</span>
                  </p>
                </div>
                
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <div className="text-left sm:text-right">
                    <p className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                      ${b.total_price.toFixed(2)}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40">Total Charged</p>
                  </div>
                  <Link
                    className="inline-block text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer dark:text-sky-400 dark:hover:text-sky-300"
                    href={`/booking/confirmation?bookingId=${encodeURIComponent(b.id)}${b.pnr ? `&pnr=${encodeURIComponent(b.pnr)}` : ""}`}
                  >
                    View confirmation &rarr;
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}