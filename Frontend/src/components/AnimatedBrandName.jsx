import React from 'react';

/**
 * ============================================================================
 * @component AnimatedBrandName
 * @description Renders a brand typography string (e.g. "Dabba") where each
 * letter smoothly cascades into view from left to right with blur resolution,
 * spring bounce overshoot, radiant warm glow, and an automated reanimation cycle.
 *
 * @param {string} text - The brand name or word to animate (default: 'Dabba')
 * @param {string} className - Additional Tailwind CSS classes to append
 * @param {object} style - Inline style overrides
 * ============================================================================
 */
const AnimatedBrandName = ({ text = 'Dabba', className = '', style = {} }) => {
  const letters = Array.from(text);

  return (
    <span
      className={`inline-flex items-baseline font-black tracking-tight select-none ${className}`}
      style={style}
      aria-label={text}
    >
      {letters.map((char, idx) => {
        if (char === ' ') {
          return <span key={idx} className="inline-block">&nbsp;</span>;
        }

        return (
          <span
            key={idx}
            className="dabba-letter inline-block"
            style={{
              // Left-to-right cascade stagger delay (0.12s per character)
              animationDelay: `${idx * 0.12}s`,
              backgroundPosition: `${(idx / (letters.length - 1 || 1)) * 100}% 50%`
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};

export default AnimatedBrandName;
