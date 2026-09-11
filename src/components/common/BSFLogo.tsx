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
      {/* Monogram Shield */}
      <div className={`relative ${current.icon} rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black p-[1px] shadow-lg shadow-orange-500/20 border border-zinc-700/60 flex items-center justify-center group`}>
        <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle background angular lines */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(249,115,22,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-pulse" />
          
          <div className="flex items-center justify-center font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-orange-300 to-orange-500 font-display">
            <span className={size === 'sm' ? 'text-xs' : size === 'md' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-3xl'}>
              BSF
            </span>
          </div>

          {/* Micro corner accent */}
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-orange-500 rounded-tl-sm opacity-90" />
        </div>
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
