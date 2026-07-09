"use client";

import { Fragment } from "react";
import { BarChart3, Sparkles, UserCheck, ArrowRight, Target } from "lucide-react";
import { Card } from "@/components/ui/card";

const STEPS = [
  {
    icon: BarChart3,
    title: "Measure",
    body: "After send — purchases vs holdout (not opens).",
  },
  {
    icon: Sparkles,
    title: "Propose",
    body: "One learning per campaign — agent suggests, never auto-saves.",
  },
  {
    icon: UserCheck,
    title: "Confirm",
    body: "Looks right / Not for us — then it shapes the next draft.",
  },
] as const;

export function MemoryFlowStrip() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-violet-50/60 px-4 py-2.5">
        <Target size={14} className="text-violet-600" />
        <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-800">
          End goal
        </p>
      </div>
      <p className="border-b border-slate-100 px-4 py-3 text-[13px] leading-snug text-slate-700">
        <b className="text-slate-900">Next campaigns start smarter.</b> Only learnings a human
        confirms are used — nothing silent, nothing stale.
      </p>
      <div className="flex items-start justify-between gap-1 px-3 py-4 sm:px-6">
        {STEPS.map((step, i) => (
          <Fragment key={step.title}>
            <div className="min-w-0 flex-1 text-center">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                <step.icon size={16} className="text-slate-600" />
              </div>
              <p className="mt-2 text-[11px] font-semibold text-slate-800">{step.title}</p>
              <p className="mt-0.5 text-[10px] leading-snug text-slate-500">{step.body}</p>
            </div>
            {i < STEPS.length - 1 && (
              <ArrowRight size={14} className="mt-2.5 shrink-0 text-slate-300" aria-hidden />
            )}
          </Fragment>
        ))}
      </div>
    </Card>
  );
}
