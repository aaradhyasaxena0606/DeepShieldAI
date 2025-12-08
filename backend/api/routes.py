# VoiceGuard AI - API Routes Module
# Create APIRouter, define POST /analyze endpoint accepting UploadFile
# Workflow: Validate file → Save temp file → Call audio_processor.process() → Call model_service.predict()
# → Call rag_service.get_explanation() → Return JSON response with prediction, confidence, explanation, patterns
# Add error handling: 400 for invalid file, 500 for processing errors, 413 for file too large

from fastapi import APIRouter, UploadFile, File, HTTPException
from services.audio_processor import extract_features
from services.model_service import ModelService
from services.rag_service import RAGService
from services.video_processor import extract_audio_from_video
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
        mel = features.get('mel_spectrogram')
        try:
            shape = getattr(mel, 'shape', None)
            print(f"[Analyze] Features extracted successfully. mel_spectrogram shape: {shape}")
        except Exception:
            print("[Analyze] Features extracted successfully. mel_spectrogram shape: unknown")

        print("[Analyze] Running model prediction...")
        prediction_label, confidence, raw_vector = model_service.predict(features)
        used_placeholder = getattr(model_service, '_allow_placeholder', False)
        print(f"[Analyze] Prediction result: label={prediction_label}, confidence={confidence}")

        print("[Analyze] Getting RAG explanation...")
        error_details = None
        if rag_service is None:
            # RAG service failed to initialize earlier; provide a safe default
            print("[Analyze] WARNING: RAGService unavailable, using fallback explanation")
            rag = {
                "confidence_level": "UNKNOWN",
                "ai_explanation": "Unable to generate detailed explanation at this time.",
                "detected_patterns": [],
                "recommendation": "No explanation available because RAG service is unavailable.",
                "processing_time_ms": 0,
            }
            error_details = "RAGService unavailable. Please check Gemini API configuration."
        else:
            rag = rag_service.explain(prediction_label, confidence, features)
            print(f"[Analyze] RAG explanation generated")

            # Add error details if Gemini is not initialized or if the RAG call failed
            if not getattr(rag_service, 'initialized', False):
                error_details = "Gemini API not initialized. Please check API key configuration."
                print(f"[Analyze] WARNING: {error_details}")
            elif rag.get("ai_explanation") == "Unable to generate detailed explanation at this time.":
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


@router.post("/analyze-video", response_model=AnalysisResponse)
async def analyze_video(file: UploadFile = File(...)):
    """
    Analyze video file by extracting audio and running deepfake detection.
    Accepts video files (MP4, MOV, AVI) and returns audio analysis results.
    """
    print(f"[AnalyzeVideo] Received file: {file.filename}, content_type: {file.content_type}")
    
    # Validate video file type
    valid_video_types = ("video/mp4", "video/quicktime", "video/x-msvideo", "video/avi")
    if file.content_type not in valid_video_types:
        print(f"[AnalyzeVideo] ERROR: Unsupported file type: {file.content_type}")
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported video format. Please upload MP4, MOV, or AVI files."
        )
    
    # Check if model service is available
    if not MODEL_SERVICE_AVAILABLE:
        error_msg = "ML model service unavailable. TensorFlow not installed or model not found."
        print(f"[AnalyzeVideo] ERROR: {error_msg}")
        raise HTTPException(status_code=503, detail=error_msg)
    
    try:
        print("[AnalyzeVideo] Reading video file...")
        video_data = await file.read()
        print(f"[AnalyzeVideo] Video read successfully, size: {len(video_data)} bytes")
        
        print("[AnalyzeVideo] Extracting audio from video...")
        try:
            audio_data, audio_format = extract_audio_from_video(video_data, file.filename)
            print(f"[AnalyzeVideo] Audio extracted: format={audio_format}, size={len(audio_data)} bytes")
        except ImportError as e:
            print(f"[AnalyzeVideo] ERROR: {e}")
            raise HTTPException(
                status_code=500,
                detail="Video processing dependencies not installed. Please contact administrator."
            )
        except ValueError as e:
            print(f"[AnalyzeVideo] ERROR: {e}")
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            print(f"[AnalyzeVideo] ERROR: Video processing failed: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to extract audio from video: {str(e)}"
            )
        
        print("[AnalyzeVideo] Extracting audio features...")
        features = extract_features(audio_data)
        mel = features.get('mel_spectrogram')
        try:
            shape = getattr(mel, 'shape', None)
            print(f"[AnalyzeVideo] Features extracted successfully. mel_spectrogram shape: {shape}")
        except Exception:
            print("[AnalyzeVideo] Features extracted successfully. mel_spectrogram shape: unknown")

        print("[AnalyzeVideo] Running model prediction...")
        prediction_label, confidence, raw_vector = model_service.predict(features)
        used_placeholder = getattr(model_service, '_allow_placeholder', False)
        print(f"[AnalyzeVideo] Prediction result: label={prediction_label}, confidence={confidence}")

        print("[AnalyzeVideo] Getting RAG explanation...")
        error_details = None
        if rag_service is None:
            print("[AnalyzeVideo] WARNING: RAGService unavailable, using fallback explanation")
            rag = {
                "confidence_level": "UNKNOWN",
                "ai_explanation": "Unable to generate detailed explanation at this time.",
                "detected_patterns": [],
                "recommendation": "No explanation available because RAG service is unavailable.",
                "processing_time_ms": 0,
            }
            error_details = "RAGService unavailable. Please check Gemini API configuration."
        else:
            rag = rag_service.explain(prediction_label, confidence, features)
            print(f"[AnalyzeVideo] RAG explanation generated")

            if not getattr(rag_service, 'initialized', False):
                error_details = "Gemini API not initialized. Please check API key configuration."
                print(f"[AnalyzeVideo] WARNING: {error_details}")
            elif rag.get("ai_explanation") == "Unable to generate detailed explanation at this time.":
                error_details = "Gemini API request failed. Please check logs for details."
                print(f"[AnalyzeVideo] WARNING: {error_details}")

        print("[AnalyzeVideo] SUCCESS: Video analysis completed")
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
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Video analysis failed: {str(e)}"
        print(f"[AnalyzeVideo] ERROR: {error_msg}")
        print(f"[AnalyzeVideo] Exception type: {type(e).__name__}")
        import traceback
        print("[AnalyzeVideo] Full traceback:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=error_msg)