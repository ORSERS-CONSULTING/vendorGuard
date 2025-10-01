"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Plus,
  List,
  Table2,
  Download,
  Filter,
  Layers,
  Check,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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

const GROUP_LABELS: Record<GroupKey, string> = {
  none: "No groups",
  status: "Status",
  plan: "Plan",
  country: "Country",
  type: "Type",
};

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
      {/* single row with larger spacing between clusters */}
      <div className="flex flex-wrap items-center gap-y-2 w-full">
        {/* 1) Search – small */}
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

        {/* 2) Group + Filters (together) */}
        <div className="flex items-center gap-6 mr-12">
          {/* Group popover: shows current selection; menu on click */}
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2">
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {GROUP_LABELS[groupBy]}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-1" align="start">
              {(
                ["none", "status", "plan", "country", "type"] as GroupKey[]
              ).map((k) => (
                <button
                  key={k}
                  onClick={() => onGroupByChange?.(k)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
                  )}
                >
                  <span>{GROUP_LABELS[k]}</span>
                  {groupBy === k && <Check className="h-4 w-4" />}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={onOpenFilters}
          >
            <Filter className="h-4 w-4 mr-1" />
            More filters
          </Button>
        </div>

        {/* 3) Table/View + Export (next to each other) */}
        <div className="flex items-center gap-6 mr-8">
          <div className="inline-flex rounded-md border bg-background p-0.5">
            <Button
              type="button"
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              className="h-8 px-2"
              onClick={() => onViewChange("list")}
              aria-pressed={view === "list"}
              title="List view"
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
              title="Table view"
            >
              <Table2 className="h-4 w-4" />
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={onExport}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>

        {/* 4) New Organization pinned right */}
        <div className="ml-auto">
          <Button type="button" onClick={onNewClick} size="sm" className="h-8">
            <Plus className="mr-2 h-4 w-4" />
            New Organization
          </Button>
        </div>
      </div>

      {/* chips row (unchanged) */}
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
