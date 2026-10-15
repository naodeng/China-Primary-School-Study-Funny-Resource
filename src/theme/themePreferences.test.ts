import { describe, expect, it } from 'vitest';
import { readThemePreference, resolveThemePreference, writeThemePreference } from './themePreferences';

describe('theme preferences', () => {
  it('defaultsToSystemAndResolvesTheCurrentSystemTheme', () => {
    expect(readThemePreference(() => null)).toBe('system');
    expect(resolveThemePreference('system', 'dark')).toBe('dark');
  });

  it('keepsManualLightAndDarkSelections', () => {
    expect(readThemePreference(() => 'light')).toBe('light');
    expect(resolveThemePreference('light', 'dark')).toBe('light');
    expect(readThemePreference(() => 'dark')).toBe('dark');
    expect(resolveThemePreference('dark', 'light')).toBe('dark');
  });

  it('restoresSystemFollowingWhenSelected', () => {
    expect(readThemePreference(() => 'system')).toBe('system');
    expect(resolveThemePreference('system', 'light')).toBe('light');
  });

  it('fallsBackToSystemWhenStorageIsUnavailableOrInvalid', () => {
    expect(readThemePreference(() => { throw new Error('storage blocked'); })).toBe('system');
    expect(readThemePreference(() => 'sepia')).toBe('system');
    expect(() => writeThemePreference('dark', () => { throw new Error('storage blocked'); })).not.toThrow();
  });
});
