// ==================================================================
// DETECTION BADGE.JSX - FULLY STANDARDIZED
// ==================================================================
// Typography: text-xs/sm/lg based on size
// Colors: red-300/green-300 text, red-600/green-600 bg with 20% opacity
// Spacing: px-3/4/6 py-1/2/3 based on size
// Animations: animate-pulse-slow for high confidence

import { CheckCircle, XCircle } from 'lucide-react';

export function DetectionBadge({ prediction, confidence, size = 'medium' }) {
  if (!prediction) return null;

  const isFake = prediction === 'fake';
  const pct = (confidence * 100).toFixed(1);
  const confidenceLevel = confidence > 0.85 ? 'HIGH' : confidence > 0.6 ? 'MEDIUM' : 'LOW';

  const sizeClasses = {
    small: 'text-xs px-3 py-1',
    medium: 'text-sm px-4 py-2',
    large: 'text-base px-6 py-3'
  };

  const Icon = isFake ? XCircle : CheckCircle;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full font-bold border-2 ${sizeClasses[size]} ${
        isFake
          ? 'bg-red-600/20 text-red-300 border-red-500/40'
          : 'bg-green-600/20 text-green-300 border-green-500/40'
      } ${confidenceLevel === 'HIGH' ? 'animate-pulse-slow' : ''}`}
    >
      <Icon className="w-4 h-4" />
      <span>{isFake ? 'FAKE' : 'REAL'}</span>
      <span className="opacity-70">•</span>
      <span>{pct}%</span>
    </div>
  );
}