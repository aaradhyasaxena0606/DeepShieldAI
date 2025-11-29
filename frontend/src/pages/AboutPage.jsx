// VoiceGuard AI - About/Team Information Page (Fully Standardized)
// Typography: h1 text-3xl md:text-4xl, h2 text-3xl md:text-4xl, h3 text-base, body text-base, small text-sm
// Colors: maroon-400 icons, beige hierarchy, glass-card bg-black/40 backdrop-blur-lg
// Spacing: p-6 cards, gap-6 grids, space-y-8 sections, py-12 px-4 page
// Animations: animate-fade-in, animate-slide-up with delays, hover:scale-105

import { Users, Cpu, Shield, Github, Award, Brain, Server, Database } from 'lucide-react';
import Iridescence from '../ui/Iridescence';

function TeamMemberCard({ avatar, name, role, github, linkedin }) {
  const isEmoji = avatar && !avatar.startsWith('http');

  return (
    <div className="glass-card p-6 hover:scale-105 transition-all duration-300 group">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Avatar */}
        {isEmoji ? (
          <div className="text-6xl group-hover:scale-110 transition-transform">
            {avatar}
          </div>
        ) : avatar ? (
          <div className="relative group-hover:rotate-6 transition-transform">
            <img
              src={avatar}
              alt={name}
              className="w-20 h-20 rounded-full border-4 border-maroon-600/30 object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-maroon-600/20 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
            👤
          </div>
        )}

        {/* Info */}
        <div>
          <h3 className="text-base font-bold text-beige-100">{name}</h3>
          <p className="text-sm text-maroon-400">{role}</p>
        </div>

        {/* Social Links */}
        {(github || linkedin) && (
          <div className="flex gap-2">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-maroon-600/20 hover:bg-maroon-600/30 rounded-lg transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 text-maroon-400" />
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-maroon-600/20 hover:bg-maroon-600/30 rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Users className="w-4 h-4 text-maroon-400" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TechStackBadge({ icon, name, category }) {
  const isEmoji = typeof icon === 'string';

  return (
    <div className="glass-card p-6 aspect-square flex flex-col items-center justify-center hover:scale-110 transition-all duration-300 group">
      <div className="text-4xl mb-3 group-hover:animate-bounce">
        {isEmoji ? icon : <img src={icon} alt={name} className="w-12 h-12" />}
      </div>
      <div className="text-center">
        <div className="text-sm font-semibold text-beige-100">{name}</div>
        <div className="text-xs text-beige-300 mt-1">{category}</div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const team = [
    { name: 'Person 1', role: 'ML Engineer', avatar: '👨‍💻' },
    { name: 'Person 2', role: 'Backend Developer', avatar: '👩‍💻' },
    { name: 'Person 3', role: 'Frontend Lead', avatar: '👨‍🎨' },
    { name: 'Person 4', role: 'AI Specialist', avatar: '👩‍🔬' },
    { name: 'Person 5', role: 'DevOps Engineer', avatar: '👨‍🔧' }
  ];

  const techStack = [
    { name: 'React', icon: '⚛️', category: 'Frontend' },
    { name: 'FastAPI', icon: '🚀', category: 'Backend' },
    { name: 'TensorFlow', icon: '🧠', category: 'ML' },
    { name: 'Google Gemini', icon: '✨', category: 'AI' },
    { name: 'Google Cloud', icon: '☁️', category: 'Infrastructure' },
    { name: 'Tailwind CSS', icon: '🎨', category: 'Styling' }
  ];

  const steps = [
    {
      icon: <Server className="w-8 h-8" />,
      title: 'Audio Upload',
      description: 'Upload your audio file through our secure interface. We support WAV and MP3 formats up to 10MB.'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'CNN Analysis',
      description: 'Our lightweight CNN model analyzes acoustic patterns, spectral features, and artifacts in real-time.'
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: 'AI Explanation',
      description: 'Google Gemini generates human-readable explanations using pattern-based RAG for interpretability.'
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-brown-900 via-brown-800 to-black">
      {/* Iridescent Background */}
      <div className="absolute inset-0 z-0">
        <Iridescence color={[0.55, 0.16, 0.16]} speed={0.6} amplitude={0.12} mouseReact={true} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-lg border border-beige-200/20 rounded-full mb-4">
              <Shield className="w-4 h-4 text-maroon-400" />
              <span className="text-sm text-beige-200 font-medium">About VoiceGuard AI</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent">
              Fighting Deepfake Audio
            </h1>
            
            <p className="text-base text-beige-200/80 max-w-3xl mx-auto leading-relaxed">
              VoiceGuard AI is a hackathon project demonstrating practical deepfake audio detection 
              with interpretable explanations. Built with a lightweight CNN model and pattern-based 
              RAG layer powered by Google Gemini.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a 
                href="https://github.com/yourusername/voiceguard-ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black/40 backdrop-blur-lg hover:bg-black/60 text-beige-100 font-semibold text-base rounded-xl border border-beige-200/20 transition-all duration-300 hover:scale-105"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
              
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-maroon-600/20 border border-maroon-400/30 text-maroon-300 font-semibold text-base rounded-xl">
                <Award className="w-5 h-5" />
                GDG Hackathon 2024
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="space-y-8 animate-slide-up">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent">
                How It Works
              </h2>
              <p className="text-base text-beige-200/80">Three-step detection pipeline</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step, idx) => (
                <div 
                  key={idx}
                  className="glass-card p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  style={{ animation: `slideUp 0.8s ease-out ${idx * 0.1}s backwards` }}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-maroon-600/20 rounded-full text-maroon-400">
                      {step.icon}
                    </div>
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 text-beige-100">
                        <span className="text-xl font-bold text-maroon-400">0{idx + 1}</span>
                        <h3 className="text-base font-bold">{step.title}</h3>
                      </div>
                      <p className="text-sm text-beige-200/80 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent">
                Tech Stack
              </h2>
              <p className="text-base text-beige-200/80">Built with cutting-edge technologies</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {techStack.map((tech, idx) => (
                <TechStackBadge key={idx} {...tech} />
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent">
                Our Team
              </h2>
              <p className="text-base text-beige-200/80">Meet the builders of VoiceGuard AI</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {team.map((member, idx) => (
                <TeamMemberCard key={idx} {...member} />
              ))}
            </div>
          </div>

          {/* Architecture Diagram Placeholder */}
          <div className="glass-card p-8 shadow-2xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-xl md:text-2xl font-bold text-beige-100 mb-6 text-center">
              System Architecture
            </h3>
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-12 border border-beige-200/20">
              <div className="text-center space-y-4">
                <Cpu className="w-16 h-16 text-maroon-400 mx-auto" />
                <p className="text-base text-beige-200/80">
                  Architecture diagram coming soon
                </p>
                <div className="text-sm text-beige-300 max-w-2xl mx-auto">
                  Frontend (React) → API Gateway → FastAPI Backend → CNN Model + Gemini RAG → Response
                </div>
              </div>
            </div>
          </div>

          {/* Footer Badge */}
          <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-beige-100 border border-beige-300 rounded-xl shadow-lg">
              <img 
                src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" 
                alt="Google Cloud" 
                className="w-8 h-8"
              />
              <div className="text-left">
                <div className="font-bold text-brown-800 text-sm">Built with</div>
                <div className="font-semibold text-brown-600 text-xs">Google Cloud Platform</div>
              </div>
            </div>
            
            <p className="text-xs text-beige-300">
              This is a demonstration project for educational purposes. Not intended for production use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}