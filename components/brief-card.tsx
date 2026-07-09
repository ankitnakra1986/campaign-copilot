"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, MapPin, Users, AlertCircle } from "lucide-react";
import { brief, CAMPAIGN_ID } from "@/lib/seed";
import { CitationChip } from "./citation-chip";
import { ConfidencePill } from "./confidence-pill";

export function BriefCard() {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Agent header — Slack-style post */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Sparkles size={18} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">Campaign Copilot</span>
            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
              AGENT
            </span>
          </div>
          <span className="text-xs text-slate-400">{brief.receivedLabel}</span>
        </div>
        <ConfidencePill confidence={brief.confidence} />
      </div>

      <div className="px-6 py-5">
        <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
          Proactive brief · you didn&apos;t ask for this
        </p>
        <h2 className="mt-1 text-lg font-semibold text-slate-900">{brief.title}</h2>

        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Users size={13} /> {brief.segment}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={13} /> {brief.region}
          </span>
          <span className="flex items-center gap-1">
            Est. reach {brief.estReach}
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-700">{brief.summary}</p>

        {/* Human-confirm deferral — anti-theatre honesty */}
        {brief.needsHumanConfirm && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>
              Ad hoc signal — the agent will not draft until you confirm this is a real
              opportunity, not a false alarm.
            </span>
          </div>
        )}

        {/* Citations — every claim sourced */}
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-slate-500">
            Every claim is sourced — click to verify:
          </p>
          <div className="flex flex-wrap gap-2">
            {brief.signals.map((signal) => (
              <CitationChip key={signal.claim} signal={signal} />
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Link
            href={`/campaign/${CAMPAIGN_ID}`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Open draft
            <ArrowRight size={16} />
          </Link>
          <button className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100">
            Skip
          </button>
        </div>
      </div>
    </article>
  );
}
