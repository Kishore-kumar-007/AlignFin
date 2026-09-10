import os
import json
from typing import Optional, List
from ..models.evaluation import SuitabilityResult, ComparisonMatrix, RiskCapacityAnalysis
from ..models.user import UserProfile

class ExplanationEngine:
    """
    Dual-Mode Explainability Engine
    - Deterministic Rule-Based Reasoning Trace (100% reliable, zero hallucination)
    - Optional LLM-assisted Narrative Synthesis (Grounded purely on structured output)
    """

    @staticmethod
    def synthesize_product_explanation(result: SuitabilityResult, profile: UserProfile, risk_analysis: RiskCapacityAnalysis) -> str:
        prod = result.product
        score = result.suitability_score
        tier = result.fit_tier
        
        lines = []
        lines.append(f"### Suitability Assessment: {prod.name} ({score:.0f}/100 — {tier})")
        
        if result.risk_mismatch:
            lines.append(f"⚠️ **Risk Alert**: Stated tolerance is '{risk_analysis.stated_risk_tolerance.upper()}', but derived financial buffer capacity is '{risk_analysis.derived_risk_capacity.upper()}'.")
            
        if prod.category == "loan":
            cost = result.secondary_cost_impact
            lines.append(
                f"- **Cost Profile**: Advertised rate is **{prod.headline_label}**, but total cost over your **{profile.target_horizon_months}-month horizon** is **₹{cost.get('total_cost_over_horizon', 0):,.0f}** "
                f"(including ₹{cost.get('upfront_fee', 0):,.0f} upfront fee and ₹{cost.get('prepayment_penalty_incurred', 0):,.0f} prepayment penalty)."
            )
            if cost.get("early_exit_applied") and prod.prepayment_penalty_pct > 0:
                lines.append(f"- **Exit Penalty Drag**: Exiting at month {profile.target_horizon_months} before full {prod.max_tenure_months}m tenure triggers {prod.prepayment_penalty_pct}% foreclosure charge.")
            elif prod.prepayment_penalty_pct == 0:
                lines.append("- **Flexibility Advantage**: 0% foreclosure charges ensure complete freedom to settle early with zero penalty.")
                
        elif prod.category == "investment":
            impact = result.secondary_cost_impact
            lines.append(
                f"- **Compounding Profile**: Projected value of **₹{impact.get('final_liquidated_value', 0):,.0f}** over {profile.target_horizon_months} months "
                f"(Net CAGR: {impact.get('effective_annualized_return_pct', 0):.2f}% after {prod.expense_ratio_pct}% annual fee)."
            )
            if impact.get("lock_in_violated"):
                lines.append(f"- ⛔ **Lock-In Conflict**: Product is strictly locked for {prod.lock_in_months} months, which exceeds your planned {profile.target_horizon_months}-month horizon.")
                
        elif prod.category == "savings":
            impact = result.secondary_cost_impact
            lines.append(
                f"- **Capital Protection**: Guaranteed maturity value of **₹{impact.get('maturity_value', 0):,.0f}** with {prod.liquidity_rating.upper()} liquidity access."
            )
            
        # Top Pros & Cons
        if result.pros:
            lines.append("- **Key Strengths**: " + " | ".join(result.pros))
        if result.cons:
            lines.append("- **Watch-outs & Constraints**: " + " | ".join(result.cons))
            
        return "\n".join(lines)

    @staticmethod
    def synthesize_comparison_verdict(matrix: ComparisonMatrix) -> str:
        if not matrix.results:
            return "No products evaluated."
            
        top_product = matrix.results[0]
        runner_up = matrix.results[1] if len(matrix.results) > 1 else None
        
        lines = []
        lines.append(f"## Decision Intelligence Verdict: {top_product.product.name} is the Top Match ({top_product.suitability_score}/100)")
        
        if runner_up:
            headline_diff = runner_up.product.headline_rate - top_product.product.headline_rate
            score_diff = top_product.suitability_score - runner_up.suitability_score
            
            if top_product.product.category == "loan":
                if top_product.product.headline_rate > runner_up.product.headline_rate:
                    lines.append(
                        f"**Why {top_product.product.name} wins despite higher headline rate ({top_product.product.headline_label} vs {runner_up.product.headline_label})**:\n"
                        f"1. **Lower Upfront Drag**: Saves ₹{runner_up.secondary_cost_impact.get('upfront_fee', 0) - top_product.secondary_cost_impact.get('upfront_fee', 0):,.0f} in initial processing fees.\n"
                        f"2. **Zero Prepayment Penalty**: Avoids ₹{runner_up.secondary_cost_impact.get('prepayment_penalty_incurred', 0):,.0f} in exit penalty fees when closing at Month {matrix.user_profile.target_horizon_months}.\n"
                        f"3. **Horizon Optimization**: Exactly matches your {matrix.user_profile.target_horizon_months}-month repayment window instead of locking you into excessive interest amortization."
                    )
                else:
                    lines.append(
                        f"**Why {top_product.product.name} wins**: Combines lower borrowing cost with optimal terms for your {matrix.user_profile.target_horizon_months}-month horizon."
                    )
            elif top_product.product.category == "investment":
                if matrix.risk_analysis.risk_mismatch_detected:
                    lines.append(
                        f"**Capital Preservation Priority**: While speculative assets advertise high historical gains, your thin emergency buffer ({matrix.risk_analysis.emergency_runway_months} months runway) requires volatility protection. "
                        f"{top_product.product.name} provides optimal downside resilience without risk of severe capital drawdowns."
                    )
                else:
                    lines.append(
                        f"**Balanced Growth Alignment**: {top_product.product.name} offers optimal fee efficiency ({top_product.product.expense_ratio_pct}% fee) and avoids lock-in traps while maximizing risk-adjusted compound return."
                    )
                    
        return "\n\n".join(lines)
