// ==================================================================
// TECH STACK BADGE.JSX - FULLY STANDARDIZED
// ==================================================================
// Typography: text-sm name, text-xs category
// Colors: beige-100 name, beige-300 category, maroon-600/20 bg
// Spacing: p-6, aspect-square, mb-3
// Animations: hover:scale-110, group-hover:animate-bounce, transition-all duration-300

export function TechStackBadge({ icon, name, category }) {
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
