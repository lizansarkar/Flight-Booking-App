"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, User } from "lucide-react"; // Import icons for mobile menu and user profile

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createBrowserClientSafe } from "@/lib/supabase/safe-browser";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { usePathname } from "next/navigation"; // Hook to detect active route

export function SiteHeader() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(!isSupabaseConfigured());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // Get current pathname for active styling

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

  // Helper function to check if link is active
  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* CSS Animation for the continuous shine effect */}
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

      {/* Floating Glassmorphism Header */}
      <header className="fixed top-4 left-0 right-0 z-50 mx-auto w-[92%] max-w-6xl rounded-full border border-white/20 bg-white/40 shadow-lg backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-black/20">
        <div className="flex items-center justify-between px-6 py-3">
          
          {/* Logo Section - Replaced old SB box and text with a wide, professional inline SVG logo */}
          <Link className="flex items-center cursor-pointer group" href="/">
            <img src="/logo.png" alt="SkyBooker Logo" className="h-6 md:h-15 w-auto" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link 
              className={`transition-colors cursor-pointer ${isActive('/search') ? 'text-sky-400 dark:text-sky-400 font-semibold' : 'text-white hover:text-slate-900 dark:text-white/70 dark:hover:text-white'}`} 
              href="/search"
            >
              Search
            </Link>
            <Link 
              className={`transition-colors cursor-pointer ${isActive('/dashboard') ? 'text-white dark:text-sky-400 font-semibold' : 'text-white hover:text-slate-900 dark:text-white/70 dark:hover:text-white'}`} 
              href="/dashboard"
            >
              My trips
            </Link>
          </nav>

          {/* Desktop Right Side Actions */}
          <div className="hidden items-center gap-4 md:flex">
            {ready && email ? (
              <div className="flex items-center gap-3 py-1 rounded-full border border-black/5 bg-white/20 pr-4 pl-2 dark:border-white/5 dark:bg-white/5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-white/80">
                  <div className="grid h-6 w-6 place-items-center rounded-full border border-sky-500/30 bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                    <User size={13} />
                  </div>
                  <span className="max-w-[120px] truncate">{email.split('@')[0]}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
                <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10" />
                <SignOutButton />
              </div>
            ) : (
              <div className="flex items-center gap-4 text-sm font-medium">
                <Link className="text-white hover:text-slate-900 cursor-pointer dark:text-white/70 dark:hover:text-white" href="/login">
                  Sign in
                </Link>
                <Link className="rounded-full bg-sky-500 px-5 py-3 text-xs text-white hover:bg-slate-800 cursor-pointer dark:bg-white dark:text-black dark:hover:bg-white/90" href="/signup">
                  Sign up
                </Link>
              </div>
            )}

            {/* Continuous Shine Effect Call-to-Action Button */}
            <Link
              className="animate-shine rounded-full bg-sky-600 px-5 py-3 text-xs font-semibold text-white shadow-md shadow-sky-600/20 transition-transform hover:scale-102 active:scale-98 cursor-pointer"
              href="/search"
            >
              Search flights
            </Link>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="grid h-9 w-9 place-items-center rounded-full border border-black/5 bg-white/50 text-slate-700 hover:bg-white transition-colors cursor-pointer md:hidden dark:border-white/10 dark:bg-white/5 dark:text-white"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu with Glassmorphism */}
        {isMobileMenuOpen && (
          <div className="absolute top-[115%] left-0 right-0 mx-auto w-full overflow-hidden rounded-3xl border border-white/20 bg-white/85 p-5 shadow-xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-200 md:hidden dark:border-white/10 dark:bg-black/80">
            <nav className="flex flex-col gap-4 text-sm font-medium">
              <Link 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`pb-2 border-b border-black/5 dark:border-white/5 cursor-pointer ${isActive('/search') ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-700 dark:text-white/80'}`} 
                href="/search"
              >
                Search
              </Link>
              <Link 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`pb-2 border-b border-black/5 dark:border-white/5 cursor-pointer ${isActive('/dashboard') ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-700 dark:text-white/80'}`} 
                href="/dashboard"
              >
                My trips
              </Link>
              
              {ready && email ? (
                <div className="flex flex-col gap-3 pt-1">
                  <div className="text-xs text-slate-500 dark:text-white/50 px-1">
                    Logged in as: <span className="font-semibold text-slate-700 dark:text-white/80">{email}</span>
                  </div>
                  <div className="flex justify-start cursor-pointer">
                    <SignOutButton />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 pt-2 border-t border-black/5 dark:border-white/5">
                  <Link onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 cursor-pointer dark:text-white/80" href="/login">
                    Sign in
                  </Link>
                  <Link onClick={() => setIsMobileMenuOpen(false)} className="rounded-full bg-slate-900 px-4 py-2 text-xs text-white dark:bg-white dark:text-black" href="/signup">
                    Sign up
                  </Link>
                </div>
              )}

              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                className="animate-shine mt-2 rounded-full bg-sky-600 py-3 text-center text-xs font-semibold text-white shadow-md cursor-pointer"
                href="/search"
              >
                Search flights
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}