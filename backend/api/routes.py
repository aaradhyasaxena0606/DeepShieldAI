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

# Try to initialize services
try:
    model_service = ModelService()
    MODEL_SERVICE_AVAILABLE = True
except Exception as e:
    print(f"Model service initialization failed: {e}")
    MODEL_SERVICE_AVAILABLE = False
    model_service = None

rag_service = RAGService()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze(file: UploadFile = File(...)):
    if file.content_type not in ("audio/wav", "audio/x-wav", "audio/mpeg"):
        raise HTTPException(status_code=400, detail="Unsupported file type")
    
    # Check if model service is available
    if not MODEL_SERVICE_AVAILABLE:
        raise HTTPException(
            status_code=503, 
            detail="ML model service unavailable. TensorFlow not installed or model not found. Please contact system administrator."
        )
    
    try:
        data = await file.read()
        features = extract_features(data)
        prediction_label, confidence, raw_vector = model_service.predict(features)
        rag = rag_service.explain(prediction_label, confidence, features)
        
        # Add error details if Gemini is not initialized
        error_details = None
        if not rag_service.initialized:
            error_details = "Gemini API not initialized. Please check API key configuration."
        elif rag["ai_explanation"] == "Unable to generate detailed explanation at this time.":
            error_details = "Gemini API request failed. Please check logs for details."
        
        return AnalysisResponse(
            prediction=prediction_label,
            confidence=confidence,
            confidence_level=rag["confidence_level"],
            ai_explanation=rag["ai_explanation"],
            detected_patterns=rag["detected_patterns"],
            recommendation=rag["recommendation"],
            processing_time_ms=rag.get("processing_time_ms", 0),
            error_details=error_details
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )