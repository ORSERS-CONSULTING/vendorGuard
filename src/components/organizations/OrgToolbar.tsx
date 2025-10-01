"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, List, Table2, Download, Filter, X } from "lucide-react";

type GroupKey = "none" | "status" | "plan" | "country" | "type";

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  onNewClick?: () => void;

  view: "list" | "table";
  onViewChange: (v: "list" | "table") => void;
  onExport?: () => void;

  groupBy?: GroupKey;
  onGroupByChange?: (k: GroupKey) => void;

  onOpenFilters?: () => void;
  chips?: { label: string; onClear: () => void }[];
};

const GROUP_OPTIONS: Array<{ key: GroupKey; label: string }> = [
  { key: "none", label: "None" },
  { key: "status", label: "Status" },
  { key: "plan", label: "Plan" },
  { key: "country", label: "Country" },
  { key: "type", label: "Type" },
];

export function OrgToolbar({
  query,
  onQueryChange,
  onNewClick,
  view,
  onViewChange,
  onExport,
  groupBy = "none",
  onGroupByChange,
  onOpenFilters,
  chips = [],
}: Props) {
  return (
    <div className="space-y-2">
      {/* one row, with generous gaps between clusters */}
      <div className="flex flex-wrap items-center gap-y-2">
        {/* Search (kept small) */}
        <div className="mr-12">
          <Input
            type="search"
            placeholder="Search…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="h-8 w-[200px] md:w-[260px]"
            aria-label="Search organizations"
          />
        </div>

        {/* Group pills */}
        <div className="flex items-center gap-2 mr-12">
          <span className="hidden md:inline text-xs text-muted-foreground mr-1">
            Group
          </span>
          {GROUP_OPTIONS.map(({ key, label }) => (
            <Button
              key={key}
              type="button"
              size="sm"
              variant={groupBy === key ? "default" : "outline"}
              className="h-8 px-2 text-xs"
              onClick={() => onGroupByChange?.(key)}
              aria-pressed={groupBy === key}
            >
              {label}
            </Button>
          ))}
          {groupBy !== "none" && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 px-2"
              onClick={() => onGroupByChange?.("none")}
              title="Clear grouping"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* View toggle */}
        <div className="inline-flex rounded-md border bg-background p-0.5 mr-12">
          <Button
            type="button"
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            className="h-8 px-2"
            onClick={() => onViewChange("list")}
            aria-pressed={view === "list"}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={view === "table" ? "default" : "ghost"}
            size="sm"
            className="h-8 px-2"
            onClick={() => onViewChange("table")}
            aria-pressed={view === "table"}
          >
            <Table2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Export + More filters */}
        <div className="flex items-center gap-2 mr-12">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={onExport}
          >
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={onOpenFilters}
          >
            <Filter className="h-4 w-4 mr-1" /> More filters
          </Button>
        </div>

        {/* Push the CTA all the way right */}
        <div className="ml-auto">
          <Button type="button" onClick={onNewClick} size="sm" className="h-8">
            <Plus className="mr-2 h-4 w-4" />
            New Organization
          </Button>
        </div>
      </div>

      {/* chips row */}
      {(chips.length > 0 || groupBy !== "none") && (
        <div className="flex flex-wrap items-center gap-1.5">
          {chips.map((c, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-0.5 text-xs"
            >
              {c.label}
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={c.onClear}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
