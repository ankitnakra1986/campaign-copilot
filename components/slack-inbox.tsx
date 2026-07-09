"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Hash,
  Star,
  Search,
  ChevronDown,
  Plus,
  Bell,
  Sparkles,
  Bold,
  Italic,
  Link as LinkIcon,
  Paperclip,
  AtSign,
  Send,
  SmilePlus,
  MessageSquare,
  ArrowRight,
  Check,
  PauseCircle,
  Brain,
} from "lucide-react";
import { brief, heldSignal, CAMPAIGN_ID } from "@/lib/seed";
import { APPROVED_IN_CHANNEL_AT } from "@/lib/demo-constants";
import { clientConfig } from "@/lib/client-config";
import { CitationChip } from "./citation-chip";
import { ConfidenceBadge } from "./confidence-badge";
import { DemoHomeLink } from "./demo-home-link";
import { useApp } from "@/lib/app-context";

const SLACK_AUBERGINE = "#3F0E40";
const SLACK_ACTIVE = "#1164A3";
const SLACK_GREEN = "#007a5a";

// ── Left Slack sidebar ───────────────────────────────────────────────────────
function SlackSidebar() {
  const channels = [
    { name: "campaign-copilot", active: true, unread: true },
    { name: "growth-marketing", active: false },
    { name: "legal-review", active: false },
    { name: "general", active: false },
  ];
  const dms = [
    { name: "Campaign Copilot", app: true, presence: "#2EB67D" },
    { name: "Diane Alvarez", presence: "#2EB67D" },
    { name: "Sam Ortiz (Legal)", presence: "#e8912d" },
  ];
  return (
    <aside
      className="hidden w-60 shrink-0 flex-col text-[15px] text-white/70 md:flex"
      style={{ backgroundColor: SLACK_AUBERGINE }}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="text-[15px] font-bold text-white">
            {clientConfig.messaging.workspace}
          </span>
          <ChevronDown size={16} className="text-white" />
        </div>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
          <Bell size={13} className="text-white" />
        </span>
      </div>

      <div className="px-3 py-3">
        <div className="flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-1.5 text-[13px] text-white/60">
          <Search size={13} /> Search Nourish Foods
        </div>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-2 pb-4 text-[14px]">
        <div>
          <div className="flex items-center gap-1 px-2 py-1 text-[13px] text-white/50">
            <ChevronDown size={13} /> Channels
          </div>
          {channels.map((c) => (
            <div
              key={c.name}
              className="flex items-center gap-2 rounded px-2 py-[5px]"
              style={c.active ? { backgroundColor: SLACK_ACTIVE, color: "#fff" } : undefined}
            >
              <Hash size={15} className={c.active ? "text-white" : "text-white/50"} />
              <span className={c.unread && !c.active ? "font-semibold text-white" : ""}>
                {c.name}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2 px-2 py-[5px] text-white/50">
            <Plus size={15} /> Add channel
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1 px-2 py-1 text-[13px] text-white/50">
            <ChevronDown size={13} /> Direct messages
          </div>
          {dms.map((d) => (
            <div key={d.name} className="flex items-center gap-2 rounded px-2 py-[5px]">
              <span className="relative flex h-4 w-4 items-center justify-center">
                <span
                  className="h-2.5 w-2.5 rounded-full ring-2"
                  style={{ backgroundColor: d.presence, boxShadow: `0 0 0 2px ${SLACK_AUBERGINE}` }}
                />
              </span>
              <span className="truncate">{d.name}</span>
              {d.app && (
                <span className="rounded bg-white/15 px-1 py-px text-[9px] font-bold tracking-wide text-white/80">
                  APP
                </span>
              )}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}

// ── Agent author line ────────────────────────────────────────────────────────
function AgentAuthor({ time }: { time: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[15px] font-bold text-slate-900">Campaign Copilot</span>
      <span className="rounded bg-slate-200 px-1 py-px text-[9px] font-bold tracking-wide text-slate-600">
        APP
      </span>
      <span className="text-[12px] text-slate-400">{time}</span>
    </div>
  );
}

function CopilotAvatar({ size = 38 }: { size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-500 text-white"
      style={{ width: size, height: size }}
    >
      <Sparkles size={size * 0.5} />
    </span>
  );
}

// ── The brief attachment content (shared meaning, Slack rendering) ────────────
function BriefFields() {
  return (
    <p className="mt-2 text-[12.5px] font-medium text-slate-700">
      {brief.segment} · {brief.region} · {brief.estReach} · July 4 (~2 weeks out)
    </p>
  );
}

function BriefActions() {
  const router = useRouter();
  const { briefApprovedInSlack, approveBriefInSlack, legalSent, legalApproved } = useApp();
  const [opening, setOpening] = useState(false);

  function handleApprove() {
    approveBriefInSlack();
    setOpening(true);
    window.setTimeout(() => router.push(`/campaign/${CAMPAIGN_ID}`), 1100);
  }

  if (briefApprovedInSlack) {
    return (
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-[13px] font-medium text-green-800">
          <span
            className="flex h-4 w-4 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: SLACK_GREEN }}
          >
            <Check size={11} />
          </span>
          Maria approved in channel · {APPROVED_IN_CHANNEL_AT}
        </div>
        <p className="text-[13px] leading-relaxed text-slate-700">
          {opening ? (
            <b>Opening your email draft…</b>
          ) : (
            <>
              On it — checks running.{" "}
              <Link
                href={`/campaign/${CAMPAIGN_ID}`}
                className="font-semibold text-blue-600 hover:underline"
              >
                Open email draft
              </Link>
              {legalSent && !legalApproved && (
                <>
                  {" "}
                  · then{" "}
                  <Link href="/legal" className="font-semibold text-amber-700 hover:underline">
                    Legal approves one line
                  </Link>
                </>
              )}
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        Your move
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleApprove}
          className="inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: SLACK_GREEN }}
        >
          <Check size={14} /> Approve in channel
        </button>
        <Link
          href={`/campaign/${CAMPAIGN_ID}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Review email first <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

// ── SLACK rendering ──────────────────────────────────────────────────────────
function SlackMessages() {
  const { config } = useApp();
  const learnedCount = config.memoryCount;
  const memoryLine =
    learnedCount === 0
      ? `${clientConfig.brandVoice.label.toLowerCase()} — ${clientConfig.brandVoice.owner} rules applied`
      : `${clientConfig.brandVoice.label.toLowerCase()} + ${learnedCount} learned rule${learnedCount === 1 ? "" : "s"} from prior campaigns`;

  return (
    <div className="space-y-5">
      <div className="group flex gap-3 px-5">
        <CopilotAvatar />
        <div className="min-w-0 flex-1">
          <AgentAuthor time="8:02 AM ET" />
          <p className="mt-1 text-[15px] leading-relaxed text-slate-800">
            Morning, Maria — I checked pricing and purchase data overnight. One thing needs you.
          </p>

          <div className="mt-2 overflow-hidden rounded-md border border-slate-200 bg-white">
            <div className="flex">
              <div className="w-1 shrink-0" style={{ backgroundColor: SLACK_GREEN }} />
              <div className="min-w-0 flex-1 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  What I found
                </p>
                <p className="mt-1 text-[14px] font-bold leading-snug text-slate-900">
                  Harvest Snacks undercut your July 4 bundle 20% in FL &amp; GA
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
                  Suggested response for suburban-family buyers — live in days, not weeks.
                </p>

                <BriefFields />

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <ConfidenceBadge
                    pct={brief.confidencePct}
                    label={brief.confidence}
                    basis={brief.confidenceBasis}
                    placement="bottom"
                  />
                  <span className="text-[11px] text-slate-400">
                    · 3 sources · tap to verify
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {brief.signals.map((s) => (
                    <CitationChip key={s.claim} signal={s} placement="top" />
                  ))}
                </div>

                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Brain size={11} className="shrink-0 text-violet-500" strokeWidth={2} />
                  <span className="truncate">
                    <b className="font-semibold text-slate-600">Voice:</b> {memoryLine}
                  </span>
                </div>

                <BriefActions />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* held signal — fail closed */}
      <div id="held-signal" className="group flex gap-3 px-5 scroll-mt-4">
        <CopilotAvatar />
        <div className="min-w-0 flex-1">
          <AgentAuthor time="8:06 AM ET" />
          <div className="mt-1 rounded-md border border-slate-200 bg-slate-50/60 p-3.5">
            <div className="flex items-center gap-2">
              <PauseCircle size={15} className="shrink-0 text-amber-500" />
              <span className="text-[13px] font-semibold text-slate-800">{heldSignal.title}</span>
              <span className="ml-auto shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10.5px] font-medium text-amber-700">
                {heldSignal.status}
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{heldSignal.body}</p>
            <p className="mt-2 text-[12.5px] font-medium text-slate-700">{heldSignal.mariaNext}</p>
            <p className="mt-2 border-t border-slate-200/70 pt-2 text-[11.5px] leading-relaxed text-slate-400">
              <b className="font-semibold text-slate-500">Backup:</b> {heldSignal.backup}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Composer ─────────────────────────────────────────────────────────────────
function Composer() {
  return (
    <div className="border-t border-slate-200 px-5 py-3">
      <div className="rounded-lg border border-slate-300">
        <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-1.5 text-slate-400">
          <Bold size={14} /> <Italic size={14} /> <LinkIcon size={14} />
        </div>
        <div className="px-3 py-2 text-[14px] text-slate-400">
          Message {clientConfig.messaging.surface}
        </div>
        <div className="flex items-center justify-between px-3 py-1.5 text-slate-400">
          <div className="flex items-center gap-3">
            <Paperclip size={15} /> <AtSign size={15} /> <SmilePlus size={15} />
          </div>
          <span
            className="flex h-6 w-6 items-center justify-center rounded text-white"
            style={{ backgroundColor: SLACK_GREEN }}
          >
            <Send size={13} />
          </span>
        </div>
      </div>
    </div>
  );
}

// ── The full Slack window ────────────────────────────────────────────────────
export function SlackInbox() {
  // After the brief renders, nudge the held-signal into view — fail-closed is easy to miss below the fold.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const held = document.getElementById("held-signal");
      held?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex h-screen w-full bg-white">
      <SlackSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* channel header */}
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-2.5">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Hash size={17} className="text-slate-500" />
              <span className="text-[15px] font-bold text-slate-900">campaign-copilot</span>
              <Star size={14} className="text-slate-300" />
            </div>
            <p className="truncate text-[12px] text-slate-400">
              Shared channel · the whole team sees every brief
            </p>
          </div>
          <DemoHomeLink />
        </header>

        {/* messages */}
        <div className="flex-1 overflow-y-auto py-5">
          <div className="mb-5 flex items-center gap-3 px-5">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="rounded-full border border-slate-200 bg-white px-3 py-0.5 text-[12px] font-semibold text-slate-500">
              Today
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <SlackMessages />
        </div>

        <Composer />
      </div>
    </div>
  );
}
