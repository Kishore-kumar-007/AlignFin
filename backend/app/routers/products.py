from fastapi import APIRouter, Query
from typing import List, Optional
from ..models.product import Product
from ..database.db import get_all_products, get_product_by_id

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("", response_model=List[Product])
def list_products(category: Optional[str] = Query(None, description="Filter by loan, investment, or savings")):
    """Get all curated financial products in the catalog with optional category filter."""
    return get_all_products(category=category)

@router.get("/{product_id}", response_model=Product)
def get_product(product_id: str):
    """Retrieve detailed terms for a specific financial product."""
    prod = get_product_by_id(product_id)
    if not prod:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
    return prod
