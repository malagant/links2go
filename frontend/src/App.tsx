import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { Monitor, Wifi, WifiOff } from 'lucide-react'
import UrlShortener from './components/UrlShortener'
import Analytics from './components/Analytics'

function App() {
  const [activeTab, setActiveTab] = useState<'shortener' | 'analytics'>('shortener')
  const [isConnected, setIsConnected] = useState(true)

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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="crt-monitor w-full max-w-6xl aspect-[4/3] crt-flicker">
        {/* Monitor bezel and frame */}
        <div className="crt-screen h-full relative overflow-hidden">
          {/* Scanlines overlay */}
          <div className="scanlines"></div>
          
          {/* Status bar */}
          <div className="flex justify-between items-center mb-6 text-retro-dim text-xs">
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
                    <Wifi size={16} className="text-retro-text" />
                    <span className="text-retro-text">ONLINE</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={16} className="text-red-500" />
                    <span className="text-red-500">OFFLINE</span>
                  </>
                )}
              </div>
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
                  ? 'bg-retro-text text-retro-bg' 
                  : 'bg-retro-bg text-retro-text border-retro-dim'
              }`}
            >
              [SHORTEN]
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`retro-button text-xs px-4 py-2 ${
                activeTab === 'analytics'
                  ? 'bg-retro-text text-retro-bg'
                  : 'bg-retro-bg text-retro-text border-retro-dim'
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
          <div className="absolute bottom-4 left-0 right-0 text-center text-retro-dim text-xs">
            <div className="flex justify-center items-center space-x-4">
              <span>[ESC] EXIT</span>
              <span>[TAB] SWITCH</span>
              <span>[ENTER] EXECUTE</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#000',
            color: '#00ff41',
            border: '1px solid #00ff41',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '12px',
          },
        }}
      />
    </div>
  )
}

export default App
