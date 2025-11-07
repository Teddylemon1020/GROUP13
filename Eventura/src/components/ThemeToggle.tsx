'use client';

import { useTheme } from '@/app/providers/ThemeProvider';
import { themes, ThemeName } from '@/styles/themes';
import { useState, useRef, useEffect } from 'react';

export default function ThemeToggle() {
  const { currentTheme, setTheme, availableThemes, customColors, setCustomColors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowColorPicker(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const themeIcons: Record<ThemeName, string> = {
    default: '☀️',
    dark: '🌙',
    ocean: '🌊',
    forest: '🌲',
    custom: '🎨',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80"
        style={{
          background: 'var(--card-bg)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        }}
        aria-label="Toggle theme"
      >
        <span className="text-xl">{themeIcons[currentTheme]}</span>
        <span className="text-sm font-medium hidden sm:inline">
          {themes[currentTheme].displayName}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && !showColorPicker && (
        <div
          className="absolute top-full right-0 mt-2 py-2 rounded-lg shadow-lg z-50 min-w-[180px]"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            boxShadow: '0 10px 25px var(--shadow)',
          }}
        >
          {availableThemes.map((themeName) => (
            <button
              key={themeName}
              onClick={() => {
                if (themeName === 'custom') {
                  setTheme(themeName);
                  setShowColorPicker(true);
                } else {
                  setTheme(themeName);
                  setIsOpen(false);
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150"
              style={{
                background: currentTheme === themeName ? 'var(--card-hover)' : 'transparent',
                color: 'var(--foreground)',
              }}
              onMouseEnter={(e) => {
                if (currentTheme !== themeName) {
                  e.currentTarget.style.background = 'var(--card-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentTheme !== themeName) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span className="text-xl">{themeIcons[themeName]}</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{themes[themeName].displayName}</div>
              </div>
              {currentTheme === themeName && (
                <svg
                  className="w-5 h-5"
                  style={{ color: 'var(--primary)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {isOpen && showColorPicker && (
        <div
          className="absolute top-full right-0 mt-2 p-4 rounded-lg shadow-lg z-50 min-w-[280px]"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            boxShadow: '0 10px 25px var(--shadow)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
              🎨 Custom Theme
            </h3>
            <button
              onClick={() => setShowColorPicker(false)}
              className="p-1 rounded transition-all"
              style={{ color: 'var(--muted)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--card-hover)';
                e.currentTarget.style.color = 'var(--foreground)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--muted)';
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColors.background}
                  onChange={(e) => setCustomColors({ ...customColors, background: e.target.value })}
                  className="w-12 h-9 rounded cursor-pointer"
                  style={{ border: '1px solid var(--border)' }}
                />
                <input
                  type="text"
                  value={customColors.background}
                  onChange={(e) => setCustomColors({ ...customColors, background: e.target.value })}
                  className="flex-1 px-3 py-1.5 rounded text-sm font-mono"
                  style={{
                    background: 'var(--input-bg)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                  }}
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
                Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColors.foreground}
                  onChange={(e) => setCustomColors({ ...customColors, foreground: e.target.value })}
                  className="w-12 h-9 rounded cursor-pointer"
                  style={{ border: '1px solid var(--border)' }}
                />
                <input
                  type="text"
                  value={customColors.foreground}
                  onChange={(e) => setCustomColors({ ...customColors, foreground: e.target.value })}
                  className="flex-1 px-3 py-1.5 rounded text-sm font-mono"
                  style={{
                    background: 'var(--input-bg)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                  }}
                  placeholder="#000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
                Primary/Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColors.primary}
                  onChange={(e) => setCustomColors({ ...customColors, primary: e.target.value })}
                  className="w-12 h-9 rounded cursor-pointer"
                  style={{ border: '1px solid var(--border)' }}
                />
                <input
                  type="text"
                  value={customColors.primary}
                  onChange={(e) => setCustomColors({ ...customColors, primary: e.target.value })}
                  className="flex-1 px-3 py-1.5 rounded text-sm font-mono"
                  style={{
                    background: 'var(--input-bg)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                  }}
                  placeholder="#4f46e5"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                setShowColorPicker(false);
              }}
              className="w-full mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: 'var(--primary)',
                color: '#ffffff',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary)'}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
