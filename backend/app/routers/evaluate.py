from fastapi import APIRouter
from typing import List
from ..models.user import UserProfile
from ..models.evaluation import SuitabilityResult, ComparisonMatrix, CompareRequest
from ..engine.suitability_engine import SuitabilityEngine

router = APIRouter(prefix="/api/evaluate", tags=["Suitability Evaluation"])

@router.post("/recommendations", response_model=List[SuitabilityResult])
def get_recommendations(profile: UserProfile):
    """Evaluate and rank all financial products in the user's category of interest with full score breakdowns."""
    return SuitabilityEngine.evaluate_products_for_profile(profile)

@router.post("/compare", response_model=ComparisonMatrix)
def compare_products(request: CompareRequest):
    """Generate deep head-to-head comparison matrix, cash-flow projections, and explainable verdict for 2-3 products."""
    return SuitabilityEngine.compare_selected_products(request.profile, request.product_ids)
