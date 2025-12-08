// VoiceGuard AI - Live Analysis Service
// Manages continuous audio analysis with backend communication
// Analyzes audio chunks every 10 seconds and maintains history

import axios from 'axios';
import AudioCaptureService from './audioCapture';

class LiveAnalysisService {
  constructor() {
    this.audioCapture = new AudioCaptureService();
    this.isMonitoring = false;
    this.analysisHistory = [];
    this.maxHistorySize = 50;
    this.eventListeners = {
      onStatusChange: [],
      onAnalysisComplete: [],
      onError: []
    };
    this.currentStatus = 'idle'; // idle, listening, analyzing, error
    this.latestResult = null;
    
    // Temporal smoothing for stable predictions
    this.recentPredictions = []; // Last 3 predictions
    this.smoothingWindow = 3; // Number of predictions to average
  }

  /**
   * Register event listener
   */
  on(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].push(callback);
    }
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    }
  }

  /**
   * Emit event to all listeners
   */
  emit(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * Update monitoring status
   */
  setStatus(status) {
    this.currentStatus = status;
    this.emit('onStatusChange', status);
    console.log(`[LiveAnalysis] Status: ${status}`);
  }

  /**
   * Start live monitoring
   * @param {string} mode - Capture mode: 'microphone', 'system', or 'both'
   */
  async start(mode = 'microphone') {
    if (this.isMonitoring) {
      console.log('[LiveAnalysis] Already monitoring');
      return { success: true };
    }

    console.log(`[LiveAnalysis] Starting live monitoring with mode: ${mode}`);
    
    // Reset smoothing filter for new session
    this.resetSmoothingFilter();
    
    // Request permission based on mode
    const permissionResult = await this.audioCapture.requestPermission(mode);
    if (!permissionResult.success) {
      this.setStatus('error');
      this.emit('onError', { message: permissionResult.error });
      return { success: false, error: permissionResult.error };
    }

    // Start recording with chunk callback
    this.audioCapture.startRecording(async (audioBlob) => {
      await this.analyzeChunk(audioBlob);
    });

    this.isMonitoring = true;
    this.setStatus('listening');
    
    console.log('[LiveAnalysis] Monitoring started successfully');
    
    // Return success with warning if audio capture had a fallback
    return { 
      success: true, 
      warning: permissionResult.warning 
    };
  }

  /**
   * Stop live monitoring
   */
  stop() {
    if (!this.isMonitoring) {
      console.log('[LiveAnalysis] Not currently monitoring');
      return;
    }

    console.log('[LiveAnalysis] Stopping live monitoring...');
    
    this.audioCapture.release();
    this.isMonitoring = false;
    this.setStatus('idle');
    
    // Reset smoothing filter
    this.resetSmoothingFilter();
    
    console.log('[LiveAnalysis] Monitoring stopped');
  }

  /**
   * Analyze a single audio chunk
   */
  async analyzeChunk(audioBlob) {
    if (!this.isMonitoring) return;

    this.setStatus('analyzing');
    console.log(`[LiveAnalysis] Analyzing chunk (${audioBlob.size} bytes)...`);

    try {
      const formData = new FormData();
      // Send WebM directly to dedicated live analysis endpoint
      formData.append('file', audioBlob, `live_${Date.now()}.webm`);

      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      // Use dedicated /analyze-live endpoint for real-time monitoring
      const { data } = await axios.post(`${baseUrl}/analyze-live`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000 // 30 second timeout
      });

      // Apply temporal smoothing to stabilize predictions
      const smoothedData = this.applySmoothingFilter(data);

      // Create analysis result with timestamp
      const result = {
        ...smoothedData,
        rawPrediction: data.prediction, // Keep original for debugging
        rawConfidence: data.confidence,
        timestamp: new Date().toISOString(),
        displayTime: new Date().toLocaleTimeString()
      };

      // Update latest result
      this.latestResult = result;

      // Add to history
      this.analysisHistory.unshift(result);
      if (this.analysisHistory.length > this.maxHistorySize) {
        this.analysisHistory.pop();
      }

      // Emit analysis complete event
      this.emit('onAnalysisComplete', result);

      // Log result
      console.log(`[LiveAnalysis] Analysis complete: ${result.prediction} (${(result.confidence * 100).toFixed(1)}%)`);

      // Return to listening state
      this.setStatus('listening');

    } catch (error) {
      console.error('[LiveAnalysis] Analysis failed:', error);
      
      const errorMessage = error.response?.data?.detail 
        || error.message 
        || 'Analysis failed';

      this.emit('onError', { 
        message: errorMessage,
        timestamp: new Date().toISOString()
      });

      // Return to listening state even after error
      this.setStatus('listening');
    }
  }

  /**
   * Apply temporal smoothing to stabilize predictions across chunks
   * Uses moving average of last N predictions to reduce fluctuations
   */
  applySmoothingFilter(data) {
    // Add current prediction to history
    this.recentPredictions.push({
      prediction: data.prediction,
      confidence: data.confidence
    });

    // Keep only last N predictions
    if (this.recentPredictions.length > this.smoothingWindow) {
      this.recentPredictions.shift();
    }

    // Need at least 2 predictions for smoothing
    if (this.recentPredictions.length < 2) {
      return data; // Return original for first prediction
    }

    // Count predictions and average confidence
    let fakeCount = 0;
    let realCount = 0;
    let totalConfidence = 0;

    this.recentPredictions.forEach(pred => {
      if (pred.prediction === 'fake') {
        fakeCount++;
      } else {
        realCount++;
      }
      totalConfidence += pred.confidence;
    });

    // Determine smoothed prediction by majority vote
    const smoothedPrediction = fakeCount > realCount ? 'fake' : 'real';
    const avgConfidence = totalConfidence / this.recentPredictions.length;

    console.log(`[LiveAnalysis] Smoothing: raw=${data.prediction}(${(data.confidence*100).toFixed(1)}%), smoothed=${smoothedPrediction}(${(avgConfidence*100).toFixed(1)}%), window=${this.recentPredictions.length}, fake=${fakeCount}, real=${realCount}`);

    // Return smoothed result
    return {
      ...data,
      prediction: smoothedPrediction,
      confidence: avgConfidence
    };
  }

  /**
   * Reset smoothing filter (call when starting new monitoring session)
   */
  resetSmoothingFilter() {
    this.recentPredictions = [];
    console.log('[LiveAnalysis] Smoothing filter reset');
  }

  /**
   * Get current monitoring status
   */
  getStatus() {
    return {
      isMonitoring: this.isMonitoring,
      currentStatus: this.currentStatus,
      latestResult: this.latestResult,
      historyCount: this.analysisHistory.length
    };
  }

  /**
   * Get analysis history
   */
  getHistory() {
    return [...this.analysisHistory];
  }

  /**
   * Clear analysis history
   */
  clearHistory() {
    this.analysisHistory = [];
    this.latestResult = null;
    console.log('[LiveAnalysis] History cleared');
  }
}

// Singleton instance
const liveAnalysisService = new LiveAnalysisService();
export default liveAnalysisService;
