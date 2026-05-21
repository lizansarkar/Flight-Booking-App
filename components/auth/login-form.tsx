"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { createClient } from "@/lib/supabase/browser";

const inputClassName =
  "h-11 w-full rounded-xl border border-white/20 bg-white/10 pl-3 pr-10 text-sm text-white outline-none ring-0 placeholder:text-white/40 focus:border-sky-500 focus:bg-white/20 transition-all cursor-pointer";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle visibility
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
    <>
      {/* Pure CSS Animation for the continuous shine effect on the sign-in button */}
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

      {/* Main Container Wrapper */}
      <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-16 text-white">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Sign in</h1>
          <p className="text-sm font-medium text-white/70">
            Email and password authentication via Supabase.
          </p>
        </div>

        {/* Form Container with Premium Glass Effect */}
        <form className="grid gap-4 rounded-3xl border border-white/20 bg-white/5 p-6 shadow-xl backdrop-blur-xl" onSubmit={onSubmit}>
          <label className="grid gap-1">
            <span className="text-sm font-semibold text-white/90">Email</span>
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
            <span className="text-sm font-semibold text-white/90">Password</span>
            {/* Relative container to absolute-position the eye button */}
            <div className="relative w-full">
              <input
                autoComplete="current-password"
                className={inputClassName}
                name="password"
                minLength={6}
                onChange={(e) => setPassword(e.target.value)}
                required
                type={showPassword ? "text" : "password"} // Dynamically changes type
                value={password}
              />
              
              {/* Eye Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors cursor-pointer p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye Slash (Hide) SVG Icon
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.822 7.822L21 21m-2.228-2.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  // Eye (Show) SVG Icon
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </label>

          {error ? (
            <p className="text-sm font-medium text-red-400" role="alert">
              {error}
            </p>
          ) : null}

          {/* Action Button with Continuous Shine effect applied */}
          <button
            className="animate-shine inline-flex h-11 items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-bold text-white shadow-md shadow-sky-600/20 hover:bg-sky-700 transition-all active:scale-98 disabled:opacity-70 cursor-pointer"
            disabled={loading}
            type="submit"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-sm font-medium text-white/70">
          No account yet?{" "}
          <Link className="font-bold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer" href="/signup">
            Sign up
          </Link>
        </p>
      </main>
    </>
  );
}