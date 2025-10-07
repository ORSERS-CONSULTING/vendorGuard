// src/lib/abs-url.ts
import { headers } from "next/headers";

/**
 * Build an absolute URL for server-side fetch().
 * Uses forwarded headers when present; falls back to NEXT_PUBLIC_APP_URL.
 */
export async function absUrl(path: string) {
  // If you have a known external base, use it.
  const base = process.env.NEXT_PUBLIC_APP_URL; // e.g. https://localhost:3000
  if (base) return new URL(path, base).toString();

  const h = await headers(); // <- await in Next 15
  const host = h.get("x-forwarded-host") ?? h.get("host")!;
  const proto =
    h.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "production" ? "https" : "http");

  return `${proto}://${host}${path}`;
}
