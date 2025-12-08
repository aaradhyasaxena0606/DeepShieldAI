// VoiceGuard AI - Live Analysis Page (Placeholder)
// Typography: h1 text-5xl md:text-6xl, body text-base, small text-sm
// Colors: maroon-400 icons, beige hierarchy, glass-card with backdrop-blur-lg
// Spacing: p-6 cards, gap-6 grids, py-12 px-4 page
// Animations: animate-fade-in, animate-slide-up, hover:scale-105

import { Radio, Download, Chrome, AlertCircle, Shield, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Iridescence from '../ui/Iridescence';

export default function AnalyzeLivePage() {
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
              <Radio className="w-4 h-4 text-maroon-400" />
              <span className="text-sm text-beige-200 font-medium">Live Analysis</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent">
              Real-Time Detection
            </h1>
            
            <p className="text-base text-beige-200/80 max-w-2xl mx-auto leading-relaxed">
              Analyze audio in real-time with our browser extension. Detect deepfakes as you browse any website.
            </p>
          </div>

          {/* Extension Download Card */}
          <div className="glass-card p-8 text-center space-y-6 animate-slide-up">
            <div className="inline-flex p-6 bg-maroon-600/20 rounded-3xl mb-4">
              <Chrome className="w-16 h-16 text-maroon-400" />
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-beige-100">
                Browser Extension
              </h2>
              <p className="text-base text-beige-200/80 max-w-xl mx-auto leading-relaxed">
                Download our Chrome extension to enable real-time deepfake detection on any website you visit.
              </p>
            </div>

            <button
              disabled
              className="inline-flex items-center gap-2 px-8 py-4 bg-maroon-600/50 text-beige-50 font-semibold text-base rounded-xl cursor-not-allowed opacity-50"
            >
              <Download className="w-5 h-5" />
              Download Extension (Beta)
            </button>

            <p className="text-xs text-beige-300">
              Currently in closed beta • Chrome Web Store coming soon
            </p>
          </div>

          {/* How It Works */}
          <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl font-bold text-beige-100 mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-maroon-400" />
              How It Works
            </h3>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-maroon-600/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-maroon-400">1</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-beige-100 mb-1">Install Extension</h4>
                  <p className="text-sm text-beige-200/80">Download and install the VoiceGuard AI extension from the Chrome Web Store.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-maroon-600/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-maroon-400">2</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-beige-100 mb-1">Activate Detection</h4>
                  <p className="text-sm text-beige-200/80">Click the extension icon and enable real-time audio monitoring.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-maroon-600/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-maroon-400">3</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-beige-100 mb-1">Browse Safely</h4>
                  <p className="text-sm text-beige-200/80">The extension analyzes audio on the page and alerts you if deepfakes are detected.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass-card p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <h4 className="text-base font-semibold text-beige-100">Real-Time Analysis</h4>
              </div>
              <p className="text-sm text-beige-200/80">
                Instant deepfake detection as audio plays on any website without interrupting playback.
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <h4 className="text-base font-semibold text-beige-100">Privacy First</h4>
              </div>
              <p className="text-sm text-beige-200/80">
                All analysis happens locally in your browser. No audio data is sent to external servers.
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <h4 className="text-base font-semibold text-beige-100">Visual Alerts</h4>
              </div>
              <p className="text-sm text-beige-200/80">
                Get instant visual notifications when suspicious audio patterns are detected.
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <h4 className="text-base font-semibold text-beige-100">Works Everywhere</h4>
              </div>
              <p className="text-sm text-beige-200/80">
                Compatible with YouTube, social media, video calls, and any website with audio content.
              </p>
            </div>
          </div>

          {/* Beta Notice */}
          <div className="glass-card bg-maroon-600/10 backdrop-blur-lg border-maroon-400/30 p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-base font-semibold text-beige-100 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-maroon-400" />
              Beta Program
            </h3>
            <p className="text-sm text-beige-200/80 mb-4">
              Our browser extension is currently in closed beta testing. We're working with a limited group of users to refine the experience before public release.
            </p>
            <p className="text-sm text-beige-200/80">
              Want early access? Join our waitlist to be notified when the extension launches on the Chrome Web Store.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
