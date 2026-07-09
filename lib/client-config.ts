// ─────────────────────────────────────────────────────────────────────────────
// CLIENT CONFIG — the ONLY client-specific layer.
//
// Campaign Copilot is a reusable template. The ENGINE
// (proactive brief -> trust stack -> Judge -> legal-only-flags -> smart send ->
// memory) is identical for every client. To redeploy for the next CPG brand,
// swap THIS file — knowledge base, data source, segments, brand skin,
// ESP — and ship in weeks, not months.
//
// Nothing below is hardcoded into components. Everything the engine renders
// that is client-specific reads from here.
// ─────────────────────────────────────────────────────────────────────────────

export interface ClientConfig {
  clientName: string;
  industry: string;
  region: string;
  dataSource: string;
  esp: string;
  primarySegment: string;
  segments: string[];
  brandPrimaryHex: string;
  knowledgeBaseLabel: string;
  // Brand voice is a governed asset — set by the brand owner in the KB, not a
  // per-user personality dial. The agent writes IN this voice; it never invents one.
  brandVoice: { label: string; owner: string };
  // Delivery channel is ALSO just config. The engine authors one structured brief;
  // a thin connector renders it into whichever tool the client already uses.
  // Slack Block Kit ≈ Teams Adaptive Card ≈ HTML email — same brief, different envelope.
  messaging: {
    primary: "Slack" | "Teams" | "Email";
    workspace: string;
    surface: string;
    connectors: string[];
  };
}

// Demo instance: a consumer-foods brand (illustrative name).
export const clientConfig: ClientConfig = {
  clientName: "Nourish Foods Co.",
  industry: "Consumer packaged foods",
  region: "North America",
  dataSource: "Cardlytics",
  esp: "Salesforce Marketing Cloud",
  primarySegment: "Suburban family",
  segments: [
    "Suburban family",
    "Gen Z",
    "Urban millennials",
    "Power elites",
    "Suburban mature",
  ],
  brandPrimaryHex: "#2563EB",
  knowledgeBaseLabel: "Knowledge Base / Product DB",
  brandVoice: {
    label: "Warm, plain-spoken, family-first",
    owner: "Brand team",
  },
  messaging: {
    primary: "Slack",
    workspace: "Nourish Foods",
    surface: "#campaign-copilot",
    connectors: ["Slack Block Kit", "Teams Adaptive Card", "Email (HTML)"],
  },
};

// What stays the same for every client — stated so the reuse story is concrete.
export const engineCapabilities = [
  "Proactive signal briefs",
  "Grounded facts + citations",
  "Evaluator model (Judge)",
  "Legal-only-flags review",
  "Smart send-time verification",
  "Compounding campaign memory",
];
