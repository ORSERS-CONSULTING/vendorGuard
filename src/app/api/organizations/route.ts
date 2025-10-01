// src/app/api/organizations/route.ts

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { Organization } from "@/lib/org";

const BASE = process.env.ORDS_BASE_URL;
const LIST_UPSTREAM = `${BASE}/Organizations`; // your existing ORDS list endpoint
const CREATE_UPSTREAM = `${BASE}/Tenants`; // your ORDS POST handler that maps names->IDs & inserts

const headers: Record<string, string> = { Accept: "application/json" };
if (process.env.ORDS_BEARER)
  headers.Authorization = `Bearer ${process.env.ORDS_BEARER}`;

// ----- GET: list organizations -----
const toOrg = (x: any): Organization => ({
  code: x.tenantcode,
  name: x.tenantname,
  type: x.type,
  industry: x.industry,
  plan: x.plan,
  country: x.country,
  admin: x.adminperson,
  status: x.statusname,
  timezone: x.tzname,
  currency: x.currencyname,
});

export async function GET() {
  if (!BASE) {
    return NextResponse.json(
      { error: "Missing ORDS_BASE_URL" },
      { status: 500 }
    );
  }

  const res = await fetch(LIST_UPSTREAM, { headers, cache: "no-store" });
  const text = await res.text();

  if (!res.ok) {
    return NextResponse.json(
      {
        upstream: LIST_UPSTREAM,
        upstreamStatus: res.status,
        errorBody: text.slice(0, 2000),
      },
      { status: 502 }
    );
  }

  const raw = JSON.parse(text) as { items: any[]; [k: string]: any };
  const items = Array.isArray(raw.items) ? raw.items.map(toOrg) : [];
  return NextResponse.json({ ...raw, items });
}

// ----- POST: create organization (send NAMES; ORDS maps to IDs) -----
export async function POST(req: Request) {
  if (!BASE) {
    return NextResponse.json(
      { error: "Missing ORDS_BASE_URL" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const payload =
      body?.p_tenant_name !== undefined
        ? body
        : {
            p_tenant_name: String(body?.name ?? "").trim(),
            p_country_name: String(body?.country ?? "").trim(),
            p_subscription_plan_name: String(body?.plan ?? "").trim(),
            p_contact_person: String(body?.contactPerson ?? "").trim(),
            p_contact_email: String(body?.contactEmail ?? "").trim(),
            p_contact_phone: body?.mobile ? String(body.mobile).trim() : null,
            p_created_by: "VENDORGUARD",
          };

    // Minimal validation (names-only path)
    if (!payload.p_tenant_name)
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!payload.p_subscription_plan_name)
      return NextResponse.json(
        { error: "Subscription plan is required" },
        { status: 400 }
      );
    if (!payload.p_contact_person)
      return NextResponse.json(
        { error: "Contact person is required" },
        { status: 400 }
      );
    if (!payload.p_contact_email)
      return NextResponse.json(
        { error: "Contact email is required" },
        { status: 400 }
      );

    const res = await fetch(CREATE_UPSTREAM, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const text = await res.text();

    if (!res.ok) {
      // Surface upstream info (trimmed)
      return NextResponse.json(
        {
          upstream: CREATE_UPSTREAM,
          upstreamStatus: res.status,
          errorBody: text.slice(0, 1200),
        },
        { status: 502 }
      );
    }

    // ORDS may return plain JSON or an envelope; pass it through reasonably
    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      // if upstream returns non-JSON (unlikely), just echo
      return new NextResponse(text, {
        status: 201,
        headers: { "content-type": "application/json" },
      });
    }

    const created = json?.items?.[0] ?? json; // handle envelope or direct object
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Create failed" },
      { status: 500 }
    );
  }
}
