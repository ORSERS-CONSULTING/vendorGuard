
import { NextResponse } from "next/server";
import { verifyJWT, authCookie } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { name } = authCookie();
    const cookie = (req as any).cookies?.get?.(name)?.value ?? ""; // edge note
    // In App Router + node runtime, use Headers:
    const cookieHeader = (req.headers as any).get?.("cookie") ?? "";
    const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`));
    const token = match?.[1] ?? cookie;

    if (!token) return NextResponse.json({ user: null });

    const session = await verifyJWT(token);
    return NextResponse.json({ user: session });
  } catch {
    return NextResponse.json({ user: null });
  }
}
