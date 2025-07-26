# 🎨 Theming System Guide

Links2Go features a comprehensive theming system that allows users to switch between various vintage CRT monitor looks. The system is built with React Context, CSS variables, and TypeScript for type safety.

## 📋 Table of Contents

- [Overview](#overview)
- [Available Themes](#available-themes)
- [Architecture](#architecture)
- [Usage](#usage)
- [Creating Custom Themes](#creating-custom-themes)
- [CSS Variables](#css-variables)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## 🔍 Overview

The theming system provides:
- **5 vintage CRT themes** with authentic retro styling
- **Persistent theme selection** via localStorage
- **Real-time theme switching** without page reload
- **Keyboard shortcuts** for accessibility
- **Type-safe theme definitions** with TypeScript
- **CSS variable-based styling** for performance

## 🖥️ Available Themes

### 1. Green Phosphor (Default)
- **Style**: Classic monochrome terminal
- **Colors**: Green phosphor on black background
- **Era**: 1970s-1980s computer terminals
- **Usage**: Default theme, most common vintage look

### 2. Amber Terminal
- **Style**: Warm amber glow display
- **Colors**: Orange/amber phosphor on dark brown background
- **Era**: 1980s business computers and workstations
- **Usage**: Warmer, easier on the eyes for extended use

### 3. Blue Screen
- **Style**: Cool blue monochrome display
- **Colors**: Cyan/blue phosphor on dark blue background
- **Era**: Vintage computer systems and scientific equipment
- **Usage**: High contrast, professional appearance

### 4. White Terminal
- **Style**: High contrast white phosphor
- **Colors**: Pure white on dark gray background
- **Era**: Modern terminal emulators and accessibility displays
- **Usage**: Maximum readability and contrast

### 5. Cyan Matrix
- **Style**: Cyberpunk-inspired matrix display
- **Colors**: Bright cyan on dark teal background
- **Era**: Sci-fi and cyberpunk aesthetic
- **Usage**: Modern retro-futuristic look

## 🏗️ Architecture

### Core Components

#### ThemeContext (`src/contexts/ThemeContext.tsx`)
```typescript
interface ThemeContextType {
  currentTheme: CRTTheme;
  themes: CRTTheme[];
  setTheme: (themeId: string) => void;
  resetToDefault: () => void;
}
```

#### Theme Configuration (`src/config/themes.ts`)
```typescript
interface CRTTheme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  effects: ThemeEffects;
  typography: ThemeTypography;
}
```

#### Settings Component (`src/components/Settings.tsx`)
- Visual theme selector with live previews
- Theme information display
- Reset to default functionality
- Keyboard navigation support

### Data Flow

1. **Theme Selection**: User selects theme in Settings modal
2. **Context Update**: ThemeContext updates current theme state
3. **Persistence**: Theme ID saved to localStorage
4. **CSS Variables**: Theme properties applied to DOM via CSS variables
5. **UI Update**: All components automatically use new theme styling

## 🚀 Usage

### Basic Implementation

```tsx
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <YourComponents />
    </ThemeProvider>
  );
}
```

### Using Theme in Components

```tsx
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { currentTheme, setTheme } = useTheme();
  
  return (
    <div className="bg-theme-bg text-theme-text">
      Current theme: {currentTheme.name}
    </div>
  );
}
```

### CSS Classes

The system provides utility classes for common theme properties:

```css
/* Text colors */
.text-theme-text         /* Primary text color */
.text-theme-text-dim     /* Dimmed text color */
.text-theme-text-bright  /* Bright/highlighted text */
.text-theme-phosphor     /* Phosphor glow color */

/* Background colors */
.bg-theme-bg             /* Main background */
.bg-theme-screen-bg      /* Screen/monitor background */
.bg-theme-text           /* Text color as background */

/* Border colors */
.border-theme-text       /* Primary border */
.border-theme-text-dim   /* Dimmed border */
```

## 🎨 Creating Custom Themes

### 1. Define Theme Object

```typescript
const myCustomTheme: CRTTheme = {
  id: 'my-custom-theme',
  name: 'My Custom Theme',
  description: 'A unique vintage computer display',
  colors: {
    background: '#000000',
    text: '#ff0000',
    textDim: '#cc0000',
    textBright: '#ff6666',
    phosphor: '#ff0000',
    screenBg: '#0a0000',
    bezelBg: '#2a0000',
    frameBg: '#1a0000',
  },
  effects: {
    scanlineColor: '#ff0000',
    scanlineOpacity: 0.05,
    glowColor: '#ff0000',
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
};
```

### 2. Add to Theme Array

```typescript
// In src/config/themes.ts
export const crtThemes: CRTTheme[] = [
  // ... existing themes
  myCustomTheme,
];
```

### 3. Color Guidelines

- **Use hex colors**: All colors should be in #RRGGBB format
- **Maintain contrast**: Ensure text is readable on backgrounds
- **Follow phosphor logic**: Text, phosphor, and glow colors should be related
- **Consider accessibility**: Provide sufficient contrast ratios

### 4. Effect Guidelines

- **Scanline opacity**: 0.02-0.1 (subtle to visible)
- **Flicker intensity**: 0.02-0.08 (minimal to noticeable)
- **Curve intensity**: 0.5-1.5 (subtle to pronounced CRT curvature)

## 🎛️ CSS Variables

The system uses CSS custom properties for dynamic theming:

```css
:root {
  /* Colors */
  --theme-bg: #000000;
  --theme-text: #00ff41;
  --theme-text-dim: #008f20;
  --theme-text-bright: #40ff71;
  --theme-phosphor: #00ff41;
  --theme-screen-bg: #0a0a0a;
  --theme-bezel-bg: #2a2a2a;
  --theme-frame-bg: #1a1a1a;
  
  /* Effects */
  --theme-scanline-color: #00ff41;
  --theme-scanline-opacity: 0.05;
  --theme-glow-color: #00ff41;
  --theme-flicker-intensity: 0.96;
  --theme-curve-intensity: 1;
  
  /* Typography */
  --theme-font-family: 'IBM Plex Mono, Courier New, monospace';
  --theme-font-size-xs: 0.75rem;
  --theme-font-size-sm: 0.875rem;
  --theme-font-size-base: 1rem;
  --theme-font-size-lg: 1.125rem;
}
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `F12` | Open/close settings |
| `Ctrl + ,` | Open settings (alternative) |
| `Tab` | Switch between main tabs |
| `Escape` | Close settings modal |

### Implementation

```typescript
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'F12' || (event.ctrlKey && event.key === ',')) {
      event.preventDefault();
      setShowSettings(true);
    }
    // ... more shortcuts
  };
  
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, []);
```

## 🧪 Testing

### Running Tests

```bash
# Run all theme-related tests
npm test -- --testPathPattern="theme|Theme"

# Run specific test files
npm test ThemeContext.test.tsx
npm test Settings.test.tsx
npm test themes.test.ts
```

### Test Coverage

The theming system includes comprehensive tests for:

- **Theme Context**: Provider functionality, theme switching, persistence
- **Settings Component**: UI interactions, theme selection, keyboard navigation
- **Theme Configuration**: Theme structure validation, color formats, utility functions
- **App Integration**: Keyboard shortcuts, theme application, UI updates

### Example Test

```typescript
it('switches theme and persists to localStorage', () => {
  render(
    <ThemeProvider>
      <TestComponent />
    </ThemeProvider>
  );

  fireEvent.click(screen.getByTestId('set-amber-theme'));

  expect(screen.getByTestId('current-theme')).toHaveTextContent('amber-terminal');
  expect(localStorage.setItem).toHaveBeenCalledWith('links2go-theme', 'amber-terminal');
});
```

## 🔧 Troubleshooting

### Common Issues

#### Theme Not Applying
```typescript
// Check if component is wrapped in ThemeProvider
function App() {
  return (
    <ThemeProvider> {/* Required wrapper */}
      <YourComponents />
    </ThemeProvider>
  );
}
```

#### CSS Variables Not Working
```css
/* Ensure CSS variables are used correctly */
.my-component {
  color: var(--theme-text); /* ✅ Correct */
  color: --theme-text;       /* ❌ Incorrect */
}
```

#### Theme Not Persisting
```typescript
// Check localStorage availability
if (typeof Storage !== 'undefined') {
  // localStorage is available
} else {
  // Handle fallback
}
```

#### TypeScript Errors
```typescript
// Ensure proper imports
import type { CRTTheme } from '../types/theme';
import { useTheme } from '../contexts/ThemeContext';
```

### Performance Considerations

- **CSS Variables**: More performant than class-based theming
- **Context Updates**: Only re-render when theme actually changes
- **localStorage**: Synchronous but minimal impact for theme IDs
- **Component Memoization**: Consider React.memo for theme-heavy components

### Browser Compatibility

- **CSS Variables**: Supported in all modern browsers (IE11+ with polyfill)
- **Color-mix()**: Modern browsers only (fallback colors provided)
- **localStorage**: Universal support

## 📚 Further Reading

- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [React Context API](https://react.dev/reference/react/useContext)
- [CRT Monitor History](https://en.wikipedia.org/wiki/Cathode-ray_tube)
- [Vintage Computer Displays](https://www.old-computers.com/museum/computer.asp?c=1)

---

**Need help?** Check the [main README](../README.md) or open an issue for theme-related questions.