// src/components/organizations/OrgFilters.tsx
"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

/* ------------------ Types ------------------ */
export type FilterState = {
  types: Set<string>;
  industries: Set<string>;
  plans: Set<string>;
};

export type FiltersData = {
  types: { value: string; count: number }[];
  industries: { value: string; count: number }[];
  plans: { value: string; count: number }[];
};

type Props = {
  value: FilterState;
  onChange: (v: FilterState) => void;
  data: FiltersData;
  className?: string;
};

/* ------------------ Clear All ------------------ */
function ClearAll({ count, onClear }: { count: number; onClear: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
      onClick={onClear}
      disabled={count === 0}
    >
      Clear all {count > 0 ? `(${count})` : ""}
    </Button>
  );
}

/* ------------------ Section ------------------ */
/** Collapsible section with optional local search and per-section clear. */
function Section({
  title,
  items,
  selected,
  onToggle,
  onClear,
  defaultVisible = 8,
  searchable = false,
  defaultOpen = true,
}: {
  title: string;
  items: { value: string; count: number }[];
  selected: Set<string>;
  onToggle: (key: string) => void;
  onClear?: () => void;
  defaultVisible?: number;
  searchable?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [expanded, setExpanded] = useState(false);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const s = q.toLowerCase();
    return items.filter((i) => i.value.toLowerCase().includes(s));
  }, [items, q]);

  const visible = expanded ? filtered : filtered.slice(0, defaultVisible);

  const selCount = selected.size;

  return (
    <section>
      {/* Section header (collapsible) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 py-2"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform text-muted-foreground",
              open ? "rotate-0" : "-rotate-90"
            )}
          />
          <h4 className="text-sm font-medium text-muted-foreground">
            {title}
          </h4>
          {selCount > 0 && (
            <span className="text-xs text-muted-foreground">({selCount})</span>
          )}
        </div>

        {onClear && selCount > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </Button>
        )}
      </button>

      {/* Content */}
      {open && (
        <div className="pb-2">
          {searchable && (
            <div className="pb-2">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={`Search ${title.toLowerCase()}…`}
                className="h-8"
              />
            </div>
          )}

          <div className="space-y-2">
            {visible.map((item) => {
              const checked = selected.has(item.value);
              return (
                <label
                  key={item.value}
                  className="flex cursor-pointer items-center justify-between gap-2 rounded-md p-1.5 hover:bg-muted/60"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => onToggle(item.value)}
                      className="mt-0.5"
                    />
                    <span className="truncate text-sm">{item.value}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.count}
                  </span>
                </label>
              );
            })}
            {!filtered.length && (
              <div className="py-2 text-xs text-muted-foreground">
                No results.
              </div>
            )}
          </div>

          {filtered.length > defaultVisible && (
            <button
              type="button"
              className="mt-2 text-xs text-primary underline underline-offset-2"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded
                ? "Show less"
                : `Show ${filtered.length - defaultVisible} more`}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

/* ------------------ Main Component ------------------ */
export function OrgFilters({ value, onChange, data, className }: Props) {
  const selectedCount =
    value.types.size + value.industries.size + value.plans.size;

  const toggle = (key: keyof FilterState, v: string) => {
    const next = new Set(value[key]);
    next.has(v) ? next.delete(v) : next.add(v);
    onChange({ ...value, [key]: next });
  };

  const clearAll = () =>
    onChange({
      types: new Set(),
      industries: new Set(),
      plans: new Set(),
    });

  const clearSection = (key: keyof FilterState) =>
    onChange({ ...value, [key]: new Set() });

  return (
    <Card className={cn("h-full border-border/60 shadow-none", className)}>
      <div className="flex h-full flex-col">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="text-base font-medium">Filters</div>
          <ClearAll count={selectedCount} onClear={clearAll} />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          <div className="space-y-3">
            <Section
              title="Organization Type"
              items={data.types}
              selected={value.types}
              onToggle={(v) => toggle("types", v)}
              onClear={() => clearSection("types")}
              defaultOpen
            />
            <Separator />

            <Section
              title="Industry"
              items={data.industries}
              selected={value.industries}
              onToggle={(v) => toggle("industries", v)}
              onClear={() => clearSection("industries")}
              defaultVisible={10}
              searchable                        // <— inline search for long list
              defaultOpen={false}               // <— starts collapsed
            />
            <Separator />

            <Section
              title="Subscription Plan"
              items={data.plans}
              selected={value.plans}
              onToggle={(v) => toggle("plans", v)}
              onClear={() => clearSection("plans")}
              defaultOpen
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
