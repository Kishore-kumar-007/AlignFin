import fitz  # PyMuPDF
from typing import Dict, Any, List
import uuid
from ..models.product import Product
from ..models.evidence import EvidenceItem, EvidenceStatus

class DocumentIntelligenceEngine:
    """
    Extracts unstructured data from PDFs and maps them to structured Product schema
    using mock/heuristic extraction (representing LLM capabilities in MVP).
    """

    @staticmethod
    def extract_text_from_pdf(pdf_bytes: bytes) -> str:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = ""
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text += f"\n--- Page {page_num + 1} ---\n"
            text += page.get_text()
        return text

    @staticmethod
    def extract_product_from_pdf(pdf_bytes: bytes, filename: str) -> Product:
        """
        Parses a PDF and returns a structured Product with evidence map.
        For MVP, we use heuristic parsing on the raw text to simulate LLM extraction.
        """
        text = DocumentIntelligenceEngine.extract_text_from_pdf(pdf_bytes)
        text_lower = text.lower()
        
        # Mocking an LLM extraction output based on heuristics in text
        # In a full implementation, `text` would be passed to `google-genai` 
        # to return structured JSON matching our `Product` schema.
        
        is_loan = "loan" in text_lower or "borrow" in text_lower or "emi" in text_lower
        is_investment = "fund" in text_lower or "cagr" in text_lower or "nav" in text_lower
        is_savings = "deposit" in text_lower or "fd" in text_lower or "savings" in text_lower
        
        category = "loan"
        if is_investment: category = "investment"
        elif is_savings: category = "savings"

        # Mock defaults
        product_dict: Dict[str, Any] = {
            "id": f"ext_{uuid.uuid4().hex[:8]}",
            "name": filename.replace(".pdf", "").replace("_", " ").title(),
            "provider": "Extracted Provider",
            "category": category,
            "min_amount": 10000,
            "max_amount": 5000000,
            "risk_level": "moderate",
            "liquidity_rating": "medium",
            "key_features": ["Extracted from Document"],
            "secondary_conditions": [],
            "evidence_map": {}
        }
        
        # Simple extraction heuristics (Mocking LLM)
        if category == "loan":
            product_dict["headline_rate"] = 10.5
            product_dict["headline_label"] = "10.5% p.a."
            product_dict["lock_in_months"] = 0
            
            # Prepayment penalty check
            if "prepayment penalty" in text_lower or "foreclosure" in text_lower:
                product_dict["prepayment_penalty_pct"] = 2.0
                product_dict["evidence_map"]["prepayment_penalty_pct"] = EvidenceItem(
                    value=2.0, unit="%", source_page=1, source_section="Terms & Conditions", status=EvidenceStatus.FOUND
                )
            else:
                product_dict["evidence_map"]["prepayment_penalty_pct"] = EvidenceItem(
                    value=None, status=EvidenceStatus.NOT_FOUND
                )
                
            # Processing fee check
            if "processing fee" in text_lower:
                product_dict["processing_fee_pct"] = 1.5
                product_dict["evidence_map"]["processing_fee_pct"] = EvidenceItem(
                    value=1.5, unit="%", source_page=1, source_section="Fees", status=EvidenceStatus.FOUND
                )
            else:
                product_dict["evidence_map"]["processing_fee_pct"] = EvidenceItem(
                    value=None, status=EvidenceStatus.NOT_FOUND
                )

        elif category == "investment":
            product_dict["headline_rate"] = 12.0
            product_dict["headline_label"] = "12.0% expected CAGR"
            product_dict["lock_in_months"] = 36 if "elss" in text_lower else 0
            
            if "expense ratio" in text_lower or "management fee" in text_lower:
                product_dict["expense_ratio_pct"] = 1.0
                product_dict["evidence_map"]["expense_ratio_pct"] = EvidenceItem(
                    value=1.0, unit="%", source_page=1, status=EvidenceStatus.FOUND
                )
            else:
                product_dict["evidence_map"]["expense_ratio_pct"] = EvidenceItem(
                    value=None, status=EvidenceStatus.NOT_FOUND
                )
                
            if "exit load" in text_lower:
                product_dict["exit_load_pct"] = 1.0
                product_dict["evidence_map"]["exit_load_pct"] = EvidenceItem(
                    value=1.0, unit="%", source_page=1, status=EvidenceStatus.FOUND
                )
            else:
                product_dict["evidence_map"]["exit_load_pct"] = EvidenceItem(
                    value=None, status=EvidenceStatus.NOT_FOUND
                )

        else: # savings
            product_dict["headline_rate"] = 7.0
            product_dict["headline_label"] = "7.0% guaranteed"
            product_dict["lock_in_months"] = 12
            
            if "penalty" in text_lower or "premature" in text_lower:
                product_dict["prepayment_penalty_pct"] = 1.0
                product_dict["evidence_map"]["prepayment_penalty_pct"] = EvidenceItem(
                    value=1.0, unit="%", source_page=1, status=EvidenceStatus.FOUND
                )
            else:
                product_dict["evidence_map"]["prepayment_penalty_pct"] = EvidenceItem(
                    value=None, status=EvidenceStatus.NOT_FOUND
                )
                
            product_dict["evidence_map"]["lock_in_months"] = EvidenceItem(
                value=12, unit="months", source_page=1, status=EvidenceStatus.FOUND
            )

        return Product(**product_dict)
