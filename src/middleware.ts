// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT, COOKIE_NAME, homeForRole } from "./lib/auth";

const PUBLIC_PATHS = new Set<string>([
  "/",
  "/login",
  "/privacy",
  "/terms",
  "/setpassword", // activation page is public
]);

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = (url.pathname.replace(/\/+$/, "") || "/").toLowerCase();

  // Always allow auth APIs (login, logout, activate proxy, etc.)
  if (path.startsWith("/api/auth/")) return NextResponse.next();

  // Public pages
  if (PUBLIC_PATHS.has(path)) {
    // If it's the bare home and the user is already logged in, send them to their area
    if (path === "/") {
      const token = req.cookies.get(COOKIE_NAME)?.value;
      if (token) {
        try {
          const session = await verifyJWT(token);
          const redirectUrl = url.clone();
          redirectUrl.pathname = homeForRole(session.role); // ✅ always one of the two
          return NextResponse.redirect(redirectUrl);
        } catch {
          // invalid/expired token → fall through to public home
        }
      }
    }

    return NextResponse.next();
  }

  // Protected beyond this point
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const redirectUrl = url.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", url.pathname + (url.search || ""));
    return NextResponse.redirect(redirectUrl);
  }

  try {
    await verifyJWT(token);
    return NextResponse.next();
  } catch {
    const redirectUrl = url.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", url.pathname + (url.search || ""));
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|assets|public|.*\\..*|api/(?!auth)).*)"],
};
