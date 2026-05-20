"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnvOptional } from "./env";

export function createClient() {
  const env = getSupabaseEnvOptional();
  if (!env) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and restart the dev server.",
    );
  }
  const { url, anonKey } = env;
  return createBrowserClient(url, anonKey);
}

