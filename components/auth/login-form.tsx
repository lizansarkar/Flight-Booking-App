"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { createClient } from "@/lib/supabase/browser";

const inputClassName =
  "h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none ring-0 placeholder:text-foreground/40 focus:border-sky-500 dark:border-white/10 dark:bg-black/20";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      router.replace(nextUrl);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-foreground/70">
          Email and password authentication via Supabase.
        </p>
      </div>

      <form className="grid gap-4" onSubmit={onSubmit}>
        <label className="grid gap-1">
          <span className="text-sm font-medium">Email</span>
          <input
            autoComplete="email"
            className={inputClassName}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium">Password</span>
          <input
            autoComplete="current-password"
            className={inputClassName}
            name="password"
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            value={password}
          />
        </label>

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        <button
          className="inline-flex h-11 items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-70"
          disabled={loading}
          type="submit"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-foreground/70">
        No account yet?{" "}
        <Link className="font-medium text-sky-700 hover:underline" href="/signup">
          Sign up
        </Link>
      </p>
    </main>
  );
}
