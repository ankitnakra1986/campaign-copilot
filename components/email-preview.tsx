"use client";

import Link from "next/link";
import { Palette } from "lucide-react";
import { clientConfig } from "@/lib/client-config";
import { CustomerEmailContent } from "./customer-email-content";

export function EmailPreview({
  subject,
  onSubjectChange,
  flaggedText,
  compact = false,
  customerView = false,
  showDesignHandoff = false,
}: {
  subject: string;
  onSubjectChange: (v: string) => void;
  flaggedText: string;
  compact?: boolean;
  /** Strip internal citations — reads like the real email */
  customerView?: boolean;
  /** Link to Design for template/layout changes (Maria's workflow) */
  showDesignHandoff?: boolean;
}) {
  return (
    <div className="flex flex-col">
      {!compact && !customerView && (
        <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5">
          <span className="text-[13px] font-medium text-slate-800">
            Voice: {clientConfig.brandVoice.label}
          </span>
        </div>
      )}

      <div className="mb-3 rounded-xl border border-slate-200 bg-white p-3">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          Subject · you can edit
        </span>
        <input
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md ring-1 ring-slate-100">
        <CustomerEmailContent scale="desktop" flaggedText={flaggedText} />
      </div>

      {showDesignHandoff && (
        <Link
          href="/setup"
          className="mt-3 inline-flex items-center gap-1.5 self-start rounded-lg border border-violet-200 bg-violet-50/80 px-3 py-2 text-xs font-medium text-violet-800 transition hover:bg-violet-100"
        >
          <Palette size={14} />
          Layout or hero change? → Leo (Design)
        </Link>
      )}
    </div>
  );
}
