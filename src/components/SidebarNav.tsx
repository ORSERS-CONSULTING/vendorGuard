// src/components/subscriptions/SidebarNav.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, CreditCard, PieChart, ShieldCheck, Home, ChevronDown } from "lucide-react";

// tiny helper if you don't already have shadcn's cn()
function cn(...c: Array<string | false | undefined>) { return c.filter(Boolean).join(" "); }

type Item = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: { label: string; href?: string }[];
};

const items: Item[] = [
  { label: "Dashboard", icon: Home },
  { label: "Transactions", icon: CreditCard, children: [
    { label: "Payouts" }, { label: "Incoming Payments" },
  ]},
  { label: "Business Account", icon: Layers },
  { label: "Reports", icon: PieChart, children: [
    { label: "Customers" }, { label: "Integrations" }, { label: "Reports & Insights" },
  ]},
  { label: "Security & Access", icon: ShieldCheck },
];

export default function SidebarNav() {
  const [active, setActive] = useState<string>("Dashboard");
  const [open, setOpen]   = useState<Record<string, boolean>>({ Transactions: true, Reports: true });

  const isGroupActive = (i: Item) =>
    active === i.label || i.children?.some(c => c.label === active);

  return (
    <aside className="sticky top-0 hidden h-[calc(100dvh-64px)] w-64 shrink-0 bg-transparent backdrop-blur lg:block">
      <ScrollArea className="h-full p-4">
        <div className="mb-4 px-2 text-2xl font-semibold">VendorGuard</div>

        <nav className="space-y-1">
          {items.map((i) => {
            const Icon = i.icon;
            const activeGroup = isGroupActive(i);
            const opened = open[i.label] ?? false;

            return (
              <div key={i.label} className="px-2">
                <Button
                  asChild={!!i.href}
                  onClick={() => { setActive(i.label); if (i.children) setOpen(s => ({...s, [i.label]: !opened})); }}
                  className={cn(
                    "relative w-full justify-start gap-2 rounded-xl",
                    // active white card
                    activeGroup && "bg-white text-foreground shadow-sm border",
                    !activeGroup && "hover:bg-muted",
                  )}
                  variant="ghost"
                >
                  {i.href ? (
                    <Link href={i.href}>
                      <Icon className="mr-1 h-4 w-4" />
                      {i.label}
                      {i.label === "Dashboard" && activeGroup}
                      {i.children && (
                        <ChevronDown
                          className={cn("ml-auto h-4 w-4 transition-transform", opened && "rotate-180")}
                        />
                      )}
                    </Link>
                  ) : (
                    <span className="flex w-full items-center">
                      <Icon className="mr-1 h-4 w-4" />
                      {i.label}
                      {i.children && (
                        <ChevronDown
                          className={cn("ml-auto h-4 w-4 transition-transform", opened && "rotate-180")}
                        />
                      )}
                    </span>
                  )}
                </Button>

                {i.children?.length ? (
                  <div className={cn("ml-9 mt-1 space-y-1", !opened && "hidden")}>
                    {i.children.map((c) => {
                      const childActive = active === c.label;
                      return (
                        <Button
                          key={c.label}
                          onClick={() => setActive(c.label)}
                          variant="ghost"
                          className={cn(
                            "h-8 w-full justify-start rounded-xl text-muted-foreground",
                            childActive && "bg-white text-foreground shadow-sm border"
                          )}
                        >
                          {c.label}
                        </Button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="mt-6 rounded-xl border p-3 bg-white text-foreground shadow-sm">
          <div className="text-sm font-medium">VendorGuard</div>
          <p className="text-xs text-muted-foreground">1-month free trial</p>
          <Button size="sm" className="mt-3 w-full">Try Now</Button>
        </div>
      </ScrollArea>
    </aside>
  );
}
