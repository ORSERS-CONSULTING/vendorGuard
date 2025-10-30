import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Check,
  ShieldCheck,
  FileCheck2,
  BarChart3,
  Workflow,
} from "lucide-react";

const LOGIN_URL =
  "https://yawrhzry16j0fw1-aygateway.adb.me-dubai-1.oraclecloudapps.com/ords/r/vendorguard/vendorguard/login";

export default function Home() {
  return (
    <div className="relative">
      {/* softly-tinted background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_40%_at_50%_0%,_oklch(var(--primary)/0.07),_transparent_70%)]"
      />

      {/* Top nav */}
      <header className="sticky top-0 z-20 w-full border-b bg-background/70 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="font-semibold">
            VendorGuard
          </Link>
          <nav className="hidden items-center gap-8 md:flex text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#how" className="hover:text-foreground">
              How it works
            </a>
            {/* <a href="#pricing" className="hover:text-foreground">Pricing</a> */}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild className="rounded-xl">
              <a href={LOGIN_URL} target="_self" rel="noopener noreferrer">
                Log in
              </a>
            </Button>
            {/* <Button asChild className="rounded-xl">
              <Link href="#get-started">Get started</Link>
            </Button> */}
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pb-12 pt-16 md:pb-20 md:pt-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--primary)]"></span>
                Early Access open
              </div>

              <h1 className="mt-4 text-balance text-4xl font-extrabold leading-tight md:text-5xl">
                Confident{" "}
                <span className="text-[var(--primary)]">Vendor Risk</span>{" "}
                Management
              </h1>

              <p className="mt-4 max-w-prose text-muted-foreground">
                Evaluate, onboard, and monitor third-party vendors with ease.
                Reduce risks, stay compliant, and build stronger
                relationships—without the spreadsheets.
              </p>

              <div id="get-started" className="mt-6 flex flex-wrap gap-3">
                {/* <Button className="rounded-xl">Start free</Button> */}
                <Button variant="outline" className="rounded-xl" asChild>
                  <a href={LOGIN_URL} target="_self" rel="noopener noreferrer">
                    Log in
                  </a>
                </Button>
              </div>

              <ul className="mt-6 grid grid-cols-1 gap-2 text-sm text-muted-foreground md:grid-cols-2">
                {[
                  "Automated vendor due diligence",
                  "Continuous compliance monitoring",
                  "Built-in questionnaires",
                  "Executive-ready reporting",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[var(--primary)]" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual (screenshot/placeholder card) */}
            <Card className="border-0 bg-gradient-to-b from-white to-muted/50 shadow-md ring-1 ring-border">
              <CardContent className="p-0">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
                  {/* drop a real image into /public/hero.png later and swap this div for <Image /> */}
                  <div className="absolute inset-0 bg-[radial-gradient(1200px_300px_at_50%_-10%,_oklch(var(--primary)/.12),_transparent)]" />
                  <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                    <img src="/vendorguard.png" alt="vendorguard image" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="mx-auto max-w-7xl px-6 py-12 md:py-20"
        >
          <h2 className="text-center text-2xl font-semibold md:text-3xl">
            Everything you need
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            From onboarding to ongoing monitoring—VendorGuard covers the full
            vendor lifecycle.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: "Risk Scoring",
                desc: "Automatic risk scoring with configurable policies and thresholds.",
              },
              {
                icon: FileCheck2,
                title: "Assessments",
                desc: "Send prebuilt or custom questionnaires and track responses.",
              },
              {
                icon: BarChart3,
                title: "Reports",
                desc: "Share executive-ready dashboards with one click.",
              },
              {
                icon: Workflow,
                title: "Workflows",
                desc: "Automate reviews, reminders, and approvals with ease.",
              },
            ].map((f) => (
              <Card key={f.title} className="rounded-2xl">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <f.icon className="h-5 w-5 text-[var(--primary)]" />
                    <CardTitle className="text-base">{f.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-muted-foreground">
                  {f.desc}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mx-auto max-w-7xl px-6 py-12 md:py-20">
          <h2 className="text-2xl font-semibold md:text-3xl">How it works</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "Invite vendors",
                d: "Send secure links to begin onboarding and collect details.",
              },
              {
                n: "2",
                t: "Run assessments",
                d: "Use templates or your own questionnaires and evidence requests.",
              },
              {
                n: "3",
                t: "Monitor & report",
                d: "Track risks, SLAs, and compliance with live dashboards.",
              },
            ].map((s) => (
              <Card key={s.n} className="rounded-2xl">
                <CardHeader className="pb-1">
                  <div className="text-sm text-[var(--primary)]">
                    Step {s.n}
                  </div>
                  <CardTitle className="text-base">{s.t}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-muted-foreground">
                  {s.d}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16">
          <Card className="rounded-2xl bg-gradient-to-br from-background to-muted/60">
            <CardContent className="flex flex-col items-center justify-between gap-4 p-6 text-center md:flex-row md:text-left">
              <div>
                <h3 className="text-lg font-semibold">
                  Ready to de-risk your vendors?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Try VendorGuard free, or log in to your account.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl" asChild>
                  <a href={LOGIN_URL} target="_self" rel="noopener noreferrer">
                    Log in
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} VendorGuard</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
            <a href="#" className="hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
