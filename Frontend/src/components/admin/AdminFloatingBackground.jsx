import React from 'react';
import { Crown, Sparkles, ChefHat, ShieldCheck, Flame, Utensils, Star } from 'lucide-react';

const AdminFloatingBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Ambient Radial Color Washes with Reddish Crimson & Imperial Purple */}
      <div 
        className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-rose-600/18 blur-3xl animate-pulse-glow-slow"
      />
      <div 
        className="absolute top-1/3 right-10 w-[28rem] h-[28rem] rounded-full bg-purple-600/14 blur-3xl animate-pulse-glow-slow"
        style={{ animationDelay: '3s' }}
      />
      <div 
        className="absolute -bottom-20 left-1/3 w-[32rem] h-[32rem] rounded-full bg-red-700/14 blur-3xl animate-pulse-glow-slow"
        style={{ animationDelay: '5s' }}
      />

      {/* Subtle Floating Decorative Elements with Crimson-Ruby & Amethyst Accents */}
      {/* 1. Crown / Royal Admin */}
      <div 
        className="absolute top-[12%] right-[15%] text-rose-400/25 animate-float-sway-1"
        style={{ filter: 'drop-shadow(0 0 14px rgba(244, 63, 94, 0.35))' }}
      >
        <Crown className="w-8 h-8" />
      </div>

      {/* 2. Sparkle Top Left */}
      <div 
        className="absolute top-[20%] left-[22%] text-rose-300/30 animate-float-sway-2"
      >
        <Sparkles className="w-6 h-6" />
      </div>

      {/* 3. Chef Hat Mid-Right */}
      <div 
        className="absolute top-[48%] right-[8%] text-purple-400/20 animate-float-drift"
      >
        <ChefHat className="w-9 h-9" />
      </div>

      {/* 4. Shield / Security Bottom Right */}
      <div 
        className="absolute bottom-[18%] right-[22%] text-indigo-400/20 animate-float-sway-3"
      >
        <ShieldCheck className="w-7 h-7" />
      </div>

      {/* 5. Flame / Kitchen Heat Bottom Left with Ruby Glow */}
      <div 
        className="absolute bottom-[28%] left-[18%] text-rose-500/25 animate-float-sway-1"
        style={{ filter: 'drop-shadow(0 0 12px rgba(225, 29, 72, 0.3))' }}
      >
        <Flame className="w-7 h-7" />
      </div>

      {/* 6. Utensils Mid Left */}
      <div 
        className="absolute top-[62%] left-[12%] text-purple-400/20 animate-float-sway-2"
      >
        <Utensils className="w-6 h-6" />
      </div>

      {/* 7. Star Top Center */}
      <div 
        className="absolute top-[8%] left-[55%] text-amber-300/25 animate-float-bob"
      >
        <Star className="w-5 h-5 fill-amber-300/25" />
      </div>
    </div>
  );
};

export default AdminFloatingBackground;
