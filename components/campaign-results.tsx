"use client";

import Link from "next/link";
import {
  MousePointerClick,
  ShoppingCart,
  ShieldAlert,
  EyeOff,
  Trophy,
  Clock,
  DollarSign,
  ArrowRight,
  Brain,
  Gauge,
  Database,
} from "lucide-react";
import { Card, SectionLabel } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { results, draft } from "@/lib/seed";
import { CASE_METRICS } from "@/lib/case-metrics";
import { clientConfig } from "@/lib/client-config";
import { useApp } from "@/lib/app-context";
import { CustomerEmailContent } from "./customer-email-content";

export function CampaignResults({ id }: { id: string }) {
  const { config } = useApp();

  const headline = [
    { icon: MousePointerClick, label: "Click rate", value: results.clickRate, tone: "text-blue-600" },
    { icon: ShoppingCart, label: "Purchase lift", value: results.purchaseLift, tone: "text-emerald-600" },
    { icon: ShieldAlert, label: "Spam complaints", value: results.spamComplaintRate, tone: "text-slate-600" },
  ];

  return (
    <div className="mx-auto max-w-5xl animate-rise px-8 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <SectionLabel>One week later</SectionLabel>
          <h1 className="mt-1 text-[26px] font-semibold tracking-tight text-slate-900">
            Campaign results
          </h1>
          <p className="mt-1 text-[13.5px] text-slate-500">
            July 4th competitive response · {draft.segment} · {results.sent} sent
          </p>
        </div>
        <Badge tone="blue">
          <Gauge size={12} /> Measuring: {config.measurement}
        </Badge>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Left: the numbers that matter */}
        <div>
          {/* Honest MPP line */}
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3">
            <EyeOff size={16} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-[13px] leading-relaxed text-amber-900">
              <b>We don&apos;t celebrate open rate.</b> Apple Mail Privacy inflates it. We
              optimize on <b>clicks and actual purchases</b> — the numbers below.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {headline.map((m) => (
              <Card key={m.label} className="p-4">
                <m.icon size={18} className={m.tone} />
                <p className="mt-2.5 text-[22px] font-semibold tracking-tight text-slate-900">
                  {m.value}
                </p>
                <p className="mt-0.5 text-[12px] text-slate-500">{m.label}</p>
              </Card>
            ))}
          </div>

          {/* Segment win — the memory seed, with the WHY backed by a source */}
          <Card className="mt-3 p-5">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-amber-500" />
              <h3 className="text-sm font-semibold text-slate-900">What we learned</h3>
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-slate-700">
              <b>{results.segmentComparison.winner}</b> converted{" "}
              <b>{results.segmentComparison.multiple}</b> better than{" "}
              <b>{results.segmentComparison.loser}</b> on the value multipack.
            </p>
            <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[12.5px] text-slate-600">
              <Database size={13} className="mt-0.5 shrink-0 text-emerald-600" />
              <span>
                <b className="text-slate-700">Why:</b> {results.segmentComparison.reason}{" "}
                <span className="text-slate-400">· {results.segmentComparison.source}</span>
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-slate-100 pt-3">
              <Link
                href="/memory#proposed"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:gap-2.5"
              >
                <Brain size={14} /> Logged to Memory
                <ArrowRight size={13} />
              </Link>
              <span className="text-[12px] text-slate-400">
                Agent proposes · Diane confirms as rule
              </span>
            </div>
          </Card>

          {/* Business outcome for the VP */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Card className="p-4">
              <Clock size={16} className="text-slate-400" />
              <p className="mt-2 text-[18px] font-semibold tracking-tight text-slate-900">
                {results.cycleTimeDays} days
              </p>
              <p className="text-[12px] text-slate-500">
                vs {results.baselineCycleLabel} with vendor
              </p>
            </Card>
            <Card className="p-4">
              <DollarSign size={16} className="text-slate-400" />
              <p className="mt-2 text-[18px] font-semibold tracking-tight text-slate-900">
                {CASE_METRICS.cycleMvpTarget}
              </p>
              <p className="text-[12px] text-slate-500">Case success band (6–12 wk → 2–5 wk)</p>
            </Card>
          </div>
        </div>

        {/* Right: the end customer's actual experience */}
        <div>
          <SectionLabel>How the customer saw it</SectionLabel>
          <div className="mt-3">
            <PhonePreview />
          </div>
          <p className="mt-3 text-[12px] text-slate-500">
            Segment-relevant · grounded in {clientConfig.dataSource} · one tap to buy
          </p>
        </div>
      </div>
    </div>
  );
}

function PhonePreview() {
  return (
    <div className="mx-auto w-[240px] rounded-[2rem] border-[6px] border-slate-900 bg-slate-900 shadow-xl">
      <div className="relative overflow-hidden rounded-[1.6rem] bg-white">
        <div className="absolute left-1/2 top-2 z-10 h-1 w-16 -translate-x-1/2 rounded-full bg-slate-200" />
        <div className="px-4 pb-1 pt-6 text-[10px] text-slate-400">
          <p className="font-semibold text-slate-700">{clientConfig.clientName}</p>
          <p className="truncate">{draft.subjectLine}</p>
        </div>
        <CustomerEmailContent scale="phone" />
        <div className="h-4" />
      </div>
    </div>
  );
}
