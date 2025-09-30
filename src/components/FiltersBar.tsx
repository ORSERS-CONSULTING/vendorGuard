"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter, Search } from "lucide-react";

type Props = {
  search: string;
  onSearch: (s: string) => void;
  cycle: string; onCycle: (v: string)=>void;
  currency: string; onCurrency: (v: string)=>void;
  status: string; onStatus: (v: string)=>void;
  className?: string;
};

export default function FiltersBar({
  search, onSearch, cycle, onCycle, currency, onCurrency, status, onStatus, className
}: Props) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search plans..." value={search} onChange={(e)=>onSearch(e.target.value)} />
          </div>

          <Select value={cycle} onValueChange={onCycle}>
            <SelectTrigger className="md:w-[160px]"><SelectValue placeholder="All cycles" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cycles</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Quarterly">Quarterly</SelectItem>
              <SelectItem value="Yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          <Select value={currency} onValueChange={onCurrency}>
            <SelectTrigger className="md:w-[160px]"><SelectValue placeholder="All currencies" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All currencies</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="AED">AED</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={onStatus}>
            <SelectTrigger className="md:w-[160px]"><SelectValue placeholder="All statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="md:ml-auto"><Filter className="mr-2 h-4 w-4"/> More filters <ChevronDown className="ml-1 h-4 w-4"/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Quick Toggles</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Show archived</DropdownMenuItem>
              <DropdownMenuItem>Low-code plans</DropdownMenuItem>
              <DropdownMenuItem>High user limits</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
