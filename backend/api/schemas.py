from pydantic import BaseModel
from typing import List, Optional

class DetectedPattern(BaseModel):
    name: str
    explanation: str
    technical: Optional[str] = None

class AnalysisResponse(BaseModel):
    prediction: str
    confidence: float
    confidence_level: str
    ai_explanation: str
    detected_patterns: List[DetectedPattern]
    recommendation: str
    processing_time_ms: int
