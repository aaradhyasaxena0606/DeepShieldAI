// VoiceGuard AI - Live Monitor Context
// Global state management for live audio monitoring
// Provides hooks and state across the application

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import liveAnalysisService from '../services/liveAnalysisService';

const LiveMonitorContext = createContext(null);

export function LiveMonitorProvider({ children }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('idle');
  const [latestResult, setLatestResult] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [error, setError] = useState(null);
  const [audioMode, setAudioMode] = useState('microphone'); // 'microphone', 'system', or 'both'

  // Load persisted state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('voiceguard_live_monitoring');
    if (savedState) {
      try {
        const { isEnabled: savedEnabled, audioMode: savedMode } = JSON.parse(savedState);
        if (savedMode) {
          setAudioMode(savedMode);
        }
        if (savedEnabled) {
          // Auto-start monitoring if it was enabled
          startMonitoring(savedMode || 'microphone');
        }
      } catch (err) {
        console.error('[LiveMonitor] Failed to load saved state:', err);
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('voiceguard_live_monitoring', JSON.stringify({ 
      isEnabled,
      audioMode
    }));
  }, [isEnabled, audioMode]);

  // Set up event listeners
  useEffect(() => {
    const handleStatusChange = (status) => {
      setCurrentStatus(status);
    };

    const handleAnalysisComplete = (result) => {
      setLatestResult(result);
      setAnalysisHistory(prev => [result, ...prev.slice(0, 49)]);
      setError(null);
    };

    const handleError = (errorData) => {
      setError(errorData.message);
      // Clear error after 10 seconds
      setTimeout(() => setError(null), 10000);
    };

    liveAnalysisService.on('onStatusChange', handleStatusChange);
    liveAnalysisService.on('onAnalysisComplete', handleAnalysisComplete);
    liveAnalysisService.on('onError', handleError);

    return () => {
      liveAnalysisService.off('onStatusChange', handleStatusChange);
      liveAnalysisService.off('onAnalysisComplete', handleAnalysisComplete);
      liveAnalysisService.off('onError', handleError);
    };
  }, []);

  const startMonitoring = useCallback(async (mode = 'microphone') => {
    setAudioMode(mode);
    const result = await liveAnalysisService.start(mode);
    if (result.success) {
      setIsEnabled(true);
      setError(null);
      
      // Show warning if fell back to microphone
      if (result.warning) {
        setError(result.warning);
        // Clear warning after 5 seconds
        setTimeout(() => setError(null), 5000);
      }
    } else {
      setError(result.error);
      setIsEnabled(false);
    }
    return result;
  }, []);

  const stopMonitoring = useCallback(() => {
    liveAnalysisService.stop();
    setIsEnabled(false);
    setCurrentStatus('idle');
  }, []);

  const clearHistory = useCallback(() => {
    liveAnalysisService.clearHistory();
    setAnalysisHistory([]);
    setLatestResult(null);
  }, []);

  const value = {
    isEnabled,
    currentStatus,
    latestResult,
    analysisHistory,
    error,
    audioMode,
    startMonitoring,
    stopMonitoring,
    clearHistory
  };

  return (
    <LiveMonitorContext.Provider value={value}>
      {children}
    </LiveMonitorContext.Provider>
  );
}

export function useLiveMonitor() {
  const context = useContext(LiveMonitorContext);
  if (!context) {
    throw new Error('useLiveMonitor must be used within LiveMonitorProvider');
  }
  return context;
}

export function useLatestDetection() {
  const { latestResult } = useLiveMonitor();
  return latestResult;
}
