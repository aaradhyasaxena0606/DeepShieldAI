// VoiceGuard AI - Live Analysis Page
// Typography: h1 text-5xl md:text-6xl, body text-base, small text-sm
// Colors: maroon-400 icons, beige hierarchy, glass-card with backdrop-blur-lg
// Spacing: p-6 cards, gap-6 grids, py-12 px-4 page
// Animations: animate-fade-in, animate-slide-up, hover:scale-105

import { useState } from 'react';
import { Radio, Mic, AlertCircle, Shield, ArrowLeft, Activity, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLiveMonitor } from '../contexts/LiveMonitorContext';
import { DetectionBadge } from '../components/DetectionBadge';
import Iridescence from '../ui/Iridescence';

export default function AnalyzeLivePage() {
  const { 
    isEnabled, 
    currentStatus, 
    latestResult, 
    analysisHistory, 
    error,
    audioMode,
    startMonitoring, 
    stopMonitoring,
    clearHistory 
  } = useLiveMonitor();

  const [isStarting, setIsStarting] = useState(false);
  const [selectedMode, setSelectedMode] = useState(audioMode || 'microphone');

  const handleToggleMonitoring = async () => {
    if (isEnabled) {
      stopMonitoring();
    } else {
      setIsStarting(true);
      await startMonitoring(selectedMode);
      setIsStarting(false);
    }
  };

  const getStatusIcon = () => {
    switch (currentStatus) {
      case 'listening':
        return <Radio className="w-6 h-6 text-blue-400 animate-pulse" />;
      case 'analyzing':
        return <Activity className="w-6 h-6 text-yellow-400 animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Mic className="w-6 h-6 text-beige-400" />;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-maroon-900 via-brown-900 to-black">
      {/* Iridescent Background */}
      <div className="absolute inset-0 z-0">
        <Iridescence color={[0.55, 0.16, 0.16]} speed={0.6} amplitude={0.12} mouseReact={true} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Button */}
          <div className="animate-fade-in">
            <Link 
              to="/home"
              className="inline-flex items-center gap-2 text-beige-200 hover:text-beige-100 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
          </div>

          {/* Header Section */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-lg border border-beige-200/20 rounded-full mb-4">
              <Radio className="w-4 h-4 text-maroon-400" />
              <span className="text-sm text-beige-200 font-medium">Live Analysis</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent">
              Real-Time Detection
            </h1>
            
            <p className="text-base text-beige-200/80 max-w-2xl mx-auto leading-relaxed">
              Enable live monitoring to analyze audio from your microphone every 10 seconds. Get instant deepfake detection alerts.
            </p>
          </div>

          {/* Control Card */}
          <div className="glass-card p-8 text-center space-y-6 animate-slide-up">
            {/* Audio Source Selection - Only show when monitoring is NOT active */}
            {!isEnabled && (
              <div className="space-y-3 mb-6">
                <p className="text-sm text-beige-200/80 font-medium">Select Audio Source:</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setSelectedMode('microphone')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedMode === 'microphone'
                        ? 'border-maroon-400 bg-maroon-600/30 text-beige-100'
                        : 'border-beige-200/20 bg-black/20 text-beige-300 hover:border-maroon-400/50'
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                    <span className="text-sm font-medium">Microphone</span>
                  </button>
                  <button
                    onClick={() => setSelectedMode('system')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedMode === 'system'
                        ? 'border-maroon-400 bg-maroon-600/30 text-beige-100'
                        : 'border-beige-200/20 bg-black/20 text-beige-300 hover:border-maroon-400/50'
                    }`}
                  >
                    <Radio className="w-5 h-5" />
                    <span className="text-sm font-medium">System Audio</span>
                  </button>
                </div>
                {selectedMode === 'system' && (
                  <p className="text-xs text-beige-300/70 max-w-md mx-auto">
                    System audio requires screen sharing permission. Select "Tab Audio" or "System Audio" when prompted (no video will be captured).
                  </p>
                )}
              </div>
            )}

            {/* Status Indicator */}
            <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-black/40 backdrop-blur-lg border border-beige-200/20 rounded-full">
              {getStatusIcon()}
              <span className="text-base font-semibold text-beige-100">
                {currentStatus === 'listening' && `Monitoring ${audioMode === 'system' ? 'System Audio' : 'Microphone'}`}
                {currentStatus === 'analyzing' && 'Analyzing Audio...'}
                {currentStatus === 'error' && 'Error Occurred'}
                {currentStatus === 'idle' && 'Monitoring Inactive'}
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="glass-card bg-red-600/20 border-l-4 border-l-red-500 p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300 text-left">{error}</p>
              </div>
            )}

            {/* Enable/Disable Button */}
            <button
              onClick={handleToggleMonitoring}
              disabled={isStarting}
              className={`inline-flex items-center justify-center gap-3 px-8 py-4 font-semibold text-base rounded-xl shadow-lg transition-all duration-300 hover:scale-105 ${
                isEnabled
                  ? 'bg-red-600 hover:bg-red-700 text-beige-50'
                  : 'bg-maroon-600 hover:bg-maroon-700 text-beige-50'
              } ${isStarting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isStarting ? (
                <>
                  <Activity className="w-5 h-5 animate-spin" />
                  Starting...
                </>
              ) : isEnabled ? (
                <>
                  <XCircle className="w-5 h-5" />
                  Stop Monitoring
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  Enable Live Monitoring
                </>
              )}
            </button>

            {isEnabled && (
              <p className="text-xs text-beige-300">
                Live monitoring widget active. Results will appear in the bottom-right corner.
              </p>
            )}
          </div>

          {/* Latest Result */}
          {latestResult && isEnabled && (
            <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-base font-semibold text-beige-100 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-maroon-400" />
                Latest Detection
              </h3>
              
              <div className="flex items-center justify-between gap-4 p-4 bg-black/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <DetectionBadge
                    prediction={latestResult.prediction}
                    confidence={latestResult.confidence}
                    size="medium"
                  />
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-beige-100">
                    {(latestResult.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-beige-300">
                    {latestResult.displayTime}
                  </div>
                </div>
              </div>

              {latestResult.detected_patterns && latestResult.detected_patterns.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs text-beige-300 mb-2">Detected Patterns:</div>
                  <div className="flex flex-wrap gap-2">
                    {latestResult.detected_patterns.map((pattern, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-maroon-600/20 border border-maroon-400/30 rounded-full text-xs text-beige-200"
                      >
                        {pattern.name || pattern}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Analysis History */}
          {analysisHistory.length > 0 && isEnabled && (
            <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-beige-100 flex items-center gap-2">
                  <Radio className="w-5 h-5 text-maroon-400" />
                  Recent Detections ({analysisHistory.length})
                </h3>
                <button
                  onClick={clearHistory}
                  className="text-xs text-beige-300 hover:text-beige-100 transition-colors"
                >
                  Clear History
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {analysisHistory.slice(0, 10).map((result, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                  >
                    <DetectionBadge
                      prediction={result.prediction}
                      confidence={result.confidence}
                      size="small"
                    />
                    
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-beige-100">
                        {(result.confidence * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-beige-300">
                        {result.displayTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How It Works */}
          <div className="glass-card bg-maroon-600/10 backdrop-blur-lg border-maroon-400/30 p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-base font-semibold text-beige-100 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-maroon-400" />
              How It Works
            </h3>
            <ul className="space-y-2 text-sm text-beige-200/80">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-maroon-400 flex-shrink-0">1.</span>
                <span>Select audio source (Microphone or System Audio)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-maroon-400 flex-shrink-0">2.</span>
                <span>Click "Enable Live Monitoring" and grant permission (for System Audio, allow screen sharing and select "Tab Audio")</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-maroon-400 flex-shrink-0">3.</span>
                <span>System captures 10-second audio chunks in real-time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-maroon-400 flex-shrink-0">4.</span>
                <span>Each chunk is automatically analyzed by our CNN model every 10 seconds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-maroon-400 flex-shrink-0">5.</span>
                <span>Results appear instantly in the floating widget (bottom-right) with confidence scores</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-maroon-400 flex-shrink-0">6.</span>
                <span>Widget stays visible across all pages until you click "Stop Monitoring"</span>
              </li>
            </ul>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-maroon-600/20 rounded-lg flex-shrink-0">
                  <Radio className="w-5 h-5 text-maroon-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-beige-100 mb-1">Continuous</div>
                  <div className="text-xs text-beige-300">Analyzes every 10 seconds</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-maroon-600/20 rounded-lg flex-shrink-0">
                  <Mic className="w-5 h-5 text-maroon-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-beige-100 mb-1">Flexible Source</div>
                  <div className="text-xs text-beige-300">Microphone or system audio</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-maroon-600/20 rounded-lg flex-shrink-0">
                  <Shield className="w-5 h-5 text-maroon-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-beige-100 mb-1">Privacy</div>
                  <div className="text-xs text-beige-300">Audio not stored</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
