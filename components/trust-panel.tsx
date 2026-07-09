"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Loader2,
  AlertTriangle,
  ShieldCheck,
  Gavel,
  ArrowRight,
} from "lucide-react";
import { checkResults } from "@/lib/seed";

export function TrustPanel({
  runKey,
  editRun,
  legalApproved,
  legalPending = false,
  onSendToLegal,
  onApprove,
}: {
  runKey: number;
  editRun: boolean;
  legalApproved: boolean;
  legalPending?: boolean;
  onSendToLegal: () => void;
  onApprove: () => void;
}) {
  const [resolved, setResolved] = useState(0);
  const flagCheck = checkResults.find((c) => c.status === "flag");
  const passCount = checkResults.filter((c) => c.status !== "flag").length;

  useEffect(() => {
    setResolved(0);
    const timer = setInterval(() => {
      setResolved((r) => {
        if (r >= checkResults.length) {
          clearInterval(timer);
          return r;
        }
        return r + 1;
      });
    }, 280);
    return () => clearInterval(timer);
  }, [runKey]);

  const running = resolved < checkResults.length;
  const flagResolvedByLegal = legalApproved;

  return (
    <aside className="flex flex-col rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <ShieldCheck size={17} className="text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-900">I checked this for you</h3>
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          {editRun ? "Re-checking your edit…" : "Before you read a word — facts from Product DB."}
        </p>
      </div>

      <div className="space-y-2 px-4 py-3">
        {running ? (
          <p className="flex items-center gap-2 text-[12px] text-slate-500">
            <Loader2 size={14} className="animate-spin" /> Running checks…
          </p>
        ) : (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-[12px] text-emerald-800">
            ✓ {passCount} checks passed — price, sources, disclaimer, banned words
          </p>
        )}

        {flagCheck && resolved >= checkResults.length && (
          <div
            className={`rounded-xl border px-3 py-2.5 ${
              flagResolvedByLegal
                ? "border-green-200 bg-green-50/60"
                : "border-amber-200 bg-amber-50/70"
            }`}
          >
            <div className="flex items-start gap-2">
              {flagResolvedByLegal ? (
                <Check size={15} className="mt-0.5 text-green-600" />
              ) : (
                <AlertTriangle size={15} className="mt-0.5 text-amber-500" />
              )}
              <div>
                <p className="text-[12px] font-medium text-slate-800">
                  {flagResolvedByLegal
                    ? "Legal approved the flagged line"
                    : "1 line needs Legal"}
                </p>
                {!flagResolvedByLegal && (
                  <>
                    <p className="mt-1 text-[11px] leading-relaxed text-amber-800">
                      {flagCheck.detail}
                    </p>
                    {legalPending ? (
                      <div className="mt-2 space-y-2">
                        <p className="text-[11px] font-medium text-amber-900">
                          Sam needs to sign off on the highlighted line before send.
                        </p>
                        <Link
                          href="/legal"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-amber-700"
                        >
                          <Gavel size={12} /> Open Legal review
                        </Link>
                      </div>
                    ) : (
                      <button
                        onClick={onSendToLegal}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-amber-700"
                      >
                        <Gavel size={12} /> Send to Legal
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {!running && (
          <p className="text-[10.5px] leading-snug text-slate-400">
            Second pass complete — I flag issues; only you and Legal approve or send.
          </p>
        )}
      </div>

      <div className="border-t border-slate-100 p-4">
        <button
          onClick={onApprove}
          disabled={running || !legalApproved}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
            !running && legalApproved
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "cursor-not-allowed bg-slate-100 text-slate-400"
          }`}
        >
          Approve &amp; schedule
          <ArrowRight size={16} />
        </button>
        {!legalApproved && !running && (
          <p className="mt-2 text-center text-[11px] text-slate-400">
            Unlocks after{" "}
            <Link href="/legal" className="font-semibold text-amber-700 hover:underline">
              Legal review
            </Link>
            .
          </p>
        )}
      </div>
    </aside>
  );
}
