export default function DetectionBadge({prediction, confidence}) {
  if (!prediction) return null
  const isFake = prediction === 'fake'
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow ${isFake ? 'bg-danger/20 text-danger border border-danger/40' : 'bg-success/20 text-success border border-success/40'}`}>
      {isFake ? 'FAKE' : 'REAL'} • {(confidence*100).toFixed(1)}%
    </span>
  )
}
