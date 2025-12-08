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
print("[Routes] Attempting to initialize ModelService...")
try:
    model_service = ModelService()
    MODEL_SERVICE_AVAILABLE = True
    print("[Routes] SUCCESS: ModelService initialized")
except Exception as e:
    print(f"[Routes] ERROR: Model service initialization failed!")
    print(f"[Routes] Exception type: {type(e).__name__}")
    print(f"[Routes] Exception message: {e}")
    import traceback
    print(f"[Routes] Full traceback:")
    traceback.print_exc()
    MODEL_SERVICE_AVAILABLE = False
    model_service = None

print("[Routes] Attempting to initialize RAGService...")
try:
    rag_service = RAGService()
    print("[Routes] SUCCESS: RAGService initialized")
except Exception as e:
    print(f"[Routes] ERROR: RAG service initialization failed: {e}")
    import traceback
    traceback.print_exc()
    rag_service = None

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze(file: UploadFile = File(...)):
    print(f"[Analyze] Received file: {file.filename}, content_type: {file.content_type}")
    
    if file.content_type not in ("audio/wav", "audio/x-wav", "audio/mpeg"):
        print(f"[Analyze] ERROR: Unsupported file type: {file.content_type}")
        raise HTTPException(status_code=400, detail="Unsupported file type")
    
    # Check if model service is available
    if not MODEL_SERVICE_AVAILABLE:
        error_msg = "ML model service unavailable. TensorFlow not installed or model not found. Please contact system administrator."
        print(f"[Analyze] ERROR: {error_msg}")
        raise HTTPException(status_code=503, detail=error_msg)
    
    try:
        print("[Analyze] Reading file data...")
        data = await file.read()
        print(f"[Analyze] File read successfully, size: {len(data)} bytes")
        
        print("[Analyze] Extracting audio features...")
        features = extract_features(data)
        print(f"[Analyze] Features extracted successfully")

        print("[Analyze] Running model prediction...")
        prediction_label, confidence, raw_vector = model_service.predict(features)
        used_placeholder = getattr(model_service, '_allow_placeholder', False)
        print(f"[Analyze] Prediction result: label={prediction_label}, confidence={confidence}")

        print("[Analyze] Getting RAG explanation...")
        rag = rag_service.explain(prediction_label, confidence, features)
        print(f"[Analyze] RAG explanation generated")

        # Add error details if Gemini is not initialized
        error_details = None
        if not rag_service.initialized:
            error_details = "Gemini API not initialized. Please check API key configuration."
            print(f"[Analyze] WARNING: {error_details}")
        elif rag["ai_explanation"] == "Unable to generate detailed explanation at this time.":
            error_details = "Gemini API request failed. Please check logs for details."
            print(f"[Analyze] WARNING: {error_details}")

        print("[Analyze] SUCCESS: Analysis completed")
        return AnalysisResponse(
            prediction=prediction_label,
            confidence=confidence,
            confidence_level=rag["confidence_level"],
            ai_explanation=rag["ai_explanation"],
            detected_patterns=rag["detected_patterns"],
            recommendation=rag["recommendation"],
            processing_time_ms=rag.get("processing_time_ms", 0),
            error_details=error_details,
            used_placeholder=used_placeholder,
        )
    except Exception as e:
        error_msg = f"Analysis failed: {str(e)}"
        print(f"[Analyze] ERROR: {error_msg}")
        print(f"[Analyze] Exception type: {type(e).__name__}")
        import traceback
        print("[Analyze] Full traceback:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=error_msg)