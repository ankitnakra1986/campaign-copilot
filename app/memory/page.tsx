"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { memoryInsights } from "@/lib/seed";
import { UNIT_ECONOMICS } from "@/lib/case-metrics";
import { useApp } from "@/lib/app-context";
import { MemoryFlowStrip } from "@/components/memory-flow-strip";
import { LifecycleAssumptionsStrip } from "@/components/lifecycle-assumptions-strip";
import { LIFECYCLE_IMPACT_ID } from "@/lib/lifecycle-nav";
import { DemoHomeLink } from "@/components/demo-home-link";
import type { MemoryInsight } from "@/lib/types";

type ProposedFeedback = "pending" | "confirmed" | "dismissed";

export default function MemoryPage() {
  const { config, lifecycle } = useApp();
  const [toast, setToast] = useState<string | null>(null);
  const [proposedFeedback, setProposedFeedback] = useState<Record<string, ProposedFeedback>>(
    {},
  );

  const active = memoryInsights.filter((m) => !m.retired);
  const retired = memoryInsights.filter((m) => m.retired);
  const liveCount = Math.min(config.memoryCount, active.length);
  const liveInsights = active
    .slice(0, liveCount)
    .sort((a, b) => {
      if (a.status === "proposed" && b.status !== "proposed") return -1;
      if (b.status === "proposed" && a.status !== "proposed") return 1;
      return 0;
    });

  const proposed = liveInsights.find((m) => m.status === "proposed");
  const standing = liveInsights.filter((m) => m.status === "active");
  const proposedPending =
    !!proposed && (proposedFeedback[proposed.id] ?? "pending") === "pending";

  useEffect(() => {
    if (window.location.hash !== "#proposed") return;
    const t = window.setTimeout(() => {
      document.getElementById("proposed")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
    return () => clearTimeout(t);
  }, [liveCount]);

  function handleProposedFeedback(id: string, action: "confirmed" | "dismissed") {
    setProposedFeedback((prev) => ({ ...prev, [id]: action }));
    setToast(
      action === "confirmed"
        ? "Saved for next draft — manager confirmed."
        : "Discarded — will not be used again.",
    );
    window.setTimeout(() => setToast(null), 5000);
  }

  return (
    <div className="mx-auto max-w-2xl animate-rise px-8 py-10">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight text-slate-900">
            Campaign memory
          </h1>
          <p className="mt-1 text-[14px] text-slate-500">
            Confirmed learnings — used on the next draft automatically.
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
        <p className="mt-0.5 text-[12px] leading-relaxed text-blue-800/90">
          {liveCount === 0
            ? "No memory yet at this stage — flip to 3 months in or One year in to preview rules."
            : `${liveCount} active rule${liveCount === 1 ? "" : "s"} feeding the next draft.`}
        </p>
      </motion.div>

      <div id={LIFECYCLE_IMPACT_ID} className="scroll-mt-24 mt-5">
        <MemoryFlowStrip />
      </div>

      <LifecycleAssumptionsStrip />

      {proposedPending && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-[13px] text-amber-900">
          <b>Your move:</b> Confirm or reject the proposed learning below.
        </div>
      )}

      {liveCount === 0 ? (
        <Card className="mt-6 px-6 py-12 text-center">
          <p className="text-[15px] font-semibold text-slate-900">No rules yet</p>
          <p className="mt-2 text-[13px] text-slate-500">
            Memory builds after a campaign completes. Flip to{" "}
            <b>3 months in</b> or <b>One year in</b> (top right) to preview.
          </p>
          <p className="mt-4 border-t border-slate-100 pt-4 text-[12px] leading-relaxed text-slate-400">
            As memory compounds, per-campaign cost drops{" "}
            <b className="text-slate-600">{UNIT_ECONOMICS.costDay1}</b> →{" "}
            <b className="text-slate-600">{UNIT_ECONOMICS.costMonth3}</b> →{" "}
            <b className="text-slate-600">{UNIT_ECONOMICS.costYear1}</b>.
          </p>
        </Card>
      ) : (
        <div className="mt-6 space-y-4">
          {proposed && (
            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                Needs your OK
              </p>
              <MemoryInsightCard
                insight={proposed}
                feedback={proposedFeedback[proposed.id] ?? "pending"}
                onConfirm={() => handleProposedFeedback(proposed.id, "confirmed")}
                onDismiss={() => handleProposedFeedback(proposed.id, "dismissed")}
              />
            </section>
          )}

          {standing.length > 0 && (
            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                Active on next draft ({standing.length})
              </p>
              <div className="space-y-2">
                {standing.map((m) => (
                  <MemoryInsightCard
                    key={m.id}
                    insight={m}
                    feedback="pending"
                    variant="active"
                    onConfirm={() => {}}
                    onDismiss={() => {}}
                  />
                ))}
              </div>
            </section>
          )}

          {retired.length > 0 && (
            <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-3 py-2 text-[12px] text-slate-500">
              <b>Transparency:</b> &ldquo;{retired[0].text}&rdquo; was retired — results stopped
              confirming.
            </p>
          )}
        </div>
      )}

      <p className="mt-6 text-center text-[11px] text-slate-400">
        {config.memoryCount} rule{config.memoryCount === 1 ? "" : "s"} at {config.label} · stale
        rules drop automatically
      </p>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 max-w-md -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-[13px] text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}

function MemoryInsightCard({
  insight: m,
  feedback,
  variant = "proposed",
  onConfirm,
  onDismiss,
}: {
  insight: MemoryInsight;
  feedback: ProposedFeedback;
  variant?: "proposed" | "active";
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  const isProposed = variant === "proposed" && m.status === "proposed";
  const dismissed = isProposed && feedback === "dismissed";
  const confirmed = isProposed && feedback === "confirmed";

  return (
    <Card
      id={isProposed ? "proposed" : undefined}
      className={`scroll-mt-24 p-4 ${
        isProposed && feedback === "pending" ? "ring-2 ring-amber-200/80" : ""
      } ${dismissed ? "opacity-75" : ""} ${variant === "active" ? "border-emerald-100 bg-emerald-50/30" : ""}`}
    >
      {m.sourceCampaign && isProposed && (
        <p className="mb-1 text-[11px] font-medium text-violet-700">From: {m.sourceCampaign}</p>
      )}
      <p
        className={`text-[14px] font-semibold leading-snug ${
          dismissed ? "text-slate-400 line-through" : "text-slate-900"
        }`}
      >
        {m.text}
      </p>
      {!dismissed && (
        <>
          <p className="mt-2 text-[12px] text-slate-600">
            <span className="font-semibold text-slate-700">Next draft:</span> {m.action}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">When: {m.appliesWhen}</p>
        </>
      )}
      {isProposed && feedback === "pending" && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-emerald-700"
          >
            <Check size={13} /> Looks right
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
          >
            <X size={13} /> Not for us
          </button>
        </div>
      )}
      {confirmed && (
        <p className="mt-2 text-[12px] text-emerald-700">Maria confirmed — applies on next draft.</p>
      )}
      {variant === "active" && (
        <Badge tone="green" className="mt-2">
          In use
        </Badge>
      )}
    </Card>
  );
}
