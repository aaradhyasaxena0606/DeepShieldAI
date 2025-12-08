// VoiceGuard AI - Protected Route Component
// Wraps routes that require authentication
// Redirects to login page if user is not authenticated

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-maroon-900 via-brown-900 to-black">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-maroon-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-beige-200">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
