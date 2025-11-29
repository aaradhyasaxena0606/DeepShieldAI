// ==================================================================
// FOOTER.JSX - FULLY STANDARDIZED
// ==================================================================
// Typography: text-lg brand, text-xs legal links, text-xs bottom text
// Colors: maroon-400 icons, beige-100 brand, beige-300 links
// Spacing: py-6, gap-4, px-3 py-1 badge
// Animations: hover:text-maroon-300 links

import { Github, Twitter, Linkedin, Heart, Shield as Shield2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const legal = [
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Service' },
    { to: '/contact', label: 'Contact' }
  ];

  const social = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' }
  ];

  return (
    <footer className="relative bg-brown-900/40 backdrop-blur-lg border-t border-beige-200/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Brand + Badge */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2">
              <Shield2 className="w-5 h-5 text-maroon-400" />
              <span className="text-base font-bold text-beige-100">VoiceGuard AI</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-maroon-600/20 border border-maroon-400/30 rounded-full text-xs text-maroon-300">
              Built for GDG Hackathon 2024
            </div>
          </div>

          {/* Center: Legal Links */}
          <div className="flex items-center gap-4">
            {legal.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs text-beige-300 hover:text-maroon-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Social Icons */}
          <div className="flex gap-2">
            {social.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-maroon-600/20 hover:bg-maroon-600/30 rounded-lg transition-colors"
                aria-label={label}
              >
                <Icon className="w-4 h-4 text-maroon-400" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-beige-200/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-beige-300">
            <p className="flex items-center gap-1">
              © 2024 VoiceGuard AI. Made with <Heart className="w-3 h-3 text-maroon-400 fill-current" /> for GDG Hackathon
            </p>
            <div className="flex items-center gap-2">
              <span>Powered by</span>
              <img
                src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png"
                alt="Google Cloud"
                className="w-4 h-4"
              />
              <span className="font-semibold text-beige-200">Google Cloud Vertex AI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
