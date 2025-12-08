// ==================================================================
// FOOTER.JSX - SIMPLE COPYRIGHT FOOTER
// ==================================================================

export function Footer() {
  return (
    <footer className="relative bg-brown-900/40 backdrop-blur-lg border-t border-beige-200/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="VoiceGuard AI" 
              className="w-6 h-6 object-contain rounded-lg"
            />
            <span className="text-sm font-semibold text-beige-200">VoiceGuard AI</span>
          </div>

          {/* Center: Copyright */}
          <p className="text-sm text-beige-300 text-center">
            © 2025 VoiceGuard-AI. All rights reserved.
          </p>

          {/* Right: Powered By */}
          <div className="flex items-center gap-2 text-xs text-beige-300">
            <span>Powered by</span>
            <img
              src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png"
              alt="Google"
              className="w-4 h-4"
            />
            <span className="font-semibold text-beige-200">Google Gemini</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
