// lib/auth.ts
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET!);

// App roles (add more if needed)
export type Role = "SUPER_ADMIN" | "OWNER" | "TENANT" | "ADMIN";

export type Session = {
  sub: string;          // user_id
  email: string;
  name?: string | null;
  role: Role;
  tenantId: number | null;
};

export async function createJWT(payload: Session) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET);
}

export async function verifyJWT(token: string) {
  const { payload } = await jwtVerify(token, SECRET);
  return payload as Session;
}

export const COOKIE_NAME = "vg.session";

export function authCookie() {
  return {
    name: COOKIE_NAME,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8, // 8h
    },
  };
}

// Where should this role land after auth?
export function homeForRole(role: Role) {
  return role === "SUPER_ADMIN" || role === "OWNER" ? "/organizations" : "/setup";
}
