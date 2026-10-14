import { beforeEach, describe, expect, it } from 'vitest';
import { readSoundPreference, SOUND_PREFERENCE_KEY, writeSoundPreference } from './soundPreferences';

describe('sound preferences', () => {
  beforeEach(() => localStorage.clear());

  it('defaultsSoundToEnabled', () => {
    expect(readSoundPreference()).toBe(true);
  });

  it('persistsSoundChoice', () => {
    writeSoundPreference(false);
    expect(localStorage.getItem(SOUND_PREFERENCE_KEY)).toBe('false');
    expect(readSoundPreference()).toBe(false);

    writeSoundPreference(true);
    expect(localStorage.getItem(SOUND_PREFERENCE_KEY)).toBe('true');
    expect(readSoundPreference()).toBe(true);
  });

  it('keepsSoundEnabledWhenStorageUnavailable', () => {
    const unavailableStorage = {
      getItem: () => { throw new Error('storage unavailable'); },
      setItem: () => { throw new Error('storage unavailable'); },
    };

    expect(readSoundPreference(unavailableStorage)).toBe(true);
    expect(() => writeSoundPreference(false, unavailableStorage)).not.toThrow();
    expect(readSoundPreference(unavailableStorage)).toBe(true);
  });
});
