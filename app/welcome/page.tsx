"use client";

import { useRouter } from "next/navigation";
import {
  Sparkles,
  Radar,
  PenLine,
  ShieldCheck,
  Brain,
  ArrowRight,
  Database,
  Settings2,
  Play,
} from "lucide-react";
import { clientConfig } from "@/lib/client-config";
import { CASE_METRICS, UNIT_ECONOMICS } from "@/lib/case-metrics";
import { useApp } from "@/lib/app-context";
import { CaseImpactKpis } from "@/components/case-impact-kpis";
import { PERSONAS, type Role } from "@/lib/personas";

const capabilities = [
  { icon: Radar, title: "Spots signals", sub: "overnight" },
  { icon: PenLine, title: "Drafts email", sub: "sourced facts" },
  { icon: ShieldCheck, title: "Self-checks", sub: "before you see it" },
  { icon: Brain, title: "Learns", sub: "you confirm" },
];

const roleAccent: Record<Role, string> = {
  vp: "from-blue-600 to-indigo-500",
  manager: "from-emerald-600 to-teal-500",
  legal: "from-amber-600 to-orange-500",
};

const WELCOME_ORDER: Role[] = ["manager", "vp", "legal"];
const welcomePersonas = [...PERSONAS].sort(
  (a, b) => WELCOME_ORDER.indexOf(a.role) - WELCOME_ORDER.indexOf(b.role),
);

export default function WelcomePage() {
  const router = useRouter();
  const { setRole, resetDemo } = useApp();

  function enterAs(role: Role, landing: string) {
    setRole(role);
    router.push(landing);
  }

  function startDemo() {
    enterAs("manager", "/inbox");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/40 px-6 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-3xl animate-rise">
        {/* Hero — cold URL visitor gets it in 5 seconds */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-800">
            <Sparkles size={12} />
            Interactive demo
          </span>
          <p className="mt-4 text-[12px] font-medium text-slate-400">
            {clientConfig.clientName} · Campaign Copilot
          </p>
          <h1 className="mt-2 text-[34px] font-semibold leading-[1.15] tracking-tight text-slate-900 sm:text-[40px]">
            Agency: {CASE_METRICS.cycleVendor}.
            <br />
            <span className="text-blue-700">This team: {CASE_METRICS.cycleMvpTarget}.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-slate-600">
            AI agent + human workflow for email campaigns. Grunt work automated — every send still
            human-approved.
          </p>
        </div>

        <div className="mt-8">
          <CaseImpactKpis compact />
        </div>

        <p className="mt-3 text-center text-[12px] leading-relaxed text-slate-500">
          Per-campaign cost drops as memory compounds:{" "}
          <b className="text-slate-800">{UNIT_ECONOMICS.costDay1}</b> Day 1 →{" "}
          <b className="text-slate-800">{UNIT_ECONOMICS.costMonth3}</b> Month 3 →{" "}
          <b className="text-slate-800">{UNIT_ECONOMICS.costYear1}</b> Year 1
        </p>

        <button
          type="button"
          onClick={startDemo}
          className="group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-[16px] font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          <Play size={18} className="fill-white/20" />
          Start demo — Maria&apos;s Monday in Slack
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
        <p className="mt-2 text-center text-[11px] text-slate-400">
          ~6 min · Slack → Draft → <b>Legal</b> → Send → Results → Memory
        </p>

        <div className="mt-6 grid grid-cols-4 gap-2">
          {capabilities.map(({ icon: Icon, title, sub }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/80 px-2 py-3 text-center backdrop-blur-sm"
            >
              <Icon size={16} className="text-slate-500" strokeWidth={1.9} />
              <span className="text-[11px] font-semibold text-slate-800">{title}</span>
              <span className="text-[10px] text-slate-400">{sub}</span>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <Database size={12} className="text-emerald-600" />
          Cardlytics-sourced · nothing invented
        </p>

        <p className="mt-8 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
          Or enter as
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {welcomePersonas.map((p) => (
            <button
              key={p.role}
              type="button"
              onClick={() => enterAs(p.role, p.landing)}
              className="group flex flex-col items-start gap-1.5 rounded-xl border border-slate-200 bg-white p-3.5 text-left transition-all hover:border-slate-300 hover:shadow-sm"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${roleAccent[p.role]} text-[12px] font-semibold text-white`}
              >
                {p.initial}
              </span>
              <span className="text-[13px] font-semibold text-slate-900">{p.name}</span>
              <span className="text-[10px] font-medium text-slate-400">{p.title}</span>
              <span className="text-[11px] leading-snug text-slate-500 line-clamp-2">{p.blurb}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => router.push("/setup")}
          className="group mt-3 flex w-full items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-3 text-left transition-colors hover:border-slate-400 hover:bg-white"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
            <Settings2 size={14} />
          </span>
          <span className="flex-1">
            <span className="block text-[13px] font-semibold text-slate-900">Admin setup</span>
            <span className="block text-[11px] text-slate-500">KB, brand voice, channels</span>
          </span>
          <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-600" />
        </button>

        <p className="mt-6 text-center text-[11px] text-slate-400">
          Nothing auto-sends · Nothing silent-learns · Stale rules retire
        </p>
        <button
          type="button"
          onClick={resetDemo}
          className="mx-auto mt-2 block text-[11px] font-medium text-slate-400 hover:text-slate-600 hover:underline"
        >
          Restart demo
        </button>
      </div>
    </div>
  );
}
