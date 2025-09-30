"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Upload, Plus } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import KpiGrid from "@/components/KpiGrid";
import CashflowAreaChart from "@/components/CashflowAreaChart";
import OutflowsDonut from "@/components/OutflowsDonut";
import FiltersBar from "@/components/FiltersBar";
import SelectedPlanCard, { Plan } from "@/components/SelectedPlanCard";
import PlansTable from "@/components/PlansTable";
import SettingsTabs from "@/components/SettingsTabs";
import HeaderDatePicker from "@/components/HeaderDatePicker";

const INITIAL_PLANS: Plan[] = [
  { id: "basic", name: "Basic Plan", price: 49.99, currency: "USD", cycle: "Monthly", maxUsers: 10, description: "Entry-level plan for small teams", color: "#ffe100", status: "Active", features: ["Email support"] },
  { id: "trial", name: "Trial", price: 0, currency: "USD", cycle: "Monthly", maxUsers: 5, description: "Trial Plan", color: "#c7fffa", status: "Active", features: ["Limited usage"] },
  { id: "pro", name: "Professional Plan", price: 129.99, currency: "USD", cycle: "Quarterly", maxUsers: 50, description: "For growing businesses with more usage.", color: "#008000", status: "Active", features: ["Priority support", "Advanced analytics"] },
  { id: "ent", name: "Enterprise Plan", price: 399.99, currency: "USD", cycle: "Yearly", maxUsers: 200, description: "Full feature set and premium support.", color: "#ff0000", status: "Active", features: ["SLA", "Dedicated manager"] },
  { id: "uae", name: "UAE Plan", price: 70.99, currency: "AED", cycle: "Yearly", maxUsers: 300, description: "Plan for all UAE companies", color: "#00ff84", status: "Active", features: ["Arabic UI", "Local Tax Rules"] },
];

export default function Page() {
  const [plans] = useState<Plan[]>(INITIAL_PLANS);
  const [search, setSearch] = useState("");
  const [cycle, setCycle] = useState("all");
  const [currency, setCurrency] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Plan | null>(plans[plans.length - 1]);

  const totals = useMemo(() => ({
    total: plans.length,
    active: plans.filter(p => p.status === "Active").length,
    monthly: plans.filter(p => p.cycle === "Monthly").length,
    yearly: plans.filter(p => p.cycle === "Yearly").length
  }), [plans]);

  const filtered = useMemo(() => {
    return plans.filter((p) => {
      const s = search.trim().toLowerCase();
      const okSearch = s ? (p.name + p.description).toLowerCase().includes(s) : true;
      const okCycle = cycle === "all" ? true : p.cycle === (cycle as any);
      const okCurrency = currency === "all" ? true : p.currency === (currency as any);
      const okStatus = status === "all" ? true : p.status === (status as any);
      return okSearch && okCycle && okCurrency && okStatus;
    });
  }, [plans, search, cycle, currency, status]);

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of balances, cashflow and plans.</p>
        </div>
        <div className="flex items-center gap-2">
          <HeaderDatePicker />
          <Button variant="outline" className="hidden sm:inline-flex"><Upload className="mr-2 h-4 w-4" /> Export CSV</Button>
          <Button><Plus className="mr-2 h-4 w-4" /> New Plan</Button>
          <Button variant="ghost" size="icon" className="sm:hidden"><Settings className="h-5 w-5" /></Button>
        </div>
      </div>

      <KpiGrid totals={totals} />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <CashflowAreaChart />
        <OutflowsDonut />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <FiltersBar
          className="lg:col-span-2"
          search={search} onSearch={setSearch}
          cycle={cycle} onCycle={setCycle}
          currency={currency} onCurrency={setCurrency}
          status={status} onStatus={setStatus}
        />
        <SelectedPlanCard plan={selected} className="lg:col-span-1" />
      </div>

      <div className="mt-6">
        <PlansTable data={filtered} onSelect={setSelected} />
      </div>

      <div className="mt-6">
        <SettingsTabs />
      </div>
    </DashboardShell>
  );
}
