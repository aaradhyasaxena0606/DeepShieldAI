// VoiceGuard AI - User Profile Page (Enhanced)
// Modern profile with stats, activity timeline, account settings, and beautiful UI
// Features: User avatar, statistics cards, recent activity, account management

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  FileAudio,
  ArrowRight,
  LogOut,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Calendar,
  Activity,
  Settings,
  Edit3,
  X,
  Save,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getUserAnalyses } from "../config/firestorePaths";
import { updateProfile } from "firebase/auth";
import Iridescence from "../ui/Iridescence";

function StatCard({ icon: Icon, value, label, color = "maroon" }) {
  const colorClasses = {
    maroon: "bg-maroon-600/20 text-maroon-400",
    green: "bg-green-600/20 text-green-400",
    red: "bg-red-600/20 text-red-400",
    blue: "bg-blue-600/20 text-blue-400",
  };

  return (
    <div className="glass-card p-6 hover:scale-105 transition-all duration-300 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className={`p-3 ${colorClasses[color]} rounded-xl flex-shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-3xl font-bold text-beige-100">{value}</div>
          <div className="text-sm text-beige-300 mt-1">{label}</div>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ analysis, index }) {
  const isFake = analysis.prediction === "fake";
  const date = analysis.timestamp
    ? new Date(analysis.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Unknown date";

  return (
    <div
      className="flex items-start gap-4 p-4 bg-black/40 hover:bg-black/50 rounded-xl transition-all duration-300 group"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div
        className={`p-2 rounded-lg flex-shrink-0 ${
          isFake ? "bg-red-600/20" : "bg-green-600/20"
        }`}
      >
        {isFake ? (
          <XCircle className="w-5 h-5 text-red-400" />
        ) : (
          <CheckCircle className="w-5 h-5 text-green-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-beige-100 truncate">
              {analysis.filename || "Unknown file"}
            </h4>
            <p className="text-xs text-beige-300 mt-1">
              {isFake ? "Deepfake Detected" : "Authentic Audio"} •{" "}
              {(analysis.confidence * 100).toFixed(1)}% confidence
            </p>
          </div>
          <span className="text-xs text-beige-400 whitespace-nowrap">
            {date}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const displayName = currentUser?.displayName || currentUser?.email || "User";
  const initial =
    displayName && displayName[0] ? displayName[0].toUpperCase() : "U";

  // Calculate stats
  const totalAnalyses = analyses.length;
  const fakeCount = analyses.filter((a) => a.prediction === "fake").length;
  const realCount = analyses.filter((a) => a.prediction === "real").length;
  const avgConfidence =
    analyses.length > 0
      ? (
          analyses.reduce((sum, a) => sum + (a.confidence || 0), 0) /
          analyses.length
        ).toFixed(1)
      : 0;

  // Get account creation date
  const accountCreated = currentUser?.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getUserAnalyses(currentUser.uid);
        setAnalyses(data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to load analyses:", err);
        setError("Unable to load your activity.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
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

  const handleEditClick = () => {
    setEditDisplayName(currentUser?.displayName || "");
    setIsEditModalOpen(true);
    setSaveSuccess(false);
  };

  const handleSaveProfile = async () => {
    if (!editDisplayName.trim()) {
      setError("Display name cannot be empty");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await updateProfile(currentUser, {
        displayName: editDisplayName.trim(),
      });

      // Force refresh the auth state
      await currentUser.reload();

      setSaveSuccess(true);
      setTimeout(() => {
        setIsEditModalOpen(false);
        setSaveSuccess(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    if (!isSaving) {
      setIsEditModalOpen(false);
      setError(null);
      setSaveSuccess(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-brown-900 via-maroon-900 to-black overflow-hidden">
      {/* Iridescent Background */}
      <div className="absolute inset-0 z-0">
        <Iridescence speed={0.6} amplitude={0.12} mouseReact={true} />
      </div>

      <div className="relative z-10 py-12 px-4 max-w-6xl mx-auto space-y-8">
        {/* Header Section with Avatar and Info */}
        <div className="glass-card p-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-maroon-600 to-maroon-800 flex items-center justify-center text-4xl font-bold text-beige-50 shadow-xl ring-4 ring-maroon-600/30 group-hover:ring-maroon-400/50 transition-all duration-300">
                {initial}
              </div>
              <div className="absolute inset-0 rounded-full bg-maroon-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent">
                  {displayName}
                </h1>
                <button
                  onClick={handleEditClick}
                  className="p-2 bg-maroon-600/20 hover:bg-maroon-600/30 text-maroon-400 rounded-lg transition-all duration-300 hover:scale-110"
                  title="Edit profile"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-sm text-beige-300">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Mail className="w-4 h-4 text-maroon-400" />
                  <span>{currentUser?.email}</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Calendar className="w-4 h-4 text-maroon-400" />
                  <span>Member since {accountCreated}</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Shield className="w-4 h-4 text-maroon-400" />
                  <span className="px-2 py-1 bg-maroon-600/20 rounded-full text-xs font-medium text-maroon-300">
                    Verified Account
                  </span>
                </div>
              </div>
            </div>

            {/* Sign Out Button - Desktop */}
            <button
              onClick={handleSignOut}
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-maroon-600/20 hover:bg-maroon-600/30 text-maroon-300 border border-maroon-400/30 hover:border-maroon-400/50 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Statistics Grid */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-beige-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-maroon-400" />
            Your Statistics
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={FileAudio}
              value={totalAnalyses}
              label="Total Analyses"
              color="maroon"
            />
            <StatCard
              icon={CheckCircle}
              value={realCount}
              label="Authentic Detected"
              color="green"
            />
            <StatCard
              icon={XCircle}
              value={fakeCount}
              label="Deepfakes Found"
              color="red"
            />
            <StatCard
              icon={Activity}
              value={`${avgConfidence}%`}
              label="Avg. Confidence"
              color="blue"
            />
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-maroon-400" />
              <h2 className="text-xl font-bold text-beige-100">
                Recent Activity
              </h2>
            </div>
            <Link
              to="/history"
              className="text-sm text-maroon-300 hover:text-maroon-200 inline-flex items-center gap-2 group transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-maroon-400/30 border-t-maroon-400 rounded-full animate-spin" />
              <p className="text-sm text-beige-300 mt-3">
                Loading your activity...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-maroon-400/10 rounded-full mb-4">
                <FileAudio className="w-8 h-8 text-maroon-400" />
              </div>
              <p className="text-base text-beige-300 mb-4">
                No analyses yet. Start protecting yourself from deepfakes!
              </p>
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 px-6 py-3 bg-maroon-600 hover:bg-maroon-700 text-beige-50 font-semibold rounded-xl transition-all duration-300 hover:scale-105"
              >
                Analyze Audio
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {analyses.slice(0, 5).map((analysis, index) => (
                <ActivityItem
                  key={analysis.id}
                  analysis={analysis}
                  index={index}
                />
              ))}
              {analyses.length > 5 && (
                <Link
                  to="/history"
                  className="block text-center py-3 text-sm text-maroon-300 hover:text-maroon-200 transition-colors"
                >
                  View {analyses.length - 5} more analyses →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/analyze"
            className="glass-card p-6 hover:scale-105 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-maroon-600/20 rounded-xl">
                <FileAudio className="w-6 h-6 text-maroon-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-beige-100 mb-1">
                  Analyze Audio
                </h3>
                <p className="text-sm text-beige-300">
                  Upload and check for deepfakes
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-maroon-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/history"
            className="glass-card p-6 hover:scale-105 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/20 rounded-xl">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-beige-100 mb-1">
                  View History
                </h3>
                <p className="text-sm text-beige-300">
                  See all your past analyses
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Sign Out Button - Mobile */}
        <button
          onClick={handleSignOut}
          className="md:hidden w-full flex items-center justify-center gap-2 px-6 py-4 bg-maroon-600 hover:bg-maroon-700 text-beige-50 font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-md w-full p-6 animate-slide-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-beige-100 flex items-center gap-2">
                <Edit3 className="w-6 h-6 text-maroon-400" />
                Edit Profile
              </h2>
              <button
                onClick={handleCloseModal}
                disabled={isSaving}
                className="p-2 text-beige-300 hover:text-beige-100 hover:bg-beige-200/10 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Display Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-beige-200 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                disabled={isSaving}
                className="w-full px-4 py-3 bg-black/40 border border-beige-200/20 rounded-xl text-beige-100 placeholder-beige-400 focus:outline-none focus:ring-2 focus:ring-maroon-400 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="Enter your display name"
              />
            </div>

            {/* Email Display (Read-only) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-beige-200 mb-2">
                Email
              </label>
              <div className="w-full px-4 py-3 bg-black/20 border border-beige-200/10 rounded-xl text-beige-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-maroon-400" />
                <span className="text-sm">{currentUser?.email}</span>
              </div>
              <p className="text-xs text-beige-400 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-600/20 border border-red-400/30 rounded-lg">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {saveSuccess && (
              <div className="mb-4 p-3 bg-green-600/20 border border-green-400/30 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <p className="text-sm text-green-300">
                  Profile updated successfully!
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                disabled={isSaving}
                className="flex-1 px-4 py-3 bg-black/40 hover:bg-black/60 text-beige-200 font-medium rounded-xl border border-beige-200/20 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving || !editDisplayName.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-maroon-600 hover:bg-maroon-700 text-beige-50 font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-beige-50/30 border-t-beige-50 rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
