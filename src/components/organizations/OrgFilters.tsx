"use client";

import * as React from "react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
function Section({
  title,
  items,
  selected,
  onToggle,
  defaultVisible = 8,
}: {
  title: string;
  items: { value: string; count: number }[];
  selected: Set<string>;
  onToggle: (key: string) => void;
  defaultVisible?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, defaultVisible);

  return (
    <section>
      <h4 className="mb-3 text-sm font-medium text-muted-foreground">
        {title}
      </h4>

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
      </div>

      {items.length > defaultVisible && (
        <button
          type="button"
          className="mt-2 text-xs text-primary underline underline-offset-2"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded
            ? "Show less"
            : `Show ${items.length - defaultVisible} more`}
        </button>
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
          <div className="space-y-6">
            <Section
              title="Organization Type"
              items={data.types}
              selected={value.types}
              onToggle={(v) => toggle("types", v)}
            />
            <Separator />
            <Section
              title="Industry"
              items={data.industries}
              selected={value.industries}
              onToggle={(v) => toggle("industries", v)}
              defaultVisible={10}
            />
            <Separator />
            <Section
              title="Subscription Plan"
              items={data.plans}
              selected={value.plans}
              onToggle={(v) => toggle("plans", v)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}