# VoiceGuard AI - RAG (Retrieval-Augmented Generation) Service
# get_explanation(prediction, confidence, features): Orchestrate RAG flow
# 1. Call pattern_matcher.match_patterns(features) to detect indicators
# 2. Call explainer.generate_explanation(prediction, confidence, patterns) to get Gemini response
# 3. Get recommendation based on confidence level from knowledge_base.json
# Return complete explanation object for API response

import json, time
from pathlib import Path
import logging
import requests
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self):
        kb_path = Path(__file__).parent.parent / 'rag' / 'knowledge_base.json'
        with kb_path.open('r', encoding='utf-8') as f:
            self.kb = json.load(f)
        
        # Initialize Google AI Studio API
        try:
            from config import settings
            self.api_key = getattr(settings, 'GOOGLE_AI_STUDIO_KEY', None)
            # Use the model name from config
            self.model_name = getattr(settings, 'GEMINI_MODEL', 'gemini-2.5-flash')
            
            logger.info(f"Loaded API key: {'***' + self.api_key[-4:] if self.api_key else 'None'}")
            logger.info(f"Loaded model name: {self.model_name}")
            
            # Enhanced logging for API key validation
            if self.api_key:
                if self.api_key == "your_actual_api_key_here":
                    logger.warning("API key is set to placeholder value. Gemini integration will not work.")
                    self.initialized = False
                elif len(self.api_key) < 10:
                    logger.warning("API key appears to be invalid (too short). Gemini integration will not work.")
                    self.initialized = False
                else:
                    self.initialized = True
                    logger.info("Google AI Studio API initialized successfully")
            else:
                self.initialized = False
                logger.warning("Google AI Studio API key not set. Gemini integration will not work.")
        except Exception as e:
            self.initialized = False
            logger.error(f"Failed to initialize Google AI Studio API: {e}", exc_info=True)

    def explain(self, prediction: str, confidence: float, features: dict):
        start = time.time()
        detected = self._match_patterns(features)
        recommendation = self._get_recommendation(confidence, prediction)
        prompt_patterns = ', '.join([p['name'] for p in detected]) or 'no specific patterns'
        
        # Use Gemini for explanation if available, otherwise fallback to placeholder
        if self.initialized:
            try:
                ai_explanation = self._generate_gemini_explanation(prediction, confidence, prompt_patterns, detected)
                # Clean and filter the explanation for UI display
                ai_explanation = self._clean_gemini_output(ai_explanation)
            except Exception as e:
                logger.error(f"Gemini API call failed: {e}", exc_info=True)
                ai_explanation = self._build_fallback_explanation(prediction, confidence, prompt_patterns)
        else:
            ai_explanation = self._build_fallback_explanation(prediction, confidence, prompt_patterns)
            
        return {
            'ai_explanation': ai_explanation,
            'detected_patterns': detected,
            'recommendation': recommendation,
            'confidence_level': self._confidence_level(confidence),
            'processing_time_ms': int((time.time()-start)*1000)
        }

    def _match_patterns(self, features):
        results = []
        for pattern in self.kb['deepfake_patterns']:
            if self._check_indicators(features, pattern['indicators']):
                results.append({
                    'name': pattern['name'],
                    'explanation': pattern['explanation'],
                    'technical': pattern['technical']
                })
        return results

    def _check_indicators(self, features, indicators):
        matched_count = 0
        for ind in indicators:
            if ind == 'low_pitch_variance' and features.get('pitch_variance', 999) < 15:
                matched_count += 1
            if ind == 'spectral_rolloff_anomaly' and features.get('spectral_rolloff', 0) > 0.85:
                matched_count += 1
            if ind == 'mfcc_outliers' and features.get('mfcc_std', 0) > 2.5:
                matched_count += 1
        
        # Require at least one indicator to match for the pattern to be detected
        # This makes the detection more sensitive and realistic
        return matched_count >= 1

    def _get_recommendation(self, confidence, prediction):
        if prediction == 'fake':
            if confidence > 0.85:
                return self.kb['recommendations']['high_confidence_fake']
            if confidence > 0.65:
                return self.kb['recommendations']['medium_confidence']
        return self.kb['recommendations']['low_confidence']

    def _confidence_level(self, confidence):
        if confidence > 0.85: return 'HIGH'
        if confidence > 0.65: return 'MEDIUM'
        return 'LOW'

    def _generate_gemini_explanation(self, prediction: str, confidence: float, patterns: str, detected_patterns: list):
        """Generate explanation using Google AI Studio Gemini API"""
        # Create a detailed prompt for Gemini
        pattern_details = "\n".join([
            f"- {p['name']}: {p['explanation']}" for p in detected_patterns
        ]) if detected_patterns else "No specific deepfake patterns detected."
        
        prompt = f"""Analyze this audio deepfake detection result and provide a clear, concise explanation for a general audience.

Detection Result:
- Classification: {prediction.upper()}
- Confidence: {confidence*100:.1f}%
- Level: {self._confidence_level(confidence)}

Detected Patterns:
{pattern_details}

Provide a natural, conversational explanation covering:
1. Why this audio was classified as {prediction.upper()}
2. What the detected patterns reveal about authenticity
3. Key technical characteristics identified
4. Important limitations and caveats

Format your response as plain text paragraphs without any markdown formatting (no **, ##, bullets, or special characters). Write in a direct, professional tone without introducing yourself or restating the detection results. Keep it under 300 words and ensure the response is complete.
"""
        
        # Prepare the request for Google AI Studio API
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={self.api_key}"
        
        logger.info(f"Making request to: {url}")
        logger.debug(f"Request prompt: {prompt}")
        
        headers = {
            "Content-Type": "application/json"
        }
        
        data = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            "generationConfig": {
                "temperature": 0.5,
                "maxOutputTokens": 800,
                "topP": 0.9,
                "topK": 40
            }
        }
        
        # Make the API request
        try:
            response = requests.post(url, headers=headers, json=data, timeout=30)
        except requests.exceptions.RequestException as e:
            logger.error(f"Network error during Gemini API request: {e}")
            return "Unable to generate detailed explanation due to network connectivity issues."
        except Exception as e:
            logger.error(f"Unexpected error during Gemini API request: {e}")
            return "Unable to generate detailed explanation due to an unexpected error."
        
        logger.info(f"Response status: {response.status_code}")
        logger.info(f"Response headers: {dict(response.headers)}")
        
        # Check if the request was successful
        if response.status_code == 200:
            try:
                response_data = response.json()
                logger.info(f"Response data: {response_data}")
                if "candidates" in response_data and len(response_data["candidates"]) > 0:
                    candidate = response_data["candidates"][0]
                    if "content" in candidate and "parts" in candidate["content"]:
                        if len(candidate["content"]["parts"]) > 0 and "text" in candidate["content"]["parts"][0]:
                            return candidate["content"]["parts"][0]["text"]
                        else:
                            logger.error(f"Gemini API response missing text in parts. Response structure: {candidate}")
                            return "Unable to generate detailed explanation. Response structure is incomplete - missing text content."
                    else:
                        logger.error(f"Gemini API response missing content or parts. Response structure: {candidate}")
                        return "Unable to generate detailed explanation. Response structure is incomplete - missing content or parts."
                else:
                    logger.error(f"Gemini API response missing candidates. Response structure: {response_data}")
                    return "Unable to generate detailed explanation. Response structure is incomplete - missing candidates."
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse JSON response: {e}")
                return "Unable to generate detailed explanation due to response parsing error."
        elif response.status_code == 400:
            logger.error(f"Gemini API request failed with status 400 (Bad Request): {response.text}")
            return "Unable to generate detailed explanation due to invalid request. Please check API key validity."
        elif response.status_code == 401:
            logger.error(f"Gemini API request failed with status 401 (Unauthorized): {response.text}")
            return "Unable to generate detailed explanation due to invalid API key."
        elif response.status_code == 429:
            logger.error(f"Gemini API request failed with status 429 (Rate Limited): {response.text}")
            return "Unable to generate detailed explanation due to rate limiting. Please try again later."
        elif response.status_code >= 500:
            logger.error(f"Gemini API request failed with server error {response.status_code}: {response.text}")
            return "Unable to generate detailed explanation due to server-side issues. Please try again later."
        
        # If we couldn't get a valid response, return an error message
        logger.error(f"Gemini API request failed with status {response.status_code}: {response.text}")
        return f"Unable to generate detailed explanation. API responded with status code {response.status_code}."

    def _clean_gemini_output(self, text):
        """Clean and filter Gemini output for clean UI display"""
        if not text:
            return text
            
        # Remove markdown bold/italic formatting
        text = re.sub(r'\*\*\*(.+?)\*\*\*', r'\1', text)  # Bold italic
        text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)      # Bold
        text = re.sub(r'\*(.+?)\*', r'\1', text)          # Italic
        text = re.sub(r'__(.+?)__', r'\1', text)          # Underline bold
        text = re.sub(r'_(.+?)_', r'\1', text)            # Underline italic
        
        # Remove markdown headers
        text = re.sub(r'#{1,6}\s*', '', text)
        
        # Remove excessive dashes or asterisks
        text = re.sub(r'-{3,}', '', text)
        text = re.sub(r'\*{3,}', '', text)
        
        # Clean up list formatting - keep bullets simple
        text = re.sub(r'\n\s*[\*\-]\s*', '\n• ', text)
        
        # Remove excessive whitespace and newlines
        text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)
        text = re.sub(r'[ \t]+', ' ', text)
        
        # Remove intro phrases we don't want
        text = re.sub(r'^(As an expert.*?explanation[:\.]?\s*)', '', text, flags=re.IGNORECASE)
        text = re.sub(r'^(Here\'s.*?explanation[:\.]?\s*)', '', text, flags=re.IGNORECASE)
        
        # Clean up residual formatting
        text = text.strip()
        
        return text

    def _build_fallback_explanation(self, prediction, confidence, patterns):
        return (f"Audio classified as {prediction.upper()} with {(confidence*100):.1f}% confidence; "
                f"detected patterns: {patterns}. Synthetic speech often shows stable pitch / spectral artifacts.")