// VoiceGuard AI - Analysis History Page (Fully Standardized)
// Typography: h1 text-3xl md:text-4xl, h2 text-xl, h3 text-base, body text-base, small text-sm
// Colors: maroon-400 icons, beige hierarchy, glass-card bg-black/40 backdrop-blur-lg
// Spacing: p-6 cards, gap-6 grids, space-y-8 sections, py-12 px-4 page
// Animations: animate-fade-in, animate-slide-up with 0.05s stagger, hover:scale-[1.02]

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  History,
  FileAudio,
  Calendar,
  TrendingUp,
  Eye,
  Trash2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { DetectionBadge } from "../components/DetectionBadge";
import { useAuth } from "../contexts/AuthContext";
import {
  getUserAnalyses,
  subscribeToAllUserAnalyses,
  deleteAnalysis,
  deleteAllAnalyses,
} from "../config/firestorePaths";
import Iridescence from "../ui/Iridescence";

function EmptyState({ icon: Icon, heading, description, ctaLabel, ctaLink }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-maroon-400/20 rounded-full">
          <Icon className="w-10 h-10 text-maroon-400" />
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-beige-100 mb-3">
        {heading}
      </h2>
      <p className="text-base text-beige-200/80 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {ctaLabel && ctaLink && (
        <Link
          to={ctaLink}
          className="inline-flex items-center gap-2 px-6 py-3 bg-maroon-600 hover:bg-maroon-700 text-beige-50 font-semibold text-base rounded-xl shadow-lg hover:shadow-maroon-600/50 transition-all duration-300 hover:scale-105"
        >
          {ctaLabel}
          <ArrowRight className="w-5 h-5" />
        </Link>
      )}
    </div>
  );
}

function StatsCard({ icon: Icon, value, label }) {
  return (
    <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-maroon-600/20 rounded-lg flex-shrink-0">
          <Icon className="w-5 h-5 text-maroon-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-2xl font-bold text-beige-100">{value}</div>
          <div className="text-xs text-beige-300">{label}</div>
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Fetch analyses from Firestore
  useEffect(() => {
    // If not logged in, load any saved local history and bail.
    if (!currentUser) {
      try {
        const stored = localStorage.getItem("voiceguard_history");
        if (stored) setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load history from localStorage:", e);
      } finally {
        setLoading(false);
      }

      return;
    }

    setLoading(true);

    // Subscribe to Firestore analyses in realtime. This keeps the UI up-to-date
    // whenever analyses are added/removed/updated in Firestore (both audio & video).
    const unsubscribe = subscribeToAllUserAnalyses(
      currentUser.uid,
      (analyses) => {
        setHistory(analyses);
        setError(null);
        setLoading(false);
        try {
          localStorage.setItem("voiceguard_history", JSON.stringify(analyses));
        } catch (e) {
          console.error("Failed to persist history to localStorage:", e);
        }
      },
      (err) => {
        console.error("Realtime subscription error:", err);
        setError("Failed to load analysis history. Please try again.");
        setLoading(false);
        // fallback to one-time fetch (audio only for now)
        getUserAnalyses(currentUser.uid)
          .then((analyses) => setHistory(analyses))
          .catch((e) => console.error("Fallback getUserAnalyses failed:", e));
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Persist history whenever it changes (covers local deletes / optimistic updates)
  useEffect(() => {
    try {
      localStorage.setItem("voiceguard_history", JSON.stringify(history));
    } catch (e) {
      // ignore
    }
  }, [history]);

  const clearHistory = async () => {
    if (
      !window.confirm("Are you sure you want to clear all analysis history?")
    ) {
      return;
    }

    try {
      if (currentUser) {
        // Delete both audio and video analyses
        await deleteAllAnalyses(currentUser.uid, "audio");
        await deleteAllAnalyses(currentUser.uid, "video");
      }
      // Also clear localStorage
      localStorage.removeItem("voiceguard_history");
      setHistory([]);
      setError(null);
    } catch (err) {
      console.error("Failed to clear history:", err);
      setError("Failed to clear history. Please try again.");
    }
  };

  const deleteItem = async (analysisId) => {
    if (!window.confirm("Are you sure you want to delete this analysis?")) {
      return;
    }

    try {
      // Find the item to get its media type
      const itemToDelete = history.find((item) => item.id === analysisId);
      const mediaType = itemToDelete?.mediaType || "audio";

      // If analysisId is a string we assume it's a Firestore doc id and attempt
      // to delete it from Firestore. If it's a numeric index (fallback/local),
      // just remove it locally.
      if (currentUser && typeof analysisId === "string") {
        await deleteAnalysis(currentUser.uid, analysisId, mediaType);
        // With realtime subscription, the state will update automatically when
        // Firestore confirms deletion. We can still optimistically update.
        setHistory((prev) => prev.filter((item) => item.id !== analysisId));
      } else if (typeof analysisId === "number") {
        setHistory((prev) => prev.filter((_, i) => i !== analysisId));
      } else {
        // Unknown type — safe fallback: filter by id mismatch
        setHistory((prev) => prev.filter((item) => item.id !== analysisId));
      }
      setError(null);
    } catch (err) {
      console.error("Failed to delete analysis:", err);
      setError("Failed to delete analysis. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-brown-900 via-maroon-900 to-black">
      {/* Iridescent Background */}
      <div className="absolute inset-0 z-0">
        <Iridescence speed={0.6} amplitude={0.12} mouseReact={true} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Error Toast */}
          {error && (
            <div className="glass-card bg-red-600/20 border-l-4 border-l-red-500 p-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Header */}
          <div className="space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-lg border border-beige-200/20 rounded-full mb-4">
              <History className="w-4 h-4 text-maroon-400" />
              <span className="text-sm text-beige-200 font-medium">
                Analysis History
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent mb-2">
                  Your Analyses
                </h1>
                <p className="text-base text-beige-200/80">
                  {history.length > 0
                    ? `${history.length} audio file${
                        history.length === 1 ? "" : "s"
                      } analyzed`
                    : "No analyses yet"}
                </p>
              </div>

              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-maroon-600/20 hover:bg-maroon-600/30 text-maroon-300 border border-maroon-400/30 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear History
                </button>
              )}
            </div>
          </div>

          {/* History List or Empty State */}
          {loading ? (
            <div className="glass-card p-12 shadow-2xl flex flex-col items-center justify-center animate-slide-up">
              <div className="spinner w-8 h-8 border-2 border-maroon-400/30 border-t-maroon-400 rounded-full mb-4" />
              <p className="text-beige-300">Loading your analysis history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="glass-card p-8 shadow-2xl animate-slide-up">
              <EmptyState
                icon={FileAudio}
                heading="No Analysis History Yet"
                description="Upload and analyze your first audio file to get started with VoiceGuard AI"
                ctaLabel="Analyze Your First Audio"
                ctaLink="/analyze"
              />
            </div>
          ) : (
            <>
              {/* History Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
                {history.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="glass-card p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group"
                    style={{
                      animation: `slideUp 0.8s ease-out ${
                        index * 0.05
                      }s backwards`,
                    }}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-maroon-600/20 rounded-lg flex-shrink-0">
                          <FileAudio className="w-5 h-5 text-maroon-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-beige-100 truncate">
                              {item.filename || "Unknown File"}
                            </h3>
                            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-maroon-600/30 text-maroon-300 rounded">
                              {(item.mediaType || "audio").toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-beige-300">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            <span>
                              {item.createdAt
                                ? new Date(
                                    item.createdAt.seconds
                                      ? item.createdAt.seconds * 1000
                                      : item.createdAt
                                  ).toLocaleString()
                                : new Date(item.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteItem(item.id ?? index)}
                        className="p-2 hover:bg-maroon-600/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-maroon-400" />
                      </button>
                    </div>

                    {/* Detection Badge */}
                    <div className="mb-4">
                      <DetectionBadge
                        prediction={item.prediction}
                        confidence={item.confidence}
                        size="small"
                      />
                    </div>

                    {/* Mini Confidence Indicator */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-beige-300 mb-2">
                        <span>Confidence</span>
                        <span className="font-semibold">
                          {(item.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-black/40 backdrop-blur-lg rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            item.prediction === "fake"
                              ? "bg-gradient-to-r from-maroon-600 to-maroon-400"
                              : "bg-gradient-to-r from-green-600 to-green-400"
                          }`}
                          style={{ width: `${item.confidence * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* View Details Button */}
                    <Link
                      to="/result"
                      state={{ data: item }}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-black/40 backdrop-blur-lg hover:bg-black/60 text-beige-100 font-medium rounded-xl border border-beige-200/20 transition-all duration-300 hover:scale-[1.02] text-sm group-hover:border-maroon-400/30"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                  </div>
                ))}
              </div>

              {/* Stats Summary */}
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <StatsCard
                  icon={TrendingUp}
                  value={history.length}
                  label="Total Analyses"
                />

                <StatsCard
                  icon={FileAudio}
                  value={history.filter((h) => h.prediction === "fake").length}
                  label="Fake Detected"
                />

                <StatsCard
                  icon={FileAudio}
                  value={history.filter((h) => h.prediction === "real").length}
                  label="Real Detected"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
