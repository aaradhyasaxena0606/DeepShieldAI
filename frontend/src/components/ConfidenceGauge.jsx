// ==================================================================
// CONFIDENCE GAUGE.JSX - FULLY STANDARDIZED
// ==================================================================
// Typography: text-4xl value, text-sm label
// Colors: maroon-400 for gauge elements, green/yellow/red for confidence
// Spacing: gap-4 vertical spacing
// Animations: 1.5s animation for needle

import { useEffect as useEffect2, useState as useState2 } from 'react';

export function ConfidenceGauge({ confidence = 0, size = 'large' }) {
  const [animatedValue, setAnimatedValue] = useState2(0);
  
  useEffect2(() => {
    const duration = 1500;
    const steps = 60;
    const increment = confidence / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= confidence) {
        setAnimatedValue(confidence);
        clearInterval(timer);
      } else {
        setAnimatedValue(current);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [confidence]);

  const pct = Math.min(Math.max(animatedValue, 0), 1);
  const angle = pct * 180; // 0 to 180 degrees for semicircle
  const percentage = (pct * 100).toFixed(1);
  
  const getColor = () => {
    if (pct < 0.4) return 'text-red-400';
    if (pct < 0.7) return 'text-yellow-400';
    return 'text-green-400';
  };

  const dimensions = size === 'small' ? { w: 120, h: 60 } : size === 'large' ? { w: 300, h: 150 } : { w: 240, h: 120 };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: dimensions.w, height: dimensions.h }}>
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          
          {/* Track */}
          <path
            d="M 10 45 A 40 40 0 0 1 90 45"
            stroke="url(#gaugeGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Tick marks without numbers */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const tickAngle = (tick / 100) * Math.PI;
            const x1 = 50 - 38 * Math.cos(tickAngle);
            const y1 = 45 - 38 * Math.sin(tickAngle);
            const x2 = 50 - 42 * Math.cos(tickAngle);
            const y2 = 45 - 42 * Math.sin(tickAngle);
            
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(245, 245, 220, 0.3)"
                strokeWidth="2"
              />
            );
          })}
          
          {/* Needle - starts at left (0%) and moves clockwise to right (100%) */}
          <line
            x1="50"
            y1="45"
            x2={50 + 35 * Math.cos((180 - angle) * Math.PI / 180)}
            y2={45 - 35 * Math.sin((180 - angle) * Math.PI / 180)}
            stroke="#8B0000"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ transition: 'all 0.3s ease-out' }}
          />
          
          {/* Center dot */}
          <circle cx="50" cy="45" r="3" fill="#8B0000" />
        </svg>
      </div>
      
      <div className="text-center">
        <div className={`text-4xl font-bold ${getColor()}`}>
          {percentage}%
        </div>
        <div className="text-sm text-beige-300 mt-1">Confidence Score</div>
      </div>
    </div>
  );
}
