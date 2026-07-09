import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:3005";
const OUT = "screenshots";
mkdirSync(OUT, { recursive: true });

const shots = [
  { name: "00-welcome", path: "/welcome", wait: 800 },
  { name: "01-overview", path: "/overview", wait: 800 },
  { name: "02-inbox-slack", path: "/inbox", wait: 900 },
  { name: "03-draft", path: "/campaign/c1", wait: 3000 },
  { name: "04-legal", path: "/legal", wait: 800 },
  { name: "05-setup", path: "/setup", wait: 800 },
  { name: "06-sent", path: "/campaign/c1/sent", wait: 2600 },
  { name: "07-results", path: "/campaign/c1/results", wait: 900 },
  { name: "08-memory", path: "/memory", wait: 800 },
  { name: "09-campaigns", path: "/campaigns", wait: 800 },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const s of shots) {
  await page.goto(BASE + s.path, { waitUntil: "networkidle" });
  await page.waitForTimeout(s.wait);
  await page.screenshot({ path: `${OUT}/${s.name}.png`, fullPage: true });
  console.log("shot", s.name);
}

await browser.close();
console.log("DONE");
