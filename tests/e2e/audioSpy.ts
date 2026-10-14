import type { Page } from '@playwright/test';

const AUDIO_LOG_KEY = '__china_study_audio_events';

export interface AudioEvent {
  type: 'play' | 'pause';
  src: string;
}

export async function installAudioSpy(page: Page): Promise<void> {
  await page.addInitScript((logKey) => {
    if (localStorage.getItem(logKey) === null) localStorage.setItem(logKey, '[]');

    class AudioSpy {
      currentTime = 0;
      paused = true;
      preload = 'auto';
      src: string;

      constructor(source: string) {
        this.src = source;
      }

      play(): Promise<void> {
        const events = JSON.parse(localStorage.getItem(logKey) ?? '[]') as AudioEvent[];
        events.push({ type: 'play', src: this.src });
        localStorage.setItem(logKey, JSON.stringify(events));
        this.paused = false;
        if (localStorage.getItem('__china_study_reject_next_audio') === 'true') {
          localStorage.removeItem('__china_study_reject_next_audio');
          return Promise.reject(new Error('Audio playback blocked by test.'));
        }
        return Promise.resolve();
      }

      pause(): void {
        const events = JSON.parse(localStorage.getItem(logKey) ?? '[]') as AudioEvent[];
        events.push({ type: 'pause', src: this.src });
        localStorage.setItem(logKey, JSON.stringify(events));
        this.paused = true;
      }
    }

    Object.defineProperty(window, 'Audio', { configurable: true, writable: true, value: AudioSpy });
    Math.random = () => 0.41;
  }, AUDIO_LOG_KEY);
}

export async function readAudioEvents(page: Page): Promise<AudioEvent[]> {
  return page.evaluate((logKey) => JSON.parse(localStorage.getItem(logKey) ?? '[]') as AudioEvent[], AUDIO_LOG_KEY);
}
