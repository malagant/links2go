import React, { useState } from 'react';
import { Settings as SettingsIcon, X, Monitor, Palette, RotateCcw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import type { CRTTheme } from '../types/theme';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { currentTheme, themes, setTheme, resetToDefault } = useTheme();
  const [selectedThemeId, setSelectedThemeId] = useState(currentTheme.id);

  const handleThemeChange = (themeId: string) => {
    setSelectedThemeId(themeId);
    setTheme(themeId);
  };

  const handleReset = () => {
    resetToDefault();
    setSelectedThemeId(themes[0].id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-80" 
        onClick={onClose}
        data-testid="settings-backdrop"
      />
      
      {/* Settings Modal */}
      <div className="relative w-full max-w-4xl h-full max-h-[600px] crt-monitor">
        <div className="crt-screen h-full flex flex-col">
          {/* Scanlines */}
          <div className="scanlines"></div>
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6 text-theme-text">
            <div className="flex items-center space-x-2">
              <SettingsIcon size={20} className="text-theme-text" />
              <h2 className="terminal-text text-lg font-bold uppercase tracking-wider">
                [SYSTEM CONFIGURATION]
              </h2>
            </div>
            <button
              onClick={onClose}
              className="retro-button p-2 hover:bg-theme-text hover:text-theme-bg"
              data-testid="close-settings"
              aria-label="Close settings"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto space-y-8">
            {/* Theme Selection Section */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Palette size={16} className="text-theme-text" />
                <h3 className="terminal-text text-sm font-semibold uppercase tracking-wide">
                  CRT DISPLAY THEMES
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {themes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    isSelected={selectedThemeId === theme.id}
                    onSelect={() => handleThemeChange(theme.id)}
                  />
                ))}
              </div>
            </section>

            {/* Theme Info Section */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Monitor size={16} className="text-theme-text" />
                <h3 className="terminal-text text-sm font-semibold uppercase tracking-wide">
                  CURRENT THEME INFO
                </h3>
              </div>
              
              <div className="bg-theme-screen-bg border border-theme-text-dim p-4 rounded">
                <div className="space-y-2 text-xs terminal-text">
                  <div>
                    <span className="text-theme-text-dim">NAME:</span>{' '}
                    <span className="text-theme-text">{currentTheme.name}</span>
                  </div>
                  <div>
                    <span className="text-theme-text-dim">DESCRIPTION:</span>{' '}
                    <span className="text-theme-text">{currentTheme.description}</span>
                  </div>
                  <div>
                    <span className="text-theme-text-dim">PHOSPHOR:</span>{' '}
                    <span 
                      className="text-theme-text"
                      style={{ color: currentTheme.colors.phosphor }}
                    >
                      {currentTheme.colors.phosphor}
                    </span>
                  </div>
                  <div>
                    <span className="text-theme-text-dim">SCANLINE OPACITY:</span>{' '}
                    <span className="text-theme-text">
                      {Math.round(currentTheme.effects.scanlineOpacity * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-theme-text-dim">
            <button
              onClick={handleReset}
              className="retro-button flex items-center space-x-2 text-xs px-4 py-2"
              data-testid="reset-theme"
            >
              <RotateCcw size={14} />
              <span>[RESET TO DEFAULT]</span>
            </button>
            
            <div className="text-theme-text-dim text-xs">
              [ESC] CLOSE • [ENTER] APPLY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ThemeCardProps {
  theme: CRTTheme;
  isSelected: boolean;
  onSelect: () => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, isSelected, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`relative p-4 border-2 transition-all duration-200 hover:scale-105 ${
        isSelected
          ? 'border-theme-text bg-theme-text bg-opacity-10'
          : 'border-theme-text-dim hover:border-theme-text'
      }`}
      data-testid={`theme-${theme.id}`}
    >
      {/* Theme Preview */}
      <div 
        className="w-full h-20 mb-3 border rounded"
        style={{
          backgroundColor: theme.colors.screenBg,
          borderColor: theme.colors.textDim,
        }}
      >
        <div 
          className="h-full flex items-center justify-center text-xs font-mono"
          style={{
            color: theme.colors.text,
            textShadow: `0 0 5px ${theme.colors.phosphor}`,
          }}
        >
          SAMPLE TEXT
        </div>
      </div>
      
      {/* Theme Info */}
      <div className="text-left">
        <h4 className="terminal-text text-xs font-semibold mb-1 uppercase tracking-wide">
          {theme.name}
        </h4>
        <p className="text-theme-text-dim text-xs leading-tight">
          {theme.description}
        </p>
      </div>
      
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-theme-text"></div>
      )}
    </button>
  );
};

export default Settings;