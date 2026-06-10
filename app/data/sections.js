/* Section metadata — mirrors the AICPA 2026 Blueprint structure captured in /sections/.
   Weights are ranges (the AICPA does not publish fixed per-form counts). */
window.CPA_SECTIONS = {
  FAR: {
    name: "Financial Accounting & Reporting",
    kind: "core",
    color: "#1f5673",
    mcq: 50, tbs: 7, scoreWeight: "50/50",
    hours: [130, 150],
    passRate: "43.46% (Q1 2026)",
    areas: {
      I:   { label: "Financial Reporting", weight: "30–40%" },
      II:  { label: "Select Balance Sheet Accounts", weight: "30–40%" },
      III: { label: "Select Transactions", weight: "20–30%" }
    },
    dossier: "../sections/core-FAR.md",
    deepDive: "../sections/deep-dives/FAR-deep-dive.md"
  },
  AUD: {
    name: "Auditing & Attestation",
    kind: "core",
    color: "#1f6e5c",
    mcq: 78, tbs: 7, scoreWeight: "50/50",
    hours: [90, 110],
    passRate: "47.80% (Q1 2026)",
    areas: {
      I:   { label: "Ethics, Professional Responsibilities & General Principles", weight: "15–25%" },
      II:  { label: "Assessing Risk & Developing a Planned Response", weight: "25–35%" },
      III: { label: "Performing Further Procedures & Obtaining Evidence", weight: "30–40%" },
      IV:  { label: "Forming Conclusions & Reporting", weight: "10–20%" }
    },
    dossier: "../sections/core-AUD.md",
    deepDive: "../sections/deep-dives/AUD-deep-dive.md"
  },
  REG: {
    name: "Taxation & Regulation",
    kind: "core",
    color: "#6e4a1f",
    mcq: 72, tbs: 8, scoreWeight: "50/50",
    hours: [90, 110],
    passRate: "66.65% (Q1 2026)",
    areas: {
      I:   { label: "Ethics, Professional Responsibilities & Federal Tax Procedures", weight: "10–20%" },
      II:  { label: "Business Law", weight: "15–25%" },
      III: { label: "Federal Taxation of Property Transactions", weight: "5–15%" },
      IV:  { label: "Federal Taxation of Individuals", weight: "22–32%" },
      V:   { label: "Federal Taxation of Entities", weight: "23–33%" }
    },
    dossier: "../sections/core-REG.md",
    deepDive: "../sections/deep-dives/REG-deep-dive.md"
  },
  BAR: {
    name: "Business Analysis & Reporting",
    kind: "discipline",
    color: "#37694a",
    mcq: 50, tbs: 7, scoreWeight: "50/50",
    hours: [90, 110],
    passRate: "41.30% (Q1 2026)",
    areas: {
      I:   { label: "Business Analysis", weight: "40–50%" },
      II:  { label: "Technical Accounting & Reporting", weight: "35–45%" },
      III: { label: "State & Local Governments", weight: "10–20%" }
    },
    dossier: "../sections/discipline-BAR.md",
    deepDive: "../sections/deep-dives/BAR-deep-dive.md"
  },
  ISC: {
    name: "Information Systems & Controls",
    kind: "discipline",
    color: "#4a3769",
    mcq: 82, tbs: 6, scoreWeight: "60/40",
    hours: [70, 90],
    passRate: "66.79% (Q1 2026)",
    areas: {
      I:   { label: "Information Systems & Data Management", weight: "35–45%" },
      II:  { label: "Security, Confidentiality & Privacy", weight: "35–45%" },
      III: { label: "Considerations for SOC Engagements", weight: "15–25%" }
    },
    dossier: "../sections/discipline-ISC.md",
    deepDive: "../sections/deep-dives/ISC-deep-dive.md"
  },
  TCP: {
    name: "Tax Compliance & Planning",
    kind: "discipline",
    color: "#69372e",
    mcq: 68, tbs: 7, scoreWeight: "50/50",
    hours: [65, 85],
    passRate: "79.28% (Q1 2026)",
    areas: {
      I:   { label: "Individuals & Personal Financial Planning", weight: "30–40%" },
      II:  { label: "Entity Tax Compliance", weight: "30–40%" },
      III: { label: "Entity Tax Planning", weight: "10–20%" },
      IV:  { label: "Property Transactions (Dispositions)", weight: "10–20%" }
    },
    dossier: "../sections/discipline-TCP.md",
    deepDive: "../sections/deep-dives/TCP-deep-dive.md"
  }
};

window.CPA_CORES = ["FAR", "AUD", "REG"];
window.CPA_DISCIPLINES = ["BAR", "ISC", "TCP"];

/* Readiness targets from study-plan/04-assessment-remediation.md (recommendations, not official). */
window.CPA_TARGETS = {
  topic: { min: 65, label: "End of each topic: 65–70% with understanding of every miss" },
  area: { min: 70, label: "End of each blueprint area: 70–75% timed mixed" },
  twoWeeks: { min: 75, label: "T-2 weeks: 75–80% mixed timed + TBS on time" },
  mocks: { min: 75, label: "Final week: two mocks ≥75, or one ≥80 + one ≥75" }
};

/* Foundations checklist from foundations/00-prerequisites.md */
window.CPA_FOUNDATIONS = [
  { id: "bookkeeping", name: "Bookkeeping mechanics", affects: "FAR, BAR, REG/TCP basis",
    standard: "You can explain every debit and credit in plain English and build a rollforward unprompted.",
    repair: "Kieso/Spiceland Intermediate ch. 1–5 + 50 journal-entry reps." },
  { id: "statements", name: "Financial statements", affects: "FAR, BAR, AUD",
    standard: "You can move from a transaction to its statement impact quickly, across all 5 statements + notes.",
    repair: "Transaction-to-statement drills; statement of cash flows chapter." },
  { id: "govnfp", name: "Governmental & NFP basics", affects: "FAR, BAR",
    standard: "You know statement names, fund categories, donor-restriction logic, and the fund-to-government-wide reconciliation idea.",
    repair: "Granof, Government and Not-for-Profit Accounting — intro + fund chapters." },
  { id: "audit", name: "Audit process & internal control", affects: "AUD, ISC",
    standard: "You can map a process, identify risks, and state what evidence would address each.",
    repair: "Arens — risk + internal control chapters; learn COSO's 5 components." },
  { id: "tax", name: "Tax framework", affects: "REG, TCP",
    standard: "You can explain why a transaction is taxable, deferred, excluded, capitalized, or separately stated.",
    repair: "South-Western Federal Taxation intro; build a Schedule M-1 worksheet from scratch." },
  { id: "legal", name: "Legal reasoning", affects: "REG, AUD",
    standard: "You can spot the triggering fact, not just the topic label, and name the controlling rule.",
    repair: "Work business-law fact patterns; rule vs. exception drills." },
  { id: "quant", name: "Quantitative fluency", affects: "FAR, BAR, REG/TCP",
    standard: "You perform routine calcs without spreadsheet dependence, under time pressure.",
    repair: "Ratio formulas to instant recall; timed arithmetic drills." },
  { id: "data", name: "Spreadsheet & data literacy", affects: "FAR, AUD, BAR, ISC, REG",
    standard: "You can validate a schedule, not just read one; trust-but-verify source data.",
    repair: "Spreadsheet rollforward + foot/tie exercise." },
  { id: "ethics", name: "Ethics & professional responsibility", affects: "AUD, REG",
    standard: "You identify which authority governs the fact pattern before answering.",
    repair: "AICPA Code conceptual framework + independence rules; Circular 230 Subpart B." }
];
