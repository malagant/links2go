import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Link, Copy, ExternalLink, QrCode, Trash2, Clock } from 'lucide-react';
import { urlService } from '../services/api';
import QRCodeDisplay from './QRCodeDisplay';
import type { ShortenUrlRequest, ShortenUrlResponse } from '../types';

interface Props {
  onConnectionChange: (connected: boolean) => void;
}

interface ShortenedUrl extends ShortenUrlResponse {
  id: string;
  createdAt: string;
}

export default function UrlShortener({ onConnectionChange }: Props) {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [expiresIn, setExpiresIn] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [showQR, setShowQR] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check server health on mount
  useEffect(() => {
    checkServerHealth();
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const checkServerHealth = async () => {
    try {
      const isHealthy = await urlService.checkHealth();
      onConnectionChange(isHealthy);
    } catch {
      onConnectionChange(false);
    }
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Please enter a URL to shorten');
      return;
    }

    if (!validateUrl(url)) {
      toast.error('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setIsLoading(true);

    try {
      const request: ShortenUrlRequest = {
        url: url.trim(),
        customCode: customCode.trim() || undefined,
        expiresIn: expiresIn ? Number(expiresIn) * 3600 : undefined, // Convert hours to seconds
      };

      const result = await urlService.shortenUrl(request);
      
      const newUrl: ShortenedUrl = {
        ...result,
        id: result.shortCode,
        createdAt: new Date().toISOString(),
      };

      setShortenedUrls(prev => [newUrl, ...prev]);
      
      // Reset form
      setUrl('');
      setCustomCode('');
      setExpiresIn('');
      
      toast.success('URL shortened successfully!');
      onConnectionChange(true);
    } catch (error: any) {
      console.error('Error shortening URL:', error);
      toast.error(error.error || 'Failed to shorten URL');
      onConnectionChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard!`);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const deleteUrl = async (shortCode: string) => {
    try {
      await urlService.deleteUrl(shortCode);
      setShortenedUrls(prev => prev.filter(url => url.shortCode !== shortCode));
      toast.success('URL deleted successfully');
    } catch (error: any) {
      toast.error(error.error || 'Failed to delete URL');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Terminal-style header */}
      <div className="terminal-text text-sm">
        <span className="text-retro-dim">$</span> links2go --shorten --interactive
      </div>

      {/* URL shortening form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-retro-text text-sm mb-2">
            [URL] Enter URL to shorten:
          </label>
          <input
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            className="retro-input w-full"
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-retro-text text-sm mb-2">
              [CUSTOM] Custom short code (optional):
            </label>
            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toLowerCase())}
              placeholder="my-link"
              pattern="[a-zA-Z0-9-_]+"
              className="retro-input w-full"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-retro-text text-sm mb-2">
              [EXPIRES] Expires in (hours, optional):
            </label>
            <input
              type="number"
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value ? Number(e.target.value) : '')}
              placeholder="24"
              min="1"
              max="8760"
              className="retro-input w-full"
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="retro-button w-full py-3"
        >
          {isLoading ? '[PROCESSING...]' : '[SHORTEN URL]'}
        </button>
      </form>

      {/* Results section */}
      {shortenedUrls.length > 0 && (
        <div className="space-y-4">
          <div className="terminal-text text-sm border-t border-retro-dim pt-4">
            <span className="text-retro-dim">$</span> links2go --list --recent
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {shortenedUrls.map((shortenedUrl) => (
              <div
                key={shortenedUrl.id}
                className="bg-retro-bg border border-retro-dim p-4 space-y-3"
              >
                {/* Original URL */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-retro-dim text-xs mb-1">ORIGINAL:</div>
                    <div className="text-retro-text text-sm break-all">
                      {shortenedUrl.originalUrl}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-retro-dim text-xs">
                      {formatTimeAgo(shortenedUrl.createdAt)}
                    </span>
                    {shortenedUrl.expiresAt && (
                      <Clock size={12} className="text-orange-500" />
                    )}
                  </div>
                </div>

                {/* Short URL */}
                <div>
                  <div className="text-retro-dim text-xs mb-1">SHORTENED:</div>
                  <div className="flex items-center justify-between bg-black border border-retro-dim p-2">
                    <span className="text-retro-bright font-mono text-sm flex-1">
                      {shortenedUrl.shortUrl}
                    </span>
                    <div className="flex items-center space-x-2 ml-2">
                      <button
                        onClick={() => copyToClipboard(shortenedUrl.shortUrl, 'Short URL')}
                        className="p-1 hover:text-retro-bright transition-colors"
                        title="Copy URL"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => window.open(shortenedUrl.shortUrl, '_blank')}
                        className="p-1 hover:text-retro-bright transition-colors"
                        title="Open URL"
                      >
                        <ExternalLink size={14} />
                      </button>
                      <button
                        onClick={() => setShowQR(shortenedUrl.shortCode)}
                        className="p-1 hover:text-retro-bright transition-colors"
                        title="Show QR Code"
                      >
                        <QrCode size={14} />
                      </button>
                      <button
                        onClick={() => deleteUrl(shortenedUrl.shortCode)}
                        className="p-1 hover:text-red-500 transition-colors"
                        title="Delete URL"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expiration info */}
                {shortenedUrl.expiresAt && (
                  <div className="text-orange-500 text-xs">
                    Expires: {new Date(shortenedUrl.expiresAt).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQR && (
        <QRCodeDisplay
          shortCode={showQR}
          onClose={() => setShowQR(null)}
        />
      )}
    </div>
  );
}