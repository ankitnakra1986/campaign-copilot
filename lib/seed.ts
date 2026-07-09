import type {
  Brief,
  CampaignResults,
  CampaignSummary,
  CheckResult,
  Draft,
  JudgeResult,
  LegalItem,
  LifecycleConfig,
  LifecycleState,
  MemoryInsight,
  PivotAlert,
  SmartSendCheck,
} from "./types";

export const CAMPAIGN_ID = "c1";

// The one seeded campaign. Anchored ~2 weeks before July 4th, Southeast (FL/GA),
// suburban family segment. Illustrative demo data throughout.

export const brief: Brief = {
  id: "b1",
  campaignId: CAMPAIGN_ID,
  title: "Competitor undercut your July 4th bundle in the Southeast",
  summary:
    "Harvest Snacks Co. launched a 4th of July snack bundle at 20% off across Florida and Georgia. Suggested response: defend your value multipack with the suburban family segment — your bread-and-butter buyers. The holiday is ~2 weeks out; we can be live in days, not weeks.",
  segment: "Suburban family",
  region: "Florida & Georgia",
  estReach: "1.2M households",
  confidence: "High",
  confidencePct: 88,
  confidenceBasis: [
    "3 independent sources agree — price monitor + 2 Cardlytics signals",
    "Data is fresh — every signal is less than 48h old",
    "Same play won in 3 past July campaigns (Memory)",
    "Large segment — 1.2M households, low sampling error",
  ],
  needsHumanConfirm: true,
  receivedLabel: "Today, 8:02 AM",
  signals: [
    {
      claim: "Harvest Snacks Co. launched a 20%-off July 4th bundle in FL & GA",
      sourceLabel: "Retail price monitor",
      sourceUrl: "https://example.com/price-monitor/competitor-x",
    },
    {
      claim:
        "Suburban parents in FL/GA bought family 12-packs 3x in the last 90 days",
      sourceLabel: "Cardlytics · purchase history",
      sourceUrl: "https://example.com/cardlytics/segment/suburban-family",
    },
    {
      claim: "Purchases cluster on Saturday stock-up trips",
      sourceLabel: "Cardlytics · timing pattern",
      sourceUrl: "https://example.com/cardlytics/pattern/saturday",
    },
  ],
};

// Graceful failure, shown not told: the agent caught something but couldn't
// verify it, so it held rather than guessed. Fail closed, then retry.
export const heldSignal = {
  title: "One more thing — held, not sent",
  body: "I also picked up a hint of a competitor price cut in Texas. But the Product DB was mid-sync, so I couldn't confirm our own price to compare. I'm not going to guess — I've held it and will re-check at the noon sync.",
  status: "Held · re-checking at 12:00 PM",
  mariaNext: "Nothing for you to do — I retry automatically. I'll only ping you if I still can't verify after two attempts.",
  backup: "If the sync fails twice, I fall back to yesterday's cached price and flag it as unverified — I never state a number I can't stand behind.",
};

export const draft: Draft = {
  id: "d1",
  campaignId: CAMPAIGN_ID,
  subjectLine: "One less thing to grab before the 4th",
  aiSuggestedSubject: "One less thing to grab before the 4th",
  preheader: "Your family multipack is ready for the long weekend.",
  sendTime: "Thu, 6:00 PM local",
  sendTimeReason:
    "Suburban-family buyers click 34% more at dinnertime than mid-morning — learned from past sends (Memory).",
  segment: "Suburban family · FL & GA",
  greeting: "Hi Sarah,",
  bodyBlocks: [
    "The long weekend sneaks up fast. Here's one less errand: the family multipack everyone actually reaches for, ready when you are.",
    "Stock up once and you're set for the whole weekend of cookouts.",
  ],
  offer: {
    price: "$14.99",
    wasPrice: "$18.99",
    terms: "Offer valid through July 6. Limit 4 per household.",
    source: "Knowledge Base / Product DB",
  },
  ctaLabel: "Shop the multipack",
  legalLine: {
    text:
      "No purchase necessary. See full terms and nutrition information at example.com/terms.",
    source: "Knowledge Base / Product DB",
  },
  aiSuggestedFields: ["subjectLine", "sendTime", "segment"],
};

// The Knowledge Base / Product DB stays current via a live sync. Shown so
// "how does it know the DB is right?" has a visible answer.
export const kbSyncedLabel = "Product DB synced 7:58 AM today (live feed)";

// Trust panel checks. One intentional amber flag.
export const checkResults: CheckResult[] = [
  {
    id: "chk-price",
    label: "Price matches Product DB",
    status: "pass",
    detail: "$14.99 matches the live Product DB record — synced 7:58 AM today, before this draft.",
  },
  {
    id: "chk-claims",
    label: "Every claim has a source",
    status: "pass",
    detail: "3 of 3 claims cite Cardlytics or price monitor.",
  },
  {
    id: "chk-legal-line",
    label: "Legal disclaimer present",
    status: "pass",
    detail: "Standard terms line pulled from Product DB.",
  },
  {
    id: "chk-banned",
    label: "No banned words",
    status: "pass",
    detail: "No absolute health claims or restricted terms.",
  },
  {
    id: "chk-uncertain",
    label: "1 sentence uncertain — flagged for Legal",
    status: "flag",
    detail:
      '"you\'re set for the whole weekend" reads close to a value guarantee — needs Legal sign-off.',
  },
];

export const judgeResult: JudgeResult = {
  status: "passed",
  confidence: 0.94,
  model: "Evaluator model (Judge)",
};

export const legalItem: LegalItem = {
  id: "leg-1",
  sentence: "Stock up once and you're set for the whole weekend of cookouts.",
  contextLabel: "Body — paragraph 2",
  status: "pending",
};

export const smartSendChecks: SmartSendCheck[] = [
  {
    id: "ss-hygiene",
    label: "Bad addresses removed",
    detail: "1,240 invalid or bouncing addresses held back — protects your sender reputation.",
  },
  { id: "ss-sub", label: "Recipients still subscribed", detail: "890 unsubscribes since draft, auto-removed." },
  { id: "ss-freq", label: "Frequency cap respected", detail: "Max 1 email / 7 days across all campaigns." },
  { id: "ss-price", label: "Price still current", detail: "Re-checked against Product DB at send time." },
  { id: "ss-tz", label: "Delivered 6:00 PM local", detail: "Timezone-correct per recipient." },
];

export const results: CampaignResults = {
  sent: "1.2M",
  openRate: "24%",
  clickRate: "3.1%",
  purchaseLift: "+8% vs control",
  spamComplaintRate: "0.02%",
  segmentComparison: {
    winner: "Florida",
    loser: "Texas",
    multiple: "2.1x",
    reason:
      "Florida suburban families bought value multipacks 3x more often in the last 90 days and had larger baskets.",
    source: "Cardlytics purchase data · Jun 2026",
  },
  cycleTimeDays: 9,
  baselineCycleLabel: "6–12 weeks",
  baselineCycleDays: 63,
  legalTurnaroundHours: 2,
  agencyFeeAvoided: "~$40K",
};

export const memoryInsights: MemoryInsight[] = [
  {
    id: "m1",
    text: "Florida converts 2.1x Texas on value multipacks",
    segment: "Suburban family",
    region: "Southeast",
    confidence: "High",
    learnedAt: "Jun 2026",
    expiresAt: "Nov 2026",
    retired: false,
    action: "Lead with Florida when Southeast value packs are on offer",
    appliesWhen: "Suburban family · FL/GA · multipack campaigns",
    status: "active",
  },
  {
    id: "m2",
    text: "6pm local send beats 9am by 34% on click rate",
    segment: "All segments",
    region: "Southeast",
    confidence: "Medium",
    learnedAt: "May 2026",
    expiresAt: "Sep 2026",
    retired: false,
    action: "Default send window to 5–7 PM local for family segments",
    appliesWhen: "Any family-oriented send in Southeast",
    status: "active",
  },
  {
    id: "m3",
    text: "Free-shipping framing beats %-off for orders over $25",
    segment: "Suburban family",
    region: "National",
    confidence: "High",
    learnedAt: "Apr 2026",
    expiresAt: "Dec 2026",
    retired: false,
    action: "Use free-shipping headline instead of % off when basket > $25",
    appliesWhen: "Suburban family · offers above $25",
    status: "proposed",
    sourceCampaign: "July 4th competitive response",
  },
  {
    id: "m4",
    text: "Sunday sends outperform weekdays",
    segment: "All segments",
    region: "National",
    confidence: "Low",
    learnedAt: "2024",
    expiresAt: "Expired",
    retired: true,
    action: "—",
    appliesWhen: "—",
    status: "expired",
  },
];

export const campaignSummaries: CampaignSummary[] = [
  {
    id: "c1",
    name: "July 4th competitive response",
    segment: "Suburban family",
    stage: "Complete",
    daysElapsed: 9,
    bucket: "closed",
    trigger: "reactive",
    triggerNote: "Competitor price signal — caught overnight, not on the calendar",
    health: "winning",
    healthNote: "+18% purchase lift vs holdout — beat target",
    highlight: true,
  },
  {
    id: "c4",
    name: "Summer hydration push",
    segment: "Active families",
    stage: "Sent",
    daysElapsed: 1,
    bucket: "active",
    trigger: "planned",
    triggerNote: "From your marketing calendar — wave 1 of 2 sent",
    health: "at-risk",
    healthNote: "Opens 14% after day 1 — below the 22% we usually see",
  },
  {
    id: "c2",
    name: "Back-to-school lunchbox push",
    segment: "Urban millennials",
    stage: "In review",
    daysElapsed: 3,
    bucket: "upcoming",
    trigger: "planned",
    triggerNote: "From your marketing calendar — started 6 weeks ahead",
    health: "pending",
    healthNote: "Not live yet — in review",
    memoryNote: "Last year's winning subject lines pre-loaded from Memory",
  },
  {
    id: "c3",
    name: "Labor Day grill bundle",
    segment: "Power elites",
    stage: "Drafting",
    daysElapsed: 1,
    bucket: "upcoming",
    trigger: "planned",
    triggerNote: "From your marketing calendar — queued for the long weekend",
    health: "pending",
    healthNote: "Not live yet — drafting",
    memoryNote: "Reusing what converted last Labor Day",
  },
];

// The VP course-correction moment: agent spots a soft live campaign and
// proposes fixes — but never pivots on its own.
export const pivotAlert: PivotAlert = {
  campaignId: "c4",
  campaignName: "Summer hydration push",
  segment: "Active families · wave 1 of 2",
  healthNote: "Opens 14% after day 1 — below the 22% we usually see",
  agentRead:
    "The subject line is landing flat with the 45+ segment, and Texas is quiet while Florida is opening 2x. Wave 2 hasn't sent yet — there's still time to fix it.",
  options: [
    {
      title: "Shift wave 2 budget to Florida",
      detail: "Florida opens 2x Texas. Move the spend where it's already working.",
      recommended: true,
    },
    {
      title: "Swap the subject line for wave 2",
      detail: "I have a variant that beat this one in a past A/B — ready to queue.",
    },
    {
      title: "Hold the Texas wave",
      detail: "Pause and rework rather than spend into a flat segment.",
    },
  ],
  note: "I won't change anything on my own — pick a direction and I'll run it.",
};

// The lifecycle toggle: same campaign at three moments in time.
export const lifecycleConfigs: Record<LifecycleState, LifecycleConfig> = {
  day1: {
    label: "Starting out",
    timeLabel: "First pilot — no memory yet",
    agentRole: "Agent assists",
    humanCheckpoints: 5,
    costPerCampaign: "$1,900",
    cycleTime: "2–5 weeks",
    throughput: "2 / month",
    autonomyPct: "20%",
    measurement: "Open rate only (weak signal)",
    memoryCount: 0,
    caption: "No history yet. Trust is borrowed, not earned — a human checks every step.",
  },
  month3: {
    label: "3 months in",
    timeLabel: "July 4th shipped — trust building",
    agentRole: "Agent recommends",
    humanCheckpoints: 3,
    costPerCampaign: "$700",
    cycleTime: "9 days",
    throughput: "6 / month",
    autonomyPct: "60%",
    measurement: "Clicks + purchase lift (holdout)",
    memoryCount: 3,
    caption: "Track record building. Evals hold, so the agent has earned some room to move.",
  },
  year1: {
    label: "One year in",
    timeLabel: "Memory compounding — agency line down",
    agentRole: "Agent proposes full campaign",
    humanCheckpoints: 1,
    costPerCampaign: "$180",
    cycleTime: "4 days",
    throughput: "12+ / month",
    autonomyPct: "90%",
    measurement: "Clicks + purchase + memory-fed prediction",
    memoryCount: 4,
    caption: "A year of memory compounding. One human approval remains — always.",
  },
};

export const lifecycleOrder: LifecycleState[] = ["day1", "month3", "year1"];

// Phase 1 pilot — prove workflow before vendor phase-down
export const pilotScope = {
  title: "Phase 1 pilot (6–8 weeks)",
  duration: "6–8 weeks",
  scope: "One ad hoc competitive response · suburban family · US · English",
  gate: "End-to-end in ≤2 weeks · zero legal escapes",
  then: "Then expand to planned calendar campaigns and phase down the $500K agency line.",
};
