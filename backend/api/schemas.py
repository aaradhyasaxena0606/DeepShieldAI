# VoiceGuard AI - Pydantic Response Schemas
# Define Pydantic models: DetectedPattern(name, explanation, technical), AnalysisResponse(prediction, confidence, confidence_level, ai_explanation, detected_patterns, recommendation, processing_time_ms)
# Add validators: prediction must be "fake" or "real", confidence must be 0-1 float

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
    error_details: Optional[str] = None
    # Indicates whether the backend returned a placeholder prediction
    # because the real ML model or TensorFlow was unavailable. When True,
    # the client should treat confidence scores as non-production and
    # optionally surface a warning to the user.
    used_placeholder: Optional[bool] = False
