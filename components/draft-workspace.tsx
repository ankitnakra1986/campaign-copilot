"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RotateCw } from "lucide-react";
import { draft, legalItem } from "@/lib/seed";
import { CASE_METRICS } from "@/lib/case-metrics";
import { useApp } from "@/lib/app-context";
import { EmailPreview } from "./email-preview";
import { TrustPanel } from "./trust-panel";
import { LegalModal } from "./legal-modal";
import { AgentFriendSummary } from "./agent-friend-summary";
import { CampaignProgress } from "./campaign-progress";
import { DemoHomeLink } from "./demo-home-link";

export function DraftWorkspace({ id }: { id: string }) {
  const router = useRouter();
  const { briefApprovedInSlack, legalApproved, approveLegal, sendToLegal, config, lifecycle } =
    useApp();
  const [subject, setSubject] = useState(draft.subjectLine);
  const [lastChecked, setLastChecked] = useState(draft.subjectLine);
  const [runKey, setRunKey] = useState(0);
  const [editRun, setEditRun] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const dirty = subject.trim() !== lastChecked.trim();

  function saveAndRecheck() {
    setLastChecked(subject);
    setEditRun(true);
    setRunKey((k) => k + 1);
  }

  const yourMove = legalApproved
    ? "Review the email → Approve & schedule."
    : briefApprovedInSlack
      ? "Sam clears one line in Legal — then you schedule. Edit subject anytime."
      : "Approve the brief in Slack first.";

  const weeksBefore = lifecycle === "year1" ? "9 weeks" : "6–12 weeks";

  return (
    <div className="mx-auto max-w-6xl animate-rise px-8 py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/inbox"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-700"
        >
          <ArrowLeft size={14} /> Back to Slack
        </Link>
        <DemoHomeLink />
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        July 4th competitive response
      </h1>

      <CampaignProgress
        briefApproved={briefApprovedInSlack}
        legalApproved={legalApproved}
      />

      <div className="mt-4">
        <AgentFriendSummary
          intro="Draft ready overnight — facts checked. You own the voice."
          rows={[
            {
              label: "Your move",
              body: yourMove,
            },
            {
              label: "Impact",
              body: `${config.cycleTime} to send (was ${weeksBefore}) · beat ${CASE_METRICS.cycleMvpTarget} target.`,
            },
          ]}
        />
      </div>

      {dirty && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5">
          <p className="text-xs text-blue-800">Subject changed — needs a quick re-check.</p>
          <button
            onClick={saveAndRecheck}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
          >
            <RotateCw size={13} /> Save &amp; re-check
          </button>
        </div>
      )}

      <p className="mt-6 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        Email preview — what customers receive
      </p>

      <div className="mt-3 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <EmailPreview
          subject={subject}
          onSubjectChange={setSubject}
          flaggedText={legalItem.sentence}
          compact
          customerView
          showDesignHandoff
        />
        <div className="lg:sticky lg:top-6 lg:self-start">
          <TrustPanel
            runKey={runKey}
            editRun={editRun}
            legalApproved={legalApproved}
            legalPending={briefApprovedInSlack && !legalApproved}
            onSendToLegal={() => {
              sendToLegal();
              setModalOpen(true);
            }}
            onApprove={() => router.push(`/campaign/${id}/sent`)}
          />
        </div>
      </div>

      <LegalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onApprove={() => {
          approveLegal();
          setModalOpen(false);
        }}
      />
    </div>
  );
}
