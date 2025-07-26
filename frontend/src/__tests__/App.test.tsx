import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock toast notifications
jest.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

describe('App Component', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    document.documentElement.style.cssText = '';
  });

  it('renders main interface with CRT styling', () => {
    render(<App />);
    
    expect(screen.getByText('LINKS2GO-TERMINAL-v1.0')).toBeInTheDocument();
    expect(screen.getByText('[SHORTEN]')).toBeInTheDocument();
    expect(screen.getByText('[ANALYTICS]')).toBeInTheDocument();
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });

  it('shows online status by default', () => {
    render(<App />);
    
    expect(screen.getByText('ONLINE')).toBeInTheDocument();
    expect(screen.queryByText('OFFLINE')).not.toBeInTheDocument();
  });

  it('displays settings button', () => {
    render(<App />);
    
    const settingsButton = screen.getByTestId('open-settings');
    expect(settingsButton).toBeInTheDocument();
    expect(screen.getByText('SETTINGS')).toBeInTheDocument();
  });

  it('opens settings modal when settings button is clicked', async () => {
    render(<App />);
    
    const settingsButton = screen.getByTestId('open-settings');
    fireEvent.click(settingsButton);
    
    await waitFor(() => {
      expect(screen.getByText('[SYSTEM CONFIGURATION]')).toBeInTheDocument();
    });
  });

  it('switches between tabs when tab buttons are clicked', () => {
    render(<App />);
    
    const analyticsButton = screen.getByText('[ANALYTICS]');
    fireEvent.click(analyticsButton);
    
    // Analytics tab should be active (has different styling)
    expect(analyticsButton).toHaveClass('bg-theme-text');
    
    const shortenButton = screen.getByText('[SHORTEN]');
    expect(shortenButton).toHaveClass('bg-theme-bg');
  });

  it('displays keyboard shortcuts in footer', () => {
    render(<App />);
    
    expect(screen.getByText('[ESC] EXIT')).toBeInTheDocument();
    expect(screen.getByText('[TAB] SWITCH')).toBeInTheDocument();
    expect(screen.getByText('[ENTER] EXECUTE')).toBeInTheDocument();
    expect(screen.getByText('[F12] SETTINGS')).toBeInTheDocument();
  });

  it('handles F12 key to open settings', async () => {
    render(<App />);
    
    fireEvent.keyDown(document, { key: 'F12' });
    
    await waitFor(() => {
      expect(screen.getByText('[SYSTEM CONFIGURATION]')).toBeInTheDocument();
    });
  });

  it('handles Ctrl+, key to open settings', async () => {
    render(<App />);
    
    fireEvent.keyDown(document, { key: ',', ctrlKey: true });
    
    await waitFor(() => {
      expect(screen.getByText('[SYSTEM CONFIGURATION]')).toBeInTheDocument();
    });
  });

  it('handles Tab key to switch tabs', async () => {
    render(<App />);
    
    // Initially on shortener tab
    expect(screen.getByText('[SHORTEN]')).toHaveClass('bg-theme-text');
    
    fireEvent.keyDown(document, { key: 'Tab' });
    
    await waitFor(() => {
      expect(screen.getByText('[ANALYTICS]')).toHaveClass('bg-theme-text');
    });
    
    // Tab again to go back
    fireEvent.keyDown(document, { key: 'Tab' });
    
    await waitFor(() => {
      expect(screen.getByText('[SHORTEN]')).toHaveClass('bg-theme-text');
    });
  });

  it('handles Escape key to close settings', async () => {
    render(<App />);
    
    // Open settings first
    fireEvent.keyDown(document, { key: 'F12' });
    
    await waitFor(() => {
      expect(screen.getByText('[SYSTEM CONFIGURATION]')).toBeInTheDocument();
    });
    
    // Close with Escape
    fireEvent.keyDown(document, { key: 'Escape' });
    
    await waitFor(() => {
      expect(screen.queryByText('[SYSTEM CONFIGURATION]')).not.toBeInTheDocument();
    });
  });

  it('prevents default behavior for keyboard shortcuts', () => {
    render(<App />);
    
    const preventDefaultSpy = jest.fn();
    const mockEvent = {
      key: 'F12',
      preventDefault: preventDefaultSpy,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
    };
    
    fireEvent.keyDown(document, mockEvent);
    
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('does not switch tabs when Tab is pressed with modifier keys', () => {
    render(<App />);
    
    // Initially on shortener tab
    expect(screen.getByText('[SHORTEN]')).toHaveClass('bg-theme-text');
    
    // Tab with Ctrl should not switch tabs
    fireEvent.keyDown(document, { key: 'Tab', ctrlKey: true });
    expect(screen.getByText('[SHORTEN]')).toHaveClass('bg-theme-text');
    
    // Tab with Shift should not switch tabs
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(screen.getByText('[SHORTEN]')).toHaveClass('bg-theme-text');
    
    // Tab with Alt should not switch tabs
    fireEvent.keyDown(document, { key: 'Tab', altKey: true });
    expect(screen.getByText('[SHORTEN]')).toHaveClass('bg-theme-text');
  });

  it('applies theme styles from CSS variables', () => {
    render(<App />);
    
    // Check that theme variables are applied
    const rootStyle = document.documentElement.style;
    expect(rootStyle.getPropertyValue('--theme-text')).toBe('#00ff41');
    expect(rootStyle.getPropertyValue('--theme-bg')).toBe('#000000');
  });

  it('displays ASCII logo', () => {
    render(<App />);
    
    // The ASCII logo should be present (contains specific characters)
    expect(document.querySelector('pre')).toBeInTheDocument();
    expect(screen.getByText('[RETRO URL SHORTENING SYSTEM]')).toBeInTheDocument();
  });
});