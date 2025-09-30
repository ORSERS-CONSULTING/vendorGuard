"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type Plan = {
  id: string; name: string; price: number; currency: "USD"|"AED"|"EUR";
  cycle: "Monthly"|"Quarterly"|"Yearly"; maxUsers: number; description: string;
  color: string; status: "Active"|"Archived"; features: string[];
};

export default function SelectedPlanCard({ plan, className }:{ plan: Plan|null; className?:string }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Selected plan</CardTitle>
      </CardHeader>
      <CardContent>
        {plan ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: plan.color }} />
              <div className="font-medium">{plan.name}</div>
              <Badge variant="secondary" className="ml-auto">{plan.cycle}</Badge>
            </div>
            <div className="text-2xl font-semibold">{plan.price.toFixed(2)} {plan.currency}</div>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
            <div className="text-sm text-muted-foreground">Max users: <span className="font-medium text-foreground">{plan.maxUsers}</span></div>
            <div className="flex flex-wrap gap-2">
              {plan.features.map((f) => <Badge key={f} variant="outline">{f}</Badge>)}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button variant="outline">Edit Plan</Button>
              <Button variant="secondary">Manage Features</Button>
              <Button variant="outline">Change Color</Button>
              <Button variant="ghost">Archive</Button>
            </div>
          </div>
        ) : <p className="text-sm text-muted-foreground">Select a plan to see details</p>}
      </CardContent>
    </Card>
  );
}
