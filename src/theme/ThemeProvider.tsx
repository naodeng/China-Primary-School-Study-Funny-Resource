import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  readThemePreference,
  resolveThemePreference,
  THEME_STORAGE_KEY,
  writeThemePreference,
} from './themePreferences';
import type { ResolvedTheme, ThemePreference } from './themePreferences';

export type { ResolvedTheme, ThemePreference } from './themePreferences';

interface ThemeContextValue {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readPreference(): ThemePreference {
  return readThemePreference(() => window.localStorage.getItem(THEME_STORAGE_KEY));
}

function readSystemTheme(): ResolvedTheme {
  try {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readPreference);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(readSystemTheme);
  const resolvedTheme = resolveThemePreference(preference, systemTheme);

  useEffect(() => {
    let media: MediaQueryList;
    try {
      media = window.matchMedia('(prefers-color-scheme: dark)');
    } catch {
      return undefined;
    }
    const updateSystemTheme = (event: MediaQueryListEvent) => setSystemTheme(event.matches ? 'dark' : 'light');
    media.addEventListener('change', updateSystemTheme);
    return () => media.removeEventListener('change', updateSystemTheme);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (themeColor) themeColor.content = resolvedTheme === 'dark' ? '#1d2923' : '#fff9ec';
  }, [resolvedTheme]);

  function setPreference(nextPreference: ThemePreference) {
    setPreferenceState(nextPreference);
    writeThemePreference(nextPreference, (value) => window.localStorage.setItem(THEME_STORAGE_KEY, value));
  }

  const value = useMemo(() => ({ preference, resolvedTheme, setPreference }), [preference, resolvedTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}

export default ThemeProvider;
