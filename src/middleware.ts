import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/auth";

const COOKIE = "vg.session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public paths
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE)?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const session = await verifyJWT(token);
    const isSuper = session.role === "SUPER_ADMIN";

    // Block tenants from /admin
    if (pathname.startsWith("/admin") && !isSuper) {
      const url = req.nextUrl.clone();
      url.pathname = "/organizations";
      return NextResponse.redirect(url);
    }

    // Optional opinionated defaults:
    if (pathname === "/") {
      const url = req.nextUrl.clone();
      url.pathname = isSuper ? "/admin" : "/organizations";
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
  matcher: ["/((?!_next|favicon.ico|assets|public).*)"],
};
