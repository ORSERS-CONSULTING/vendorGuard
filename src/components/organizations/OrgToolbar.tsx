"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type GroupKey = "none" | "status" | "plan" | "country" | "type";

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  onNewClick?: () => void;
  groupBy?: GroupKey;                       // ← new
  onGroupByChange?: (k: GroupKey) => void;  // ← new
};

export function OrgToolbar({
  query,
  onQueryChange,
  onNewClick,
  groupBy = "none",
  onGroupByChange,
}: Props) {
  return (
    <div className="grid w-full grid-cols-[1fr_auto_auto] items-center gap-3">
      <Input
        type="search"
        placeholder="Search organizations…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full"
        aria-label="Search organizations"
      />

      {/* Group by */}
      <div className="w-[160px]">
        <Select
          value={groupBy}
          onValueChange={(v) => onGroupByChange?.(v as GroupKey)}
        >
          <SelectTrigger aria-label="Group by">
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No groups</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="plan">Plan</SelectItem>
            <SelectItem value="country">Country</SelectItem>
            <SelectItem value="type">Type</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="button" onClick={onNewClick} className="whitespace-nowrap">
        <Plus className="mr-2 h-4 w-4" />
        New Organization
      </Button>
    </div>
  );
}
