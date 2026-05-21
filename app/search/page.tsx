import Link from "next/link";

import { SelectFlightButton } from "@/components/booking/select-flight-button";
import { searchFlights } from "@/services/flights";

// Kept your layout intact, just upgraded to glassmorphism with explicit cursor pointer
const inputClass =
  "h-11 w-full rounded-xl border border-black/10 bg-white/80 px-3 text-sm outline-none ring-0 placeholder:text-foreground/40 focus:border-sky-500 dark:border-white/10 dark:bg-zinc-900/80 dark:text-white cursor-pointer";

function formatDepart(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

type SearchPageProps = {
  searchParams: Promise<{ origin?: string; destination?: string; date?: string }>;
};

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = await searchParams;
  const originQ = q.origin ?? "";
  const destinationQ = q.destination ?? "";
  const dateQ = q.date ?? "";

  const hasQuery = Boolean(
    originQ.trim() && destinationQ.trim() && dateQ.trim(),
  );

  const { flights, error } = hasQuery
    ? await searchFlights({
        origin: originQ,
        destination: destinationQ,
        date: dateQ,
      })
    : { flights: [], error: null as string | null };

  return (
    <>
      {/* Pure CSS Injection for the header-like continuous shine effect */}
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

      {/* Main Container - Kept your exact wrapping layout, just removed solid background */}
      <div className="font-sans text-foreground">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-14">
          
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-white dark:text-white">Search flights</h1>
            <p className="max-w-prose text-sm text-white">
              Enter origin, destination, and departure date. Results load from your{" "}
              <code className="rounded border border-black/5 bg-white/50 px-1 py-0.5 text-xs font-semibold dark:border-white/5 dark:bg-white/10">
                flights
              </code>{" "}
              table in Supabase.
            </p>
          </div>

          {/* Form Panel - Upgraded to matching Glassmorphic Card */}
          <section className="rounded-2xl border border-white/30 bg-white/50 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/30">
            <form action="/search" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" method="get">
              <label className="grid gap-1 sm:col-span-1">
                <span className="text-sm font-medium">Origin</span>
                <input
                  className={inputClass}
                  defaultValue={originQ}
                  name="origin"
                  placeholder="DAC or Dhaka"
                  type="text"
                />
              </label>
              <label className="grid gap-1 sm:col-span-1">
                <span className="text-sm font-medium">Destination</span>
                <input
                  className={inputClass}
                  defaultValue={destinationQ}
                  name="destination"
                  placeholder="DXB or Dubai"
                  type="text"
                />
              </label>
              <label className="grid gap-1 sm:col-span-2 lg:col-span-1">
                <span className="text-sm font-medium">Date</span>
                <input className={inputClass} defaultValue={dateQ} name="date" required type="date" />
              </label>
              <div className="flex items-end sm:col-span-2 lg:col-span-1">
                {/* Search Button with Header Shine Effect */}
                <button
                  className="animate-shine inline-flex h-11 w-full items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white hover:bg-sky-700 transition-all active:scale-98 cursor-pointer"
                  type="submit"
                >
                  Search
                </button>
              </div>
            </form>
          </section>

          {error ? (
            <div
              className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 backdrop-blur-md dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          {hasQuery && !error ? (
            <div className="mt-10">
              <h2 className="text-lg font-semibold">
                Results{" "}
                <span className="font-normal text-foreground/60">
                  ({flights.length} flight{flights.length === 1 ? "" : "s"})
                </span>
              </h2>

              {flights.length === 0 ? (
                <p className="mt-4 rounded-xl border border-white/30 bg-white/40 px-4 py-8 text-center text-sm text-foreground/70 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                  No flights match. Try different text or date, or insert rows in Supabase{" "}
                  <span className="font-mono text-xs bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded">public.flights</span>.
                </p>
              ) : (
                <ul className="mt-4 grid gap-3">
                  {flights.map((f) => (
                    // Flight list item glassmorphism card
                    <li
                      key={f.id}
                      className="flex flex-col gap-3 rounded-xl border border-white/30 bg-white/50 p-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-black/20"
                    >
                      <div>
                        <p className="font-mono text-sm font-semibold text-sky-700 dark:text-sky-400">
                          {f.flight_number}
                        </p>
                        <p className="mt-1 text-base font-medium">
                          {f.origin} → {f.destination}
                        </p>
                        <p className="mt-1 text-sm text-foreground/70">
                          Departs {formatDepart(f.depart_at)}
                          {f.arrive_at ? ` · Arrives ${formatDepart(f.arrive_at)}` : null}
                        </p>
                      </div>
                      <div className="flex flex-col items-start gap-2 sm:items-end">
                        <div className="text-left sm:text-right">
                          <p className="text-lg font-semibold">
                            {formatPrice(Number(f.base_price))}
                          </p>
                          <p className="text-xs text-foreground/60">from</p>
                        </div>
                        {/* Interactive action element wrapper */}
                        <div className="cursor-pointer">
                          <SelectFlightButton flight={f} />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="mt-8 text-center text-sm text-foreground/60">
              Fill the form and click <strong>Search</strong> to query Supabase.
            </p>
          )}

          <p className="mt-10 text-center text-sm text-foreground/50">
            <Link className="text-sky-700 underline hover:no-underline cursor-pointer dark:text-sky-400" href="/">
              ← Back home
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}