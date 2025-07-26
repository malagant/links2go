import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { X, Download, Copy } from 'lucide-react';
import { urlService } from '../services/api';
import type { QRCodeResponse } from '../types';

interface Props {
  shortCode: string;
  onClose: () => void;
}

export default function QRCodeDisplay({ shortCode, onClose }: Props) {
  const [qrData, setQrData] = useState<QRCodeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQRCode();
  }, [shortCode]);

  const loadQRCode = async () => {
    try {
      const result = await urlService.getQRCode(shortCode);
      setQrData(result);
    } catch (error: any) {
      toast.error(error.error || 'Failed to generate QR code');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrData) return;

    const link = document.createElement('a');
    link.href = qrData.qrCode;
    link.download = `qr-${shortCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded!');
  };

  const copyQRCode = async () => {
    if (!qrData) return;

    try {
      // Convert data URL to blob
      const response = await fetch(qrData.qrCode);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      
      toast.success('QR code copied to clipboard!');
    } catch {
      toast.error('Failed to copy QR code');
    }
  };

  const copyUrl = async () => {
    if (!qrData) return;
    
    try {
      await navigator.clipboard.writeText(qrData.shortUrl);
      toast.success('URL copied to clipboard!');
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-retro-bg border-2 border-retro-text p-6 max-w-md w-full mx-4 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="terminal-text text-lg">QR CODE GENERATOR</h3>
          <button
            onClick={onClose}
            className="text-retro-text hover:text-retro-bright transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="terminal-text">GENERATING QR CODE...</div>
            <div className="text-retro-dim text-sm mt-2">Please wait...</div>
          </div>
        ) : qrData ? (
          <div className="space-y-4">
            {/* QR Code */}
            <div className="bg-white p-4 rounded border-2 border-retro-dim">
              <img
                src={qrData.qrCode}
                alt="QR Code"
                className="w-full h-auto max-w-xs mx-auto"
              />
            </div>

            {/* URL Info */}
            <div className="space-y-2">
              <div>
                <div className="text-retro-dim text-xs">SHORT URL:</div>
                <div className="bg-black border border-retro-dim p-2 text-retro-bright font-mono text-sm break-all">
                  {qrData.shortUrl}
                </div>
              </div>
              <div>
                <div className="text-retro-dim text-xs">ORIGINAL URL:</div>
                <div className="bg-black border border-retro-dim p-2 text-retro-text text-sm break-all">
                  {qrData.originalUrl}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-2">
              <button
                onClick={downloadQRCode}
                className="retro-button flex-1 flex items-center justify-center space-x-2 py-2"
              >
                <Download size={16} />
                <span>DOWNLOAD</span>
              </button>
              <button
                onClick={copyQRCode}
                className="retro-button flex-1 flex items-center justify-center space-x-2 py-2"
              >
                <Copy size={16} />
                <span>COPY QR</span>
              </button>
              <button
                onClick={copyUrl}
                className="retro-button flex-1 flex items-center justify-center space-x-2 py-2"
              >
                <Copy size={16} />
                <span>COPY URL</span>
              </button>
            </div>

            {/* Instructions */}
            <div className="text-retro-dim text-xs text-center border-t border-retro-dim pt-2">
              Scan with your phone's camera to open the link
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div className="text-center text-retro-dim text-xs mt-4">
          [ESC] CLOSE
        </div>
      </div>
    </div>
  );
}