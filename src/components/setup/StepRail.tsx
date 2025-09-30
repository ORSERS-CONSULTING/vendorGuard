"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type Step = {
  id: string;
  title: string;
  done?: boolean;
};

type Props = {
  steps: Step[];
  activeId?: string;
  onJump?: (id: string) => void;
  className?: string;
};

export default function StepRail({ steps, activeId, onJump, className }: Props) {
  return (
    <nav className={cn("text-sm", className)} aria-label="Setup steps">
      <ol className="space-y-1">
        {steps.map((s, i) => {
          const isActive = s.id === activeId;
          const isDone = !!s.done;

          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  onJump?.(s.id);
                  const el = document.getElementById(s.id);
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={cn(
                  "group flex w-full items-center gap-2 rounded-md px-2 py-2 text-left",
                  isActive ? "bg-muted" : "hover:bg-muted/60"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className={cn(
                    "inline-grid h-5 w-5 place-items-center rounded-full border text-[11px]",
                    isDone
                      ? "border-green-600 bg-green-600 text-white"
                      : isActive
                        ? "border-primary text-primary"
                        : "border-muted-foreground/40 text-muted-foreground"
                  )}
                >
                  {isDone ? <Check className="h-3 w-3" /> : i + 1}
                </span>

                <span
                  className={cn(
                    "truncate",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
