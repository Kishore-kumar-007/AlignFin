from typing import List, Dict, Any, Tuple
from ..models.user import UserProfile
from ..models.product import Product
from ..models.evaluation import ScoreDimension, PenaltyItem, SuitabilityResult, CashFlowPoint, RiskCapacityAnalysis

class SavingsSuitabilityEvaluator:
    """
    Evaluates savings, fixed deposits, and cash-equivalent products.
    Evaluates Emergency Buffer Priority, Guaranteed Yields, Premature Penalty Risks,
    and Lock-in constraints.
    """
    
    @staticmethod
    def simulate_savings_growth(
        principal: float,
        annual_rate_pct: float,
        lock_in_months: int,
        prepayment_penalty_pct: float,
        user_horizon_months: int
    ) -> Tuple[List[CashFlowPoint], Dict[str, Any]]:
        monthly_rate = (annual_rate_pct / 100.0) / 12.0
        
        balance = principal
        cumulative_interest = 0.0
        cashflow_points: List[CashFlowPoint] = [
            CashFlowPoint(month=0, cumulative_cost_or_value=round(principal, 2), principal_paid=round(principal, 2), interest_or_gain=0)
        ]
        
        for m in range(1, user_horizon_months + 1):
            # Monthly compounding / accrual
            interest_m = balance * monthly_rate
            balance += interest_m
            cumulative_interest += interest_m
            
            if m % 3 == 0 or m == user_horizon_months or m == 1:
                cashflow_points.append(
                    CashFlowPoint(
                        month=m,
                        cumulative_cost_or_value=round(balance, 2),
                        principal_paid=round(principal, 2),
                        interest_or_gain=round(cumulative_interest, 2)
                    )
                )
                
        # Premature liquidation penalty (if user liquidates before full product lock or if penalty applies)
        is_premature = user_horizon_months < 12 and prepayment_penalty_pct > 0
        penalty_amount = (cumulative_interest * (prepayment_penalty_pct / 100.0)) if is_premature else 0.0
        final_value = balance - penalty_amount
        net_interest_earned = final_value - principal
        
        lock_in_violation = user_horizon_months < lock_in_months
        
        summary = {
            "initial_deposit": round(principal, 2),
            "maturity_value": round(final_value, 2),
            "gross_interest_earned": round(cumulative_interest, 2),
            "premature_penalty_deducted": round(penalty_amount, 2),
            "net_interest_earned": round(net_interest_earned, 2),
            "effective_yield_pct": round((net_interest_earned / principal) / (user_horizon_months / 12.0) * 100.0, 2) if user_horizon_months > 0 else annual_rate_pct,
            "lock_in_violated": lock_in_violation,
            "lock_in_months": lock_in_months
        }
        return cashflow_points, summary

    @staticmethod
    def evaluate(product: Product, profile: UserProfile, risk_analysis: RiskCapacityAnalysis) -> SuitabilityResult:
        principal = min(max(profile.target_amount, product.min_amount), product.max_amount)
        user_horizon = profile.target_horizon_months
        
        cashflow_points, yield_summary = SavingsSuitabilityEvaluator.simulate_savings_growth(
            principal=principal,
            annual_rate_pct=product.headline_rate,
            lock_in_months=product.lock_in_months,
            prepayment_penalty_pct=product.prepayment_penalty_pct,
            user_horizon_months=user_horizon
        )
        
        # 1. Dimension 1: Capital Safety & Buffer Preservation (Weight: 25%)
        # Savings products have high safety by default
        d1_raw = 100.0 if product.risk_level == "low" else 80.0
        d1 = ScoreDimension(
            dimension="capital_preservation",
            label="Capital Preservation & Safety",
            weight=0.25,
            raw_score=round(d1_raw, 1),
            weighted_score=round(d1_raw * 0.25, 1),
            description=f"Low risk guarantee with predictable interest payouts ({product.headline_label})."
        )
        
        # 2. Dimension 2: Instant Liquidity & Emergency Accessibility (Weight: 25%)
        # If user has low buffer, liquidity rating is paramount
        if profile.liquidity_importance == "high":
            if product.liquidity_rating == "high" and product.lock_in_months == 0:
                d2_raw = 100.0
            elif product.liquidity_rating == "medium":
                d2_raw = 70.0
            else:
                d2_raw = 30.0
        else:
            d2_raw = 90.0 if product.lock_in_months == 0 else max(40.0, 100.0 - (product.lock_in_months * 1.5))
            
        d2 = ScoreDimension(
            dimension="liquidity_access",
            label="Liquidity & Emergency Accessibility",
            weight=0.25,
            raw_score=round(d2_raw, 1),
            weighted_score=round(d2_raw * 0.25, 1),
            description=f"Liquidity rating: {product.liquidity_rating.upper()} (Lock-in: {product.lock_in_months}m, Premature penalty: {product.prepayment_penalty_pct}%)."
        )
        
        # 3. Dimension 3: Guaranteed Yield vs Category Benchmark (Weight: 20%)
        # 6.5% benchmark = 70pts, 8.5%+ = 100pts
        effective_rate = yield_summary["effective_yield_pct"]
        d3_raw = min(100.0, max(30.0, (effective_rate / 8.5) * 100.0))
        d3 = ScoreDimension(
            dimension="guaranteed_yield",
            label="Guaranteed Yield Competitiveness",
            weight=0.20,
            raw_score=round(d3_raw, 1),
            weighted_score=round(d3_raw * 0.20, 1),
            description=f"Effective net annualized yield: {effective_rate:.2f}% p.a."
        )
        
        # 4. Dimension 4: Time Horizon & Tenure Fit (Weight: 15%)
        tenure_delta = abs(((product.max_tenure_months or 36) - user_horizon) / 12.0)
        d4_raw = max(20.0, 100.0 - (tenure_delta * 15.0))
        d4 = ScoreDimension(
            dimension="tenure_alignment",
            label="Tenure & Horizon Alignment",
            weight=0.15,
            raw_score=round(d4_raw, 1),
            weighted_score=round(d4_raw * 0.15, 1),
            description=f"Deposit tenure fits your planned {user_horizon}-month savings timeline."
        )
        
        # 5. Dimension 5: Financial Buffer Solvency Reinforcement (Weight: 15%)
        # If user has low capacity, savings products score maximum buffer reinforcement
        if risk_analysis.derived_risk_capacity == "low":
            d5_raw = 100.0
        elif risk_analysis.derived_risk_capacity == "moderate":
            d5_raw = 85.0
        else:
            d5_raw = 70.0
            
        d5 = ScoreDimension(
            dimension="buffer_reinforcement",
            label="Emergency Buffer Reinforcement",
            weight=0.15,
            raw_score=round(d5_raw, 1),
            weighted_score=round(d5_raw * 0.15, 1),
            description=f"Strengthens existing ₹{profile.current_savings:,.0f} emergency reserve with guaranteed returns."
        )
        
        breakdown = [d1, d2, d3, d4, d5]
        base_score = sum(d.weighted_score for d in breakdown)
        
        penalties: List[PenaltyItem] = []
        pros: List[str] = []
        cons: List[str] = []
        reasoning: List[str] = []
        
        # Penalty 1: Lock-in Breach
        if yield_summary["lock_in_violated"]:
            penalties.append(
                PenaltyItem(
                    title="Fixed Lock-In Restriction",
                    penalty_points=30.0,
                    reason=f"Product requires {product.lock_in_months} months mandatory lock-in, exceeding your {user_horizon}-month timeline.",
                    severity="critical"
                )
            )
            cons.append(f"Strict {product.lock_in_months}-month lock-in prevents emergency withdrawal.")
            reasoning.append(f"Inflexible Lock-in: User needs access at {user_horizon}m but product is locked for {product.lock_in_months}m.")
            
        # Penalty 2: Premature Interest Reduction
        if yield_summary["premature_penalty_deducted"] > 0 or (product.prepayment_penalty_pct > 0 and profile.liquidity_importance == "high"):
            penalties.append(
                PenaltyItem(
                    title="Premature Liquidation Penalty",
                    penalty_points=12.0,
                    reason=f"{product.prepayment_penalty_pct}% penalty rate reduction applied if liquidated before term maturity.",
                    severity="warning"
                )
            )
            cons.append(f"{product.prepayment_penalty_pct}% penalty charged on early premature withdrawal.")
            
        # Penalty 3: Missing Critical Document Evidence
        missing_evidence_penalty = 0.0
        missing_evidence_reasons = []
        
        penalty_evidence = product.evidence_map.get("prepayment_penalty_pct")
        if penalty_evidence and penalty_evidence.status == "NOT_FOUND":
            missing_evidence_penalty += 10.0
            missing_evidence_reasons.append("Premature withdrawal penalty rate is NOT explicitly stated.")
            cons.append("Missing premature penalty information.")
            
        lockin_evidence = product.evidence_map.get("lock_in_months")
        if lockin_evidence and lockin_evidence.status == "NOT_FOUND":
            missing_evidence_penalty += 12.0
            missing_evidence_reasons.append("Lock-in period is NOT found. Do not assume full liquidity.")
            cons.append("Missing lock-in information.")
            
        if missing_evidence_penalty > 0:
            penalties.append(
                PenaltyItem(
                    title="Missing Critical Document Evidence",
                    penalty_points=missing_evidence_penalty,
                    reason=" | ".join(missing_evidence_reasons),
                    severity="warning"
                )
            )
            reasoning.append(f"Evidence Missing: {len(missing_evidence_reasons)} critical fields were not found in the uploaded document.")            
        # Pros
        if product.liquidity_rating == "high" and product.lock_in_months == 0:
            pros.append("100% instant liquidity with zero premature breakage penalties.")
            reasoning.append("High Liquidity: Auto-sweep or instant penalty-free withdrawal protects emergency access.")
        if product.headline_rate >= 8.0:
            pros.append(f"High guaranteed rate of {product.headline_label}.")
        if "DICGC" in str(product.key_features):
            pros.append("DICGC deposit insurance protection up to ₹5 Lakh.")
            
        total_penalties = sum(p.penalty_points for p in penalties)
        final_score = max(5.0, min(100.0, base_score - total_penalties))
        
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
            secondary_cost_impact=yield_summary,
            cash_flow_simulation=cashflow_points,
            reasoning_trace=reasoning
        )
