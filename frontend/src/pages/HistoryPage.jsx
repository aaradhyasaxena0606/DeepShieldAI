// VoiceGuard AI - Analysis History Page (Optional Feature)
// Retrieve past analyses from localStorage (key: "voiceguard_history"), display as cards/table
// Each entry shows: timestamp, filename, prediction, confidence, with "View Details" button
// If empty, show empty state: "No analysis history yet. Analyze your first audio!"

export default function HistoryPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Analysis History</h2>
      <p className="text-sm text-gray-400">(Optional feature) This will list previous analyses when persistence is implemented.</p>
    </div>
  )
}
