"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useId } from "react";

const data = [
  { year: 2019, value: 35 },
  { year: 2020, value: 90 },
  { year: 2021, value: 70 },
  { year: 2022, value: 95 },
  { year: 2023, value: 40 },
  { year: 2024, value: 75 },
  { year: 2025, value: 105 },
];

export default function CashflowAreaChart() {
  const gid = useId(); // unique gradient id if you render multiple charts

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Cashflow</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 0, right: 0 }}>
              <defs>
                <linearGradient id={`cf-${gid}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="6%"  stopColor="var(--primary)" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
              <XAxis dataKey="year" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--primary)"
                strokeWidth={2}
                fill={`url(#cf-${gid})`}
                dot={{ r: 3, stroke: "white", strokeWidth: 1, fill: "var(--primary)" }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
