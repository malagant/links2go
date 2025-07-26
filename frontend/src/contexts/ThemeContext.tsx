import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { CRTTheme, ThemeContextType } from '../types/theme';
import { crtThemes, getThemeById, getDefaultTheme } from '../config/themes';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'links2go-theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<CRTTheme>(getDefaultTheme());

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedThemeId) {
      const theme = getThemeById(savedThemeId);
      setCurrentTheme(theme);
    }
  }, []);

  // Apply theme CSS variables when theme changes
  useEffect(() => {
    applyThemeToDOM(currentTheme);
  }, [currentTheme]);

  const setTheme = (themeId: string) => {
    const theme = getThemeById(themeId);
    setCurrentTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  };

  const resetToDefault = () => {
    const defaultTheme = getDefaultTheme();
    setCurrentTheme(defaultTheme);
    localStorage.setItem(THEME_STORAGE_KEY, defaultTheme.id);
  };

  const value: ThemeContextType = {
    currentTheme,
    themes: crtThemes,
    setTheme,
    resetToDefault,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Helper function to apply theme CSS variables to DOM
const applyThemeToDOM = (theme: CRTTheme) => {
  const root = document.documentElement;
  
  // Apply color variables
  root.style.setProperty('--theme-bg', theme.colors.background);
  root.style.setProperty('--theme-text', theme.colors.text);
  root.style.setProperty('--theme-text-dim', theme.colors.textDim);
  root.style.setProperty('--theme-text-bright', theme.colors.textBright);
  root.style.setProperty('--theme-phosphor', theme.colors.phosphor);
  root.style.setProperty('--theme-screen-bg', theme.colors.screenBg);
  root.style.setProperty('--theme-bezel-bg', theme.colors.bezelBg);
  root.style.setProperty('--theme-frame-bg', theme.colors.frameBg);
  
  // Apply effect variables
  root.style.setProperty('--theme-scanline-color', theme.effects.scanlineColor);
  root.style.setProperty('--theme-scanline-opacity', theme.effects.scanlineOpacity.toString());
  root.style.setProperty('--theme-glow-color', theme.effects.glowColor);
  root.style.setProperty('--theme-flicker-intensity', (1 - theme.effects.flickerIntensity).toString());
  root.style.setProperty('--theme-curve-intensity', theme.effects.curveIntensity.toString());
  
  // Apply typography variables
  root.style.setProperty('--theme-font-family', theme.typography.fontFamily);
  root.style.setProperty('--theme-font-size-xs', theme.typography.fontSize.xs);
  root.style.setProperty('--theme-font-size-sm', theme.typography.fontSize.sm);
  root.style.setProperty('--theme-font-size-base', theme.typography.fontSize.base);
  root.style.setProperty('--theme-font-size-lg', theme.typography.fontSize.lg);
};