// VoiceGuard AI - Audio Waveform Visualization Component
// Initialize wavesurfer.js on audio file load, render waveform visualization in #3B82F6 color
// Add play/pause button, show current time and duration, include download button (optional)

import { useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'

export default function Waveform({file}) {
  const containerRef = useRef(null)
  const wavesurferRef = useRef(null)

  useEffect(() => {
    if (file && containerRef.current) {
      const ws = WaveSurfer.create({
        container: containerRef.current,
        waveColor: '#6366F1',
        progressColor: '#818CF8',
        barWidth: 2,
        height: 80,
      })
      wavesurferRef.current = ws
      const reader = new FileReader()
      reader.onload = (e) => {
        ws.loadBlob(new Blob([e.target.result]))
      }
      reader.readAsArrayBuffer(file)
    }
    return () => {
      wavesurferRef.current?.destroy()
    }
  }, [file])

  return <div className="w-full glass-card p-3" ref={containerRef} />
}
