import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Monitor, Wifi, WifiOff, Settings as SettingsIcon } from 'lucide-react'
import { ThemeProvider } from './contexts/ThemeContext'
import UrlShortener from './components/UrlShortener'
import Analytics from './components/Analytics'
import Settings from './components/Settings'

function App() {
  const [activeTab, setActiveTab] = useState<'shortener' | 'analytics'>('shortener')
  const [isConnected, setIsConnected] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // F12 or Ctrl+, for settings
      if (event.key === 'F12' || (event.ctrlKey && event.key === ',')) {
        event.preventDefault()
        setShowSettings(true)
      }
      // Tab to switch between tabs
      if (event.key === 'Tab' && !event.ctrlKey && !event.shiftKey && !event.altKey) {
        event.preventDefault()
        setActiveTab(current => current === 'shortener' ? 'analytics' : 'shortener')
      }
      // Escape to close settings
      if (event.key === 'Escape' && showSettings) {
        setShowSettings(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showSettings])

  // ASCII art for the retro feel
  const asciiLogo = `
██╗     ██╗███╗   ██╗██╗  ██╗███████╗██████╗  ██████╗  ██████╗ 
██║     ██║████╗  ██║██║ ██╔╝██╔════╝╚════██╗██╔════╝ ██╔═══██╗
██║     ██║██╔██╗ ██║█████╔╝ ███████╗ █████╔╝██║  ███╗██║   ██║
██║     ██║██║╚██╗██║██╔═██╗ ╚════██║██╔═══╝ ██║   ██║██║   ██║
███████╗██║██║ ╚████║██║  ██╗███████║███████╗╚██████╔╝╚██████╔╝
╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝  ╚═════╝ 
  `

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-theme-bg flex items-center justify-center p-4">
      <div className="crt-monitor w-full max-w-6xl aspect-[4/3] crt-flicker">
        {/* Monitor bezel and frame */}
        <div className="crt-screen h-full relative overflow-hidden">
          {/* Scanlines overlay */}
          <div className="scanlines"></div>
          
          {/* Status bar */}
          <div className="flex justify-between items-center mb-6 text-theme-text-dim text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Monitor size={16} />
                <span>LINKS2GO-TERMINAL-v1.0</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {isConnected ? (
                  <>
                    <Wifi size={16} className="text-theme-text" />
                    <span className="text-theme-text">ONLINE</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={16} className="text-red-500" />
                    <span className="text-red-500">OFFLINE</span>
                  </>
                )}
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center space-x-1 text-theme-text hover:text-theme-text-bright transition-colors"
                data-testid="open-settings"
                aria-label="Open settings"
              >
                <SettingsIcon size={16} />
                <span>SETTINGS</span>
              </button>
              <div className="status-light active"></div>
            </div>
          </div>

          {/* ASCII Logo */}
          <div className="text-center mb-8">
            <pre className="terminal-text text-xs leading-tight">
              {asciiLogo}
            </pre>
            <div className="terminal-text text-sm mt-2">
              [RETRO URL SHORTENING SYSTEM]
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('shortener')}
              className={`retro-button text-xs px-4 py-2 ${
                activeTab === 'shortener' 
                  ? 'bg-theme-text text-theme-bg' 
                  : 'bg-theme-bg text-theme-text border-theme-text-dim'
              }`}
            >
              [SHORTEN]
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`retro-button text-xs px-4 py-2 ${
                activeTab === 'analytics'
                  ? 'bg-theme-text text-theme-bg'
                  : 'bg-theme-bg text-theme-text border-theme-text-dim'
              }`}
            >
              [ANALYTICS]
            </button>
          </div>

          {/* Main content area */}
          <div className="flex-1 relative z-20">
            {activeTab === 'shortener' && (
              <UrlShortener onConnectionChange={setIsConnected} />
            )}
            {activeTab === 'analytics' && (
              <Analytics />
            )}
          </div>

          {/* Footer */}
          <div className="absolute bottom-4 left-0 right-0 text-center text-theme-text-dim text-xs">
            <div className="flex justify-center items-center space-x-4">
              <span>[ESC] EXIT</span>
              <span>[TAB] SWITCH</span>
              <span>[ENTER] EXECUTE</span>
              <span>[F12] SETTINGS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <Settings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--theme-bg)',
            color: 'var(--theme-text)',
            border: '1px solid var(--theme-text)',
            fontFamily: 'var(--theme-font-family)',
            fontSize: '12px',
          },
        }}
      />
      </div>
    </ThemeProvider>
  )
}

export default App
