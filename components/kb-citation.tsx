"use client";

import { useState } from "react";
import { Database, ShieldCheck } from "lucide-react";

// Citation for a LOCKED fact (price, terms, legal line). The message reinforces
// the core trust rule: these values are copied from the Knowledge Base, never
// written by the AI.
export function KbCitation({
  label,
  source,
}: {
  label: string;
  source: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-block align-middle">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
          open
            ? "border-blue-300 bg-blue-100 text-blue-800"
            : "border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-200 hover:text-blue-700"
        }`}
      >
        <Database size={10} />
        {source}
      </button>
      {open && (
        <span className="absolute left-0 top-full z-30 mt-1 block w-64 rounded-lg border border-slate-200 bg-white p-3 text-left shadow-lg">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
            <ShieldCheck size={13} className="text-green-600" />
            {label}
          </span>
          <span className="mt-1 block text-[11px] leading-relaxed text-slate-500">
            Copied directly from {source}. Never written by the AI — locked facts
            like price, terms, and legal lines always come from the source of record.
          </span>
        </span>
      )}
    </span>
  );
}
