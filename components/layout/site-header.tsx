"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createBrowserClientSafe } from "@/lib/supabase/safe-browser";
import { SignOutButton } from "@/components/auth/sign-out-button";

export function SiteHeader() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(!isSupabaseConfigured());

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createBrowserClientSafe();
    if (!supabase) return;

    const applyUser = (userEmail: string | null) => {
      setEmail(userEmail);
      setReady(true);
    };

    supabase.auth.getUser().then(({ data }) => {
      applyUser(data.user?.email ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      applyUser(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="border-b border-black/10 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/30">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link className="flex items-center gap-2" href="/">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-sky-600 text-sm font-semibold text-white">
            SB
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-foreground">SkyBooker</div>
            <div className="text-xs text-foreground/70">Flight booking</div>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-3 text-sm text-foreground/80 sm:gap-4">
          <Link className="hover:text-foreground" href="/search">
            Search
          </Link>
          <Link className="hover:text-foreground" href="/dashboard">
            My trips
          </Link>
          {ready && email ? (
            <>
              <span className="hidden max-w-[140px] truncate text-xs text-foreground/60 sm:inline">
                {email}
              </span>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link className="hover:text-foreground" href="/login">
                Sign in
              </Link>
              <Link className="hover:text-foreground" href="/signup">
                Sign up
              </Link>
            </>
          )}
          <Link
            className="rounded-full bg-foreground px-4 py-2 text-background hover:bg-foreground/90"
            href="/search"
          >
            Search flights
          </Link>
        </nav>
      </div>
    </header>
  );
}
