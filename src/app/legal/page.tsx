"use client";

import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { BadgeCheck, ShieldCheck, FileText } from "lucide-react";
import { DPA_META, DPA_SECTIONS, FOOTER_NOTE } from "@/lib/legal/dpa";

function slug(id: string) {
    return id.toLowerCase().replace(/\s+/g, "-");
}

export default function DpaPage() {
    const router = useRouter();
    const [agree, setAgree] = useState(false);

    const toc = useMemo(
        () =>
            DPA_SECTIONS.map((s) => ({
                href: `#${s.id}`,
                title: s.title,
            })),
        []
    );

    useEffect(() => {
        // could prefill from localStorage if previously accepted
        const accepted = localStorage.getItem("vg_dpa_accepted") === "true";
        if (accepted) setAgree(true);
    }, []);

    const onAccept = () => {
        // frontend-only: store locally; wire to API later
        localStorage.setItem("vg_dpa_accepted", "true");
        router.push("/setup");
    };

    const onPrint = () => {
        window.print();
    };

    return (
        <div className="min-h-[100dvh] bg-background">
            {/* Header */}
            <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Legal</p>
                            <h1 className="text-base font-semibold tracking-tight">Data Processing & Data Protection Agreement</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={onPrint}>Print</Button>
                        <Button disabled={!agree} onClick={onAccept} className="hidden sm:inline-flex">
                            <BadgeCheck className="mr-2 h-4 w-4" /> Accept & Continue
                        </Button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto max-w-5xl px-4 py-6">
                {/* Document */}
                <article className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">Data Processing & Data Protection Agreement (DPA)</CardTitle>
                                <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
                                    <span>Version {DPA_META.version}</span>
                                    <span>•</span>
                                    <span>Effective {DPA_META.effectiveDate}</span>
                                    <span>•</span>
                                    <span>Last Updated {DPA_META.lastUpdated}</span>
                                </div>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Processor: <span className="font-medium">{DPA_META.processor}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Controller: <span className="font-medium">{DPA_META.controllerPlaceholder}</span>
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Contents (single, centered) */}
                            <div className="rounded-lg border bg-muted/30 p-4">
                                <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                                    {/* FileText icon if you want: <FileText className="h-4 w-4" /> */}
                                    Contents
                                </div>
                                <nav className="grid gap-2 text-sm sm:grid-cols-2 md:grid-cols-2">
                                    {DPA_SECTIONS.map((s) => (
                                        <a
                                            key={s.id}
                                            href={`#${s.id}`}
                                            className="text-primary underline underline-offset-4 hover:no-underline"
                                        >
                                            {s.title}
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            {/* Sections */}
                            {DPA_SECTIONS.map((s) => (
                                <section key={s.id} id={s.id} className="scroll-mt-24">
                                    <h2 className="mb-2 text-lg font-semibold">{s.title}</h2>
                                    <div className="space-y-3 text-sm leading-6 text-muted-foreground">
                                        {s.body.map((p, i) => (
                                            <p key={i}>{p}</p>
                                        ))}
                                        {s.bullets && s.bullets.length > 0 && (
                                            <ul className="list-disc pl-6">
                                                {s.bullets.map((b, i) => (
                                                    <li key={i}>{b}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </section>
                            ))}

                            <Separator className="my-6" />
                            <div className="text-xs text-muted-foreground">
                                Print copy reference — Version {DPA_META.version} • Effective {DPA_META.effectiveDate}.{" "}
                                For historical versions, contact <span className="font-medium">{DPA_META.legalEmailPlaceholder}</span>.
                            </div>
                        </CardContent>
                    </Card>

                    {/* Accept + Print actions */}
                    <div className="print:hidden">
                        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-3">
                                <Checkbox id="agree" checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} />
                                <label htmlFor="agree" className="text-sm text-muted-foreground">
                                    I have read & agree to the DPA.
                                </label>
                            </div>
                            <div className="flex gap-2">
                                <Button disabled={!agree} onClick={onAccept}>
                                    Accept & Continue
                                </Button>
                                <Button variant="outline" onClick={onPrint}>Print</Button>
                            </div>
                        </div>
                    </div>
                </article>
            </main>

            <footer className="mx-auto max-w-6xl px-4 pb-10 pt-2 text-xs text-muted-foreground">
                {FOOTER_NOTE}
            </footer>
        </div>
    );
}
