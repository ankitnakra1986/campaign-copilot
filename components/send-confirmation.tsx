"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Loader2,
  ShieldCheck,
  Clock,
  ArrowRight,
  PauseCircle,
  User,
  BarChart3,
  Brain,
  Inbox,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { smartSendChecks, draft } from "@/lib/seed";
import { clientConfig } from "@/lib/client-config";
import { useApp } from "@/lib/app-context";

export function SendConfirmation({ id }: { id: string }) {
  const { paused } = useApp();
  const [done, setDone] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setDone((d) => {
        if (d >= smartSendChecks.length) {
          clearInterval(t);
          return d;
        }
        return d + 1;
      });
    }, 250);
    return () => clearInterval(t);
  }, []);

  const running = done < smartSendChecks.length;

  return (
    <div className="mx-auto max-w-2xl animate-rise px-8 py-10">
      {/* Success header */}
      <div className="flex items-center gap-3">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
            running ? "bg-slate-100 text-slate-400" : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {running ? <Loader2 size={20} className="animate-spin" /> : <Check size={22} strokeWidth={3} />}
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {running ? "Running send-time checks…" : "Scheduled to send"}
          </h1>
          <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-slate-500">
            <Clock size={13} /> {draft.sendTime} · {draft.segment}
          </p>
        </div>
      </div>

      {/* Why this time — reasoning, not a magic number */}
      <div className="mt-4 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-[13px] text-blue-900">
        <Clock size={15} className="mt-0.5 shrink-0 text-blue-600" />
        <span>
          <b>Why 6:00 PM?</b> {draft.sendTimeReason}
        </span>
      </div>

      {/* ESP handoff — rides existing rails, not a new platform */}
      <div className="mt-3 flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-700">
        <ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-600" />
        <span>
          <b>Send rails:</b> Handed off to{" "}
          <span className="font-semibold text-slate-900">{clientConfig.esp}</span> — same platform
          your team uses today. Copilot drafts and verifies; {clientConfig.esp} delivers.
        </span>
      </div>

      {/* Who approved + locked — one card: accountability and no surprises */}
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-600">
        <User size={15} className="shrink-0 text-slate-400" />
        <span>
          Approved by <b className="text-slate-800">Maria</b>, cleared by{" "}
          <b className="text-slate-800">Legal</b> — what ships is exactly what they signed off.
        </span>
        <Link
          href={`/campaign/${id}`}
          className="ml-auto shrink-0 font-medium text-blue-600 hover:underline"
        >
          View final email
        </Link>
      </div>

      {/* Smart-send verification */}
      <Card className="mt-4 overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <ShieldCheck size={16} className="text-blue-600" /> Re-verified at the moment of sending
          </h2>
          <p className="mt-0.5 text-[12px] text-slate-500">
            Lists go stale between draft and send — we re-check every recipient.
          </p>
        </div>
        <div className="divide-y divide-slate-50 px-4 py-2">
          {smartSendChecks.map((c, i) => {
            const ok = i < done;
            return (
              <div key={c.id} className="flex items-start gap-2.5 px-1 py-2.5 text-[13px]">
                <span className="mt-0.5 shrink-0">
                  {ok ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  ) : (
                    <Loader2 size={16} className="animate-spin text-slate-300" />
                  )}
                </span>
                <div className={ok ? "text-slate-700" : "text-slate-400"}>
                  <p className="font-medium">{c.label}</p>
                  {ok && c.detail && (
                    <p className="mt-0.5 text-[11.5px] text-slate-500">{c.detail}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {paused && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          <PauseCircle size={16} /> Sends are paused (kill switch on). This will queue and hold
          until an admin resumes — nothing ships during a recall or PR crisis.
        </div>
      )}

      {/* What happens next — closes the loop */}
      {!running && (
        <div className="mt-6">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            What happens next
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {[
              { icon: Clock, text: "Sends 6 PM local, per timezone" },
              { icon: BarChart3, text: "Results land in ~1 week" },
              { icon: Brain, text: "Wins get logged to Memory" },
            ].map((n) => (
              <div
                key={n.text}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[12.5px] text-slate-600"
              >
                <n.icon size={14} className="shrink-0 text-slate-400" />
                {n.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {!running && (
        <div className="mt-6 flex items-center gap-3">
          <Link
            href={`/campaign/${id}/results`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            View results (one week later) <ArrowRight size={16} />
          </Link>
          <Link
            href="/inbox"
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
          >
            <Inbox size={15} /> Back to inbox
          </Link>
        </div>
      )}
    </div>
  );
}
