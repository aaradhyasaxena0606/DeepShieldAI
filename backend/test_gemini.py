#!/usr/bin/env python3
"""
Test script for Gemini integration in VoiceGuard AI
"""

import sys
import os

# Add the backend directory to the path so we can import our modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from services.rag_service import RAGService

def test_gemini_integration():
    """Test the Gemini integration with sample data"""
    print("Testing Gemini integration...")
    
    # Initialize the RAG service
    rag_service = RAGService()
    
    # Print initialization status
    print(f"Gemini initialized: {rag_service.initialized}")
    
    if not rag_service.initialized:
        print("Gemini not initialized. Please check your environment variables.")
        print("Make sure you have set GOOGLE_AI_STUDIO_KEY in the .env file.")
        print("Get your free API key from: https://aistudio.google.com/")
        return
    
    # Sample features for testing
    sample_features = {
        'pitch_variance': 10.0,  # Low pitch variance (fake indicator)
        'spectral_rolloff': 0.9,  # High spectral rolloff (fake indicator)
        'mfcc_std': 3.0  # High MFCC std (fake indicator)
    }
    
    # Test case 1: High confidence fake
    print("\n--- Test Case 1: High Confidence Fake ---")
    result = rag_service.explain("fake", 0.95, sample_features)
    print(f"Prediction: {result['ai_explanation']}")
    print(f"Patterns detected: {[p['name'] for p in result['detected_patterns']]}")
    print(f"Recommendation: {result['recommendation']}")
    
    # Test case 2: Medium confidence real
    print("\n--- Test Case 2: Medium Confidence Real ---")
    result = rag_service.explain("real", 0.75, sample_features)
    print(f"Prediction: {result['ai_explanation']}")
    print(f"Patterns detected: {[p['name'] for p in result['detected_patterns']]}")
    print(f"Recommendation: {result['recommendation']}")
    
    # Test case 3: Low confidence
    print("\n--- Test Case 3: Low Confidence ---")
    result = rag_service.explain("fake", 0.55, {})
    print(f"Prediction: {result['ai_explanation']}")
    print(f"Patterns detected: {[p['name'] for p in result['detected_patterns']]}")
    print(f"Recommendation: {result['recommendation']}")

if __name__ == "__main__":
    test_gemini_integration()