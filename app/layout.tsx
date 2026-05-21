import type { Metadata } from "next";
// 1. Google Fonts 
import { Science_Gothic } from "next/font/google";

import { SiteHeader } from "@/components/layout/site-header";
import { SupabaseSetupBanner } from "@/components/supabase-setup-banner";
import "./globals.css";

// 2. Science Gothic
const scienceGothic = Science_Gothic({
  variable: "--font-science-gothic",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
      className={`${scienceGothic.variable} h-full antialiased`}
    >
      <body className={`${scienceGothic.className} min-h-screen flex flex-col relative text-foreground antialiased bg-zinc-900 overflow-x-hidden`}>
        
        {/* Global Background Image Layer */}
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />

        {/* Premium Blur and Tint Overlay Layer */}
        <div className="fixed inset-0 z-0 bg-white/5 backdrop-blur-sm dark:bg-black/30 dark:backdrop-blur-2xl" />

        {/* Content Wrapper - Enforces entire viewport management */}
        <div className="relative z-10 flex min-h-screen flex-col w-full">
          <SupabaseSetupBanner />
          
          <SiteHeader />

          {/* Main content area takes all available middle vertical space */}
          <main className="flex-1 w-full flex flex-col justify-center">
            {children}
          </main>

          {/* Styled Glassmorphic Footer pinned strictly to the bottom */}
          <footer className="w-full border-t border-white/10 bg-white/5 py-6 text-sm text-white backdrop-blur-md dark:border-white/5 dark:bg-black/10">
            <div className="mx-auto w-full max-w-6xl px-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p>© {new Date().getFullYear()} lizansarkar</p>
                <p className="text-white">
                  Demo app structure for a flight booking workflow.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}