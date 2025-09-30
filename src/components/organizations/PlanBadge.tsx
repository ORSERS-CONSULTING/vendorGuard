// src/components/organizations/PlanBadge.tsx
"use client";

import { Badge } from "@/components/ui/badge";

type Props = { plan?: string | null; className?: string };

export function PlanBadge({ plan, className }: Props) {
  // Normalize safely
  const key = String(plan ?? "")
    .trim()
    .toLowerCase();

  // Map known plans -> label + style. Keep a sane default.
  const map: Record<
    string,
    {
      label: string;
      variant?: "default" | "secondary" | "destructive" | "outline";
    }
  > = {
    free: { label: "Free", variant: "secondary" },
    basic: { label: "Basic", variant: "secondary" },
    starter: { label: "Starter", variant: "secondary" },
    pro: { label: "Pro", variant: "default" },
    premium: { label: "Premium", variant: "default" },
    enterprise: { label: "Enterprise", variant: "outline" },
  };

  const cfg = map[key] ?? {
    label: plan ? String(plan) : "—",
    variant: plan ? "outline" : "secondary",
  };

  return (
    <Badge variant={cfg.variant} className={className}>
      {cfg.label}
    </Badge>
  );
}
