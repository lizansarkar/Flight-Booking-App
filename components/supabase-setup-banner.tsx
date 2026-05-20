import { isSupabaseConfigured } from "@/lib/supabase/env";

export function SupabaseSetupBanner() {
  if (isSupabaseConfigured()) return null;

  return (
    <div
      className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
      role="status"
    >
      <strong>Supabase not configured.</strong> Copy{" "}
      <code className="rounded bg-black/5 px-1 dark:bg-white/10">.env.example</code> to{" "}
      <code className="rounded bg-black/5 px-1 dark:bg-white/10">.env.local</code>, set{" "}
      <code className="rounded bg-black/5 px-1 dark:bg-white/10">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
      and{" "}
      <code className="rounded bg-black/5 px-1 dark:bg-white/10">
        NEXT_PUBLIC_SUPABASE_ANON_KEY
      </code>
      , then restart <code className="rounded bg-black/5 px-1 dark:bg-white/10">npm run dev</code>.
    </div>
  );
}
