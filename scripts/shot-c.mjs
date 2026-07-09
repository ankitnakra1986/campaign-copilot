import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
mkdirSync("screenshots", { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1100 } });
await p.goto("http://localhost:3005/campaigns", { waitUntil: "networkidle" });
await p.waitForTimeout(900);
await p.screenshot({ path: "screenshots/campaigns-health.png", fullPage: true });
// pick recommended + approve
await p.getByText("Shift wave 2 budget to Florida").click();
await p.waitForTimeout(300);
await p.getByRole("button", { name: /Approve this fix/ }).click();
await p.waitForTimeout(400);
await p.screenshot({ path: "screenshots/campaigns-approved.png", fullPage: true });
await b.close();
console.log("DONE");
