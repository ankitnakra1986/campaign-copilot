"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Pause, Play, ChevronDown, RotateCcw, Check, AlertTriangle } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { lifecycleOrder, lifecycleConfigs } from "@/lib/seed";
import { handleLifecycleSelect } from "@/lib/lifecycle-nav";
import { personaForPath, personaForRole, PERSONAS, type Role } from "@/lib/personas";
import { DemoHomeLink } from "./demo-home-link";

export function TopBar() {
  const { lifecycle, setLifecycle, config, paused, togglePaused, role, setRole } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmPause, setConfirmPause] = useState(false);
  // Prefer the simulated role chosen at onboarding; fall back to the route.
  const persona = role ? personaForRole(role) : personaForPath(pathname);

  function switchTo(r: Role, landing: string) {
    setRole(r);
    setOpen(false);
    router.push(landing);
  }

  return (
    <header className="relative flex items-center justify-between border-b border-slate-200 bg-white px-6 py-2.5">
      {/* Left: whose chair you're in — now a real switcher (simulated roles) */}
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-3 rounded-xl px-1.5 py-1 transition-colors hover:bg-slate-50"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            {persona.initial}
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-sm font-semibold text-slate-900">{persona.name}</span>
            <span className="text-[11px] text-slate-400">{persona.title}</span>
          </div>
          <ChevronDown
            size={15}
            className={`ml-0.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-[calc(100%+6px)] z-20 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <p className="px-3 pb-1 pt-2.5 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">
                View as
              </p>
              {PERSONAS.map((p) => {
                const active = p.role === persona.role;
                return (
                  <button
                    key={p.role}
                    onClick={() => switchTo(p.role, p.landing)}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-slate-50"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
                      {p.initial}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-semibold text-slate-900">
                        {p.name}
                      </span>
                      <span className="block truncate text-[11px] text-slate-400">
                        {p.title}
                      </span>
                    </span>
                    {active && <Check size={14} className="text-blue-600" />}
                  </button>
                );
              })}
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/welcome");
                }}
                className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2.5 text-left text-[12.5px] font-medium text-slate-500 transition-colors hover:bg-slate-50"
              >
                <RotateCcw size={13} /> Back to start
              </button>
            </div>
          </>
        )}
      </div>

      {/* Right: timeline (the wow) + safety control */}
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-3">
          <DemoHomeLink />
          <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-400">How far along</span>
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              {lifecycleOrder.map((state) => {
                const active = state === lifecycle;
                return (
                  <button
                    key={state}
                    type="button"
                    onClick={() =>
                      handleLifecycleSelect(state, lifecycle, setLifecycle, pathname)
                    }
                    aria-pressed={active}
                    title={
                      active
                        ? `${lifecycleConfigs[state].timeLabel} — click again to jump to chart`
                        : lifecycleConfigs[state].timeLabel
                    }
                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                      active
                        ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {lifecycleConfigs[state].label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => (paused ? togglePaused() : setConfirmPause(true))}
            title={paused ? "Resume all sends" : "Pause all sends (recall / PR crisis)"}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
              paused
                ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                : "border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            }`}
          >
            {paused ? <Play size={13} /> : <Pause size={13} />}
            {paused ? "Resume" : "Pause sends"}
          </button>
          </div>
        </div>
        <p className="text-[10.5px] font-semibold text-blue-600" key={lifecycle}>
          {config.timeLabel} · {config.costPerCampaign}/campaign · {config.cycleTime} brief-to-sent
          · {config.memoryCount} memories
        </p>
      </div>

      {/* Confirm the kill switch — big action, so we ask + explain exactly what it does */}
      {confirmPause && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle size={20} />
              </span>
              <div>
                <h3 className="text-[16px] font-semibold text-slate-900">Pause all sends?</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
                  This is the kill switch. Every scheduled campaign is held at once —{" "}
                  <b>nothing ships</b> until someone resumes. Use it for a product recall or a PR
                  issue.
                </p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-slate-400">
                  Drafts, approvals and results stay untouched — they just wait. Already-sent
                  emails can&apos;t be recalled.
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmPause(false)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  togglePaused();
                  setConfirmPause(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-red-700"
              >
                <Pause size={14} /> Pause all sends
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
