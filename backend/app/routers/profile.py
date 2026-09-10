from fastapi import APIRouter
from ..models.user import UserProfile
from ..models.evaluation import RiskCapacityAnalysis
from ..engine.risk_engine import RiskCapacityEngine

router = APIRouter(prefix="/api/profile", tags=["Profile & Risk"])

@router.post("/analyze-risk", response_model=RiskCapacityAnalysis)
def analyze_user_risk(profile: UserProfile):
    """Deterministically analyze user's cash-flow surplus, emergency runway, derived risk capacity, and tolerance conflicts."""
    return RiskCapacityEngine.evaluate(profile)
