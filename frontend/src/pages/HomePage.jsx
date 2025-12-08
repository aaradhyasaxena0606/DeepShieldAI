// VoiceGuard AI - Home Dashboard Page
// Typography: h1 text-5xl md:text-6xl, h2 text-3xl md:text-4xl, body text-base
// Colors: maroon-400 icons, beige hierarchy, glass-card with backdrop-blur-lg
// Spacing: p-6 cards, gap-6 grids, py-12 px-4 page
// Animations: animate-fade-in, animate-slide-up, hover:scale-105

import { Link } from "react-router-dom";
import { Mic, Video, Radio, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getUserProfile } from "../config/firestorePaths";
import { useState, useEffect } from "react";
import Iridescence from "../ui/Iridescence";

function AnalysisCard({
  to,
  icon: Icon,
  title,
  description,
  badge,
  delay = 0,
}) {
  return (
    <Link
      to={to}
      className="glass-card p-8 hover:scale-105 hover:shadow-2xl transition-all duration-300 group block"
      style={{ animation: `slideUp 0.8s ease-out ${delay}s backwards` }}
    >
      <div className="flex flex-col h-full">
        {/* Icon */}
        <div className="mb-6">
          <div className="inline-flex p-4 bg-maroon-600/20 rounded-2xl group-hover:bg-maroon-600/30 transition-colors">
            <Icon className="w-10 h-10 text-maroon-400" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-bold text-beige-100">{title}</h3>
            {badge && (
              <span className="px-2 py-1 bg-maroon-600/20 border border-maroon-400/30 rounded-lg text-xs text-maroon-300 font-semibold">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-beige-200/80 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Arrow */}
        <div className="mt-6 flex items-center gap-2 text-maroon-400 group-hover:gap-3 transition-all">
          <span className="text-sm font-semibold">Start Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { currentUser } = useAuth();
  const [analysisCount, setAnalysisCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch analysis count from Firestore
  useEffect(() => {
    const fetchAnalysisCount = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userProfile = await getUserProfile(currentUser.uid);
        setAnalysisCount(userProfile?.analysisCount || 0);
      } catch (err) {
        console.error("Failed to load analysis count:", err);
        // Fallback to localStorage
        const stored = localStorage.getItem("voiceguard_history");
        if (stored) {
          setAnalysisCount(JSON.parse(stored).length);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisCount();
  }, [currentUser]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-maroon-900 via-brown-900 to-black">
      {/* Iridescent Background */}
      <div className="absolute inset-0 z-0">
        <Iridescence speed={0.6} amplitude={0.12} mouseReact={true} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Welcome Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-lg border border-beige-200/20 rounded-full mb-4">
              <Shield className="w-4 h-4 text-maroon-400" />
              <span className="text-sm text-beige-200 font-medium">
                Your Dashboard
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent">
              Welcome Back
              {currentUser?.displayName
                ? `, ${currentUser.displayName.split(" ")[0]}`
                : ""}
            </h1>

            <p className="text-base text-beige-200/80 max-w-2xl mx-auto leading-relaxed">
              Choose an analysis type below to start detecting deepfakes with
              AI-powered precision
            </p>
          </div>

          {/* Analysis Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
            {/* Audio Analysis Card */}
            <AnalysisCard
              to="/analyze"
              icon={Mic}
              title="Audio Analysis"
              description="Upload audio files to detect AI-generated or manipulated voices with our CNN model and get instant results."
              delay={0}
            />

            {/* Video Analysis Card */}
            <AnalysisCard
              to="/analyze-video"
              icon={Video}
              title="Video Analysis"
              description="Upload video files to extract and analyze audio for deepfake detection. Get AI-powered insights on authenticity."
              delay={0.1}
            />

            {/* Live Analysis Card */}
            <AnalysisCard
              to="/analyze-live"
              icon={Radio}
              title="Live Analysis"
              description="Real-time monitoring of microphone or system audio. Analyzes every 10 seconds with instant deepfake alerts."
              delay={0.2}
            />
          </div>

          {/* Quick Stats */}
          <div
            className="glass-card p-8 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-beige-100 mb-2">
                  {loading ? "..." : analysisCount}
                </div>
                <div className="text-sm text-beige-300">Total Analyses</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-beige-100 mb-2">
                  94%
                </div>
                <div className="text-sm text-beige-300">Detection Accuracy</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-beige-100 mb-2">
                  &lt;3s
                </div>
                <div className="text-sm text-beige-300">
                  Average Processing Time
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Link */}
          <div
            className="text-center animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              to="/history"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black/40 backdrop-blur-lg hover:bg-black/60 text-beige-100 font-semibold text-base rounded-xl border border-beige-200/20 transition-all duration-300 hover:scale-105"
            >
              View Analysis History
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
