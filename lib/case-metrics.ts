/**
 * Illustrative business metrics for the demo — UI source of truth.
 */
export const CASE_METRICS = {
  agencyPlannedYr: "$500K/yr",
  savingsTarget: "~$250K/yr (est.)",
  savingsPct: "50%",
  cycleVendor: "6–12 weeks",
  cycleMvpTarget: "2–5 weeks",
  /** Ad hoc pilot result (illustrative — beats the 2–5 wk band) */
  cycleAdHocPilot: "9 days",
  cycleVendorDaysMax: 84,
  cycleMvpDaysMid: 25,
  cycleAdHocDays: 9,
  cycleYear1Days: 4,
} as const;

/** Unit-economics curve — cost per campaign as memory compounds */
export const UNIT_ECONOMICS = {
  costDay1: "$1,900",
  costMonth3: "$700",
  costYear1: "$180",
} as const;

export const JOBS_LINE =
  "Fewer gates = fewer vendor round-trips, not fewer people. Managers shift to voice, judgment, and exceptions.";
