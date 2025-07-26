import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Search, BarChart3, Clock, Globe, Monitor, Smartphone } from 'lucide-react';
import { urlService } from '../services/api';
import type { AnalyticsResponse, ClickEvent } from '../types';

export default function Analytics() {
  const [shortCode, setShortCode] = useState('');
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shortCode.trim()) {
      toast.error('Please enter a short code');
      return;
    }

    setIsLoading(true);

    try {
      const result = await urlService.getAnalytics(shortCode.trim());
      setAnalytics(result);
      toast.success('Analytics loaded successfully!');
    } catch (error: any) {
      console.error('Error loading analytics:', error);
      toast.error(error.error || 'Failed to load analytics');
      setAnalytics(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getDeviceType = (userAgent?: string): string => {
    if (!userAgent) return 'Unknown';
    
    const ua = userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
      return 'Mobile';
    }
    if (/tablet|ipad/i.test(ua)) {
      return 'Tablet';
    }
    return 'Desktop';
  };

  const getBrowser = (userAgent?: string): string => {
    if (!userAgent) return 'Unknown';
    
    const ua = userAgent.toLowerCase();
    if (ua.includes('chrome')) return 'Chrome';
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
    if (ua.includes('edge')) return 'Edge';
    if (ua.includes('opera')) return 'Opera';
    return 'Other';
  };

  const getClicksByHour = (clicks: ClickEvent[]) => {
    const hourCounts: { [hour: string]: number } = {};
    
    clicks.forEach(click => {
      const hour = new Date(click.timestamp).getHours().toString().padStart(2, '0');
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    return Object.entries(hourCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([hour, count]) => ({ hour: `${hour}:00`, count }));
  };

  const getDeviceStats = (clicks: ClickEvent[]) => {
    const deviceCounts: { [device: string]: number } = {};
    
    clicks.forEach(click => {
      const device = getDeviceType(click.userAgent);
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });

    return Object.entries(deviceCounts).map(([device, count]) => ({ device, count }));
  };

  return (
    <div className="space-y-6">
      {/* Terminal-style header */}
      <div className="terminal-text text-sm">
        <span className="text-retro-dim">$</span> links2go --analytics --query
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-retro-text text-sm mb-2">
            [CODE] Enter short code to analyze:
          </label>
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              placeholder="abc123"
              className="retro-input flex-1"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="retro-button px-6 flex items-center space-x-2"
            >
              <Search size={16} />
              <span>{isLoading ? 'LOADING...' : 'ANALYZE'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Analytics results */}
      {analytics && (
        <div className="space-y-6">
          {/* Overview */}
          <div className="space-y-4">
            <div className="terminal-text text-sm border-t border-retro-dim pt-4">
              <span className="text-retro-dim">$</span> links2go --show --overview
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-retro-bg border border-retro-dim p-4">
                <div className="text-retro-dim text-xs mb-1">TOTAL CLICKS</div>
                <div className="text-retro-bright text-2xl font-mono">
                  {analytics.clickCount.toLocaleString()}
                </div>
              </div>
              
              <div className="bg-retro-bg border border-retro-dim p-4">
                <div className="text-retro-dim text-xs mb-1">CREATED</div>
                <div className="text-retro-text text-sm">
                  {formatDate(analytics.createdAt)}
                </div>
              </div>
              
              <div className="bg-retro-bg border border-retro-dim p-4">
                <div className="text-retro-dim text-xs mb-1">STATUS</div>
                <div className="text-retro-text text-sm">
                  {analytics.expiresAt ? (
                    new Date(analytics.expiresAt) > new Date() ? (
                      <span className="text-green-500">ACTIVE</span>
                    ) : (
                      <span className="text-red-500">EXPIRED</span>
                    )
                  ) : (
                    <span className="text-retro-bright">PERMANENT</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* URL Info */}
          <div className="space-y-2">
            <div className="terminal-text text-sm">
              <span className="text-retro-dim">$</span> links2go --show --url-info
            </div>
            <div className="bg-retro-bg border border-retro-dim p-4">
              <div className="space-y-3">
                <div>
                  <div className="text-retro-dim text-xs mb-1">SHORT CODE:</div>
                  <div className="text-retro-bright font-mono">{analytics.shortCode}</div>
                </div>
                <div>
                  <div className="text-retro-dim text-xs mb-1">ORIGINAL URL:</div>
                  <div className="text-retro-text text-sm break-all">{analytics.originalUrl}</div>
                </div>
                {analytics.expiresAt && (
                  <div>
                    <div className="text-retro-dim text-xs mb-1">EXPIRES:</div>
                    <div className="text-orange-500 text-sm">{formatDate(analytics.expiresAt)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Clicks */}
          {analytics.recentClicks.length > 0 && (
            <div className="space-y-4">
              <div className="terminal-text text-sm">
                <span className="text-retro-dim">$</span> links2go --show --recent-clicks
              </div>

              {/* Device Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-retro-bg border border-retro-dim p-4">
                  <div className="text-retro-text text-sm mb-3 flex items-center space-x-2">
                    <Monitor size={16} />
                    <span>DEVICE BREAKDOWN</span>
                  </div>
                  <div className="space-y-2">
                    {getDeviceStats(analytics.recentClicks).map(({ device, count }) => (
                      <div key={device} className="flex justify-between items-center">
                        <span className="text-retro-dim text-sm">{device}</span>
                        <span className="text-retro-text font-mono">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-retro-bg border border-retro-dim p-4">
                  <div className="text-retro-text text-sm mb-3 flex items-center space-x-2">
                    <Clock size={16} />
                    <span>CLICKS BY HOUR</span>
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {getClicksByHour(analytics.recentClicks).map(({ hour, count }) => (
                      <div key={hour} className="flex justify-between items-center text-xs">
                        <span className="text-retro-dim">{hour}</span>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="bg-retro-text h-1" 
                            style={{ width: `${(count / Math.max(...getClicksByHour(analytics.recentClicks).map(c => c.count))) * 40}px` }}
                          />
                          <span className="text-retro-text font-mono w-6 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent clicks table */}
              <div className="bg-retro-bg border border-retro-dim">
                <div className="text-retro-text text-sm p-4 border-b border-retro-dim flex items-center space-x-2">
                  <BarChart3 size={16} />
                  <span>RECENT ACTIVITY</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-black">
                      <tr className="text-retro-dim">
                        <th className="text-left p-2 border-b border-retro-dim">TIME</th>
                        <th className="text-left p-2 border-b border-retro-dim">DEVICE</th>
                        <th className="text-left p-2 border-b border-retro-dim">BROWSER</th>
                        <th className="text-left p-2 border-b border-retro-dim">REFERER</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recentClicks.slice(0, 50).map((click, index) => (
                        <tr key={index} className="border-b border-retro-dim hover:bg-black">
                          <td className="p-2 text-retro-text font-mono">
                            {new Date(click.timestamp).toLocaleString()}
                          </td>
                          <td className="p-2 text-retro-text">
                            {getDeviceType(click.userAgent)}
                          </td>
                          <td className="p-2 text-retro-text">
                            {getBrowser(click.userAgent)}
                          </td>
                          <td className="p-2 text-retro-dim max-w-32 truncate">
                            {click.referer || 'Direct'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {analytics.recentClicks.length === 0 && (
            <div className="text-center py-8 text-retro-dim">
              <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
              <div>No clicks recorded yet</div>
              <div className="text-xs mt-1">Share your shortened URL to see analytics data</div>
            </div>
          )}
        </div>
      )}

      {/* Help text */}
      {!analytics && (
        <div className="text-retro-dim text-sm space-y-2">
          <div className="terminal-text">
            <span className="text-retro-dim">$</span> links2go --help --analytics
          </div>
          <div className="pl-4 space-y-1 text-xs">
            <div>• Enter the short code (e.g., "abc123") to view detailed analytics</div>
            <div>• Analytics include click counts, timestamps, device types, and referrers</div>
            <div>• Recent activity shows the last 50 clicks on your shortened URL</div>
          </div>
        </div>
      )}
    </div>
  );
}