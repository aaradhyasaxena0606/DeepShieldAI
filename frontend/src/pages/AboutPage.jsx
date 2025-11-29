// VoiceGuard AI - About/Team Information Page
// Display team members with photos/avatars and roles (Person 1-5), tech stack with logos
// Embed architecture diagram, explain how VoiceGuard works in 3 steps, add hackathon disclaimer
// Include "Built with Google Cloud" badge and GitHub repo link

export default function AboutPage() {
  return (
    <div className="space-y-4 max-w-prose">
      <h2 className="text-2xl font-semibold">About</h2>
      <p className="text-sm text-gray-300">VoiceGuard AI is a hackathon project demonstrating practical deepfake audio detection with interpretable explanations. It combines a lightweight CNN model and a simple pattern-based RAG layer powered by Gemini.</p>
    </div>
  )
}
