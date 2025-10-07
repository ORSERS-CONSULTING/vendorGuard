"use client";

import * as React from "react";
import Link from "next/link";
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
  page, pageSize, total, onPageChange, onPageSizeChange,
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
  const _view = view ?? defaultView;

  return (
    <Card className={cn("overflow-hidden border-border/60 shadow-none", className)}>
      {groupBy !== "none" && grouped ? (
        <GroupedResults groups={grouped} view={_view} />
      ) : _view === "list" ? (
        <ListView data={data} />
      ) : (
        <TableView data={data} />
      )}

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
    return <div className="px-5 py-12 text-center text-sm text-muted-foreground">No organizations match your filters.</div>;
  }
  return (
    <div className="divide-y">
      {groups.map((g) => (
        <GroupSection key={g.label} label={g.label} count={g.count}>
          {view === "list" ? <ListView data={g.items} /> : <TableView data={g.items} full />}
        </GroupSection>
      ))}
    </div>
  );
}

function GroupSection({
  label, count, children,
}: { label: string; count: number; children: React.ReactNode }) {
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
      <ul className="space-y-2">
        {data.map((o) => (
          <li key={o.code} className="rounded-md border border-border/60 bg-background px-3 py-2 hover:bg-muted/40">
            <div className="grid grid-cols-12 items-center gap-2 md:gap-3">
              {/* Left cluster: status • name • code */}
              <div className="col-span-12 md:col-span-5 flex min-w-0 items-center gap-2">
                <StatusDot status={o.status} />
                <Link
                  href={`/tenants/${encodeURIComponent(String(o.code))}`}
                  className="truncate text-primary underline-offset-4 hover:underline"
                  title={o.name ?? ""}
                >
                  {o.name ?? "—"}
                </Link>
                <span className="shrink-0 rounded border px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                  {o.code}
                </span>
              </div>

              {/* Middle cluster */}
              <div className="col-span-12 md:col-span-4 min-w-0 text-xs text-muted-foreground">
                <div className="flex min-w-0 items-center gap-1">
                  <span className="truncate">{o.type ?? "—"}</span>
                  <span className="mx-1">•</span>
                  <span className="truncate">{o.industry ?? "—"}</span>
                  <span className="mx-1">•</span>
                  <span className="truncate">{o.country ?? "—"}</span>
                </div>
              </div>

              {/* Right cluster */}
              <div className="col-span-12 md:col-span-3 flex items-center justify-between md:justify-end gap-2">
                <PlanBadge plan={o.plan} />
                <span className="hidden md:inline max-w-[200px] truncate text-xs text-muted-foreground" title={String(o.admin ?? "")}>
                  {o.admin ?? "—"}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------------------------- Table View ---------------------------- */

function TableView({ data, full = true }: { data: Organization[]; full?: boolean }) {
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
              <TableCell>
                <Link
                  href={`/tenants/${encodeURIComponent(String(o.code))}`}
                  className="truncate text-primary underline-offset-4 hover:underline"
                  title={o.name ?? ""}
                >
                  {o.name ?? "—"}
                </Link>
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
  onPageChange: (p: number) => void; onPageSizeChange: (n: number) => void;
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
