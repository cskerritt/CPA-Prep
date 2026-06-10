# CPA Exam Mastery — Knowledge Web & Study System

A research-backed knowledge base and study plan for passing the **2026 Uniform CPA Examination**.
It turns the AICPA Blueprints (effective **January 1, 2026**) into a connected "web" of everything
you need to know, a deep-dive dossier for each competency area, and a phased plan to get to a passing
score (75 on a 0–99 scale).

> **The exam changed.** As of January 1, 2024 the CPA Exam is **3 Core sections + 1 Discipline**, not
> the old AUD/FAR/REG/BEC. **BEC is retired.** See [`resources/02-bec-crosswalk.md`](resources/02-bec-crosswalk.md)
> if you have old BEC materials.

---

## The exam at a glance

| | Section | Type | Length | Items | MCQ/TBS score weight |
|---|---|---|---|---|---|
| **Core** | **AUD** — Auditing & Attestation | Required | 4 hrs | 78 MCQ + 7 TBS | 50% / 50% |
| **Core** | **FAR** — Financial Accounting & Reporting | Required | 4 hrs | 50 MCQ + 7 TBS | 50% / 50% |
| **Core** | **REG** — Taxation & Regulation | Required | 4 hrs | 72 MCQ + 8 TBS | 50% / 50% |
| **Discipline** | **BAR** — Business Analysis & Reporting | Choose 1 | 4 hrs | 50 MCQ + 7 TBS | 50% / 50% |
| **Discipline** | **ISC** — Information Systems & Controls | Choose 1 | 4 hrs | 82 MCQ + 6 TBS | 60% / 40% |
| **Discipline** | **TCP** — Tax Compliance & Planning | Choose 1 | 4 hrs | 68 MCQ + 7 TBS | 50% / 50% |

You take **all 3 Cores + exactly 1 Discipline** = 4 sections total. Passing score is **75**.

---

## 🖥️ The study app

This repo now includes a **usable study application** — no build step, no server, no account; everything
runs in your browser and saves to localStorage.

**Launch it:**
```bash
# from the repo root (recommended):
python3 -m http.server 8080      # then open http://localhost:8080/app/
# or simply open app/index.html directly in your browser
```

| Tab | What it does |
|---|---|
| **Dashboard** | Plan progress, due flashcards, lifetime accuracy per section vs. readiness targets, weakest-area signals |
| **Study Plan** | Pick 12/16/24 weeks + sequence + Discipline + start date → week-by-week schedule with check-offs and a 2026 Discipline-window check (Jan/Apr/Jul/Oct) |
| **Flashcards** | 168 cards built from the deep-dive sheets, with spaced repetition (Again/Hard/Good/Easy) |
| **Practice** | **210** original blueprint-tagged MCQs with explanations (30+ per section, weighted toward heavy areas); per-area accuracy tracking; one-click "add miss to error log" |
| **TBS Sims** | Task-based-simulation-style worked problems — bank rec, lease schedule, report selection, partner basis, Schedule M-1, variances, SOC selection, S-corp basis — with graded parts and full worked solutions |
| **Error Log** | The highest-ROI artifact — log every miss with the rule + decisive fact; pattern analysis; CSV export |
| **Readiness** | Foundations Red/Yellow/Green self-assessment + per-section go/no-go gates (timed-mix %, TBS timing, two mocks) |
| **Data** | Export/import all progress as JSON; full reset |

**Test it:** `npm install && npm test` runs a **47-assertion** smoke suite (jsdom) covering data integrity,
routing, the planner's 36 plan combinations, SRS scheduling, quiz scoring, TBS grading, the error log,
readiness math, and export/import. CI runs it on every push (`.github/workflows/test.yml`).

**Use it from your phone:** the Pages workflow (`.github/workflows/pages.yml`) deploys the repo as a
static site on every push to the default branch — the app lands at
`https://cskerritt.github.io/CPA-Prep/` (the root redirects to `/app/`). If the first deploy doesn't
auto-enable Pages, set *Settings → Pages → Source: GitHub Actions* once, then re-run the workflow.

> The app's practice questions and cards are **supplements** built from this repo's research — they don't
> replace a commercial review course's volume (thousands of MCQs) or TBS simulations.

## How this repo is organized

```
README.md                         ← you are here
app/                              ← THE STUDY APP (open app/index.html)
  index.html                      ← dashboard · planner · flashcards · practice · TBS sims · error log · readiness
  data/                           ← sections, plan templates, 168 flashcards, 210 MCQs, 8 TBS scenarios
  js/                             ← dependency-free vanilla JS (localStorage persistence)
  test/smoke.mjs                  ← npm test — 47-assertion jsdom suite (runs in CI)
.github/workflows/                ← CI tests on every push + GitHub Pages deploy from main
roadmap/
  01-master-roadmap.md            ← THE KNOWLEDGE WEB: how every section connects (Mermaid maps)
  02-exam-architecture.md         ← structure, scoring, scheduling, the 30-month credit window
foundations/
  00-prerequisites.md             ← the platform of skills assumed before section study is efficient
sections/                         ← deep research dossier per competency area
  core-FAR.md
  core-AUD.md
  core-REG.md
  discipline-BAR.md
  discipline-ISC.md
  discipline-TCP.md
  deep-dives/                     ← exam-ready reference sheets (Phase 2 — all 6 sections)
    FAR-deep-dive.md              ← ASC 606, ASC 842, cash flows, M-1 bridge, gov/NFP
    AUD-deep-dive.md              ← independence matrix, report tree, service grid, COSO, sampling
    REG-deep-dive.md              ← basis, 3-entity comparison, dispositions, business law, OBBBA 2025
    BAR-deep-dive.md              ← ratios/DuPont, variances, consolidations, hedging, gov reconciliation
    ISC-deep-dive.md              ← SOC matrix, Trust Services Criteria, frameworks, data lifecycle, IAM
    TCP-deep-dive.md              ← owner basis/AAA, entity selection, AMT, equity comp, trusts/estate/gift
study-plan/
  01-sequence-and-hours.md        ← what order to sit, how many hours per section
  02-phased-plans.md              ← 12 / 16 / 24-week plans with weekly milestones
  03-weekly-template.md           ← a repeatable week and a daily rhythm
  04-assessment-remediation.md    ← readiness targets, mocks, what to do when you fail
resources/
  01-resource-stack.md            ← official sources first, then review courses, then texts
  02-bec-crosswalk.md             ← how to reuse legacy BEC materials safely
logistics/
  exam-day.md                     ← test-center rules, breaks, scoring mechanics
research/
  research-log.md                 ← living tracker for deepening each area to mastery
```

## How to use it

1. **Start with the web.** Read [`roadmap/01-master-roadmap.md`](roadmap/01-master-roadmap.md) to see how
   the sections share a common spine (transactions → statements → audit → tax → analysis/controls).
2. **Confirm logistics.** Read [`roadmap/02-exam-architecture.md`](roadmap/02-exam-architecture.md) and
   **verify your state board's rules** (eligibility and the credit window vary by jurisdiction).
3. **Shore up the foundation.** Self-assess against [`foundations/00-prerequisites.md`](foundations/00-prerequisites.md).
4. **Pick a sequence + Discipline** in [`study-plan/01-sequence-and-hours.md`](study-plan/01-sequence-and-hours.md).
5. **Work each section dossier** in [`sections/`](sections/) alongside your review course.
6. **Track readiness** with [`study-plan/04-assessment-remediation.md`](study-plan/04-assessment-remediation.md).

## Source authority (in priority order)

1. **AICPA Uniform CPA Examination Blueprints — effective Jan 1, 2026** (the single most important document).
2. AICPA sample test/tutorial, NASBA CPA Exam Candidate Guide, AICPA score-release schedule.
3. Authoritative standards: FASB ASC, GASB/GARS, PCAOB AS, AICPA Code of Professional Conduct, IRC/Circular 230, NIST/COBIT/CIS.
4. Commercial review courses (Becker, UWorld, Gleim, Surgent, NINJA) — for pacing, repetition, and simulation volume. They **serve** the blueprint; they don't replace it.

See [`resources/01-resource-stack.md`](resources/01-resource-stack.md) for the full annotated stack and links.

> ⚠️ **Verify before you rely.** Blueprint weights are ranges, not fixed counts; pass rates shift; vendor
> features/pricing change; and **score-credit windows and education rules are jurisdiction-specific.**
> Always confirm against your state board and the live AICPA/NASBA pages.
