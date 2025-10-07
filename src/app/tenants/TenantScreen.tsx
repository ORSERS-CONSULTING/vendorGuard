// src/components/tenants/TenantScreen.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TenantDrawer } from "@/components/tenants/TenantDrawer";
import {
  Menu,
  Paperclip,
  UserPlus,
  StickyNote,
  AlertTriangle,
  BadgePlus,
  Percent,
  Scale,
  Plus,
  PencilLine,
} from "lucide-react";
import { EditTenantDialog } from "@/components/tenants/EditTenantDialog";

/* ---------------- types ---------------- */
type Company = {
  code: string;
  name: string;
  type?: string;
  industry?: string;
  plan?: string;
  country?: string;
  status: "ACTIVE" | "PENDING" | "CLOSED";
  timezone?: string;
  currency?: string;
  repName?: string;
  repPhone?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  profileCompletion?: number;
};

type RowStatus = "Open" | "Closed" | "Pending";
type ServiceRequest = {
  id: string;
  department: string;
  typistUserId: string;
  status: RowStatus;
  startTime: string;
  endTime?: string;
  count?: number;
};

/* --------------- helpers --------------- */
const hasValue = (v: unknown) =>
  !(
    v === undefined ||
    v === null ||
    v === "" ||
    (typeof v === "number" && Number.isNaN(v))
  );

function statusClass(s: RowStatus) {
  if (s === "Open")
    return "bg-green-600/10 text-green-700 dark:text-green-300 border border-green-600/20";
  if (s === "Pending")
    return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20";
  return "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border border-zinc-500/20";
}

function StatusBadge({ status }: { status: Company["status"] }) {
  const cls =
    status === "ACTIVE"
      ? "bg-green-600/10 text-green-700 dark:text-green-300 border border-green-600/20"
      : status === "PENDING"
      ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
      : "bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20";
  return (
    <Badge variant="secondary" className={cls}>
      {status}
    </Badge>
  );
}


/* label + value ALWAYS on one line (flex) */
function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode | string;
}) {
  if (!hasValue(value)) return null;
  const isString = typeof value === "string";
  return (
    <div className="flex items-center gap-3 py-1.5 min-w-0">
      {/* fixed label width to keep a neat column */}
      <div className="w-40 md:w-48 shrink-0 text-[13px] text-muted-foreground">
        {label}
      </div>
      {/* value grows; truncate long text */}
      {isString ? (
        <span
          className="min-w-0 flex-1 truncate text-sm font-medium"
          title={value as string}
        >
          {value as string}
        </span>
      ) : (
        <div className="min-w-0 flex-1">{value}</div>
      )}
    </div>
  );
}

function PlaceholderLogo({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
  return (
    <div className="grid h-11 w-11 place-items-center rounded-md bg-muted ring-1 ring-border">
      <span className="text-sm font-semibold text-muted-foreground">
        {initials || "—"}
      </span>
    </div>
  );
}
function Meta({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-muted-foreground">{children}</span>;
}

/* mock rows for the table */
const MOCK_REQUESTS: ServiceRequest[] = [
  {
    id: "1",
    department: "TAWJEEH",
    typistUserId: "Amna Khalifa B.",
    status: "Closed",
    startTime: "22-JAN-2025 01:06 PM",
    endTime: "22-JAN-2025 09:08 AM",
    count: 10,
  },
  {
    id: "2",
    department: "AMER",
    typistUserId: "Maryam Khamis",
    status: "Closed",
    startTime: "10-MAR-2025 01:05 PM",
    endTime: "10-MAR-2025 09:09 AM",
    count: 1,
  },
];

/* --------------- component -------------- */
export default function TenantScreen({ company }: { company: Company }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("requests");
const [editOpen, setEditOpen] = useState(false);

  const displayUrl = (url?: string) => {
    if (!url) return "";
    try {
      const u = new URL(url);
      const shown = (u.hostname + u.pathname).replace(/\/$/, "");
      return shown.length > 42 ? shown.slice(0, 42) + "…" : shown;
    } catch {
      return url.length > 42 ? url.slice(0, 42) + "…" : url;
    }
  };

  return (
    <>
      <TenantDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="Tenant Menu"
      />

      {/* tighter top spacing and aligned header */}
      <div className="space-y-3 p-4 md:p-6 lg:p-8">
        {/* Title row (no borders) */}
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <div className="flex items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-md"
                  onClick={() => setDrawerOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <PlaceholderLogo name={company.name} />
                <div className="mt-0.5">
                  <div className="text-lg font-semibold leading-tight">
                    {company.name}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    {hasValue(company.industry) && (
                      <Meta>{company.industry}</Meta>
                    )}
                    {hasValue(company.industry) &&
                      hasValue(company.country) && <Meta>•</Meta>}
                    {hasValue(company.country) && (
                      <Meta>{company.country}</Meta>
                    )}
                    {hasValue(company.plan) && (
                      <>
                        <Meta>•</Meta>
                        <Badge
                          className="h-5 rounded-md px-1.5 text-[11px]"
                          variant="secondary"
                        >
                          {company.plan}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* progress */}
              <div className="w-64 md:w-80">
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Profile Completion</span>
                  <span>{company.profileCompletion ?? 0}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-2 bg-foreground/90"
                    style={{ width: `${company.profileCompletion ?? 0}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details + Quick actions */}
        <div className="grid gap-3 md:grid-cols-10">
          {/* Company Details */}
          <Card className="md:col-span-7 shadow-sm">
            <CardContent className="px-4 py-0 sm:px-5 sm:py-0">
              <div className="mb-1.5 flex items-center justify-between">
                <h3 className="text-base font-semibold">Company Details</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-md"
                  aria-label="Edit company"
                  onClick={() => setEditOpen(true)}
                >
                  <PencilLine className="h-4 w-4" />
                </Button>
              </div>
<EditTenantDialog
  open={editOpen}
  onOpenChange={setEditOpen}
  initial={{
    code: company.code,
    name: company.name,
    type: company.type,
    industry: company.industry,
    plan: company.plan,
    country: company.country,
    status: company.status,
    timezone: company.timezone,
    currency: company.currency,
    repName: company.repName,
    repPhone: company.repPhone,
    email: company.email,
    phone: company.phone,
    website: company.website,
    address: company.address,
  }}
  onSaved={(u) => {
    // optimistic UI: patch displayed company with saved values
    Object.assign(company, u);
  }}
/>

              {/* two columns; each column uses one-line rows */}
              <div className="grid gap-x-10 gap-y-1.5 md:grid-cols-2 min-w-0">
                <div className="min-w-0">
                  <DetailRow label="Code" value={company.code} />
                  <DetailRow label="Type" value={company.type} />
                  <DetailRow label="Industry" value={company.industry} />
                  <DetailRow label="Plan" value={company.plan} />
                  <DetailRow label="Country" value={company.country} />
                  <DetailRow
                    label="Website"
                    value={
                      company.website ? (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 truncate text-primary underline-offset-4 hover:underline"
                          title={company.website}
                        >
                          {displayUrl(company.website)}
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5 shrink-0"
                          >
                            <path
                              fill="currentColor"
                              d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"
                            />
                            <path
                              fill="currentColor"
                              d="M5 5h6v2H7v10h10v-4h2v6H5z"
                            />
                          </svg>
                        </a>
                      ) : undefined
                    }
                  />
                </div>

                <div className="min-w-0">
                  <DetailRow
                    label="Status"
                    value={<StatusBadge status={company.status} />}
                  />
                  <DetailRow label="Timezone" value={company.timezone} />
                  <DetailRow label="Currency" value={company.currency} />
                  <DetailRow
                    label="Main Representative"
                    value={
                      company.repName
                        ? `${company.repName}${
                            company.repPhone ? " · " + company.repPhone : ""
                          }`
                        : undefined
                    }
                  />
                  <DetailRow label="Email" value={company.email} />
                  <DetailRow label="Phone" value={company.phone} />
                  <DetailRow label="Address" value={company.address} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="md:col-span-3 shadow-sm">
            <CardContent className="px-4 py-0 sm:px-5 sm:py-0">
              <h3 className="mb-2 text-base font-semibold">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { icon: Paperclip, label: "Attach" },
                  { icon: UserPlus, label: "Contact" },
                  { icon: StickyNote, label: "Note" },
                  { icon: AlertTriangle, label: "Incident" },
                  { icon: BadgePlus, label: "Representative" },
                  { icon: Percent, label: "Discount" },
                  { icon: Scale, label: "Commission" },
                ].map(({ icon: Icon, label }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="sm"
                    className="justify-start gap-2 rounded-lg hover:bg-muted"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                ))}
                <Button
                  size="sm"
                  className="justify-start gap-2 rounded-lg sm:col-span-2"
                >
                  <Plus className="h-4 w-4" /> New Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs – add a bit more space above; keep card padding tighter */}
        <Card className="shadow-sm mt-3">
          <CardContent className="px-4 py-0 sm:px-5 sm:py-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="h-9">
                <TabsTrigger value="requests">Service Requests</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="representatives">
                  Representatives
                </TabsTrigger>
                <TabsTrigger value="entities">Entities</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
                <TabsTrigger value="discount">Discount Plan</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="credit">Credit Requests</TabsTrigger>
                <TabsTrigger value="commission">Commission Rules</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="requests" className="mt-0">
                  <ScrollArea className="w-full">
                    <div className="min-w-[880px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Department</TableHead>
                            <TableHead>Typist User Id</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>End Time</TableHead>
                            <TableHead className="text-right">
                              Nb Application
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {MOCK_REQUESTS.map((r) => (
                            <TableRow key={r.id}>
                              <TableCell className="font-medium">
                                {r.department}
                              </TableCell>
                              <TableCell>{r.typistUserId}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={statusClass(r.status)}
                                >
                                  {r.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{r.startTime}</TableCell>
                              <TableCell>{r.endTime ?? "—"}</TableCell>
                              <TableCell className="text-right">
                                {r.count ?? 0}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </ScrollArea>
                </TabsContent>

                {[
                  "invoices",
                  "representatives",
                  "entities",
                  "documents",
                  "wallet",
                  "discount",
                  "comments",
                  "credit",
                  "commission",
                ].map((k) => (
                  <TabsContent key={k} value={k} className="mt-0">
                    <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                      {k[0].toUpperCase() + k.slice(1)} content goes here.
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
