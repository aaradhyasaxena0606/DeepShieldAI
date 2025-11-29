// ==================================================================
// FEATURE CARD.JSX - FULLY STANDARDIZED
// ==================================================================
// Typography: h3 text-base, p text-sm, link text-sm
// Colors: maroon-400 icons, beige-100 heading, beige-200/80 description
// Spacing: p-6, space-y-4, gap-2
// Animations: hover:-translate-y-2, transition-all duration-300

import { ArrowRight as ArrowRight2 } from 'lucide-react';
import { Link as Link2 } from 'react-router-dom';

export function FeatureCard({ icon: Icon, title, description, link, delay = 0 }) {
  const CardWrapper = link ? Link2 : 'div';
  const wrapperProps = link ? { to: link } : {};

  return (
    <CardWrapper
      {...wrapperProps}
      className="glass-card p-6 hover:-translate-y-2 transition-all duration-300 group"
      style={{ animation: `slideUp 0.8s ease-out ${delay}s backwards` }}
    >
      <div className="space-y-4">
        <div className="p-4 bg-maroon-600/20 rounded-full w-fit group-hover:bg-maroon-600/30 transition-colors">
          <Icon className="w-8 h-8 text-maroon-400" />
        </div>
        
        <div>
          <h3 className="text-base font-bold text-beige-100 mb-2">{title}</h3>
          <p className="text-sm text-beige-200/80 leading-relaxed">{description}</p>
        </div>

        {link && (
          <div className="flex items-center gap-2 text-sm text-maroon-300 font-medium group-hover:gap-3 transition-all">
            Learn more
            <ArrowRight2 className="w-4 h-4" />
          </div>
        )}
      </div>
    </CardWrapper>
  );
}