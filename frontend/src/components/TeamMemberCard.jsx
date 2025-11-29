// ==================================================================
// TEAM MEMBER CARD.JSX - FULLY STANDARDIZED
// ==================================================================
// Typography: h3 text-base, p text-sm
// Colors: maroon-400 icons, beige-100 name, maroon-400 role
// Spacing: p-6, space-y-4
// Animations: hover:scale-105, group-hover effects, transition-all duration-300

import { Github, Linkedin } from 'lucide-react';

export function TeamMemberCard({ avatar, name, role, github, linkedin }) {
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
                <Linkedin className="w-4 h-4 text-maroon-400" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
