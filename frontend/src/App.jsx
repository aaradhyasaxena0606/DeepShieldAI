// VoiceGuard AI - Main App Component
// Set up React Router with routes: "/" (LandingPage), "/home" (HomePage - protected), "/analyze" (AnalyzePage - protected)
// "/history" (HistoryPage - protected), "/about" (AboutPage), "/login", "/signup", "/forgot-password"
// Render <Navbar /> at top, <Routes> in middle, <Footer /> at bottom with dark background layout
// Wrap app in AuthProvider for authentication state management

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { LiveMonitorProvider } from "./contexts/LiveMonitorContext.jsx";
import Navbar from "./components/Navbar.jsx";
import MobileHeader from "./components/MobileHeader.jsx";
import MobileDock from "./components/MobileDock.jsx";
import { Footer } from "./components/Footer.jsx";
import { ToastContainer } from "./components/Toast.jsx";
import { LiveMonitorWidget } from "./components/LiveMonitorWidget.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import AnalyzePage from "./pages/AnalyzePage.jsx";
import AnalyzeVideoPage from "./pages/AnalyzeVideoPage.jsx";
import AnalyzeLivePage from "./pages/AnalyzeLivePage.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LiveMonitorProvider>
            <ToastContainer />
            <LiveMonitorWidget />
            <div className="app-container">
              <Navbar />
              <MobileHeader />
              <main className="flex-1 h-full w-full bg-fixed mx-auto pb-16 md:pb-0">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/home"
                    element={
                      <ProtectedRoute>
                        <HomePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analyze"
                    element={
                      <ProtectedRoute>
                        <AnalyzePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analyze-video"
                    element={
                      <ProtectedRoute>
                        <AnalyzeVideoPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analyze-live"
                    element={
                      <ProtectedRoute>
                        <AnalyzeLivePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/result"
                    element={
                      <ProtectedRoute>
                        <ResultPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/history"
                    element={
                      <ProtectedRoute>
                        <HistoryPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch all - redirect to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
              <MobileDock />
            </div>
          </LiveMonitorProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
