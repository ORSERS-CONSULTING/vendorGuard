import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET!);

export type Role = "SUPER_ADMIN" | "TENANT";
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

export function authCookie() {
  return {
    name: "vg.session",
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8, // 8h
    },
  };
}
