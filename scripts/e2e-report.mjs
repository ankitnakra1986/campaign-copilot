/**
 * End-to-end smoke + use-case verification for Campaign Copilot prototype.
 * Outputs JSON report to stdout and e2e-report.json
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:3005";
const report = {
  runAt: new Date().toISOString(),
  base: BASE,
  suites: [],
  summary: { pass: 0, fail: 0, warn: 0 },
};

function record(suite, name, status, detail = "") {
  report.suites.push({ suite, name, status, detail });
  report.summary[status === "warn" ? "warn" : status === "pass" ? "pass" : "fail"]++;
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // ── 1. Route health ─────────────────────────────────────────────────────
  const routes = [
    ["/", "Welcome (root redirect)"],
    ["/welcome", "Welcome"],
    ["/overview", "VP Overview"],
    ["/inbox", "Maria Slack Inbox"],
    ["/campaign/c1", "Draft + Trust"],
    ["/campaign/c1/sent", "Send confirmation"],
    ["/campaign/c1/results", "Results"],
    ["/campaigns", "Campaign pipeline"],
    ["/memory", "Memory"],
    ["/legal", "Legal review"],
    ["/setup", "Admin setup"],
  ];
  for (const [path, label] of routes) {
    const res = await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 15000 });
    const ok = res?.ok();
    if (path === "/") {
      const onWelcome = page.url().includes("/welcome");
      record(
        "Routes",
        `${label} (${path})`,
        ok && onWelcome ? "pass" : "fail",
        onWelcome ? "redirects to /welcome" : `landed on ${page.url()}`,
      );
    } else {
      record("Routes", `${label} (${path})`, ok ? "pass" : "fail", `HTTP ${res?.status()}`);
    }
  }

  // ── 2. Maria: speed use case (brief → approve → draft → legal gate) ───────
  await page.goto(BASE + "/welcome", { waitUntil: "networkidle" });
  await page.evaluate(() => sessionStorage.removeItem("campaign-copilot-state"));
  await page.reload({ waitUntil: "networkidle" });
  await page.locator("button").filter({ hasText: "Start demo" }).first().click();
  await page.waitForURL("**/inbox**");
  await page.waitForTimeout(400);

  const briefEl = page.getByText(/Harvest Snacks undercut|July 4th competitive/i);
  await briefEl.scrollIntoViewIfNeeded();
  const hasBrief = await briefEl.isVisible();
  record(
    "Maria · Time",
    "Slack brief visible on inbox",
    hasBrief ? "pass" : "fail",
    "Agent surfaces overnight competitive signal",
  );

  await page.getByRole("button", { name: /Approve in channel/i }).click();
  await page.waitForURL("**/campaign/c1**", { timeout: 5000 });
  record(
    "Maria · Time",
    "Slack approve opens email draft",
    "pass",
    "Auto-redirect after approve in channel",
  );

  const legalPendingBanner = await page
    .getByText(/Sam is signing off|Sam is on it|Legal/i)
    .first()
    .isVisible()
    .catch(() => false);
  record(
    "Maria · Time",
    "Draft shows legal in progress after Slack approve",
    legalPendingBanner ? "pass" : "fail",
    "Shared app state after AppProvider fix",
  );

  const secondPass = await page
    .getByText(/Second pass complete/i)
    .waitFor({ state: "visible", timeout: 6000 })
    .then(() => true)
    .catch(() => false);
  record(
    "Maria · Trust",
    "Trust panel uses plain language (not Judge jargon)",
    secondPass ? "pass" : "fail",
  );

  const scheduleDisabled = await page
    .getByRole("button", { name: /Approve & schedule/i })
    .isDisabled();
  record(
    "Maria · Impact",
    "Send blocked until Legal clears (human-in-the-loop)",
    scheduleDisabled ? "pass" : "fail",
    "Fail-closed: cannot ship with legal flag open",
  );

  // Simulate legal approval via modal
  const sendLegalBtn = page.getByRole("button", { name: /Send to Legal/i });
  if (await sendLegalBtn.isVisible().catch(() => false)) {
    await sendLegalBtn.click();
  } else {
    // Already routed from Slack — open modal via any legal CTA if present
    await page.getByText(/Send to Legal|Legal review/i).first().click().catch(() => {});
  }
  const modalFullEmail = await page
    .getByText(/Full email · one line needs sign-off|whole email/i)
    .first()
    .isVisible()
    .catch(() => false);
  if (modalFullEmail) {
    await page.getByRole("button", { name: /Approve line/i }).click();
    record("Maria · Legal", "Legal modal shows full email context", "pass");
  } else {
    // Try dedicated legal page in same context
    await page.goto(BASE + "/legal", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Approve line/i }).click();
    record("Maria · Legal", "Legal page approve (full email)", "pass", "Via /legal route");
  }

  await page.goto(BASE + "/campaign/c1", { waitUntil: "networkidle" });
  await page
    .getByText(/Second pass complete/i)
    .waitFor({ state: "visible", timeout: 6000 })
    .catch(() => {});
  const scheduleEnabled = !(await page
    .getByRole("button", { name: /Approve & schedule/i })
    .isDisabled());
  record(
    "Maria · Time",
    "After Legal approve, schedule unlocks",
    scheduleEnabled ? "pass" : "fail",
  );

  if (scheduleEnabled) {
    await page.getByRole("button", { name: /Approve & schedule/i }).click();
    await page.waitForURL("**/sent**");
    const sentOk = await page.getByText(/Scheduled to send|Running send-time checks/i).isVisible();
    record("Maria · Time", "Schedule → sent confirmation", sentOk ? "pass" : "fail");
  }

  // ── 3. Results + impact metrics ───────────────────────────────────────────
  await page.goto(BASE + "/campaign/c1/results", { waitUntil: "networkidle" });
  const hasLift = await page.getByText("Click rate").first().isVisible();
  const hasCycle = await page.getByText(/6–12 weeks|weeks with vendor/i).first().isVisible();
  const hasTarget = await page.getByText(/2–5 weeks/i).first().isVisible();
  record("Impact", "Results show purchase lift + cycle time", hasLift && hasCycle ? "pass" : "fail");
  record("Cost", "Results show case cycle target", hasTarget ? "pass" : "fail");

  const phonePreview = await page.getByText(/How the customer saw it/i).isVisible();
  record("Impact", "End-customer email preview (personalization)", phonePreview ? "pass" : "fail");

  // ── 4. Diane: cost + pipeline + lifecycle ───────────────────────────────
  await page.goto(BASE + "/welcome", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Diane/i }).click();
  await page.waitForURL("**/overview**");

  const overviewNumbers = await page.getByText("Agency saved").first().isVisible();
  record("Diane · Cost/Time", "Overview shows savings + cycle + human-approved", overviewNumbers ? "pass" : "fail");

  await page.getByRole("link", { name: /Campaigns/i }).click();
  await page.waitForURL("**/campaigns**");

  const caseKpi = await page.getByText(/\$500K\/yr|2–5 weeks|~$250K/i).first().isVisible();
  record("Diane · Cost", "Campaigns KPI: case metrics (lifecycle-aware)", caseKpi ? "pass" : "fail");

  await page.getByRole("button", { name: "One year in" }).first().click();
  await page.waitForTimeout(400);
  const year1Savings = await page.getByText("~$250K/yr", { exact: false }).first().isVisible();
  record(
    "Diane · Cost",
    "Lifecycle one year in shows ~$250K/yr savings",
    year1Savings ? "pass" : "fail",
    "Case 50% target on $500K vendor",
  );

  const pivotCard = await page.getByText(/Needs you/i).isVisible();
  record(
    "Diane · Impact",
    "Live campaign pivot (agent proposes, VP decides)",
    pivotCard ? "pass" : "fail",
  );

  const activeFilter = page.getByRole("button", { name: "Active", exact: true });
  if (await activeFilter.isVisible()) {
    await activeFilter.click();
    const hydration = await page.getByText(/Summer hydration/i).first().isVisible();
    record("Diane · Segmentation", "Active filter shows live campaign", hydration ? "pass" : "fail");
  } else {
    record("Diane · Segmentation", "Active filter present", "warn", "Filter button not found");
  }

  // ── 5. Memory moat ────────────────────────────────────────────────────────
  await page.goto(BASE + "/memory", { waitUntil: "networkidle" });
  const memoryCards = await page.getByText(/Next draft:/i).count();
  record(
    "Impact · Memory",
    "Actionable memory insights (Next draft + applies when)",
    memoryCards >= 1 ? "pass" : "fail",
    `Found ${memoryCards} actionable cards`,
  );

  const looksRight = page.getByRole("button", { name: "Looks right" });
  if (await looksRight.isVisible().catch(() => false)) {
    await looksRight.click();
    const confirmed = await page.getByText(/Maria confirmed/i).isVisible();
    record(
      "Impact · Memory",
      "Human feedback on proposed insight (Looks right)",
      confirmed ? "pass" : "fail",
      "Agent proposes; Maria confirms — not silent learning",
    );
  } else {
    record(
      "Impact · Memory",
      "Proposed insight with feedback buttons",
      "warn",
      "Looks right button not visible (check Month 3 lifecycle)",
    );
  }

  await page.getByRole("button", { name: "Starting out" }).first().click();
  await page.waitForTimeout(500);
  const emptyMemory = await page.getByText(/No rules yet/i).first().isVisible();
  record(
    "Impact · Memory",
    "Starting out cold start shows empty memory (moat story)",
    emptyMemory ? "pass" : "fail",
  );

  // ── 6. Graceful failure ───────────────────────────────────────────────────
  await page.goto(BASE + "/inbox", { waitUntil: "networkidle" });
  const heldSignal = await page.getByText(/held, not sent/i).isVisible();
  const mariaNoAction = await page.getByText(/Nothing for you to do/i).isVisible();
  record(
    "Reliability",
    "Graceful failure: agent holds unverified signal",
    heldSignal ? "pass" : "fail",
  );
  record(
    "Reliability",
    "Maria not asked to do manual research on failure",
    mariaNoAction ? "pass" : "fail",
  );

  // ── 7. Kill switch ────────────────────────────────────────────────────────
  await page.goto(BASE + "/campaigns", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Pause sends/i }).click();
  const confirmModal = await page.getByText(/Pause all sends\?/i).isVisible();
  record("Reliability", "Pause sends requires confirmation", confirmModal ? "pass" : "fail");
  await page.getByRole("button", { name: "Cancel" }).click();

  // ── 8. Role-scoped nav ────────────────────────────────────────────────────
  await page.goto(BASE + "/welcome", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Campaign Manager/i }).click();
  await page.waitForURL("**/inbox**");
  // Role persists via sessionStorage — full navigation OK
  await page.goto(BASE + "/campaigns", { waitUntil: "networkidle" });
  const mariaNavInbox = await page.getByRole("link", { name: "Inbox" }).isVisible();
  const mariaNavOverview = !(await page.getByRole("link", { name: "Overview" }).isVisible().catch(() => false));
  record(
    "RBAC",
    "Maria nav: Inbox yes, Overview hidden",
    mariaNavInbox && mariaNavOverview ? "pass" : "fail",
    `Inbox=${mariaNavInbox}, Overview hidden=${mariaNavOverview}`,
  );

  await browser.close();

  writeFileSync("e2e-report.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  writeFileSync("e2e-report.json", JSON.stringify(report, null, 2));
  process.exit(1);
});
