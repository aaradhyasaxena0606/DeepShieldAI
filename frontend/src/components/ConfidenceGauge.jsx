export default function ConfidenceGauge({confidence=0}) {
  const pct = Math.min(Math.max(confidence,0),1)
  const angle = pct * 180
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-48 h-24">
        <div className="absolute inset-0 flex items-end justify-center">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <defs>
              <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
            <path d="M5 45 A45 45 0 0 1 95 45" stroke="url(#g)" strokeWidth="10" fill="none" strokeLinecap="round" />
            <line x1="50" y1="45" x2={50 + 40*Math.cos(Math.PI - angle*Math.PI/180)} y2={45 - 40*Math.sin(Math.PI - angle*Math.PI/180)} stroke="#6366F1" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <div className="text-sm text-gray-300">Confidence: {(pct*100).toFixed(1)}%</div>
    </div>
  )
}
