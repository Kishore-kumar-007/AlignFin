/**
 * AlignFin Contract Evidence & Disclosure Database
 * Grounded contractual terms, page/section citations, and verbatim excerpts.
 */

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
