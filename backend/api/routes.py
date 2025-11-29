# VoiceGuard AI - API Routes Module
# Create APIRouter, define POST /analyze endpoint accepting UploadFile
# Workflow: Validate file → Save temp file → Call audio_processor.process() → Call model_service.predict()
# → Call rag_service.get_explanation() → Return JSON response with prediction, confidence, explanation, patterns
# Add error handling: 400 for invalid file, 500 for processing errors, 413 for file too large

from fastapi import APIRouter, UploadFile, File, HTTPException
from services.audio_processor import extract_features
from services.model_service import ModelService
from services.rag_service import RAGService
from api.schemas import AnalysisResponse

router = APIRouter()
model_service = ModelService()
rag_service = RAGService()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze(file: UploadFile = File(...)):
    if file.content_type not in ("audio/wav", "audio/x-wav", "audio/mpeg"):
        raise HTTPException(status_code=400, detail="Unsupported file type")
    data = await file.read()
    features = extract_features(data)
    prediction_label, confidence, raw_vector = model_service.predict(features)
    rag = rag_service.explain(prediction_label, confidence, features)
    return AnalysisResponse(
        prediction=prediction_label,
        confidence=confidence,
        confidence_level=rag["confidence_level"],
        ai_explanation=rag["ai_explanation"],
        detected_patterns=rag["detected_patterns"],
        recommendation=rag["recommendation"],
        processing_time_ms=rag.get("processing_time_ms", 0)
    )
