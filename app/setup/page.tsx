import Link from "next/link";
import {
  Database,
  AudioLines,
  MessagesSquare,
  Target,
  Lock,
  Pencil,
  Clock,
  ArrowLeft,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { Card, SectionLabel } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { clientConfig } from "@/lib/client-config";
import { pilotScope } from "@/lib/seed";

// The client-specific config layer. "Locked" = governed, agent obeys it.
// "Editable" = the owner sets it per client. Each shows what it controls,
// what's available now, and what's on the roadmap.
const configItems = [
  {
    icon: Database,
    label: "Knowledge Base",
    value: clientConfig.knowledgeBaseLabel,
    note: "The source of truth for prices, claims and legal lines — copied, never invented.",
    now: ["Product DB", "CSV upload"],
    soon: "CRM / PIM auto-sync",
    locked: true,
  },
  {
    icon: AudioLines,
    label: "Brand voice",
    value: clientConfig.brandVoice.label,
    note: `How the agent is allowed to write. Owned by ${clientConfig.brandVoice.owner}.`,
    now: ["Guidelines doc", "Sample emails"],
    soon: "Learn voice from past sends",
    locked: true,
  },
  {
    icon: MessagesSquare,
    label: "Delivery channel",
    value: clientConfig.messaging.primary,
    note: "Where briefs land for the team. Same brief, any surface.",
    now: ["Slack", "Email"],
    soon: "Teams, in-app",
    locked: false,
  },
  {
    icon: Database,
    label: "Data source",
    value: clientConfig.dataSource,
    note: "Signals that pick who to target. Consent-aware.",
    now: ["Cardlytics"],
    soon: "First-party CRM, GA4",
    locked: false,
  },
  {
    icon: Database,
    label: "Email platform (ESP)",
    value: clientConfig.esp,
    note: "Where approved campaigns actually send. Copilot hands off — no rip-and-replace.",
    now: ["Journey API", "Audience sync"],
    soon: "Send-time webhook feedback",
    locked: false,
  },
  {
    icon: Clock,
    label: "Send timing",
    value: "6 PM local · max 1 / 7 days",
    note: "You set the guardrails. The agent picks the exact time from Memory within them.",
    now: ["Quiet hours", "Frequency cap"],
    soon: "Per-segment windows",
    locked: false,
  },
];

const loop = [
  { initial: "D", name: "Diane", role: "VP", does: "Approves priorities", tone: "bg-blue-600" },
  { initial: "M", name: "Maria", role: "Manager", does: "Shapes tone, ships", tone: "bg-emerald-600" },
  { initial: "S", name: "Sam", role: "Legal", does: "Clears flagged lines", tone: "bg-amber-600" },
  { initial: "L", name: "Leo", role: "Design", does: "Owns templates + assets", tone: "bg-violet-500" },
  { initial: "N", name: "Nina", role: "Copy", does: "Owns messaging guidelines", tone: "bg-rose-500" },
];

export default function SetupPage() {
  return (
    <div className="min-h-screen overflow-y-auto bg-canvas">
      <div className="mx-auto max-w-3xl animate-rise px-8 py-10">
        <Link
          href="/welcome"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-700"
        >
          <ArrowLeft size={14} /> Back
        </Link>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <SectionLabel>Owner / Admin</SectionLabel>
            <h1 className="mt-1 text-[24px] font-semibold tracking-tight text-slate-900">
              Set up for {clientConfig.clientName}
            </h1>
            <p className="mt-1.5 text-[14px] leading-relaxed text-slate-500">
              This is the only thing that changes per client. The engine never does.
            </p>
          </div>
          <Badge tone="blue" className="mt-1 shrink-0">
            <RefreshCw size={11} /> Reusable engine
          </Badge>
        </div>

        {/* What changes per client */}
        <p className="mt-7 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          What you configure
        </p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {configItems.map((c) => (
            <Card key={c.label} className="p-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  <c.icon size={14} /> {c.label}
                </span>
                <span
                  className={`flex items-center gap-1 text-[10px] font-medium ${
                    c.locked ? "text-slate-400" : "text-blue-600"
                  }`}
                >
                  {c.locked ? <Lock size={10} /> : <Pencil size={10} />}
                  {c.locked ? "Locked" : "Editable"}
                </span>
              </div>
              <p className="mt-2 text-[15px] font-semibold text-slate-900">{c.value}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">{c.note}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                {c.now.map((o) => (
                  <span
                    key={o}
                    className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10.5px] font-medium text-slate-600"
                  >
                    {o}
                  </span>
                ))}
                <span className="rounded-md border border-dashed border-slate-300 px-1.5 py-0.5 text-[10.5px] font-medium text-slate-400">
                  Soon · {c.soon}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Phase 1 pilot scope */}
        <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50/50 px-5 py-4">
          <p className="text-[13px] font-semibold text-slate-900">{pilotScope.title}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
            <b>Scope:</b> {pilotScope.scope}
          </p>
          <p className="mt-1 text-[12.5px] text-slate-500">
            <b>Gate:</b> {pilotScope.gate} · <b>Then:</b> {pilotScope.then}
          </p>
        </div>

        {/* Personalization — one compact strip, not a whole section */}
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <Target size={14} /> Personalization
            </span>
            {clientConfig.segments.map((s) => (
              <span
                key={s}
                className={`rounded-full border px-2.5 py-0.5 text-[11.5px] font-medium ${
                  s === clientConfig.primarySegment
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                {s}
                {s === clientConfig.primarySegment && " · pilot"}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[12.5px] text-slate-500">
            {clientConfig.dataSource} picks who; Maria picks how it sounds. Segment-level,
            consent-aware — the bonus, not the headline.
          </p>
        </div>

        {/* Who's in the loop */}
        <p className="mt-7 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Who&apos;s in the loop
        </p>
        <Card className="mt-2 divide-y divide-slate-100">
          {loop.map((p) => (
            <div key={p.name} className="flex items-center gap-3 px-5 py-2.5">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold text-white ${p.tone}`}
              >
                {p.initial}
              </span>
              <p className="text-[13px] text-slate-700">
                <b className="font-semibold text-slate-900">{p.name}</b>
                <span className="text-slate-400"> · {p.role}</span>
              </p>
              <span className="ml-auto text-[12.5px] text-slate-500">{p.does}</span>
            </div>
          ))}
        </Card>
        <p className="mt-2 text-[12px] text-slate-400">
          Design &amp; Content keep their own tools — the agent works inside what they already own.
        </p>

        {/* The punchline */}
        <div className="mt-7 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5">
          <p className="text-[13px] leading-relaxed text-slate-600">
            <b>Reuse in weeks, not months.</b>{" "}
            Next client = swap this config. The engine — trust stack, Judge, memory — never
            changes. That&apos;s the reusable product asset.
          </p>
          <Link
            href="/inbox"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            See it live <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
