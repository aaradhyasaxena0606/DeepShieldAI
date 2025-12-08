// VoiceGuard AI - Analysis Results Display Page (Fully Standardized)
// Typography: h1 text-3xl md:text-4xl, h2 text-xl md:text-2xl, h3 text-base, body text-base, small text-sm
// Colors: maroon-400 icons, beige-100 headings, beige-200/80 body, glass-card consistency
// Spacing: p-6 cards, p-8 large cards, gap-6 grids, space-y-8 sections
// Animations: animate-fade-in, animate-slide-up with 0.1s stagger, hover:scale-105

import { useLocation, Link } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Download,
  RefreshCw,
  Info,
  AlertCircle,
} from "lucide-react";
import { DetectionBadge } from "../components/DetectionBadge";
import { ConfidenceGauge } from "../components/ConfidenceGauge";
import Iridescence from "../ui/Iridescence";
import jsPDF from "jspdf";

function AlertBox({ variant = "info", title, description }) {
  const config = {
    success: {
      icon: CheckCircle,
      borderColor: "border-l-green-500",
      iconColor: "text-green-400",
      bgColor: "bg-green-600/20",
    },
    warning: {
      icon: AlertTriangle,
      borderColor: "border-l-yellow-500",
      iconColor: "text-yellow-400",
      bgColor: "bg-yellow-600/20",
    },
    danger: {
      icon: AlertTriangle,
      borderColor: "border-l-red-500",
      iconColor: "text-red-400",
      bgColor: "bg-red-600/20",
    },
    info: {
      icon: Info,
      borderColor: "border-l-blue-500",
      iconColor: "text-blue-400",
      bgColor: "bg-blue-600/20",
    },
  };

  const { icon: Icon, borderColor, iconColor, bgColor } = config[variant];

  return (
    <div
      className={`glass-card ${bgColor} border-l-4 ${borderColor} p-6 flex items-start gap-3`}
    >
      <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-beige-100 mb-1">{title}</h4>
        <p className="text-sm text-beige-200/80 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function PatternTag({ name }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-maroon-600/20 border border-maroon-400/30 rounded-full text-xs text-beige-200 hover:bg-maroon-600/30 hover:scale-105 transition-all duration-300">
      <AlertTriangle className="w-3 h-3" />
      {name}
    </span>
  );
}

export default function ResultPage() {
  const { state } = useLocation();
  const data = state?.data;
  const usedPlaceholder = data?.used_placeholder || false;

  const handleDownloadReport = () => {
    try {
      const reportData = generateReportData(
        data,
        isFake,
        confidence,
        confidenceLevel
      );
      generatePDFReport(reportData);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to generate report. Please try again.");
    }
  };

  const generatePDFReport = (reportData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPos = 20;

    // Helper function to check if we need a new page
    const checkPageBreak = (requiredSpace = 10) => {
      if (yPos + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPos = 20;
        return true;
      }
      return false;
    };

    // Helper function to add wrapped text
    const addText = (text, fontSize, isBold = false, color = [0, 0, 0]) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line) => {
        checkPageBreak();
        doc.text(line, margin, yPos);
        yPos += fontSize * 0.5;
      });
    };

    // Header with colored background
    doc.setFillColor(139, 69, 19); // Brown/maroon color
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("VoiceGuard AI", pageWidth / 2, 15, { align: "center" });
    doc.setFontSize(14);
    doc.text("Audio Analysis Report", pageWidth / 2, 25, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(reportData.header.generatedAt, pageWidth / 2, 33, {
      align: "center",
    });

    yPos = 50;

    // File Information
    addText("File Information", 12, true, [139, 69, 19]);
    yPos += 2;
    doc.setDrawColor(139, 69, 19);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
    addText(`Filename: ${reportData.header.filename}`, 10);
    yPos += 8;

    // Detection Result Box
    checkPageBreak(35);
    const isFake = reportData.detection.result.includes("FAKE");
    const boxColor = isFake ? [220, 38, 38] : [34, 197, 94]; // Red or Green
    doc.setFillColor(...boxColor, 0.1);
    doc.setDrawColor(...boxColor);
    doc.roundedRect(margin, yPos, maxWidth, 30, 3, 3, "FD");

    doc.setTextColor(...boxColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Detection Result", margin + 5, yPos + 8);
    doc.setFontSize(18);
    doc.text(reportData.detection.result, margin + 5, yPos + 18);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Confidence: ${reportData.detection.confidence} (${reportData.detection.confidenceLevel})`,
      margin + 5,
      yPos + 26
    );

    yPos += 38;

    // Placeholder Warning
    if (reportData.detection.usedPlaceholder) {
      checkPageBreak(15);
      doc.setFillColor(251, 191, 36, 0.2);
      doc.setDrawColor(251, 191, 36);
      doc.roundedRect(margin, yPos, maxWidth, 12, 2, 2, "FD");
      doc.setTextColor(180, 83, 9);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(
        "⚠ WARNING: Placeholder prediction (model not loaded)",
        margin + 3,
        yPos + 8
      );
      yPos += 18;
    }

    // AI Explanation Section
    checkPageBreak(20);
    doc.setTextColor(0, 0, 0);
    addText("AI Explanation", 12, true, [139, 69, 19]);
    yPos += 2;
    doc.setDrawColor(139, 69, 19);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text("Powered by Google Gemini", margin, yPos);
    yPos += 6;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    addText(reportData.analysis.aiExplanation, 10);
    yPos += 5;

    // Detected Patterns
    if (reportData.analysis.detectedPatterns.length > 0) {
      checkPageBreak(20);
      addText("Detected Patterns", 12, true, [139, 69, 19]);
      yPos += 2;
      doc.setDrawColor(139, 69, 19);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;

      reportData.analysis.detectedPatterns.forEach((pattern, idx) => {
        checkPageBreak();
        doc.setTextColor(180, 83, 9);
        doc.setFontSize(10);
        doc.text(`• ${pattern.name || pattern}`, margin + 5, yPos);
        yPos += 6;
      });
      yPos += 5;
    }

    // Recommendation
    checkPageBreak(20);
    doc.setTextColor(0, 0, 0);
    addText("Recommendation", 12, true, [139, 69, 19]);
    yPos += 2;
    doc.setDrawColor(139, 69, 19);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
    addText(reportData.recommendation, 10);
    yPos += 5;

    // What This Means (for high confidence fake)
    if (isFake && reportData.detection.confidenceLevel === "HIGH") {
      checkPageBreak(40);
      addText("What This Means", 12, true, [139, 69, 19]);
      yPos += 2;
      doc.setDrawColor(139, 69, 19);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;

      const warnings = [
        "This audio likely contains AI-generated or manipulated voice content",
        "Do not rely on this audio for authentication or verification purposes",
        "Contact the claimed speaker through verified channels to confirm authenticity",
        "Be cautious of any requests for money, information, or actions based on this audio",
      ];

      warnings.forEach((warning) => {
        checkPageBreak(10);
        doc.setTextColor(220, 38, 38);
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(`• ${warning}`, maxWidth - 10);
        lines.forEach((line) => {
          doc.text(line, margin + 5, yPos);
          yPos += 5;
        });
      });
      yPos += 5;
    }

    // Error Details
    if (reportData.analysis.errorDetails) {
      checkPageBreak(20);
      addText("Error Details", 12, true, [220, 38, 38]);
      yPos += 2;
      doc.setDrawColor(220, 38, 38);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;
      doc.setTextColor(180, 83, 9);
      addText(reportData.analysis.errorDetails, 9);
      yPos += 5;
    }

    // Footer on last page
    const lastPageNum = doc.internal.pages.length - 1;
    doc.setPage(lastPageNum);
    doc.setFillColor(139, 69, 19);
    doc.rect(0, pageHeight - 25, pageWidth, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      "This report was generated by VoiceGuard AI",
      pageWidth / 2,
      pageHeight - 15,
      { align: "center" }
    );
    doc.text(
      "For more information, visit: https://voiceguard.ai",
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );

    // Save the PDF
    const filename = `VoiceGuard-Report-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(filename);
  };

  const generateReportData = (data, isFake, confidence, confidenceLevel) => {
    return {
      header: {
        title: "VoiceGuard AI - Audio Analysis Report",
        generatedAt: new Date().toLocaleString(),
        filename: data.filename || "Unknown",
      },
      detection: {
        result: isFake ? "FAKE (AI-Generated)" : "REAL (Authentic)",
        confidence: `${(confidence * 100).toFixed(2)}%`,
        confidenceLevel: confidenceLevel,
        usedPlaceholder: usedPlaceholder,
      },
      analysis: {
        aiExplanation: data.ai_explanation || "No explanation available.",
        detectedPatterns: data.detected_patterns || [],
        errorDetails: data.error_details || null,
      },
      recommendation: getRecommendationText(),
    };
  };

  if (!data) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-brown-900 via-brown-800 to-black">
        <div className="absolute inset-0 z-0">
          <Iridescence speed={0.6} amplitude={0.12} mouseReact={true} />
        </div>
        <div className="relative z-10 text-center space-y-4 px-4">
          <AlertCircle className="w-16 h-16 text-maroon-400 mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-bold text-beige-100">
            No Result Found
          </h2>
          <p className="text-base text-beige-200/80">
            Please analyze an audio file first.
          </p>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-6 py-3 bg-maroon-600 hover:bg-maroon-700 text-beige-50 font-semibold text-base rounded-xl transition-all duration-300 hover:scale-105 mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Analyze Audio
          </Link>
        </div>
      </div>
    );
  }

  const isFake = data.prediction === "fake";
  const confidence = data.confidence || 0;
  const confidenceLevel =
    confidence > 0.85 ? "HIGH" : confidence > 0.6 ? "MEDIUM" : "LOW";

  const getRecommendationText = () => {
    if (confidenceLevel === "HIGH" && isFake) {
      return "Strong indicators of synthetic audio detected. This audio shows multiple characteristics consistent with AI-generated voice. Exercise extreme caution and verify through alternative channels.";
    }
    if (confidenceLevel === "HIGH" && !isFake) {
      return "Audio appears authentic with high confidence. Natural voice patterns, consistent spectral characteristics, and typical human speech artifacts detected.";
    }
    if (confidenceLevel === "MEDIUM") {
      return "Some suspicious patterns detected. The confidence level suggests ambiguous results. Additional verification recommended through alternative methods or longer audio samples.";
    }
    return "Inconclusive results. The audio sample may be too short or contain quality issues. Consider testing with a longer, clearer audio sample for more accurate detection.";
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden ${
        isFake
          ? "bg-gradient-to-br from-maroon-900 via-red-950 to-black"
          : "bg-gradient-to-br from-green-950 via-brown-900 to-black"
      }`}
    >
      {/* Iridescent Background */}
      <div className="absolute inset-0 z-0">
        <Iridescence speed={0.6} amplitude={0.12} mouseReact={true} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Button */}
          <div className="animate-fade-in">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 text-beige-200 hover:text-beige-100 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Analyze Another</span>
            </Link>
          </div>

          {/* Results Header */}
          <div className="text-center space-y-6 animate-fade-in">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-beige-100 mb-3">
                Analysis Complete
              </h1>
              <p className="text-base text-beige-200/80">
                Here's what our AI detected in your audio file
              </p>
              {data.filename && (
                <p className="text-sm text-beige-300 mt-2">
                  File: {data.filename}
                </p>
              )}

              {usedPlaceholder && (
                <div className="mt-4 max-w-xl mx-auto">
                  <AlertBox
                    variant="warning"
                    title="Model not loaded — placeholder prediction"
                    description={
                      "The backend returned a placeholder prediction because the ML model or TensorFlow was unavailable. Confidence values are approximate and not production-grade."
                    }
                  />
                </div>
              )}
            </div>

            {/* Large Badge with Animation */}
            <div
              className={`inline-block ${
                confidence > 0.85 ? "animate-pulse-slow" : ""
              } ${usedPlaceholder ? "opacity-70 grayscale" : ""}`}
            >
              <DetectionBadge
                prediction={data.prediction}
                confidence={confidence}
                size="large"
              />
            </div>
          </div>

          {/* Confidence Gauge */}
          <div
            className={`glass-card p-8 shadow-2xl animate-slide-up ${
              usedPlaceholder ? "opacity-70" : ""
            }`}
          >
            {!usedPlaceholder ? (
              <ConfidenceGauge confidence={confidence} size="large" />
            ) : (
              <div className="text-center py-8">
                <div className="text-xl font-semibold text-beige-100 mb-2">
                  Placeholder Prediction
                </div>
                <div className="text-sm text-beige-200/80">
                  Confidence withheld because the backend is using a placeholder
                  model.
                </div>
              </div>
            )}
          </div>

          {/* AI Explanation Card */}
          <div
            className="glass-card p-8 shadow-2xl animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-maroon-600/20 rounded-xl flex-shrink-0">
                {isFake ? (
                  <XCircle className="w-6 h-6 text-maroon-400" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-beige-100 mb-2">
                  AI Explanation
                </h2>
                <p className="text-sm text-beige-300">
                  Powered by Google Gemini
                </p>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-base text-beige-200/80 leading-relaxed whitespace-pre-line">
                {data.ai_explanation ||
                  "No explanation available. The model detected patterns in the audio but could not generate a detailed explanation."}
              </p>
              {!data.ai_explanation && data.error_details && (
                <div className="mt-4 p-4 glass-card bg-yellow-600/20 border-l-4 border-l-yellow-500">
                  <p className="text-sm text-yellow-300">
                    The AI explanation service is currently unavailable. This
                    may be due to missing API configuration or temporary service
                    issues.
                  </p>
                </div>
              )}
              {data.error_details && (
                <div className="mt-4 p-4 glass-card bg-red-600/20 border-l-4 border-l-red-500">
                  <p className="text-sm text-red-300">
                    <strong>Error Details:</strong> {data.error_details}
                  </p>
                  <p className="text-xs text-red-400 mt-2">
                    Check the browser console or server logs for more
                    information.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Detected Patterns */}
          {data.detected_patterns && data.detected_patterns.length > 0 && (
            <div
              className="glass-card p-6 shadow-xl animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <h3 className="text-base font-semibold text-beige-100 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-maroon-400" />
                Detected Patterns
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.detected_patterns.map((pattern, idx) => (
                  <PatternTag key={idx} name={pattern.name || pattern} />
                ))}
              </div>
            </div>
          )}

          {/* Recommendation Alert */}
          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <AlertBox
              variant={
                confidenceLevel === "HIGH"
                  ? isFake
                    ? "danger"
                    : "success"
                  : confidenceLevel === "MEDIUM"
                  ? "warning"
                  : "info"
              }
              title={`${confidenceLevel} Confidence Detection`}
              description={getRecommendationText()}
            />
          </div>

          {/* Additional Context */}
          {confidenceLevel === "HIGH" && isFake && (
            <div
              className="glass-card p-6 bg-maroon-600/10 backdrop-blur-lg border-maroon-400/30 animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <h3 className="text-base font-semibold text-beige-100 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-maroon-400" />
                What This Means
              </h3>
              <ul className="space-y-2 text-sm text-beige-200/80">
                <li className="flex items-start gap-2">
                  <span className="text-maroon-400 flex-shrink-0">•</span>
                  <span>
                    This audio likely contains AI-generated or manipulated voice
                    content
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon-400 flex-shrink-0">•</span>
                  <span>
                    Do not rely on this audio for authentication or verification
                    purposes
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon-400 flex-shrink-0">•</span>
                  <span>
                    Contact the claimed speaker through verified channels to
                    confirm authenticity
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon-400 flex-shrink-0">•</span>
                  <span>
                    Be cautious of any requests for money, information, or
                    actions based on this audio
                  </span>
                </li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
            style={{ animationDelay: "0.5s" }}
          >
            <Link
              to="/analyze"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-maroon-600 hover:bg-maroon-700 text-beige-50 font-semibold text-base rounded-xl shadow-lg hover:shadow-maroon-600/50 transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className="w-5 h-5" />
              Analyze Another File
            </Link>

            <Link
              to="/history"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black/40 backdrop-blur-lg hover:bg-black/60 text-beige-100 font-semibold text-base rounded-xl border border-beige-200/20 transition-all duration-300 hover:scale-105"
            >
              View History
            </Link>

            <button
              onClick={handleDownloadReport}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black/40 backdrop-blur-lg hover:bg-black/60 text-beige-100 font-semibold text-base rounded-xl border border-beige-200/20 transition-all duration-300 hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
