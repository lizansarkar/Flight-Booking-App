import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { FlightRow } from "@/types/flight";

/** Remove LIKE wildcards so user input cannot broaden the query. */
function sanitizeIlikeToken(value: string): string {
  return value.replace(/[%_\\]/g, "").slice(0, 80);
}

function utcDayBoundsYmd(ymd: string): { startIso: string; endIso: string } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const startMs = Date.UTC(y, mo - 1, d, 0, 0, 0, 0);
  const start = new Date(startMs);
  if (
    start.getUTCFullYear() !== y ||
    start.getUTCMonth() !== mo - 1 ||
    start.getUTCDate() !== d
  ) {
    return null;
  }
  const end = new Date(startMs + 24 * 60 * 60 * 1000);
  return { startIso: start.toISOString(), endIso: end.toISOString() };
}

export type FlightSearchParams = {
  origin: string;
  destination: string;
  date: string;
};

export async function searchFlights(
  params: FlightSearchParams,
): Promise<{ flights: FlightRow[]; error: string | null }> {
  const rawOrigin = params.origin.trim();
  const rawDestination = params.destination.trim();
  const date = params.date.trim();

  if (!rawOrigin || !rawDestination || !date) {
    return { flights: [], error: null };
  }

  const origin = sanitizeIlikeToken(rawOrigin);
  const destination = sanitizeIlikeToken(rawDestination);
  if (!origin || !destination) {
    return {
      flights: [],
      error:
        "Origin and destination need at least one letter or number (wildcards are removed).",
    };
  }

  const bounds = utcDayBoundsYmd(date);
  if (!bounds) {
    return { flights: [], error: "Invalid date." };
  }

  if (!isSupabaseConfigured()) {
    return {
      flights: [],
      error:
        "Supabase is not configured. Copy .env.example to .env.local, add your project URL and anon key, then restart npm run dev.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("flights")
    .select("*")
    .gte("depart_at", bounds.startIso)
    .lt("depart_at", bounds.endIso)
    .ilike("origin", `%${origin}%`)
    .ilike("destination", `%${destination}%`)
    .order("depart_at", { ascending: true });

  if (error) {
    return { flights: [], error: error.message };
  }

  return { flights: (data ?? []) as FlightRow[], error: null };
}
