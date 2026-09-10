import os
import json
from typing import List, Optional
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .sqlalchemy_models import Base, ProductModel, UserModel
from ..models.product import Product
from .seed_data import SEED_PRODUCTS

# Automatically switch to Postgres if DATABASE_URL is provided (e.g., Render)
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///alignfin.db")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    # Seed products if empty
    count = db.query(ProductModel).count()
    if count == 0:
        for p in SEED_PRODUCTS:
            db_prod = ProductModel(
                id=p["id"],
                name=p["name"],
                provider=p["provider"],
                category=p["category"],
                headline_rate=p["headline_rate"],
                headline_label=p["headline_label"],
                min_amount=p["min_amount"],
                max_amount=p["max_amount"],
                min_tenure_months=p.get("min_tenure_months", 12),
                max_tenure_months=p.get("max_tenure_months", 84),
                lock_in_months=p.get("lock_in_months", 0),
                processing_fee_flat=p.get("processing_fee_flat", 0.0),
                processing_fee_pct=p.get("processing_fee_pct", 0.0),
                prepayment_penalty_pct=p.get("prepayment_penalty_pct", 0.0),
                exit_load_pct=p.get("exit_load_pct", 0.0),
                expense_ratio_pct=p.get("expense_ratio_pct", 0.0),
                risk_level=p["risk_level"],
                liquidity_rating=p["liquidity_rating"],
                tax_status=p.get("tax_status", "taxable"),
                key_features=p.get("key_features", []),
                secondary_conditions=p.get("secondary_conditions", []),
                badge=p.get("badge"),
                evidence_json={},
                evidence_coverage_pct=0.0
            )
            db.add(db_prod)
        db.commit()
    db.close()

def _to_pydantic_product(p: ProductModel) -> Product:
    return Product(
        id=p.id,
        name=p.name,
        provider=p.provider,
        category=p.category,
        headline_rate=p.headline_rate,
        headline_label=p.headline_label,
        min_amount=p.min_amount,
        max_amount=p.max_amount,
        min_tenure_months=p.min_tenure_months,
        max_tenure_months=p.max_tenure_months,
        lock_in_months=p.lock_in_months,
        processing_fee_flat=p.processing_fee_flat,
        processing_fee_pct=p.processing_fee_pct,
        prepayment_penalty_pct=p.prepayment_penalty_pct,
        exit_load_pct=p.exit_load_pct,
        expense_ratio_pct=p.expense_ratio_pct,
        risk_level=p.risk_level,
        liquidity_rating=p.liquidity_rating,
        tax_status=p.tax_status,
        key_features=p.key_features or [],
        secondary_conditions=p.secondary_conditions or [],
        badge=p.badge,
        evidence_map=p.evidence_json or {}
    )

def get_all_products(category: Optional[str] = None) -> List[Product]:
    db = SessionLocal()
    query = db.query(ProductModel)
    if category:
        query = query.filter(ProductModel.category == category)
    rows = query.all()
    db.close()
    return [_to_pydantic_product(r) for r in rows]

def get_product_by_id(product_id: str) -> Optional[Product]:
    db = SessionLocal()
    row = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    db.close()
    if not row:
        return None
    return _to_pydantic_product(row)
