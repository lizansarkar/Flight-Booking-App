import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-zinc-50 font-sans text-foreground dark:bg-black">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-foreground/80 shadow-sm dark:border-white/10 dark:bg-white/5">
              App Router • TypeScript • Tailwind
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Find the best flight in minutes.
            </h1>
            <p className="max-w-prose text-pretty text-base leading-7 text-foreground/70">
              This starter is organized for a real booking flow: search, results,
              traveler details, and checkout—plus account and trips.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background hover:bg-foreground/90"
                href="/search"
              >
                Start a search
              </Link>
              <a
                className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                href="/docs"
              >
                Folder guide
              </a>
            </div>
          </div>

          <section
            id="search"
            className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <h2 className="text-lg font-semibold">Search flights</h2>
            <p className="mt-1 text-sm text-foreground/70">
              UI-only for now — wire to your API later via `services/`.
            </p>

            <form className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-sm font-medium">From</span>
                <input
                  className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none ring-0 placeholder:text-foreground/40 focus:border-sky-500 dark:border-white/10 dark:bg-black/20"
                  placeholder="DAC — Dhaka"
                  name="from"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">To</span>
                <input
                  className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none ring-0 placeholder:text-foreground/40 focus:border-sky-500 dark:border-white/10 dark:bg-black/20"
                  placeholder="DXB — Dubai"
                  name="to"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Depart</span>
                <input
                  className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none ring-0 focus:border-sky-500 dark:border-white/10 dark:bg-black/20"
                  type="date"
                  name="depart"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Passengers</span>
                <select
                  className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none ring-0 focus:border-sky-500 dark:border-white/10 dark:bg-black/20"
                  name="pax"
                  defaultValue="1"
                >
                  <option value="1">1 passenger</option>
                  <option value="2">2 passengers</option>
                  <option value="3">3 passengers</option>
                  <option value="4">4 passengers</option>
                  <option value="5">5 passengers</option>
                </select>
              </label>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white hover:bg-sky-700"
                >
                  Search (placeholder)
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
