from pydantic import BaseModel, Field
from typing import Literal, Optional, List, Dict, Any

class UserProfile(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = "Demo User"
    age: int = Field(default=24, ge=18, le=100, description="Age in years")
    monthly_income: float = Field(default=35000.0, gt=0, description="Monthly in-hand income in INR")
    monthly_expenses: float = Field(default=25000.0, ge=0, description="Monthly fixed & living expenses in INR")
    existing_debt_emi: float = Field(default=2000.0, ge=0, description="Existing monthly debt / EMI obligations in INR")
    current_savings: float = Field(default=75000.0, ge=0, description="Current liquid savings / emergency fund in INR")
    
    # Financial Goals & Requirements
    financial_goal: str = Field(default="vehicle_purchase", description="Goal: vehicle_purchase, emergency_fund, wealth_growth, education, etc.")
    category_interest: Literal["loan", "investment", "savings"] = "loan"
    target_amount: float = Field(default=200000.0, gt=0, description="Required principal or investment sum in INR")
    target_horizon_months: int = Field(default=36, gt=0, description="Planned timeline or holding/repayment horizon in months")
    
    # Subjective Preferences
    risk_tolerance: Literal["low", "moderate", "high"] = Field(default="moderate", description="Psychological willingness to accept risk")
    liquidity_importance: Literal["low", "medium", "high"] = Field(default="medium", description="Priority on instant penalty-free liquidity")
    prepayment_preference: Literal["unlikely", "possible", "very_likely"] = Field(default="very_likely", description="Likelihood of early prepayment or early exit")

class Persona(BaseModel):
    id: str
    name: str
    tagline: str
    description: str
    category: Literal["loan", "investment", "savings"]
    scenario_focus: str
    profile: UserProfile
