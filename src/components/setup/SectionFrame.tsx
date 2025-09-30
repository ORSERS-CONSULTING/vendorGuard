// components/setup/SectionFrame.tsx
"use client";


import * as React from "react";
import { cn } from "@/lib/utils";


export default function SectionFrame({
id,
icon: Icon,
title,
description,
children,
className,
}: {
id: string;
icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
title: string;
description?: string;
children: React.ReactNode;
className?: string;
}) {
return (
<section
id={id}
className={cn(
"scroll-mt-24 py-5 border-b last:border-b-0",
className
)}
>
<header className="mb-3 flex items-start gap-3">
{Icon ? (
<span className="mt-0.5 inline-grid h-7 w-7 place-items-center rounded-md bg-primary/10 text-primary">
<Icon className="h-3.5 w-3.5" />
</span>
) : null}
<div>
<h3 className="text-sm font-semibold leading-none tracking-tight">
{title}
</h3>
{description ? (
<p className="mt-1 text-xs text-muted-foreground">{description}</p>
) : null}
</div>
</header>
<div>{children}</div>
</section>
);
}