// ==================================================================
// MOBILEHEADER.JSX - Top Header for Mobile
// ==================================================================
// Only visible on mobile devices (hidden on md and larger screens)
// Shows logo and app name with logout button if authenticated

import { NavLink } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";

export default function MobileHeader() {
  const { isAuthenticated, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setShowMenu(false);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <>
      <header className="md:hidden sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-beige-200/10 shadow-lg shadow-black/20">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Logo */}
          <NavLink
            to={isAuthenticated ? "/home" : "/"}
            className="flex items-center gap-2 group"
          >
            <img
              src="/logo.png"
              alt="VoiceGuard AI"
              className="w-8 h-8 object-contain rounded-lg group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-lg font-bold bg-gradient-to-r from-beige-100 to-maroon-400 bg-clip-text text-transparent">
              VoiceGuard AI
            </span>
          </NavLink>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Menu Button - Only show if authenticated */}
            {isAuthenticated && (
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-beige-200 hover:text-beige-100 hover:bg-beige-200/10 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Dropdown Menu */}
      {showMenu && isAuthenticated && (
        <div className="md:hidden fixed top-14 right-2 z-50 w-48 backdrop-blur-xl bg-black/95 border border-beige-200/20 rounded-xl shadow-xl shadow-black/50 overflow-hidden animate-fade-in">
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-maroon-300 hover:bg-maroon-600/20 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Backdrop to close menu */}
      {showMenu && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-transparent"
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  );
}
