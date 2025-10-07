"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { X, ChevronDown, ChevronUp } from "lucide-react";

export type EditCompanyPayload = {
  code: string;
  name: string;
  type?: string;
  industry?: string;
  plan?: string;
  country?: string;
  status?: "ACTIVE" | "PENDING" | "CLOSED";
  timezone?: string;
  currency?: string;
  repName?: string;
  repPhone?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
};

export function EditTenantDialog({
  open,
  onOpenChange,
  initial,
  onSaved,
  className,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: EditCompanyPayload;
  onSaved?: (updated: EditCompanyPayload) => void;
  className?: string;
}) {
  const [data, setData] = React.useState<EditCompanyPayload>(initial);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = React.useState(false);

  // sync when record changes
  React.useEffect(() => setData(initial), [initial]);

  // lock body scroll while open
  React.useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  // ESC to close (if not saving)
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, saving, onOpenChange]);

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/organizations/${encodeURIComponent(data.code)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t.slice(0, 400) || "Save failed");
      }
      const updated = (await res.json()) as EditCompanyPayload;
      onSaved?.(updated);
      onOpenChange(false);
    } catch (e: any) {
      setError(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onMouseDown={() => !saving && onOpenChange(false)}
      />
      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit Organization"
        className={cn(
          "relative z-10 w-[min(92vw,780px)] rounded-xl border border-border/60 bg-background shadow-xl",
          className
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div>
            <div className="text-sm font-medium">Edit Organization</div>
            <div className="text-xs text-muted-foreground">Update key company details.</div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          {error && (
            <div className="mb-3 rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Core, compact 2-col grid like create */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Left */}
            <div className="space-y-3">
              <Row label="Code">
                <Input value={data.code} disabled />
              </Row>

              <Row label={<Req>Name</Req>}>
                <Input
                  value={data.name ?? ""}
                  onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
                  placeholder="VendorGuard Inc."
                />
              </Row>

              <Row label="Type">
                <Input
                  value={data.type ?? ""}
                  onChange={(e) => setData((d) => ({ ...d, type: e.target.value }))}
                  placeholder="LLC, Sole Prop…"
                />
              </Row>

              <Row label="Industry">
                <Input
                  value={data.industry ?? ""}
                  onChange={(e) => setData((d) => ({ ...d, industry: e.target.value }))}
                  placeholder="Logistics, Retail…"
                />
              </Row>
            </div>

            {/* Right */}
            <div className="space-y-3">
              <Row label="Status">
                <div className="flex items-center gap-2">
                  {(["ACTIVE", "PENDING", "CLOSED"] as const).map((s) => (
                    <Badge
                      key={s}
                      variant={data.status === s ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => setData((d) => ({ ...d, status: s }))}
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </Row>

              <Row label="Country">
                <Input
                  value={data.country ?? ""}
                  onChange={(e) => setData((d) => ({ ...d, country: e.target.value }))}
                  placeholder="United Arab Emirates"
                />
              </Row>

              <Row label="Subscription Plan">
                <Input
                  value={data.plan ?? ""}
                  onChange={(e) => setData((d) => ({ ...d, plan: e.target.value }))}
                  placeholder="Starter / Pro / Enterprise"
                />
              </Row>
            </div>
          </div>

          {/* One-line wide fields */}
          <div className="mt-4 grid gap-3">
            <Row label="Website">
              <Input
                value={data.website ?? ""}
                onChange={(e) => setData((d) => ({ ...d, website: e.target.value }))}
                placeholder="https://example.com"
              />
            </Row>

            <Row label="Address">
              <Input
                value={data.address ?? ""}
                onChange={(e) => setData((d) => ({ ...d, address: e.target.value }))}
                placeholder="Office / Street / City"
              />
            </Row>
          </div>

          {/* Advanced toggle */}
          <div className="mt-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:underline"
              onClick={() => setAdvancedOpen((v) => !v)}
              aria-expanded={advancedOpen}
            >
              {advancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {advancedOpen ? "Hide advanced" : "Show advanced"}
            </button>

            {advancedOpen && (
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                {/* Left advanced */}
                <div className="space-y-3">
                  <Row label="Timezone">
                    <Input
                      value={data.timezone ?? ""}
                      onChange={(e) => setData((d) => ({ ...d, timezone: e.target.value }))}
                      placeholder="Asia/Dubai"
                    />
                  </Row>
                  <Row label="Currency">
                    <Input
                      value={data.currency ?? ""}
                      onChange={(e) => setData((d) => ({ ...d, currency: e.target.value }))}
                      placeholder="AED"
                    />
                  </Row>
                </div>

                {/* Right advanced */}
                <div className="space-y-3">
                  <Row label="Main Rep">
                    <div className="grid gap-2">
                      <Input
                        placeholder="Name"
                        value={data.repName ?? ""}
                        onChange={(e) => setData((d) => ({ ...d, repName: e.target.value }))}
                      />
                      <Input
                        placeholder="Phone"
                        value={data.repPhone ?? ""}
                        onChange={(e) => setData((d) => ({ ...d, repPhone: e.target.value }))}
                      />
                    </div>
                  </Row>
                </div>

                {/* Full width rows */}
                <div className="md:col-span-2 grid gap-3">
                  <Row label="Email">
                    <Input
                      type="email"
                      value={data.email ?? ""}
                      onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
                      placeholder="contact@company.com"
                    />
                  </Row>
                  <Row label="Phone">
                    <Input
                      value={data.phone ?? ""}
                      onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
                      placeholder="+971 …"
                    />
                  </Row>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t px-5 py-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ---------- helpers (same vibe as create) ---------- */

function Row({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] items-center gap-3">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Req({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-destructive">*</span> {children}
    </span>
  );
}
