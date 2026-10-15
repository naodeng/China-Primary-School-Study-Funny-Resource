import { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { SOUND_CUE_ASSETS } from './soundCues';
import type { SoundCue } from './soundCues';
import { readSoundPreference, writeSoundPreference } from './soundPreferences';

interface SoundContextValue {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  playCue: (cue: SoundCue) => void;
}

interface SoundProviderProps {
  children: ReactNode;
}

type SoundChannel = 'voice' | 'interaction';
type AudioChannels = Record<SoundChannel, HTMLAudioElement | null>;

const INTERACTION_CUE_VOLUME = 0.3;

const SoundContext = createContext<SoundContextValue | null>(null);

function stopAudio(audio: HTMLAudioElement | null): void {
  if (!audio) return;
  try {
    audio.pause();
    audio.currentTime = 0;
  } catch {
    // Audio support is optional and must never block learning.
  }
}

export function SoundProvider({ children }: SoundProviderProps) {
  const [enabled, setEnabledState] = useState(readSoundPreference);
  const channels = useRef<AudioChannels>({ voice: null, interaction: null });

  const stopAll = useCallback(() => {
    stopAudio(channels.current.voice);
    stopAudio(channels.current.interaction);
  }, []);

  const setEnabled = useCallback((nextEnabled: boolean) => {
    setEnabledState(nextEnabled);
    writeSoundPreference(nextEnabled);
    if (!nextEnabled) stopAll();
  }, [stopAll]);

  const playCue = useCallback((cue: SoundCue) => {
    if (!enabled) return;
    const channel: SoundChannel = cue === 'interaction-click' ? 'interaction' : 'voice';
    try {
      let audio = channels.current[channel];
      if (!audio) {
        audio = new Audio(SOUND_CUE_ASSETS[cue]);
        audio.preload = 'auto';
        channels.current[channel] = audio;
      } else {
        audio.pause();
        audio.src = SOUND_CUE_ASSETS[cue];
      }
      audio.volume = channel === 'interaction' ? INTERACTION_CUE_VOLUME : 1;
      audio.currentTime = 0;
      void audio.play().catch(() => undefined);
    } catch {
      // Browser playback can be unavailable or denied without affecting answers.
    }
  }, [enabled]);

  return (
    <SoundContext.Provider value={{ enabled, setEnabled, playCue }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound(): SoundContextValue {
  const sound = useContext(SoundContext);
  if (!sound) throw new Error('useSound must be used within SoundProvider.');
  return sound;
}
