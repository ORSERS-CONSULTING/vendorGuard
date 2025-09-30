import { NextResponse } from "next/server";
import { authCookie } from "@/lib/auth";

export async function POST() {
  const { name, options } = authCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(name, "", { ...options, maxAge: 0 });
  return res;
}
