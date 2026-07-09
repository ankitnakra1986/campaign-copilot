"use client";

import { useState } from "react";
import { Link2, FileText } from "lucide-react";
import type { Signal } from "@/lib/types";

export function CitationChip({
  signal,
  defaultOpen = false,
  placement = "bottom",
}: {
  signal: Signal;
  defaultOpen?: boolean;
  placement?: "bottom" | "top";
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <span className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition-colors ${
          open
            ? "border-blue-300 bg-blue-100 text-blue-800"
            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-200 hover:text-blue-700"
        }`}
      >
        <FileText size={11} />
        {signal.sourceLabel}
      </button>
      {open && (
        <span
          className={`absolute left-0 z-20 block w-72 rounded-lg border border-slate-200 bg-white p-3 text-left shadow-lg ${
            placement === "top" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          <span className="block text-xs font-semibold text-slate-800">
            {signal.sourceLabel}
          </span>
          <span className="mt-1 block text-xs text-slate-600">{signal.claim}</span>
          <span className="mt-2 flex items-center gap-1 text-[11px] text-blue-600">
            <Link2 size={11} />
            <span className="truncate">{signal.sourceUrl}</span>
          </span>
        </span>
      )}
    </span>
  );
}
