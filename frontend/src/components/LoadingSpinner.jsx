// VoiceGuard AI - Loading Spinner Animation Component
// Render centered loading animation: spinning circle or dots, show text "Analyzing audio..." below
// Use Tailwind animations or CSS @keyframes, make it overlay the screen with semi-transparent background

export default function LoadingSpinner({label='Processing'}) {
  return (
    <div className="flex flex-col items-center gap-2 py-6">
      <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      <span className="text-sm text-gray-400">{label}...</span>
    </div>
  )
}
