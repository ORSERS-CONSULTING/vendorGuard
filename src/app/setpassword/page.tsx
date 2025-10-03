"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();

  const tenant = useMemo(() => params.get("tenant") ?? "", [params]);
  const token = useMemo(() => params.get("token") ?? "", [params]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!tenant || !token) {
      setErr(
        "Invalid or incomplete activation link. Please request a new email."
      );
    }
  }, [tenant, token]);

  function validate(): string | null {
    if (!tenant || !token) return "Missing tenant or token in the link.";
    if (!password || !confirmPassword)
      return "Please fill in both password fields.";
    if (password.length < 3) return "Password must be at least 3 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const v = validate();
    if (v) {
      setErr(v);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/setpassword", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tenant, token, password }),
      });

      const j = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr(j?.error ?? "Could not set password");
        setLoading(false);
        return;
      }

      // success → go straight to login; include tenant so you can prefill username
      router.replace(`/login?activated=1&tenant=${encodeURIComponent(tenant)}`);
      // no need to setLoading(false); navigation will replace the page
    } catch (e: any) {
      setErr(e?.message ?? "Network error");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-6 py-10">
      <div className="w-full max-w-sm border py-6 px-6 rounded-2xl shadow-md backdrop-blur-2xl">
        <h1 className="mt-2 text-3xl font-semibold">Set your password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Please choose a new password for your account.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 rounded-xl"
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type={showPw ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="h-11 rounded-xl"
              autoComplete="new-password"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="text-xs text-[var(--primary)] hover:underline"
          >
            {showPw ? "Hide" : "Show"} passwords
          </button>

          {err && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {err}
            </div>
          )}

          <Button
            type="submit"
            className="mt-2 h-11 w-full rounded-xl"
            disabled={loading || !tenant || !token}
          >
            {loading ? "Setting…" : "Set Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
