// VoiceGuard AI - Audio Upload & Analysis Component
// Create drag-and-drop zone with file input fallback, validate: accepts only WAV/MP3, max size 10MB
// Show file name and size after selection, display error toast if validation fails, emit selected file to parent via props

import { useState } from 'react'
import axios from 'axios'
import Waveform from './Waveform.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'
import DetectionBadge from './DetectionBadge.jsx'
import ConfidenceGauge from './ConfidenceGauge.jsx'
import { useNavigate } from 'react-router-dom'

export default function AudioUploader() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const navigate = useNavigate()

  async function handleAnalyze() {
    if (!file) return
    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const { data } = await axios.post(import.meta.env.VITE_API_BASE_URL + '/analyze', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(data)
      navigate('/result', { state: { data } })
    } catch (e) {
      console.error(e)
      setResult({ error: 'Analysis failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="glass-card p-4 space-y-3">
        <input
          type="file"
          accept="audio/wav,audio/mp3"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
        />
        {file && <Waveform file={file} />}
        <button
          disabled={!file || loading}
          onClick={handleAnalyze}
          className="px-4 py-2 rounded bg-primary hover:bg-primary-dark disabled:opacity-40 font-medium"
        >
          Analyze
        </button>
      </div>
      {loading && <LoadingSpinner label="Analyzing audio" />}
      {result && !loading && !result.error && (
        <div className="glass-card p-4 space-y-3">
          <DetectionBadge prediction={result.prediction} confidence={result.confidence} />
          <ConfidenceGauge confidence={result.confidence} />
          <div className="text-sm text-gray-300">
            <p className="font-semibold">AI Explanation:</p>
            <p>{result.ai_explanation}</p>
          </div>
        </div>
      )}
      {result?.error && <div className="text-danger text-sm">{result.error}</div>}
    </div>
  )
}
