/** What the agent does not control — stated honestly for VP review. */
export const LIFECYCLE_ASSUMPTIONS = [
  {
    id: "data",
    label: "Data & signals",
    text: "Cardlytics feed must stay fresh and licensed — the agent reacts to signals, it cannot invent competitor pricing.",
  },
  {
    id: "outcomes",
    label: "Measured outcomes",
    text: "Purchase lift depends on holdout tests and retail attribution. Open rate is not a success metric (Apple MPP).",
  },
  {
    id: "savings",
    label: "Agency savings",
    text: "~50% phase-down assumes pilot gates pass and calendar volume shifts in-house — not an instant vendor cut.",
  },
  {
    id: "compliance",
    label: "Compliance",
    text: "Legal still owns claim risk. The agent flags uncertain lines; humans approve before send.",
  },
  {
    id: "economics",
    label: "Year 1 unit cost",
    text: "Illustrative estimate for a fictional brand. $180/campaign is a target after ~12 months of memory + eval gates held — not day-one pricing.",
  },
] as const;
