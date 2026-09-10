from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional, Union

class EvidenceStatus(str, Enum):
    FOUND = "FOUND"
    NOT_FOUND = "NOT_FOUND"
    AMBIGUOUS = "AMBIGUOUS"
    NOT_APPLICABLE = "NOT_APPLICABLE"

class EvidenceItem(BaseModel):
    value: Union[str, float, int, bool, None] = Field(description="The extracted value")
    unit: Optional[str] = Field(default=None, description="The unit of the value, e.g., '%', 'USD', 'Months'")
    source_page: Optional[int] = Field(default=None, description="The page number where evidence was found (1-indexed)")
    source_section: Optional[str] = Field(default=None, description="The section or paragraph heading")
    status: EvidenceStatus = Field(default=EvidenceStatus.NOT_FOUND, description="Status of the extraction")

class EvidenceCoverage(BaseModel):
    total_required: int
    found: int
    coverage_pct: float
