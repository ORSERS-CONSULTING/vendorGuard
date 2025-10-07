"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

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

      // --- minimal, necessary log (same as your old code) ---
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
    <div className="flex h-screen w-screen">
      {/* Left Column - Login Form */}
      <div className="flex w-full flex-col justify-center bg-white p-16 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Refined Logo */}
          <div className="mb-10 flex items-center gap-3">
            <svg
              className="h-12 w-12 flex-shrink-0 text-sky-700"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M12 3l7 3v5c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-3z" fill="currentColor" />
              <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h1 className="text-5xl font-bold leading-tight text-sky-900">
              Vendor<span className="text-sky-700">Guard</span>
            </h1>
          </div>

          <p className="mb-8 text-gray-600">
            Securely manage third-party risk and approvals.
          </p>

          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-sky-500 focus:ring-sky-500"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="text-xs text-sky-700 hover:underline"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                required
                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-sky-500 focus:ring-sky-500"
              />
            </div>

            {err && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-sky-700 py-2 text-white shadow transition hover:bg-sky-800 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Log In"}
            </button>
          </form>

          <div className="mt-6 text-sm text-gray-500">
            Don’t have an account?{" "}
            <a href="#" className="text-sky-600 hover:underline">
              Sign up
            </a>
          </div>
        </motion.div>
      </div>

      {/* Right Column - Why VendorGuard */}
      <div className="flex w-full flex-col justify-center bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-800 p-16 text-white lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md"
        >
          <h2 className="mb-6 text-2xl font-semibold">Why VendorGuard</h2>

          <ul className="mb-6 space-y-3 text-white/90">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-white/70" />
              <span>Continuous vendor monitoring with alerts.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-white/70" />
              <span>Configurable approval workflows across finance & procurement.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-white/70" />
              <span>0–100 risk scoring with industry-specific criteria.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-white/70" />
              <span>Audit-ready compliance reporting.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-white/70" />
              <span>Seamless integration with Oracle Cloud stack.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-white/70" />
              <span>Customizable dashboards & SLA tracking.</span>
            </li>
          </ul>

          <div className="mb-6 grid grid-cols-2 gap-3 text-xs text-white/70">
            <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2">ISO-ready controls</div>
            <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2">Oracle Cloud native</div>
            <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2">SLA dashboards</div>
            <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2">Audit trails</div>
          </div>

          <p className="text-xs text-white/60">
            * Demo environment. Use corporate SSO if enabled.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
