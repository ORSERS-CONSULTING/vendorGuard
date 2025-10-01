
export const runtime = "nodejs";


import { NextResponse } from "next/server";

const BASE = process.env.ORDS_BASE_URL!;
const UPSTREAM = `${BASE}/Filters`;

const headers: Record<string, string> = { Accept: "application/json" };
if (process.env.ORDS_BEARER) {
  headers.Authorization = `Bearer ${process.env.ORDS_BEARER}`;
}

export async function GET() {
  if (!BASE) {
    return NextResponse.json(
      { error: "Missing ORDS_BASE_URL" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(UPSTREAM, { headers, cache: "no-store" });
    const json = await res.json();

    // The ORDS response structure:
    // { items: [ { payload: "<json-string>" } ], ... }
    const payloadStr = json?.items?.[0]?.payload;
    if (!payloadStr) {
      return NextResponse.json(
        { error: "No payload found", preview: json },
        { status: 502 }
      );
    }

    const payload = JSON.parse(payloadStr);
    return NextResponse.json(payload);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message ?? "Failed to fetch filters" },
      { status: 500 }
    );
  }
}
