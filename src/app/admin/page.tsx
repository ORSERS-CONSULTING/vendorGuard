"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  AlertTriangle, BarChart3, Factory, Percent, Plus, Users,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
} from "recharts";

/* ------------------------------------------------------------------ */
/* Small, reusable components (compact + modern)                       */
/* ------------------------------------------------------------------ */

function KpiTile({
  label,
  value,
  sub,
  icon,
  trend,
  className,
}: {
  label: React.ReactNode;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  trend?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-3 shadow-sm",
        "grid grid-cols-[1fr,auto] items-start gap-2",
        className,
      )}
    >
      <div>
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <div className="text-2xl font-semibold leading-none">{value}</div>
          {trend && <span className="text-xs font-medium text-emerald-600">{trend}</span>}
        </div>
        {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
      </div>
      {icon && <div className="rounded-md border p-1.5 text-muted-foreground">{icon}</div>}
    </div>
  );
}

function UsageInline({
  used, limit, series,
}: { used: number; limit: number; series?: Array<{ day: string; used: number }> }) {
  const [expanded, setExpanded] = useState(false);
  const pct = useMemo(() => Math.min(100, Math.round((used / limit) * 100)), [used, limit]);
  const danger = pct >= 80;

  useEffect(() => {
    if (pct >= 80) setExpanded(true);
  }, [pct]);

  return (
    <Card>
      <CardContent className="p-3">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>Usage this period</span>
          <span>
            {used}/{limit}
          </span>
        </div>
        <Progress value={pct} />
        <div className="mt-2 flex items-center justify-between">
          <Badge variant={danger ? "destructive" : "secondary"} className="text-[11px]">
            {pct}%
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Hide details" : "View details"}
          </Button>
        </div>
        {danger && (
          <div className="mt-2 rounded-md border border-orange-200 bg-orange-50 p-2 text-xs text-orange-800">
            ⚠️ You&apos;re using {pct}% of your plan. Consider upgrading.
          </div>
        )}
        {expanded && !!series?.length && (
          <div className="mt-3">
            <CardHeader className="py-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <CardTitle className="text-sm">Usage details (last 14 days)</CardTitle>
              </div>
            </CardHeader>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={series}
                  margin={{
                    left: 6, right: 6, top: 6, bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={30} />
                  <RTooltip />
                  <Area type="monotone" dataKey="used" strokeWidth={2} fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PendingList({
  items,
  selected,
  onToggle,
  onClear,
  onReview,
}: {
  items: {
    id: string;
    company: string;
    category?: string;
    submittedAt?: string;
    level?: "None" | "Basic" | "Reviewed" | "Enhanced";
    risk?: "low" | "medium" | "high";
    missing?: string[];
  }[];
  selected: Record<string, boolean>;
  onToggle: (id: string, val: boolean) => void;
  onClear: () => void;
  onReview: () => void;
}) {
  const any = items?.length > 0;

  return (
    <section className="rounded-lg border bg-card">
      <header className="flex items-center justify-between border-b px-3 py-2">
        <h3 className="text-sm font-medium">Pending verifications</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-7 px-2" onClick={onClear}>
            Clear
          </Button>
          <Button size="sm" className="h-7 px-2" onClick={onReview}>
            Review selected
          </Button>
        </div>
      </header>

      {!any ? (
        <div className="flex items-center justify-between p-3 text-sm text-muted-foreground">
          <span>No pending verifications. Great job!</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-7 px-2" asChild>
              <Link href="/admin/vendors">Start verification</Link>
            </Button>
            <Button size="sm" className="h-7 px-2" asChild>
              <Link href="/admin/vendors/new">New vendor</Link>
            </Button>
          </div>
        </div>
      ) : (
        <ul className="divide-y">
          {items.map((v) => {
            const sel = !!selected[v.id];
            const riskClass =
              v.risk === "high"
                ? "bg-destructive text-destructive-foreground"
                : v.risk === "medium"
                ? "bg-amber-500 text-white"
                : v.risk === "low"
                ? "bg-emerald-500 text-white"
                : "";

            return (
              <li
                key={v.id}
                className={cn(
                  "grid grid-cols-[auto,1fr,auto] items-center gap-3 px-3 py-2",
                  sel && "bg-muted/40",
                )}
              >
                <input
                  type="checkbox"
                  checked={sel}
                  onChange={(e) => onToggle(v.id, e.target.checked)}
                  className="h-4 w-4 accent-primary"
                  aria-label={`Select ${v.company}`}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-sm font-medium">{v.company}</div>
                    {v.level && (
                      <Badge variant="outline" className="h-5 text-[11px]">
                        {v.level}
                      </Badge>
                    )}
                    {v.risk && (
                      <span className={cn("rounded px-1.5 py-0.5 text-[11px] leading-4", riskClass)}>
                        {v.risk}
                      </span>
                    )}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {v.category ?? "—"} • {fmtRel(v.submittedAt)}
                    {v.missing?.length ? ` • Missing: ${v.missing.join(", ")}` : ""}
                  </div>
                </div>
                <Button asChild size="sm" className="h-7 px-2 justify-self-end">
                  <Link href={`/tenant/verification/${v.id}`}>Open</Link>
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page logic                                                          */
/* ------------------------------------------------------------------ */

type ActivityKind = "verification" | "team" | "system" | "general";

interface TenantOverview {
  tenantId: string;
  tenantName: string;
  planName: string;
  planRenewsAt?: string; // ISO
  usageThisPeriod: number;
  usageLimit: number;
  vendorsTotal: number;
  vendorsVerified: number; // count
  vendorsPending: number;
  endorsementsCount: number;
  monthVendorsDeltaPct?: number; // +12
  checklist: Array<{ key: string; label: string; done: boolean; href?: string }>;
  usageSeries: Array<{ day: string; used: number }>;
  recentActivity: Array<{
    id: string;
    when: string;
    actor: string;
    action: string;
    entity: string;
    entityId?: string;
    kind?: ActivityKind;
  }>;
  pendingVerifications: Array<{
    id: string;
    company: string;
    category?: string;
    submittedAt?: string;
    level?: "None" | "Basic" | "Reviewed" | "Enhanced";
    risk?: "low" | "medium" | "high";
    missing?: string[];
  }>;
}

async function fetchTenantOverview(): Promise<TenantOverview> {
  // mock
  await new Promise((r) => setTimeout(r, 120));
  const verified = 64;
  const total = 137;
  return {
    tenantId: "t_abc",
    tenantName: "Acme Holdings",
    planName: "UAE Plan",
    planRenewsAt: new Date(Date.now() + 18 * 86_400_000).toISOString(),
    usageThisPeriod: 4280,
    usageLimit: 5000,
    vendorsTotal: total,
    vendorsVerified: verified,
    vendorsPending: 18,
    endorsementsCount: 92,
    monthVendorsDeltaPct: 12,
    checklist: [
      { key: "brand", label: "Upload logo & choose brand color", done: true, href: "/tenant/profile" },
      { key: "users", label: "Invite your team members", done: false, href: "/tenant/users" },
      { key: "vendors", label: "Add your first vendors", done: true, href: "/admin/vendors" },
      { key: "verify", label: "Start a verification workflow", done: false, href: "/admin/vendors" },
      { key: "notify", label: "Configure notifications", done: false, href: "/tenant/notifications" },
    ],
    usageSeries: Array.from({ length: 14 }).map((_, i) => ({
      day: new Date(Date.now() - (13 - i) * 86_400_000).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      used: Math.round(80 + Math.random() * 160),
    })),
    recentActivity: [
      {
        id: "a1",
        when: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        actor: "You",
        action: "Verified vendor",
        entity: "Emirates Logistics",
        kind: "verification",
      },
      {
        id: "a2",
        when: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        actor: "O. Kareem",
        action: "Endorsed Falcon Supplies",
        entity: "Falcon Supplies",
        kind: "general",
      },
      {
        id: "a3",
        when: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
        actor: "A. Noor",
        action: "Started verification",
        entity: "Gulf Tech LLC",
        kind: "verification",
      },
      {
        id: "a4",
        when: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        actor: "System",
        action: "Certificate expiring soon",
        entity: "Marhaba Trading",
        kind: "system",
      },
    ],
    pendingVerifications: [
      {
        id: "v1",
        company: "Gulf Tech LLC",
        category: "IT Services",
        submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        level: "Basic",
        risk: "medium",
        missing: ["Trade license"],
      },
      {
        id: "v2",
        company: "Falcon Supplies",
        category: "Procurement",
        submittedAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
        level: "Reviewed",
        risk: "low",
      },
      {
        id: "v3",
        company: "Desert Movers",
        category: "Logistics",
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        level: "None",
        risk: "high",
        missing: ["Insurance", "Owner ID"],
      },
    ],
  };
}

function fmtRel(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function TenantDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TenantOverview | null>(null);
  const [activityTab, setActivityTab] = useState<ActivityKind | "all">("all");
  const [activityRange, setActivityRange] = useState<"7d" | "30d" | "all">("7d");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchTenantOverview().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const usagePct = useMemo(() => {
    if (!data) return 0;
    return Math.min(100, Math.round((data.usageThisPeriod / data.usageLimit) * 100));
  }, [data]);

  const verifiedPct = useMemo(() => {
    if (!data) return 0;
    return data.vendorsTotal === 0
      ? 0
      : Math.round((data.vendorsVerified / data.vendorsTotal) * 100);
  }, [data]);

  const checklistIncomplete = (data?.checklist ?? []).some((s) => !s.done);
  const incompleteCount = (data?.checklist ?? []).filter((s) => !s.done).length;

  // Group activity into Today / Yesterday / Earlier
  const grouped = useMemo(() => {
    const filtered = (data?.recentActivity ?? []).filter((a) =>
      activityTab === "all" ? true : a.kind === activityTab,
    );
    const now = Date.now();
    const today: typeof filtered = [];
    const yesterday: typeof filtered = [];
    const earlier: typeof filtered = [];
    filtered.forEach((a) => {
      const days = (now - new Date(a.when).getTime()) / 86_400_000;
      if (days < 1) today.push(a);
      else if (days < 2) yesterday.push(a);
      else earlier.push(a);
    });
    return { today, yesterday, earlier, all: filtered };
  }, [data, activityTab]);

  return (
    <div className="space-y-3 px-5 py-4">
      {/* Header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Tenant Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {data?.tenantName ?? "—"} • Plan:{" "}
            <span className="font-medium">{data?.planName ?? "—"}</span>
            {data?.planRenewsAt && (
              <span className="ml-2">
                (renews {new Date(data.planRenewsAt).toLocaleDateString()})
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild className="h-8">
            <Link href="/admin/vendors/new">
              <Plus className="mr-1.5 h-4 w-4" />
              New Vendor
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-8">
            <Link href="/tenant/users">
              <Users className="mr-1.5 h-4 w-4" />
              Invite Team
            </Link>
          </Button>
        </div>
      </div>

      {/* Setup banner */}
      {checklistIncomplete && (
        <Card className="border-amber-200 bg-amber-50/60">
          <CardContent className="flex items-center gap-3 p-3 text-sm">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <div className="flex-1">
              <strong>Finish setup ({incompleteCount} items):</strong>{" "}
              {data!.checklist.filter((s) => !s.done).map((s) => s.label).join(" • ")}
            </div>
            <Button asChild size="sm" className="h-7">
              <Link href={data!.checklist.find((s) => !s.done)?.href ?? "/tenant/profile"}>
                Continue
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pending list */}
      <PendingList
        items={data?.pendingVerifications ?? []}
        selected={selected}
        onToggle={(id, val) => setSelected((s) => ({ ...s, [id]: val }))}
        onClear={() => setSelected({})}
        onReview={() => {
          // hook your bulk review flow here
          const ids = Object.entries(selected)
            .filter(([, v]) => v)
            .map(([k]) => k);
          console.log("bulk review", ids);
        }}
      />

      {/* Primary KPIs - compact grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Vendors"
          value={loading ? "—" : data!.vendorsTotal.toLocaleString()}
          trend={data?.monthVendorsDeltaPct ? `+${data!.monthVendorsDeltaPct}%` : undefined}
          icon={<Factory className="h-4 w-4" />}
        />
        <KpiTile
          label={
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help">Verified rate</span>
                </TooltipTrigger>
                <TooltipContent>Percentage verified out of total vendors</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          }
          value={`${verifiedPct}%`}
          sub={`${data?.vendorsVerified ?? 0} / ${data?.vendorsTotal ?? 0}`}
          icon={<Percent className="h-4 w-4" />}
        />
        <KpiTile label="Pending" value={data?.vendorsPending ?? "—"} sub="Queue" />
        <KpiTile label="Endorsements" value={data?.endorsementsCount ?? "—"} sub="Network" />
      </div>

      {/* Usage (slim) */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <UsageInline used={data?.usageThisPeriod ?? 0} limit={data?.usageLimit ?? 1} series={data?.usageSeries} />
      </div>

      {/* Activity (compact table w/ grouping) */}
      <Card>
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Activity</CardTitle>
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">Range:</div>
              <div className="flex items-center gap-1">
                {(["7d", "30d", "all"] as const).map((r) => (
                  <Button
                    key={r}
                    size="sm"
                    variant={activityRange === r ? "default" : "outline"}
                    className="h-7 px-2 text-xs"
                    onClick={() => setActivityRange(r)}
                  >
                    {r}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <Tabs value={activityTab} onValueChange={(v) => setActivityTab(v as any)} className="mt-2">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="h-8">
                All
              </TabsTrigger>
              <TabsTrigger value="verification" className="h-8">
                Verifications
              </TabsTrigger>
              <TabsTrigger value="team" className="h-8">
                Team
              </TabsTrigger>
              <TabsTrigger value="system" className="h-8">
                System
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">When</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead className="w-[180px]">Actor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grouped.all.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                    No {activityTab} activity in the selected range
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {grouped.today.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="bg-muted/40 text-xs font-medium">
                        Today
                      </TableCell>
                    </TableRow>
                  )}
                  {grouped.today.map((a) => (
                    <TableRow key={a.id} className="hover:bg-muted/40">
                      <TableCell className="text-xs text-muted-foreground">{fmtRel(a.when)}</TableCell>
                      <TableCell className="text-sm">{a.action}</TableCell>
                      <TableCell className="text-sm">
                        <Link
                          href={`/tenant/vendors/${a.entityId ?? "#"}`}
                          className="underline underline-offset-4"
                        >
                          {a.entity}
                        </Link>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.actor}</TableCell>
                    </TableRow>
                  ))}

                  {grouped.yesterday.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="bg-muted/40 text-xs font-medium">
                        Yesterday
                      </TableCell>
                    </TableRow>
                  )}
                  {grouped.yesterday.map((a) => (
                    <TableRow key={a.id} className="hover:bg-muted/40">
                      <TableCell className="text-xs text-muted-foreground">{fmtRel(a.when)}</TableCell>
                      <TableCell className="text-sm">{a.action}</TableCell>
                      <TableCell className="text-sm">
                        <Link
                          href={`/tenant/vendors/${a.entityId ?? "#"}`}
                          className="underline underline-offset-4"
                        >
                          {a.entity}
                        </Link>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.actor}</TableCell>
                    </TableRow>
                  ))}

                  {grouped.earlier.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="bg-muted/40 text-xs font-medium">
                        Earlier
                      </TableCell>
                    </TableRow>
                  )}
                  {grouped.earlier.map((a) => (
                    <TableRow key={a.id} className="hover:bg-muted/40">
                      <TableCell className="text-xs text-muted-foreground">{fmtRel(a.when)}</TableCell>
                      <TableCell className="text-sm">{a.action}</TableCell>
                      <TableCell className="text-sm">
                        <Link
                          href={`/tenant/vendors/${a.entityId ?? "#"}`}
                          className="underline underline-offset-4"
                        >
                          {a.entity}
                        </Link>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.actor}</TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Contextual actions */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button asChild variant="outline" className="h-8">
          <Link href="/admin/verifications/audit">Schedule verification audit</Link>
        </Button>
        <Button asChild variant="outline" className="h-8">
          <Link href="/admin/reports/compliance">View compliance report</Link>
        </Button>
        <Button asChild variant="outline" className="h-8">
          <Link href="/tenant/users">Manage team permissions</Link>
        </Button>
      </div>
    </div>
  );
}
