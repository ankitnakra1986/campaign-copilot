"use client";

import { useState } from "react";
import { ChevronDown, ShieldAlert } from "lucide-react";
import { LIFECYCLE_ASSUMPTIONS } from "@/lib/lifecycle-assumptions";

export function LifecycleAssumptionsStrip() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
      >
        <span className="flex items-center gap-2 text-[12px] font-semibold text-slate-700">
          <ShieldAlert size={14} className="shrink-0 text-amber-600" />
          Risks &amp; assumptions — what&apos;s outside agent control
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul className="space-y-2.5 border-t border-slate-100 px-4 py-3">
          {LIFECYCLE_ASSUMPTIONS.map((a) => (
            <li key={a.id} className="text-[12px] leading-relaxed text-slate-600">
              <span className="font-semibold text-slate-800">{a.label}:</span> {a.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
