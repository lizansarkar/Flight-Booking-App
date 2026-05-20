import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { isAuthRoute, isProtectedPath } from "@/lib/auth/paths";

import { getSupabaseEnvOptional } from "./env";

function copyCookies(source: NextResponse, target: NextResponse): void {
  for (const { name, value } of source.cookies.getAll()) {
    target.cookies.set(name, value);
  }
}

/**
 * Keeps Supabase auth cookies refreshed and enforces route access for App Router.
 * Uses `getUser()` so the JWT is validated with the Auth server (not spoofable like `getSession()`).
 */
export async function updateSession(request: NextRequest) {
  const env = getSupabaseEnvOptional();
  if (!env) {
    // Allow the app to load without Supabase until .env.local is configured.
    return NextResponse.next({ request });
  }

  const { url, anonKey } = env;
  const pathname = request.nextUrl.pathname;

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([key, value]) =>
          supabaseResponse.headers.set(key, value),
        );
      },
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const hasUser = !error && user != null;

  if (!hasUser && isProtectedPath(pathname)) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    copyCookies(supabaseResponse, redirectResponse);
    return redirectResponse;
  }

  if (hasUser && isAuthRoute(pathname)) {
    const redirectResponse = NextResponse.redirect(new URL("/dashboard", request.url));
    copyCookies(supabaseResponse, redirectResponse);
    return redirectResponse;
  }

  return supabaseResponse;
}
