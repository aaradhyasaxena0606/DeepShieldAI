// VoiceGuard AI - Audio Utility Helpers
// validateAudioFile(file): Check file type (audio/wav, audio/mpeg, audio/mp3), check size (<10MB), return {valid, error}
// formatDuration(seconds): Convert seconds to "MM:SS" format for display
// formatFileSize(bytes): Convert bytes to "MB" or "KB" for display

// Placeholder helpers for audio feature extraction in frontend (if needed later)
export function formatDuration(seconds){
  if (!seconds && seconds !== 0) return '0:00'
  const m = Math.floor(seconds/60)
  const s = Math.floor(seconds%60).toString().padStart(2,'0')
  return `${m}:${s}`
}
