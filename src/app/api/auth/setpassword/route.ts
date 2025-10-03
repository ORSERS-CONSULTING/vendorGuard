// app/api/auth/setpassword/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";

const rawBase = process.env.ORDS_BASE_URL!;
const BASE = rawBase.replace(/\/+$/, "");
const UPSTREAM = `${BASE}/Activate`; // no trailing slash

const baseHeaders: Record<string, string> = { Accept: "application/json" };
if (process.env.ORDS_BEARER) {
  baseHeaders.Authorization = `Bearer ${process.env.ORDS_BEARER}`;
}

// Unwrap ORDS variants (direct JSON vs AutoREST payload)
async function parseOrdsResponse(res: Response) {
  const text = await res.text();
  try {
    const j = JSON.parse(text);
    const payloadStr = j?.items?.[0]?.payload;
    if (typeof payloadStr === "string") {
      try {
        return { data: JSON.parse(payloadStr), ok: res.ok, status: res.status };
      } catch {
        return { data: { raw: payloadStr }, ok: res.ok, status: res.status };
      }
    }
    return { data: j, ok: res.ok, status: res.status };
  } catch {
    return { data: { raw: text }, ok: res.ok, status: res.status };
  }
}

export async function POST(req: Request) {
  if (!BASE) {
    return NextResponse.json({ error: "Missing ORDS_BASE_URL" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { tenant, token, password, username, email } = body || {};

    if (!tenant || !token || !password) {
      return NextResponse.json(
        { error: "Missing tenant, token, or password" },
        { status: 400 }
      );
    }

    const ordsPayload: Record<string, unknown> = {
      p_tenant_code: tenant,
      p_token: token,
      p_password: password,
      p_created_by: "set-password-page",
    };
    if (username) ordsPayload.p_username = username;
    if (email) ordsPayload.p_email = email;

    const res = await fetch(UPSTREAM, {
      method: "POST",
      headers: { ...baseHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(ordsPayload),
      cache: "no-store",
    });

    const { data, ok, status } = await parseOrdsResponse(res);
    if (!ok) {
      return NextResponse.json(
        { error: data?.error ?? "Activation failed", detail: data },
        { status }
      );
    }

    // success — let your client redirect to /login
    return NextResponse.json(data, { status });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
