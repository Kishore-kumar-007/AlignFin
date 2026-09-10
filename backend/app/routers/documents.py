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
    filename = file.filename.lower()
    allowed_exts = ['.pdf', '.txt', '.docx', '.doc', '.png', '.jpg', '.jpeg', '.webp']
    if not any(filename.endswith(ext) for ext in allowed_exts):
        raise HTTPException(status_code=400, detail="Unsupported file format.")
        
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file")
        
    try:
        if filename.endswith('.pdf') or filename.endswith('.txt'):
            product = DocumentIntelligenceEngine.extract_product_from_document(content, file.filename)
            raw_text = DocumentIntelligenceEngine.extract_text(content, file.filename)
            preview = raw_text[:500] + "..." if len(raw_text) > 500 else raw_text
            return ExtractionResponse(product=product, raw_text_preview=preview)
        else:
            raise ValueError(f"OCR and complex extraction for {filename.split('.')[-1]} are currently restricted in the production deployment environment.")
    except ValueError as ve:
        raise HTTPException(status_code=415, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")
