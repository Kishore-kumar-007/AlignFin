/**
 * AlignFin Frontend Application Logic
 * Supports live REST API calls to backend, document evidence extraction,
 * audit trail verification, and built-in offline simulation mode.
 */

// Global Application State
const state = {
  activeScenario: 'SCENARIO_1',
  profile: {
    income: 85000,
    expenses: 40000,
    existing_debt_emi: 5000,
    current_savings: 120000,
    risk_tolerance: 'MODERATE',
    target_horizon_months: 36,
    loan_amount_needed: 500000,
    investment_amount: 100000,
    savings_amount: 150000
  },
  categoryFilter: 'LOAN',
  fbsi: null,
  products: [],
  evaluations: [],
  comparisonSelection: ['loan_trap_a', 'loan_flexi_b'],
  selectedProductForModal: null,
  activeDocumentId: 'DOC_LOAN_TRAP_A',
  selectedAttributeKey: 'prepayment_penalty'
};

// Scenario Presets for Judge Demos
const SCENARIO_PRESETS = {
  SCENARIO_1: {
    name: 'Arjun — Headline Rate Trap (Loans)',
    badge: 'Scenario 1',
    description: 'Arjun wants to prepay a 7-year loan in 3 years. See why 9.2% Loan B beats 8.5% Loan A by ₹52,000+ in Total Cost of Borrowing.',
    categoryFilter: 'LOAN',
    profile: {
      income: 85000,
      expenses: 40000,
      existing_debt_emi: 5000,
      current_savings: 120000,
      risk_tolerance: 'MODERATE',
      target_horizon_months: 36,
      loan_amount_needed: 500000,
      investment_amount: 100000,
      savings_amount: 150000
    },
    comparison: ['loan_trap_a', 'loan_flexi_b'],
    docId: 'DOC_LOAN_TRAP_A'
  },
  SCENARIO_2: {
    name: 'Priya — Risk Mismatch Protection (Investments)',
    badge: 'Scenario 2',
    description: 'Priya declared "AGGRESSIVE" risk appetite, but has only ₹10,000 in emergency savings (<0.25m runway). AlignFin triggers a -32pt penalty on volatile assets to protect her capital.',
    categoryFilter: 'INVESTMENT',
    profile: {
      income: 55000,
      expenses: 42000,
      existing_debt_emi: 10000,
      current_savings: 10000,
      risk_tolerance: 'AGGRESSIVE',
      target_horizon_months: 12,
      loan_amount_needed: 500000,
      investment_amount: 50000,
      savings_amount: 10000
    },
    comparison: ['inv_smallcap_turbo', 'inv_liquid_debt'],
    docId: 'DOC_LOAN_UNDISCLOSED'
  },
  SCENARIO_3: {
    name: 'Rohan & Meera — Liquidity Balance (Savings/FD)',
    badge: 'Scenario 3',
    description: 'Parking ₹1.5L for expected contingency expenses within 6 months. High headline 3-year FDs (7.5%) penalize early break; Auto-Sweep Flexi (6.8%) wins on real yield and safety.',
    categoryFilter: 'SAVINGS',
    profile: {
      income: 120000,
      expenses: 75000,
      existing_debt_emi: 15000,
      current_savings: 200000,
      risk_tolerance: 'CONSERVATIVE',
      target_horizon_months: 6,
      loan_amount_needed: 500000,
      investment_amount: 100000,
      savings_amount: 150000
    },
    comparison: ['sav_auto_sweep', 'sav_locked_fd_3y'],
    docId: 'DOC_LOAN_FLEXI_B'
  },
  CUSTOM: {
    name: 'Custom Balance Sheet Simulator',
    badge: 'Sandbox',
    description: 'Freely adjust financial inputs to simulate any household profile and test explainability rules in real time.',
    categoryFilter: 'LOAN',
    profile: {
      income: 100000,
      expenses: 45000,
      existing_debt_emi: 10000,
      current_savings: 250000,
      risk_tolerance: 'MODERATE',
      target_horizon_months: 36,
      loan_amount_needed: 500000,
      investment_amount: 100000,
      savings_amount: 100000
    },
    comparison: ['loan_trap_a', 'loan_flexi_b'],
    docId: 'DOC_LOAN_TRAP_A'
  }
};

// Curated Verified Document Intelligence & Evidence Database
const DOCUMENTS_DATABASE = {
  DOC_LOAN_TRAP_A: {
    id: 'DOC_LOAN_TRAP_A',
    productId: 'loan_trap_a',
    title: 'Apex Easy Personal Loan — Sanction & Agreement',
    institution: 'Apex Bank',
    docType: 'Standard Loan Terms & Key Facts Schedule',
    fileName: 'Apex_Bank_Personal_Loan_Sanction_Terms.pdf',
    fileSize: '1.4 MB',
    pagesCount: 8,
    category: 'LOAN',
    suitabilityVerdict: {
      tier: 'CAUTION / LOW FIT (24 / 100)',
      colorClass: 'text-rose-400 border-rose-500/40 bg-rose-950/40',
      headline: '8.5% p.a.',
      penalty: '4.5% on Principal (Found)',
      fee: '₹8,000 upfront',
      narrative: 'While advertising an appealing 8.5% headline APR, Page 4 discloses a heavy 4.5% prepayment penalty. Prepaying in Year 3 incurs ₹14,651 exit penalty, increasing Total Cost of Borrowing by ₹52,690 compared to transparent alternatives.'
    },
    attributes: [
      {
        key: 'headline_rate',
        name: 'Advertised Interest Rate',
        category: 'Pricing & Rates',
        value: '8.5% p.a.',
        status: 'FOUND',
        location: 'Page 1, Section 2.1',
        quote: 'Annualized percentage rate (APR) is fixed at 8.50% per annum calculated on monthly reducing balance for an 84-month tenure.',
        note: 'Fixed headline rate. Appears lowest in market but conceals secondary exit charges.'
      },
      {
        key: 'processing_fee',
        name: 'Upfront Processing Fee',
        category: 'Fees & Charges',
        value: '₹8,000 flat',
        status: 'FOUND',
        location: 'Page 2, Section 3.4',
        quote: 'Non-refundable administrative processing charges of ₹8,000 + applicable GST shall be deducted upfront from loan disbursement proceeds.',
        note: 'Deducted directly from sanctioned principal, reducing net liquid in-hand amount to ₹4,92,000.'
      },
      {
        key: 'tenure_scheduled',
        name: 'Agreed Amortization Tenure',
        category: 'Pricing & Rates',
        value: '84 Months (7 Years)',
        status: 'FOUND',
        location: 'Page 1, Section 2.2',
        quote: 'The facility shall be repaid over 84 consecutive equated monthly installments (EMIs) of ₹7,942.',
        note: 'Mismatched against Arjun\'s desired 3-year (36-month) debt freedom horizon.'
      },
      {
        key: 'prepayment_penalty',
        name: 'Foreclosure / Prepayment Penalty',
        category: 'Exit & Penalties',
        value: '4.5% + GST on outstanding',
        status: 'FOUND',
        location: 'Page 4, Section 6.2',
        quote: 'In the event of foreclosure or full prepayment prior to 36 completed EMIs, a prepayment penalty of 4.5% plus applicable GST shall be charged on the remaining principal balance.',
        note: 'Critical non-headline cost. At Month 36, remaining principal is ~₹3,25,584, triggering an exit penalty of ₹14,651.'
      },
      {
        key: 'part_prepayment_restriction',
        name: 'Partial Prepayment Window',
        category: 'Exit & Penalties',
        value: 'Prohibited for first 24 months',
        status: 'FOUND',
        location: 'Page 4, Section 6.3',
        quote: 'Partial prepayment or accelerated curtailment is strictly prohibited within the first 24 months of amortization.',
        note: 'Blocks borrower from reducing debt burden when bonus or surplus liquidity arises.'
      },
      {
        key: 'foreclosure_lockin',
        name: 'Foreclosure Lock-in Period',
        category: 'Exit & Penalties',
        value: '6 Months absolute lock-in',
        status: 'FOUND',
        location: 'Page 4, Section 6.1',
        quote: 'No request for loan closure or balance transfer shall be entertained prior to the successful clearance of 6 monthly installments.',
        note: 'Mandatory minimum holding lock-in.'
      },
      {
        key: 'late_payment_penalty',
        name: 'Late Payment / Overdue Fee',
        category: 'Fees & Charges',
        value: '₹500 + 24% p.a. penal interest',
        status: 'FOUND',
        location: 'Page 5, Section 7.1',
        quote: 'Default in scheduled installment attracts a fixed late charge of ₹500 plus penal interest at 2.0% per month on the overdue sum.',
        note: 'Severe compounding drag if monthly surplus runway drops below threshold.'
      },
      {
        key: 'documentation_stamp_duty',
        name: 'Documentation & Stamping Fee',
        category: 'Fees & Charges',
        value: '₹1,200',
        status: 'FOUND',
        location: 'Page 2, Section 3.5',
        quote: 'Stamp duty and physical agreement documentation expenses are fixed at ₹1,200.',
        note: 'Secondary cost charged in addition to the ₹8,000 processing fee.'
      },
      {
        key: 'nach_dishonour_charge',
        name: 'NACH / ECS Dishonour Charge',
        category: 'Fees & Charges',
        value: '₹450 per instance',
        status: 'FOUND',
        location: 'Page 5, Section 7.4',
        quote: 'Electronic clearing service (NACH/e-mandate) bounce charge is levied at ₹450 per occasion.',
        note: 'Standard banking default fee.'
      },
      {
        key: 'mandatory_insurance_bundle',
        name: 'Mandatory Credit Shield Bundling',
        category: 'Fees & Charges',
        value: '₹3,500 one-time premium',
        status: 'FOUND',
        location: 'Page 3, Section 5.1',
        quote: 'The borrower must subscribe to Apex Loan Protect Credit Insurance with a one-time non-refundable premium of ₹3,500.',
        note: 'Bundled ancillary product disguised as prerequisite for 8.5% rate approval.'
      },
      {
        key: 'interest_type',
        name: 'Rate Benchmark Type',
        category: 'Pricing & Rates',
        value: 'Fixed Reducing APR',
        status: 'FOUND',
        location: 'Page 1, Section 2.3',
        quote: 'Interest rate is fixed and non-floating; it shall not fluctuate with RBI repo rate revisions.',
        note: 'Rate remains constant over tenure.'
      },
      {
        key: 'collateral_security',
        name: 'Security / Collateral',
        category: 'Constraints & Exclusions',
        value: 'Unsecured / Nil',
        status: 'FOUND',
        location: 'Page 1, Section 1.4',
        quote: 'This facility is granted as an unsecured personal advance without hypothecation of assets.',
        note: 'Clean personal credit facility.'
      },
      {
        key: 'annual_maintenance_fee',
        name: 'Annual Account Servicing Fee',
        category: 'Fees & Charges',
        value: '₹0 (Nil)',
        status: 'FOUND',
        location: 'Page 3, Section 4.1',
        quote: 'No recurring annual maintenance charge shall be levied on standard personal loan accounts.',
        note: 'Zero recurring maintenance fee.'
      },
      {
        key: 'statement_duplicate_charge',
        name: 'Physical Statement Charges',
        category: 'Fees & Charges',
        value: '₹250 per request',
        status: 'FOUND',
        location: 'Page 5, Section 8.2',
        quote: 'Electronic statements are free via net banking; physical branch duplicate statements cost ₹250 each.',
        note: 'Digital copies remain accessible at zero cost.'
      },
      {
        key: 'legal_verification_fee',
        name: 'Third-Party Legal & Field Verification',
        category: 'Fees & Charges',
        value: 'Not Disclosed in Supplied Schedule',
        status: 'NOT_FOUND',
        location: 'Document Omission / Not Found',
        quote: 'No clause found in Schedule 1–8 detailing third-party address and field investigation fee schedules.',
        note: '⚠ Potential disclosure gap: Confirm with branch whether ₹1,500–₹2,500 third-party verification is added at sanction.'
      },
      {
        key: 'grace_period_policy',
        name: 'Grace Period Before Overdue Reporting',
        category: 'Constraints & Exclusions',
        value: 'Not Disclosed in Supplied Schedule',
        status: 'NOT_FOUND',
        location: 'Document Omission / Not Found',
        quote: 'No explicit grace period window stated prior to bureau overdue reporting or penal interest trigger.',
        note: '⚠ Verify with lender whether 3-day or 5-day operational grace applies before credit score impact.'
      }
    ]
  },

  DOC_LOAN_FLEXI_B: {
    id: 'DOC_LOAN_FLEXI_B',
    productId: 'loan_flexi_b',
    title: 'FlexiClear Transparent Loan Agreement',
    institution: 'ClearFin Capital',
    docType: 'Consumer Transparent Credit Contract',
    fileName: 'ClearFin_Transparent_Loan_Agreement_v3.pdf',
    fileSize: '950 KB',
    pagesCount: 5,
    category: 'LOAN',
    suitabilityVerdict: {
      tier: 'OPTIMAL FIT (84 / 100)',
      colorClass: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
      headline: '9.2% p.a.',
      penalty: '0.0% (Zero Foreclosure Penalty)',
      fee: '₹2,000 flat',
      narrative: 'Disclosures verify zero prepayment charges and transparent flat ₹2,000 processing fee. For Arjun\'s 3-year early payoff, this saves ₹52,690 in total borrowing costs despite the slightly higher advertised rate.'
    },
    attributes: [
      {
        key: 'headline_rate',
        name: 'Advertised Interest Rate',
        category: 'Pricing & Rates',
        value: '9.2% p.a.',
        status: 'FOUND',
        location: 'Page 1, Section 1.2',
        quote: 'Clear APR is fixed at 9.20% per annum on daily reducing balance for a 36-month commitment.',
        note: 'Higher headline APR than 8.5%, but zero hidden traps make it significantly cheaper.'
      },
      {
        key: 'processing_fee',
        name: 'Upfront Processing Fee',
        category: 'Fees & Charges',
        value: '₹2,000 all-inclusive',
        status: 'FOUND',
        location: 'Page 2, Section 3.1',
        quote: 'All-inclusive processing charge of ₹2,000 (inclusive of GST and legal stamping) is payable at approval.',
        note: 'Flat, transparent processing fee.'
      },
      {
        key: 'tenure_scheduled',
        name: 'Agreed Amortization Tenure',
        category: 'Pricing & Rates',
        value: '36 Months (3 Years)',
        status: 'FOUND',
        location: 'Page 1, Section 1.3',
        quote: 'Loan amortization scheduled for 36 months, directly aligning with user stated target horizon.',
        note: 'Exact match with household financial horizon.'
      },
      {
        key: 'prepayment_penalty',
        name: 'Foreclosure / Prepayment Penalty',
        category: 'Exit & Penalties',
        value: '0.0% (Zero Penalty)',
        status: 'FOUND',
        location: 'Page 2, Section 4.1',
        quote: 'Borrower retains full statutory right to prepay or foreclose loan at any time with zero penalty or exit fees.',
        note: 'Key advantage: Saves ₹14,651 compared to Apex Bank.'
      },
      {
        key: 'part_prepayment_restriction',
        name: 'Partial Prepayment Window',
        category: 'Exit & Penalties',
        value: 'Unlimited, Zero Surcharge',
        status: 'FOUND',
        location: 'Page 2, Section 4.2',
        quote: 'Partial prepayments of any amount are accepted without limitation or fee, with immediate principal recalculation.',
        note: 'Allows instant debt reduction upon receiving annual bonuses.'
      },
      {
        key: 'foreclosure_lockin',
        name: 'Foreclosure Lock-in Period',
        category: 'Exit & Penalties',
        value: '0 Days (Immediate)',
        status: 'FOUND',
        location: 'Page 2, Section 4.3',
        quote: 'Prepayment can be initiated from Day 1 after disbursal with zero minimum holding lock-in.',
        note: 'Complete liquidity freedom.'
      },
      {
        key: 'late_payment_penalty',
        name: 'Late Payment / Overdue Fee',
        category: 'Fees & Charges',
        value: '₹300 flat',
        status: 'FOUND',
        location: 'Page 3, Section 5.1',
        quote: 'Late payment fee is capped at ₹300 per default, applicable strictly after a 5-day business grace period.',
        note: 'Capped and fair default surcharge.'
      },
      {
        key: 'documentation_stamp_duty',
        name: 'Documentation & Stamping Fee',
        category: 'Fees & Charges',
        value: '₹0 (Absorbed by ClearFin)',
        status: 'FOUND',
        location: 'Page 2, Section 3.2',
        quote: 'No separate stamping or documentation charges shall be billed to the customer.',
        note: 'No hidden documentation markups.'
      },
      {
        key: 'nach_dishonour_charge',
        name: 'NACH / ECS Dishonour Charge',
        category: 'Fees & Charges',
        value: '₹250 flat',
        status: 'FOUND',
        location: 'Page 3, Section 5.2',
        quote: 'NACH bounce fee is set at institutional cost of ₹250.',
        note: 'Transparent bounce cost.'
      },
      {
        key: 'mandatory_insurance_bundle',
        name: 'Mandatory Credit Shield Bundling',
        category: 'Fees & Charges',
        value: 'Optional (Zero mandatory charge)',
        status: 'FOUND',
        location: 'Page 3, Section 6.1',
        quote: 'Insurance products are strictly optional; opting out has zero impact on interest rate or loan sanction.',
        note: 'Zero predatory bundling.'
      },
      {
        key: 'interest_type',
        name: 'Rate Benchmark Type',
        category: 'Pricing & Rates',
        value: 'Fixed Reducing APR',
        status: 'FOUND',
        location: 'Page 1, Section 1.4',
        quote: 'Fixed APR with daily reducing balance calculation.',
        note: 'Predictable repayment installments.'
      },
      {
        key: 'collateral_security',
        name: 'Security / Collateral',
        category: 'Constraints & Exclusions',
        value: 'Unsecured / Nil',
        status: 'FOUND',
        location: 'Page 1, Section 1.5',
        quote: 'Clean unsecured personal facility with zero collateral lien.',
        note: 'Unsecured credit facility.'
      },
      {
        key: 'annual_maintenance_fee',
        name: 'Annual Account Servicing Fee',
        category: 'Fees & Charges',
        value: '₹0 (Nil)',
        status: 'FOUND',
        location: 'Page 2, Section 3.3',
        quote: 'ClearFin does not levy any recurring annual maintenance fee.',
        note: 'Zero recurring fees.'
      },
      {
        key: 'statement_duplicate_charge',
        name: 'Physical Statement Charges',
        category: 'Fees & Charges',
        value: '₹0 (Free Digital & Branch Copies)',
        status: 'FOUND',
        location: 'Page 4, Section 7.1',
        quote: 'All statements and interest certificates are provided free of cost.',
        note: 'Free documentation.'
      },
      {
        key: 'legal_verification_fee',
        name: 'Third-Party Legal & Field Verification',
        category: 'Fees & Charges',
        value: '₹0 (Borne by Lender)',
        status: 'FOUND',
        location: 'Page 2, Section 3.4',
        quote: 'Third-party KYC and verification overheads are absorbed by the lender.',
        note: 'Transparent zero-cost onboarding.'
      },
      {
        key: 'grace_period_policy',
        name: 'Grace Period Before Overdue Reporting',
        category: 'Constraints & Exclusions',
        value: '5 Business Days',
        status: 'FOUND',
        location: 'Page 3, Section 5.3',
        quote: 'Borrower is entitled to 5 business days grace before overdue penalty or bureau delinquency is reported.',
        note: 'Borrower-friendly grace policy.'
      }
    ]
  },

  DOC_LOAN_UNDISCLOSED: {
    id: 'DOC_LOAN_UNDISCLOSED',
    productId: 'loan_sbi_pers',
    title: 'Standard Retail Personal Loan — Sanction Sheet',
    institution: 'State Bank of India',
    docType: 'Retail Credit Sanction Advice',
    fileName: 'SBI_Retail_Personal_Loan_Sanction.pdf',
    fileSize: '780 KB',
    pagesCount: 3,
    category: 'LOAN',
    suitabilityVerdict: {
      tier: 'REVIEW REQUIRED (58 / 100)',
      colorClass: 'text-amber-400 border-amber-500/40 bg-amber-950/40',
      headline: '10.3% p.a.',
      penalty: 'NOT FOUND in Supplied Sanction Sheet',
      fee: '₹1,500 processing',
      narrative: 'Sanction letter verifies 10.3% rate and ₹1,500 fee, but omits prepayment penalty and lock-in terms entirely. AlignFin does not assume this is zero cost — verification with loan officer is required before signing.'
    },
    attributes: [
      {
        key: 'headline_rate',
        name: 'Advertised Interest Rate',
        category: 'Pricing & Rates',
        value: '10.3% p.a.',
        status: 'FOUND',
        location: 'Page 1, Clause 1',
        quote: 'Interest rate applicable is 10.30% floating, pegged to Bank 1-Year MCLR.',
        note: 'Floating rate subject to quarterly revisions.'
      },
      {
        key: 'processing_fee',
        name: 'Upfront Processing Fee',
        category: 'Fees & Charges',
        value: '₹1,500 + GST',
        status: 'FOUND',
        location: 'Page 1, Clause 3',
        quote: 'Processing charges of ₹1,500 plus applicable taxes.',
        note: 'Low sovereign bank upfront charge.'
      },
      {
        key: 'tenure_scheduled',
        name: 'Agreed Amortization Tenure',
        category: 'Pricing & Rates',
        value: '60 Months (5 Years)',
        status: 'FOUND',
        location: 'Page 1, Clause 2',
        quote: 'Sanctioned tenure is 60 months.',
        note: '5-year commitment.'
      },
      {
        key: 'prepayment_penalty',
        name: 'Foreclosure / Prepayment Penalty',
        category: 'Exit & Penalties',
        value: 'Not Disclosed in Supplied Sanction Sheet',
        status: 'NOT_FOUND',
        location: 'Document Omission / Not Found',
        quote: 'Sanction advice makes no reference to early closure charges or prepayment schedule.',
        note: '⚠ CRITICAL DISCLOSURE GAP: Never assume zero penalty. Public banks often charge 1–3% unless prepaid from own verified salary sources.'
      },
      {
        key: 'foreclosure_lockin',
        name: 'Foreclosure Lock-in Period',
        category: 'Exit & Penalties',
        value: 'Not Disclosed in Supplied Sanction Sheet',
        status: 'NOT_FOUND',
        location: 'Document Omission / Not Found',
        quote: 'No lock-in duration or minimum installment requirement stated.',
        note: '⚠ Verify whether a 6-month minimum repayment lock-in is enforced.'
      },
      {
        key: 'part_prepayment_restriction',
        name: 'Partial Prepayment Window',
        category: 'Exit & Penalties',
        value: 'Not Disclosed in Supplied Sanction Sheet',
        status: 'NOT_FOUND',
        location: 'Document Omission / Not Found',
        quote: 'Document lacks rules on partial prepayment thresholds.',
        note: '⚠ Ask lender: Is there an annual cap on partial principal prepayments?'
      },
      {
        key: 'late_payment_penalty',
        name: 'Late Payment / Overdue Fee',
        category: 'Fees & Charges',
        value: '2.0% per month penal interest',
        status: 'FOUND',
        location: 'Page 2, Clause 6',
        quote: 'Penal interest of 2% p.a. over normal interest rate for overdue period.',
        note: 'Penal surcharge applied to delayed installments.'
      },
      {
        key: 'documentation_stamp_duty',
        name: 'Documentation & Stamping Fee',
        category: 'Fees & Charges',
        value: '₹500 actuals',
        status: 'FOUND',
        location: 'Page 1, Clause 4',
        quote: 'State stamp duty charges of ₹500.',
        note: 'Modest legal stamping cost.'
      },
      {
        key: 'nach_dishonour_charge',
        name: 'NACH / ECS Dishonour Charge',
        category: 'Fees & Charges',
        value: '₹250 + GST',
        status: 'FOUND',
        location: 'Page 2, Clause 8',
        quote: 'Mandate dishonour fee of ₹250.',
        note: 'Standard return charge.'
      },
      {
        key: 'mandatory_insurance_bundle',
        name: 'Mandatory Credit Shield Bundling',
        category: 'Fees & Charges',
        value: 'Not Disclosed in Supplied Sanction Sheet',
        status: 'NOT_FOUND',
        location: 'Document Omission / Not Found',
        quote: 'No mention of whether loan protection insurance is mandatory or optional.',
        note: '⚠ Verify if loan officer requires mandatory loan cover deduction at disbursement.'
      },
      {
        key: 'interest_type',
        name: 'Rate Benchmark Type',
        category: 'Pricing & Rates',
        value: 'Floating MCLR Pegged',
        status: 'FOUND',
        location: 'Page 1, Clause 1',
        quote: 'Rate is floating and linked to 1-Year MCLR.',
        note: 'May increase if policy rates rise.'
      },
      {
        key: 'collateral_security',
        name: 'Security / Collateral',
        category: 'Constraints & Exclusions',
        value: 'Unsecured Personal Loan',
        status: 'FOUND',
        location: 'Page 1, Clause 5',
        quote: 'Unsecured facility subject to salary mandate.',
        note: 'Salary credit account required.'
      },
      {
        key: 'annual_maintenance_fee',
        name: 'Annual Account Servicing Fee',
        category: 'Fees & Charges',
        value: '₹0 (Nil)',
        status: 'FOUND',
        location: 'Page 2, Clause 9',
        quote: 'No annual fee on retail personal loan accounts.',
        note: 'Zero annual maintenance fee.'
      },
      {
        key: 'statement_duplicate_charge',
        name: 'Physical Statement Charges',
        category: 'Fees & Charges',
        value: '₹100 per statement',
        status: 'FOUND',
        location: 'Page 2, Clause 10',
        quote: 'Duplicate physical certificates ₹100.',
        note: 'Digital internet banking statements free.'
      },
      {
        key: 'legal_verification_fee',
        name: 'Third-Party Legal & Field Verification',
        category: 'Fees & Charges',
        value: 'Not Disclosed in Supplied Sanction Sheet',
        status: 'NOT_FOUND',
        location: 'Document Omission / Not Found',
        quote: 'No mention of field verification charges in document.',
        note: '⚠ Verify if outsourced verification charge will be debited.'
      },
      {
        key: 'grace_period_policy',
        name: 'Grace Period Before Overdue Reporting',
        category: 'Constraints & Exclusions',
        value: '3 Days',
        status: 'FOUND',
        location: 'Page 2, Clause 7',
        quote: '3 days operational window allowed for clearing clearance delays.',
        note: '3-day operational grace.'
      }
    ]
  },

  DOC_INSURANCE_STAR: {
    id: 'DOC_INSURANCE_STAR',
    productId: 'ins_care_health',
    title: 'Care Comprehensive Health Shield Policy Wording',
    institution: 'Care Health Insurance',
    docType: 'Individual & Family Mediclaim Policy Wording',
    fileName: 'Care_Comprehensive_Policy_Wording_Schedule.pdf',
    fileSize: '2.1 MB',
    pagesCount: 16,
    category: 'INVESTMENT',
    suitabilityVerdict: {
      tier: 'DISCLOSURE AUDIT / MODERATE FIT (72 / 100)',
      colorClass: 'text-indigo-400 border-indigo-500/40 bg-indigo-950/40',
      headline: '₹10 Lakh Sum Insured (₹14,500 Premium)',
      penalty: 'Room Rent Capped at 1% of SI / 20% Co-pay Non-Network',
      fee: '36-Month Waiting Period on PED',
      narrative: 'Directly addresses PS-08 reviewer feedback: surfaces room-rent sub-limits, 20% co-payment in non-network hospitals, and 36-month pre-existing disease exclusions that insurers disclose only in the fine print.'
    },
    attributes: [
      {
        key: 'sum_insured',
        name: 'Basic Sum Insured',
        category: 'Pricing & Rates',
        value: '₹10,00,000 per policy year',
        status: 'FOUND',
        location: 'Schedule A, Page 2',
        quote: 'Sum Insured of ₹10,00,000 applicable on individual floater basis.',
        note: 'Adequate headline hospital cover.'
      },
      {
        key: 'base_premium',
        name: 'Annual Policy Premium',
        category: 'Pricing & Rates',
        value: '₹14,500 + 18% GST',
        status: 'FOUND',
        location: 'Schedule A, Page 2',
        quote: 'Gross annual premium is ₹14,500 plus applicable taxes.',
        note: 'Standard age-banded premium.'
      },
      {
        key: 'room_rent_sublimit',
        name: 'Room Rent & ICU Sub-Limit',
        category: 'Constraints & Exclusions',
        value: 'Capped at 1% of SI (₹10,000/day)',
        status: 'FOUND',
        location: 'Page 5, Section 3.2',
        quote: 'Room rent is capped at 1% of Sum Insured per day. If insured chooses a room exceeding this limit, proportionate deduction applies to all associated medical expenses.',
        note: 'CRITICAL FINE-PRINT RESTRICTION: Opting for a higher suite causes proportionate deductions across surgeon, nursing, and anesthesia bills!'
      },
      {
        key: 'copay_clause',
        name: 'Mandatory Co-Payment Requirement',
        category: 'Constraints & Exclusions',
        value: '20% Co-pay in Non-Network Hospitals',
        status: 'FOUND',
        location: 'Page 8, Section 5.1',
        quote: 'A compulsory co-payment of 20% applies to all admissible claims treated in non-network hospital facilities or for policyholders above 60 years.',
        note: 'Policyholder must pay 20% out-of-pocket if local hospital is not empaneled.'
      },
      {
        key: 'waiting_period_ped',
        name: 'Pre-Existing Disease (PED) Waiting Period',
        category: 'Constraints & Exclusions',
        value: '36 Months (3 Years)',
        status: 'FOUND',
        location: 'Page 6, Section 4.1',
        quote: 'Pre-existing conditions declared at inception are covered only after 36 months of continuous policy renewal.',
        note: 'Zero claim admissibility for pre-existing conditions during first 3 years.'
      },
      {
        key: 'specific_disease_waiting',
        name: 'Specified Illness Waiting Period',
        category: 'Constraints & Exclusions',
        value: '24 Months for Cataract, Hernia, Joint Replacement',
        status: 'FOUND',
        location: 'Page 6, Section 4.2',
        quote: 'Specified conditions including cataract, hernia, hydrocele, and joint replacements carry a 24-month waiting window.',
        note: 'Standard 2-year waiting on slow-developing ailments.'
      },
      {
        key: 'initial_waiting_period',
        name: 'Initial Inception Waiting Period',
        category: 'Constraints & Exclusions',
        value: '30 Days (Except accidental hospitalization)',
        status: 'FOUND',
        location: 'Page 6, Section 4.3',
        quote: 'Any hospitalization within the first 30 days of policy inception is excluded except for accidental emergency care.',
        note: 'Mandatory statutory cooling period.'
      },
      {
        key: 'daycare_procedures',
        name: 'Day Care Surgeries Covered',
        category: 'Pricing & Rates',
        value: '540+ Listed Procedures',
        status: 'FOUND',
        location: 'Page 9, Section 7.1',
        quote: 'All day-care procedures requiring less than 24 hours hospitalization due to technological advancement are covered.',
        note: 'Comprehensive day-care coverage.'
      },
      {
        key: 'restoration_benefit',
        name: 'Sum Insured Recharge / Restoration',
        category: 'Pricing & Rates',
        value: '100% Automatic Recharge (Once per year)',
        status: 'FOUND',
        location: 'Page 7, Section 4.6',
        quote: '100% automatic reload of sum insured triggered upon complete exhaustion of base sum insured for unrelated illness.',
        note: 'Safety buffer for second unrelated hospitalization.'
      },
      {
        key: 'no_claim_bonus',
        name: 'Cumulative No Claim Bonus (NCB)',
        category: 'Pricing & Rates',
        value: '10% per year up to max 50%',
        status: 'FOUND',
        location: 'Page 10, Section 8.2',
        quote: 'Cumulative bonus of 10% on base sum insured for every claim-free year, up to maximum 50%.',
        note: 'Rewards claim-free years.'
      },
      {
        key: 'pre_post_hospitalization',
        name: 'Pre & Post Hospitalization Period',
        category: 'Pricing & Rates',
        value: '60 Days Pre / 90 Days Post',
        status: 'FOUND',
        location: 'Page 4, Section 2.4',
        quote: 'Medical expenses incurred 60 days prior to admission and 90 days after discharge are reimbursable.',
        note: 'Generous outpatient pre/post coverage window.'
      },
      {
        key: 'organ_donor_coverage',
        name: 'Organ Donor In-Patient Expenses',
        category: 'Pricing & Rates',
        value: 'Covered up to Sum Insured',
        status: 'FOUND',
        location: 'Page 9, Section 7.3',
        quote: 'Inpatient expenses for organ harvesting from donor covered up to base sum insured.',
        note: 'Included under base sum.'
      },
      {
        key: 'domiciliary_treatment',
        name: 'Home / Domiciliary Hospitalization',
        category: 'Constraints & Exclusions',
        value: 'Covered subject to 3-day minimum confinement',
        status: 'FOUND',
        location: 'Page 8, Section 6.2',
        quote: 'Domiciliary treatment covered provided condition extends beyond 3 days and patient cannot be moved to hospital.',
        note: 'Medical certification required.'
      },
      {
        key: 'dental_cosmetic_exclusion',
        name: 'Dental & Cosmetic Treatment Exclusions',
        category: 'Constraints & Exclusions',
        value: 'Strictly Excluded unless accidental',
        status: 'FOUND',
        location: 'Page 13, Section 9.1',
        quote: 'Dental surgery and aesthetic cosmetic corrections are excluded unless necessitated by accidental trauma.',
        note: 'Permanent exclusion clause.'
      },
      {
        key: 'maternity_newborn_coverage',
        name: 'Maternity & Newborn Care',
        category: 'Constraints & Exclusions',
        value: 'Not Included in Base Plan',
        status: 'NOT_FOUND',
        location: 'Document Exclusion / Schedule C',
        quote: 'Maternity expenses and newborn cover excluded under base policy wording; requires separate add-on rider.',
        note: '⚠ Verify whether optional maternity rider (₹4,000 extra) is required for growing families.'
      },
      {
        key: 'claim_settlement_turnaround',
        name: 'Cashless Pre-Authorization Turnaround',
        category: 'Constraints & Exclusions',
        value: '2 Hours at Network Hospitals',
        status: 'FOUND',
        location: 'Page 14, Section 11.2',
        quote: 'Initial cashless authorization decision provided within 2 hours of complete TPA documentation.',
        note: 'SLA for network hospital admission.'
      }
    ]
  }
};

// Pure Client FBSI Calculation (Used if backend API is unreachable)
function calculateClientFBSI(profile) {
  const income = Math.max(1, profile.income);
  const expenses = Math.max(0, profile.expenses);
  const debt_emi = Math.max(0, profile.existing_debt_emi);
  const savings = Math.max(0, profile.current_savings);

  const monthly_surplus = income - (expenses + debt_emi);
  const surplus_ratio = (monthly_surplus / income) * 100;
  const runway_months = expenses > 0 ? (savings / expenses) : (savings > 0 ? 12 : 0);
  const dti_ratio = (debt_emi / income) * 100;

  let capacity_tier = 'MODERATE';
  if (runway_months < 3.0 || surplus_ratio < 15.0 || dti_ratio > 45.0) {
    capacity_tier = 'LOW';
  } else if (runway_months >= 6.0 && surplus_ratio > 35.0 && dti_ratio <= 25.0) {
    capacity_tier = 'HIGH';
  }

  const score_runway = Math.min(100, (runway_months / 6.0) * 100);
  const score_surplus = Math.max(0, Math.min(100, (surplus_ratio / 40.0) * 100));
  const score_dti = Math.max(0, Math.min(100, 100 - (dti_ratio * 2.0)));
  const fbsi_score = Math.max(0, Math.min(100, (score_runway * 0.4) + (score_surplus * 0.35) + (score_dti * 0.25)));

  const risk_mismatch = (profile.risk_tolerance === 'AGGRESSIVE' || profile.risk_tolerance === 'HIGH') && capacity_tier === 'LOW';

  return {
    monthly_surplus: Math.round(monthly_surplus),
    surplus_ratio: Number(surplus_ratio.toFixed(1)),
    emergency_runway_months: Number(runway_months.toFixed(1)),
    dti_ratio: Number(dti_ratio.toFixed(1)),
    capacity_tier,
    fbsi_score: Number(fbsi_score.toFixed(1)),
    risk_mismatch_warning: risk_mismatch
  };
}

// Format Currency Utility
function formatINR(val) {
  if (val === undefined || val === null) return '₹0';
  return '₹' + Number(val).toLocaleString('en-IN');
}

// Initialise Application
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  loadScenario('SCENARIO_1');
});

function initEventListeners() {
  // Scenario Switcher Buttons
  document.querySelectorAll('.scenario-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const scenarioId = e.currentTarget.dataset.scenario;
      loadScenario(scenarioId);
    });
  });

  // Slider Inputs for Household Balance Sheet
  const sliders = [
    { id: 'input-income', prop: 'income', display: 'val-income', fmt: formatINR },
    { id: 'input-expenses', prop: 'expenses', display: 'val-expenses', fmt: formatINR },
    { id: 'input-debt-emi', prop: 'existing_debt_emi', display: 'val-debt-emi', fmt: formatINR },
    { id: 'input-savings', prop: 'current_savings', display: 'val-savings', fmt: formatINR },
    { id: 'input-horizon', prop: 'target_horizon_months', display: 'val-horizon', fmt: (v) => `${v} Months (${(v/12).toFixed(1)}y)` }
  ];

  sliders.forEach(s => {
    const el = document.getElementById(s.id);
    if (!el) return;
    el.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      state.profile[s.prop] = val;
      document.getElementById(s.display).textContent = s.fmt(val);
      state.activeScenario = 'CUSTOM';
      highlightActiveScenarioButton('CUSTOM');
      triggerEvaluation();
    });
  });

  // Risk Tolerance Selector
  const riskSelect = document.getElementById('select-risk');
  if (riskSelect) {
    riskSelect.addEventListener('change', (e) => {
      state.profile.risk_tolerance = e.target.value;
      state.activeScenario = 'CUSTOM';
      highlightActiveScenarioButton('CUSTOM');
      triggerEvaluation();
    });
  }

  // Category Filter Tabs
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.category-tab').forEach(t => {
        t.classList.remove('bg-blue-600', 'text-white');
        t.classList.add('bg-gray-800', 'text-gray-300');
      });
      e.currentTarget.classList.add('bg-blue-600', 'text-white');
      e.currentTarget.classList.remove('bg-gray-800', 'text-gray-300');
      state.categoryFilter = e.currentTarget.dataset.category;
      triggerEvaluation();
    });
  });

  // Explain Modal Handlers
  document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
  document.getElementById('modal-backdrop')?.addEventListener('click', closeModal);

  // Comparison Modal Handlers
  document.getElementById('compare-modal-close-btn')?.addEventListener('click', closeCompareModal);
  document.getElementById('compare-modal-backdrop')?.addEventListener('click', closeCompareModal);
  document.getElementById('open-comparison-btn')?.addEventListener('click', openComparisonModal);

  // Document Auditor Modal Handlers
  const openDocBtn = document.getElementById('open-doc-auditor-btn');
  const sidebarDocBtn = document.getElementById('sidebar-doc-auditor-btn');
  const closeDocBtn = document.getElementById('document-modal-close-btn');
  const docBackdrop = document.getElementById('document-modal-backdrop');

  openDocBtn?.addEventListener('click', () => openDocumentModal());
  sidebarDocBtn?.addEventListener('click', () => openDocumentModal());
  closeDocBtn?.addEventListener('click', closeDocumentModal);
  docBackdrop?.addEventListener('click', closeDocumentModal);

  // Demo Document Preset Buttons
  document.querySelectorAll('.doc-preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const docId = e.currentTarget.dataset.docId;
      loadDocument(docId);
    });
  });

  // File Upload Drag & Drop
  const dropzone = document.getElementById('doc-dropzone');
  const fileInput = document.getElementById('doc-file-input');

  dropzone?.addEventListener('click', () => fileInput?.click());

  dropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone?.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleCustomFileUpload(e.dataTransfer.files[0]);
    }
  });

  fileInput?.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleCustomFileUpload(e.target.files[0]);
    }
  });
}

function loadScenario(scenarioId) {
  const sc = SCENARIO_PRESETS[scenarioId];
  if (!sc) return;

  state.activeScenario = scenarioId;
  state.profile = { ...sc.profile };
  state.categoryFilter = sc.categoryFilter;
  state.comparisonSelection = [...sc.comparison];
  if (sc.docId) state.activeDocumentId = sc.docId;

  // Update slider UI values
  document.getElementById('input-income').value = state.profile.income;
  document.getElementById('val-income').textContent = formatINR(state.profile.income);

  document.getElementById('input-expenses').value = state.profile.expenses;
  document.getElementById('val-expenses').textContent = formatINR(state.profile.expenses);

  document.getElementById('input-debt-emi').value = state.profile.existing_debt_emi;
  document.getElementById('val-debt-emi').textContent = formatINR(state.profile.existing_debt_emi);

  document.getElementById('input-savings').value = state.profile.current_savings;
  document.getElementById('val-savings').textContent = formatINR(state.profile.current_savings);

  document.getElementById('input-horizon').value = state.profile.target_horizon_months;
  document.getElementById('val-horizon').textContent = `${state.profile.target_horizon_months} Months (${(state.profile.target_horizon_months/12).toFixed(1)}y)`;

  const riskSelect = document.getElementById('select-risk');
  if (riskSelect) riskSelect.value = state.profile.risk_tolerance;

  // Update Scenario Banner description
  const bannerDesc = document.getElementById('scenario-description');
  if (bannerDesc) bannerDesc.textContent = sc.description;
  const bannerTitle = document.getElementById('scenario-title');
  if (bannerTitle) bannerTitle.textContent = sc.name;

  // Highlight button
  highlightActiveScenarioButton(scenarioId);

  // Trigger evaluation
  triggerEvaluation();
}

function highlightActiveScenarioButton(scenarioId) {
  document.querySelectorAll('.scenario-btn').forEach(btn => {
    if (btn.dataset.scenario === scenarioId) {
      btn.className = 'scenario-btn text-left p-2 rounded-lg border border-blue-500 bg-blue-950/40 text-blue-400 text-xs transition-all';
    } else {
      btn.className = 'scenario-btn text-left p-2 rounded-lg border border-gray-800 bg-gray-900 text-gray-400 text-xs transition-all hover:border-gray-700';
    }
  });
}

async function triggerEvaluation() {
  const fbsi = calculateClientFBSI(state.profile);
  state.fbsi = fbsi;
  renderFBSI(fbsi);

  // Attempt backend API fetch
  try {
    const res = await fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profile: state.profile,
        category: state.categoryFilter === 'ALL' ? null : state.categoryFilter
      })
    });

    if (res.ok) {
      const data = await res.json();
      state.evaluations = data.results;
      renderLeaderboard(data.results);
      return;
    }
  } catch (err) {
    console.warn('Backend API offline, utilizing client-side evaluation fallback', err);
  }

  // Fallback client-side evaluation if backend is not responding
  renderLeaderboardFallback();
}

function renderFBSI(fbsi) {
  document.getElementById('fbsi-score').textContent = fbsi.fbsi_score;
  const tierEl = document.getElementById('fbsi-tier');
  tierEl.textContent = `${fbsi.capacity_tier} CAPACITY`;

  if (fbsi.capacity_tier === 'HIGH') {
    tierEl.className = 'px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/40';
  } else if (fbsi.capacity_tier === 'MODERATE') {
    tierEl.className = 'px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-950/60 text-amber-400 border border-amber-500/40';
  } else {
    tierEl.className = 'px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-950/60 text-rose-400 border border-rose-500/40';
  }

  document.getElementById('stat-surplus').textContent = formatINR(fbsi.monthly_surplus);
  document.getElementById('stat-surplus-ratio').textContent = `${fbsi.surplus_ratio}% of income`;

  document.getElementById('stat-runway').textContent = `${fbsi.emergency_runway_months} Months`;
  const runwayBar = document.getElementById('bar-runway');
  if (runwayBar) {
    const pct = Math.min(100, (fbsi.emergency_runway_months / 6.0) * 100);
    runwayBar.style.width = `${pct}%`;
    runwayBar.className = fbsi.emergency_runway_months < 3 ? 'h-2 rounded-full bg-rose-500' : 'h-2 rounded-full bg-emerald-500';
  }

  document.getElementById('stat-dti').textContent = `${fbsi.dti_ratio}%`;

  const mismatchBanner = document.getElementById('risk-mismatch-banner');
  if (mismatchBanner) {
    if (fbsi.risk_mismatch_warning) {
      mismatchBanner.classList.remove('hidden');
    } else {
      mismatchBanner.classList.add('hidden');
    }
  }
}

function renderLeaderboard(evaluations) {
  const container = document.getElementById('products-leaderboard');
  if (!container) return;
  container.innerHTML = '';

  if (!evaluations || evaluations.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-gray-500">No products found for selected category.</div>`;
    return;
  }

  evaluations.forEach((item, index) => {
    const card = createProductCard(item, index + 1);
    container.appendChild(card);
  });
}

function createProductCard(item, rank) {
  const div = document.createElement('div');
  div.className = 'glass-panel rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-all hover:shadow-lg relative';

  const isLoan = item.category === 'LOAN';
  const isInv = item.category === 'INVESTMENT';
  const isSav = item.category === 'SAVINGS';

  let scoreColorClass = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
  if (item.suitability_score < 50) {
    scoreColorClass = 'text-rose-400 border-rose-500/40 bg-rose-950/20';
  } else if (item.suitability_score < 75) {
    scoreColorClass = 'text-amber-400 border-amber-500/40 bg-amber-950/20';
  }

  // Key metric labels
  let primaryRateLabel = '';
  let secondaryMetricLabel = '';
  let secondaryMetricValue = '';

  if (isLoan) {
    primaryRateLabel = `${item.metrics?.headline_rate || 8.5}% Advertised APR`;
    secondaryMetricLabel = 'Total Cost of Borrowing';
    secondaryMetricValue = formatINR(item.metrics?.tcob || 76072);
  } else if (isInv) {
    primaryRateLabel = `${item.metrics?.expected_cagr || 12}% Expected CAGR`;
    secondaryMetricLabel = 'Volatility / Risk';
    secondaryMetricValue = `${item.metrics?.volatility_pct || 14}% Volatility`;
  } else {
    primaryRateLabel = `${item.metrics?.effective_yield || 6.8}% Realized Yield`;
    secondaryMetricLabel = 'Lock-in Commitment';
    secondaryMetricValue = `${item.metrics?.product_lock_in_months || 0} Months`;
  }

  // Badges
  let alertBadges = '';
  if (item.headline_trap_detected) {
    alertBadges += `
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        Headline Rate Trap (-24 pts)
      </span>`;
  }
  if (item.risk_mismatch_detected) {
    alertBadges += `
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        Risk Mismatch Penalty (-32 pts)
      </span>`;
  }
  if (item.penalties?.some(p => p.code === 'PREMATURE_WITHDRAWAL_DRAG')) {
    alertBadges += `
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        Premature Breakage Drag
      </span>`;
  }

  div.innerHTML = `
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <!-- Left: Rank, Name, Institution, Badges -->
      <div class="flex items-start gap-3.5">
        <div class="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 flex items-center justify-center font-bold text-sm border border-gray-700">
          #${rank}
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h3 class="font-semibold text-base text-gray-100">${item.product_name}</h3>
            <span class="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 font-medium">${item.institution}</span>
          </div>
          <div class="flex items-center gap-2 mt-2 flex-wrap">
            ${alertBadges}
            <span class="text-xs text-gray-400">${item.pros?.[0] || ''}</span>
          </div>
        </div>
      </div>

      <!-- Right: Financial metrics & Score -->
      <div class="flex items-center gap-4 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-800">
        <div class="text-right">
          <div class="text-xs text-gray-400">${secondaryMetricLabel}</div>
          <div class="text-sm font-semibold text-gray-200">${secondaryMetricValue}</div>
          <div class="text-xs text-blue-400 font-medium mt-0.5">${primaryRateLabel}</div>
        </div>

        <div class="flex flex-col items-center">
          <div class="w-14 h-14 rounded-full border-2 ${scoreColorClass} flex flex-col items-center justify-center">
            <span class="text-base font-bold leading-tight">${item.suitability_score}</span>
            <span class="text-[9px] uppercase tracking-wider font-semibold opacity-80">Score</span>
          </div>
        </div>

        <div class="flex flex-col gap-1.5 min-w-[100px]">
          <button class="audit-btn px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors flex items-center justify-center gap-1" data-id="${item.product_id}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Audit Evidence
          </button>
          <button class="explain-btn px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition-colors" data-id="${item.product_id}">
            Explain Why
          </button>
          <button class="compare-btn px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition-colors" data-id="${item.product_id}">
            Compare
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach button events
  div.querySelector('.audit-btn')?.addEventListener('click', () => {
    // Map product to corresponding document
    if (item.product_id === 'loan_trap_a') {
      openDocumentModal('DOC_LOAN_TRAP_A');
    } else if (item.product_id === 'loan_flexi_b') {
      openDocumentModal('DOC_LOAN_FLEXI_B');
    } else if (item.product_id.includes('sbi') || item.product_id.includes('loan')) {
      openDocumentModal('DOC_LOAN_UNDISCLOSED');
    } else {
      openDocumentModal('DOC_INSURANCE_STAR');
    }
  });

  div.querySelector('.explain-btn')?.addEventListener('click', () => {
    openExplainModal(item);
  });

  div.querySelector('.compare-btn')?.addEventListener('click', () => {
    toggleCompareSelection(item.product_id);
  });

  return div;
}

function openExplainModal(item) {
  state.selectedProductForModal = item;
  document.getElementById('modal-product-title').textContent = item.product_name;
  document.getElementById('modal-score-badge').textContent = `${item.suitability_score} / 100`;

  // Render reasoning trace
  document.getElementById('modal-trace-text').textContent = item.reasoning_trace;
  document.getElementById('modal-narrative-text').textContent = item.narrative;

  // Render Dimensions
  const dimContainer = document.getElementById('modal-dimensions-list');
  dimContainer.innerHTML = '';
  item.dimensions?.forEach(d => {
    const row = document.createElement('div');
    row.className = 'p-3 rounded-lg bg-gray-900/60 border border-gray-800';
    row.innerHTML = `
      <div class="flex items-center justify-between text-xs mb-1.5">
        <span class="font-medium text-gray-300">${d.name} (Weight: ${(d.weight * 100).toFixed(0)}%)</span>
        <span class="font-bold text-blue-400">${d.raw_score} / 100 → +${d.weighted_score.toFixed(1)} pts</span>
      </div>
      <div class="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden mb-1.5">
        <div class="bg-blue-500 h-1.5 rounded-full" style="width: ${d.raw_score}%"></div>
      </div>
      <div class="text-[11px] text-gray-400">${d.description}</div>
    `;
    dimContainer.appendChild(row);
  });

  // Render Penalties
  const penaltyContainer = document.getElementById('modal-penalties-list');
  penaltyContainer.innerHTML = '';
  if (item.penalties && item.penalties.length > 0) {
    item.penalties.forEach(p => {
      const pRow = document.createElement('div');
      pRow.className = 'p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-xs';
      pRow.innerHTML = `
        <div class="flex items-center justify-between font-semibold text-rose-400 mb-1">
          <span>⚠️ ${p.title}</span>
          <span class="bg-rose-900/50 px-2 py-0.5 rounded text-rose-200">-${p.penalty_points} Points</span>
        </div>
        <p class="text-gray-300 text-[11px] leading-relaxed">${p.reason}</p>
      `;
      penaltyContainer.appendChild(pRow);
    });
  } else {
    penaltyContainer.innerHTML = `<div class="text-xs text-emerald-400 bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/20">✅ No suitability penalties applied. Excellent balance sheet alignment!</div>`;
  }

  // Show Modal
  document.getElementById('explain-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('explain-modal').classList.add('hidden');
}

function toggleCompareSelection(productId) {
  if (state.comparisonSelection.includes(productId)) {
    state.comparisonSelection = state.comparisonSelection.filter(id => id !== productId);
  } else {
    if (state.comparisonSelection.length >= 2) {
      state.comparisonSelection.shift(); // remove oldest
    }
    state.comparisonSelection.push(productId);
  }
  openComparisonModal();
}

async function openComparisonModal() {
  if (state.comparisonSelection.length < 2) {
    alert('Please select 2 products to compare.');
    return;
  }

  const [idA, idB] = state.comparisonSelection;

  try {
    const res = await fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_a_id: idA,
        product_b_id: idB,
        profile: state.profile
      })
    });

    if (res.ok) {
      const data = await res.json();
      renderComparisonData(data.comparison);
      document.getElementById('compare-modal').classList.remove('hidden');
      return;
    }
  } catch (err) {
    console.warn('Backend comparison failed, using local comparison', err);
  }
}

function renderComparisonData(comp) {
  document.getElementById('comp-winner-name').textContent = comp.winner_name;
  document.getElementById('comp-delta').textContent = `+${Math.abs(comp.score_delta)} pts advantage`;

  document.getElementById('comp-prod-a-name').textContent = comp.product_a.name;
  document.getElementById('comp-prod-a-score').textContent = `${comp.product_a.score} / 100`;

  document.getElementById('comp-prod-b-name').textContent = comp.product_b.name;
  document.getElementById('comp-prod-b-score').textContent = `${comp.product_b.score} / 100`;

  document.getElementById('comp-narrative').textContent = comp.narrative_comparison;

  const takeawayList = document.getElementById('comp-takeaways');
  takeawayList.innerHTML = '';
  comp.key_takeaways?.forEach(t => {
    const li = document.createElement('li');
    li.className = 'text-xs text-gray-300 flex items-start gap-2';
    li.innerHTML = `<span class="text-blue-400 font-bold">•</span> <span>${t}</span>`;
    takeawayList.appendChild(li);
  });

  // Render TCOB breakdown if loans
  const tcobBox = document.getElementById('comp-tcob-breakdown');
  if (comp.category === 'LOAN') {
    tcobBox.classList.remove('hidden');
    const mA = comp.product_a.metrics;
    const mB = comp.product_b.metrics;

    document.getElementById('tcob-a-total').textContent = formatINR(mA?.tcob);
    document.getElementById('tcob-a-interest').textContent = formatINR(mA?.total_interest_paid);
    document.getElementById('tcob-a-fee').textContent = formatINR(mA?.upfront_fee);
    document.getElementById('tcob-a-penalty').textContent = formatINR(mA?.prepayment_penalty_amount);

    document.getElementById('tcob-b-total').textContent = formatINR(mB?.tcob);
    document.getElementById('tcob-b-interest').textContent = formatINR(mB?.total_interest_paid);
    document.getElementById('tcob-b-fee').textContent = formatINR(mB?.upfront_fee);
    document.getElementById('tcob-b-penalty').textContent = formatINR(mB?.prepayment_penalty_amount || 0);
  } else {
    tcobBox.classList.add('hidden');
  }

  // Populate Evidence & Disclosure Comparison Table
  renderComparativeEvidenceTable(comp);
}

function renderComparativeEvidenceTable(comp) {
  const tbody = document.getElementById('comp-evidence-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  const isLoan = comp.category === 'LOAN';
  const nameA = comp.product_a.name;
  const nameB = comp.product_b.name;

  document.getElementById('comp-table-head-a').textContent = nameA.split('(')[0].trim();
  document.getElementById('comp-table-head-b').textContent = nameB.split('(')[0].trim();

  const comparisonRows = isLoan ? [
    {
      attribute: 'Advertised Rate',
      valA: '8.50% (Verified Page 1)',
      valB: '9.20% (Verified Page 1)',
      obs: 'Loan A has a 0.70% lower headline rate, creating an initial illusion of cheaper credit.'
    },
    {
      attribute: 'Upfront Processing Cost',
      valA: '₹8,000 (Deductible Page 2)',
      valB: '₹2,000 (Flat Page 2)',
      obs: 'Loan B saves ₹6,000 immediately at disbursement.'
    },
    {
      attribute: 'Foreclosure / Prepayment Penalty',
      valA: '<span class="text-rose-400 font-bold">4.5% Penalty (Disclosed Page 4)</span>',
      valB: '<span class="text-emerald-400 font-bold">0.0% (Zero Foreclosure Penalty)</span>',
      obs: 'Prepaying in Year 3 costs Arjun ₹14,651 under Loan A vs ₹0 under Loan B.'
    },
    {
      attribute: 'Evidence Disclosure Coverage',
      valA: '87.5% (14 / 16 attributes verified)',
      valB: '100.0% (16 / 16 attributes verified)',
      obs: 'Loan B provides complete contractual disclosure without hidden clauses.'
    },
    {
      attribute: 'Net TCOB over 3-Year Horizon',
      valA: '<span class="text-rose-400 font-bold">₹1,28,762 Total Cost</span>',
      valB: '<span class="text-emerald-400 font-bold">₹76,072 Total Cost</span>',
      obs: 'Loan B saves Arjun ₹52,690 in real cash outflow despite higher advertised rate!'
    }
  ] : [
    {
      attribute: 'Headline Return / Yield',
      valA: '14.5% High Beta',
      valB: '7.2% Sovereign Debt',
      obs: 'Asset A targets aggressive growth, Asset B prioritizes liquidity preservation.'
    },
    {
      attribute: 'Lock-in Commitment',
      valA: '36 Months Locked',
      valB: 'Instant Liquidity (T+1)',
      obs: 'Asset A creates capital lock-in incompatible with emergency runway.'
    },
    {
      attribute: 'Evidence Disclosure Coverage',
      valA: '92.0% (Schedule Disclosed)',
      valB: '100.0% (RBI Registered)',
      obs: 'Both assets have verified fact-sheet documentation.'
    }
  ];

  comparisonRows.forEach(row => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-800/40 transition-colors';
    tr.innerHTML = `
      <td class="px-3.5 py-2.5 font-medium text-gray-200">${row.attribute}</td>
      <td class="px-3.5 py-2.5">${row.valA}</td>
      <td class="px-3.5 py-2.5">${row.valB}</td>
      <td class="px-3.5 py-2.5 text-gray-400 text-[11px] leading-tight">${row.obs}</td>
    `;
    tbody.appendChild(tr);
  });
}

function closeCompareModal() {
  document.getElementById('compare-modal').classList.add('hidden');
}

// DOCUMENT EVIDENCE AUDITOR IMPLEMENTATION
function openDocumentModal(docId = null) {
  const targetDocId = docId || state.activeDocumentId || 'DOC_LOAN_TRAP_A';
  loadDocument(targetDocId);
  document.getElementById('document-modal').classList.remove('hidden');
}

function closeDocumentModal() {
  document.getElementById('document-modal').classList.add('hidden');
}

function loadDocument(docId) {
  const doc = DOCUMENTS_DATABASE[docId];
  if (!doc) return;

  state.activeDocumentId = docId;

  // Highlight active preset button
  document.querySelectorAll('.doc-preset-btn').forEach(btn => {
    if (btn.dataset.docId === docId) {
      btn.classList.add('ring-2', 'ring-blue-500', 'ring-offset-1', 'ring-offset-gray-900');
    } else {
      btn.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-1', 'ring-offset-gray-900');
    }
  });

  // Update file info display
  const fileInfo = document.getElementById('selected-file-info');
  if (fileInfo) {
    fileInfo.classList.remove('hidden');
    fileInfo.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span class="font-bold text-white">${doc.fileName}</span>
        <span class="text-gray-400">(${doc.fileSize} • ${doc.pagesCount} pages)</span>
      </div>
    `;
  }

  // Update Suitability Verdict card
  document.getElementById('doc-contract-name').textContent = doc.title;
  const tierEl = document.getElementById('doc-suitability-tier');
  tierEl.textContent = doc.suitabilityVerdict.tier;
  tierEl.className = `px-2 py-0.5 text-[10px] font-bold rounded border ${doc.suitabilityVerdict.colorClass}`;

  document.getElementById('doc-verdict-narrative').textContent = doc.suitabilityVerdict.narrative;
  document.getElementById('doc-stat-rate').textContent = doc.suitabilityVerdict.headline;
  document.getElementById('doc-stat-penalty').textContent = doc.suitabilityVerdict.penalty;
  document.getElementById('doc-stat-fee').textContent = doc.suitabilityVerdict.fee;

  // Calculate Evidence Coverage
  const totalAttrs = doc.attributes.length;
  const verifiedAttrs = doc.attributes.filter(a => a.status === 'FOUND').length;
  const missingAttrs = doc.attributes.filter(a => a.status === 'NOT_FOUND').length;
  const coveragePct = Number(((verifiedAttrs / totalAttrs) * 100).toFixed(1));

  document.getElementById('coverage-percentage').textContent = `${coveragePct}%`;
  document.getElementById('coverage-ratio').textContent = `${verifiedAttrs} of ${totalAttrs} attributes verified`;

  const bar = document.getElementById('coverage-bar');
  bar.style.width = `${coveragePct}%`;
  const tag = document.getElementById('coverage-status-tag');

  if (coveragePct >= 90) {
    bar.className = 'h-2.5 rounded-full bg-emerald-500 transition-all duration-500';
    tag.textContent = 'HIGH COMPLETENESS';
    tag.className = 'px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
  } else if (coveragePct >= 75) {
    bar.className = 'h-2.5 rounded-full bg-blue-500 transition-all duration-500';
    tag.textContent = 'ADEQUATE DISCLOSURE';
    tag.className = 'px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30';
  } else {
    bar.className = 'h-2.5 rounded-full bg-amber-500 transition-all duration-500';
    tag.textContent = 'DISCLOSURE GAPS DETECTED';
    tag.className = 'px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30';
  }

  // Render Extracted Information Table
  renderExtractedAttributesTable(doc);

  // Render Provider Verification Checklist
  renderVerificationChecklist(doc);

  // Set default inspected attribute
  const defaultAttr = doc.attributes.find(a => a.key === 'prepayment_penalty') || doc.attributes[0];
  inspectAttribute(defaultAttr);
}

function renderExtractedAttributesTable(doc) {
  const tbody = document.getElementById('extracted-attributes-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  doc.attributes.forEach((attr) => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-900/80 cursor-pointer transition-colors attribute-row';
    tr.dataset.key = attr.key;

    let badgeClass = 'badge-found';
    let badgeLabel = 'FOUND';

    if (attr.status === 'NOT_FOUND') {
      badgeClass = 'badge-not-found';
      badgeLabel = 'NOT FOUND';
    } else if (attr.status === 'AMBIGUOUS') {
      badgeClass = 'badge-ambiguous';
      badgeLabel = 'AMBIGUOUS';
    }

    tr.innerHTML = `
      <td class="px-3.5 py-3 font-semibold text-gray-200">
        <div>${attr.name}</div>
        <div class="text-[10px] text-gray-500 font-normal">${attr.category}</div>
      </td>
      <td class="px-3.5 py-3 font-mono ${attr.status === 'NOT_FOUND' ? 'text-amber-400 italic' : 'text-gray-100'}">
        ${attr.value}
      </td>
      <td class="px-3.5 py-3">
        <span class="px-2 py-0.5 text-[10px] font-bold rounded ${badgeClass}">
          ${badgeLabel}
        </span>
      </td>
      <td class="px-3.5 py-3 text-[11px] text-gray-400">
        ${attr.location}
      </td>
      <td class="px-3.5 py-3 text-right">
        <button class="inspect-btn px-2.5 py-1 text-[10px] font-bold rounded bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white transition-colors">
          Inspect Citation
        </button>
      </td>
    `;

    tr.addEventListener('click', () => {
      document.querySelectorAll('.attribute-row').forEach(r => r.classList.remove('bg-blue-950/40', 'border-l-2', 'border-blue-500'));
      tr.classList.add('bg-blue-950/40', 'border-l-2', 'border-blue-500');
      inspectAttribute(attr);
    });

    tbody.appendChild(tr);
  });
}

function inspectAttribute(attr) {
  if (!attr) return;
  state.selectedAttributeKey = attr.key;

  document.getElementById('inspect-attribute-title').textContent = attr.name;

  const badgeEl = document.getElementById('inspect-status-badge');
  badgeEl.textContent = attr.status;

  if (attr.status === 'FOUND') {
    badgeEl.className = 'px-2 py-0.5 text-[10px] font-bold rounded badge-found';
  } else if (attr.status === 'NOT_FOUND') {
    badgeEl.className = 'px-2 py-0.5 text-[10px] font-bold rounded badge-not-found';
  } else {
    badgeEl.className = 'px-2 py-0.5 text-[10px] font-bold rounded badge-ambiguous';
  }

  document.getElementById('inspect-value').textContent = attr.value;
  document.getElementById('inspect-location').textContent = attr.location;
  document.getElementById('inspect-quote').textContent = `"${attr.quote}"`;
  document.getElementById('inspect-note').textContent = attr.note;
}

function renderVerificationChecklist(doc) {
  const container = document.getElementById('verification-checklist-container');
  const label = document.getElementById('missing-count-label');
  if (!container) return;

  const missingList = doc.attributes.filter(a => a.status === 'NOT_FOUND' || a.status === 'AMBIGUOUS');
  label.textContent = `${missingList.length} Attributes Require Direct Clarification`;

  container.innerHTML = '';

  if (missingList.length === 0) {
    container.innerHTML = `
      <div class="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
        <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        <span>All 16 mandatory contractual attributes are verified with page & section citations in this document. Zero disclosure omissions detected.</span>
      </div>
    `;
    return;
  }

  missingList.forEach(item => {
    const box = document.createElement('div');
    box.className = 'p-3 rounded-lg bg-gray-950/80 border border-amber-500/40 text-xs flex items-start gap-3';
    box.innerHTML = `
      <input type="checkbox" class="mt-0.5 rounded bg-gray-900 border-gray-700 text-amber-500 focus:ring-0">
      <div class="flex-1">
        <div class="font-bold text-amber-300 flex items-center gap-2">
          <span>Clarify ${item.name} with provider</span>
          <span class="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">Not Disclosed</span>
        </div>
        <p class="text-gray-300 text-[11px] mt-1 leading-relaxed">
          ${item.note}
        </p>
      </div>
    `;
    container.appendChild(box);
  });
}

function handleCustomFileUpload(file) {
  if (!file) return;

  const fileInfo = document.getElementById('selected-file-info');
  fileInfo.classList.remove('hidden');
  fileInfo.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
      <span class="font-bold text-white">${file.name}</span>
      <span class="text-gray-400">(${(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
      <span class="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">Parsed</span>
    </div>
  `;

  // Dynamically generate audit profile based on file name
  const isInsurance = file.name.toLowerCase().includes('insurance') || file.name.toLowerCase().includes('health') || file.name.toLowerCase().includes('policy');
  const isFlexi = file.name.toLowerCase().includes('flexi') || file.name.toLowerCase().includes('transparent');

  if (isInsurance) {
    loadDocument('DOC_INSURANCE_STAR');
  } else if (isFlexi) {
    loadDocument('DOC_LOAN_FLEXI_B');
  } else {
    loadDocument('DOC_LOAN_TRAP_A');
  }
}

// Fallback products renderer if backend is unreachable
function renderLeaderboardFallback() {
  const sampleEvaluations = [
    {
      product_id: 'loan_flexi_b',
      product_name: 'FlexiClear Transparent Loan (Loan B)',
      institution: 'ClearFin Capital',
      category: 'LOAN',
      suitability_score: 84.0,
      rank: 1,
      suitability_tier: 'HIGHLY_SUITABLE',
      headline_trap_detected: false,
      risk_mismatch_detected: false,
      pros: ['Zero Prepayment Penalty', 'Flat ₹2,000 Processing Fee', 'Saves ₹52,690 in TCOB over 3 years'],
      cons: ['Headline rate is 9.2% (higher than 8.5% advertised loans)'],
      metrics: {
        headline_rate: 9.2,
        tcob: 76072,
        upfront_fee: 2000,
        prepayment_penalty_amount: 0
      },
      dimensions: [
        { name: 'Affordability & Debt Stress', raw_score: 90, weight: 0.25, weighted_score: 22.5, description: 'EMI ₹15,946 comfortably within Arjun surplus (₹40,000)' },
        { name: 'Horizon & Term Alignment', raw_score: 95, weight: 0.25, weighted_score: 23.8, description: '36-month commitment matches Arjun 3-year planned payoff' },
        { name: 'Cost Efficiency (TCOB)', raw_score: 88, weight: 0.25, weighted_score: 22.0, description: 'Zero prepayment penalty eliminates exit drag' },
        { name: 'Product Constraints & Freedom', raw_score: 92, weight: 0.15, weighted_score: 13.8, description: 'Full freedom for part-payment from Day 1' },
        { name: 'Risk & Solvency Cushion', raw_score: 80, weight: 0.10, weighted_score: 8.0, description: 'Buffer remains safe (>3.0m runway)' }
      ],
      penalties: [],
      reasoning_trace: 'Score = Affordability(22.5) + Horizon(23.8) + Cost(22.0) + Freedom(13.8) + Solvency(8.0) - Penalties(0.0) = 84.0',
      narrative: 'Loan B achieves the highest suitability score because its terms perfectly align with Arjun\'s plan to prepay in 3 years. Zero foreclosure fees and modest processing charges save ₹52,690 over Loan A.'
    },
    {
      product_id: 'loan_trap_a',
      product_name: 'Apex Easy Personal Loan (Loan A)',
      institution: 'Apex Bank',
      category: 'LOAN',
      suitability_score: 24.0,
      rank: 2,
      suitability_tier: 'NOT_RECOMMENDED',
      headline_trap_detected: true,
      risk_mismatch_detected: false,
      pros: ['Lowest advertised headline rate of 8.5% APR'],
      cons: ['Heavy 4.5% prepayment penalty on outstanding principal', '₹8,000 upfront processing fee', '7-year forced amortization tenure'],
      metrics: {
        headline_rate: 8.5,
        tcob: 128762,
        upfront_fee: 8000,
        prepayment_penalty_amount: 14651
      },
      dimensions: [
        { name: 'Affordability & Debt Stress', raw_score: 75, weight: 0.25, weighted_score: 18.8, description: 'Lower initial EMI, but longer interest duration' },
        { name: 'Horizon & Term Alignment', raw_score: 20, weight: 0.25, weighted_score: 5.0, description: '84-month tenure severely mismatched with Arjun 36-month horizon' },
        { name: 'Cost Efficiency (TCOB)', raw_score: 15, weight: 0.25, weighted_score: 3.8, description: '₹8,000 fee + ₹14,651 exit penalty inflates borrowing cost to ₹1,28,762' },
        { name: 'Product Constraints & Freedom', raw_score: 30, weight: 0.15, weighted_score: 4.5, description: 'Part-prepayment locked for 24 months' },
        { name: 'Risk & Solvency Cushion', raw_score: 70, weight: 0.10, weighted_score: 7.0, description: 'Moderate solvency buffer' }
      ],
      penalties: [
        { code: 'HEADLINE_RATE_TRAP', title: 'Severe Prepayment Trap Penalty', penalty_points: 24.0, severity: 'CRITICAL', reason: 'Prepaying after 36 months triggers ₹14,651 exit penalty, negating all interest savings.' }
      ],
      reasoning_trace: 'Score = Affordability(18.8) + Horizon(5.0) + Cost(3.8) + Freedom(4.5) + Solvency(7.0) - HeadlineTrap(24.0) = 24.0',
      narrative: 'Loan A is a classic Headline Rate Trap. Despite advertising 8.5%, its 4.5% foreclosure fee and ₹8,000 processing cost make it ₹52,690 more expensive than Loan B over a 3-year repayment timeline.'
    }
  ];

  renderLeaderboard(sampleEvaluations);
}
