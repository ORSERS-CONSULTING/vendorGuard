"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

type LoginProps = {
  nextPath?: string | null;
};

export default function Login({ nextPath = null }: LoginProps) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password: pw }),
        credentials: "include",
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(j.error ?? "Invalid email or password");
        return;
      }

      // --- minimal, necessary log ---
      const apiRedirect = typeof j?.redirect === "string" ? j.redirect : null;
      const clientNext =
        nextPath && nextPath.startsWith("/") ? nextPath : null;
      const dest = clientNext ?? apiRedirect ?? "/organizations";

      console.log("[Auth] redirect decision:", {
        apiRedirect,       // from API (homeForRole)
        clientNext,        // from ?next=
        finalDest: dest,   // where we'll navigate
        user: j?.user,     // includes role/tenantId/email from API
      });
      // --- end log ---

      router.replace(dest);
    } catch (e: any) {
      setErr(e?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-[100dvh] grid-rows-[auto,1fr] md:grid-cols-2 md:grid-rows-1">
      {/* LEFT: brand image */}
      <div className="relative hidden md:block">
        <Card className="border-0 bg-gradient-to-b from-white to-muted/50 shadow-md ring-1 ring-border">
          <CardContent className="p-0">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-[radial-gradient(1200px_300px_at_50%_-10%,_oklch(var(--primary)/.12),_transparent)]" />
              <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                <img src="/vendorguard.png" alt="vendorguard image" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(800px_300px_at_70%_20%,_oklch(var(--primary)/.22),_transparent_70%)]" />
        <div className="absolute bottom-10 left-10 right-10 max-w-sm text-white">
          <h2 className="text-2xl font-semibold">VendorGuard</h2>
          <p className="mt-2 text-sm/6 text-white/80">
            Evaluate, onboard, and monitor vendors with confidence.
          </p>
        </div>
      </div>

      {/* Mobile banner */}
      <div className="relative order-1 h-40 md:hidden overflow-hidden">
        <Image
          src="/vendorguard.png"
          alt="VendorGuard"
          fill
          className="object-cover"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
      </div>

      {/* RIGHT: form */}
      <div className="order-2 flex items-center justify-center bg-background px-6 py-10 md:px-12">
        <div className="w-full max-w-sm border py-6 px-6 rounded-2xl shadow-md backdrop-blur-2xl">
          <h1 className="mt-2 text-3xl font-semibold">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back! Please enter your details.
          </p>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="text-xs text-[var(--primary)] hover:underline"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              <Input
                id="password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                required
                className="h-11 rounded-xl"
              />
            </div>

            {err && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {err}
              </div>
            )}

            <Button
              type="submit"
              className="mt-2 h-11 w-full rounded-xl"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-4 text-right">
            <Link href="#" className="text-xs text-[var(--primary)] hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
