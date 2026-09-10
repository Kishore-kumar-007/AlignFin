from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from ..engine.document_intelligence import DocumentIntelligenceEngine
from ..models.product import Product

router = APIRouter(prefix="/api/documents", tags=["documents"])

class ExtractionResponse(BaseModel):
    product: Product
    raw_text_preview: str

@router.post("/extract", response_model=ExtractionResponse)
async def extract_document(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file")
        
    try:
        # Extract to structured product
        product = DocumentIntelligenceEngine.extract_product_from_pdf(content, file.filename)
        
        # Get raw text for preview
        raw_text = DocumentIntelligenceEngine.extract_text_from_pdf(content)
        preview = raw_text[:500] + "..." if len(raw_text) > 500 else raw_text
        
        return ExtractionResponse(product=product, raw_text_preview=preview)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")
