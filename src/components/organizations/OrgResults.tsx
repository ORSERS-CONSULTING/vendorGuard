// src/components/organizations/OrgResults.tsx
"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Organization } from "@/lib/org";
import { StatusDot } from "./StatusDot";
import { PlanBadge } from "./PlanBadge";
import { List, Table2, Download, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ViewMode = "list" | "table";
type GroupKey = "none" | "status" | "plan" | "country" | "type";
type Grouped = Array<{ label: string; count: number; items: Organization[] }>;

export function OrgResults({
  data,
  grouped = null,
  groupBy = "none",
  defaultView = "table",
  className,
}: {
  data: Organization[];
  grouped?: Grouped | null; // <-- new: pre-grouped sections (or null)
  groupBy?: GroupKey; // <-- new: which field we grouped by
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
    // export lean columns only (what the table shows)
    const headers = ["Name", "Code", "Plan", "Status", "Country", "Admin"];
    const rows = data.map((o) => [
      o.name ?? "",
      o.code ?? "",
      o.plan ?? "",
      o.status ?? "",
      o.country ?? "",
      o.admin ?? "",
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
    <Card
      className={cn("overflow-hidden border-border/60 shadow-none", className)}
    >
      {/* Toolbar: view toggle + export */}
      <div className="flex items-center justify-end gap-2 border-b px-5 py-2">
        <div
          className="inline-flex rounded-md border bg-background p-0.5"
          role="tablist"
          aria-label="Results view"
        >
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

      {/* Grouped view uses same list/table modes but inside collapsible sections */}
      {groupBy !== "none" && grouped ? (
        <GroupedResults groups={grouped} view={view} />
      ) : view === "list" ? (
        <ListView data={data} />
      ) : (
        <TableView data={data} />
      )}
    </Card>
  );
}

/* ------------------------- Grouped Sections -------------------------- */

function GroupedResults({ groups, view }: { groups: Grouped; view: ViewMode }) {
  if (!groups?.length) {
    return (
      <div className="px-5 py-12 text-center text-sm text-muted-foreground">
        No organizations match your filters.
      </div>
    );
  }

  return (
    <div className="divide-y">
      {groups.map((g) => (
        <GroupSection key={g.label} label={g.label} count={g.count}>
          {view === "list" ? (
            <ListView data={g.items} />
          ) : (
            <TableView data={g.items} />
          )}
        </GroupSection>
      ))}
    </div>
  );
}

function GroupSection({
  label,
  count,
  children,
}: {
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(true);
  return (
    <section>
      <button
        onClick={() => setOpen((v) => !v)}
        className="sticky top-0 z-10 flex w-full items-center justify-between gap-3 bg-muted/40 px-5 py-2 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              open ? "rotate-0" : "-rotate-90"
            )}
          />
          <span className="font-medium">{label || "—"}</span>
          <span className="text-xs text-muted-foreground">({count})</span>
        </div>
      </button>
      {open && <div className="pt-2">{children}</div>}
    </section>
  );
}

/* ----------------------------- List View ----------------------------- */

function ListView({ data }: { data: Organization[] }) {
  if (!data?.length) {
    return (
      <div className="px-5 py-8 text-center text-sm text-muted-foreground">
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

            {/* Row 2 meta (lean) */}
            <div className="mt-1 grid grid-cols-[1fr_auto] items-center gap-3 text-xs text-muted-foreground">
              <div className="min-w-0 truncate">
                <span className="font-mono">{o.code}</span>
                <span className="mx-2">•</span>
                <span className="truncate">{o.country ?? "—"}</span>
              </div>
              <div
                className="hidden max-w-[240px] truncate md:block"
                title={String(o.admin ?? "")}
              >
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
/* Lean columns: Name, Code, Plan, Status, Country, Admin */

function TableView({ data }: { data: Organization[] }) {
  return (
    <div className="overflow-x-auto px-5 py-3">
      <Table className="min-w-[900px] text-sm">
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[320px]">Name</TableHead>
            <TableHead className="w-28">Code</TableHead>
            <TableHead className="w-40">Plan</TableHead>
            <TableHead className="w-48">Status</TableHead>
            <TableHead className="w-40">Country</TableHead>
            <TableHead className="w-[260px]">Admin</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((o) => (
            <TableRow key={o.code} className="hover:bg-muted/40">
              <TableCell className="text-primary underline-offset-4 hover:underline cursor-pointer">
                {o.name ?? "—"}
              </TableCell>
              <TableCell className="font-mono">{o.code}</TableCell>
              <TableCell>
                <PlanBadge plan={o.plan} />
              </TableCell>
              <TableCell>
                <StatusDot status={o.status} />
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {o.country ?? "—"}
              </TableCell>
              <TableCell className="truncate">{o.admin ?? "—"}</TableCell>
            </TableRow>
          ))}
          {!data.length && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-12 text-center text-sm text-muted-foreground"
              >
                No organizations match your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
