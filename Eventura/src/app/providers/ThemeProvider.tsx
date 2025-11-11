'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeName, themes, defaultTheme, generateCustomTheme } from '@/styles/themes';

interface CustomColors {
  background: string;
  foreground: string;
  primary: string;
}

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  availableThemes: ThemeName[];
  customColors: CustomColors;
  setCustomColors: (colors: CustomColors) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(defaultTheme);
  const [customColors, setCustomColorsState] = useState<CustomColors>({
    background: '#ffffff',
    foreground: '#000000',
    primary: '#4f46e5',
  });
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage and apply immediately on mount
  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem('theme') as ThemeName;
    const savedCustomColors = localStorage.getItem('customColors');

    if (savedCustomColors) {
      try {
        const parsedColors = JSON.parse(savedCustomColors);
        setCustomColorsState(parsedColors);
      } catch (e) {
        console.error('Failed to parse custom colors');
      }
    }

    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
      if (savedTheme === 'custom' && savedCustomColors) {
        const parsedColors = JSON.parse(savedCustomColors);
        applyCustomTheme(parsedColors);
      } else {
        applyTheme(savedTheme);
      }
    } else {
      applyTheme(defaultTheme);
    }
  }, []);

  // Apply theme helper function
  const applyTheme = (themeName: ThemeName) => {
    const theme = themes[themeName];
    const root = document.documentElement;

    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });
  };

  // Apply custom theme
  const applyCustomTheme = (colors: CustomColors) => {
    const customThemeColors = generateCustomTheme(colors.background, colors.foreground, colors.primary);
    const root = document.documentElement;

    Object.entries(customThemeColors).forEach(([key, value]) => {
      const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });
  };

  // Apply theme CSS variables when theme changes
  useEffect(() => {
    if (!mounted) return;

    if (currentTheme === 'custom') {
      applyCustomTheme(customColors);
    } else {
      applyTheme(currentTheme);
    }
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme, mounted]);

  // Apply custom colors when they change
  useEffect(() => {
    if (!mounted) return;
    if (currentTheme === 'custom') {
      applyCustomTheme(customColors);
      localStorage.setItem('customColors', JSON.stringify(customColors));
    }
  }, [customColors, mounted, currentTheme]);

  const setTheme = (theme: ThemeName) => {
    setCurrentTheme(theme);
  };

  const setCustomColors = (colors: CustomColors) => {
    setCustomColorsState(colors);
    localStorage.setItem('customColors', JSON.stringify(colors));
  };

  const availableThemes: ThemeName[] = ['default', 'dark', 'custom'];

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, availableThemes, customColors, setCustomColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
