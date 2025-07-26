import { render, screen, act, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';
import { crtThemes } from '../../config/themes';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Test component that uses the theme context
const TestComponent = () => {
  const { currentTheme, themes, setTheme, resetToDefault } = useTheme();
  
  return (
    <div>
      <div data-testid="current-theme-id">{currentTheme.id}</div>
      <div data-testid="current-theme-name">{currentTheme.name}</div>
      <div data-testid="themes-count">{themes.length}</div>
      <button 
        data-testid="set-amber-theme" 
        onClick={() => setTheme('amber-terminal')}
      >
        Set Amber Theme
      </button>
      <button 
        data-testid="reset-theme" 
        onClick={resetToDefault}
      >
        Reset Theme
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    document.documentElement.style.cssText = '';
  });

  it('provides default theme when no saved theme exists', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme-id')).toHaveTextContent('green-phosphor');
    expect(screen.getByTestId('current-theme-name')).toHaveTextContent('Green Phosphor');
  });

  it('loads saved theme from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('amber-terminal');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme-id')).toHaveTextContent('amber-terminal');
    expect(screen.getByTestId('current-theme-name')).toHaveTextContent('Amber Terminal');
  });

  it('provides all available themes', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('themes-count')).toHaveTextContent(crtThemes.length.toString());
  });

  it('allows theme switching and persists to localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('set-amber-theme'));
    });

    expect(screen.getByTestId('current-theme-id')).toHaveTextContent('amber-terminal');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('links2go-theme', 'amber-terminal');
  });

  it('allows resetting to default theme', () => {
    mockLocalStorage.getItem.mockReturnValue('amber-terminal');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Initially amber theme
    expect(screen.getByTestId('current-theme-id')).toHaveTextContent('amber-terminal');

    act(() => {
      fireEvent.click(screen.getByTestId('reset-theme'));
    });

    expect(screen.getByTestId('current-theme-id')).toHaveTextContent('green-phosphor');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('links2go-theme', 'green-phosphor');
  });

  it('applies CSS variables to DOM when theme changes', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Check default theme variables are applied
    const rootStyle = document.documentElement.style;
    expect(rootStyle.getPropertyValue('--theme-text')).toBe('#00ff41');
    
    act(() => {
      fireEvent.click(screen.getByTestId('set-amber-theme'));
    });

    // Check amber theme variables are applied
    expect(rootStyle.getPropertyValue('--theme-text')).toBe('#ffb000');
  });

  it('throws error when useTheme is used outside ThemeProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleSpy.mockRestore();
  });

  it('handles invalid theme ID gracefully', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      const { setTheme } = useTheme();
      setTheme('invalid-theme-id');
    });

    // Should fall back to default theme
    expect(screen.getByTestId('current-theme-id')).toHaveTextContent('green-phosphor');
  });
});