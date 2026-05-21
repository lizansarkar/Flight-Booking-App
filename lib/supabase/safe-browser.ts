import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnvOptional } from "./env";

/** Browser client; returns null when env is missing (avoids crash on auth UI). */
export function createBrowserClientSafe() {
  const env = getSupabaseEnvOptional();
  if (!env) return null;
  return createBrowserClient(env.url, env.anonKey);
}
