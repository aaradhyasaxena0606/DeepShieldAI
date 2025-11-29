// ==================================================================
// ALERT BOX.JSX - FULLY STANDARDIZED
// ==================================================================
// Typography: font-semibold title, text-sm body
// Colors: variant-based (success/warning/danger/info) with maroon accent
// Spacing: p-6, gap-3
// Animations: none (static component)

import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export function AlertBox({ variant = 'info', title, description, actionLabel, onAction }) {
  const config = {
    success: {
      icon: CheckCircle,
      borderColor: 'border-l-green-500',
      iconColor: 'text-green-400',
      bgColor: 'bg-green-600/20'
    },
    warning: {
      icon: AlertTriangle,
      borderColor: 'border-l-yellow-500',
      iconColor: 'text-yellow-400',
      bgColor: 'bg-yellow-600/20'
    },
    danger: {
      icon: AlertCircle,
      borderColor: 'border-l-red-500',
      iconColor: 'text-red-400',
      bgColor: 'bg-red-600/20'
    },
    info: {
      icon: Info,
      borderColor: 'border-l-blue-500',
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-600/20'
    }
  };

  const { icon: Icon, borderColor, iconColor, bgColor } = config[variant];

  return (
    <div className={`glass-card ${bgColor} border-l-4 ${borderColor} p-6 flex items-start gap-3`}>
      <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-beige-100 mb-1">{title}</h4>
        <p className="text-sm text-beige-200/80 leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-black/40 backdrop-blur-lg hover:bg-black/60 text-beige-100 text-sm font-medium rounded-lg transition-colors flex-shrink-0"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
