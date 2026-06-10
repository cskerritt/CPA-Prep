/* Phased-plan templates — mirrors study-plan/02-phased-plans.md.
   Each section has a week-block template per plan length; the planner concatenates blocks in the
   chosen sequence and substitutes the chosen Discipline. "DISC" placeholders get the discipline's
   own area labels at generation time. */

window.CPA_PLANS = {
  12: {
    label: "12 weeks — aggressive",
    weeklyHours: "32–36 hrs/wk (~5–6 hrs × 6 days)",
    fits: "Full-time summer study; between graduation & start date; short leave. Only if your accounting base is already strong.",
    blocks: {
      FAR: [
        "FAR Area I — for-profit statements, cash flows, equity, notes, ratios + NFP/gov basics",
        "FAR Area II — cash, receivables, inventory, PP&E, investments, debt, equity",
        "FAR Area III — transactions; cumulative review; half mock; SIT FAR"
      ],
      AUD: [
        "AUD Areas I–II — ethics, acceptance, documentation; risk, controls, ITGCs, materiality, fraud",
        "AUD Area III — evidence, analytics, sampling, confirmations",
        "AUD Area IV — reporting; cumulative review; SIT AUD"
      ],
      REG: [
        "REG Areas I–II — ethics & tax procedure; business law",
        "REG Areas III–IV — property; individual taxation",
        "REG Area V — entity taxation & return review; cumulative review; SIT REG"
      ],
      DISC: [
        "{D} Area I — content + drills",
        "{D} Area II — content + drills",
        "{D} remaining areas; full mock; targeted remediation; SIT {D}"
      ]
    }
  },
  16: {
    label: "16 weeks — recommended default",
    weeklyHours: "24–28 hrs/wk (~4–4.5 hrs × 6 days)",
    fits: "Serious candidates with part-time work or flexible schedules. Best balance of pace, retention, and burnout control.",
    blocks: {
      FAR: [
        "FAR Area I — for-profit statements, cash flows, equity, notes, ratios",
        "FAR Area I NFP/government basics + Area II cash, receivables, inventory",
        "FAR Area II — PP&E, investments, intangibles, liabilities, equity",
        "FAR Area III — transactions; cumulative review; half mock; weak-area repair; SIT FAR"
      ],
      AUD: [
        "AUD Area I — ethics, engagement acceptance, documentation, reporting frames",
        "AUD Area II — planning, risk, controls, IT, materiality, fraud",
        "AUD Area III — evidence, data analytics, sampling, confirmations, special topics",
        "AUD Area IV — reporting; cumulative review; SIT AUD"
      ],
      REG: [
        "REG Area I — ethics & tax procedures; Area II — business law",
        "REG Area III — property; Area IV — individual taxation",
        "REG Area V — entity taxation & return review; cumulative review; SIT REG"
      ],
      DISC: [
        "{D} Area I — content + drills",
        "{D} Area II — content + drills",
        "{D} Area III (and Area IV for TCP) — content + drills",
        "Full mixed review + first full mock",
        "Second full mock; targeted remediation; SIT {D}"
      ]
    }
  },
  24: {
    label: "24 weeks — sustainable",
    weeklyHours: "15–18 hrs/wk (~2.5–3 hrs × 6 days)",
    fits: "Full-time workers, parents, or candidates rebuilding fundamentals. Most sustainable; least retention risk.",
    blocks: {
      FAR: [
        "FAR Area I — for-profit statements, cash flows, equity, notes",
        "FAR Area I — NFP + governmental basics, ratios",
        "FAR Area II — cash, receivables, inventory",
        "FAR Area II — PP&E, investments, intangibles, debt, equity",
        "FAR Area III — revenue, leases, income taxes, fair value",
        "FAR mixed practice phase — timed cumulative sets + TBS drills",
        "FAR final review — two mocks; remediation; SIT FAR (lighter week after)"
      ],
      AUD: [
        "AUD Area I — ethics, independence, acceptance, documentation",
        "AUD Area II — risk, controls, ITGCs, materiality, fraud",
        "AUD Area III — evidence, sampling, analytics, confirmations",
        "AUD Area IV + mixed practice — reporting; timed cumulative sets",
        "AUD final review — mock; remediation; SIT AUD (lighter week after)"
      ],
      REG: [
        "REG Area I — ethics & tax procedure; Area II — business law",
        "REG Area III — property transactions, basis, cost recovery",
        "REG Area IV — individual taxation",
        "REG Area V + mixed practice — entity taxation; timed cumulative sets",
        "REG final review — mock; remediation; SIT REG (lighter week after)"
      ],
      DISC: [
        "{D} Area I — content",
        "{D} Area I/II — content + drills",
        "{D} Area II — content + drills",
        "{D} Area III (and IV for TCP) — content + drills",
        "{D} mixed practice — timed cumulative sets + TBS drills",
        "Full mock #1 + deep review",
        "Full mock #2; targeted remediation; SIT {D}"
      ]
    }
  }
};

window.CPA_SEQUENCES = {
  default: { label: "Default — FAR → AUD → REG → Discipline", order: ["FAR", "AUD", "REG", "DISC"],
    note: "Strongest default: follows content dependencies and front-loads the broadest Core." },
  tax: { label: "Tax specialist — REG → Discipline (TCP) → AUD → FAR", order: ["REG", "DISC", "AUD", "FAR"],
    note: "Ride tax momentum: REG then its deep extension TCP back-to-back." },
  itaudit: { label: "IT audit / SOC — AUD → Discipline (ISC) → FAR → REG", order: ["AUD", "DISC", "FAR", "REG"],
    note: "AUD's controls content flows straight into ISC." },
  reporting: { label: "Reporting / FP&A / Gov — FAR → AUD → Discipline (BAR) → REG", order: ["FAR", "AUD", "DISC", "REG"],
    note: "FAR then its deep extension BAR; REG last." }
};

/* 2026 Discipline testing windows: first month of each quarter. */
window.CPA_DISC_WINDOWS_NOTE =
  "2026 Discipline sections (BAR/ISC/TCP) are administered only in January, April, July, and October — schedule the Discipline sit inside one of those months.";
