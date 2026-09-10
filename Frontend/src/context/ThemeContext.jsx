/**
 * ============================================================================
 * 🎨 DUAL-THEME ENGINE (TERRACOTTA REDDISH-ORANGE & ARTISANAL CHAI BEIGE)
 * ============================================================================
 * @module ThemeContext
 * @description
 * Manages restaurant application visual themes with persistence in localStorage.
 * Supported modes:
 *  - 'reddish-orange': Warm Spiced Terracotta dark mood with glowing amber accents.
 *  - 'beige': Artisanal Sand & Linen bright aesthetic with rich espresso typography.
 * Automatically injects data-theme attribute on <html> for CSS variable switching.
 * ============================================================================
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 'reddish-orange' (Spiced Terracotta) or 'beige' (Artisanal Linen)
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('dabba_theme') || 'reddish-orange';
  });

  useEffect(() => {
    localStorage.setItem('dabba_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'beige') {
      document.body.classList.add('theme-beige');
      document.body.classList.remove('theme-reddish-orange');
    } else {
      document.body.classList.add('theme-reddish-orange');
      document.body.classList.remove('theme-beige');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'reddish-orange' ? 'beige' : 'reddish-orange'));
  };

  const setTheme = (newTheme) => {
    if (newTheme === 'reddish-orange' || newTheme === 'beige') {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isReddishOrange: theme === 'reddish-orange',
        isBeige: theme === 'beige',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
