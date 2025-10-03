// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  verifyJWT,
  createJWT,
  authCookie,
  COOKIE_NAME,
  homeForRole,
} from "./lib/auth";

// === Public routes (case-insensitive) ===
const PUBLIC_PATHS = new Set<string>([
  "/",
  "/login",
  "/privacy",
  "/terms",
  "/setpassword", // activation page is public
]);

// === ORDS setup for user lookups ===
const rawBase = process.env.ORDS_BASE_URL!;
const BASE = rawBase.replace(/\/+$/, "");
const USERS_ENDPOINT = `${BASE}/Users`;
const ORD_HEADERS: Record<string, string> = { Accept: "application/json" };
if (process.env.ORDS_BEARER)
  ORD_HEADERS.Authorization = `Bearer ${process.env.ORDS_BEARER}`;

// Fetch latest role (and optional session_version if you add it later) by user_id
async function fetchLatestUser(userId: string) {
  const qs = new URLSearchParams({ user_id: userId });
  const r = await fetch(`${USERS_ENDPOINT}?${qs.toString()}`, {
    headers: ORD_HEADERS,
    cache: "no-store",
  });
  if (!r.ok) return null;
  const data = await r.json().catch(() => null);
  const u = data?.items?.[0] ?? null;
  return u
    ? {
        role: String(u.role ?? "TENANT").toUpperCase() as
          | "SUPER_ADMIN"
          | "OWNER"
          | "ADMIN"
          | "TENANT",
        // Uncomment when you add this column and include it in /Users view:
        // session_version: Number(u.session_version ?? 0),
      }
    : null;
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = (url.pathname.replace(/\/+$/, "") || "/").toLowerCase();

  // Always allow auth APIs (login, logout, activate, etc.)
  if (path.startsWith("/api/auth/")) return NextResponse.next();

  // ---- Public pages ----
  if (PUBLIC_PATHS.has(path)) {
    // If user hits bare "/" and is logged in, send them to their home
    if (path === "/") {
      const token = req.cookies.get(COOKIE_NAME)?.value;
      if (token) {
        try {
          const session = await verifyJWT(token);
          const redirectUrl = url.clone();
          redirectUrl.pathname = homeForRole(session.role);
          return NextResponse.redirect(redirectUrl);
        } catch {
          // invalid/expired token → fall through
        }
      }
    }
    return NextResponse.next();
  }

  // ---- Protected beyond this point ----
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const redirectUrl = url.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", url.pathname + (url.search || ""));
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const session = await verifyJWT(token);

    // Optional: short-circuit certain static assets (already excluded by matcher though)
    // if (path.startsWith("/assets")) return NextResponse.next();

    // ===== Auto-refresh token when role changed =====
    const latest = await fetchLatestUser(session.sub);
    if (latest && latest.role !== session.role) {
      const refreshed = { ...session, role: latest.role };
      const newToken = await createJWT(refreshed);
      const { name, options } = authCookie();
      const res = NextResponse.next();
      res.cookies.set(name, newToken, options);
      return res;
    }

    // If you implement "session_version", replace the above with:
    // if (latest && latest.session_version !== session.sessionVersion) {
    //   const refreshed = { ...session, role: latest.role, sessionVersion: latest.session_version };
    //   const newToken = await createJWT(refreshed);
    //   const { name, options } = authCookie();
    //   const res = NextResponse.next();
    //   res.cookies.set(name, newToken, options);
    //   return res;
    // }

    return NextResponse.next();
  } catch {
    const redirectUrl = url.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", url.pathname + (url.search || ""));
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  // keep your existing exclusions
  matcher: ["/((?!_next|favicon.ico|assets|public|.*\\..*|api/(?!auth)).*)"],
};
