// VoiceGuard AI - Audio Upload & Analysis Component (Fully Standardized)
// Typography: h3 text-base, body text-base, small text-sm, xs text-xs
// Colors: maroon-400 icons, beige hierarchy, glass-card bg-black/40 backdrop-blur-lg
// Spacing: p-6 cards, gap-3/4 consistent, min-h-[300px] drag zone
// Animations: hover:scale-[1.02], transition-all duration-300

import { useState, useRef } from "react";
import {
  Upload,
  CloudUpload,
  X,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { saveAnalysisToFirestore } from "../config/firestorePaths";
import { Waveform } from "./Waveform";

export function AudioUploader() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const validateFile = (file) => {
    const validTypes = ["audio/wav", "audio/mpeg", "audio/mp3"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return "Invalid file format. Please upload WAV or MP3.";
    }
    if (file.size > maxSize) {
      return "File too large. Maximum size is 10MB.";
    }
    return null;
  };

  const handleFile = (selectedFile) => {
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      setTimeout(() => setError(null), 5000);
      return;
    }
    setError(null);
    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    // Check if user is authenticated
    if (!currentUser) {
      setError("Please log in to analyze audio.");
      setTimeout(() => setError(null), 5000);
      return;
    }

    setLoading(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Fallback to default URL if environment variable is not set
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const url = `${baseUrl}/analyze`;

      const { data } = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(progressInterval);
      setProgress(100);

      // Save to Firestore
      try {
        const firestoreRecord = await saveAnalysisToFirestore(
          currentUser.uid,
          data,
          file.name
        );
        console.log("Analysis saved to Firestore:", firestoreRecord);
      } catch (firestoreError) {
        console.error("Error saving to Firestore:", firestoreError);
        // Continue even if Firestore save fails - still show results to user
      }

      // Also save to localStorage as backup
      const history = JSON.parse(
        localStorage.getItem("voiceguard_history") || "[]"
      );
      history.unshift({
        ...data,
        filename: file.name,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(
        "voiceguard_history",
        JSON.stringify(history.slice(0, 50))
      );

      setTimeout(() => {
        navigate("/result", {
          state: { data: { ...data, filename: file.name } },
        });
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      console.error("Analysis error:", err);
      // More detailed error messages
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 405) {
          setError(
            "Analysis failed: Method not allowed. Please contact support."
          );
        } else if (err.response.status === 503) {
          setError(
            "Analysis failed: Service unavailable. The ML model may not be loaded."
          );
        } else {
          setError(
            `Analysis failed: ${
              err.response.data.detail || "Unknown server error"
            }`
          );
        }
      } else if (err.request) {
        // Request was made but no response received
        setError(
          "Analysis failed: Cannot connect to server. Please ensure the backend is running."
        );
      } else {
        // Something else happened
        setError("Analysis failed. Please try again.");
      }
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Toast */}
      {error && (
        <div className="glass-card bg-red-600/20 border-l-4 border-l-red-500 p-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {!file ? (
        /* Drag & Drop Zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl min-h-[300px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? "border-maroon-400 bg-maroon-600/10 scale-[1.02]"
              : "border-beige-200/30 hover:border-maroon-400 hover:bg-maroon-600/5"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/wav,audio/mp3,audio/mpeg"
            onChange={(e) =>
              e.target.files?.[0] && handleFile(e.target.files[0])
            }
            className="hidden"
          />
          <CloudUpload
            className={`w-16 h-16 mb-4 transition-colors ${
              isDragging ? "text-maroon-400" : "text-beige-300"
            }`}
          />
          <h3 className="text-base font-semibold text-beige-100 mb-2">
            {isDragging
              ? "Drop your audio file"
              : "Drag & drop your audio file"}
          </h3>
          <p className="text-sm text-beige-300 mb-4">or click to browse</p>
          <div className="flex items-center gap-4 text-xs text-beige-300">
            <span>WAV, MP3</span>
            <span>•</span>
            <span>Max 10MB</span>
          </div>
        </div>
      ) : (
        /* File Preview */
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="p-3 bg-maroon-600/20 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-beige-100 truncate">
                  {file.name}
                </h3>
                <p className="text-xs text-beige-300 mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={() => setFile(null)}
              className="p-2 hover:bg-maroon-600/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-beige-300" />
            </button>
          </div>

          <Waveform file={file} />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-maroon-600 hover:bg-maroon-700 disabled:opacity-40 disabled:cursor-not-allowed text-beige-50 font-semibold text-base rounded-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
          >
            {loading ? (
              <>
                <div className="spinner w-5 h-5 border-2 border-beige-50/30 border-t-beige-50 rounded-full" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 animate-pulse" />
                Analyze Audio
              </>
            )}
          </button>

          {loading && (
            <div className="h-1 bg-black/40 backdrop-blur-lg rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-maroon-600 to-maroon-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
