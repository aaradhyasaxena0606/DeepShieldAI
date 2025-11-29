// VoiceGuard AI - Main App Component
// Set up React Router with routes: "/" (LandingPage), "/analyze" (AnalyzePage), "/history" (HistoryPage), "/about" (AboutPage)
// Render <Navbar /> at top, <Routes> in middle, <Footer /> at bottom with dark background layout

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import { Footer } from './components/Footer.jsx'
import { ToastContainer } from './components/Toast.jsx'
import LandingPage from './pages/LandingPage.jsx'
import AnalyzePage from './pages/AnalyzePage.jsx'
import ResultPage from './pages/ResultPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import AboutPage from './pages/AboutPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <div className="app-container">
        <Navbar />
        <main className="flex-1 h-full w-full bg-fixed mx-auto">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
