"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  onNewClick?: () => void; // ← add this to open your modal
};

export function OrgToolbar({ query, onQueryChange, onNewClick }: Props) {
  return (
    <div className="grid w-full grid-cols-[1fr_auto] items-center gap-4">
      <Input
        type="search"
        placeholder="Search organizations…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full"
        aria-label="Search organizations"
      />
      <Button
        type="button"
        onClick={onNewClick}
        className="whitespace-nowrap"
      >
        <Plus className="mr-2 h-4 w-4" />
        New Organization
      </Button>
    </div>
  );
}
