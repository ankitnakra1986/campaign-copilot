"use client";

import { Gavel, X, Check, Lock } from "lucide-react";
import { legalItem, draft } from "@/lib/seed";

export function LegalModal({
  open,
  onClose,
  onApprove,
}: {
  open: boolean;
  onClose: () => void;
  onApprove: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col animate-rise rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Gavel size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Legal review</p>
              <p className="text-[11px] text-slate-400">Full email · one line needs sign-off</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <p className="text-[12.5px] leading-relaxed text-slate-600">
            Sam sees the whole email — context matters. We only need sign-off on the highlighted
            line.
          </p>

          <p className="mt-4 text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Subject: {draft.subjectLine}
          </p>

          <div className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-white p-4 text-[13px] leading-relaxed text-slate-700">
            <p>{draft.greeting}</p>
            {draft.bodyBlocks.map((block) => {
              const flagged = block === legalItem.sentence;
              return (
                <p
                  key={block}
                  className={
                    flagged
                      ? "relative rounded-lg bg-amber-50 px-3 py-2 ring-1 ring-amber-300"
                      : undefined
                  }
                >
                  {flagged && (
                    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                      ↑ needs sign-off
                    </span>
                  )}
                  {block}
                </p>
              );
            })}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-[13px]">
              <span className="text-lg font-bold text-slate-900">{draft.offer.price}</span>
              <span className="ml-2 text-slate-500">{draft.offer.terms}</span>
            </div>
            <p className="border-t border-slate-100 pt-3 text-[11px] text-slate-400">
              {draft.legalLine.text}
            </p>
          </div>

          <p className="mt-3 text-[12px] text-slate-500">
            <b className="text-slate-700">Why flagged:</b> reads close to a value guarantee.
          </p>

          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
            <Lock size={12} /> Logged to the audit trail when Sam decides.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={onApprove}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              <Check size={16} />
              Approve line
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              Request change
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
