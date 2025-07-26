import type { CRTTheme } from '../types/theme';

export const crtThemes: CRTTheme[] = [
  {
    id: 'green-phosphor',
    name: 'Green Phosphor',
    description: 'Classic monochrome terminal with green phosphor glow',
    colors: {
      background: '#000000',
      text: '#00ff41',
      textDim: '#008f20',
      textBright: '#40ff71',
      phosphor: '#00ff41',
      screenBg: '#0a0a0a',
      bezelBg: '#2a2a2a',
      frameBg: '#1a1a1a',
    },
    effects: {
      scanlineColor: '#00ff41',
      scanlineOpacity: 0.05,
      glowColor: '#00ff41',
      flickerIntensity: 0.04,
      curveIntensity: 1,
    },
    typography: {
      fontFamily: 'IBM Plex Mono, Courier New, monospace',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
      },
    },
  },
  {
    id: 'amber-terminal',
    name: 'Amber Terminal',
    description: 'Warm amber glow reminiscent of early computer terminals',
    colors: {
      background: '#1a0f00',
      text: '#ffb000',
      textDim: '#cc7700',
      textBright: '#ffd966',
      phosphor: '#ffb000',
      screenBg: '#2a1500',
      bezelBg: '#3d2f1f',
      frameBg: '#2a1f0f',
    },
    effects: {
      scanlineColor: '#ffb000',
      scanlineOpacity: 0.06,
      glowColor: '#ffb000',
      flickerIntensity: 0.06,
      curveIntensity: 1,
    },
    typography: {
      fontFamily: 'IBM Plex Mono, Courier New, monospace',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
      },
    },
  },
  {
    id: 'blue-screen',
    name: 'Blue Screen',
    description: 'Cool blue monochrome display of vintage computers',
    colors: {
      background: '#000033',
      text: '#00ccff',
      textDim: '#0066cc',
      textBright: '#66ddff',
      phosphor: '#00ccff',
      screenBg: '#001133',
      bezelBg: '#334466',
      frameBg: '#223344',
    },
    effects: {
      scanlineColor: '#00ccff',
      scanlineOpacity: 0.04,
      glowColor: '#00ccff',
      flickerIntensity: 0.03,
      curveIntensity: 1,
    },
    typography: {
      fontFamily: 'IBM Plex Mono, Courier New, monospace',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
      },
    },
  },
  {
    id: 'white-terminal',
    name: 'White Terminal',
    description: 'High contrast white phosphor display',
    colors: {
      background: '#111111',
      text: '#ffffff',
      textDim: '#cccccc',
      textBright: '#ffffff',
      phosphor: '#ffffff',
      screenBg: '#1a1a1a',
      bezelBg: '#404040',
      frameBg: '#2a2a2a',
    },
    effects: {
      scanlineColor: '#ffffff',
      scanlineOpacity: 0.03,
      glowColor: '#ffffff',
      flickerIntensity: 0.02,
      curveIntensity: 0.8,
    },
    typography: {
      fontFamily: 'IBM Plex Mono, Courier New, monospace',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
      },
    },
  },
  {
    id: 'cyan-matrix',
    name: 'Cyan Matrix',
    description: 'Cyberpunk-inspired cyan matrix display',
    colors: {
      background: '#001a1a',
      text: '#00ffff',
      textDim: '#00cccc',
      textBright: '#66ffff',
      phosphor: '#00ffff',
      screenBg: '#002626',
      bezelBg: '#2a3333',
      frameBg: '#1a2626',
    },
    effects: {
      scanlineColor: '#00ffff',
      scanlineOpacity: 0.07,
      glowColor: '#00ffff',
      flickerIntensity: 0.05,
      curveIntensity: 1.2,
    },
    typography: {
      fontFamily: 'IBM Plex Mono, Courier New, monospace',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
      },
    },
  },
];

export const getThemeById = (id: string): CRTTheme => {
  return crtThemes.find(theme => theme.id === id) || crtThemes[0];
};

export const getDefaultTheme = (): CRTTheme => crtThemes[0];