/ ==================================================================
// LOADING SPINNER.JSX - FULLY STANDARDIZED
// ==================================================================
// Typography: text-sm for inline, text-base for card/overlay
// Colors: maroon-600 spinner, beige-200/300 text
// Spacing: p-6 for card variant, py-12 for default
// Animations: spinner class for rotation

export function LoadingSpinner({ variant = 'card', label = 'Loading' }) {
  if (variant === 'overlay') {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-lg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto border-4 border-maroon-600/30 border-t-maroon-600 rounded-full spinner" />
          <p className="text-base text-beige-200 animate-pulse">{label}...</p>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="inline-flex items-center gap-2">
        <div className="w-5 h-5 border-2 border-maroon-600/30 border-t-maroon-600 rounded-full spinner" />
        <span className="text-sm text-beige-300">{label}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="w-12 h-12 border-4 border-maroon-600/30 border-t-maroon-600 rounded-full spinner" />
      <p className="text-base text-beige-300 animate-pulse">{label}...</p>
    </div>
  );
}
