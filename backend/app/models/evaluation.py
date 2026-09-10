from pydantic import BaseModel, Field
from typing import Literal, Optional, List, Dict, Any
from .product import Product
from .user import UserProfile

class RiskCapacityAnalysis(BaseModel):
    monthly_surplus: float
    surplus_ratio_pct: float
    debt_to_income_pct: float
    emergency_runway_months: float
    stated_risk_tolerance: Literal["low", "moderate", "high"]
    derived_risk_capacity: Literal["low", "moderate", "high"]
    risk_mismatch_detected: bool
    conflict_severity: Literal["none", "mild", "critical"]
    analysis_narrative: str
    capacity_factors: List[str]

class ScoreDimension(BaseModel):
    dimension: str
    label: str
    weight: float
    raw_score: float # 0 to 100
    weighted_score: float
    description: str

class PenaltyItem(BaseModel):
    title: str
    penalty_points: float
    reason: str
    severity: Literal["info", "warning", "critical"]

class CashFlowPoint(BaseModel):
    month: int
    cumulative_cost_or_value: float
    principal_paid: Optional[float] = None
    interest_or_gain: Optional[float] = None

class SuitabilityResult(BaseModel):
    product: Product
    suitability_score: float # 0 to 100
    rank: int = 1
    fit_tier: Literal["Excellent Match", "Good Fit", "Moderate Fit", "Caution / Conflict", "Unsuitable"]
    risk_capacity: Literal["low", "moderate", "high"]
    risk_mismatch: bool
    score_breakdown: List[ScoreDimension]
    penalties: List[PenaltyItem]
    pros: List[str]
    cons: List[str]
    secondary_cost_impact: Dict[str, Any]
    cash_flow_simulation: List[CashFlowPoint]
    reasoning_trace: List[str]
    ai_narrative: Optional[str] = None

class ComparisonMatrix(BaseModel):
    user_profile: UserProfile
    risk_analysis: RiskCapacityAnalysis
    results: List[SuitabilityResult]
    key_tradeoffs: List[str]
    verdict: str

class CompareRequest(BaseModel):
    profile: UserProfile
    product_ids: List[str]
