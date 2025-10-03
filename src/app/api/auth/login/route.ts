// app/api/auth/login/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import crypto from "crypto";
import {
  createJWT,
  authCookie,
  type Session,
  type Role,
  homeForRole,
} from "@/lib/auth";

// Trim trailing slashes to avoid //Users
const rawBase = process.env.ORDS_BASE_URL!;
const BASE = rawBase.replace(/\/+$/, "");
const USERS_ENDPOINT = `${BASE}/Users`;

const headers: Record<string, string> = { Accept: "application/json" };
if (process.env.ORDS_BEARER) {
  headers.Authorization = `Bearer ${process.env.ORDS_BEARER}`;
}

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

    // Query your ORDS /Users view by email
    const qs = new URLSearchParams({ email });
    const upstreamUrl = `${USERS_ENDPOINT}?${qs.toString()}`;

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
    if (!u) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Status checks
    if (String(u.isactive) !== "1") {
      return NextResponse.json({ error: "Account inactive" }, { status: 403 });
    }
    if (String(u.is_locked) === "1") {
      return NextResponse.json({ error: "Account locked" }, { status: 403 });
    }

    // Verify password (stored as hex SHA-256; your /Activate writes lowercase, we compare uppercase)
    const incoming = sha256HexUpper(password);
    const stored = String(u.password_hash ?? "").toUpperCase();
    if (incoming !== stored) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Build session from DB row
    const dbRole = (u.role ?? "TENANT").toString().toUpperCase();
    const role = ["SUPER_ADMIN", "OWNER", "ADMIN", "TENANT"].includes(dbRole)
      ? (dbRole as Role)
      : "TENANT";

    const session: Session = {
      sub: String(u.user_id),
      email: String(u.email),
      name: u.full_name ?? null,
      role,
      tenantId: u.tenant_id ?? null,
    };

    // Sign JWT and set cookie
    const token = await createJWT(session);
    const { name, options } = authCookie();

    const redirect = homeForRole(role); // "/organizations" or "/setup"

    const res = NextResponse.json(
      {
        ok: true,
        redirect, // let the client router replace() to this
        user: {
          email: session.email,
          role: session.role,
          tenantId: session.tenantId,
        },
      },
      { status: 200 }
    );

    res.cookies.set(name, token, options);
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Login failed" },
      { status: 500 }
    );
  }
}
