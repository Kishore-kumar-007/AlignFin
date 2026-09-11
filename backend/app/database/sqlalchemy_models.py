import json
from sqlalchemy import Column, String, Float, Integer, Text, DateTime, func, JSON
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class ProductModel(Base):
    __tablename__ = "products"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    category = Column(String, nullable=False)
    headline_rate = Column(Float, nullable=False)
    headline_label = Column(String, nullable=False)
    min_amount = Column(Float, nullable=False)
    max_amount = Column(Float, nullable=False)
    min_tenure_months = Column(Integer, default=12)
    max_tenure_months = Column(Integer, default=84)
    lock_in_months = Column(Integer, default=0)
    processing_fee_flat = Column(Float, default=0)
    processing_fee_pct = Column(Float, default=0)
    prepayment_penalty_pct = Column(Float, default=0)
    exit_load_pct = Column(Float, default=0)
    expense_ratio_pct = Column(Float, default=0)
    risk_level = Column(String, nullable=False)
    liquidity_rating = Column(String, nullable=False)
    tax_status = Column(String, default="taxable")
    
    key_features = Column(JSON, default=list)
    secondary_conditions = Column(JSON, default=list)
    badge = Column(String, nullable=True)
    evidence_json = Column(JSON, default=dict)
    evidence_coverage_pct = Column(Float, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class UserModel(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    profile_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
