"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Radar,
  Database,
  PenLine,
  Scale,
  CalendarClock,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { clientConfig } from "@/lib/client-config";
import { brief } from "@/lib/seed";
import { CASE_METRICS } from "@/lib/case-metrics";
import { useApp } from "@/lib/app-context";
import { ActionBanner, CaseImpactKpis, caseImpactKpis } from "@/components/case-impact-kpis";
import { DemoHomeLink } from "@/components/demo-home-link";

const howItWorked = [
  { icon: Radar, text: "Scanned competitor pricing" },
  { icon: Database, text: "Checked Cardlytics data" },
  { icon: PenLine, text: "Drafted — facts sourced" },
  { icon: Scale, text: "Flagged 1 line for Legal" },
];

export function OverviewContent() {
  const { config } = useApp();

  const cycleDisplay =
    config.label === "One year in"
      ? `${CASE_METRICS.cycleYear1Days} days`
      : config.label === "3 months in"
        ? CASE_METRICS.cycleAdHocPilot
        : CASE_METRICS.cycleMvpTarget;

  const kpis = caseImpactKpis({
    cycle: cycleDisplay,
    checkpoints: `${config.humanCheckpoints} gate${config.humanCheckpoints === 1 ? "" : "s"}`,
  });

  return (
    <div className="mx-auto max-w-3xl animate-rise px-8 py-10">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <header>
          <p className="text-[12px] font-medium text-slate-400">
            {clientConfig.clientName} · VP dashboard
          </p>
          <h1 className="mt-1 text-[26px] font-semibold tracking-tight text-slate-900">
            Good morning, Diane.
          </h1>
          <p className="mt-1 text-[14px] text-slate-500">
            Impact at a glance — one action needs you today.
          </p>
        </header>
        <DemoHomeLink />
      </div>

      <div className="mt-5">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Impact
        </p>
        <CaseImpactKpis kpis={kpis} />
      </div>

      <div className="mt-4">
        <ActionBanner
          title="Your move today"
          body="Maria has a competitor brief in Slack — approve to start the July 4th response."
          href="/inbox"
          cta="Open Slack brief"
        />
      </div>

      <p className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        Two campaign rhythms
      </p>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <Card className="border-violet-100 bg-violet-50/30 p-4">
          <div className="flex items-center gap-2">
            <CalendarClock size={16} className="text-violet-600" />
            <span className="text-[12px] font-semibold text-violet-800">Planned</span>
          </div>
          <p className="mt-2 text-[15px] font-semibold text-slate-900">
            {CASE_METRICS.agencyPlannedYr} vendor
          </p>
          <p className="mt-1 text-[12px] text-slate-600">
            Seasonal calendar — agent drafts, team approves, vendor phases down.
          </p>
          <Link
            href="/campaigns"
            className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-violet-700"
          >
            Pipeline <ArrowRight size={12} />
          </Link>
        </Card>
        <Card className="border-amber-100 bg-amber-50/30 p-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-amber-600" />
            <span className="text-[12px] font-semibold text-amber-800">Reactive</span>
          </div>
          <p className="mt-2 text-[15px] font-semibold text-slate-900">Competitor moved</p>
          <p className="mt-1 text-[12px] text-slate-600">
            Agent caught it overnight — pilot shipped in {CASE_METRICS.cycleAdHocPilot}.
          </p>
          <Link
            href="/inbox"
            className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-amber-700"
          >
            Today&apos;s brief <ArrowRight size={12} />
          </Link>
        </Card>
      </div>

      <Card className="mt-4 overflow-hidden">
        <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 to-indigo-500" />
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Overnight
            </span>
            <Badge tone="amber">Reactive</Badge>
            <span className="ml-auto flex items-center gap-1 text-[11px] text-slate-400">
              <Clock size={12} />
              {brief.receivedLabel}
            </span>
          </div>

          <h2 className="mt-3 text-[17px] font-semibold leading-snug text-slate-900">
            Harvest Snacks undercut your July 4th bundle 20% in {brief.region}.
          </h2>
          <p className="mt-1 text-[13px] text-slate-500">
            {brief.estReach} {brief.segment.toLowerCase()} buyers exposed.
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {howItWorked.map((s) => (
              <div
                key={s.text}
                className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/60 px-2.5 py-2 text-[11px] text-slate-600"
              >
                <s.icon size={14} className="shrink-0 text-slate-400" />
                {s.text}
              </div>
            ))}
          </div>

          <Link
            href="/campaign/c1"
            className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-600"
          >
            See draft it built <ArrowRight size={14} />
          </Link>
        </div>
      </Card>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Link
          href="/campaigns"
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-[12px] font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Campaign pipeline →
        </Link>
        <Link
          href="/memory"
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-[12px] font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Campaign memory →
        </Link>
      </div>
    </div>
  );
}
