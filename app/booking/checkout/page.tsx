import Link from "next/link";
import { redirect } from "next/navigation";

import { BookingCheckoutForm } from "@/components/booking/booking-checkout-form";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function BookingCheckoutPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">Checkout</h1>
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
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/booking/checkout");
  }

  return (
    <div className="bg-zinc-50 font-sans text-foreground dark:bg-black">
      <div className="mx-auto w-full max-w-lg px-6 py-10 sm:py-14">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Passenger details</h1>
          <p className="text-sm text-foreground/70">
            Enter name and passport to complete your booking.
          </p>
        </div>

        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <BookingCheckoutForm />
        </section>

        <p className="mt-8 text-center text-sm text-foreground/50">
          <Link className="text-sky-700 underline dark:text-sky-400" href="/search">
            ← Back to search
          </Link>
        </p>
      </div>
    </div>
  );
}
