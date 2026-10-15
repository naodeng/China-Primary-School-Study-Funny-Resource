export const SOUND_PREFERENCE_KEY = 'china-study-sound-enabled-v1';
export const DEFAULT_SOUND_ENABLED = true;

type SoundPreferenceReader = Pick<Storage, 'getItem'>;
type SoundPreferenceWriter = Pick<Storage, 'setItem'>;

export function readSoundPreference(storage?: SoundPreferenceReader): boolean {
  try {
    const value = (storage ?? window.localStorage).getItem(SOUND_PREFERENCE_KEY);
    if (value === 'false') return false;
    return DEFAULT_SOUND_ENABLED;
  } catch {
    return DEFAULT_SOUND_ENABLED;
  }
}

export function writeSoundPreference(enabled: boolean, storage?: SoundPreferenceWriter): void {
  try {
    (storage ?? window.localStorage).setItem(SOUND_PREFERENCE_KEY, String(enabled));
  } catch {
    // Keep the in-memory choice even when browser storage is unavailable.
  }
}
