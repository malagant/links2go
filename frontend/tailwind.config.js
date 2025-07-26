/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['IBM Plex Mono', 'Courier New', 'monospace'],
        'retro': ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        'phosphor': {
          'green': '#00ff41',
          'amber': '#ffa500',
          'blue': '#00bfff',
        },
        'crt': {
          'screen': '#0a0a0a',
          'bezel': '#2a2a2a',
          'frame': '#1a1a1a',
        },
        'retro': {
          'bg': '#000000',
          'text': '#00ff41',
          'dim': '#008f20',
          'bright': '#40ff71',
        },
        'theme': {
          'bg': 'var(--theme-bg)',
          'text': 'var(--theme-text)',
          'text-dim': 'var(--theme-text-dim)',
          'text-bright': 'var(--theme-text-bright)',
          'phosphor': 'var(--theme-phosphor)',
          'screen-bg': 'var(--theme-screen-bg)',
          'bezel-bg': 'var(--theme-bezel-bg)',
          'frame-bg': 'var(--theme-frame-bg)',
        }
      },
      animation: {
        'flicker': 'flicker 0.15s infinite linear alternate',
        'scanline': 'scanline 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        flicker: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0.96' }
        },
        scanline: {
          '0%': { top: '-100%' },
          '100%': { top: '100%' }
        },
        glow: {
          '0%': { textShadow: '0 0 20px #00ff41, 0 0 30px #00ff41, 0 0 40px #00ff41' },
          '100%': { textShadow: '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41' }
        }
      },
      boxShadow: {
        'crt': '0 0 50px rgba(0, 255, 65, 0.3), inset 0 0 50px rgba(0, 255, 65, 0.1)',
        'screen': 'inset 0 0 100px rgba(0, 0, 0, 0.8)',
      }
    },
  },
  plugins: [],
}