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
