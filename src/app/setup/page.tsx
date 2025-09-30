"use client";

import * as React from "react";
import Link from "next/link";

import StepRail, { type Step } from "@/components/setup/StepRail";
import SectionFrame from "@/components/setup/SectionFrame";
import UploadTile from "@/components/setup/UploadTile";
import ChecklistRow from "@/components/setup/ChecklistRow";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

import {
  ShieldCheck,
  Building2,
  FileCheck2,
  Globe2,
  ImageIcon,
  FileText,
} from "lucide-react";

import options from "@/lib/data.json";
import { initialState, setupReducer } from "@/lib/setup-reducer";

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

/** Tracks which section is visible to highlight it on the StepRail */
function useActiveSection(ids: string[]) {
  const [active, setActive] = React.useState<string | undefined>(ids[0]);
  React.useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) =>
            a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1
          );
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-128px 0px -60% 0px", threshold: [0, 0.2, 1] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids.join(",")]);
  return active;
}

export default function SetupPage() {
  const [state, dispatch] = React.useReducer(setupReducer, initialState);
  const [submitting, setSubmitting] = React.useState(false);

  const businessDone = !!state.business.tenantType && !!state.business.industry;
  const complianceDone = state.compliance.some((r) => r.key && r.value);
  const prefsDone = !!state.location.timezone && !!state.location.currency;
  const brandingDone = !!state.branding.logoFile || !!state.branding.website;
  const verificationDone = Object.values(state.verification).some(Boolean);

  const requiredOk = React.useMemo(
    () =>
      !!state.business.tenantType &&
      !!state.business.industry &&
      !!state.location.timezone &&
      !!state.location.currency &&
      state.agree,
    [state]
  );

  const stepIds = [
    "business",
    "compliance",
    "prefs",
    "branding",
    "verification",
  ] as const;
  const activeId = useActiveSection(stepIds as unknown as string[]);

  const steps: Step[] = [
    { id: "business", title: "Business info", done: businessDone },
    { id: "compliance", title: "Compliance identifiers", done: complianceDone },
    { id: "prefs", title: "Location & preferences", done: prefsDone },
    { id: "branding", title: "Branding", done: brandingDone },
    { id: "verification", title: "Verification", done: verificationDone },
  ];

  function handleLogo(file: File | null) {
    if (!file) {
      dispatch({ type: "branding:logo", file: null, preview: undefined });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      dispatch({ type: "branding:logo", file, preview: String(reader.result) });
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    console.log("SETUP_PAYLOAD", state);
    setSubmitting(false);
    alert("Setup saved (frontend only). Check console for payload.");
  }

  const completedCount = steps.filter((s) => s.done).length;

  return (
    <div className="flex h-[100dvh] flex-col bg-gradient-to-b from-background to-muted/30">
      {/* Header (full-width) */}
      <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Welcome to</p>
              <h1 className="text-base font-semibold tracking-tight">
                VendorGuard
              </h1>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {completedCount}/{steps.length} complete
          </div>
        </div>
      </header>

      {/* Body: fills all remaining height; only the right column scrolls */}
      <div className="grid flex-1 min-h-0 grid-cols-1 gap-6 px-6 py-6 md:grid-cols-[260px_1fr] overflow-hidden">
        {/* Step rail (sticky left) */}
        <aside className="hidden md:block">
          <div className="sticky top-14">
            <StepRail steps={steps} activeId={activeId} />
            <Separator className="my-4" />
            <div className="text-xs text-muted-foreground">
              You can return to finish setup anytime.
            </div>
          </div>
        </aside>

        {/* Content (the only vertical scroller) */}
        <main className="min-h-0 overflow-auto pb-24">
          <div className="rounded-lg border border-border/60 bg-background/60 p-4">
            {/* 1. Business Info */}
            <SectionFrame
              id="business"
              icon={Building2}
              title="Business Info"
              description="Tell us about your organization."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="tenantType">Tenant Type</Label>
                  <select
                    id="tenantType"
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value={state.business.tenantType}
                    onChange={(e) =>
                      dispatch({
                        type: "business",
                        field: "tenantType",
                        value: e.target.value,
                      })
                    }
                  >
                    <option value="">Select</option>
                    {options.tenantTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="industry">Industry</Label>
                  <select
                    id="industry"
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value={state.business.industry}
                    onChange={(e) =>
                      dispatch({
                        type: "business",
                        field: "industry",
                        value: e.target.value,
                      })
                    }
                  >
                    <option value="">Select</option>
                    {options.industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </SectionFrame>

            {/* 2. Compliance */}
            <SectionFrame
              id="compliance"
              icon={FileCheck2}
              title="Compliance Identifiers"
              description="Key identifiers used on invoices and compliance reports."
            >
              <div className="space-y-3">
                {state.compliance.map((row, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_1fr_auto] items-center gap-3"
                  >
                    <Input
                      value={row.key}
                      placeholder="Identifier Name (e.g., License Number)"
                      onChange={(e) =>
                        dispatch({
                          type: "compliance:update",
                          index: i,
                          field: "key",
                          value: e.target.value,
                        })
                      }
                    />
                    <Input
                      value={row.value}
                      placeholder="Identifier Value"
                      onChange={(e) =>
                        dispatch({
                          type: "compliance:update",
                          index: i,
                          field: "value",
                          value: e.target.value,
                        })
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="justify-self-end"
                      onClick={() =>
                        dispatch({ type: "compliance:remove", index: i })
                      }
                      aria-label="Remove identifier"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-1"
                  onClick={() => dispatch({ type: "compliance:add" })}
                >
                  + Add identifier
                </Button>
              </div>
            </SectionFrame>

            {/* 3. Location & Preferences */}
            <SectionFrame
              id="prefs"
              icon={Globe2}
              title="Location & Preferences"
              description="Set your address, timezone, and currency."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field id="address" label="Address">
                    <Input
                      id="address"
                      placeholder="Street, building"
                      value={state.location.address}
                      onChange={(e) =>
                        dispatch({
                          type: "location",
                          field: "address",
                          value: e.target.value,
                        })
                      }
                    />
                  </Field>
                </div>

                <Field id="city" label="City">
                  <Input
                    id="city"
                    value={state.location.city}
                    onChange={(e) =>
                      dispatch({
                        type: "location",
                        field: "city",
                        value: e.target.value,
                      })
                    }
                  />
                </Field>

                <Field id="postal" label="Postal Code">
                  <Input
                    id="postal"
                    value={state.location.postal}
                    onChange={(e) =>
                      dispatch({
                        type: "location",
                        field: "postal",
                        value: e.target.value,
                      })
                    }
                  />
                </Field>

                <Field id="timezone" label="Timezone">
                  <select
                    id="timezone"
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value={state.location.timezone}
                    onChange={(e) =>
                      dispatch({
                        type: "location",
                        field: "timezone",
                        value: e.target.value,
                      })
                    }
                  >
                    <option value="">Select</option>
                    {options.timezones.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id="currency" label="Currency">
                  <select
                    id="currency"
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value={state.location.currency}
                    onChange={(e) =>
                      dispatch({
                        type: "location",
                        field: "currency",
                        value: e.target.value,
                      })
                    }
                  >
                    {options.currencies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </SectionFrame>

            {/* 4. Branding */}
            <SectionFrame
              id="branding"
              icon={ImageIcon}
              title="Branding"
              description="Add your logo and website to personalize your workspace."
            >
              <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
                <div>
                  <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                    {state.branding.logoPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={state.branding.logoPreview}
                        alt="Logo preview"
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        Logo preview
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted">
                      <span>Upload</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) =>
                          handleLogo(e.target.files?.[0] ?? null)
                        }
                      />
                    </label>
                    {state.branding.logoFile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLogo(null)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
                <div>
                  <Field id="website" label="Website URL">
                    <Input
                      id="website"
                      placeholder="https://company.com"
                      value={state.branding.website}
                      onChange={(e) =>
                        dispatch({
                          type: "branding:web",
                          value: e.target.value,
                        })
                      }
                    />
                  </Field>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Your logo appears in emails and the app header. PNG/SVG
                    recommended.
                  </p>
                </div>
              </div>
            </SectionFrame>

            {/* 5. Verification */}
            <SectionFrame
              id="verification"
              icon={FileText}
              title="Verification"
              description="Upload documents to verify your organization (optional for now)."
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(state.verification).map(([name, file]) => (
                  <UploadTile
                    key={name}
                    name={name}
                    file={file}
                    onChange={(f) =>
                      dispatch({ type: "verification", doc: name, file: f })
                    }
                  />
                ))}
              </div>
            </SectionFrame>
          </div>
        </main>
      </div>

      {/* Bottom actions (full-width) */}
      <div className="sticky bottom-0 z-30 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between gap-4 px-6">
          <div className="flex items-start gap-3 text-xs">
            <Checkbox
              id="agree"
              checked={state.agree}
              onCheckedChange={(v) =>
                dispatch({ type: "agree", value: Boolean(v) })
              }
            />
            <label htmlFor="agree" className="text-muted-foreground">
              I have read & agree to the{" "}
              <a
                className="text-primary underline underline-offset-2"
                href="/legal"
              >
                Data Processing & Data Protection Agreement
              </a>
              .
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => dispatch({ type: "reset" })}>
              Reset
            </Button>
            <Link href="/organizations">
              <Button disabled={!requiredOk || submitting} onClick={onSubmit}>
                {submitting ? "Saving…" : "Complete Setup"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
