// ==================================================================
// EMPTY STATE.JSX - FULLY STANDARDIZED
// ==================================================================
// Typography: h2 text-xl md:text-2xl, p text-base, button text-base
// Colors: maroon-400 icon bg, beige hierarchy text
// Spacing: py-16 px-4, mb-6, gap-2
// Animations: hover:scale-105 on button

import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EmptyState({ icon: Icon, heading, description, ctaLabel, ctaLink }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-maroon-400/20 rounded-full">
          <Icon className="w-10 h-10 text-maroon-400" />
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-beige-100 mb-3">{heading}</h2>
      <p className="text-base text-beige-200/80 max-w-md mb-6 leading-relaxed">{description}</p>

      {ctaLabel && ctaLink && (
        <Link
          to={ctaLink}
          className="inline-flex items-center gap-2 px-6 py-3 bg-maroon-600 hover:bg-maroon-700 text-beige-50 font-semibold text-base rounded-xl transition-all duration-300 hover:scale-105"
        >
          {ctaLabel}
          <ArrowRight className="w-5 h-5" />
        </Link>
      )}
    </div>
  );
}
