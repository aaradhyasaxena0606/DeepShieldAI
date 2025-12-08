// VoiceGuard AI - Forgot Password Page
// Typography: h1 text-5xl md:text-6xl, body text-base, small text-sm
// Colors: maroon-400 icons, beige hierarchy, glass-card with backdrop-blur-lg
// Spacing: p-6 cards, gap-6 grids, py-12 px-4 page
// Animations: animate-fade-in, animate-slide-up, hover:scale-105

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Iridescence from '../ui/Iridescence';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setSuccess(false);
      setLoading(true);
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-maroon-900 via-brown-900 to-black">
      {/* Iridescent Background */}
      <div className="absolute inset-0 z-0">
        <Iridescence color={[0.55, 0.16, 0.16]} speed={0.6} amplitude={0.12} mouseReact={true} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <img 
                src="/logo.png" 
                alt="VoiceGuard AI" 
                className="w-10 h-10 object-contain rounded-lg"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent">
                VoiceGuard AI
              </span>
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-bold text-beige-100 mb-2">
              Reset Password
            </h1>
            <p className="text-sm text-beige-200/80">
              Enter your email to receive a password reset link
            </p>
          </div>

          {/* Form Card */}
          <div className="glass-card p-8 shadow-2xl">
            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-600/20 border border-red-400/30 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-beige-100">{error}</p>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="mb-6 p-4 bg-green-600/20 border border-green-400/30 rounded-xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-beige-100 font-semibold mb-1">Check your email!</p>
                  <p className="text-sm text-beige-200/80">
                    We've sent a password reset link to <span className="font-semibold">{email}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-beige-100 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-beige-300" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-black/40 border border-beige-200/20 rounded-xl text-beige-100 placeholder-beige-300 focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-maroon-600 hover:bg-maroon-700 text-beige-50 font-semibold text-base rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </div>

          {/* Back to Login Link */}
          <div className="text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-sm text-beige-200/80 hover:text-beige-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
