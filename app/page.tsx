import Link from "next/link";

export default function Home() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return (
    <div className="bg-zinc-50 font-sans text-foreground dark:bg-black">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-foreground/80 shadow-sm dark:border-white/10 dark:bg-white/5">
              Next.js · Supabase · Zustand
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Find and book your next flight.
            </h1>
            <p className="max-w-prose text-pretty text-base leading-7 text-foreground/70">
              Search flights, sign in, enter passenger details, and get a confirmation PNR — a
              complete demo booking flow for your internship project.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background hover:bg-foreground/90"
                href="/search"
              >
                Search flights
              </Link>
              <Link
                className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                href="/signup"
              >
                Create account
              </Link>
            </div>
          </div>

          <section
            id="search"
            className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <h2 className="text-lg font-semibold">Quick search</h2>
            <p className="mt-1 text-sm text-foreground/70">
              Goes to the live search page powered by Supabase.
            </p>

            <form action="/search" className="mt-6 grid gap-4 sm:grid-cols-2" method="get">
              <label className="grid gap-1">
                <span className="text-sm font-medium">From</span>
                <input
                  className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-sky-500 dark:border-white/10 dark:bg-black/20"
                  defaultValue="DAC"
                  name="origin"
                  placeholder="DAC"
                  required
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">To</span>
                <input
                  className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-sky-500 dark:border-white/10 dark:bg-black/20"
                  defaultValue="DXB"
                  name="destination"
                  placeholder="DXB"
                  required
                />
              </label>
              <label className="grid gap-1 sm:col-span-2">
                <span className="text-sm font-medium">Depart</span>
                <input
                  className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-sky-500 dark:border-white/10 dark:bg-black/20"
                  defaultValue={weekLater}
                  min={today}
                  name="date"
                  required
                  type="date"
                />
              </label>

              <div className="sm:col-span-2">
                <button
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white hover:bg-sky-700"
                  type="submit"
                >
                  Search
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
