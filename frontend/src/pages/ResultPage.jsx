import { useLocation, Link } from 'react-router-dom'
import DetectionBadge from '../components/DetectionBadge.jsx'
import ConfidenceGauge from '../components/ConfidenceGauge.jsx'

export default function ResultPage() {
  const { state } = useLocation()
  const data = state?.data
  if (!data) return <p>No result. <Link to="/analyze" className="text-primary">Analyze audio</Link>.</p>
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Result</h2>
      <div className="glass-card p-4 space-y-3">
        <DetectionBadge prediction={data.prediction} confidence={data.confidence} />
        <ConfidenceGauge confidence={data.confidence} />
        <div>
          <p className="font-semibold text-sm mb-1">AI Explanation</p>
          <p className="text-sm text-gray-300">{data.ai_explanation}</p>
        </div>
        <div className="text-xs text-gray-400">
          <p>Patterns: {data.detected_patterns?.map(p => p.name).join(', ') || 'None'}</p>
        </div>
      </div>
      <Link to="/analyze" className="inline-block px-4 py-2 rounded bg-primary hover:bg-primary-dark text-sm font-medium">Analyze Another</Link>
    </div>
  )
}
