"use client";

import Link from "next/link";
import { CASE_METRICS } from "@/lib/case-metrics";
import { Card } from "@/components/ui/card";

type Kpi = {
  value: string;
  label: string;
  sub: string;
  href?: string;
};

export function caseImpactKpis(overrides?: Partial<{ cycle: string; checkpoints: string }>): Kpi[] {
  return [
    {
      value: CASE_METRICS.savingsTarget,
      label: "Agency saved",
      sub: `${CASE_METRICS.savingsPct} of ${CASE_METRICS.agencyPlannedYr} vendor`,
      href: "/campaigns",
    },
    {
      value: overrides?.cycle ?? CASE_METRICS.cycleMvpTarget,
      label: "Brief → sent",
      sub: `Was ${CASE_METRICS.cycleVendor}`,
      href: "/campaign/c1/results",
    },
    {
      value: overrides?.checkpoints ?? "Human OK",
      label: "Every send",
      sub: "Nothing auto-ships",
      href: "/inbox",
    },
  ];
}

export function CaseImpactKpis({
  kpis,
  compact = false,
}: {
  kpis?: Kpi[];
  compact?: boolean;
}) {
  const items = kpis ?? caseImpactKpis();

  return (
    <div
      className={`grid grid-cols-3 overflow-hidden rounded-2xl border border-slate-200 bg-white ${
        compact ? "divide-x divide-slate-100" : "gap-px bg-slate-200"
      }`}
    >
      {items.map((n) => {
        const inner = (
          <>
            <p
              className={`font-semibold tracking-tight text-slate-900 ${
                compact ? "text-[18px]" : "text-[22px]"
              }`}
            >
              {n.value}
            </p>
            <p className={`font-medium text-slate-700 ${compact ? "text-[11px]" : "text-[12.5px]"}`}>
              {n.label}
            </p>
            <p className={`leading-snug text-slate-400 ${compact ? "text-[10px]" : "text-[11px]"}`}>
              {n.sub}
            </p>
          </>
        );
        return n.href ? (
          <Link
            key={n.label}
            href={n.href}
            className={`block bg-white transition-colors hover:bg-slate-50 ${
              compact ? "px-4 py-3" : "px-5 py-4"
            }`}
          >
            {inner}
          </Link>
        ) : (
          <div key={n.label} className={`bg-white ${compact ? "px-4 py-3" : "px-5 py-4"}`}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}

export function ActionBanner({
  title,
  body,
  href,
  cta,
  tone = "amber",
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
  tone?: "amber" | "blue";
}) {
  const styles =
    tone === "amber"
      ? "border-amber-200 bg-amber-50 text-amber-950"
      : "border-blue-200 bg-blue-50 text-blue-950";

  return (
    <Card className={`flex flex-wrap items-center justify-between gap-3 p-4 ${styles}`}>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold">{title}</p>
        <p className="mt-0.5 text-[12px] opacity-90">{body}</p>
      </div>
      <Link
        href={href}
        className={`shrink-0 rounded-lg px-4 py-2 text-[13px] font-semibold text-white ${
          tone === "amber" ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {cta}
      </Link>
    </Card>
  );
}
