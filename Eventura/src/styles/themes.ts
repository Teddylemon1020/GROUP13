export type ThemeName = 'default' | 'dark' | 'ocean' | 'forest' | 'custom';

export interface Theme {
  name: ThemeName;
  displayName: string;
  colors: {
    background: string;
    foreground: string;
    cardBg: string;
    cardHover: string;
    border: string;
    borderHover: string;
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    muted: string;
    inputBg: string;
    shadow: string;
  };
}

export const themes: Record<ThemeName, Theme> = {
  // Default - White background with black text
  default: {
    name: 'default',
    displayName: 'Default Light',
    colors: {
      background: '#ffffff',
      foreground: '#000000',
      cardBg: '#f5f5f5',
      cardHover: '#ececec',
      border: '#e0e0e0',
      borderHover: '#d0d0d0',
      primary: '#4f46e5',       // Indigo
      primaryHover: '#4338ca',
      secondary: '#7c3aed',      // Purple
      accent: '#0891b2',         // Cyan
      success: '#059669',        // Green
      warning: '#d97706',        // Amber
      error: '#dc2626',          // Red
      muted: '#6b7280',          // Gray
      inputBg: '#fafafa',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
  },

  // Dark - Dark background with light text
  dark: {
    name: 'dark',
    displayName: 'Dark',
    colors: {
      background: '#0a0a0a',
      foreground: '#e5e5e5',
      cardBg: '#161616',
      cardHover: '#1f1f1f',
      border: '#2a2a2a',
      borderHover: '#3a3a3a',
      primary: '#6366f1',        // Indigo
      primaryHover: '#4f46e5',
      secondary: '#8b5cf6',      // Purple
      accent: '#06b6d4',         // Cyan
      success: '#10b981',        // Green
      warning: '#f59e0b',        // Amber
      error: '#ef4444',          // Red
      muted: '#6b7280',          // Gray
      inputBg: '#1a1a1a',
      shadow: 'rgba(0, 0, 0, 0.3)',
    },
  },

  // Ocean Blue - Blue-themed
  ocean: {
    name: 'ocean',
    displayName: 'Ocean Blue',
    colors: {
      background: '#ffffff',
      foreground: '#0c4a6e',     // Deep blue text
      cardBg: '#f0f9ff',         // Light blue
      cardHover: '#e0f2fe',
      border: '#bae6fd',
      borderHover: '#7dd3fc',
      primary: '#0284c7',        // Sky blue
      primaryHover: '#0369a1',
      secondary: '#0891b2',      // Cyan
      accent: '#06b6d4',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      muted: '#64748b',          // Slate
      inputBg: '#f8fafc',
      shadow: 'rgba(2, 132, 199, 0.15)',
    },
  },

  // Forest Green - Green-themed
  forest: {
    name: 'forest',
    displayName: 'Forest Green',
    colors: {
      background: '#ffffff',
      foreground: '#14532d',     // Deep green text
      cardBg: '#f0fdf4',         // Light green
      cardHover: '#dcfce7',
      border: '#bbf7d0',
      borderHover: '#86efac',
      primary: '#16a34a',        // Green
      primaryHover: '#15803d',
      secondary: '#059669',      // Emerald
      accent: '#0d9488',         // Teal
      success: '#10b981',
      warning: '#d97706',
      error: '#dc2626',
      muted: '#6b7280',
      inputBg: '#f9fafb',
      shadow: 'rgba(22, 163, 74, 0.15)',
    },
  },

  // Custom - User-defined colors
  custom: {
    name: 'custom',
    displayName: 'Custom',
    colors: {
      background: '#ffffff',
      foreground: '#000000',
      cardBg: '#f5f5f5',
      cardHover: '#ececec',
      border: '#e0e0e0',
      borderHover: '#d0d0d0',
      primary: '#4f46e5',
      primaryHover: '#4338ca',
      secondary: '#7c3aed',
      accent: '#0891b2',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      muted: '#6b7280',
      inputBg: '#fafafa',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
  },
};

export const defaultTheme: ThemeName = 'default';

// Helper function to generate derived colors based on background and foreground
export function generateCustomTheme(background: string, foreground: string, primary: string): Theme['colors'] {
  // Convert hex to RGB for opacity calculations
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const bgRgb = hexToRgb(background);
  const fgRgb = hexToRgb(foreground);
  const primaryRgb = hexToRgb(primary);

  // Determine if background is dark or light
  const isDark = bgRgb ? (bgRgb.r * 0.299 + bgRgb.g * 0.587 + bgRgb.b * 0.114) < 128 : false;

  // Generate card colors based on background
  const adjustBrightness = (rgb: {r: number, g: number, b: number}, amount: number) => {
    const r = Math.max(0, Math.min(255, rgb.r + amount));
    const g = Math.max(0, Math.min(255, rgb.g + amount));
    const b = Math.max(0, Math.min(255, rgb.b + amount));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const darkenPrimary = (rgb: {r: number, g: number, b: number}, amount: number) => {
    const r = Math.max(0, Math.min(255, Math.floor(rgb.r * amount)));
    const g = Math.max(0, Math.min(255, Math.floor(rgb.g * amount)));
    const b = Math.max(0, Math.min(255, Math.floor(rgb.b * amount)));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  return {
    background,
    foreground,
    cardBg: bgRgb ? adjustBrightness(bgRgb, isDark ? 10 : -10) : '#f5f5f5',
    cardHover: bgRgb ? adjustBrightness(bgRgb, isDark ? 20 : -20) : '#ececec',
    border: bgRgb ? adjustBrightness(bgRgb, isDark ? 30 : -30) : '#e0e0e0',
    borderHover: bgRgb ? adjustBrightness(bgRgb, isDark ? 40 : -40) : '#d0d0d0',
    primary,
    primaryHover: primaryRgb ? darkenPrimary(primaryRgb, 0.85) : '#4338ca',
    secondary: primary,
    accent: primary,
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    muted: fgRgb ? `rgba(${fgRgb.r}, ${fgRgb.g}, ${fgRgb.b}, 0.6)` : '#6b7280',
    inputBg: bgRgb ? adjustBrightness(bgRgb, isDark ? 5 : -5) : '#fafafa',
    shadow: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
  };
}
