from fastapi import APIRouter
from typing import List
from ..database.seed_data import DEMO_PERSONAS
from ..models.user import Persona

router = APIRouter(prefix="/api/personas", tags=["Personas"])

@router.get("", response_model=List[Persona])
def get_demo_personas():
    """Retrieve pre-baked demo personas representing key hackathon evaluation scenarios."""
    return [Persona(**p) for p in DEMO_PERSONAS]
