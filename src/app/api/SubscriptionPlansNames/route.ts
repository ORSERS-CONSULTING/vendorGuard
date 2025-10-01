// app/api/SubscriptionPlansNames/route.ts
export const runtime = "nodejs"; // ok on Vercel

import { NextResponse } from "next/server";

const BASE = process.env.ORDS_BASE_URL;
const UPSTREAM = BASE ? `${BASE}/SubscriptionPlansNames` : undefined;

const headers: Record<string, string> = { Accept: "application/json" };
if (process.env.ORDS_BEARER) {
  headers.Authorization = `Bearer ${process.env.ORDS_BEARER}`;
}

export async function GET() {
  if (!UPSTREAM) {
    // Avoid build-time crashes when env is missing
    return NextResponse.json({ error: "Missing ORDS_BASE_URL" }, { status: 500 });
  }

  const r = await fetch(UPSTREAM, {
    headers,
    // Cache the upstream response for 1 hour (data cache), but DO NOT full-route-cache.
    next: { revalidate: 3600 },
    // If you want always fresh, use: cache: "no-store"
  });

  const text = await r.text();

  if (!r.ok) {
    return NextResponse.json(
      { upstreamStatus: r.status, errorBody: text.slice(0, 500) },
      { status: 502 }
    );
  }

  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON from upstream", preview: text.slice(0, 300) },
      { status: 502 }
    );
  }

  const items: string[] = Array.isArray(json?.items)
    ? json.items
        .map((x: any) => (x?.plan_name != null ? String(x.plan_name) : null))
        .filter(Boolean)
        .sort((a: string, b: string) => a.localeCompare(b))
    : [];

  return NextResponse.json({ items });
}
