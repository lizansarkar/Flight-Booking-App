/**
 * Routes that require a logged-in user (middleware + server defense in depth).
 */
export const PROTECTED_PATH_PREFIXES = [
  "/dashboard",
  "/booking/checkout",
  "/booking/confirmation",
];

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Authenticated users hitting these routes are redirected to the app home area.
 */
export const AUTH_ROUTE_PREFIXES = ["/login", "/signup"];

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
