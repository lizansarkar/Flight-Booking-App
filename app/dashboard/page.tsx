import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-4 text-sm text-foreground/70">
          Configure Supabase in <code className="text-xs">.env.local</code> to use sign-in and
          protected pages.
        </p>
        <Link className="mt-6 inline-block text-sm font-medium text-sky-700 underline" href="/">
          ← Home
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

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-sm text-foreground/70">
            This route is protected. Only signed-in users should see it.
          </p>
        </div>
        <SignOutButton />
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <p className="text-sm font-medium text-foreground/80">Signed in as</p>
        <p className="mt-2 text-lg font-semibold">{user.email ?? user.id}</p>
        <p className="mt-4 max-w-prose text-sm text-foreground/70">
          Add booking history, profiles, or admin panels here under <code>/dashboard</code>
          guarded by middleware and this server-side check.
        </p>
      </div>
    </div>
  );
}
