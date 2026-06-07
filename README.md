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

## How this repo is organized

```
README.md                         ← you are here
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
