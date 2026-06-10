/* TBS-style practice scenarios — multi-part worked problems mirroring task-based simulations.
   Part types: "number" (tolerance defaults to 0.5) and "select" (choices + answer index).
   For variance parts, favorable amounts are entered as NEGATIVE numbers (stated in the scenario). */
window.CPA_TBS = [

{ id:"TBS-FAR-1", section:"FAR", area:"II", title:"Bank reconciliation",
  scenario:"Bank statement balance at 12/31: $18,200. Book (general ledger) cash balance at 12/31: $20,340. Deposits in transit: $4,300. Outstanding checks: $2,950. The December bank statement shows a $40 service fee and a $750 NSF check returned by the bank — neither is recorded on the books yet. Reconcile both sides to the true cash balance.",
  parts:[
    { label:"Adjusted (true) BANK balance", type:"number", answer:19550,
      solution:"Bank $18,200 + deposits in transit $4,300 − outstanding checks $2,950 = $19,550. Timing items adjust the BANK side." },
    { label:"Adjusted (true) BOOK balance", type:"number", answer:19550,
      solution:"Book $20,340 − service fee $40 − NSF check $750 = $19,550. Items the bank knows but the books don't adjust the BOOK side — and both sides must agree." },
    { label:"Total credit to Cash required by the adjusting journal entries", type:"number", answer:790,
      solution:"Only book-side items need entries: Dr. Bank fee expense $40, Dr. A/R (NSF) $750, Cr. Cash $790. Deposits in transit and outstanding checks need NO entry — they are timing differences." }
  ] },

{ id:"TBS-FAR-2", section:"FAR", area:"III", title:"Lease liability schedule (Year 1)",
  scenario:"On 1/1/Y1 a lessee signs a 5-year lease: $50,000 payable each December 31, discount rate 6%. The PV factor for a 5-period ordinary annuity at 6% is 4.21236. The lease is classified as a FINANCE lease. Build year 1 of the schedule.",
  parts:[
    { label:"Initial lease liability (and ROU asset) at 1/1/Y1", type:"number", answer:210618, tolerance:2,
      solution:"$50,000 × 4.21236 = $210,618. Both the ROU asset and the lease liability start at the PV of the payments." },
    { label:"Year 1 interest expense", type:"number", answer:12637, tolerance:2,
      solution:"Beginning liability $210,618 × 6% = $12,637." },
    { label:"Lease liability at 12/31/Y1 (after the payment)", type:"number", answer:173255, tolerance:4,
      solution:"$210,618 + interest $12,637 − payment $50,000 = $173,255. (Principal reduction = $50,000 − $12,637 = $37,363.)" },
    { label:"Year 1 amortization of the ROU asset (straight-line)", type:"number", answer:42124, tolerance:2,
      solution:"$210,618 ÷ 5 years = $42,124. Finance-lease total Y1 expense = $12,637 + $42,124 = $54,761 (front-loaded vs. the $50,000 straight-line an operating lease would show)." }
  ] },

{ id:"TBS-AUD-1", section:"AUD", area:"IV", title:"Select the correct audit report",
  scenario:"For each independent situation, select the appropriate report for a nonissuer audit.",
  parts:[
    { label:"A material GAAP departure exists; it is isolated to one account and NOT pervasive.", type:"select",
      choices:["Unmodified","Unmodified + going-concern section","Qualified","Adverse","Disclaimer"], answer:2,
      solution:"Material but not pervasive misstatement → QUALIFIED ('except for')." },
    { label:"The auditor could not observe inventory or perform alternatives; possible effects are material AND pervasive.", type:"select",
      choices:["Unmodified","Unmodified + going-concern section","Qualified","Adverse","Disclaimer"], answer:4,
      solution:"Pervasive SCOPE LIMITATION → DISCLAIMER. The auditor lacks evidence to support any opinion." },
    { label:"Substantial doubt about going concern exists; management's disclosure is adequate.", type:"select",
      choices:["Unmodified","Unmodified + going-concern section","Qualified","Adverse","Disclaimer"], answer:1,
      solution:"Adequate disclosure → UNMODIFIED opinion plus a required separate 'Substantial Doubt About…Going Concern' section." },
    { label:"The statements are materially misstated and the misstatement is pervasive (affects many accounts).", type:"select",
      choices:["Unmodified","Unmodified + going-concern section","Qualified","Adverse","Disclaimer"], answer:3,
      solution:"Material + pervasive MISSTATEMENT (with sufficient evidence of it) → ADVERSE." }
  ] },

{ id:"TBS-REG-1", section:"REG", area:"V", title:"Partner basis & loss limitation",
  scenario:"A partner begins the year with outside basis of $30,000. During the year: share of partnership ORDINARY LOSS $42,000; share of tax-exempt interest $1,000; cash distribution received $8,000; the partner's share of partnership liabilities INCREASED $9,000. Compute the basis math in the required order (income items first, then distributions, then loss).",
  parts:[
    { label:"Basis available to absorb the loss (after income, liabilities, and distributions)", type:"number", answer:32000,
      solution:"$30,000 + tax-exempt income $1,000 + liability increase $9,000 − distribution $8,000 = $32,000. Increases and distributions are applied BEFORE losses." },
    { label:"Loss deductible this year (before at-risk/passive limits)", type:"number", answer:32000,
      solution:"Limited to remaining basis: $32,000 of the $42,000 loss." },
    { label:"Loss suspended (carried forward) due to insufficient basis", type:"number", answer:10000,
      solution:"$42,000 − $32,000 = $10,000 suspends until basis is restored (future income, contributions, or liability increases)." },
    { label:"Ending outside basis", type:"number", answer:0,
      solution:"Basis cannot go below zero: $32,000 − $32,000 deducted = $0." }
  ] },

{ id:"TBS-REG-2", section:"REG", area:"V", title:"Schedule M-1: book income to taxable income",
  scenario:"A C corporation reports BOOK income of $500,000, which includes: federal income tax expense $105,000; municipal bond interest income $20,000; meals expense $40,000 (50% nondeductible); book depreciation $60,000 while tax (MACRS) depreciation is $95,000. Compute the book-to-tax reconciliation.",
  parts:[
    { label:"Total ADDITIONS to book income", type:"number", answer:125000,
      solution:"Add back federal income tax expense $105,000 (permanent) + nondeductible 50% of meals $20,000 (permanent) = $125,000." },
    { label:"Total SUBTRACTIONS from book income", type:"number", answer:55000,
      solution:"Subtract municipal interest $20,000 (permanent) + excess tax depreciation $35,000 ($95k − $60k, temporary → creates a DTL) = $55,000." },
    { label:"Taxable income", type:"number", answer:570000,
      solution:"$500,000 + $125,000 − $55,000 = $570,000." }
  ] },

{ id:"TBS-BAR-1", section:"BAR", area:"I", title:"Standard cost variance analysis",
  scenario:"Standards per unit: 2 lbs of material @ $3.00/lb; 0.5 direct labor hours @ $24.00/hr. Actual results for 10,000 units produced: 21,000 lbs purchased AND used at $3.20/lb; 5,300 DLH worked at $23.50/hr. Enter UNFAVORABLE variances as positive numbers and FAVORABLE variances as negative numbers.",
  parts:[
    { label:"Materials price variance", type:"number", answer:4200,
      solution:"AQ × (AP − SP) = 21,000 × ($3.20 − $3.00) = $4,200 Unfavorable (paid above standard)." },
    { label:"Materials usage (quantity) variance", type:"number", answer:3000,
      solution:"SP × (AQ used − SQ allowed) = $3.00 × (21,000 − 20,000) = $3,000 Unfavorable. SQ allowed = 10,000 units × 2 lbs." },
    { label:"Labor rate variance", type:"number", answer:-2650,
      solution:"AH × (AR − SR) = 5,300 × ($23.50 − $24.00) = −$2,650 → $2,650 FAVORABLE (paid below standard)." },
    { label:"Labor efficiency variance", type:"number", answer:7200,
      solution:"SR × (AH − SH allowed) = $24.00 × (5,300 − 5,000) = $7,200 Unfavorable. SH allowed = 10,000 × 0.5 DLH." }
  ] },

{ id:"TBS-ISC-1", section:"ISC", area:"III", title:"Choose the right SOC engagement",
  scenario:"For each independent client need, select the most appropriate SOC report.",
  parts:[
    { label:"User entities' financial statement auditors need evidence about a payroll processor's controls relevant to ICFR, including operating effectiveness over the year.", type:"select",
      choices:["SOC 1 Type 1","SOC 1 Type 2","SOC 2 Type 2","SOC 3","SOC for Cybersecurity"], answer:1,
      solution:"ICFR relevance → SOC 1; reliance on operating effectiveness over a period → Type 2." },
    { label:"A cloud provider wants a general-use report/seal it can post publicly for marketing.", type:"select",
      choices:["SOC 1 Type 1","SOC 1 Type 2","SOC 2 Type 2","SOC 3","SOC for Cybersecurity"], answer:3,
      solution:"SOC 3 is the general-use summary of a SOC 2 examination — the only one designed for public distribution." },
    { label:"A prospective enterprise customer wants detailed evidence about the provider's security and availability controls operating over the past 12 months.", type:"select",
      choices:["SOC 1 Type 1","SOC 1 Type 2","SOC 2 Type 2","SOC 3","SOC for Cybersecurity"], answer:2,
      solution:"Trust Services categories (security, availability) with operating effectiveness over a period → SOC 2 Type 2 (restricted to knowledgeable parties like this customer)." },
    { label:"The board of directors wants an examination report on the ENTITY-WIDE cybersecurity risk management program.", type:"select",
      choices:["SOC 1 Type 1","SOC 1 Type 2","SOC 2 Type 2","SOC 3","SOC for Cybersecurity"], answer:4,
      solution:"SOC for Cybersecurity covers the entity-wide cyber risk program for a broad audience — not a specific service system." }
  ] },

{ id:"TBS-TCP-1", section:"TCP", area:"II", title:"S-corp shareholder basis & distribution",
  scenario:"The sole shareholder of an S corporation (no accumulated C-corp E&P) begins the year with STOCK basis of $25,000 and no debt basis. Current-year items: ordinary business income $30,000; tax-exempt interest $2,000; nondeductible expenses $3,000; cash distribution $60,000. Apply the ordering rules: income increases first, THEN distributions, THEN nondeductible expenses/losses.",
  parts:[
    { label:"Stock basis available immediately before the distribution", type:"number", answer:57000,
      solution:"$25,000 + ordinary income $30,000 + tax-exempt interest $2,000 = $57,000. Income items (including tax-exempt) increase basis BEFORE distributions." },
    { label:"Tax-free portion of the $60,000 distribution", type:"number", answer:57000,
      solution:"Distributions are tax-free to the extent of stock basis: $57,000 (reducing basis to zero)." },
    { label:"Capital gain recognized on the distribution", type:"number", answer:3000,
      solution:"$60,000 − $57,000 = $3,000 capital gain (distribution in excess of basis). With no E&P there is no dividend layer." },
    { label:"Ending stock basis", type:"number", answer:0,
      solution:"Basis is zero after the distribution; the $3,000 of nondeductible expenses cannot drive basis below zero (no carryover by default)." }
  ] }
];
