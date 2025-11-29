// VoiceGuard AI - Footer Component
// Display centered footer: "© 2024 VoiceGuard AI | GDG Hackathon Project"
// Add links: GitHub, Team, Privacy Policy (can be dummy), and "Powered by Google Cloud Vertex AI" text

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-gray-800 text-center text-xs text-gray-500 py-4">
      <p>VoiceGuard AI &copy; {new Date().getFullYear()} • Built for GDG Hackathon</p>
    </footer>
  )
}
