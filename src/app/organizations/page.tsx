// src/app/organizations/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { OrgToolbar } from "@/components/organizations/OrgToolbar";
import { OrgFilters, type FilterState } from "@/components/organizations/OrgFilters";
import { NewOrgDialog } from "@/components/organizations/NewOrgDialog";
import type { Organization } from "@/lib/org";
import { Button } from "@/components/ui/button";
import { PanelLeft, User } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { OrgResults } from "@/components/organizations/OrgResults";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type OrdsCollection<T> = { items: T[] } & Partial<{ hasMore: boolean; limit: number; offset: number; count: number }>;

type FilterFacet = { value: string; count: number };
type FiltersResponse = { facets: { types: FilterFacet[]; industries: FilterFacet[]; plans: FilterFacet[] }; asOf: string };

type NewOrgForm = {
  name: string; country: string; plan: string; contactPerson: string; contactEmail: string; mobile?: string; international: boolean;
};

// grouping key
type GroupKey = "none" | "status" | "plan" | "country" | "type";

export default function OrganizationsPage() {
  // UI state
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({ types: new Set(), industries: new Set(), plans: new Set() });
  const [openFilters, setOpenFilters] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [groupBy, setGroupBy] = useState<GroupKey>("none");

  // table / list view & pagination
  const [view, setView] = useState<"list" | "table">("table");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dynamic rows + loading/error
  const [rows, setRows] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Filter facets
  const [facets, setFacets] = useState<FiltersResponse["facets"]>({ types: [], industries: [], plans: [] });

  // --- data loaders ---
  async function loadOrganizations(signal?: AbortSignal) {
    const res = await fetch(`/api/organizations`, { cache: "no-store", signal });
    if (!res.ok) throw new Error(`Upstream ${res.status}`);
    const json = (await res.json()) as OrdsCollection<Organization>;
    setRows(json.items ?? []);
  }
  async function loadFilters(signal?: AbortSignal) {
    const res = await fetch(`/api/filters`, { cache: "no-store", signal });
    if (!res.ok) throw new Error(`Upstream ${res.status}`);
    const json = (await res.json()) as FiltersResponse;
    setFacets(json.facets);
  }

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try { setLoading(true); await loadOrganizations(ac.signal); setErr(null); }
      catch (e: any) { if (e?.name !== "AbortError") setErr(e?.message ?? "Failed to load"); }
      finally { setLoading(false); }
    })();
    return () => ac.abort();
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    (async () => { try { await loadFilters(ac.signal); } catch {} })();
    return () => ac.abort();
  }, []);

  // filtered data
  const filtered = useMemo(() => {
    return rows
      .filter((o) =>
        query
          ? `${o.code} ${o.name} ${o.industry} ${o.country} ${o.plan} ${o.type}`.toLowerCase().includes(query.toLowerCase())
          : true
      )
      .filter((o) => (filters.types.size ? filters.types.has((o.type ?? "") as any) : true))
      .filter((o) => (filters.industries.size ? filters.industries.has((o.industry ?? "") as any) : true))
      .filter((o) => (filters.plans.size ? filters.plans.has((o.plan ?? "") as any) : true));
  }, [rows, query, filters]);

  // reset to page 1 when filters/search change
  useEffect(() => { setPage(1); }, [query, filters, groupBy, pageSize]);

  // grouped sections
  const grouped = useMemo(() => {
    if (groupBy === "none") return null;
    const keyOf = (o: Organization) =>
      (groupBy === "status"  && (o.status  ?? "—")) ||
      (groupBy === "plan"    && (o.plan    ?? "—")) ||
      (groupBy === "country" && (o.country ?? "—")) ||
      (groupBy === "type"    && (o.type    ?? "—")) || "—";

    const map = new Map<string, Organization[]>();
    for (const r of filtered) {
      const k = keyOf(r);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(r);
    }
    return Array.from(map.entries())
      .sort((a,b) => a[0].localeCompare(b[0]))
      .map(([label, items]) => ({ label, count: items.length, items }));
  }, [filtered, groupBy]);

  // pagination: apply only when not grouped
  const total = filtered.length;
  const pagedData = useMemo(() => {
    if (groupBy !== "none") return filtered; // show all when grouped
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, groupBy, page, pageSize]);

  // export (current filtered set)
  const handleExport = () => {
    const headers = ["Code","Name","Type","Industry","Plan","Country","Admin","Status","Timezone","Currency"];
    const rows = filtered.map((o) => [
      o.code ?? "", o.name ?? "", o.type ?? "", o.industry ?? "", o.plan ?? "",
      o.country ?? "", o.admin ?? "", o.status ?? "", o.timezone ?? "", o.currency ?? "",
    ]);
    const csv = [headers, ...rows].map((r) =>
      r.map((v) => {
        const s = String(v ?? "");
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      }).join(",")
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "organizations.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // chips for active filters
  const chips = [
    ...Array.from(filters.types).map((v) => ({ label: v, onClear: () => setFilters((x) => ({ ...x, types: new Set([...x.types].filter((t) => t !== v)) })) })),
    ...Array.from(filters.industries).map((v) => ({ label: v, onClear: () => setFilters((x) => ({ ...x, industries: new Set([...x.industries].filter((t) => t !== v)) })) })),
    ...Array.from(filters.plans).map((v) => ({ label: v, onClear: () => setFilters((x) => ({ ...x, plans: new Set([...x.plans].filter((t) => t !== v)) })) })),
  ];

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      {/* Header with profile */}
      <div className="sticky top-0 z-20 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full w-full items-center justify-between gap-3 px-6">
          <div className="flex items-center gap-3">
            {/* mobile filters trigger */}
            <Sheet open={openFilters} onOpenChange={setOpenFilters}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="sm">
                  <PanelLeft className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] p-0">
                <SheetHeader className="px-4 py-4"><SheetTitle></SheetTitle></SheetHeader>
                <div className="px-4 pb-6"><OrgFilters value={filters} onChange={setFilters} data={facets} /></div>
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold tracking-tight">List of Organizations</h1>
          </div>

          {/* Profile menu (top-right) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Eric Oduola</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => (window.location.href = "/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => (window.location.href = "/logout")}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Body */}
      <div className="grid w-full flex-1 min-h-0 grid-cols-12 gap-4 md:gap-6 px-4 md:px-6 xl:px-8 pt-0 pb-6 overflow-hidden">
        {/* Sidebar filters hidden on desktop by default — use “More filters” in toolbar */}
        {/* <aside className="col-span-12 hidden lg:col-span-3 xl:col-span-2 lg:block pt-6">...</aside> */}

        <main className="col-span-12 min-h-0 overflow-auto">
          <div className="pr-5 pt-6 pb-3">
            <OrgToolbar
              query={query}
              onQueryChange={setQuery}
              onNewClick={() => setOpenNew(true)}
              view={view}
              onViewChange={setView}
              onExport={handleExport}
              groupBy={groupBy}
              onGroupByChange={setGroupBy}
              onOpenFilters={() => setOpenFilters(true)}
              chips={chips}
            />
          </div>

          {loading ? (
            <div className="rounded-md border px-5 py-6 text-sm text-muted-foreground">Loading organizations…</div>
          ) : err ? (
            <div className="rounded-md border px-5 py-6 text-sm text-red-600">Failed to load organizations: {err}</div>
          ) : (
            <OrgResults
              data={pagedData}
              grouped={grouped}
              groupBy={groupBy}
              view={view}
              onViewChange={setView}
              onExport={handleExport}
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </main>
      </div>

      {/* New Organization modal */}
      <NewOrgDialog
        open={openNew}
        onOpenChange={setOpenNew}
        onCreate={async (form) => {
          // create then refresh
          const payload = {
            p_tenant_name: form.name.trim(),
            p_country_name: form.country.trim(),
            p_subscription_plan_name: form.plan.trim(),
            p_contact_person: form.contactPerson.trim(),
            p_contact_email: form.contactEmail.trim(),
            p_contact_phone: form.mobile?.trim() || null,
            p_is_international: form.international ? 1 : 0,
            p_created_by: "VENDORGUARD",
          };
          const res = await fetch("/api/organizations", {
            method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
          });
          const body = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(body?.error || `Create failed (${body?.upstreamStatus ?? res.status})`);
          const ac = new AbortController();
          try { setLoading(true); await Promise.all([loadOrganizations(ac.signal), loadFilters(ac.signal)]); }
          finally { setLoading(false); ac.abort(); }
          setOpenNew(false);
        }}
      />
    </div>
  );
}
