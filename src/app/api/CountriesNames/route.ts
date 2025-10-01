// src/app/api/lookups/countries/route.ts

export const runtime = "nodejs";
// No `dynamic` here.
// No top-level `revalidate` for this handler.

import { NextResponse } from "next/server";

const BASE = process.env.ORDS_BASE_URL;
const UPSTREAM = BASE ? `${BASE}/CountriesNames` : undefined;

const headers: Record<string, string> = { Accept: "application/json" };
if (process.env.ORDS_BEARER) headers.Authorization = `Bearer ${process.env.ORDS_BEARER}`;

export async function GET() {
  if (!UPSTREAM) {
    return NextResponse.json({ error: "Missing ORDS_BASE_URL" }, { status: 500 });
  }

  const r = await fetch(UPSTREAM, {
    headers,
    // Cache the *fetch* for 1 hour (ISR-style for data), while the handler stays request-time.
    next: { revalidate: 3600 },
    // If you truly always want fresh data, switch to: cache: "no-store"
  });

  const text = await r.text();

  if (!r.ok) {
    return NextResponse.json(
      { upstreamStatus: r.status, errorBody: text.slice(0, 500) },
      { status: 502 }
    );
  }

  const json = JSON.parse(text);
  const items: string[] = Array.isArray(json?.items)
    ? json.items
        .map((x: any) => (x?.country_name != null ? String(x.country_name) : null))
        .filter(Boolean)
        .sort((a: string, b: string) => a.localeCompare(b))
    : [];

  // (Optional) You can add response cache headers for CDNs if you want:
  // return NextResponse.json({ items }, { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=59" } });

  return NextResponse.json({ items });
}
