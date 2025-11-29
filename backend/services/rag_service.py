# VoiceGuard AI - RAG (Retrieval-Augmented Generation) Service
# get_explanation(prediction, confidence, features): Orchestrate RAG flow
# 1. Call pattern_matcher.match_patterns(features) to detect indicators
# 2. Call explainer.generate_explanation(prediction, confidence, patterns) to get Gemini response
# 3. Get recommendation based on confidence level from knowledge_base.json
# Return complete explanation object for API response

import json, time
from pathlib import Path

class RAGService:
    def __init__(self):
        kb_path = Path(__file__).parent.parent / 'rag' / 'knowledge_base.json'
        with kb_path.open('r', encoding='utf-8') as f:
            self.kb = json.load(f)

    def explain(self, prediction: str, confidence: float, features: dict):
        start = time.time()
        detected = self._match_patterns(features)
        recommendation = self._get_recommendation(confidence, prediction)
        prompt_patterns = ', '.join([p['name'] for p in detected]) or 'no specific patterns'
        # Placeholder Gemini call
        ai_explanation = self._build_explanation_text(prediction, confidence, prompt_patterns)
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
        for ind in indicators:
            if ind == 'low_pitch_variance' and features.get('pitch_variance', 999) < 15:
                return True
            if ind == 'spectral_rolloff_anomaly' and features.get('spectral_rolloff', 0) > 0.85:
                return True
            if ind == 'mfcc_outliers' and features.get('mfcc_std', 0) > 2.5:
                return True
        return False

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

    def _build_explanation_text(self, prediction, confidence, patterns):
        return (f"Audio classified as {prediction.upper()} with {(confidence*100):.1f}% confidence; "
                f"detected patterns: {patterns}. Synthetic speech often shows stable pitch / spectral artifacts.")
