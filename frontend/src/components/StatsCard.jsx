// ==================================================================
// STATS CARD.JSX - FULLY STANDARDIZED
// ==================================================================
// Typography: text-4xl value, text-sm label, text-xs trend
// Colors: maroon-400 icons, beige-100 value, beige-300 label
// Spacing: p-6, gap-4
// Animations: hover:scale-105, transition-all duration-300

import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatsCard({ icon: Icon, value, label, trend, trendUp }) {
  return (
    <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-maroon-600/20 rounded-xl">
          <Icon className="w-8 h-8 text-maroon-400" />
        </div>
        <div className="flex-1">
          <div className="text-4xl font-bold text-beige-100 mb-1">{value}</div>
          <div className="text-sm text-beige-300">{label}</div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
              {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{trend}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

