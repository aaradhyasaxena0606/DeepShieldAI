// VoiceGuard AI - Audio Analysis Page (Fully Standardized)
// Typography: h1 text-5xl md:text-6xl, h2 text-3xl md:text-4xl, h3 text-xl, body text-base, small text-sm
// Colors: maroon-400 icons, beige-200/80 body text, glass-card bg-black/40 backdrop-blur-lg
// Spacing: p-6 cards, gap-6 grids, space-y-8 sections, py-12 px-4 page
// Animations: animate-fade-in, animate-slide-up with delays, hover:scale-105

import { Mic, Upload, AlertCircle, Shield } from "lucide-react";
import { AudioUploader } from "../components/AudioUploader";
import Iridescence from "../ui/Iridescence";

export default function AnalyzePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-beige-900 via-brown-900 to-black">
      {/* Iridescent Background */}
      <div className="absolute inset-0 z-0">
        <Iridescence speed={0.6} amplitude={0.12} mouseReact={true} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-lg border border-beige-200/20 rounded-full mb-4">
              <Mic className="w-4 h-4 text-maroon-400" />
              <span className="text-sm text-beige-200 font-medium">
                Audio Analysis
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent">
              Analyze Audio
            </h1>

            <p className="text-base text-beige-200/80 max-w-2xl mx-auto leading-relaxed">
              Upload an audio file to detect if it's real or AI-generated. Get
              instant results with detailed explanations.
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
            {/* Card 1: Supported Formats */}
            <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-maroon-600/20 rounded-lg flex-shrink-0">
                  <Upload className="w-5 h-5 text-maroon-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-beige-100 mb-1">
                    Supported Formats
                  </div>
                  <div className="text-xs text-beige-300">
                    WAV, MP3 (Max 10MB)
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Processing Time */}
            <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-maroon-600/20 rounded-lg flex-shrink-0">
                  <Mic className="w-5 h-5 text-maroon-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-beige-100 mb-1">
                    Processing Time
                  </div>
                  <div className="text-xs text-beige-300">
                    Results in 2-5 seconds
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Privacy */}
            <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-maroon-600/20 rounded-lg flex-shrink-0">
                  <Shield className="w-5 h-5 text-maroon-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-beige-100 mb-1">
                    Privacy
                  </div>
                  <div className="text-xs text-beige-300">Files not stored</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Upload Area */}
          <div
            className="glass-card p-8 shadow-2xl animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <AudioUploader />
          </div>

          {/* Instructions */}
          <div
            className="glass-card bg-maroon-600/10 backdrop-blur-lg border-maroon-400/30 p-6 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="text-base font-semibold text-beige-100 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-maroon-400" />
              How It Works
            </h3>
            <ol className="space-y-2 text-sm text-beige-200/80">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-maroon-400 flex-shrink-0">
                  1.
                </span>
                <span>
                  Upload your audio file (WAV or MP3 format, max 10MB)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-maroon-400 flex-shrink-0">
                  2.
                </span>
                <span>
                  Our CNN model analyzes acoustic patterns, spectral features,
                  and artifacts in real-time
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-maroon-400 flex-shrink-0">
                  3.
                </span>
                <span>
                  Get a confidence score and AI-generated explanation powered by
                  Google Gemini
                </span>
              </li>
            </ol>
          </div>

          {/* Trust Indicators */}
          <div
            className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-beige-300 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Secure Processing</span>
            </div>
            <div className="hidden md:block text-beige-400">•</div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-400" />
              <span>No Data Stored</span>
            </div>
            <div className="hidden md:block text-beige-400">•</div>
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-maroon-400" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
