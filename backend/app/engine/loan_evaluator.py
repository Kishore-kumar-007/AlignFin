import math
from typing import List, Dict, Any, Tuple
from ..models.user import UserProfile
from ..models.product import Product
from ..models.evaluation import ScoreDimension, PenaltyItem, SuitabilityResult, CashFlowPoint, RiskCapacityAnalysis

class LoanSuitabilityEvaluator:
    """
    Evaluates loan products against user profiles.
    Compares Total Cost of Borrowing (TCOB) over the user's specific target horizon,
    detecting prepayment traps, upfront fee drags, and debt overburden.
    """
    
    @staticmethod
    def calculate_emi(principal: float, annual_rate_pct: float, tenure_months: int) -> float:
        if annual_rate_pct <= 0 or tenure_months <= 0:
            return principal / max(1, tenure_months)
        r = (annual_rate_pct / 100.0) / 12.0
        n = tenure_months
        emi = principal * (r * ((1 + r) ** n)) / (((1 + r) ** n) - 1)
        return emi

    @staticmethod
    def simulate_loan_cashflows(
        principal: float,
        annual_rate: float,
        product_tenure_months: int,
        user_horizon_months: int,
        processing_fee: float,
        prepayment_penalty_pct: float
    ) -> Tuple[List[CashFlowPoint], Dict[str, Any]]:
        r = (annual_rate / 100.0) / 12.0
        n = product_tenure_months
        emi = LoanSuitabilityEvaluator.calculate_emi(principal, annual_rate, n)
        
        balance = principal
        cumulative_interest = 0.0
        cumulative_total_paid = processing_fee
        
        cashflow_points: List[CashFlowPoint] = [
            CashFlowPoint(month=0, cumulative_cost_or_value=round(processing_fee, 2), principal_paid=0, interest_or_gain=0)
        ]
        
        eval_months = min(user_horizon_months, product_tenure_months)
        
        for m in range(1, eval_months + 1):
            interest_month = balance * r
            principal_month = emi - interest_month
            balance = max(0.0, balance - principal_month)
            cumulative_interest += interest_month
            cumulative_total_paid += emi
            
            # Record sampled points for charts
            if m % 6 == 0 or m == eval_months or m == 1:
                cashflow_points.append(
                    CashFlowPoint(
                        month=m,
                        cumulative_cost_or_value=round(cumulative_total_paid, 2),
                        principal_paid=round(principal - balance, 2),
                        interest_or_gain=round(cumulative_interest, 2)
                    )
                )
                
        # Prepayment calculation if user exits before full product tenure
        early_exit = user_horizon_months < product_tenure_months
        prepayment_penalty_amount = 0.0
        if early_exit and balance > 0:
            prepayment_penalty_amount = balance * (prepayment_penalty_pct / 100.0)
            cumulative_total_paid += prepayment_penalty_amount
            if cashflow_points and cashflow_points[-1].month == eval_months:
                cashflow_points[-1].cumulative_cost_or_value = round(cumulative_total_paid, 2)
                
        # Full term total cost if held to maturity
        full_term_total_interest = (emi * n) - principal
        full_term_total_cost = principal + full_term_total_interest + processing_fee
        
        total_cost_at_horizon = cumulative_total_paid
        effective_annual_cost_pct = ((total_cost_at_horizon - principal) / principal) / (user_horizon_months / 12.0) * 100 if user_horizon_months > 0 else annual_rate
        
        summary = {
            "monthly_emi": round(emi, 2),
            "upfront_fee": round(processing_fee, 2),
            "total_interest_at_horizon": round(cumulative_interest, 2),
            "prepayment_penalty_incurred": round(prepayment_penalty_amount, 2),
            "total_cost_over_horizon": round(total_cost_at_horizon, 2),
            "full_term_total_cost": round(full_term_total_cost, 2),
            "early_exit_applied": early_exit,
            "effective_annual_cost_pct": round(effective_annual_cost_pct, 2),
            "outstanding_principal_at_horizon": round(balance, 2)
        }
        return cashflow_points, summary

    @staticmethod
    def evaluate(product: Product, profile: UserProfile, risk_analysis: RiskCapacityAnalysis) -> SuitabilityResult:
        principal = min(max(profile.target_amount, product.min_amount), product.max_amount)
        product_tenure = product.max_tenure_months or 36
        user_horizon = profile.target_horizon_months
        
        # Upfront Fee calculation
        processing_fee = product.processing_fee_flat + (principal * (product.processing_fee_pct / 100.0))
        
        # Cash flow simulation
        cashflow_points, cost_summary = LoanSuitabilityEvaluator.simulate_loan_cashflows(
            principal=principal,
            annual_rate=product.headline_rate,
            product_tenure_months=product_tenure,
            user_horizon_months=user_horizon,
            processing_fee=processing_fee,
            prepayment_penalty_pct=product.prepayment_penalty_pct
        )
        
        emi = cost_summary["monthly_emi"]
        total_new_debt_monthly = profile.existing_debt_emi + emi
        new_dti_pct = (total_new_debt_monthly / profile.monthly_income) * 100 if profile.monthly_income > 0 else 100
        
        # 1. Dimension 1: Affordability & Cash-flow Impact (Weight: 25%)
        # Benchmarks: DTI < 35% is 100 pts; DTI > 55% decays to 0
        if new_dti_pct <= 35:
            d1_raw = 100.0
        elif new_dti_pct >= 60:
            d1_raw = max(0.0, 100.0 - (new_dti_pct - 35) * 3.5)
        else:
            d1_raw = 100.0 - (new_dti_pct - 35) * 2.5
        d1 = ScoreDimension(
            dimension="affordability",
            label="Affordability & Debt Burden",
            weight=0.25,
            raw_score=round(d1_raw, 1),
            weighted_score=round(d1_raw * 0.25, 1),
            description=f"New monthly EMI is ₹{emi:,.0f} bringing total DTI to {new_dti_pct:.1f}% of income."
        )
        
        # 2. Dimension 2: Horizon Total Cost Efficiency (Weight: 25%)
        # Baseline: Compare total cost against ideal zero-fee baseline
        horizon_years = user_horizon / 12.0
        base_interest = principal * (product.headline_rate / 100.0) * (horizon_years * 0.55) # approx amortization interest
        actual_drag = (cost_summary["total_cost_over_horizon"] - principal)
        ideal_cost = base_interest
        cost_ratio = (actual_drag / max(1.0, ideal_cost)) if ideal_cost > 0 else 1.0
        
        if cost_ratio <= 1.05:
            d2_raw = 95.0
        elif cost_ratio >= 1.6:
            d2_raw = max(20.0, 100.0 - (cost_ratio - 1.0) * 110)
        else:
            d2_raw = max(30.0, 100.0 - (cost_ratio - 1.0) * 90)
        d2 = ScoreDimension(
            dimension="cost_efficiency",
            label="Total Cost over User Horizon",
            weight=0.25,
            raw_score=round(d2_raw, 1),
            weighted_score=round(d2_raw * 0.25, 1),
            description=f"Total cost over your {user_horizon}-month timeline: ₹{cost_summary['total_cost_over_horizon']:,.0f} (Effective APR: {cost_summary['effective_annual_cost_pct']:.2f}%)."
        )
        
        # 3. Dimension 3: Tenure & Horizon Alignment (Weight: 20%)
        tenure_diff_years = abs((product_tenure - user_horizon) / 12.0)
        d3_raw = max(10.0, 100.0 - (tenure_diff_years * 20.0))
        d3 = ScoreDimension(
            dimension="tenure_alignment",
            label="Tenure & Horizon Match",
            weight=0.20,
            raw_score=round(d3_raw, 1),
            weighted_score=round(d3_raw * 0.20, 1),
            description=f"Product tenure is {product_tenure//12} yrs vs your intended {user_horizon//12} yrs horizon (delta: {tenure_diff_years:.1f} yrs)."
        )
        
        # 4. Dimension 4: Secondary Terms & Exit Flexibility (Weight: 15%)
        flex_penalty = (product.prepayment_penalty_pct * 12.0) + (processing_fee / principal * 100.0 * 8.0)
        d4_raw = max(10.0, 100.0 - flex_penalty)
        d4 = ScoreDimension(
            dimension="flexibility_terms",
            label="Secondary Fees & Flexibility",
            weight=0.15,
            raw_score=round(d4_raw, 1),
            weighted_score=round(d4_raw * 0.15, 1),
            description=f"Prepayment penalty: {product.prepayment_penalty_pct}% | Upfront fee: ₹{processing_fee:,.0f}."
        )
        
        # 5. Dimension 5: Liquidity Impact on Emergency Reserves (Weight: 15%)
        fee_impact_on_savings_pct = (processing_fee / profile.current_savings * 100.0) if profile.current_savings > 0 else 100.0
        if fee_impact_on_savings_pct <= 5.0:
            d5_raw = 100.0
        elif fee_impact_on_savings_pct >= 25.0:
            d5_raw = max(10.0, 100.0 - fee_impact_on_savings_pct * 3.0)
        else:
            d5_raw = 100.0 - fee_impact_on_savings_pct * 2.0
        d5 = ScoreDimension(
            dimension="liquidity_impact",
            label="Upfront Liquidity Preservation",
            weight=0.15,
            raw_score=round(d5_raw, 1),
            weighted_score=round(d5_raw * 0.15, 1),
            description=f"Upfront fee consumes {fee_impact_on_savings_pct:.1f}% of current liquid savings buffer."
        )
        
        breakdown = [d1, d2, d3, d4, d5]
        base_score = sum(d.weighted_score for d in breakdown)
        
        # Penalties & Conflict Detection
        penalties: List[PenaltyItem] = []
        pros: List[str] = []
        cons: List[str] = []
        reasoning: List[str] = []
        
        # Penalty 1: Prepayment Penalty Trap when user intends early exit
        if cost_summary["early_exit_applied"] and product.prepayment_penalty_pct > 0:
            penalty_val = min(22.0, product.prepayment_penalty_pct * 4.5)
            penalties.append(
                PenaltyItem(
                    title="Prepayment Exit Penalty Drag",
                    penalty_points=round(penalty_val, 1),
                    reason=f"Exiting at month {user_horizon} (before {product_tenure} mo tenure) triggers a {product.prepayment_penalty_pct}% penalty (₹{cost_summary['prepayment_penalty_incurred']:,.0f}).",
                    severity="warning"
                )
            )
            cons.append(f"Prepayment fee penalty of ₹{cost_summary['prepayment_penalty_incurred']:,.0f} on early closure at {user_horizon//12} years.")
            reasoning.append(f"Prepayment Penalty: Charged {product.prepayment_penalty_pct}% on outstanding balance because tenure ({product_tenure}m) exceeds user horizon ({user_horizon}m).")
            
        # Penalty 2: Disproportionate Upfront Processing Fee
        if processing_fee >= 5000.0 or (processing_fee / principal) >= 0.02:
            penalties.append(
                PenaltyItem(
                    title="Heavy Upfront Processing Fee",
                    penalty_points=8.0,
                    reason=f"High upfront deduction of ₹{processing_fee:,.0f} reduces effective disbursed capital.",
                    severity="info"
                )
            )
            cons.append(f"Substantial upfront fee of ₹{processing_fee:,.0f}.")
            reasoning.append(f"Upfront Drag: ₹{processing_fee:,.0f} fee dilutes the benefit of lower headline interest.")
            
        # Penalty 3: Severe DTI / Affordability Alert
        if new_dti_pct > 45.0:
            penalties.append(
                PenaltyItem(
                    title="High Debt Burden Warning",
                    penalty_points=18.0,
                    reason=f"Total debt obligations consume {new_dti_pct:.1f}% of gross income, exceeding 45% safe threshold.",
                    severity="critical"
                )
            )
            cons.append(f"Brings monthly debt obligations to an elevated {new_dti_pct:.1f}% of income.")
            reasoning.append(f"Solvency Strain: Monthly EMI of ₹{emi:,.0f} limits financial flexibility.")
            
        # Penalty 4: Missing Critical Document Evidence
        missing_evidence_penalty = 0.0
        missing_evidence_reasons = []
        
        prep_evidence = product.evidence_map.get("prepayment_penalty_pct")
        if prep_evidence and prep_evidence.status == "NOT_FOUND":
            missing_evidence_penalty += 15.0
            missing_evidence_reasons.append("Prepayment penalty is NOT explicitly mentioned in the document. Do not assume it is 0%.")
            cons.append("Missing information on prepayment penalties.")
            
        proc_evidence = product.evidence_map.get("processing_fee_pct")
        if proc_evidence and proc_evidence.status == "NOT_FOUND":
            missing_evidence_penalty += 10.0
            missing_evidence_reasons.append("Processing fee is NOT explicitly mentioned. Providers often hide this.")
            cons.append("Missing information on processing fees.")
            
        if missing_evidence_penalty > 0:
            penalties.append(
                PenaltyItem(
                    title="Missing Critical Document Evidence",
                    penalty_points=missing_evidence_penalty,
                    reason=" | ".join(missing_evidence_reasons),
                    severity="warning"
                )
            )
            reasoning.append(f"Evidence Missing: {len(missing_evidence_reasons)} critical fields were not found in the uploaded document. Avoid hidden traps.")
            
        # Pros
        if product.prepayment_penalty_pct == 0:
            pros.append("Zero prepayment foreclosure penalty allows penalty-free early payoff anytime.")
            reasoning.append("Flexibility: 0% foreclosure fee allows penalty-free repayment whenever funds are available.")
        if processing_fee <= 2000.0:
            pros.append(f"Minimal upfront processing fee of only ₹{processing_fee:,.0f}.")
        if abs(product_tenure - user_horizon) <= 6:
            pros.append(f"Loan tenure matches your planned {user_horizon}-month repayment timeline seamlessly.")
        if product.headline_rate <= 9.0:
            pros.append(f"Competitive headline interest rate ({product.headline_label}).")
            
        # Calculate Final Score
        total_penalties = sum(p.penalty_points for p in penalties)
        final_score = max(5.0, min(100.0, base_score - total_penalties))
        
        # Fit Tier Classification
        if final_score >= 82.0:
            fit_tier = "Excellent Match"
        elif final_score >= 70.0:
            fit_tier = "Good Fit"
        elif final_score >= 55.0:
            fit_tier = "Moderate Fit"
        elif final_score >= 40.0:
            fit_tier = "Caution / Conflict"
        else:
            fit_tier = "Unsuitable"
            
        return SuitabilityResult(
            product=product,
            suitability_score=round(final_score, 1),
            rank=1,
            fit_tier=fit_tier,
            risk_capacity=risk_analysis.derived_risk_capacity,
            risk_mismatch=risk_analysis.risk_mismatch_detected,
            score_breakdown=breakdown,
            penalties=penalties,
            pros=pros,
            cons=cons,
            secondary_cost_impact=cost_summary,
            cash_flow_simulation=cashflow_points,
            reasoning_trace=reasoning
        )
