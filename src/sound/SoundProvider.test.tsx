import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SoundProvider, useSound } from './SoundProvider';
import { SOUND_PREFERENCE_KEY } from './soundPreferences';

const audioInstances: TestAudio[] = [];
let rejectNextPlayback = false;

class TestAudio {
  currentTime = 0;
  paused = true;
  preload = 'auto';
  play = vi.fn(() => {
    this.paused = false;
    if (rejectNextPlayback) {
      rejectNextPlayback = false;
      return Promise.reject(new Error('playback rejected'));
    }
    return Promise.resolve();
  });
  pause = vi.fn(() => { this.paused = true; });

  constructor(public src: string) {
    audioInstances.push(this);
  }
}

function SoundProbe() {
  const { enabled, setEnabled, playCue } = useSound();
  return (
    <div>
      <output>{enabled ? '语音已开启' : '语音已关闭'}</output>
      <button onClick={() => playCue('answer-correct')}>播放答题提示</button>
      <button onClick={() => playCue('interaction-click')}>播放点击提示</button>
      <button onClick={() => setEnabled(false)}>关闭语音</button>
    </div>
  );
}

describe('SoundProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    audioInstances.length = 0;
    rejectNextPlayback = false;
    vi.stubGlobal('Audio', TestAudio);
  });

  it('startsEnabledWithoutAutoplayAndPlaysLocalCuesOnSeparateChannels', async () => {
    const user = userEvent.setup();
    render(<SoundProvider><SoundProbe /></SoundProvider>);

    expect(screen.getByText('语音已开启')).toBeInTheDocument();
    expect(audioInstances).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: '播放答题提示' }));
    await user.click(screen.getByRole('button', { name: '播放点击提示' }));

    expect(audioInstances).toHaveLength(2);
    expect(audioInstances[0].src).toBe('/audio/answer-correct.mp3');
    expect(audioInstances[1].src).toBe('/audio/interaction-click.mp3');
    expect(audioInstances[0].play).toHaveBeenCalledOnce();
    expect(audioInstances[1].play).toHaveBeenCalledOnce();
    expect(audioInstances[0].pause).not.toHaveBeenCalled();
  });

  it('stopsCurrentAudioAndBlocksPlaybackAfterDisablingSound', async () => {
    const user = userEvent.setup();
    render(<SoundProvider><SoundProbe /></SoundProvider>);

    await user.click(screen.getByRole('button', { name: '播放答题提示' }));
    const audio = audioInstances[0];
    await user.click(screen.getByRole('button', { name: '关闭语音' }));
    expect(screen.getByText('语音已关闭')).toBeInTheDocument();
    expect(localStorage.getItem(SOUND_PREFERENCE_KEY)).toBe('false');
    expect(audio.pause).toHaveBeenCalledOnce();
    expect(audio.currentTime).toBe(0);

    await user.click(screen.getByRole('button', { name: '播放答题提示' }));
    expect(audioInstances).toHaveLength(1);
    expect(audio.play).toHaveBeenCalledOnce();
  });

  it('keepsTheInterfaceUsableWhenBrowserPlaybackRejects', async () => {
    const user = userEvent.setup();
    render(<SoundProvider><SoundProbe /></SoundProvider>);
    rejectNextPlayback = true;

    await user.click(screen.getByRole('button', { name: '播放答题提示' }));
    await waitFor(() => expect(audioInstances[0].play).toHaveBeenCalledOnce());
    expect(screen.getByText('语音已开启')).toBeInTheDocument();
  });
});
