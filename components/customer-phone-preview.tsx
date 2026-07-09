"use client";

import { draft } from "@/lib/seed";
import { clientConfig } from "@/lib/client-config";
import { CustomerEmailContent } from "./customer-email-content";

/** Compact “how the customer sees it” — one glance, no extra screen. */
export function CustomerPhonePreview({ compact = false }: { compact?: boolean }) {
  const scale = compact ? "phone-compact" : "phone";

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-slate-50/80 ${compact ? "p-3" : "p-4"}`}
    >
      {!compact && (
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          What customers see
        </p>
      )}
      <div
        className={`mx-auto overflow-hidden rounded-[1.25rem] border-[4px] border-slate-800 bg-slate-800 shadow-md ${
          compact ? "w-[180px]" : "w-[220px]"
        }`}
      >
        <div className="rounded-[1rem] bg-white">
          <div className="px-3 pt-3">
            <p className="truncate text-[9px] font-semibold text-slate-700">
              {clientConfig.clientName}
            </p>
            <p className="truncate text-[8px] text-slate-400">{draft.subjectLine}</p>
          </div>
          <CustomerEmailContent scale={scale} truncateBody />
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] text-slate-500">
        Sarah · suburban family · one tap to buy
      </p>
    </div>
  );
}
