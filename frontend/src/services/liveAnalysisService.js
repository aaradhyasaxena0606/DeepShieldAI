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
      // Use .wav extension since we're converting to WAV
      formData.append('file', audioBlob, `live_${Date.now()}.wav`);

      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const { data } = await axios.post(`${baseUrl}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000 // 30 second timeout
      });

      // Create analysis result with timestamp
      const result = {
        ...data,
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
