import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'homebite-theme';

export function ThemeProvider({ children }) {
  const [themePreference, setThemePreference] = useState(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const savedTheme = window.localStorage.getItem(STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
      return savedTheme;
    }
    return 'system';
  });
  const [systemTheme, setSystemTheme] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const theme = themePreference === 'system' ? systemTheme : themePreference;

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = (event) => setSystemTheme(event.matches ? 'dark' : 'light');
    setSystemTheme(media.matches ? 'dark' : 'light');
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, themePreference);
  }, [theme, themePreference]);

  const value = useMemo(
    () => ({
      theme,
      themePreference,
      isDark: theme === 'dark',
      setTheme: setThemePreference,
      toggleTheme: () => setThemePreference(theme === 'dark' ? 'light' : 'dark')
    }),
    [theme, themePreference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
