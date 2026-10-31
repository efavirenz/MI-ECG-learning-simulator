import { createContext, useContext, ReactNode } from 'react';
import { ThemeOption, getTheme } from '../data/themes';

interface ThemeContextValue {
  theme: ThemeOption;
  themeId: string;
  isBright: boolean;
  setThemeId: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  themeId,
  onSelectTheme,
  children
}: {
  themeId: string;
  onSelectTheme: (id: string) => void;
  children: ReactNode;
}) {
  const theme = getTheme(themeId);
  const isBright = theme.mode === 'bright';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeId,
        isBright,
        setThemeId: onSelectTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback if rendered outside provider
    const fallbackTheme = getTheme('dark-navy');
    return {
      theme: fallbackTheme,
      themeId: 'dark-navy',
      isBright: false,
      setThemeId: () => {}
    };
  }
  return context;
}
