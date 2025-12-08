// VoiceGuard AI - Audio Capture Service
// Handles microphone and system audio (tab/display) capture using Web Audio API
// Captures 10-second audio chunks and converts to WebM format

class AudioCaptureService {
  constructor() {
    this.mediaStream = null;
    this.displayStream = null;
    this.audioContext = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.onChunkReady = null;
    this.chunkDuration = 10000; // 10 seconds
    this.recordingTimer = null;
    this.captureMode = 'microphone'; // 'microphone' or 'system' or 'both'
  }

  /**
   * Request microphone permission and start capturing
   */
  async requestMicrophonePermission() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000
        } 
      });
      return { success: true, stream: this.mediaStream };
    } catch (error) {
      console.error('[AudioCapture] Microphone permission denied:', error);
      return { 
        success: false, 
        error: error.name === 'NotAllowedError' 
          ? 'Microphone permission denied. Please allow microphone access to use live monitoring.'
          : `Microphone access failed: ${error.message}`
      };
    }
  }

  /**
   * Request display/tab audio capture (system audio)
   */
  async requestSystemAudioPermission() {
    try {
      // Check if getDisplayMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('System audio capture is not supported in this browser. Please use Chrome, Edge, or Firefox.');
      }

      // Request display media with audio (captures tab or screen audio)
      // Note: video: false doesn't work in all browsers, so we include video with minimal constraints
      this.displayStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: {
          width: { ideal: 1 },
          height: { ideal: 1 }
        },
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 16000
        }
      });
      
      // Check if audio track exists
      const audioTracks = this.displayStream.getAudioTracks();
      if (audioTracks.length === 0) {
        // Stop video track if no audio
        this.displayStream.getVideoTracks().forEach(track => track.stop());
        throw new Error('No audio track found. Please select "Share tab audio" or "Share system audio" when prompted.');
      }

      // Stop video tracks since we only need audio
      this.displayStream.getVideoTracks().forEach(track => track.stop());

      console.log('[AudioCapture] System audio stream acquired');
      return { success: true, stream: this.displayStream };
    } catch (error) {
      console.error('[AudioCapture] System audio permission denied:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'System audio access failed.';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'System audio sharing denied. Please allow screen sharing and select "Share tab audio".';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'System audio is not supported in this browser. Falling back to microphone mode. Please use Chrome or Edge for system audio.';
      } else if (error.message.includes('No audio track')) {
        errorMessage = error.message;
      } else {
        errorMessage = `System audio failed: ${error.message}`;
      }
      
      return { 
        success: false, 
        error: errorMessage,
        fallbackToMicrophone: error.name === 'NotSupportedError'
      };
    }
  }

  /**
   * Request permission based on capture mode
   */
  async requestPermission(mode = 'microphone') {
    this.captureMode = mode;

    if (mode === 'microphone') {
      return await this.requestMicrophonePermission();
    } else if (mode === 'system') {
      const result = await this.requestSystemAudioPermission();
      
      // Auto-fallback to microphone if system audio not supported
      if (!result.success && result.fallbackToMicrophone) {
        console.log('[AudioCapture] Falling back to microphone mode');
        this.captureMode = 'microphone';
        const micResult = await this.requestMicrophonePermission();
        if (micResult.success) {
          return {
            success: true,
            stream: micResult.stream,
            warning: 'System audio not supported. Using microphone instead.'
          };
        }
      }
      
      return result;
    } else if (mode === 'both') {
      // Request both and mix them
      const micResult = await this.requestMicrophonePermission();
      const sysResult = await this.requestSystemAudioPermission();
      
      if (!micResult.success && !sysResult.success) {
        return { success: false, error: 'Both microphone and system audio permissions denied.' };
      }
      
      return { success: true, stream: this.mediaStream || this.displayStream };
    }
  }

  /**
   * Start recording audio chunks
   */
  startRecording(onChunkReady) {
    // Use the appropriate stream based on capture mode
    const activeStream = this.displayStream || this.mediaStream;
    
    if (!activeStream) {
      throw new Error('No media stream available. Call requestPermission() first.');
    }

    this.onChunkReady = onChunkReady;
    this.audioChunks = [];

    // Create MediaRecorder with appropriate MIME type
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm';

    this.mediaRecorder = new MediaRecorder(activeStream, {
      mimeType: mimeType,
      audioBitsPerSecond: 128000
    });

    console.log(`[AudioCapture] Recording started with ${this.captureMode} mode, MIME: ${mimeType}`);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      if (this.audioChunks.length > 0) {
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        console.log(`[AudioCapture] Created blob: size=${audioBlob.size} bytes, type=${audioBlob.type}`);
        this.audioChunks = [];
        
        if (this.onChunkReady) {
          // Send WebM directly - backend will handle conversion
          console.log('[AudioCapture] Sending WebM blob to backend');
          this.onChunkReady(audioBlob);
        }

        // Restart recording if still active
        if (this.isRecording && this.mediaRecorder && this.mediaRecorder.state === 'inactive') {
          this.mediaRecorder.start();
          this.scheduleChunkCapture();
        }
      }
    };

    this.isRecording = true;
    this.mediaRecorder.start();
    this.scheduleChunkCapture();
  }

  /**
   * Convert WebM/Opus audio blob to WAV format using Web Audio API
   */
  async convertToWav(audioBlob) {
    try {
      console.log(`[AudioCapture] Starting WAV conversion, blob size: ${audioBlob.size}`);
      
      // Read blob as ArrayBuffer
      const arrayBuffer = await audioBlob.arrayBuffer();
      console.log(`[AudioCapture] ArrayBuffer size: ${arrayBuffer.byteLength}`);
      
      // Create audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Decode audio data
      console.log('[AudioCapture] Decoding audio data...');
      const audioData = await audioContext.decodeAudioData(arrayBuffer);
      
      // Get audio parameters
      const sampleRate = audioData.sampleRate;
      const numberOfChannels = audioData.numberOfChannels;
      const duration = audioData.duration;
      const length = audioData.length;
      
      console.log(`[AudioCapture] Decoded: ${sampleRate}Hz, ${numberOfChannels}ch, ${duration.toFixed(2)}s, ${length} samples`);
      
      // Create WAV file
      const wavBlob = this.encodeWAV(audioData);
      console.log(`[AudioCapture] WAV blob created: size=${wavBlob.size}`);
      return wavBlob;
    } catch (error) {
      console.error('[AudioCapture] WAV conversion error:', error);
      throw error;
    }
  }

  /**
   * Encode PCM audio data to WAV format
   */
  encodeWAV(audioData) {
    const numberOfChannels = audioData.numberOfChannels;
    const sampleRate = audioData.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    // Get interleaved PCM data
    const pcmData = this.getPCM(audioData);
    
    // Create WAV header
    const wavHeader = this.createWavHeader(
      pcmData.length,
      numberOfChannels,
      sampleRate,
      bitDepth
    );
    
    // Combine header and PCM data
    const wavBlob = new Blob([wavHeader, pcmData], { type: 'audio/wav' });
    return wavBlob;
  }

  /**
   * Get interleaved PCM data from AudioBuffer
   */
  getPCM(audioData) {
    const numberOfChannels = audioData.numberOfChannels;
    const sampleRate = audioData.sampleRate;
    const length = audioData.length;
    const bitDepth = 16;
    
    // Get audio data from all channels
    const channels = [];
    for (let i = 0; i < numberOfChannels; i++) {
      channels.push(audioData.getChannelData(i));
    }
    
    // Create PCM buffer
    const pcmLength = length * numberOfChannels * (bitDepth / 8);
    const pcmData = new ArrayBuffer(pcmLength);
    const pcmView = new Int16Array(pcmData);
    
    // Interleave channels and convert to 16-bit PCM
    let index = 0;
    for (let i = 0; i < length; i++) {
      for (let ch = 0; ch < numberOfChannels; ch++) {
        const sample = channels[ch][i];
        // Clamp and convert to 16-bit
        const s = Math.max(-1, Math.min(1, sample));
        pcmView[index++] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
    }
    
    return pcmData;
  }

  /**
   * Create WAV file header
   */
  createWavHeader(pcmLength, numberOfChannels, sampleRate, bitDepth) {
    const byteRate = (sampleRate * numberOfChannels * bitDepth) / 8;
    const blockAlign = (numberOfChannels * bitDepth) / 8;
    const subChunk2Size = pcmLength;
    const chunkSize = 36 + subChunk2Size;
    
    const header = new ArrayBuffer(44);
    const view = new DataView(header);
    
    // "RIFF" chunk descriptor
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, chunkSize, true);
    this.writeString(view, 8, 'WAVE');
    
    // "fmt " subchunk
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // subChunk1Size
    view.setUint16(20, 1, true); // audioFormat (1 = PCM)
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    
    // "data" subchunk
    this.writeString(view, 36, 'data');
    view.setUint32(40, subChunk2Size, true);
    
    return header;
  }

  /**
   * Write string to DataView
   */
  writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  /**
   * Schedule automatic chunk capture every 10 seconds
   */
  scheduleChunkCapture() {
    if (this.recordingTimer) {
      clearTimeout(this.recordingTimer);
    }

    this.recordingTimer = setTimeout(() => {
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.stop();
      }
    }, this.chunkDuration);
  }

  /**
   * Stop recording and release resources
   */
  stopRecording() {
    this.isRecording = false;

    if (this.recordingTimer) {
      clearTimeout(this.recordingTimer);
      this.recordingTimer = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    console.log('[AudioCapture] Recording stopped');
  }

  /**
   * Release all resources and stop media stream
   */
  release() {
    this.stopRecording();

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.displayStream) {
      this.displayStream.getTracks().forEach(track => track.stop());
      this.displayStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.mediaRecorder = null;
    this.audioChunks = [];
    this.onChunkReady = null;

    console.log('[AudioCapture] Resources released');
  }

  /**
   * Check if microphone is currently active
   */
  isActive() {
    return this.isRecording && this.mediaRecorder && this.mediaRecorder.state === 'recording';
  }
}

export default AudioCaptureService;
