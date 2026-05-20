"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { createClient } from "@/lib/supabase/browser";

const inputClassName =
  "h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none ring-0 placeholder:text-foreground/40 focus:border-sky-500 dark:border-white/10 dark:bg-black/20";

export function SignupForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.user && data.session) {
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      setInfo(
        "Check your email to confirm your account before signing in (unless email confirmation is disabled in Supabase).",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
        <p className="text-sm text-foreground/70">
          Choose an email and password. Your session is stored in HTTP-only cookies.
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
            autoComplete="new-password"
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

        {info ? (
          <p className="text-sm text-foreground/70" role="status">
            {info}
          </p>
        ) : null}

        <button
          className="inline-flex h-11 items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-70"
          disabled={loading}
          type="submit"
        >
          {loading ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <p className="text-sm text-foreground/70">
        Already registered?{" "}
        <Link className="font-medium text-sky-700 hover:underline" href="/login">
          Sign in
        </Link>
      </p>
    </main>
  );
}
