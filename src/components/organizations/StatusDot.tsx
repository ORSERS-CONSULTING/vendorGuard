import { cn } from "@/lib/utils";

export function StatusDot({
  status,
}: {
  status: "Active" | "Pending Activation" | "Suspended";
}) {
  const color =
    status === "Active"
      ? "bg-emerald-500"
      : status === "Suspended"
      ? "bg-rose-500"
      : "bg-amber-500";
  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
      <span className="text-sm">{status}</span>
    </div>
  );
}
