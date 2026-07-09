"use client";

import Link from "next/link";
import { Check, Circle, Lock } from "lucide-react";

type Step = {
  id: string;
  label: string;
  state: "done" | "current" | "pending" | "locked";
  href?: string;
};

export function CampaignProgress({
  briefApproved,
  legalApproved,
}: {
  briefApproved: boolean;
  legalApproved: boolean;
}) {
  const steps: Step[] = [
    {
      id: "brief",
      label: "Brief in Slack",
      state: briefApproved ? "done" : "current",
      href: briefApproved ? undefined : "/inbox",
    },
    {
      id: "draft",
      label: "Draft checked",
      state: briefApproved ? (legalApproved ? "done" : "current") : "locked",
      href: briefApproved ? `/campaign/c1` : undefined,
    },
    {
      id: "legal",
      label: "Legal sign-off",
      state: legalApproved ? "done" : briefApproved ? "pending" : "locked",
      href: briefApproved && !legalApproved ? "/legal" : undefined,
    },
    {
      id: "schedule",
      label: "Schedule send",
      state: legalApproved ? "current" : "locked",
    },
  ];

  return (
    <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        Your campaign · human + agent
      </p>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-1 gap-y-2">
        {steps.map((step, i) => (
          <span key={step.id} className="flex items-center gap-1">
            {i > 0 && <span className="mx-1 text-slate-300">→</span>}
            <StepPill step={step} />
          </span>
        ))}
      </div>
      <p className="mt-2 text-[11.5px] text-slate-500">
        Agent drafts and verifies · you own voice and approval · Legal clears one line
      </p>
    </div>
  );
}

function StepPill({ step }: { step: Step }) {
  const icon =
    step.state === "done" ? (
      <Check size={11} strokeWidth={3} />
    ) : step.state === "locked" ? (
      <Lock size={10} />
    ) : (
      <Circle size={10} />
    );

  const styles = {
    done: "border-emerald-200 bg-emerald-50 text-emerald-800",
    current: "border-blue-300 bg-blue-50 text-blue-800 ring-1 ring-blue-200",
    pending: "border-amber-200 bg-amber-50 text-amber-800",
    locked: "border-slate-200 bg-white text-slate-400",
  }[step.state];

  const inner = (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11.5px] font-medium ${styles}`}
    >
      {icon}
      {step.label}
    </span>
  );

  if (step.href) {
    return (
      <Link href={step.href} className="transition-opacity hover:opacity-80">
        {inner}
      </Link>
    );
  }
  return inner;
}
