// VoiceGuard AI - Audio Analysis Page
// Main analysis workflow: Render <AudioUploader /> to accept file, show <Waveform /> preview
// On "Analyze" button click: POST audio to /api/analyze, show <LoadingSpinner /> during processing
// Display results using <ConfidenceGauge />, <DetectionBadge />, and AI explanation text when response arrives

import AudioUploader from '../components/AudioUploader.jsx'

export default function AnalyzePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Analyze Audio</h2>
      <AudioUploader />
    </div>
  )
}
