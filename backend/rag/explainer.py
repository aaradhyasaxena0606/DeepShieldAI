# VoiceGuard AI - Explanation Generator (Explainer)
# SimpleRAG class: __init__ loads knowledge_base.json, initializes Gemini model (gemini-1.5-flash)
# generate_explanation(prediction, confidence, patterns): Build prompt with detected patterns
# Call Gemini API: response = model.generate_content(prompt), return response.text
# Add fallback explanation if Gemini fails: "This audio shows characteristics typical of synthetic speech"

from services.rag_service import RAGService

# Legacy style wrapper if needed for future Gemini direct call
class SimpleRAG(RAGService):
    pass
