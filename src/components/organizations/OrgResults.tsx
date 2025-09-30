// src/components/organizations/OrgResults.tsx
"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Organization } from "@/lib/org";
import { StatusDot } from "./StatusDot";
import { PlanBadge } from "./PlanBadge";
import { List, Table2, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ViewMode = "list" | "table";

export function OrgResults({
  data,
  defaultView = "table",
  className,
}: {
  data: Organization[];
  defaultView?: ViewMode;
  className?: string;
}) {
  // Start with SSR-safe default and hydrate to user preference
  const [view, setView] = React.useState<ViewMode>(defaultView);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("orgView") as ViewMode | null;
      if (saved === "list" || saved === "table") setView(saved);
    } catch {}
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("orgView", view);
    } catch {}
  }, [view]);

  const exportCsv = React.useCallback(() => {
    const headers = [
      "Code",
      "Name",
      "Type",
      "Industry",
      "Plan",
      "Country",
      "Admin",
      "Status",
      "Timezone",
      "Currency",
    ];
    const rows = data.map((o) => [
      o.code ?? "",
      o.name ?? "",
      o.type ?? "",
      o.industry ?? "",
      o.plan ?? "",
      o.country ?? "",
      o.admin ?? "",
      o.status ?? "",
      o.timezone ?? "",
      o.currency ?? "",
    ]);
    const csv = [headers, ...rows]
      .map((r) =>
        r
          .map((v) => {
            const s = String(v ?? "");
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "organizations.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  return (
    <Card className={cn("overflow-hidden border-border/60 shadow-none", className)}>
      {/* Toolbar: view toggle + export */}
      <div className="flex items-center justify-end gap-2 border-b px-5 py-2">
        <div className="inline-flex rounded-md border bg-background p-0.5" role="tablist" aria-label="Results view">
          <Button
            type="button"
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            className="h-8 gap-1"
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            role="tab"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">List</span>
          </Button>
          <Button
            type="button"
            variant={view === "table" ? "default" : "ghost"}
            size="sm"
            className="h-8 gap-1"
            onClick={() => setView("table")}
            aria-pressed={view === "table"}
            role="tab"
          >
            <Table2 className="h-4 w-4" />
            <span className="hidden sm:inline">Table</span>
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1"
          onClick={exportCsv}
          title="Export CSV"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>

      {view === "list" ? <ListView data={data} /> : <TableView data={data} />}
    </Card>
  );
}

/* ----------------------------- List View ----------------------------- */

function ListView({ data }: { data: Organization[] }) {
  if (!data?.length) {
    return (
      <div className="px-5 py-12 text-center text-sm text-muted-foreground">
        No organizations match your filters.
      </div>
    );
  }

  return (
    <div className="px-5 py-3">
      <ul className="space-y-2.5">
        {data.map((o) => (
          <li
            key={o.code}
            className="rounded-md border border-border/60 bg-background px-4 py-2.5 hover:bg-muted/40"
          >
            {/* Row 1 */}
            <div className="grid grid-cols-[1fr_auto] items-center gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <StatusDot status={o.status} />
                <a
                  href={`/organizations/${encodeURIComponent(String(o.code))}`}
                  title={String(o.name ?? "")}
                  className="truncate text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  {o.name ?? "—"}
                </a>
              </div>
              <div className="justify-self-end">
                <PlanBadge plan={o.plan} />
              </div>
            </div>

            {/* Row 2 meta */}
            <div className="mt-1 grid grid-cols-[1fr_auto] items-center gap-3 text-xs text-muted-foreground">
              <div className="min-w-0 truncate">
                <span className="font-mono">{o.code}</span>
                <span className="mx-2">•</span>
                <span className="truncate">{o.type ?? "—"}</span>
                <span className="mx-2">•</span>
                <span className="truncate">{o.industry ?? "—"}</span>
                <span className="mx-2">•</span>
                <span className="truncate">{o.country ?? "—"}</span>
              </div>
              <div className="hidden max-w-[220px] truncate md:block" title={String(o.admin ?? "")}>
                {o.admin ?? "—"}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------------------------- Table View ---------------------------- */

function TableView({ data }: { data: Organization[] }) {
  return (
    <div className="overflow-x-auto px-5 py-3">
      <Table className="min-w-[1100px] text-sm">
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-24">Code</TableHead>
            <TableHead className="w-[260px]">Name</TableHead>
            <TableHead className="w-32">Type</TableHead>
            <TableHead className="w-40">Industry</TableHead>
            <TableHead className="w-40">Plan</TableHead>
            <TableHead className="w-40">Country</TableHead>
            <TableHead className="w-[220px]">Admin Person</TableHead>
            <TableHead className="w-48">Status</TableHead>
            <TableHead className="w-48">Timezone</TableHead>
            <TableHead className="w-28">Currency</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((o) => (
            <TableRow key={o.code} className="hover:bg-muted/40">
              <TableCell className="font-medium">{o.code}</TableCell>
              <TableCell className="text-primary underline-offset-4 hover:underline cursor-pointer">
                {o.name ?? "—"}
              </TableCell>
              <TableCell>{o.type ?? "—"}</TableCell>
              <TableCell>{o.industry ?? "—"}</TableCell>
              <TableCell>
                <PlanBadge plan={o.plan} />
              </TableCell>
              <TableCell>{o.country ?? "—"}</TableCell>
              <TableCell className="truncate">{o.admin ?? "—"}</TableCell>
              <TableCell>
                <StatusDot status={o.status} />
              </TableCell>
              <TableCell className="whitespace-nowrap">{o.timezone ?? "—"}</TableCell>
              <TableCell className="whitespace-nowrap">{o.currency ?? "—"}</TableCell>
            </TableRow>
          ))}
          {!data.length && (
            <TableRow>
              <TableCell colSpan={10} className="py-12 text-center text-sm text-muted-foreground">
                No organizations match your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
