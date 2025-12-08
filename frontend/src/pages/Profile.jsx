// VoiceGuard AI - User Profile Page
// Shows user's avatar (first initial), display name/email, a short recent history list with link to History page, and a Sign Out button

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, FileAudio, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getUserAnalyses } from "../config/firestorePaths";

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const displayName = currentUser?.displayName || currentUser?.email || "User";
  const initial =
    displayName && displayName[0] ? displayName[0].toUpperCase() : "U";

  useEffect(() => {
    const fetchRecent = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const analyses = await getUserAnalyses(currentUser.uid);
        // Show most recent 3
        setRecent((analyses || []).slice(0, 3));
        setError(null);
      } catch (err) {
        console.error("Failed to load recent analyses for profile:", err);
        setError("Unable to load recent activity.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, [currentUser]);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Sign out failed:", err);
      setError("Failed to sign out. Please try again.");
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-brown-900 via-maroon-900 to-black">
      <div className="relative z-10 py-12 px-4 max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-maroon-600/20 flex items-center justify-center text-3xl font-bold text-beige-100">
            {initial}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent">
              {displayName}
            </h1>
            <p className="text-sm text-beige-300 mt-1">{currentUser?.email}</p>
          </div>
        </div>

        {/* Recent activity */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileAudio className="w-5 h-5 text-maroon-400" />
              <h2 className="text-lg font-semibold text-beige-100">
                Recent Analyses
              </h2>
            </div>
            <Link
              to="/history"
              className="text-sm text-maroon-300 hover:underline inline-flex items-center gap-2"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-beige-300">Loading recent activity...</p>
          ) : error ? (
            <p className="text-sm text-red-300">{error}</p>
          ) : recent.length === 0 ? (
            <p className="text-sm text-beige-300">
              No recent analyses. Try analyzing an audio file.
            </p>
          ) : (
            <ul className="space-y-3">
              {recent.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between bg-black/40 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-md bg-maroon-600/20 flex items-center justify-center text-maroon-300">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-beige-100 truncate">
                        {r.filename || "Unknown file"}
                      </div>
                      <div className="text-xs text-beige-300">
                        {r.prediction
                          ? `${r.prediction} • ${(r.confidence * 100).toFixed(
                              1
                            )}%`
                          : "—"}
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/history"
                    state={{ highlightId: r.id }}
                    className="text-sm text-maroon-300 hover:underline"
                  >
                    See
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sign out */}
        <div className="pt-4">
          <button
            onClick={handleSignOut}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-maroon-600 hover:bg-maroon-700 text-beige-50 font-semibold rounded-xl shadow-lg transition-all duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
