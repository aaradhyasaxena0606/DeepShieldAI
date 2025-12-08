// VoiceGuard AI - Premium Landing Page
import { Link } from 'react-router-dom';
import { Shield, Zap, Lock, Target, TrendingUp, Clock, Award, ArrowRight, Sparkles, CheckCircle, Play, Users, Github, Cpu, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import Iridescence from '../ui/Iridescence';

function StatsCard({ icon: Icon, value, label, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-maroon-600/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
      <div className="relative glass-card p-8 border-2 border-maroon-400/20 hover:border-maroon-400/40 transition-all duration-300">
        <div className="flex items-start gap-4">
          <motion.div 
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="p-4 bg-gradient-to-br from-maroon-600/30 to-maroon-800/30 rounded-2xl"
          >
            <Icon className="w-8 h-8 text-maroon-400" />
          </motion.div>
          <div className="flex-1">
            <motion.div 
              initial={{ scale: 0.5 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
              className="text-5xl font-black bg-gradient-to-r from-beige-100 to-maroon-400 bg-clip-text text-transparent mb-2"
            >
              {value}
            </motion.div>
            <div className="text-sm text-beige-300 font-medium">{label}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-maroon-600/10 to-transparent rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
      <div className="relative glass-card p-8 border border-maroon-400/20 hover:border-maroon-400/40 transition-all duration-300 h-full">
        <div className="space-y-6">
          <motion.div 
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-maroon-600/20 rounded-2xl blur-xl" />
            <div className="relative p-5 bg-gradient-to-br from-maroon-600/30 to-maroon-800/20 rounded-2xl w-fit">
              <Icon className="w-10 h-10 text-maroon-400" strokeWidth={2.5} />
            </div>
          </motion.div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-beige-100 group-hover:text-maroon-400 transition-colors">{title}</h3>
            <p className="text-base text-beige-200/80 leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-maroon-900 via-brown-900 to-black">
      {/* Iridescent Background */}
      <div className="absolute inset-0 z-0">
        <Iridescence color={[0.55, 0.16, 0.16]} speed={0.6} amplitude={0.12} mouseReact={true} />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-maroon-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <motion.div 
            className="max-w-6xl w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="text-center space-y-10">
              {/* Logo */}
              <motion.div variants={itemVariants}>
                <img 
                  src="/logo.png" 
                  alt="VoiceGuard AI" 
                  className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-lg mx-auto"
                />
              </motion.div>

              {/* Badge */}
              
              
              {/* Main Heading */}
              <motion.h1 
                variants={itemVariants}
                className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight"
              >
                <motion.span 
                  className="block bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  Detect Deepfake
                </motion.span>
                <motion.span 
                  className="block bg-gradient-to-r from-maroon-400 via-beige-200 to-beige-100 bg-clip-text text-transparent mt-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Audio in Seconds
                </motion.span>
              </motion.h1>
              
              {/* Tagline */}
              <motion.p 
                variants={itemVariants}
                className="text-lg md:text-xl text-beige-200/90 max-w-3xl mx-auto leading-relaxed"
              >
                Voice fraud costs businesses <span className="text-maroon-400 font-bold">$25 million annually</span>. 
                Protect yourself with AI-powered deepfake detection and real-time explanations.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-4"
              >
                <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/signup"
                    className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-maroon-600 to-maroon-700 hover:from-maroon-700 hover:to-maroon-800 text-beige-50 font-bold text-lg rounded-2xl shadow-2xl shadow-maroon-600/50 transition-all duration-300 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <Sparkles className="relative z-10 w-5 h-5" />
                    <span className="relative z-10">Try Free Now</span>
                    <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/about"
                    className="group inline-flex items-center gap-3 px-10 py-5 bg-black/60 backdrop-blur-xl hover:bg-black/80 text-beige-100 font-bold text-lg rounded-2xl border-2 border-beige-200/30 hover:border-beige-200/50 transition-all duration-300"
                  >
                    <Play className="w-5 h-5 text-maroon-400" />
                    Learn More
                  </Link>
                </motion.div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center justify-center gap-8 pt-8 text-beige-300/80"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-maroon-400" />
                  <span className="text-sm font-medium">Enterprise-Grade Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-maroon-400" />
                  <span className="text-sm font-medium">Real-Time Detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-maroon-400" />
                  <span className="text-sm font-medium">AI-Powered Insights</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div id="stats" className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-beige-100 to-maroon-400 bg-clip-text text-transparent mb-4">
                The Deepfake Crisis
              </h2>
              <p className="text-lg text-beige-200/80 max-w-2xl mx-auto">
                Understanding the threat landscape
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatsCard 
                icon={TrendingUp} 
                value="$25M+" 
                label="Lost to voice fraud annually" 
                delay={0}
              />
              <StatsCard 
                icon={Clock} 
                value="3 Sec" 
                label="To clone any voice with AI" 
                delay={0.1}
              />
              <StatsCard 
                icon={Award} 
                value="94%+" 
                label="Detection accuracy rate" 
                delay={0.2}
              />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-7xl mx-auto w-full space-y-16">
            {/* Section Header */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-5 py-2 bg-maroon-600/20 border border-maroon-400/30 rounded-full"
              >
                <Sparkles className="w-4 h-4 text-maroon-400" />
                <span className="text-sm text-maroon-300 font-semibold">Features</span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent">
                Why VoiceGuard AI?
              </h2>
              <p className="text-lg text-beige-200/80 max-w-3xl mx-auto">
                Enterprise-grade protection with user-friendly design. Built for security professionals, 
                journalists, and anyone who needs to verify audio authenticity.
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={Zap}
                title="Lightning Fast"
                description="Get results in under 3 seconds. Our optimized CNN model processes audio instantly without compromising accuracy."
                delay={0}
              />
              
              <FeatureCard
                icon={Target}
                title="AI Explanations"
                description="Understand why audio is flagged with interpretable AI-powered insights powered by Google Gemini."
                delay={0.1}
              />
              
              <FeatureCard
                icon={Lock}
                title="Privacy First"
                description="Your audio is processed securely and never stored or shared with third parties. Complete data privacy."
                delay={0.2}
              />
              
              <FeatureCard
                icon={Shield}
                title="Highly Accurate"
                description="94%+ accuracy trained on thousands of real and synthetic voice samples using state-of-the-art techniques."
                delay={0.3}
              />
            </div>
          </div>
        </div>

        {/* Social Proof / CTA Section */}
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-maroon-600/20 to-transparent rounded-3xl blur-3xl" />
              <div className="relative glass-card p-12 md:p-16 border-2 border-maroon-400/30 text-center space-y-8">
                <motion.div
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  <Users className="w-16 h-16 text-maroon-400" />
                </motion.div>
                
                <h2 className="text-4xl md:text-5xl font-black text-beige-100">
                  Join the Fight Against<br />Voice Fraud
                </h2>
                
                <p className="text-lg text-beige-200/80 max-w-2xl mx-auto">
                  Trusted by security professionals, journalists, and individuals worldwide. 
                  Start protecting yourself today with AI-powered deepfake detection.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/signup"
                      className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-maroon-600 to-maroon-700 hover:from-maroon-700 hover:to-maroon-800 text-beige-50 font-bold text-lg rounded-2xl shadow-2xl shadow-maroon-600/50 transition-all duration-300"
                    >
                      <Sparkles className="w-5 h-5" />
                      Get Started Free
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <a
                      href="https://github.com/VTG56/VoiceGuard-AI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-10 py-5 bg-black/60 backdrop-blur-xl hover:bg-black/80 text-beige-100 font-bold text-lg rounded-2xl border-2 border-beige-200/30 hover:border-beige-200/50 transition-all duration-300"
                    >
                      <Github className="w-5 h-5 text-maroon-400" />
                      View on GitHub
                    </a>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}