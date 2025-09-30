"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const KpiCard = ({ title, value, hint }:{title:string; value:string|number; hint?:string}) => (
  <Card className="shadow-sm">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </CardContent>
  </Card>
);

export default function KpiGrid({ totals }:{ totals:{ total:number; active:number; monthly:number; yearly:number }}) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <KpiCard title="Total plans" value={totals.total} />
      <KpiCard title="Active" value={totals.active} />
      <KpiCard title="Monthly" value={totals.monthly} />
      <KpiCard title="Yearly" value={totals.yearly} />
    </div>
  );
}
