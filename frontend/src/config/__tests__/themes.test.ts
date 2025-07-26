import { crtThemes, getThemeById, getDefaultTheme } from '../themes';

describe('Theme Configuration', () => {
  describe('crtThemes', () => {
    it('contains all required themes', () => {
      expect(crtThemes).toHaveLength(5);
      
      const themeIds = crtThemes.map(theme => theme.id);
      expect(themeIds).toContain('green-phosphor');
      expect(themeIds).toContain('amber-terminal');
      expect(themeIds).toContain('blue-screen');
      expect(themeIds).toContain('white-terminal');
      expect(themeIds).toContain('cyan-matrix');
    });

    it('has valid theme structure for all themes', () => {
      crtThemes.forEach(theme => {
        // Basic properties
        expect(theme).toHaveProperty('id');
        expect(theme).toHaveProperty('name');
        expect(theme).toHaveProperty('description');
        
        // Colors
        expect(theme.colors).toHaveProperty('background');
        expect(theme.colors).toHaveProperty('text');
        expect(theme.colors).toHaveProperty('textDim');
        expect(theme.colors).toHaveProperty('textBright');
        expect(theme.colors).toHaveProperty('phosphor');
        expect(theme.colors).toHaveProperty('screenBg');
        expect(theme.colors).toHaveProperty('bezelBg');
        expect(theme.colors).toHaveProperty('frameBg');
        
        // Effects
        expect(theme.effects).toHaveProperty('scanlineColor');
        expect(theme.effects).toHaveProperty('scanlineOpacity');
        expect(theme.effects).toHaveProperty('glowColor');
        expect(theme.effects).toHaveProperty('flickerIntensity');
        expect(theme.effects).toHaveProperty('curveIntensity');
        
        // Typography
        expect(theme.typography).toHaveProperty('fontFamily');
        expect(theme.typography).toHaveProperty('fontSize');
        expect(theme.typography.fontSize).toHaveProperty('xs');
        expect(theme.typography.fontSize).toHaveProperty('sm');
        expect(theme.typography.fontSize).toHaveProperty('base');
        expect(theme.typography.fontSize).toHaveProperty('lg');
      });
    });

    it('has valid color values (hex format)', () => {
      const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
      
      crtThemes.forEach(theme => {
        Object.values(theme.colors).forEach(color => {
          expect(color).toMatch(hexColorRegex);
        });
        expect(theme.effects.scanlineColor).toMatch(hexColorRegex);
        expect(theme.effects.glowColor).toMatch(hexColorRegex);
      });
    });

    it('has valid numeric ranges for effects', () => {
      crtThemes.forEach(theme => {
        expect(theme.effects.scanlineOpacity).toBeGreaterThanOrEqual(0);
        expect(theme.effects.scanlineOpacity).toBeLessThanOrEqual(1);
        
        expect(theme.effects.flickerIntensity).toBeGreaterThanOrEqual(0);
        expect(theme.effects.flickerIntensity).toBeLessThanOrEqual(1);
        
        expect(theme.effects.curveIntensity).toBeGreaterThan(0);
      });
    });

    it('has consistent font family across themes', () => {
      const expectedFontFamily = 'IBM Plex Mono, Courier New, monospace';
      
      crtThemes.forEach(theme => {
        expect(theme.typography.fontFamily).toBe(expectedFontFamily);
      });
    });
  });

  describe('getThemeById', () => {
    it('returns correct theme for valid ID', () => {
      const theme = getThemeById('amber-terminal');
      expect(theme.id).toBe('amber-terminal');
      expect(theme.name).toBe('Amber Terminal');
    });

    it('returns default theme for invalid ID', () => {
      const theme = getThemeById('invalid-theme');
      expect(theme.id).toBe('green-phosphor');
    });

    it('returns default theme for empty string', () => {
      const theme = getThemeById('');
      expect(theme.id).toBe('green-phosphor');
    });

    it('handles case sensitivity', () => {
      const theme = getThemeById('AMBER-TERMINAL');
      expect(theme.id).toBe('green-phosphor'); // Should fall back to default
    });
  });

  describe('getDefaultTheme', () => {
    it('returns green phosphor theme as default', () => {
      const defaultTheme = getDefaultTheme();
      expect(defaultTheme.id).toBe('green-phosphor');
      expect(defaultTheme.name).toBe('Green Phosphor');
    });

    it('returns the first theme in the array', () => {
      const defaultTheme = getDefaultTheme();
      expect(defaultTheme).toBe(crtThemes[0]);
    });
  });

  describe('Theme Specific Tests', () => {
    it('green phosphor theme has correct properties', () => {
      const theme = getThemeById('green-phosphor');
      expect(theme.colors.text).toBe('#00ff41');
      expect(theme.colors.background).toBe('#000000');
      expect(theme.effects.scanlineColor).toBe('#00ff41');
    });

    it('amber terminal theme has correct properties', () => {
      const theme = getThemeById('amber-terminal');
      expect(theme.colors.text).toBe('#ffb000');
      expect(theme.colors.background).toBe('#1a0f00');
      expect(theme.effects.scanlineColor).toBe('#ffb000');
    });

    it('blue screen theme has correct properties', () => {
      const theme = getThemeById('blue-screen');
      expect(theme.colors.text).toBe('#00ccff');
      expect(theme.colors.background).toBe('#000033');
      expect(theme.effects.scanlineColor).toBe('#00ccff');
    });

    it('white terminal theme has correct properties', () => {
      const theme = getThemeById('white-terminal');
      expect(theme.colors.text).toBe('#ffffff');
      expect(theme.colors.background).toBe('#111111');
      expect(theme.effects.scanlineColor).toBe('#ffffff');
    });

    it('cyan matrix theme has correct properties', () => {
      const theme = getThemeById('cyan-matrix');
      expect(theme.colors.text).toBe('#00ffff');
      expect(theme.colors.background).toBe('#001a1a');
      expect(theme.effects.scanlineColor).toBe('#00ffff');
    });
  });
});