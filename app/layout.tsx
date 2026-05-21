import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteHeader } from "@/components/layout/site-header";
import { SupabaseSetupBanner } from "@/components/supabase-setup-banner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkyBooker",
  description: "Search, compare, and book flights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SupabaseSetupBanner />
        <SiteHeader />

        <main className="flex-1">{children}</main>

        <footer className="border-t border-black/10 py-10 text-sm text-foreground/70 dark:border-white/10">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} SkyBooker</p>
              <p className="text-foreground/60">
                Demo app structure for a flight booking workflow.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
