"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DollarSign,
  Clock,
  PiggyBank,
  ArrowRight,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MousePointerClick,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LifecycleImpactChart } from "@/components/lifecycle-impact-chart";
import { LifecycleAssumptionsStrip } from "@/components/lifecycle-assumptions-strip";
import { campaignSummaries, pivotAlert, results } from "@/lib/seed";
import { useApp } from "@/lib/app-context";
import { CASE_METRICS } from "@/lib/case-metrics";
import { personaForRole } from "@/lib/personas";
import { DemoHomeLink } from "@/components/demo-home-link";
import type { CampaignBucket, CampaignHealth, CampaignSummary } from "@/lib/types";

const bucketMeta: Record<CampaignBucket, { label: string; tone: "green" | "blue" | "neutral" }> = {
  active: { label: "Active", tone: "green" },
  upcoming: { label: "Upcoming", tone: "blue" },
  closed: { label: "Closed", tone: "neutral" },
};

const healthMeta: Record<CampaignHealth, { label: string; dot: string }> = {
  winning: { label: "Winning", dot: "bg-emerald-500" },
  "on-track": { label: "On track", dot: "bg-blue-500" },
  "at-risk": { label: "Needs a decision", dot: "bg-amber-500" },
  pending: { label: "Not live yet", dot: "bg-slate-300" },
};

const livePerformance: Record<
  string,
  { opens: string; target: string; sent: string; lift?: string }
> = {
  c4: {
    opens: "14%",
    target: "22%",
    sent: "Wave 1 of 2 · 840K sent",
    lift: "Early purchase read · 48h",
  },
};

function AttentionCard() {
  const [choice, setChoice] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  if (done && choice !== null) {
    const picked = pivotAlert.options[choice];
    return (
      <Card className="mt-4 border-emerald-200 bg-emerald-50/50 p-4">
        <p className="text-[14px] font-semibold text-slate-900">{picked.title}</p>
        <p className="mt-1 text-[13px] text-slate-600">Adjusting wave 2.</p>
      </Card>
    );
  }

  return (
    <Card id="vp-decision" className="mt-4 scroll-mt-24 overflow-hidden border-amber-200">
      <div className="flex items-start gap-3 bg-amber-50/60 px-4 py-3">
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />
        <div>
          <p className="text-[14px] font-semibold text-slate-900">Needs you — {pivotAlert.campaignName}</p>
          <p className="mt-1 text-[13px] text-slate-600">{pivotAlert.healthNote}</p>
        </div>
      </div>
      <div className="space-y-2 px-4 py-3">
        {pivotAlert.options.map((o, i) => (
          <button
            key={o.title}
            type="button"
            onClick={() => setChoice(i)}
            className={`w-full rounded-lg border px-3 py-2 text-left text-[13px] font-semibold text-slate-900 ${
              choice === i ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            {o.title}
            {o.recommended && (
              <span className="ml-2 text-[10px] font-semibold text-blue-600">· recommended</span>
            )}
          </button>
        ))}
        <button
          type="button"
          disabled={choice === null}
          onClick={() => setDone(true)}
          className={`rounded-lg px-4 py-2 text-[13px] font-semibold ${
            choice === null
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Approve
        </button>
      </div>
    </Card>
  );
}

function LivePerformancePanel({ campaign }: { campaign: CampaignSummary }) {
  const live = livePerformance[campaign.id];
  if (!live) return null;

  return (
    <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3">
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-100">
          <p className="flex items-center gap-1 text-[10px] text-slate-400">
            <MousePointerClick size={11} /> Opens
          </p>
          <p className="text-[18px] font-semibold text-slate-900">{live.opens}</p>
          <p className="text-[10px] text-amber-700">Target {live.target}</p>
        </div>
        <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-100">
          <p className="text-[10px] text-slate-400">Sent</p>
          <p className="text-[12px] font-medium text-slate-800">{live.sent}</p>
        </div>
        {live.lift && (
          <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-100">
            <p className="flex items-center gap-1 text-[10px] text-slate-400">
              <TrendingUp size={11} /> Purchases
            </p>
            <p className="text-[12px] font-medium text-slate-800">{live.lift}</p>
          </div>
        )}
      </div>
      <p className="mt-2 text-[12px] text-slate-600">{campaign.healthNote}</p>
    </div>
  );
}

export default function CampaignsPage() {
  const { config, role, lifecycle, setLifecycle } = useApp();
  const persona = personaForRole(role ?? "vp");
  const isVp = persona.role === "vp";
  const [bucketFilter, setBucketFilter] = useState<CampaignBucket | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showPivot, setShowPivot] = useState(isVp);

  const filtered = campaignSummaries.filter(
    (c) => bucketFilter === "all" || c.bucket === bucketFilter,
  );

  const kpis =
    lifecycle === "year1"
      ? [
          { icon: Clock, value: config.cycleTime, label: "Brief → sent" },
          { icon: PiggyBank, value: CASE_METRICS.savingsTarget, label: "Agency saved" },
          { icon: DollarSign, value: CASE_METRICS.savingsPct, label: "Of planned vendor" },
        ]
      : lifecycle === "month3"
        ? [
            { icon: Clock, value: CASE_METRICS.cycleAdHocPilot, label: "First ad hoc pilot" },
            { icon: PiggyBank, value: CASE_METRICS.cycleMvpTarget, label: "Case target band" },
            { icon: DollarSign, value: CASE_METRICS.agencyPlannedYr, label: "Planned vendor" },
          ]
        : [
            { icon: Clock, value: CASE_METRICS.cycleMvpTarget, label: "First campaign target" },
            { icon: PiggyBank, value: CASE_METRICS.cycleVendor, label: "Vendor today" },
            { icon: DollarSign, value: CASE_METRICS.agencyPlannedYr, label: "Planned spend" },
          ];

  function rowHref(c: CampaignSummary): string | null {
    if (c.bucket === "closed" && c.highlight) return `/campaign/${c.id}/results`;
    return null;
  }

  function toggleRow(c: CampaignSummary) {
    if (c.bucket === "active") {
      setExpandedId((id) => (id === c.id ? null : c.id));
      if (isVp && c.id === pivotAlert.campaignId) setShowPivot(true);
    }
  }

  return (
    <div className="mx-auto max-w-3xl animate-rise px-8 py-10">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight text-slate-900">
            Campaign pipeline
          </h1>
          <p className="mt-1 text-[14px] text-slate-500">
            Cost · speed · volume — flip <b>How far along</b> to see compounding.
          </p>
        </div>
        <DemoHomeLink />
      </div>

      <motion.div
        key={lifecycle}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="mt-4 rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-3"
      >
        <p className="text-[13px] font-semibold text-blue-900">{config.label}</p>
        <p className="mt-0.5 text-[12px] leading-relaxed text-blue-800/90">{config.caption}</p>
        <p className="mt-2 text-[11px] font-medium text-blue-700/80">
          {config.agentRole} · {config.throughput} · {config.humanCheckpoints} human gate
          {config.humanCheckpoints === 1 ? "" : "s"} · {config.costPerCampaign}/campaign (est.)
        </p>
      </motion.div>

      <motion.div
        key={`kpis-${lifecycle}`}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="mt-5 grid grid-cols-3 gap-3"
      >
        {kpis.map((k) => (
          <Card key={k.label} className="p-4 text-center">
            <k.icon size={18} className="mx-auto text-slate-400" />
            <p className="mt-2 text-[22px] font-semibold tracking-tight text-slate-900">{k.value}</p>
            <p className="text-[11px] font-medium text-slate-500">{k.label}</p>
          </Card>
        ))}
      </motion.div>
      <p className="mt-2 text-center text-[11px] leading-relaxed text-slate-400">
        Agency savings and per-campaign cost are illustrative estimates for a fictional brand.
      </p>

      <div className="mt-3">
        <LifecycleImpactChart active={lifecycle} onSelect={setLifecycle} pathname="/campaigns" />
      </div>

      <LifecycleAssumptionsStrip />

      <p className="mt-5 text-[12px] font-semibold uppercase tracking-wide text-slate-400">
        Campaigns
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {(["all", "active", "upcoming", "closed"] as const).map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => {
              setBucketFilter(b);
              setExpandedId(null);
            }}
            className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
              bucketFilter === b
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {b === "all"
              ? "All"
              : b === "active"
                ? "Active"
                : b === "upcoming"
                  ? "Upcoming"
                  : "Closed"}
          </button>
        ))}
      </div>

      <Card className="mt-3 divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <p className="px-4 py-6 text-center text-[13px] text-slate-500">
            No campaigns in this bucket.
          </p>
        ) : (
          filtered.map((c) => {
            const h = healthMeta[c.health];
            const bucket = bucketMeta[c.bucket];
            const href = rowHref(c);
            const expanded = expandedId === c.id;
            const costLine =
              c.id === "c1"
                ? `${results.cycleTimeDays} days · +18% lift · beat ${CASE_METRICS.cycleMvpTarget} target`
                : c.bucket === "active"
                  ? "Live · tap for metrics"
                  : `${c.stage} · ${c.daysElapsed}d`;

            const rowBody = (
              <>
                <div
                  className={`flex items-start gap-3 px-4 py-3.5 ${
                    c.bucket === "active" ? "cursor-pointer hover:bg-slate-50" : ""
                  } ${href ? "hover:bg-slate-50" : ""}`}
                  onClick={() => c.bucket === "active" && toggleRow(c)}
                  onKeyDown={(e) => {
                    if (c.bucket === "active" && (e.key === "Enter" || e.key === " "))
                      toggleRow(c);
                  }}
                  role={c.bucket === "active" ? "button" : undefined}
                  tabIndex={c.bucket === "active" ? 0 : undefined}
                >
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${h.dot}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[14px] font-semibold text-slate-900">{c.name}</p>
                      <Badge tone={bucket.tone}>{bucket.label}</Badge>
                    </div>
                    <p className="mt-0.5 text-[12px] text-slate-600">
                      {c.segment} · {costLine}
                    </p>
                    {!expanded && (
                      <p className="mt-0.5 text-[12px] text-slate-500">{h.label}</p>
                    )}
                  </div>
                  {href ? (
                    <Link href={href} className="mt-1 shrink-0 text-blue-600">
                      <span className="text-[11px] font-semibold">Results</span>
                      <ArrowRight size={14} className="inline" />
                    </Link>
                  ) : c.bucket === "active" ? (
                    <ChevronDown
                      size={16}
                      className={`mt-1 shrink-0 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
                    />
                  ) : null}
                </div>
                {expanded && <LivePerformancePanel campaign={c} />}
              </>
            );

            return <div key={c.id}>{rowBody}</div>;
          })
        )}
      </Card>

      {isVp && (
        <>
          <button
            type="button"
            onClick={() => setShowPivot((s) => !s)}
            className="mt-4 flex w-full items-center justify-between text-[12px] font-medium text-slate-500 hover:text-slate-800"
          >
            {showPivot ? "Hide" : "Show"} pivot — Summer hydration
            {showPivot ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showPivot && <AttentionCard />}
        </>
      )}
    </div>
  );
}
