// VoiceGuard AI - Analysis Results Display Page (Fully Standardized)
// Typography: h1 text-3xl md:text-4xl, h2 text-xl md:text-2xl, h3 text-base, body text-base, small text-sm
// Colors: maroon-400 icons, beige-100 headings, beige-200/80 body, glass-card consistency
// Spacing: p-6 cards, p-8 large cards, gap-6 grids, space-y-8 sections
// Animations: animate-fade-in, animate-slide-up with 0.1s stagger, hover:scale-105

import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft, Download, RefreshCw, Info, AlertCircle } from 'lucide-react';
import { DetectionBadge } from '../components/DetectionBadge';
import { ConfidenceGauge } from '../components/ConfidenceGauge';
import Iridescence from '../ui/Iridescence';

function AlertBox({ variant = 'info', title, description }) {
  const config = {
    success: {
      icon: CheckCircle,
      borderColor: 'border-l-green-500',
      iconColor: 'text-green-400',
      bgColor: 'bg-green-600/20'
    },
    warning: {
      icon: AlertTriangle,
      borderColor: 'border-l-yellow-500',
      iconColor: 'text-yellow-400',
      bgColor: 'bg-yellow-600/20'
    },
    danger: {
      icon: AlertTriangle,
      borderColor: 'border-l-red-500',
      iconColor: 'text-red-400',
      bgColor: 'bg-red-600/20'
    },
    info: {
      icon: Info,
      borderColor: 'border-l-blue-500',
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-600/20'
    }
  };

  const { icon: Icon, borderColor, iconColor, bgColor } = config[variant];

  return (
    <div className={`glass-card ${bgColor} border-l-4 ${borderColor} p-6 flex items-start gap-3`}>
      <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-beige-100 mb-1">{title}</h4>
        <p className="text-sm text-beige-200/80 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function PatternTag({ name }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-maroon-600/20 border border-maroon-400/30 rounded-full text-xs text-beige-200 hover:bg-maroon-600/30 hover:scale-105 transition-all duration-300">
      <AlertTriangle className="w-3 h-3" />
      {name}
    </span>
  );
}

export default function ResultPage() {
  const { state } = useLocation();
  const data = state?.data;
  
  if (!data) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-brown-900 via-brown-800 to-black">
        <div className="absolute inset-0 z-0">
          <Iridescence color={[0.55, 0.16, 0.16]} speed={0.6} amplitude={0.12} mouseReact={true} />
        </div>
        <div className="relative z-10 text-center space-y-4 px-4">
          <AlertCircle className="w-16 h-16 text-maroon-400 mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-bold text-beige-100">No Result Found</h2>
          <p className="text-base text-beige-200/80">Please analyze an audio file first.</p>
          <Link 
            to="/analyze" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-maroon-600 hover:bg-maroon-700 text-beige-50 font-semibold text-base rounded-xl transition-all duration-300 hover:scale-105 mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Analyze Audio
          </Link>
        </div>
      </div>
    );
  }

  const isFake = data.prediction === 'fake';
  const confidence = data.confidence || 0;
  const confidenceLevel = confidence > 0.85 ? 'HIGH' : confidence > 0.6 ? 'MEDIUM' : 'LOW';

  const getRecommendationText = () => {
    if (confidenceLevel === 'HIGH' && isFake) {
      return 'Strong indicators of synthetic audio detected. This audio shows multiple characteristics consistent with AI-generated voice. Exercise extreme caution and verify through alternative channels.';
    }
    if (confidenceLevel === 'HIGH' && !isFake) {
      return 'Audio appears authentic with high confidence. Natural voice patterns, consistent spectral characteristics, and typical human speech artifacts detected.';
    }
    if (confidenceLevel === 'MEDIUM') {
      return 'Some suspicious patterns detected. The confidence level suggests ambiguous results. Additional verification recommended through alternative methods or longer audio samples.';
    }
    return 'Inconclusive results. The audio sample may be too short or contain quality issues. Consider testing with a longer, clearer audio sample for more accurate detection.';
  };

  return (
    <div className={`relative min-h-screen overflow-hidden ${isFake ? 'bg-gradient-to-br from-maroon-900 via-red-950 to-black' : 'bg-gradient-to-br from-green-950 via-brown-900 to-black'}`}>
      {/* Iridescent Background */}
      <div className="absolute inset-0 z-0">
        <Iridescence 
          color={[0.55, 0.16, 0.16]} 
          speed={0.6} 
          amplitude={0.12} 
          mouseReact={true}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Button */}
          <div className="animate-fade-in">
            <Link 
              to="/analyze"
              className="inline-flex items-center gap-2 text-beige-200 hover:text-beige-100 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Analyze Another</span>
            </Link>
          </div>

          {/* Results Header */}
          <div className="text-center space-y-6 animate-fade-in">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-beige-100 mb-3">
                Analysis Complete
              </h1>
              <p className="text-base text-beige-200/80">
                Here's what our AI detected in your audio file
              </p>
              {data.filename && (
                <p className="text-sm text-beige-300 mt-2">
                  File: {data.filename}
                </p>
              )}
            </div>

            {/* Large Badge with Animation */}
            <div className={`inline-block ${confidence > 0.85 ? 'animate-pulse-slow' : ''}`}>
              <DetectionBadge prediction={data.prediction} confidence={confidence} size="large" />
            </div>
          </div>

          {/* Confidence Gauge */}
          <div className="glass-card p-8 shadow-2xl animate-slide-up">
            <ConfidenceGauge confidence={confidence} size="large" />
          </div>

          {/* AI Explanation Card */}
          <div className="bg-beige-100 border border-beige-300 rounded-2xl p-8 shadow-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-maroon-600/20 rounded-xl flex-shrink-0">
                {isFake ? (
                  <XCircle className="w-6 h-6 text-maroon-600" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-brown-800 mb-2">AI Explanation</h2>
                <p className="text-sm text-brown-600">Powered by Google Gemini</p>
              </div>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <p className="text-base text-brown-800 leading-relaxed whitespace-pre-line">
                {data.ai_explanation || 'No explanation available. The model detected patterns in the audio but could not generate a detailed explanation.'}
              </p>
            </div>
          </div>

          {/* Detected Patterns */}
          {data.detected_patterns && data.detected_patterns.length > 0 && (
            <div className="glass-card p-6 shadow-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-base font-semibold text-beige-100 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-maroon-400" />
                Detected Patterns
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.detected_patterns.map((pattern, idx) => (
                  <PatternTag 
                    key={idx}
                    name={pattern.name || pattern}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recommendation Alert */}
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <AlertBox
              variant={confidenceLevel === 'HIGH' ? (isFake ? 'danger' : 'success') : confidenceLevel === 'MEDIUM' ? 'warning' : 'info'}
              title={`${confidenceLevel} Confidence Detection`}
              description={getRecommendationText()}
            />
          </div>

          {/* Additional Context */}
          {confidenceLevel === 'HIGH' && isFake && (
            <div className="glass-card p-6 bg-maroon-600/10 backdrop-blur-lg border-maroon-400/30 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-base font-semibold text-beige-100 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-maroon-400" />
                What This Means
              </h3>
              <ul className="space-y-2 text-sm text-beige-200/80">
                <li className="flex items-start gap-2">
                  <span className="text-maroon-400 flex-shrink-0">•</span>
                  <span>This audio likely contains AI-generated or manipulated voice content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon-400 flex-shrink-0">•</span>
                  <span>Do not rely on this audio for authentication or verification purposes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon-400 flex-shrink-0">•</span>
                  <span>Contact the claimed speaker through verified channels to confirm authenticity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon-400 flex-shrink-0">•</span>
                  <span>Be cautious of any requests for money, information, or actions based on this audio</span>
                </li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <Link 
              to="/analyze"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-maroon-600 hover:bg-maroon-700 text-beige-50 font-semibold text-base rounded-xl shadow-lg hover:shadow-maroon-600/50 transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className="w-5 h-5" />
              Analyze Another File
            </Link>
            
            <Link
              to="/history"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black/40 backdrop-blur-lg hover:bg-black/60 text-beige-100 font-semibold text-base rounded-xl border border-beige-200/20 transition-all duration-300 hover:scale-105"
            >
              View History
            </Link>

            <button
              onClick={() => {
                console.log('Download report for:', data);
                alert('Download report feature coming soon!');
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black/40 backdrop-blur-lg hover:bg-black/60 text-beige-100 font-semibold text-base rounded-xl border border-beige-200/20 transition-all duration-300 hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}