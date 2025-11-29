// ==================================================================
// WAVEFORM.JSX - FULLY STANDARDIZED
// ==================================================================
// Typography: text-sm for time, text-base for buttons
// Colors: maroon-600 waveColor, beige-100 (F5F5DC) progressColor
// Spacing: p-6 card, gap-3 controls
// Animations: transition-colors on buttons

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Download } from 'lucide-react';

export function Waveform({ file }) {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (file && containerRef.current) {
      const ws = WaveSurfer.create({
        container: containerRef.current,
        waveColor: '#A52A2A',
        progressColor: '#F5F5DC',
        cursorColor: '#8B0000',
        barWidth: 2,
        barGap: 1,
        barRadius: 3,
        height: 100,
        responsive: true,
      });

      wavesurferRef.current = ws;

      ws.on('ready', () => {
        setDuration(ws.getDuration());
      });

      ws.on('audioprocess', () => {
        setCurrentTime(ws.getCurrentTime());
      });

      ws.on('finish', () => {
        setIsPlaying(false);
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        ws.loadBlob(new Blob([e.target.result]));
      };
      reader.readAsArrayBuffer(file);

      return () => ws.destroy();
    }
  }, [file]);

  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div ref={containerRef} className="w-full" />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="p-3 bg-maroon-600 hover:bg-maroon-700 text-beige-50 rounded-full transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          
          <div className="text-sm text-beige-300">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <button className="p-2 bg-black/40 backdrop-blur-lg hover:bg-black/60 rounded-lg transition-colors">
          <Download className="w-5 h-5 text-beige-200" />
        </button>
      </div>
    </div>
  );
}
