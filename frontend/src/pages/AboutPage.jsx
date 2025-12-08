// VoiceGuard AI - Premium About Page
import {
  Users,
  Cpu,
  Shield,
  Github,
  Award,
  Brain,
  Server,
  Database,
  Code2,
  Layers,
  Sparkles,
  Globe,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import Iridescence from "../ui/Iridescence";

function TeamMemberCard({ avatar, name, role, idx }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: idx * 0.1 }}
      whileHover={{ y: -8, scale: 1.03 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-maroon-600/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
      <div className="relative glass-card p-8 border border-maroon-400/20 hover:border-maroon-400/40 transition-all duration-300">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-maroon-600/30 rounded-full blur-xl" />
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-maroon-400/30 bg-gradient-to-br from-maroon-600/20 to-maroon-800/20">
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-maroon-600/20 to-maroon-800/20">
                <Users className="w-12 h-12 text-maroon-400" />
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-beige-100 group-hover:text-maroon-400 transition-colors">
              {name}
            </h3>
            <p className="text-sm text-beige-300">{role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TechStackBadge({ icon: Icon, name, category, idx }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-maroon-600/10 to-transparent rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
      <div className="relative glass-card p-6 aspect-square flex flex-col items-center justify-center border border-maroon-400/20 hover:border-maroon-400/40 transition-all duration-300">
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
          className="mb-3"
        >
          <div className="p-3 bg-maroon-600/20 rounded-xl">
            <Icon className="w-8 h-8 text-maroon-400" strokeWidth={2} />
          </div>
        </motion.div>
        <div className="text-center">
          <div className="text-sm font-bold text-beige-100">{name}</div>
          <div className="text-xs text-beige-300 mt-1">{category}</div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  const team = [
    { name: "Person 1", role: "ML Engineer", avatar: "/person1.png" },
    { name: "Person 2", role: "Backend Developer", avatar: "/person2.png" },
    { name: "Person 3", role: "Frontend Lead", avatar: "/person3.png" },
    { name: "Person 4", role: "AI Specialist", avatar: "/person4.png" },
    { name: "Person 5", role: "DevOps Engineer", avatar: "/person5.png" },
  ];

  const techStack = [
    { name: "React", icon: Code2, category: "Frontend" },
    { name: "FastAPI", icon: Zap, category: "Backend" },
    { name: "TensorFlow", icon: Brain, category: "ML" },
    { name: "Google Gemini", icon: Sparkles, category: "AI" },
    { name: "Google Cloud", icon: Globe, category: "Infrastructure" },
    { name: "Tailwind CSS", icon: Layers, category: "Styling" },
  ];

  const steps = [
    {
      icon: Server,
      title: "Audio Upload",
      description:
        "Upload your audio file through our secure interface. We support WAV and MP3 formats up to 10MB.",
    },
    {
      icon: Brain,
      title: "CNN Analysis",
      description:
        "Our lightweight CNN model analyzes acoustic patterns, spectral features, and artifacts in real-time.",
    },
    {
      icon: Database,
      title: "AI Explanation",
      description:
        "Google Gemini generates human-readable explanations using pattern-based RAG for interpretability.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-brown-900 via-brown-800 to-black">
      {/* Iridescent Background */}
      <div className="absolute inset-0 z-0">
        <Iridescence speed={0.6} amplitude={0.12} mouseReact={true} />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-maroon-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-24">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-xl border-2 border-maroon-400/40 rounded-full"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="w-5 h-5 text-maroon-400" strokeWidth={2.5} />
              </motion.div>
              <span className="text-base text-beige-100 font-semibold">
                About VoiceGuard AI
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent leading-tight">
              Fighting Deepfake Audio
              <br />
              with AI
            </h1>

            <p className="text-lg text-beige-200/90 max-w-3xl mx-auto leading-relaxed">
              VoiceGuard AI demonstrates practical deepfake audio detection with
              interpretable explanations. Built with a lightweight CNN model and
              pattern-based RAG layer powered by Google Gemini.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="https://github.com/VTG56/VoiceGuard-AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-black/60 backdrop-blur-xl hover:bg-black/80 text-beige-100 font-bold text-base rounded-2xl border-2 border-beige-200/30 hover:border-beige-200/50 transition-all duration-300"
                >
                  <Github className="w-5 h-5" />
                  View on GitHub
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-maroon-600/20 border-2 border-maroon-400/30 text-maroon-300 font-bold text-base rounded-2xl"
              >
                <Award className="w-5 h-5" />
                GDG Hackathon 2025
              </motion.div>
            </div>
          </motion.div>

          {/* How It Works */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-4"
            >
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-beige-100 to-maroon-400 bg-clip-text text-transparent">
                How It Works
              </h2>
              <p className="text-lg text-beige-200/80 max-w-2xl mx-auto">
                Three-step detection pipeline
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-maroon-600/10 to-transparent rounded-2xl blur-xl" />
                  <div className="relative glass-card p-10 border-2 border-maroon-400/20 hover:border-maroon-400/40 transition-all duration-300">
                    <div className="flex flex-col items-center text-center space-y-6">
                      <div className="text-7xl font-black text-maroon-100">
                        0{idx + 1}
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-5 bg-gradient-to-br from-maroon-600/30 to-maroon-800/20 rounded-2xl">
                          <step.icon
                            className="w-12 h-12 text-maroon-400"
                            strokeWidth={2}
                          />
                        </div>
                      </motion.div>
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-beige-100">
                          {step.title}
                        </h3>
                        <p className="text-base text-beige-200/80 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-4"
            >
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent">
                Tech Stack
              </h2>
              <p className="text-lg text-beige-200/80">
                Built with cutting-edge technologies
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {techStack.map((tech, idx) => (
                <TechStackBadge
                  key={idx}
                  icon={tech.icon}
                  name={tech.name}
                  category={tech.category}
                  idx={idx}
                />
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-4"
            >
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-beige-100 via-beige-200 to-maroon-400 bg-clip-text text-transparent">
                Our Team
              </h2>
              <p className="text-lg text-beige-200/80">
                Meet the builders of VoiceGuard AI
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {team.map((member, idx) => (
                <TeamMemberCard
                  key={idx}
                  avatar={member.avatar}
                  name={member.name}
                  role={member.role}
                  idx={idx}
                />
              ))}
            </div>
          </div>

          {/* Architecture Overview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-maroon-600/20 to-transparent rounded-3xl blur-3xl" />
            <div className="relative glass-card p-12 border-2 border-maroon-400/30">
              <h3 className="text-3xl font-black text-beige-100 mb-8 text-center">
                System Architecture
              </h3>
              <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-16 border border-beige-200/20">
                <div className="flex flex-col items-center space-y-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 30,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Cpu className="w-20 h-20 text-maroon-400" />
                  </motion.div>
                  <p className="text-lg text-beige-200/80 text-center">
                    Full-stack AI-powered deepfake detection system
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 text-sm text-beige-300 max-w-4xl">
                    <span className="px-4 py-2 bg-maroon-600/20 border border-maroon-400/30 rounded-full">
                      Frontend (React)
                    </span>
                    <span className="text-maroon-400">→</span>
                    <span className="px-4 py-2 bg-maroon-600/20 border border-maroon-400/30 rounded-full">
                      API Gateway
                    </span>
                    <span className="text-maroon-400">→</span>
                    <span className="px-4 py-2 bg-maroon-600/20 border border-maroon-400/30 rounded-full">
                      FastAPI Backend
                    </span>
                    <span className="text-maroon-400">→</span>
                    <span className="px-4 py-2 bg-maroon-600/20 border border-maroon-400/30 rounded-full">
                      CNN Model
                    </span>
                    <span className="text-maroon-400">+</span>
                    <span className="px-4 py-2 bg-maroon-600/20 border border-maroon-400/30 rounded-full">
                      Gemini RAG
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-4 px-8 py-5 bg-beige-100 border-2 border-beige-300 rounded-2xl shadow-xl">
              <img
                src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png"
                alt="Google"
                className="w-10 h-10"
              />
              <div className="text-left">
                <div className="font-black text-brown-800 text-base">
                  Powered by
                </div>
                <div className="font-bold text-brown-600 text-sm">
                  Google Cloud & Gemini AI
                </div>
              </div>
            </div>

            <p className="text-sm text-beige-300 max-w-2xl mx-auto">
              This is a demonstration project for educational purposes. Built
              for GDG Hackathon 2025. Not intended for production use without
              further development and testing.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
