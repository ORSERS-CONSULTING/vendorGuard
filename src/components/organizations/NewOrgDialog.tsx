"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type NewOrgForm = {
  name: string;
  country: string; // country name (backend will map to ID)
  plan: string; // plan name (backend will map to ID)
  contactPerson: string;
  contactEmail: string;
  mobile?: string;
  international: boolean;
};

export function NewOrgDialog({
  open,
  onOpenChange,
  onCreate,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (payload: NewOrgForm) => void | Promise<void>;
  className?: string;
}) {
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState<NewOrgForm>({
    name: "",
    country: "",
    plan: "",
    contactPerson: "",
    contactEmail: "",
    mobile: "",
    international: false,
  });

  // --- dynamic dropdown state ---
  const [countries, setCountries] = React.useState<string[]>([]);
  const [plans, setPlans] = React.useState<string[]>([]);
  const [loadingLists, setLoadingLists] = React.useState(true);
  const [listsErr, setListsErr] = React.useState<string | null>(null);

  // Fetch dropdown options (names only)
  React.useEffect(() => {
    if (!open) return; // fetch when dialog opens (optional)
    const ac = new AbortController();
    (async () => {
      try {
        setLoadingLists(true);
        setListsErr(null);

        const [cRes, pRes] = await Promise.all([
          fetch("/api/CountriesNames", { signal: ac.signal }),
          fetch("/api/SubscriptionPlansNames", { signal: ac.signal }),
        ]);

        const cJson = cRes.ok ? await cRes.json() : { items: [] };
        const pJson = pRes.ok ? await pRes.json() : { items: [] };

        setCountries(Array.isArray(cJson.items) ? cJson.items : []);
        setPlans(Array.isArray(pJson.items) ? pJson.items : []);

        // Auto-select first option if nothing chosen (optional)
        setForm((f) => ({
          ...f,
          country: f.country || (cJson.items?.[0] ?? ""),
          plan: f.plan || (pJson.items?.[0] ?? ""),
        }));
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          setListsErr("Failed to load dropdowns");
          setCountries([]);
          setPlans([]);
        }
      } finally {
        setLoadingLists(false);
      }
    })();
    return () => ac.abort();
  }, [open]);

  // Lock body scroll while modal is open
  React.useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  // Close on ESC
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, submitting, onOpenChange]);

  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const requiredOk =
    form.name.trim().length > 0 &&
    form.plan.trim().length > 0 &&
    form.contactPerson.trim().length > 0 &&
    /\S+@\S+\.\S+/.test(form.contactEmail);

  async function handleCreate() {
    if (!requiredOk || submitting) return;
    setSubmitting(true);
    try {
      await onCreate?.(form);
      onOpenChange(false);
      setForm({
        name: "",
        country: "",
        plan: "",
        contactPerson: "",
        contactEmail: "",
        mobile: "",
        international: false,
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  const countryDisabled = loadingLists || !!listsErr || countries.length === 0;
  const planDisabled = loadingLists || !!listsErr || plans.length === 0;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onMouseDown={() => !submitting && onOpenChange(false)}
      />
      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add or Edit Organization"
        ref={contentRef}
        className={cn(
          "relative z-10 w-[min(92vw,740px)] rounded-xl border border-border/60 bg-background shadow-xl",
          className
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div>
            <div className="text-sm font-medium">Add/Edit Organization</div>
            <div className="text-xs text-muted-foreground">
              Fields marked with <span className="text-destructive">*</span> are
              required.
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          {/* Dropdown load errors */}
          {listsErr && (
            <div className="mb-3 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-900">
              {listsErr}. You can still submit, but the lists are empty.
            </div>
          )}

          <div className="grid gap-4">
            {/* Code (disabled) */}
            <Row label="Code">
              <Input disabled placeholder="To be generated…" />
            </Row>

            {/* Name */}
            <Row label={<Req>Name</Req>}>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="VendorGuard Inc."
              />
            </Row>

            {/* Country (dynamic names) */}
            <Row label="Country">
              <select
                className="h-10 w-full rounded-md border bg-background px-3 text-sm disabled:opacity-60"
                value={form.country}
                onChange={(e) =>
                  setForm((f) => ({ ...f, country: e.target.value }))
                }
                disabled={countryDisabled}
              >
                {loadingLists ? (
                  <option>Loading…</option>
                ) : countries.length === 0 ? (
                  <option value="">No countries</option>
                ) : (
                  <>
                    <option value="">Select</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </Row>

            {/* Plan (dynamic names) */}
            <Row label={<Req>Subscription Plan</Req>}>
              <select
                className="h-10 w-full rounded-md border bg-background px-3 text-sm disabled:opacity-60"
                value={form.plan}
                onChange={(e) =>
                  setForm((f) => ({ ...f, plan: e.target.value }))
                }
                disabled={planDisabled}
              >
                {loadingLists ? (
                  <option>Loading…</option>
                ) : plans.length === 0 ? (
                  <option value="">No plans</option>
                ) : (
                  <>
                    <option value="">Select</option>
                    {plans.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </Row>

            {/* Contact Person */}
            <Row label={<Req>Contact Person</Req>}>
              <Input
                value={form.contactPerson}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contactPerson: e.target.value }))
                }
                placeholder="Ahmed Abdelrahman"
              />
            </Row>

            {/* Contact Email */}
            <Row label={<Req>Contact Email</Req>}>
              <Input
                type="email"
                value={form.contactEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contactEmail: e.target.value }))
                }
                placeholder="contact@company.com"
              />
            </Row>

            {/* Mobile + International */}
            <Row label="Mobile No.">
              <div className="flex items-center gap-3">
                <Input
                  value={form.mobile}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, mobile: e.target.value }))
                  }
                  placeholder="+971 …"
                />
                <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <Checkbox
                    checked={form.international}
                    onCheckedChange={(v) =>
                      setForm((f) => ({ ...f, international: Boolean(v) }))
                    }
                  />
                  International
                </label>
              </div>
            </Row>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t px-5 py-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!requiredOk || submitting}>
            {submitting ? "Creating…" : "Create"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ---------- little helpers ---------- */

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
