export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = Exclude<ThemePreference, 'system'>;

export const THEME_STORAGE_KEY = 'china-study-theme-v1';

export function readThemePreference(readValue: () => string | null): ThemePreference {
  try {
    const value = readValue();
    return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
  } catch {
    return 'system';
  }
}

export function resolveThemePreference(preference: ThemePreference, systemTheme: ResolvedTheme): ResolvedTheme {
  return preference === 'system' ? systemTheme : preference;
}

export function writeThemePreference(preference: ThemePreference, writeValue: (value: ThemePreference) => void): void {
  try {
    writeValue(preference);
  } catch {
    // The current page still applies the selection if browser storage is unavailable.
  }
}
