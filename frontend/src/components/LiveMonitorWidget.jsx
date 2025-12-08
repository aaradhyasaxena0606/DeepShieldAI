// VoiceGuard AI - Live Monitor Widget (Floating Notification)
// Persistent bottom-right widget showing live monitoring status
// Stays visible across all pages when monitoring is enabled

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, XCircle, CheckCircle, AlertCircle, ChevronUp, ChevronDown, Activity } from 'lucide-react';
import { useLiveMonitor } from '../contexts/LiveMonitorContext';
import { DetectionBadge } from './DetectionBadge';

export function LiveMonitorWidget() {
  const { isEnabled, currentStatus, latestResult, error } = useLiveMonitor();
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render if monitoring is disabled
  if (!isEnabled) return null;

  const getStatusConfig = () => {
    switch (currentStatus) {
      case 'listening':
        return {
          icon: Radio,
          color: 'text-blue-400',
          bgColor: 'bg-blue-600/20',
          text: 'Listening...',
          pulseClass: 'animate-pulse'
        };
      case 'analyzing':
        return {
          icon: Activity,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-600/20',
          text: 'Analyzing...',
          pulseClass: 'animate-pulse'
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: 'text-red-400',
          bgColor: 'bg-red-600/20',
          text: 'Error',
          pulseClass: ''
        };
      default:
        return {
          icon: Radio,
          color: 'text-beige-400',
          bgColor: 'bg-beige-600/20',
          text: 'Idle',
          pulseClass: ''
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 right-6 z-50"
      style={{ maxWidth: isExpanded ? '400px' : '280px' }}
    >
      <div className="glass-card bg-black/80 backdrop-blur-xl border border-beige-200/20 shadow-2xl overflow-hidden">
        {/* Header - Always Visible */}
        <div
          className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`p-2 ${statusConfig.bgColor} rounded-lg ${statusConfig.pulseClass}`}>
                <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-beige-100">Live Monitor</div>
                <div className={`text-xs ${statusConfig.color}`}>{statusConfig.text}</div>
              </div>
            </div>

            <button 
              className="p-1 hover:bg-white/10 rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-beige-300" />
              ) : (
                <ChevronUp className="w-4 h-4 text-beige-300" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-beige-200/10"
            >
              <div className="p-4 space-y-3">
                {/* Error Message */}
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-600/20 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-300">{error}</p>
                  </div>
                )}

                {/* Latest Result */}
                {latestResult && !error && (
                  <div className="space-y-3">
                    <div className="text-xs text-beige-300 font-medium">Latest Detection:</div>
                    
                    {/* Simple Result Display - Just FAKE/REAL */}
                    <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold uppercase ${
                          latestResult.prediction === 'fake' ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {latestResult.prediction}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xs text-beige-400">
                          {latestResult.displayTime}
                        </div>
                      </div>
                    </div>

                    {/* Confidence Bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-black/40 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            latestResult.prediction === 'fake'
                              ? 'bg-red-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${latestResult.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* No Results Yet */}
                {!latestResult && !error && currentStatus === 'listening' && (
                  <div className="text-center py-4">
                    <Radio className="w-8 h-8 text-blue-400 mx-auto mb-2 animate-pulse" />
                    <p className="text-xs text-beige-300">
                      Listening for audio...
                    </p>
                    <p className="text-xs text-beige-400 mt-1">
                      First analysis in progress
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
