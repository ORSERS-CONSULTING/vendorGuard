"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Home, FileText, Users, FolderOpen, Wallet, FileCog, MessageSquare, Percent, Scale, Settings } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "#requests", label: "Service Requests", icon: FileText },
  { href: "#invoices", label: "Invoices", icon: FileCog },
  { href: "#representatives", label: "Representatives", icon: Users },
  { href: "#documents", label: "Documents", icon: FolderOpen },
  { href: "#wallet", label: "Wallet Management", icon: Wallet },
  { href: "#discount", label: "Discount Plan", icon: Percent },
  { href: "#comments", label: "Comments", icon: MessageSquare },
  { href: "#credit", label: "Credit Requests", icon: Scale },
  { href: "#settings", label: "Settings", icon: Settings },
];

export function TenantDrawer({
  open,
  onOpenChange,
  title = "Tenant Menu",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[320px] p-0">
        <SheetHeader className="px-4 py-4">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <nav className="px-2 pb-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted/70"
                onClick={() => onOpenChange(false)}
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
