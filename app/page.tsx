import Link from "next/link";

export default function Home() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return (
    <>
      {/* Pure CSS Injection for the continuous shine effect on buttons */}
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

      {/* Kept your exact wrapping layout and text classes intact */}
      <div className="font-sans text-slate-900 dark:text-white flex-1 flex items-center">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-16">
          
          {/* Main Grid Layout - 12 columns preserved precisely */}
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            
            {/* Left Text Content Section */}
            <div className="space-y-6 lg:col-span-7">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/40 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-sky-300">
                Find Your Trip
              </p>
              <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-white">
                Find and book your next flight.
              </h1>
              <p className="max-w-prose text-pretty text-base leading-7 text-white font-medium dark:text-white/80">
                Search flights, sign in, enter passenger details, and get a confirmation PNR — a
                complete demo booking flow for your internship project.
              </p>

              {/* Action Buttons with Continuous Shine effect applied */}
              <div className="flex flex-col gap-3 sm:flex-row pt-2">
                <Link
                  className="animate-shine inline-flex h-11 items-center justify-center rounded-full bg-sky-600 px-6 text-sm font-semibold text-white shadow-md shadow-sky-600/20 hover:bg-sky-700 transition-all active:scale-98 cursor-pointer"
                  href="/search"
                >
                  Search flights
                </Link>
                <Link
                  className="animate-shine inline-flex h-11 items-center justify-center rounded-full border border-white/30 bg-white/40 px-6 text-sm font-semibold text-white shadow-sm backdrop-blur-md hover:bg-white/60 transition-all active:scale-98 cursor-pointer dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  href="/signup"
                >
                  Create account
                </Link>
              </div>
            </div>

            {/* Right Section: Form Card Container */}
            <section
              id="search"
              className="w-full rounded-3xl border border-white/30 bg-white/50 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/30 lg:col-span-5"
            >
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quick search</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-white/70">
                Goes to the live search page powered by Supabase.
              </p>

              <form action="/search" className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 w-full" method="get">
                
                {/* From Input Group */}
                <label className="flex flex-col gap-1 w-full">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/70">From</span>
                  <input
                    className="h-11 w-full rounded-xl border border-black/10 bg-white/80 px-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-sky-500 focus:bg-white dark:border-white/10 dark:bg-zinc-900/80 dark:text-white dark:focus:border-sky-500"
                    defaultValue="DAC"
                    name="origin"
                    placeholder="DAC"
                    required
                  />
                </label>

                {/* To Input Group */}
                <label className="flex flex-col gap-1 w-full">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/70">To</span>
                  <input
                    className="h-11 w-full rounded-xl border border-black/10 bg-white/80 px-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-sky-500 focus:bg-white dark:border-white/10 dark:bg-zinc-900/80 dark:text-white dark:focus:border-sky-500"
                    defaultValue="DXB"
                    name="destination"
                    placeholder="DXB"
                    required
                  />
                </label>

                {/* Depart Date Group */}
                <label className="flex flex-col gap-1 w-full sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/70">Depart</span>
                  <input
                    className="h-11 w-full rounded-xl border border-black/10 bg-white/80 px-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-sky-500 focus:bg-white dark:border-white/10 dark:bg-zinc-900/80 dark:text-white dark:focus:border-sky-500 cursor-pointer"
                    defaultValue={weekLater}
                    min={today}
                    name="date"
                    required
                    type="date"
                  />
                </label>

                {/* Submit Button Container with Continuous Shine effect applied */}
                <div className="sm:col-span-2 pt-2 w-full">
                  <button
                    className="animate-shine inline-flex h-11 w-full items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-bold text-white shadow-md shadow-sky-600/20 hover:bg-sky-700 transition-all active:scale-98 cursor-pointer"
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
    </>
  );
}