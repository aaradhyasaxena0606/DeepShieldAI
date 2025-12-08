// VoiceGuard AI - Video Analysis Page (Placeholder)
// Typography: h1 text-5xl md:text-6xl, body text-base, small text-sm
// Colors: maroon-400 icons, beige hierarchy, glass-card with backdrop-blur-lg
// Spacing: p-6 cards, gap-6 grids, py-12 px-4 page
// Animations: animate-fade-in, animate-slide-up, hover:scale-105


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Upload, AlertCircle, Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Iridescence from '../ui/Iridescence';

export default function AnalyzeVideoPage() {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [videoName, setVideoName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('File too large. Maximum size is 50MB.');
        return;
      }
      setVideoFile(file);
      setVideoName(file.name);
      setError('');
    }
  };

  const analyzeVideo = async () => {
    if (!videoFile) return;
    setAnalyzing(true);
    setProgress(0);
    setError('');

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 5, 90));
    }, 500);

    try {
      const formData = new FormData();
      formData.append('file', videoFile);

      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const { data } = await axios.post(`${baseUrl}/analyze-video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearInterval(progressInterval);
      setProgress(100);

      // Save to history
      const history = JSON.parse(localStorage.getItem('voiceguard_history') || '[]');
      history.unshift({
        ...data,
        filename: videoFile.name,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('voiceguard_history', JSON.stringify(history.slice(0, 50)));

      setTimeout(() => {
        navigate('/result', {
          state: { data: { ...data, filename: videoFile.name } },
        });
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      console.error('Video analysis error:', err);
      
      if (err.response) {
        if (err.response.status === 400) {
          setError(`Invalid file: ${err.response.data.detail || 'Please upload a valid video file.'}`);
        } else if (err.response.status === 503) {
          setError('Analysis service unavailable. The ML model may not be loaded.');
        } else {
          setError(`Analysis failed: ${err.response.data.detail || 'Unknown server error'}`);
        }
      } else if (err.request) {
        setError('Cannot connect to server. Please ensure the backend is running.');
      } else {
        setError('Analysis failed. Please try again.');
      }
      setAnalyzing(false);
      setProgress(0);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-maroon-900 via-brown-900 to-black">
      {/* Iridescent Background */}
      <div className="absolute inset-0 z-0">
        <Iridescence color={[0.55, 0.16, 0.16]} speed={0.6} amplitude={0.12} mouseReact={true} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Button */}
          <div className="animate-fade-in">
            <Link 
              to="/home"
              className="inline-flex items-center gap-2 text-beige-200 hover:text-beige-100 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
          </div>

          {/* Header Section */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-lg border border-beige-200/20 rounded-full mb-4">
              <Video className="w-4 h-4 text-maroon-400" />
              <span className="text-sm text-beige-200 font-medium">Video Analysis</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent">
              Analyze Video
            </h1>
            
            <p className="text-base text-beige-200/80 max-w-2xl mx-auto leading-relaxed">
              Upload a video file to detect deepfake content. Our AI analyzes both audio and visual patterns for comprehensive detection.
            </p>
          </div>

          {/* Video Upload Input */}
          <div className="glass-card p-6 animate-fade-in flex flex-col items-center gap-4">
            <label htmlFor="video-upload" className="text-sm font-semibold text-beige-100 mb-2 flex items-center gap-2">
              <Upload className="w-5 h-5 text-maroon-400" />
              Upload Video File
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/mp4,video/mov,video/avi"
              className="block w-full text-sm text-beige-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-maroon-600 file:text-beige-50 hover:file:bg-maroon-700"
              onChange={handleVideoChange}
            />
            {videoName && (
              <div className="text-xs text-beige-300 mt-2">Selected: {videoName}</div>
            )}
            {videoFile && (
              <button
                className="mt-4 px-6 py-2 bg-maroon-600 hover:bg-maroon-700 text-beige-50 font-semibold rounded-lg transition-all duration-300"
                onClick={extractAudio}
                disabled={extracting}
              >
                {extracting ? 'Extracting Audio...' : 'Extract Audio'}
              </button>
            )}
            {audioBlob && (
              <>
                <audio controls src={URL.createObjectURL(audioBlob)} className="mt-4" />
                <button
                  className="mt-4 px-6 py-2 bg-maroon-600 hover:bg-maroon-700 text-beige-50 font-semibold rounded-lg transition-all duration-300"
                  onClick={sendAudioForAnalysis}
                  disabled={analyzing}
                >
                  {analyzing ? 'Analyzing...' : 'Analyze Audio'}
                </button>
              </>
            )}
            {error && (
              <div className="text-xs text-red-400 mt-2">{error}</div>
            )}
          </div>
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
            <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-maroon-600/20 rounded-lg flex-shrink-0">
                  <Upload className="w-5 h-5 text-maroon-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-beige-100 mb-1">Supported Formats</div>
                  <div className="text-xs text-beige-300">MP4, MOV, AVI (Max 50MB)</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-maroon-600/20 rounded-lg flex-shrink-0">
                  <Video className="w-5 h-5 text-maroon-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-beige-100 mb-1">Processing Time</div>
                  <div className="text-xs text-beige-300">Results in 10-30 seconds</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-maroon-600/20 rounded-lg flex-shrink-0">
                  <Shield className="w-5 h-5 text-maroon-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-beige-100 mb-1">Privacy</div>
                  <div className="text-xs text-beige-300">Files not stored</div>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon Card */}
          <div className="glass-card p-12 text-center space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex p-6 bg-maroon-600/20 rounded-3xl mb-4">
              <Video className="w-16 h-16 text-maroon-400" />
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-beige-100">
                Coming Soon
              </h2>
              <p className="text-base text-beige-200/80 max-w-xl mx-auto leading-relaxed">
                Our video deepfake detection feature is currently under development. We're training advanced models to analyze facial movements, lip-sync accuracy, and audio-visual consistency.
              </p>
            </div>

            <div className="pt-4">
              <Link
                to="/home"
                className="inline-flex items-center gap-2 px-8 py-4 bg-maroon-600 hover:bg-maroon-700 text-beige-50 font-semibold text-base rounded-xl transition-all duration-300 hover:scale-105"
              >
                Try Audio Analysis Instead
              </Link>
            </div>
          </div>

          {/* Feature Preview */}
          <div className="glass-card bg-maroon-600/10 backdrop-blur-lg border-maroon-400/30 p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-base font-semibold text-beige-100 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-maroon-400" />
              What to Expect
            </h3>
            <ul className="space-y-2 text-sm text-beige-200/80">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-maroon-400 flex-shrink-0">•</span>
                <span>Multi-modal analysis combining audio and visual deepfake detection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-maroon-400 flex-shrink-0">•</span>
                <span>Facial landmark tracking to detect synthetic face generation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-maroon-400 flex-shrink-0">•</span>
                <span>Lip-sync analysis to identify audio-visual mismatches</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-maroon-400 flex-shrink-0">•</span>
                <span>AI-generated explanations powered by Google Gemini</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}