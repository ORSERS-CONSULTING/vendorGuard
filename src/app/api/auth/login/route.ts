// export const dynamic = "force-dynamic";
export const runtime = "nodejs";


import { NextResponse } from "next/server";
import crypto from "crypto";
import { createJWT, authCookie, type Session } from "@/lib/auth";

const BASE = process.env.ORDS_BASE_URL!;
const headers: Record<string, string> = { Accept: "application/json" };
if (process.env.ORDS_BEARER)
  headers.Authorization = `Bearer ${process.env.ORDS_BEARER}`;

function sha256HexUpper(s: string) {
  return crypto
    .createHash("sha256")
    .update(s, "utf8")
    .digest("hex")
    .toUpperCase();
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    // ✅ Correct path: /Users?email=...
    const qs = new URLSearchParams({ email });
    const upstreamUrl = `${BASE}/Users?${qs.toString()}`;

    const r = await fetch(upstreamUrl, { headers, cache: "no-store" });
    if (!r.ok) {
      const body = await r.text();
      return NextResponse.json(
        {
          error: "Auth upstream error",
          upstreamStatus: r.status,
          bodyPreview: body.slice(0, 500),
        },
        { status: 502 }
      );
    }

    const data = await r.json();
    const u = data?.items?.[0];
    if (!u)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    // status checks
    if (String(u.isactive) !== "1")
      return NextResponse.json({ error: "Account inactive" }, { status: 403 });
    if (String(u.is_locked) === "1")
      return NextResponse.json({ error: "Account locked" }, { status: 403 });

    // verify SHA-256 (uppercase hex)
    const incoming = sha256HexUpper(password);
    if (incoming !== String(u.password_hash).toUpperCase()) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const session: Session = {
      sub: String(u.user_id),
      email: u.email,
      name: u.full_name ?? null,
      role: (u.role as Session["role"]) ?? "TENANT",
      tenantId: u.tenant_id ?? null,
    };

    const token = await createJWT(session);
    const { name, options } = authCookie();

    const res = NextResponse.json({
      ok: true,
      user: {
        email: session.email,
        role: session.role,
        tenantId: session.tenantId,
      },
    });
    res.cookies.set(name, token, options);
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Login failed" },
      { status: 500 }
    );
  }
}
