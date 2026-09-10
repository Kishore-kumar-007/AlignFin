from pydantic import BaseModel, Field
from typing import Literal, Optional, List, Dict, Any
from .evidence import EvidenceItem

class Product(BaseModel):
    id: str
    name: str
    provider: str
    category: Literal["loan", "investment", "savings"]
    headline_rate: float = Field(description="Headline interest rate or expected CAGR in % p.a.")
    headline_label: str = Field(description="Formatted label, e.g., '8.5% p.a.' or '12.4% CAGR'")
    min_amount: float
    max_amount: float
    min_tenure_months: Optional[int] = 12
    max_tenure_months: Optional[int] = 84
    lock_in_months: int = Field(default=0, description="Mandatory lock-in period in months")
    
    # Secondary & non-headline costs
    processing_fee_flat: float = Field(default=0.0, description="Flat processing or setup charge in INR")
    processing_fee_pct: float = Field(default=0.0, description="Processing fee % on total amount")
    prepayment_penalty_pct: float = Field(default=0.0, description="Foreclosure / Prepayment penalty %")
    exit_load_pct: float = Field(default=0.0, description="Early redemption exit load %")
    expense_ratio_pct: float = Field(default=0.0, description="Annual maintenance / management fee %")
    
    # Risk & Liquidity attributes
    risk_level: Literal["low", "moderate", "high"] = "moderate"
    liquidity_rating: Literal["low", "medium", "high"] = "medium"
    tax_status: Optional[str] = "taxable" # e.g., 'taxable', 'exempt_80c', 'ltcg_applicable'
    
    # Qualitative insights & terms
    key_features: List[str] = Field(default_factory=list)
    secondary_conditions: List[str] = Field(default_factory=list)
    badge: Optional[str] = None # e.g. "Headline Bait", "Flexi Choice", "Safe Anchor"
    
    # Evidence Tracking (Document Intelligence)
    evidence_map: Dict[str, EvidenceItem] = Field(default_factory=dict, description="Maps field names to their extraction evidence")
    evidence_coverage_pct: float = Field(default=0.0, description="Percentage of key fields backed by evidence")
