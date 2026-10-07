# Campaign Copilot

**Live demo:** [campaign-copilot-five.vercel.app](https://campaign-copilot-five.vercel.app/welcome)

An AI agent + human workflow that helps a brand's marketing team run email campaigns. The agent does the grunt work overnight. Humans keep judgment, voice, and go/no-go.

Built as a clickable product prototype (Next.js) — not a production ESP. No API keys required.

*All numbers in the demo (e.g. ~$250K/yr agency savings, $1,900 → $180 per campaign) are illustrative estimates for a fictional brand, not real results.*

---

## The problem it solves

A CPG marketing team runs two rhythms:

- **Seasonal** — planned holidays, still **6–12 weeks** and **~$500K/year** to an agency
- **Ad hoc** — competitor moves, becomes a manual scramble

Both miss the moment. Learning dies in decks. Every campaign starts from zero.

**Campaign Copilot** replaces that pipe with a loop that learns: signal → draft → review → send → memory.

---

## What you'll see in the demo

| Screen | Who | What happens |
|--------|-----|--------------|
| `/setup` | Admin | One-time client config — Product DB + brand voice locked; Slack, Cardlytics, Salesforce editable |
| `/inbox` | Maria (Manager) | Monday Slack brief — Harvest Snacks undercut July 4th pricing; every claim sourced |
| `/campaign/c1` | Maria | Draft + trust panel — facts pre-checked; one line flagged for Legal |
| `/legal` | Sam (Legal) | One flagged line, one source, one sign-off (~45 seconds) |
| `/campaign/c1/sent` | Maria | Pre-send checks + kill switch — fail closed |
| `/campaigns` | Diane (VP) | Portfolio view — soft campaign flagged; agent recommends, Diane decides |
| `/memory` | Team | Client-owned insights compound; stale rules auto-retire |

**Demo path (recommended):**  
`/welcome` → `/setup` → `/inbox` → `/campaign/c1` → `/legal` → `/campaign/c1/sent` → `/campaigns` → `/memory`

---

## Product principles

1. **Agent prepares. Human decides.** Nothing auto-sends. Nothing silent-learns.
2. **Facts locked. Judgment human.** Prices, claims, legal lines come from the Product DB — never invented.
3. **Judge flags, never approves.** Autonomy is earned over time (Day 1 → Month 3 → Year 1).
4. **Same engine. Client config changes.** Redeploy for the next brand by swapping config — not rebuilding the product.
5. **Memory is the moat.** Anyone can rent the same AI. Nobody can rent this client's campaign memory.

---

## Tech stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS 4** + Framer Motion
- Seeded demo data in `lib/seed.ts` — no database, no auth, no LLM calls
- Hosted on **Vercel**

---

## Run locally

```bash
git clone https://github.com/ankitnakra1986/campaign-copilot.git
cd campaign-copilot
npm install
npm run dev
```

Open [http://localhost:3000/welcome](http://localhost:3000/welcome).

```bash
npm run build   # production build check
```

---

## Project structure

```
app/           # Routes (welcome, setup, inbox, campaign, legal, campaigns, memory)
components/    # UI — Slack inbox, trust panel, draft workspace, VP dashboard
lib/           # Seed data, client config, metrics, personas
screenshots/   # Reference captures of key screens
```

The only client-specific layer is `lib/client-config.ts`. Everything else is the reusable engine.

---

## Why I built this

I wanted a working answer to: *how do agents and humans actually share a campaign workflow — without replacing judgment or inventing facts?*

So I built the loop end to end: proactive brief in Slack, trust checks before a human reads a word, legal sees only what needs legal, VP owns the pivot call, and memory compounds so the next campaign starts warm.

---

## Built by

**Ankit Nakra** — Product & AI Leader  
[LinkedIn](https://www.linkedin.com/in/ankitnakra) · [GitHub](https://github.com/ankitnakra1986)

---

*Fictional brand (Nourish Foods) and personas used for narrative clarity. Illustrative metrics.*
