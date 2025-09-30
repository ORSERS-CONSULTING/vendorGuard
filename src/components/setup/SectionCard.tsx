"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  index: number;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export default function SectionCard({
  index,
  icon: Icon,
  title,
  description,
  children,
  className,
}: Props) {
  return (
    <Card className={cn("rounded-lg border border-border/60 shadow-none", className)}>
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center gap-2">
          {Icon ? (
            <div className="grid h-7 w-7 place-items-center rounded-md bg-muted text-muted-foreground">
              <Icon className="h-3.5 w-3.5" />
            </div>
          ) : null}
          <div>
            <CardTitle className="text-sm font-medium">
              {index}. {title}
            </CardTitle>
            {description ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  );
}
