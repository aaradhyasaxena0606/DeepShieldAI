// VoiceGuard AI - Theme Toggle Button Component
// Animated sun/moon toggle for switching between dark and light themes

import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-lg border border-beige-200/20 hover:border-beige-200/30 transition-all duration-300 hover:scale-110 group ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon - Light Mode */}
        <Sun
          className={`absolute inset-0 w-5 h-5 text-yellow-400 transition-all duration-500 ${
            isDark
              ? "opacity-0 rotate-90 scale-0"
              : "opacity-100 rotate-0 scale-100"
          }`}
        />

        {/* Moon Icon - Dark Mode */}
        <Moon
          className={`absolute inset-0 w-5 h-5 text-blue-300 transition-all duration-500 ${
            isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-0"
          }`}
        />
      </div>
    </button>
  );
}
