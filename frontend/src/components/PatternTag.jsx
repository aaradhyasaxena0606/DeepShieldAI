// ==================================================================
// PATTERN TAG.JSX - FULLY STANDARDIZED
// ==================================================================
// Typography: text-xs for tag, text-xs for tooltip
// Colors: maroon-600/20 bg, maroon-400/30 border, beige-200 text
// Spacing: px-3 py-1, gap-1
// Animations: hover:scale-105, transition-all duration-300

import { AlertTriangle as AlertTriangle2 } from 'lucide-react';
import { useState } from 'react';

export function PatternTag({ name, description }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <span
        className="inline-flex items-center gap-1 px-3 py-1 bg-maroon-600/20 border border-maroon-400/30 rounded-full text-xs text-beige-200 hover:bg-maroon-600/30 hover:scale-105 transition-all duration-300 cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <AlertTriangle2 className="w-3 h-3" />
        {name}
      </span>

      {description && showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-brown-800 border border-beige-200/20 rounded-lg text-xs text-beige-200 whitespace-nowrap z-10 shadow-xl">
          {description}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-brown-800" />
        </div>
      )}
    </div>
  );
}
