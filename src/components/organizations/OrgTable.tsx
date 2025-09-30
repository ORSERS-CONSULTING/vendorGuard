"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Organization } from "@/lib/org";
import { StatusDot } from "./StatusDot";
import { PlanBadge } from "./PlanBadge";

export function OrgTable({ data }: { data: Organization[] }) {
  return (
    <Card className="overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <div className="text-sm text-muted-foreground">
          Total Row Count{" "}
          <span className="font-medium text-foreground">{data.length}</span>
        </div>
      </div>

      {/* horizontal scroll only; vertical is handled by <main> */}
      <div className="overflow-x-auto">
        <Table className="min-w-[1100px] text-sm">
          {/* sticky within the main scroll area */}
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-24">Code</TableHead>
              <TableHead className="w-[260px]">Name</TableHead>
              <TableHead className="w-32">Type</TableHead>
              <TableHead className="w-40">Industry</TableHead>
              <TableHead className="w-40">Plan</TableHead>
              <TableHead className="w-40">Country</TableHead>
              <TableHead className="w-[220px]">Admin Person</TableHead>
              <TableHead className="w-48">Status</TableHead>
              <TableHead className="w-48">Timezone</TableHead>
              <TableHead className="w-28">Currency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((o) => (
              <TableRow key={o.code} className="hover:bg-muted/40">
                <TableCell className="font-medium">{o.code}</TableCell>
                <TableCell className="text-primary underline-offset-4 hover:underline cursor-pointer">
                  {o.name}
                </TableCell>
                <TableCell>{o.type}</TableCell>
                <TableCell>{o.industry}</TableCell>
                <TableCell>
                  <PlanBadge plan={o.plan} />
                </TableCell>
                <TableCell>{o.country}</TableCell>
                <TableCell className="truncate">{o.admin}</TableCell>
                <TableCell>
                  <StatusDot status={o.status} />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {o.timezone}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {o.currency}
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  No organizations match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
