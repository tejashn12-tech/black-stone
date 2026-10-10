import React from 'react';

interface BSFLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'gold' | 'silver' | 'white';
}

export const BSFLogo: React.FC<BSFLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  variant = 'gold'
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base', sub: 'text-[9px]', padding: 'p-1' },
    md: { icon: 'w-10 h-10', text: 'text-xl', sub: 'text-[10px]', padding: 'p-1.5' },
    lg: { icon: 'w-14 h-14', text: 'text-2xl', sub: 'text-xs', padding: 'p-2' },
    xl: { icon: 'w-20 h-20', text: 'text-4xl', sub: 'text-sm', padding: 'p-3' }
  };

  const current = sizeMap[size];

  const accentGradient = variant === 'gold' 
    ? 'from-orange-500 via-orange-400 to-orange-500 text-black' 
    : variant === 'silver'
    ? 'from-zinc-200 via-zinc-400 to-zinc-300 text-black'
    : 'from-white via-zinc-200 to-zinc-400 text-black';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} id="bsf-brand-logo">
      {/* Emblem Logo Badge */}
      <div className={`relative ${current.icon} rounded-full flex-shrink-0 shadow-lg shadow-orange-500/25 border border-orange-500/60 hover:border-orange-400 transition-all duration-300 flex items-center justify-center group bg-zinc-950 overflow-hidden ring-1 ring-orange-500/20`}>
        <img
          src="/black_stone_fitness_emblem.svg"
          alt="Black Stone Fitness Logo Emblem"
          className="w-full h-full object-contain select-none group-hover:scale-105 transition-transform duration-300 rounded-full"
          loading="eager"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src.indexOf('/favicon.svg') === -1) {
              target.src = '/favicon.svg';
            }
          }}
        />
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-display tracking-wider text-white font-extrabold ${current.text}`}>
              BLACK STONE
            </span>
            <span className={`font-display tracking-wider text-orange-500 font-extrabold ${current.text}`}>
              FITNESS
            </span>
          </div>
          <span className={`text-zinc-400 font-semibold tracking-widest uppercase font-sans-body ${current.sub}`}>
            MYSURU • STRENGTH & CONDITIONING
          </span>
        </div>
      )}
    </div>
  );
};
