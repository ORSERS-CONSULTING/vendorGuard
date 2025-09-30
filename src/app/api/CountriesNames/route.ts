// src/app/api/lookups/countries/route.ts
export const dynamic = "force-static";
export const revalidate = 3600; // cache for 1 hour

import { NextResponse } from "next/server";

const BASE = process.env.ORDS_BASE_URL!;
const UPSTREAM = `${BASE}/CountriesNames`; // adjust if your path differs

const headers: Record<string, string> = { Accept: "application/json" };
if (process.env.ORDS_BEARER) headers.Authorization = `Bearer ${process.env.ORDS_BEARER}`;

export async function GET() {
  const r = await fetch(UPSTREAM, { headers, cache: "force-cache" });
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

  return NextResponse.json({ items });
}
