"use client";

import { lifecycleConfigs, lifecycleOrder } from "@/lib/seed";
import { CASE_METRICS, JOBS_LINE } from "@/lib/case-metrics";
import { LIFECYCLE_IMPACT_ID, handleLifecycleSelect } from "@/lib/lifecycle-nav";
import { Card } from "@/components/ui/card";
import type { LifecycleState } from "@/lib/types";

const STAGE_DATA: Record<
  LifecycleState,
  {
    cycleLabel: string;
    cycleDays: number;
    campaignsMo: number;
    gates: number;
    gateNote: string;
    memory: number;
    agencyLabel: string;
  }
> = {
  day1: {
    cycleLabel: CASE_METRICS.cycleMvpTarget,
    cycleDays: CASE_METRICS.cycleMvpDaysMid,
    campaignsMo: 2,
    gates: 5,
    gateNote: "Every step checked",
    memory: 0,
    agencyLabel: CASE_METRICS.agencyPlannedYr,
  },
  month3: {
    cycleLabel: CASE_METRICS.cycleAdHocPilot,
    cycleDays: CASE_METRICS.cycleAdHocDays,
    campaignsMo: 6,
    gates: 3,
    gateNote: "Brief · voice · Legal",
    memory: 3,
    agencyLabel: "On track to 50%",
  },
  year1: {
    cycleLabel: `${CASE_METRICS.cycleYear1Days} days`,
    cycleDays: CASE_METRICS.cycleYear1Days,
    campaignsMo: 12,
    gates: 1,
    gateNote: "Final send only",
    memory: 4,
    agencyLabel: `${CASE_METRICS.savingsTarget} saved`,
  },
};

const STAGE_VALUE: Record<LifecycleState, string> = {
  day1: `First campaign · ${CASE_METRICS.cycleMvpTarget}`,
  month3: `Ad hoc pilot · ${CASE_METRICS.cycleAdHocPilot}`,
  year1: `${CASE_METRICS.savingsPct} agency · same team`,
};

type MetricDef = {
  id: string;
  label: string;
  format: (s: LifecycleState) => string;
  sub?: (s: LifecycleState) => string | undefined;
  bar: (s: LifecycleState) => number;
  showBar: boolean;
};

const METRICS: MetricDef[] = [
  {
    id: "time",
    label: "Brief → sent",
    format: (s) => STAGE_DATA[s].cycleLabel,
    sub: (s) => (s === "day1" ? `Was ${CASE_METRICS.cycleVendor}` : undefined),
    bar: (s) =>
      Math.round(
        (1 - STAGE_DATA[s].cycleDays / CASE_METRICS.cycleVendorDaysMax) * 100,
      ),
    showBar: true,
  },
  {
    id: "agency",
    label: "Planned agency",
    format: (s) => STAGE_DATA[s].agencyLabel,
    sub: (s) =>
      s === "year1" ? `${CASE_METRICS.savingsPct} of ${CASE_METRICS.agencyPlannedYr}` : undefined,
    bar: (s) => (s === "year1" ? 50 : s === "month3" ? 15 : 0),
    showBar: true,
  },
  {
    id: "gates",
    label: "Human gates",
    format: (s) => String(STAGE_DATA[s].gates),
    sub: (s) => STAGE_DATA[s].gateNote,
    bar: (s) => Math.round((1 - STAGE_DATA[s].gates / 5) * 100),
    showBar: true,
  },
  {
    id: "volume",
    label: "Campaigns / mo",
    format: (s) => lifecycleConfigs[s].throughput.replace(" / month", ""),
    bar: (s) => Math.round((STAGE_DATA[s].campaignsMo / 12) * 100),
    showBar: true,
  },
  {
    id: "memory",
    label: "Memory rules",
    format: (s) => String(STAGE_DATA[s].memory),
    bar: (s) => Math.round((STAGE_DATA[s].memory / 4) * 100),
    showBar: true,
  },
];

function MetricBar({ pct, active }: { pct: number; active: boolean }) {
  if (pct <= 0) return null;
  return (
    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full transition-all ${
          active ? "bg-blue-500" : "bg-emerald-500"
        }`}
        style={{ width: `${Math.max(pct, 8)}%` }}
      />
    </div>
  );
}

export function LifecycleImpactChart({
  active,
  onSelect,
  pathname = "/campaigns",
}: {
  active: LifecycleState;
  onSelect?: (s: LifecycleState) => void;
  pathname?: string;
}) {
  return (
    <Card id={LIFECYCLE_IMPACT_ID} className="scroll-mt-24 overflow-hidden p-0">
      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          How value compounds
        </p>
        <p className="text-[12px] text-slate-600">{JOBS_LINE}</p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-[88px_repeat(3,1fr)] border-b border-slate-100">
            <div className="p-3" />
            {lifecycleOrder.map((stage) => {
              const isActive = stage === active;
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => {
                    if (onSelect) {
                      handleLifecycleSelect(stage, active, onSelect, pathname);
                    }
                  }}
                  aria-pressed={isActive}
                  title={
                    isActive
                      ? "Selected — click again to focus this section"
                      : lifecycleConfigs[stage].caption
                  }
                  className={`border-l border-slate-100 p-3 text-left transition-colors ${
                    isActive ? "bg-blue-50 ring-2 ring-inset ring-blue-200" : "hover:bg-slate-50"
                  }`}
                >
                  <p
                    className={`text-[12px] font-semibold ${isActive ? "text-blue-800" : "text-slate-800"}`}
                  >
                    {lifecycleConfigs[stage].label}
                  </p>
                  <p className="mt-0.5 text-[10px] leading-snug text-slate-500">
                    {STAGE_VALUE[stage]}
                  </p>
                </button>
              );
            })}
          </div>

          {METRICS.map((m) => (
            <div
              key={m.id}
              className="grid grid-cols-[88px_repeat(3,1fr)] border-b border-slate-50 last:border-0"
            >
              <div className="flex items-center px-3 py-2.5">
                <p className="text-[10px] font-medium leading-tight text-slate-500">{m.label}</p>
              </div>
              {lifecycleOrder.map((stage) => {
                const isActive = stage === active;
                const pct = m.bar(stage);
                const sub = m.sub?.(stage);
                return (
                  <div
                    key={stage}
                    className={`border-l border-slate-100 px-3 py-2.5 ${
                      isActive ? "bg-blue-50/40" : ""
                    }`}
                  >
                    <p
                      className={`text-[13px] font-semibold tabular-nums ${
                        isActive ? "text-blue-900" : "text-slate-900"
                      }`}
                    >
                      {m.format(stage)}
                    </p>
                    {sub && <p className="text-[10px] text-slate-500">{sub}</p>}
                    {m.showBar && <MetricBar pct={pct} active={isActive} />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-2">
        <p className="text-[10px] text-slate-500">
          Case targets: {CASE_METRICS.cycleVendor} → {CASE_METRICS.cycleMvpTarget} ·{" "}
          {CASE_METRICS.savingsPct} savings ({CASE_METRICS.savingsTarget} on{" "}
          {CASE_METRICS.agencyPlannedYr} planned vendor)
        </p>
      </div>
    </Card>
  );
}
