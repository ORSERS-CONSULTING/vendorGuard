"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type Props = { done: boolean; label: string };

export default function ChecklistRow({ done, label }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "grid h-5 w-5 place-items-center rounded-full border",
          done
            ? "border-green-600 bg-green-600 text-white"
            : "border-muted-foreground/30 text-muted-foreground"
        )}
      >
        <Check className={cn("h-3.5 w-3.5 transition-opacity", done ? "opacity-100" : "opacity-0")} />
      </div>
      <span className={cn("text-muted-foreground", done && "text-foreground")}>
        {label}
      </span>
    </div>
  );
}
