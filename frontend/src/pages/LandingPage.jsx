import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-text">VoiceGuard AI</h1>
      <p className="text-gray-300 max-w-prose">Upload an audio file and our model will detect whether it is likely a synthetic deepfake. Get an explanation of key patterns that informed the decision.</p>
      <Link to="/analyze" className="inline-block px-6 py-3 rounded bg-primary hover:bg-primary-dark font-semibold">Get Started</Link>
    </div>
  )
}
