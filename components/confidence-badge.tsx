"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export function ConfidenceBadge({
  pct,
  label,
  basis,
  placement = "bottom",
  defaultOpen = false,
}: {
  pct: number;
  label: string;
  basis: string[];
  placement?: "bottom" | "top";
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <span className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors ${
          open
            ? "border-green-300 bg-green-100 text-green-800"
            : "border-green-200 bg-green-50 text-green-700 hover:border-green-300"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
        {label} confidence
      </button>
      {open && (
        <span
          className={`absolute right-0 z-30 block w-[19rem] rounded-lg border border-slate-200 bg-white p-3 text-left shadow-lg ${
            placement === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5"
          }`}
        >
          <span className="block text-[12.5px] font-semibold text-slate-800">
            {label} — {pct}% confident
          </span>
          <span className="mt-1 block text-[11.5px] leading-snug text-slate-500">
            How sure I am this is worth acting on — that the signals are solid. Not a prediction of
            results.
          </span>

          <span className="mt-2.5 block text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">
            Based on
          </span>
          <span className="mt-1 block space-y-1.5">
            {basis.map((b) => (
              <span
                key={b}
                className="flex items-start gap-1.5 text-[11.5px] leading-snug text-slate-600"
              >
                <Check size={12} className="mt-0.5 shrink-0 text-green-600" />
                <span>{b}</span>
              </span>
            ))}
          </span>

          <span className="mt-2.5 block border-t border-slate-100 pt-2 text-[10.5px] leading-snug text-slate-400">
            Below 70% I don&apos;t recommend on my own — I just flag it and ask you first.
          </span>
        </span>
      )}
    </span>
  );
}
