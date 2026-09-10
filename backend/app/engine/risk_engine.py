from typing import Literal, List
from ..models.user import UserProfile
from ..models.evaluation import RiskCapacityAnalysis

class RiskCapacityEngine:
    """
    Financial Buffer & Solvency Index (FBSI)
    Deterministically evaluates a user's objective financial capacity to absorb risk,
    and identifies conflicts with subjective self-declared risk tolerance.
    """
    
    @staticmethod
    def evaluate(profile: UserProfile) -> RiskCapacityAnalysis:
        income = profile.monthly_income
        expenses = profile.monthly_expenses
        debt = profile.existing_debt_emi
        savings = profile.current_savings
        tolerance = profile.risk_tolerance
        
        # Core Financial Ratios
        monthly_surplus = income - (expenses + debt)
        surplus_ratio = (monthly_surplus / income) * 100 if income > 0 else 0
        dti_pct = (debt / income) * 100 if income > 0 else 0
        runway_months = (savings / expenses) if expenses > 0 else 99.0
        
        # Deterministic Rules for Risk Capacity
        capacity_factors: List[str] = []
        
        if runway_months < 3.0:
            capacity_factors.append(f"Emergency runway is critically thin ({runway_months:.1f} months of expenses vs 3-6 mo benchmark)")
        else:
            capacity_factors.append(f"Emergency buffer provides {runway_months:.1f} months of liquidity runway")
            
        if surplus_ratio < 15.0:
            capacity_factors.append(f"Discretionary monthly surplus is tight ({surplus_ratio:.1f}% of income)")
        elif surplus_ratio > 35.0:
            capacity_factors.append(f"Strong monthly cash-flow surplus ({surplus_ratio:.1f}% of income)")
        else:
            capacity_factors.append(f"Moderate monthly cash-flow surplus ({surplus_ratio:.1f}% of income)")
            
        if dti_pct > 40.0:
            capacity_factors.append(f"High existing debt burden with DTI at {dti_pct:.1f}%")
            
        # Classify Derived Capacity
        if runway_months < 3.0 or surplus_ratio < 15.0 or dti_pct > 45.0:
            derived_capacity: Literal["low", "moderate", "high"] = "low"
        elif runway_months >= 6.0 and surplus_ratio >= 35.0 and dti_pct <= 25.0:
            derived_capacity = "high"
        else:
            derived_capacity = "moderate"
            
        # Conflict Detection (Tolerance vs Capacity)
        tolerance_weight = {"low": 1, "moderate": 2, "high": 3}[tolerance]
        capacity_weight = {"low": 1, "moderate": 2, "high": 3}[derived_capacity]
        
        risk_mismatch = False
        conflict_severity: Literal["none", "mild", "critical"] = "none"
        analysis_narrative = ""
        
        if tolerance_weight > capacity_weight:
            # Over-optimistic user (Wants high risk, but has low buffer)
            risk_mismatch = True
            diff = tolerance_weight - capacity_weight
            if diff >= 2:
                conflict_severity = "critical"
                analysis_narrative = (
                    f"CRITICAL RISK MISMATCH: You declared '{tolerance.upper()}' risk tolerance, "
                    f"but your financial buffer yields 'LOW' risk capacity ({runway_months:.1f} months emergency runway, "
                    f"₹{monthly_surplus:,.0f}/mo surplus). High-volatility products create severe vulnerability to capital loss."
                )
            else:
                conflict_severity = "mild"
                analysis_narrative = (
                    f"CAUTION RISK MISMATCH: Stated tolerance is '{tolerance}', but financial capacity is '{derived_capacity}'. "
                    f"High market exposure should be moderated with liquid hedges."
                )
        elif tolerance_weight < capacity_weight:
            # Over-conservative user (Has high buffer, but fears normal market volatility)
            risk_mismatch = False
            conflict_severity = "none"
            analysis_narrative = (
                f"Conservative stance noted. Your strong financial buffer ({runway_months:.1f} months runway, "
                f"₹{monthly_surplus:,.0f}/mo surplus) can safely support higher growth, but recommendations will strictly respect your capital preservation preference."
            )
        else:
            risk_mismatch = False
            conflict_severity = "none"
            analysis_narrative = (
                f"Optimal Alignment: Stated risk tolerance ({tolerance.upper()}) matches your financial buffer capacity ({derived_capacity.upper()})."
            )
            
        return RiskCapacityAnalysis(
            monthly_surplus=round(monthly_surplus, 2),
            surplus_ratio_pct=round(surplus_ratio, 1),
            debt_to_income_pct=round(dti_pct, 1),
            emergency_runway_months=round(runway_months, 1),
            stated_risk_tolerance=tolerance,
            derived_risk_capacity=derived_capacity,
            risk_mismatch_detected=risk_mismatch,
            conflict_severity=conflict_severity,
            analysis_narrative=analysis_narrative,
            capacity_factors=capacity_factors
        )
