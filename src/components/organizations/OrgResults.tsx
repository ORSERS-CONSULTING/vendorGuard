// src/components/organizations/OrgResults.tsx
"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Organization } from "@/lib/org";
import { StatusDot } from "./StatusDot";
import { PlanBadge } from "./PlanBadge";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type ViewMode = "list" | "table";
type GroupKey = "none" | "status" | "plan" | "country" | "type";
type Grouped = Array<{ label: string; count: number; items: Organization[] }>;

export function OrgResults({
  data,
  grouped = null,
  groupBy = "none",
  defaultView = "table",
  className,
  // pagination
  page, pageSize, total,
  onPageChange, onPageSizeChange,
  // view control + export (lifted to toolbar)
  view, onViewChange, onExport,
}: {
  data: Organization[];
  grouped?: Grouped | null;
  groupBy?: GroupKey;
  defaultView?: ViewMode;
  className?: string;

  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (n: number) => void;

  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  onExport: () => void;
}) {
  // keep local fallback if consumer forgets to pass view (but you pass it)
  const _view = view ?? defaultView;

  return (
    <Card className={cn("overflow-hidden border-border/60 shadow-none", className)}>
      {/* results */}
      {groupBy !== "none" && grouped
        ? <GroupedResults groups={grouped} view={_view} />
        : (_view === "list" ? <ListView data={data} /> : <TableView data={data} />)
      }

      {/* pagination (hide when grouped) */}
      {groupBy === "none" && (
        <PaginationFooter
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
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
          {view === "list" ? <ListView data={g.items} /> : <TableView data={g.items} full /> }
        </GroupSection>
      ))}
    </div>
  );
}

function GroupSection({ label, count, children }:{
  label: string; count: number; children: React.ReactNode;
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
          <ChevronDown className={cn("h-4 w-4 transition-transform", open ? "rotate-0" : "-rotate-90")} />
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
    return <div className="px-5 py-8 text-center text-sm text-muted-foreground">No organizations match your filters.</div>;
  }
  return (
    <div className="px-5 py-3">
      <ul className="space-y-2.5">
        {data.map((o) => (
          <li key={o.code} className="rounded-md border border-border/60 bg-background px-4 py-2.5 hover:bg-muted/40">
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
            <div className="mt-1 grid grid-cols-[1fr_auto] items-center gap-3 text-xs text-muted-foreground">
              <div className="min-w-0 truncate">
                <span className="font-mono">{o.code}</span>
                <span className="mx-2">•</span>
                <span className="truncate">{o.country ?? "—"}</span>
              </div>
              <div className="hidden max-w-[240px] truncate md:block" title={String(o.admin ?? "")}>
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
/* FULL columns restored */

function TableView({ data, full = true }: { data: Organization[]; full?: boolean }) {
  return (
    <div className="overflow-x-auto px-5 py-3">
      <Table className="min-w-[1100px] text-sm">
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow className="hover:bg-transparent">
            {/* full columns */}
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
              <TableCell><PlanBadge plan={o.plan} /></TableCell>
              <TableCell>{o.country ?? "—"}</TableCell>
              <TableCell className="truncate">{o.admin ?? "—"}</TableCell>
              <TableCell><StatusDot status={o.status} /></TableCell>
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

/* ----------------------------- Pagination ---------------------------- */

function PaginationFooter({
  page, pageSize, total, onPageChange, onPageSizeChange,
}: {
  page: number; pageSize: number; total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (n: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const prev = () => onPageChange(Math.max(1, page - 1));
  const next = () => onPageChange(Math.min(pages, page + 1));

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Show</span>
        <select
          className="h-8 rounded-md border bg-background px-2 text-sm"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span className="text-muted-foreground">entries</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-muted-foreground">Page {page} of {pages}</span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={prev} disabled={page <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={next} disabled={page >= pages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}