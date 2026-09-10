/**
 * AlignFin Financial Buffer & Solvency Index (FBSI) Engine
 * Deterministic mathematical formulation of household capacity, solvency, and risk cushion.
 */

/**
 * Calculate client FBSI metrics and capacity tier
 * @param {Object} profile - User household balance sheet inputs
 * @returns {Object} Calculated FBSI solvency metrics
 */
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
