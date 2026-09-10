/**
 * AlignFin Hackathon Demo Scenarios & Profiles
 */

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
