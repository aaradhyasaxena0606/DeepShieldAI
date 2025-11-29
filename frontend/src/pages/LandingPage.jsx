// VoiceGuard AI - Landing Page (Fully Standardized)
// Typography: h1 text-5xl md:text-6xl lg:text-7xl, h2 text-3xl md:text-4xl, body text-base
// Colors: Consistent maroon-400 icons, beige hierarchy, glass-card with backdrop-blur-lg
// Spacing: p-6 cards, gap-6 grids, py-12 px-4 page padding
// Animations: animate-fade-in, animate-slide-up with 0.1s stagger, hover:scale-105

import { Link } from 'react-router-dom';
import { Shield, Zap, Lock, Target, TrendingUp, Clock, Award, ArrowRight } from 'lucide-react';
import Iridescence from '../ui/Iridescence';

function StatsCard({ icon: Icon, value, label }) {
  return (
    <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-maroon-600/20 rounded-xl">
          <Icon className="w-8 h-8 text-maroon-400" />
        </div>
        <div className="flex-1">
          <div className="text-4xl font-bold text-beige-100 mb-2">{value}</div>
          <div className="text-sm text-beige-300">{label}</div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
  return (
    <div
      className="glass-card p-6 hover:-translate-y-2 transition-all duration-300 group"
      style={{ animation: `slideUp 0.8s ease-out ${delay}s backwards` }}
    >
      <div className="space-y-4">
        <div className="p-4 bg-maroon-600/20 rounded-full w-fit group-hover:bg-maroon-600/30 transition-colors">
          <Icon className="w-8 h-8 text-maroon-400" />
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-beige-100 mb-2">{title}</h3>
          <p className="text-sm text-beige-200/80 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-maroon-900 via-brown-900 to-black">
      {/* Iridescent Background */}
      <div className="absolute inset-0 z-0">
        <Iridescence color={[0.55, 0.16, 0.16]} speed={0.6} amplitude={0.12} mouseReact={true} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-5xl w-full animate-fade-in">
            <div className="text-center space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-lg border border-beige-200/20 rounded-full">
                <Shield className="w-4 h-4 text-maroon-400" />
                <span className="text-sm text-beige-200 font-medium">AI-Powered Protection</span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent">
                  Detect Deepfake
                </span>
                <span className="block bg-gradient-to-r from-maroon-400 via-beige-200 to-beige-100 bg-clip-text text-transparent">
                  Audio in Seconds
                </span>
              </h1>
              
              {/* Tagline */}
              <p className="text-base text-beige-200/80 max-w-3xl mx-auto leading-relaxed">
                Voice fraud costs businesses <span className="text-maroon-400 font-bold">$25 million annually</span>. 
                Protect yourself with AI-powered deepfake detection and real-time explanations.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  to="/analyze"
                  className="group relative px-8 py-4 bg-maroon-600 hover:bg-maroon-700 text-beige-50 font-semibold text-base rounded-xl shadow-2xl hover:shadow-maroon-600/50 transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Try Now - It's Free
                    <Zap className="w-5 h-5 group-hover:animate-pulse" />
                  </span>
                </Link>
                
                <a 
                  href="#features"
                  className="px-8 py-4 bg-black/40 backdrop-blur-lg hover:bg-black/60 text-beige-100 font-semibold text-base rounded-xl border border-beige-200/20 transition-all duration-300 hover:scale-105"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-4 pb-20">
          <div className="max-w-6xl mx-auto animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard 
                icon={TrendingUp} 
                value="$25M+" 
                label="Lost to voice fraud annually" 
              />
              <StatsCard 
                icon={Clock} 
                value="3 Seconds" 
                label="To clone any voice with AI" 
              />
              <StatsCard 
                icon={Award} 
                value="94%+" 
                label="Detection accuracy rate" 
              />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="px-4 pb-20">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent">
                Why VoiceGuard AI?
              </h2>
              <p className="text-base text-beige-200/80 max-w-2xl mx-auto">
                Enterprise-grade protection with user-friendly design
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={Zap}
                title="Lightning Fast"
                description="Get results in under 3 seconds. Our optimized CNN model processes audio instantly."
                delay={0}
              />
              
              <FeatureCard
                icon={Target}
                title="AI Explanations"
                description="Understand why audio is flagged with interpretable AI-powered insights powered by Gemini."
                delay={0.1}
              />
              
              <FeatureCard
                icon={Lock}
                title="Privacy First"
                description="Your audio is processed securely and never stored or shared with third parties."
                delay={0.2}
              />
              
              <FeatureCard
                icon={Shield}
                title="Highly Accurate"
                description="94%+ accuracy trained on thousands of real and synthetic voice samples."
                delay={0.3}
              />
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8 text-center space-y-6 hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-3xl md:text-4xl font-bold text-beige-100">
                Ready to Detect Deepfakes?
              </h2>
              <p className="text-base text-beige-200/80 max-w-2xl mx-auto">
                Join thousands of users protecting themselves from voice fraud with AI-powered detection.
              </p>
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 px-8 py-4 bg-maroon-600 hover:bg-maroon-700 text-beige-50 font-semibold text-base rounded-xl shadow-lg hover:shadow-maroon-600/50 transition-all duration-300 hover:scale-105"
              >
                Start Analyzing
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}