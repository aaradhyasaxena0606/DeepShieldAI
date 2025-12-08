// ==================================================================
// NAVBAR.JSX - FULLY STANDARDIZED
// ==================================================================
// Typography: text-xl logo, text-sm nav links, text-base buttons
// Colors: maroon-400 icons, beige-100 active, beige-200 inactive, gradient logo
// Spacing: h-16 header, px-4 py-2 links, gap-1/2
// Animations: hover effects, mobile menu slideInLeft

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Shield, Menu, X, ArrowRight, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/#features', label: 'Features' },
    { to: '/about', label: 'About' }
  ];

  const authenticatedLinks = [
    { to: '/home', label: 'Dashboard' },
    { to: '/history', label: 'History' },
    { to: '/about', label: 'About' }
  ];

  const links = isAuthenticated ? authenticatedLinks : publicLinks;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-beige-200/10 shadow-lg shadow-black/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-maroon-600/20 rounded-lg group-hover:bg-maroon-600/30 transition-colors">
              <Shield className="w-5 h-5 text-maroon-400" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent">
              VoiceGuard
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-beige-100' : 'text-beige-200 hover:text-beige-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-maroon-500 rounded-t-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Side Actions - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-lg border border-beige-200/20 rounded-xl">
                  <User className="w-4 h-4 text-maroon-400" />
                  <span className="text-sm text-beige-100">
                    {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-maroon-600/20 hover:bg-maroon-600/30 text-maroon-400 border border-maroon-400/30 rounded-xl transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                {/* Login Button */}
                <NavLink
                  to="/login"
                  className="px-4 py-2 bg-black/40 backdrop-blur-lg hover:bg-black/60 text-beige-100 font-medium text-sm rounded-xl border border-beige-200/20 transition-all duration-300"
                >
                  Sign In
                </NavLink>
                
                {/* Signup Button */}
                <NavLink
                  to="/signup"
                  className="flex items-center gap-2 px-6 py-3 bg-maroon-600 hover:bg-maroon-700 text-beige-50 font-semibold text-base rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-beige-200 hover:text-beige-100 hover:bg-beige-200/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-black/95 backdrop-blur-xl">
          <div className="flex flex-col items-center justify-center h-full gap-2 px-6">
            {links.map((link, idx) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-xl font-semibold transition-all ${
                    isActive ? 'text-maroon-400' : 'text-beige-200 hover:text-beige-100'
                  }`
                }
                style={{
                  animation: `slideInLeft 0.6s ease-out ${idx * 0.1}s backwards`
                }}
              >
                {link.label}
              </NavLink>
            ))}
            
            {isAuthenticated ? (
              <>
                {/* User Info Mobile */}
                <div className="mt-6 text-center" style={{ animation: 'slideInLeft 0.6s ease-out 0.3s backwards' }}>
                  <p className="text-sm text-beige-300 mb-2">Signed in as</p>
                  <p className="text-base text-beige-100 font-semibold">
                    {currentUser?.displayName || currentUser?.email}
                  </p>
                </div>
                
                {/* Logout Button Mobile */}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="mt-4 flex items-center gap-2 px-8 py-4 bg-maroon-600/20 hover:bg-maroon-600/30 text-maroon-300 border border-maroon-400/30 rounded-xl transition-all"
                  style={{ animation: 'slideInLeft 0.6s ease-out 0.4s backwards' }}
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                {/* Login Button Mobile */}
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-6 px-8 py-4 bg-black/40 backdrop-blur-lg hover:bg-black/60 text-beige-100 font-semibold text-base rounded-xl border border-beige-200/20 transition-all"
                  style={{ animation: 'slideInLeft 0.6s ease-out 0.3s backwards' }}
                >
                  Sign In
                </NavLink>
                
                {/* Signup Button Mobile */}
                <NavLink
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-8 py-4 bg-maroon-600 hover:bg-maroon-700 text-beige-50 font-semibold text-base rounded-xl transition-all"
                  style={{ animation: 'slideInLeft 0.6s ease-out 0.4s backwards' }}
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
