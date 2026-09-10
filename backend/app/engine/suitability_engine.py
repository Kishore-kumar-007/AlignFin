from typing import List, Optional
from ..models.user import UserProfile
from ..models.product import Product
from ..models.evaluation import SuitabilityResult, ComparisonMatrix, RiskCapacityAnalysis
from .risk_engine import RiskCapacityEngine
from .loan_evaluator import LoanSuitabilityEvaluator
from .investment_evaluator import InvestmentSuitabilityEvaluator
from .savings_evaluator import SavingsSuitabilityEvaluator
from .explanation_engine import ExplanationEngine
from ..database.db import get_all_products, get_product_by_id

class SuitabilityEngine:
    """
    Central orchestrator for financial product suitability evaluations,
    scoring coordination, and multi-product trade-off comparisons.
    """

    @staticmethod
    def evaluate_products_for_profile(
        profile: UserProfile,
        products: Optional[List[Product]] = None
    ) -> List[SuitabilityResult]:
        # 1. Deterministic Risk Capacity Evaluation
        risk_analysis = RiskCapacityEngine.evaluate(profile)
        
        # 2. Fetch candidate products if not provided
        if products is None:
            products = get_all_products(category=profile.category_interest)
            
        results: List[SuitabilityResult] = []
        
        for product in products:
            if product.category == "loan":
                res = LoanSuitabilityEvaluator.evaluate(product, profile, risk_analysis)
            elif product.category == "investment":
                res = InvestmentSuitabilityEvaluator.evaluate(product, profile, risk_analysis)
            elif product.category == "savings":
                res = SavingsSuitabilityEvaluator.evaluate(product, profile, risk_analysis)
            else:
                continue
                

            # Goal-aware adjustments
            goal = profile.financial_goal.lower()
            if goal == "emergency_fund" and product.category == "savings" and product.liquidity_rating == "high" and product.lock_in_months == 0:
                res.suitability_score = min(100.0, res.suitability_score + 15.0)
                res.pros.append("High liquidity perfectly matches your Emergency Fund goal")
            elif goal == "emergency_fund" and product.lock_in_months > 0:
                res.suitability_score = max(0.0, res.suitability_score - 30.0)
                from ..models.evaluation import PenaltyItem
                res.penalties.append(PenaltyItem(title="Goal Conflict", penalty_points=30, reason="Lock-in periods defeat the purpose of an emergency fund", severity="critical"))
            
            if goal == "wealth_growth" and product.category == "investment":
                res.suitability_score = min(100.0, res.suitability_score + 10.0)
                res.pros.append("Category aligns with long-term wealth creation")
                
            if goal == "vehicle_purchase" and product.category == "loan":
                res.pros.append("Category aligns with capital acquisition goal")

            # Determine Recommendation Status
            if res.suitability_score < 40 or any(p.severity == "critical" for p in res.penalties):
                res.is_recommended = False
                res.fit_tier = "Unsuitable"
            elif res.suitability_score < 60:
                res.is_recommended = True
                res.fit_tier = "Moderate Fit"
            elif res.suitability_score < 80:
                res.is_recommended = True
                res.fit_tier = "Good Fit"
            else:
                res.is_recommended = True
                res.fit_tier = "Excellent Match"
                
            # Match Strength
            if res.fit_tier == "Excellent Match":
                res.match_strength = "Strong match"
            elif res.fit_tier in ["Good Fit", "Moderate Fit"]:
                res.match_strength = "Moderate match"
            else:
                res.match_strength = "Limited match"
                
            # Scenario Analysis & Inflation & Tax
            if product.category == "investment" or product.category == "savings":
                horizon_yrs = profile.target_horizon_months / 12.0
                rate = product.headline_rate / 100.0
                base_amt = profile.target_amount
                
                # Simple compounding FV
                base_fv = base_amt * ((1 + rate) ** horizon_yrs)
                opt_fv = base_amt * ((1 + rate * 1.15) ** horizon_yrs)
                cons_fv = base_amt * ((1 + rate * 0.85) ** horizon_yrs)
                
                res.scenarios = {
                    "Conservative": f"₹{cons_fv:,.0f}",
                    "Base case": f"₹{base_fv:,.0f}",
                    "Optimistic": f"₹{opt_fv:,.0f}"
                }
                
                # Inflation adjustment (assuming 6% inflation)
                inflation_rate = 0.06
                purchasing_power = base_fv / ((1 + inflation_rate) ** horizon_yrs)
                res.inflation_adjusted_base = f"₹{purchasing_power:,.0f}"
                
                # Tax estimation
                if product.tax_status == "taxable":
                    tax_rate = 0.30
                    gain = base_fv - base_amt
                    if gain > 0:
                        tax_amt = gain * tax_rate
                        res.tax_outcome = f"Estimated post-tax outcome: ₹{(base_fv - tax_amt):,.0f} (assuming 30% bracket)"
                elif product.tax_status == "ltcg_applicable":
                    tax_rate = 0.125 # ~12.5% LTCG in India
                    gain = base_fv - base_amt
                    if gain > 100000:
                        tax_amt = (gain - 100000) * tax_rate
                        res.tax_outcome = f"Estimated post-tax outcome: ₹{(base_fv - tax_amt):,.0f} (assuming 12.5% LTCG > 1L)"
                else:
                    res.tax_outcome = "Tax exempt under current assumptions"
                    
                res.assumptions = [
                    f"Investment period: {horizon_yrs:.1f} years",
                    f"Illustrative return: {product.headline_rate}%",
                    "Illustrative inflation assumption: 6% annually",
                    "Illustrative tax treatment; actual tax may vary."
                ]
            else:
                # Loans
                res.scenarios = {}
                res.tax_outcome = "Tax not estimated"
                res.assumptions = [
                    f"Repayment horizon: {profile.target_horizon_months} months",
                    f"Interest rate: {product.headline_rate}%"
                ]

            # Attach natural language explanation
            res.ai_narrative = ExplanationEngine.synthesize_product_explanation(res, profile, risk_analysis)
            results.append(res)

            
        # 3. Sort by suitability score descending
        results.sort(key=lambda x: x.suitability_score, reverse=True)
        
        # 4. Assign ranks
        for idx, r in enumerate(results, start=1):
            r.rank = idx
            
        return results

    @staticmethod
    def compare_selected_products(
        profile: UserProfile,
        product_ids: List[str]
    ) -> ComparisonMatrix:
        risk_analysis = RiskCapacityEngine.evaluate(profile)
        
        selected_products: List[Product] = []
        for pid in product_ids:
            prod = get_product_by_id(pid)
            if prod:
                selected_products.append(prod)
                
        results = SuitabilityEngine.evaluate_products_for_profile(profile, selected_products)
        
        # Detect key trade-offs between compared options
        tradeoffs: List[str] = []
        if len(results) >= 2:
            p1, p2 = results[0], results[1]
            if p1.product.category == "loan":
                cost1 = p1.secondary_cost_impact.get("total_cost_over_horizon", 0)
                cost2 = p2.secondary_cost_impact.get("total_cost_over_horizon", 0)
                diff_cost = abs(cost1 - cost2)
                tradeoffs.append(f"Cost Delta: {p1.product.name} costs ₹{diff_cost:,.0f} less than {p2.product.name} over your {profile.target_horizon_months}-month horizon.")
                if p1.product.prepayment_penalty_pct < p2.product.prepayment_penalty_pct:
                    tradeoffs.append(f"Prepayment Flexibility: {p1.product.name} charges {p1.product.prepayment_penalty_pct}% foreclosure vs {p2.product.prepayment_penalty_pct}% on {p2.product.name}.")
            elif p1.product.category == "investment":
                tradeoffs.append(f"Volatility Trade-off: {p1.product.name} ({p1.product.risk_level.upper()} risk) provides superior downside protection compared to {p2.product.name} ({p2.product.risk_level.upper()} risk).")
                tradeoffs.append(f"Fee Efficiency: {p1.product.name} expense drag is {p1.product.expense_ratio_pct}% vs {p2.product.expense_ratio_pct}% for {p2.product.name}.")
                
        matrix = ComparisonMatrix(
            user_profile=profile,
            risk_analysis=risk_analysis,
            results=results,
            key_tradeoffs=tradeoffs,
            verdict=""
        )
        matrix.verdict = ExplanationEngine.synthesize_comparison_verdict(matrix)
        return matrix
