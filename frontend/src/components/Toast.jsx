// ==================================================================
// TOAST.JSX - FULLY STANDARDIZED
// ==================================================================
// Typography: text-sm message
// Colors: variant-based (success/error/warning/info), beige-100 text
// Spacing: p-6 toast, gap-3 internal
// Animations: slideInRight with stagger

import { useState as useState3, useEffect as useEffect3 } from 'react';
import { X, CheckCircle as CheckCircle2, AlertCircle as AlertCircle2, AlertTriangle as AlertTriangle3, Info as Info2 } from 'lucide-react';

let toastId = 0;
const toastListeners = new Set();

export const toast = {
  success: (message, duration) => showToast('success', message, duration),
  error: (message, duration) => showToast('error', message, duration),
  warning: (message, duration) => showToast('warning', message, duration),
  info: (message, duration) => showToast('info', message, duration),
};

function showToast(type, message, duration = 3000) {
  const id = toastId++;
  toastListeners.forEach(listener => listener({ id, type, message, duration }));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState3([]);

  useEffect3(() => {
    const listener = (toast) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, toast.duration);
    };

    toastListeners.add(listener);
    return () => toastListeners.delete(listener);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
          style={{ animation: `slideInRight 0.3s ease-out ${index * 0.1}s backwards` }}
        />
      ))}
    </div>
  );
}

function Toast({ type, message, onClose, style }) {
  const config = {
    success: {
      icon: CheckCircle2,
      borderColor: 'border-l-green-500',
      iconColor: 'text-green-400',
      bgColor: 'bg-green-600/20'
    },
    error: {
      icon: AlertCircle2,
      borderColor: 'border-l-red-500',
      iconColor: 'text-red-400',
      bgColor: 'bg-red-600/20'
    },
    warning: {
      icon: AlertTriangle3,
      borderColor: 'border-l-yellow-500',
      iconColor: 'text-yellow-400',
      bgColor: 'bg-yellow-600/20'
    },
    info: {
      icon: Info2,
      borderColor: 'border-l-blue-500',
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-600/20'
    }
  };

  const { icon: Icon, borderColor, iconColor, bgColor } = config[type];

  return (
    <div
      className={`glass-card ${bgColor} border-l-4 ${borderColor} p-6 flex items-start gap-3 shadow-2xl min-w-[300px]`}
      style={style}
    >
      <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
      <p className="text-sm text-beige-100 flex-1">{message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-beige-200/10 rounded transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4 text-beige-300" />
      </button>
    </div>
  );
}
