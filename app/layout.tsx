import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        <header className="border-b border-black/10 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/30">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-sky-600 text-sm font-semibold text-white">
                SB
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-foreground">
                  SkyBooker
                </div>
                <div className="text-xs text-foreground/70">
                  Flight booking starter
                </div>
              </div>
            </div>
            <nav className="flex items-center gap-4 text-sm text-foreground/80">
              <a className="hover:text-foreground" href="#">
                Deals
              </a>
              <a className="hover:text-foreground" href="#">
                My trips
              </a>
              <a
                className="rounded-full bg-foreground px-4 py-2 text-background hover:bg-foreground/90"
                href="#search"
              >
                Search flights
              </a>
            </nav>
          </div>
        </header>

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
