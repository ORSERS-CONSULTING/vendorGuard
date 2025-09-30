"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Vendor Payments", value: 9450 },
  { name: "Employee Salaries", value: 8000 },
  { name: "Software", value: 3120 },
  { name: "Marketing", value: 6980 },
  { name: "Ops", value: 8750 },
];

const BRAND = "oklch(var(--primary))";
const PIE_COLORS = [
  BRAND,
  "#59C5EA",  // light aqua
  "#2CA9C2",
  "#1D7F96",
  "#105B70",
];

export default function OutflowsDonut() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Outflows</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                  {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
