// Domain types for the Campaign Copilot demo. All data is seeded/simulated —
// no live LLM, no API. See prototype/spec.md.

export type Confidence = "High" | "Medium" | "Low";

export type LifecycleState = "day1" | "month3" | "year1";

export type CheckStatus = "pass" | "flag" | "fail";

export interface Signal {
  claim: string;
  sourceLabel: string;
  sourceUrl: string;
}

export interface Brief {
  id: string;
  campaignId: string;
  title: string;
  summary: string;
  segment: string;
  region: string;
  estReach: string;
  confidence: Confidence;
  confidencePct: number;
  confidenceBasis: string[];
  needsHumanConfirm: boolean;
  signals: Signal[];
  receivedLabel: string;
}

export interface OfferInfo {
  price: string;
  wasPrice?: string;
  terms: string;
  source: string;
}

export interface Draft {
  id: string;
  campaignId: string;
  subjectLine: string;
  aiSuggestedSubject: string;
  preheader: string;
  sendTime: string;
  sendTimeReason: string;
  segment: string;
  greeting: string;
  bodyBlocks: string[];
  offer: OfferInfo;
  ctaLabel: string;
  legalLine: { text: string; source: string };
  aiSuggestedFields: string[];
}

export interface CheckResult {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
}

export interface JudgeResult {
  status: "passed" | "flagged";
  confidence: number;
  model: string;
}

export interface LegalItem {
  id: string;
  sentence: string;
  contextLabel: string;
  status: "pending" | "approved" | "rejected";
}

export interface SmartSendCheck {
  id: string;
  label: string;
  detail?: string;
}

export interface SegmentComparison {
  winner: string;
  loser: string;
  multiple: string;
  reason: string;
  source: string;
}

export interface CampaignResults {
  sent: string;
  openRate: string;
  clickRate: string;
  purchaseLift: string;
  spamComplaintRate: string;
  segmentComparison: SegmentComparison;
  cycleTimeDays: number;
  baselineCycleDays: number;
  baselineCycleLabel: string;
  legalTurnaroundHours: number;
  agencyFeeAvoided: string;
}

export interface MemoryInsight {
  id: string;
  text: string;
  segment: string;
  region: string;
  confidence: Confidence;
  learnedAt: string;
  expiresAt: string;
  retired: boolean;
  /** What the team should do with this learning */
  action: string;
  /** Where it applies on the next campaign */
  appliesWhen: string;
  status: "active" | "proposed" | "expired";
  /** Campaign that produced this learning (proposed insights) */
  sourceCampaign?: string;
}

export type CampaignStage =
  | "Drafting"
  | "In review"
  | "Legal"
  | "Scheduled"
  | "Sent"
  | "Complete";

export type CampaignHealth = "winning" | "on-track" | "at-risk" | "pending";

export type CampaignBucket = "active" | "upcoming" | "closed";

export interface CampaignSummary {
  id: string;
  name: string;
  segment: string;
  stage: CampaignStage;
  daysElapsed: number;
  bucket: CampaignBucket;
  trigger: "reactive" | "planned";
  triggerNote: string;
  health: CampaignHealth;
  healthNote: string;
  memoryNote?: string;
  highlight?: boolean;
}

export interface PivotOption {
  title: string;
  detail: string;
  recommended?: boolean;
}

export interface PivotAlert {
  campaignId: string;
  campaignName: string;
  segment: string;
  healthNote: string;
  agentRead: string;
  options: PivotOption[];
  note: string;
}

// What the lifecycle toggle changes across the app.
export interface LifecycleConfig {
  label: string;
  timeLabel: string;
  agentRole: string;
  humanCheckpoints: number;
  costPerCampaign: string;
  cycleTime: string; // brief-to-sent at this stage
  throughput: string; // campaigns the team can run per month
  autonomyPct: string; // share of the work the agent handles
  measurement: string;
  memoryCount: number; // how many memory cards feel "live" at this stage
  caption: string;
}
