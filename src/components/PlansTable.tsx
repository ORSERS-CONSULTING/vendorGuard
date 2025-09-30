"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { Plan } from "./SelectedPlanCard";

const StatusDot = ({ color = "#16a34a" }:{color?:string}) => (
  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
);

export default function PlansTable({
  data, onSelect
}:{ data: Plan[]; onSelect: (p: Plan)=>void }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[280px]">Plan</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Billing Cycle</TableHead>
            <TableHead>Max Users</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((p) => (
            <TableRow key={p.id} className="cursor-pointer hover:bg-muted/40" onClick={() => onSelect(p)}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: p.color }} />
                  {p.name}
                </div>
              </TableCell>
              <TableCell>{p.price.toFixed(2)}</TableCell>
              <TableCell>{p.currency}</TableCell>
              <TableCell>{p.cycle}</TableCell>
              <TableCell>{p.maxUsers}</TableCell>
              <TableCell className="max-w-[280px] truncate text-muted-foreground">{p.description}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-3">
                  <div className="flex items-center gap-2">
                    <StatusDot color={p.status === "Active" ? "#22c55e" : "#a1a1aa"} />
                    <span className="hidden text-sm text-muted-foreground sm:inline">{p.status}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onSelect(p)}>Open</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
