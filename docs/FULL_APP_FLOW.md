# VoiceGuard AI - Complete Application Flow

## Overview

VoiceGuard AI is a deepfake audio detection platform that uses machine learning and AI-powered explanations to determine if audio is real or AI-generated.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  React Frontend (Vite)                                       │   │
│  │  URL: http://localhost:5173                                  │   │
│  │  - Audio Upload Component                                    │   │
│  │  - Result Display                                            │   │
│  │  - History & Analysis Pages                                  │   │
│  └────────────────┬─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                     │ HTTP/CORS │
                     │ (REST API) │
                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND (Docker Container)                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  FastAPI Server (Port 8000)                                  │   │
│  │  - CORS enabled for frontend communication                   │   │
│  │  - Routes: /analyze, /health                                 │   │
│  │  - Environment: GOOGLE_AI_STUDIO_KEY, GEMINI_MODEL           │   │
│  └────────────────┬─────────────────────────────────────────────┘   │
│                   │                                                  │
│         ┌─────────┴─────────┐                                       │
│         │                   │                                       │
│  ┌──────▼──────┐  ┌────────▼────────┐                              │
│  │ Audio       │  │ Model Service   │                              │
│  │ Processor   │  │ (TensorFlow)    │                              │
│  │ - Librosa   │  │ - CNN Model     │                              │
│  │ - Features  │  │ - best_model.h5 │                              │
│  │   Extraction│  │ - Prediction    │                              │
│  └──────┬──────┘  └────────┬────────┘                              │
│         │                  │                                       │
│         └──────────┬───────┘                                        │
│                    │                                               │
│           ┌────────▼────────┐                                      │
│           │  RAG Service    │                                      │
│           │  - Pattern      │                                      │
│           │    Matching     │                                      │
│           │  - Gemini API   │                                      │
│           │    Integration  │                                      │
│           └─────────────────┘                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

                    ▼ (External API)

┌─────────────────────────────────────────────────────────────────────┐
│              Google AI Studio API (Gemini)                           │
│  - AI-powered explanation generation                                │
│  - Pattern interpretation                                           │
│  - Free tier via API key                                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## User Flow: Clicking "Analyse"

### Step 1: User Selects & Uploads Audio File

**Location**: `frontend/src/components/AudioUploader.jsx`

```
User Action → onClick Upload Button / Drag & Drop
    │
    ├─► validateFile()
    │   ├─ Check file type (audio/wav, audio/mpeg)
    │   ├─ Check file size (max 10MB)
    │   └─ Return validation error if invalid
    │
    └─► setFile(selectedFile) [State Update]
```

**Key Code**:

```jsx
const validateFile = (file) => {
  const validTypes = ["audio/wav", "audio/mpeg", "audio/mp3"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return "Invalid file format. Please upload WAV or MP3.";
  }
  if (file.size > maxSize) {
    return "File too large. Maximum size is 10MB.";
  }
  return null;
};
```

**Possible Errors**:

- ❌ Invalid file format (not WAV/MP3)
- ❌ File too large (>10MB)

---

### Step 2: User Clicks "Analyze" Button

**Location**: `frontend/src/components/AudioUploader.jsx` → `handleAnalyze()`

```
onClick Analyze Button
    │
    ├─► setLoading(true)
    ├─► Create FormData with file
    ├─► Get API URL from env: VITE_API_BASE_URL
    │   ├─ Docker: http://backend:8000
    │   ├─ Local: http://localhost:8000
    │   └─ Default: http://localhost:8000
    │
    └─► axios.post(`${baseUrl}/analyze`, formData)
```

**Network Request**:

```
POST /analyze
Content-Type: multipart/form-data
Authorization: (None - public endpoint)
Body: audio file
```

**Possible Errors**:

- ❌ CORS error (frontend and backend not on same origin/properly configured)
- ❌ Connection refused (backend not running)
- ❌ Network timeout (backend too slow)
- ❌ Invalid endpoint URL (misconfigured VITE_API_BASE_URL)

---

### Step 3: Backend Receives Upload Request

**Location**: `backend/api/routes.py` → `analyze()` endpoint

```
Receive POST /analyze
    │
    ├─► Check if file.content_type ∈ valid types
    │   └─ If invalid → HTTP 400 "Unsupported file type"
    │
    ├─► Check MODEL_SERVICE_AVAILABLE
    │   └─ If False → HTTP 503 "ML model service unavailable"
    │
    └─► Extract file data: await file.read()
```

**Possible Errors**:

- ❌ HTTP 400: Unsupported file type
- ❌ HTTP 503: TensorFlow not installed or model not found

---

### Step 4: Audio Feature Extraction

**Location**: `backend/services/audio_processor.py` → `extract_features()`

```
extract_features(raw_audio_bytes)
    │
    ├─► Load audio with librosa:
    │   ├─ librosa.load(audio_buf, sr=16000)  [Resample to 16kHz]
    │   └─ y, sr = numpy array, sample rate
    │
    ├─► Extract Mel-Spectrogram:
    │   ├─ librosa.feature.melspectrogram(y, sr, n_mels=128)
    │   ├─ Convert to dB scale
    │   └─ Pad/crop to 128×128 size
    │
    ├─► Extract Acoustic Features:
    │   ├─ librosa.yin() → pitch variance
    │   ├─ librosa.feature.spectral_rolloff() → frequency distribution
    │   ├─ librosa.feature.mfcc() → Mel-Frequency Cepstral Coefficients
    │   └─ Zero-crossing rate, energy variance
    │
    └─► Return features dict:
        ├─ mel_spectrogram: [128×128 array]
        ├─ pitch_variance: float
        ├─ spectral_rolloff: float
        ├─ mfcc_std: float
        └─ ...other acoustic features
```

**Audio Processing Flow**:

```
Input Audio File (WAV/MP3)
         │
    ┌────▼─────────┐
    │  Librosa     │
    │  Load & SR   │
    │  16kHz       │
    └────┬─────────┘
         │
    ┌────▼─────────────────┐
    │ Feature Extraction   │
    │ (Spectral + Time)    │
    └────┬─────────────────┘
         │
    ┌────▼──────────────┐
    │ Mel-Spectrogram   │
    │ Normalization     │
    │ 128×128 Array     │
    └────┬──────────────┘
         │
    Features Dictionary
    (Ready for ML Model)
```

**Possible Errors**:

- ❌ Audio not readable (corrupted file)
- ❌ Librosa import error (not installed)
- ❌ Memory error (very large file)
- ❌ Invalid audio format (despite passing validation)

---

### Step 5: ML Model Prediction

**Location**: `backend/services/model_service.py` → `ModelService.predict()`

```
ModelService.predict(features)
    │
    ├─► Check if model is initialized
    │   └─ If not → RuntimeError "Model service not initialized"
    │
    ├─► Load model from disk (on first init):
    │   ├─ Try: ./ml-service/models/best_model.h5
    │   ├─ Try: /app/ml-service/models/best_model.h5
    │   ├─ Try: ./ml-service/trained_models/cnn_model.h5
    │   └─ Try: /app/ml-service/trained_models/cnn_model.h5
    │
    ├─► Run Inference:
    │   ├─ model.predict(mel_spectrogram)
    │   ├─ Get probabilities: [P(Real), P(Fake)]
    │   └─ Return label + confidence
    │
    └─► Return (label, confidence, raw_probabilities)
        ├─ label: "REAL" or "FAKE"
        ├─ confidence: 0.0-1.0
        └─ raw_vector: [prob_real, prob_fake]
```

**Model Initialization Flow**:

```
First API Request
    │
    ├─► Import TensorFlow
    │   └─ If error + ALLOW_PLACEHOLDER=1 → Use dummy predictions
    │   └─ If error + ALLOW_PLACEHOLDER=0 → Crash (RuntimeError)
    │
    ├─► Find model file
    │   └─ Try multiple paths (dev vs. container)
    │   └─ If not found + ALLOW_PLACEHOLDER=1 → Use dummy predictions
    │   └─ If not found + ALLOW_PLACEHOLDER=0 → Crash (RuntimeError)
    │
    └─► Load model
        └─ If load fails + ALLOW_PLACEHOLDER=1 → Use dummy predictions
        └─ If load fails + ALLOW_PLACEHOLDER=0 → Crash (RuntimeError)
```

**Possible Errors**:

- ❌ TensorFlow not installed (HTTP 503)
- ❌ Model file not found (HTTP 503)
- ❌ Model file corrupted (HTTP 500)
- ❌ Insufficient memory (HTTP 500)
- ❌ Features format mismatch (HTTP 500)

---

### Step 6: Pattern Matching (RAG Service)

**Location**: `backend/services/rag_service.py` → `explain()` → `_match_patterns()`

```
_match_patterns(features)
    │
    ├─► Load knowledge_base.json:
    │   └─ Contains deepfake_patterns with indicators
    │
    └─► For each pattern in knowledge_base:
        ├─ Check indicators:
        │  ├─ low_pitch_variance → if pitch_variance < 15
        │  ├─ spectral_rolloff_anomaly → if spectral_rolloff > 0.85
        │  └─ mfcc_outliers → if mfcc_std > 2.5
        │
        └─ If ≥1 indicator matches → Add to detected_patterns[]
```

**Sample Pattern Matching**:

```python
# From knowledge_base.json
deepfake_patterns = [
  {
    "name": "Robotic Voice",
    "indicators": ["low_pitch_variance"],
    "explanation": "Consistent pitch suggests AI synthesis"
  },
  {
    "name": "Spectral Anomaly",
    "indicators": ["spectral_rolloff_anomaly"],
    "explanation": "Unusual frequency distribution detected"
  }
]
```

**Possible Errors**:

- ❌ knowledge_base.json not found (HTTP 500)
- ❌ Invalid JSON format (HTTP 500)
- ❌ Missing required fields in patterns (HTTP 500)

---

### Step 7: Gemini API Explanation Generation

**Location**: `backend/services/rag_service.py` → `_generate_gemini_explanation()`

```
_generate_gemini_explanation(prediction, confidence, patterns)
    │
    ├─► Check if API initialized:
    │   ├─ GOOGLE_AI_STUDIO_KEY must be set in env
    │   ├─ GOOGLE_AI_STUDIO_KEY != "your_actual_api_key_here"
    │   └─ Length ≥ 10 characters
    │
    ├─► Build prompt with context:
    │   ├─ Prediction: "REAL" or "FAKE"
    │   ├─ Confidence: 0-100%
    │   └─ Detected patterns: List from step 6
    │
    ├─► Call Google AI Studio API:
    │   ├─ Endpoint: https://generativelanguage.googleapis.com/v1beta/models/...
    │   ├─ Model: gemini-2.5-flash (or from GEMINI_MODEL env)
    │   ├─ Auth: API key in header
    │   └─ Timeout: Default requests timeout (30s)
    │
    └─► Parse Response:
        ├─ Extract text content
        ├─ Clean output (remove markdown, etc.)
        └─ Return explanation string
```

**Gemini Prompt Template**:

```
You are an audio analysis expert. Based on the following analysis:

Prediction: {prediction}
Confidence: {confidence}%
Detected Patterns: {patterns}

Provide a brief, technical explanation for {prediction} classification.
```

**Possible Errors**:

- ❌ **API Key Not Set** → environment variable missing
  - Result: Falls back to placeholder explanation
  - Message: "Unable to generate detailed explanation at this time"
- ❌ **API Key Invalid** → placeholder value or too short
  - Result: Falls back to placeholder explanation
  - Message: "Unable to generate detailed explanation at this time"
- ❌ **Network Error** → API unreachable
  - Result: Falls back to placeholder explanation
  - HTTP Error: 500 with error message
- ❌ **API Rate Limit** → too many requests
  - Result: Falls back to placeholder explanation
  - Google AI Studio free tier has rate limits
- ❌ **Invalid Response** → Gemini returns error
  - Result: Falls back to placeholder explanation
  - Logged as error: "Gemini API call failed"

---

### Step 8: Generate Recommendation

**Location**: `backend/services/rag_service.py` → `_get_recommendation()`

```
_get_recommendation(confidence, prediction)
    │
    ├─► Check confidence level:
    │   ├─ High confidence (>80%) → Strong recommendation
    │   ├─ Medium confidence (50-80%) → Moderate recommendation
    │   └─ Low confidence (<50%) → Manual review suggested
    │
    └─► Return recommendation string
        ├─ For REAL: "This audio appears to be authentic"
        ├─ For FAKE: "This audio shows signs of AI generation"
        └─ + Confidence-based caveat
```

**Possible Errors**:

- ❌ Invalid confidence value (shouldn't happen, but defensive check)

---

### Step 9: Return Response to Frontend

**Location**: `backend/api/routes.py` → `analyze()` response

```
Return AnalysisResponse:
    {
        "prediction": "FAKE" | "REAL",
        "confidence": 0.85,
        "confidence_level": "high" | "medium" | "low",
        "ai_explanation": "string explaining the prediction",
        "detected_patterns": [
            {
                "name": "Robotic Voice",
                "explanation": "Consistent pitch suggests AI synthesis",
                "technical": "Pitch variance < 15Hz"
            }
        ],
        "recommendation": "This audio shows signs of AI generation...",
        "processing_time_ms": 2341,
        "error_details": null  // or error message if Gemini failed
    }
```

**Possible Errors on Response**:

- ❌ HTTP 400: Invalid file type
- ❌ HTTP 500: Processing error
- ❌ HTTP 503: Model service unavailable

---

### Step 10: Display Results in Frontend

**Location**: `frontend/src/pages/ResultPage.jsx`

```
Receive Response Data
    │
    ├─► Parse JSON response
    ├─► Extract result from state/localStorage
    │
    ├─► Display:
    │   ├─ Confidence gauge (0-100%)
    │   ├─ Detection badge (REAL/FAKE)
    │   ├─ AI Explanation (from Gemini or fallback)
    │   ├─ Detected Patterns (Pattern Tags)
    │   ├─ Recommendation
    │   └─ Processing Time
    │
    └─► Save to localStorage history
        ├─ timestamp: ISO string
        ├─ filename: original filename
        ├─ prediction: REAL/FAKE
        ├─ confidence: float
        └─ ... (full response)
```

**Result Page Display**:

```
┌─────────────────────────────────────┐
│     Confidence: 85% (HIGH)          │
│     Prediction: FAKE ❌              │
│                                     │
│  AI Explanation:                    │
│  "This audio shows signs of AI..."  │
│                                     │
│  Detected Patterns:                 │
│  - Robotic Voice (pitch analysis)   │
│  - Spectral Anomaly (frequency)     │
│                                     │
│  Recommendation:                    │
│  "Consider this audio as AI..."     │
│                                     │
│  Processing Time: 2341 ms           │
└─────────────────────────────────────┘
```

**Possible Errors**:

- ❌ Result not found in history
- ❌ Corrupted result data
- ❌ Display/rendering errors (React)

---

## Complete Error Flow Diagram

```
User clicks "Analyze"
    │
    ├─► ❌ File validation fails
    │   └─ Error: "Invalid format or too large"
    │   └─ Status: Local validation, no API call
    │
    ├─► ❌ Network error
    │   └─ Error: "Unable to connect to backend"
    │   └─ Status: axios catch block triggered
    │
    ├─► ❌ Backend receives but validates file type again
    │   └─ Error: HTTP 400 "Unsupported file type"
    │   └─ Status: Rare (double validation)
    │
    ├─► ❌ Model service not available
    │   └─ Error: HTTP 503 "ML model service unavailable"
    │   └─ Reason: TensorFlow not installed or model file missing
    │   └─ Fix: Install TensorFlow or provide model.h5 file
    │
    ├─► ❌ Audio processing fails
    │   └─ Error: HTTP 500 "Analysis failed: librosa..."
    │   └─ Reason: Corrupted audio, unsupported codec
    │   └─ Fix: Try different audio format
    │
    ├─► ❌ Model prediction fails
    │   └─ Error: HTTP 500 "Analysis failed: TensorFlow..."
    │   └─ Reason: Incompatible features, model error
    │   └─ Fix: Verify model compatibility
    │
    ├─► ⚠️  Gemini API fails (non-critical)
    │   └─ Status: HTTP 200 (success)
    │   └─ Response includes error_details field
    │   └─ ai_explanation: Fallback explanation used
    │   └─ Reason: API key missing, invalid, or rate limited
    │   └─ Fix: Set GOOGLE_AI_STUDIO_KEY in env
    │
    └─► ✅ Success
        └─ Return complete analysis response
        └─ Display results on frontend
```

---

## Environment Variables Required

### Docker Setup

```bash
# .env file (in deployment/ directory)
GOOGLE_AI_STUDIO_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-2.5-flash
PORT=8000
```

### Frontend Environment

```javascript
// .env (in frontend/ directory) - optional
VITE_API_BASE_URL=http://localhost:8000
```

### Backend Environment

```bash
# .env (in backend/ or deployment/ directory)
GOOGLE_AI_STUDIO_KEY=...      # REQUIRED for Gemini
GEMINI_MODEL=gemini-2.5-flash # OPTIONAL, defaults to this
PORT=8000                       # OPTIONAL
ALLOW_PLACEHOLDER=0             # Set to 1 only for development without TensorFlow
```

---

## Key Files & Their Roles

| File                                        | Role                     | Critical?                |
| ------------------------------------------- | ------------------------ | ------------------------ |
| `backend/main.py`                           | FastAPI app entry        | ✅ Yes                   |
| `backend/api/routes.py`                     | /analyze endpoint        | ✅ Yes                   |
| `backend/services/audio_processor.py`       | Feature extraction       | ✅ Yes                   |
| `backend/services/model_service.py`         | TensorFlow model loading | ✅ Yes                   |
| `backend/services/rag_service.py`           | RAG + Gemini integration | ⚠️ Fallback OK           |
| `backend/rag/knowledge_base.json`           | Pattern definitions      | ⚠️ Fallback OK           |
| `frontend/src/components/AudioUploader.jsx` | Upload & analyze trigger | ✅ Yes                   |
| `frontend/src/pages/ResultPage.jsx`         | Results display          | ✅ Yes                   |
| `ml-service/models/best_model.h5`           | CNN model weights        | ✅ Yes (for predictions) |
| `.env` (deployment/)                        | Configuration            | ✅ Yes                   |

---

## Performance Metrics

| Operation              | Typical Time                  |
| ---------------------- | ----------------------------- |
| File upload            | 0.5-2s (depends on file size) |
| Audio processing       | 0.5-1s                        |
| Model inference        | 1-3s                          |
| Gemini API call        | 2-5s                          |
| **Total processing**   | **4-11s**                     |
| **Total with network** | **5-15s**                     |

---

## Common Issues & Solutions

### Issue 1: HTTP 503 "Model service unavailable"

**Cause**: TensorFlow not installed or model file missing

**Solution**:

```bash
# Inside backend container or venv
pip install tensorflow==2.16.1
# Ensure best_model.h5 exists at: /app/ml-service/models/best_model.h5
```

---

### Issue 2: Gemini API not working (error_details present)

**Cause**: API key not set, invalid, or rate limited

**Solution**:

1. Go to https://aistudio.google.com/
2. Click "Get API key" → "Create new API key"
3. Copy the key
4. Set in `.env`: `GOOGLE_AI_STUDIO_KEY=your_key_here`
5. Restart backend: `docker-compose restart backend`

---

### Issue 3: CORS error from frontend

**Cause**: Frontend and backend not on same origin

**Solution**:

- If in Docker: Ensure both services on same network (✅ already configured)
- If local dev: Ensure backend CORS allows frontend origin
- Check `docker-compose.yml` network configuration

---

### Issue 4: Connection refused (Port 8000/5173)

**Cause**: Services not running or ports already in use

**Solution**:

```bash
# Check if ports in use
netstat -ano | findstr :8000
netstat -ano | findstr :5173

# Kill process using port
taskkill /PID <PID> /F

# Or use different ports in docker-compose.yml
```

---

## Docker Commands

```bash
# Start all services (from deployment/ directory)
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Rebuild specific service
docker-compose build --no-cache backend

# Run command in container
docker-compose exec backend bash
docker-compose exec frontend bash
```

---

## Testing the Flow

### 1. Health Check

```bash
curl http://localhost:8000/health
# Expected: {"status":"ok"}
```

### 2. Analyze with Test Audio

```bash
curl -X POST http://localhost:8000/analyze \
  -F "file=@test_audio.wav"

# Expected: Full analysis response with prediction, confidence, etc.
```

### 3. Frontend Access

```
http://localhost:5173
```

Navigate to "Analyze" → Upload audio → View results

---

## Summary

**When user clicks "Analyse":**

1. ✅ Frontend validates file locally (format, size)
2. ✅ Sends FormData to `POST /analyze`
3. ✅ Backend extracts audio features using librosa
4. ✅ CNN model makes prediction (REAL/FAKE + confidence)
5. ✅ Pattern matching detects acoustic anomalies
6. ⚠️ Gemini API generates explanation (can fail gracefully)
7. ✅ Recommendation generated based on confidence
8. ✅ Results returned to frontend
9. ✅ Results displayed and saved to history

**Error can occur at:**

- File validation (frontend)
- Network connectivity (frontend ↔ backend)
- Audio processing (backend feature extraction)
- Model loading/inference (backend ML)
- Gemini API call (backend RAG, non-critical)
- Display (frontend rendering)
