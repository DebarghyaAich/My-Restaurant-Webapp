import React from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * FloatingBackground - Elegant ambient floating culinary particles & glow orbs.
 * Dynamically adjusts glow palette between Spiced Reddish-Orange and Warm Beige.
 * Tastefully infused with floating spices, herbs, aroma curls, and glowing embers.
 */
const FloatingBackground = () => {
  const { isBeige } = useTheme();

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none transition-opacity duration-700">
      
      {/* 1. Ambient Warm Glow Orbs */}
      {isBeige ? (
        // Beige Mode: Soft honey amber, warm terracotta, toasted almond glow
        <>
          <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] bg-orange-400/18 rounded-full blur-[100px] animate-pulse-glow-slow pointer-events-none" />
          <div className="absolute top-1/4 -right-36 w-[32rem] h-[32rem] bg-amber-400/15 rounded-full blur-[90px] animate-pulse-glow-slow pointer-events-none [animation-delay:3s]" />
          <div className="absolute top-2/3 -left-28 w-[30rem] h-[30rem] bg-rose-400/12 rounded-full blur-[90px] animate-pulse-glow-slow pointer-events-none [animation-delay:5s]" />
          <div className="absolute -bottom-40 right-1/4 w-[36rem] h-[36rem] bg-amber-500/14 rounded-full blur-[110px] animate-pulse-glow-slow pointer-events-none [animation-delay:2s]" />
        </>
      ) : (
        // Reddish-Orange / Terracotta Mode: Deep tandoor ember, rich saffron, warm paprika glow
        <>
          <div className="absolute -top-32 -left-32 w-[36rem] h-[36rem] bg-orange-600/22 rounded-full blur-[110px] animate-pulse-glow-slow pointer-events-none" />
          <div className="absolute top-1/3 -right-40 w-[34rem] h-[34rem] bg-amber-500/16 rounded-full blur-[100px] animate-pulse-glow-slow pointer-events-none [animation-delay:3s]" />
          <div className="absolute top-2/3 -left-32 w-[32rem] h-[32rem] bg-rose-600/18 rounded-full blur-[95px] animate-pulse-glow-slow pointer-events-none [animation-delay:5s]" />
          <div className="absolute -bottom-40 right-1/4 w-[38rem] h-[38rem] bg-orange-500/18 rounded-full blur-[120px] animate-pulse-glow-slow pointer-events-none [animation-delay:2s]" />
        </>
      )}

      {/* 2. Floating Culinary Micro-Elements, Spices & Sparkles */}
      
      {/* Top Left Floating Star Anise Sparkle */}
      <div className={`absolute top-20 left-[7%] text-xl font-serif animate-float-sway-1 ${isBeige ? 'text-orange-700/30' : 'text-amber-300/35'}`}>
        ✦
      </div>

      {/* Top Right Floating Fresh Herb Leaf */}
      <div className={`absolute top-28 right-[10%] text-xl animate-float-sway-2 ${isBeige ? 'opacity-35' : 'opacity-40'}`}>
        🌿
      </div>

      {/* Top Center Floating Aroma Steam */}
      <div className={`absolute top-14 left-[46%] text-lg animate-float-bob [animation-delay:1.5s] ${isBeige ? 'text-amber-800/25' : 'text-amber-200/30'}`}>
        ♨️
      </div>

      {/* Upper Mid Left Whole Red Chili Pepper */}
      <div className={`absolute top-[32%] left-[4%] text-lg animate-float-sway-3 ${isBeige ? 'opacity-40' : 'opacity-45'}`}>
        🌶️
      </div>

      {/* Upper Mid Center Golden Sparkle */}
      <div className={`absolute top-[36%] right-[28%] text-base animate-float-spin ${isBeige ? 'text-orange-600/30' : 'text-amber-400/35'}`}>
        ✨
      </div>

      {/* Mid Right Floating Cardamom Spice Motif */}
      <div className={`absolute top-[48%] right-[6%] text-lg font-serif animate-float-sway-1 [animation-delay:2s] ${isBeige ? 'text-orange-800/30' : 'text-amber-300/30'}`}>
        ✳️
      </div>

      {/* Mid Left Ember Glow Dot */}
      <div className="absolute top-[54%] left-[6%] animate-float-drift">
        <div className={`w-3 h-3 rounded-full blur-[1px] shadow-sm ${
          isBeige 
            ? 'bg-gradient-to-tr from-amber-500/40 to-orange-600/40 shadow-orange-600/20' 
            : 'bg-gradient-to-tr from-amber-400/45 to-orange-500/45 shadow-orange-500/30'
        }`} />
      </div>

      {/* Mid Center Delicate Star Sparkle */}
      <div className={`absolute top-[60%] left-[26%] text-sm font-serif animate-float-bob [animation-delay:3s] ${isBeige ? 'text-orange-700/25' : 'text-amber-300/30'}`}>
        ✦
      </div>

      {/* Lower Mid Right Floating Bay Leaf */}
      <div className={`absolute top-[68%] right-[14%] text-lg animate-float-sway-2 [animation-delay:3.5s] ${isBeige ? 'opacity-35' : 'opacity-40'}`}>
        🍃
      </div>

      {/* Lower Center Floating Golden Sparkle */}
      <div className={`absolute top-[75%] left-[48%] text-base animate-float-spin [animation-delay:4s] ${isBeige ? 'text-orange-600/30' : 'text-amber-300/35'}`}>
        💫
      </div>

      {/* Lower Left Culinary Star Motif */}
      <div className={`absolute top-[82%] left-[10%] text-xl font-serif animate-float-sway-3 [animation-delay:1s] ${isBeige ? 'text-amber-700/30' : 'text-orange-400/35'}`}>
        ✳️
      </div>

      {/* Lower Right Ember Dot */}
      <div className="absolute top-[86%] right-[8%] animate-float-drift [animation-delay:4s]">
        <div className={`w-3.5 h-3.5 rounded-full blur-[1px] ${
          isBeige 
            ? 'bg-gradient-to-tr from-orange-500/35 to-amber-400/35' 
            : 'bg-gradient-to-tr from-orange-400/35 to-amber-300/35'
        }`} />
      </div>

      {/* Bottom Center Floating Fresh Mint Leaf */}
      <div className={`absolute top-[92%] left-[34%] text-lg animate-float-sway-1 [animation-delay:5s] ${isBeige ? 'opacity-35' : 'opacity-40'}`}>
        🌿
      </div>

      {/* Bottom Right Floating Star Anise */}
      <div className={`absolute top-[94%] right-[18%] text-lg font-serif animate-float-sway-2 [animation-delay:2s] ${isBeige ? 'text-orange-800/30' : 'text-amber-400/35'}`}>
        ✦
      </div>

    </div>
  );
};

export default FloatingBackground;
