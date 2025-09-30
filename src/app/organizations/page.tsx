// src/app/organizations/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { OrgToolbar } from "@/components/organizations/OrgToolbar";
import { OrgFilters, type FilterState } from "@/components/organizations/OrgFilters";
import { NewOrgDialog } from "@/components/organizations/NewOrgDialog";
import type { Organization } from "@/lib/org";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { OrgResults } from "@/components/organizations/OrgResults";

type OrdsCollection<T> = { items: T[] } & Partial<{
  hasMore: boolean;
  limit: number;
  offset: number;
  count: number;
}>;

type FilterFacet = { value: string; count: number };
type FiltersResponse = {
  facets: { types: FilterFacet[]; industries: FilterFacet[]; plans: FilterFacet[] };
  asOf: string;
};

type NewOrgForm = {
  name: string;
  country: string;            // country name (DB maps to ID)
  plan: string;               // plan name (DB maps to ID)
  contactPerson: string;
  contactEmail: string;
  mobile?: string;
  international: boolean;
};

export default function OrganizationsPage() {
  // UI state
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    types: new Set(),
    industries: new Set(),
    plans: new Set(),
  });
  const [openFilters, setOpenFilters] = useState(false);
  const [openNew, setOpenNew] = useState(false);

  // Dynamic rows + loading/error
  const [rows, setRows] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Filter facets (from /api/filters)
  const [facets, setFacets] = useState<FiltersResponse["facets"]>({
    types: [],
    industries: [],
    plans: [],
  });

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

  // Fetch organizations
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        await loadOrganizations(ac.signal);
        setErr(null);
      } catch (e: any) {
        if (e?.name !== "AbortError") setErr(e?.message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  // Fetch filter facets (once)
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        await loadFilters(ac.signal);
      } catch (e: any) {
        if (e?.name !== "AbortError") console.error("Failed to fetch filters", e);
      }
    })();
    return () => ac.abort();
  }, []);

  // Client-side search + filters applied to dynamic rows
  const tableData = useMemo(() => {
    return rows
      .filter((o) =>
        query
          ? `${o.code} ${o.name} ${o.industry} ${o.country} ${o.plan} ${o.type}`
              .toLowerCase()
              .includes(query.toLowerCase())
          : true
      )
      .filter((o) => (filters.types.size ? filters.types.has((o.type ?? "") as any) : true))
      .filter((o) => (filters.industries.size ? filters.industries.has((o.industry ?? "") as any) : true))
      .filter((o) => (filters.plans.size ? filters.plans.has((o.plan ?? "") as any) : true));
  }, [rows, query, filters]);

  // --- create handler passed to dialog ---
  async function handleCreate(form: NewOrgForm) {
    // Send NAMES; backend maps to IDs
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
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(body?.error || `Create failed (upstream ${body?.upstreamStatus ?? res.status})`);
    }

    // Refresh table + facets after creation
    const ac = new AbortController();
    try {
      setLoading(true);
      await Promise.all([loadOrganizations(ac.signal), loadFilters(ac.signal)]);
    } finally {
      setLoading(false);
      ac.abort(); // ensure no leaks
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-20 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full w-full items-center justify-between gap-3 px-6">
          <h1 className="text-lg font-semibold tracking-tight">List of Organizations</h1>

          {/* Filters sheet (mobile) */}
          <Sheet open={openFilters} onOpenChange={setOpenFilters}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="sm">
                <PanelLeft className="mr-2 h-4 w-4" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] p-0">
              <SheetHeader className="px-4 py-4">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-6">
                <OrgFilters value={filters} onChange={setFilters} data={facets} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Body */}
      <div className="grid w-full flex-1 min-h-0 grid-cols-12 gap-4 md:gap-6 px-4 md:px-6 xl:px-8 pt-0 pb-6 overflow-hidden">
        {/* Sidebar filters (desktop) */}
        <aside className="col-span-12 hidden lg:col-span-3 xl:col-span-2 lg:block pt-6">
          <div className="sticky h-[calc(100vh-4rem)] overflow-hidden">
            <OrgFilters value={filters} onChange={setFilters} data={facets} className="h-full" />
          </div>
        </aside>

        {/* Main content: dynamic table */}
        <main className="col-span-12 lg:col-span-9 xl:col-span-10 min-h-0 overflow-auto">
          <div className="pr-5 pt-6 pb-3">
            <OrgToolbar query={query} onQueryChange={setQuery} onNewClick={() => setOpenNew(true)} />
          </div>

          {loading ? (
            <div className="rounded-md border px-5 py-6 text-sm text-muted-foreground">Loading organizations…</div>
          ) : err ? (
            <div className="rounded-md border px-5 py-6 text-sm text-red-600">Failed to load organizations: {err}</div>
          ) : (
            <OrgResults data={tableData} defaultView="table" />
          )}
        </main>
      </div>

      {/* New Organization modal */}
      <NewOrgDialog
        open={openNew}
        onOpenChange={setOpenNew}
        onCreate={async (form) => {
          await handleCreate(form);
          setOpenNew(false);
        }}
      />
    </div>
  );
}
