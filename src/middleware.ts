import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/auth"; // MUST be Edge-safe (jose/WebCrypto)

const COOKIE = "vg.session";

const PUBLIC_PATHS = new Set<string>([
  "/", "/login", "/privacy", "/terms", "/api/auth",
]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow public paths and /api/auth/*
  if (PUBLIC_PATHS.has(pathname) || pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  // read token for protected paths
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const session = await verifyJWT(token); // Edge-safe implementation
    const isSuper = session.role === "SUPER_ADMIN";

    // if an authenticated user hits /login, send them to their dashboard (nice UX)
    if (pathname === "/login") {
      const url = req.nextUrl.clone();
      url.pathname = isSuper ? "/admin" : "/organizations";
      return NextResponse.redirect(url);
    }

    // block tenants from /admin
    if (pathname.startsWith("/admin") && !isSuper) {
      const url = req.nextUrl.clone();
      url.pathname = "/organizations";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|assets|public|.*\\..*|api/(?!auth)).*)"],
};
