// app/api/setup/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT, COOKIE_NAME } from "@/lib/auth";

const BASE = (process.env.ORDS_BASE_URL ?? "").replace(/\/+$/, "");
const UPSTREAM = `${BASE}/Setup`;

const baseHeaders: Record<string, string> = { Accept: "application/json" };
if (process.env.ORDS_BEARER) {
  baseHeaders.Authorization = `Bearer ${process.env.ORDS_BEARER}`;
}

export async function POST(req: Request) {
  try {
    // Next 15: cookies() is async
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session?.tenantId)
      return NextResponse.json({ error: "No tenant in session" }, { status: 403 });

    const state = await req.json();

    // IMPORTANT: stringify the big payload for ORDS (param is STRING)
    const p_setup_json = JSON.stringify({
      business: state?.business ?? null,
      compliance: Array.isArray(state?.compliance) ? state.compliance : [],
      preferences: {
        timezone: state?.location?.timezone ?? null,
        currency: state?.location?.currency ?? null,
      },
      verification: state?.verification ?? {},
      agree: !!state?.agree,
    });

    const ordsPayload = {
      p_tenant_id: Number(session.tenantId),
      p_address: state?.location?.address ?? null,
      p_city: state?.location?.city ?? null,
      p_postal_code: state?.location?.postal ?? null,
      p_website: state?.branding?.website ?? null,
      p_setup_json, // <-- STRING
    };

    const res = await fetch(UPSTREAM, {
      method: "POST",
      headers: { ...baseHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(ordsPayload),
      cache: "no-store",
    });

    const text = await res.text();
    let data: any;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error ?? "Setup save failed", detail: data },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
