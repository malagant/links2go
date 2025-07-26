export interface CRTTheme {
  id: string;
  name: string;
  description: string;
  colors: {
    background: string;
    text: string;
    textDim: string;
    textBright: string;
    phosphor: string;
    screenBg: string;
    bezelBg: string;
    frameBg: string;
  };
  effects: {
    scanlineColor: string;
    scanlineOpacity: number;
    glowColor: string;
    flickerIntensity: number;
    curveIntensity: number;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
    };
  };
}

export interface ThemeContextType {
  currentTheme: CRTTheme;
  themes: CRTTheme[];
  setTheme: (themeId: string) => void;
  resetToDefault: () => void;
}

export type ThemeId = 'green-phosphor' | 'amber-terminal' | 'blue-screen' | 'white-terminal' | 'cyan-matrix';