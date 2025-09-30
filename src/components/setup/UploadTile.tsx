"use client";

import { cn } from "@/lib/utils";
import { Check, Upload, X } from "lucide-react";

type Props = {
  name: string;
  file: File | null;
  onChange: (file: File | null) => void;
};

export default function UploadTile({ name, file, onChange }: Props) {
  const id = `upload-${name.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <label
      htmlFor={id}
      className={cn(
        "group flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3 text-sm transition",
        file ? "border-green-300 ring-1 ring-green-200 bg-transparent" : "hover:bg-muted/50"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={cn(
            "grid h-8 w-8 place-items-center rounded-md",
            file ? "bg-white text-green-700 border border-green-200" : "bg-muted text-muted-foreground"
          )}
        >
          {file ? <Check className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
        </div>
        <div className="min-w-0">
          <div className="font-medium">{name}</div>
          <div className="text-xs text-muted-foreground truncate">
            {file ? file.name : "Upload file"}
          </div>
        </div>
      </div>

      {file && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onChange(null);
          }}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <input
        id={id}
        type="file"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </label>
  );
}
