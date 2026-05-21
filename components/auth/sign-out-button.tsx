"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 bg-transparent px-4 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10 text-white"
      disabled={loading}
      onClick={signOut}
      type="button"
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
