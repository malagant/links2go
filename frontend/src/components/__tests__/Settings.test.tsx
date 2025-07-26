import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '../../contexts/ThemeContext';
import Settings from '../Settings';
import { crtThemes } from '../../config/themes';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

const renderSettings = (isOpen = true) => {
  const onClose = jest.fn();
  
  const result = render(
    <ThemeProvider>
      <Settings isOpen={isOpen} onClose={onClose} />
    </ThemeProvider>
  );
  
  return { ...result, onClose };
};

describe('Settings Component', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    document.documentElement.style.cssText = '';
  });

  it('renders nothing when closed', () => {
    const { container } = renderSettings(false);
    expect(container.firstChild).toBeNull();
  });

  it('renders settings modal when open', () => {
    renderSettings();
    
    expect(screen.getByText('[SYSTEM CONFIGURATION]')).toBeInTheDocument();
    expect(screen.getByText('CRT DISPLAY THEMES')).toBeInTheDocument();
    expect(screen.getByText('CURRENT THEME INFO')).toBeInTheDocument();
  });

  it('displays all available themes', () => {
    renderSettings();
    
    crtThemes.forEach(theme => {
      expect(screen.getByText(theme.name)).toBeInTheDocument();
      expect(screen.getByText(theme.description)).toBeInTheDocument();
    });
  });

  it('shows current theme as selected', () => {
    mockLocalStorage.getItem.mockReturnValue('amber-terminal');
    renderSettings();
    
    const amberThemeCard = screen.getByTestId('theme-amber-terminal');
    expect(amberThemeCard).toHaveClass('border-theme-text');
  });

  it('allows theme selection', async () => {
    renderSettings();
    
    const blueThemeCard = screen.getByTestId('theme-blue-screen');
    fireEvent.click(blueThemeCard);
    
    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('links2go-theme', 'blue-screen');
    });
  });

  it('displays current theme information', () => {
    mockLocalStorage.getItem.mockReturnValue('cyan-matrix');
    renderSettings();
    
    expect(screen.getByText('Cyan Matrix')).toBeInTheDocument();
    expect(screen.getByText('Cyberpunk-inspired cyan matrix display')).toBeInTheDocument();
    expect(screen.getByText('#00ffff')).toBeInTheDocument();
  });

  it('closes when close button is clicked', () => {
    const { onClose } = renderSettings();
    
    const closeButton = screen.getByTestId('close-settings');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('closes when backdrop is clicked', () => {
    const { onClose } = renderSettings();
    
    const backdrop = screen.getByTestId('settings-backdrop');
    fireEvent.click(backdrop);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('resets to default theme when reset button is clicked', async () => {
    mockLocalStorage.getItem.mockReturnValue('amber-terminal');
    renderSettings();
    
    const resetButton = screen.getByTestId('reset-theme');
    fireEvent.click(resetButton);
    
    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('links2go-theme', 'green-phosphor');
    });
  });

  it('shows theme preview with correct colors', () => {
    renderSettings();
    
    crtThemes.forEach(theme => {
      const themeCard = screen.getByTestId(`theme-${theme.id}`);
      const preview = themeCard.querySelector('div[style*="backgroundColor"]');
      expect(preview).toHaveStyle(`background-color: ${theme.colors.screenBg}`);
    });
  });

  it('updates scanline opacity display correctly', () => {
    mockLocalStorage.getItem.mockReturnValue('amber-terminal');
    renderSettings();
    
    const amberTheme = crtThemes.find(t => t.id === 'amber-terminal');
    const expectedOpacity = Math.round(amberTheme!.effects.scanlineOpacity * 100);
    expect(screen.getByText(`${expectedOpacity}%`)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    renderSettings();
    
    const closeButton = screen.getByTestId('close-settings');
    expect(closeButton).toHaveAttribute('aria-label', 'Close settings');
    
    const resetButton = screen.getByTestId('reset-theme');
    expect(resetButton).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    const { onClose } = renderSettings();
    
    // Test ESC key
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});