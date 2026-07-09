"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, ShieldCheck, Check, RotateCcw, Lock, ArrowRight } from "lucide-react";
import { Card, SectionLabel } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { legalItem, draft, CAMPAIGN_ID } from "@/lib/seed";
import { useApp } from "@/lib/app-context";

import { DemoHomeLink } from "@/components/demo-home-link";

export default function LegalPage() {
  const { approveLegal, legalApproved } = useApp();
  const [localStatus, setLocalStatus] = useState<"pending" | "approved" | "changes">("pending");
  const status =
    legalApproved && localStatus !== "changes" ? "approved" : localStatus;

  function handleApprove() {
    approveLegal();
    setLocalStatus("approved");
  }

  return (
    <div className="mx-auto max-w-2xl animate-rise px-8 py-10">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <SectionLabel>Sam&apos;s queue</SectionLabel>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Legal review
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Full email for context — sign off on the one highlighted line.
          </p>
        </div>
        <DemoHomeLink />
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <div className="flex items-center gap-2">
            <Scale size={16} className="text-amber-600" />
            <span className="text-sm font-semibold text-slate-900">
              Full email · 1 line needs you
            </span>
          </div>
          <Badge tone={status === "pending" ? "amber" : status === "approved" ? "green" : "neutral"}>
            {status === "pending" ? "Pending" : status === "approved" ? "Approved" : "Changes requested"}
          </Badge>
        </div>

        {/* The full email, in context — flagged line highlighted */}
        <div className="px-5 py-5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            {draft.segment}
          </p>
          <p className="mt-2 text-[13px] font-semibold text-slate-800">
            Subject: {draft.subjectLine}
          </p>

          <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-white p-5 text-[14px] leading-relaxed text-slate-700">
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
                      ↑ needs your sign-off
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

          <p className="mt-3 text-[12.5px] text-slate-500">
            <b className="text-slate-700">Why flagged:</b> reads close to a value guarantee.
            Everything else is copied from the Knowledge Base and already cleared.
          </p>

          {/* Actions */}
          {status === "pending" ? (
            <div className="mt-5 flex gap-2">
              <button
                onClick={handleApprove}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-emerald-700"
              >
                <Check size={15} /> Approve line
              </button>
              <button
                onClick={() => setLocalStatus("changes")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw size={15} /> Request change
              </button>
            </div>
          ) : (
            <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="flex items-center gap-2 text-[13px] font-medium text-slate-700">
                <ShieldCheck size={16} className="text-emerald-600" />
                {status === "approved"
                  ? "Approved — Maria is notified, the campaign can ship."
                  : "Change requested — sent back to Maria with your note."}
              </p>
              <button
                onClick={() => setLocalStatus("pending")}
                className="text-[12px] font-medium text-slate-400 hover:text-slate-600"
              >
                Undo
              </button>
            </div>
          )}
        </div>
      </Card>

      <p className="mt-5 flex items-center gap-2 text-[12.5px] text-slate-400">
        <Lock size={13} className="text-slate-400" />
        Your review is logged to the audit trail — accountability runs both ways.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-5">
        {status === "approved" && (
          <Link
            href={`/campaign/${CAMPAIGN_ID}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-blue-700"
          >
            Back to Maria&apos;s draft <ArrowRight size={14} />
          </Link>
        )}
        <Link
          href="/welcome"
          className="text-[12px] font-medium text-slate-400 hover:text-slate-600"
        >
          ← Switch role
        </Link>
      </div>
    </div>
  );
}
