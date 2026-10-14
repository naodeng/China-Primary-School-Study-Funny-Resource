import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const playedSources: string[] = [];

class AppTestAudio {
  currentTime = 0;
  paused = true;
  preload = 'auto';
  play = vi.fn(() => {
    playedSources.push(this.src);
    this.paused = false;
    return Promise.resolve();
  });
  pause = vi.fn(() => { this.paused = true; });

  constructor(public src: string) {}
}

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
    playedSources.length = 0;
    vi.stubGlobal('Audio', AppTestAudio);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('renders catalog and opens settings', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('heading', { name: '星岛学园 · Starry Island' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '设置' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '显示主题' })).toBeInTheDocument();
  });

  it('persistsTheSoundSwitchAndKeepsItselfSilentWhenSoundIsDisabled', async () => {
    const user = userEvent.setup();
    const view = render(<App />);
    await user.click(screen.getByRole('button', { name: '设置' }));
    expect(playedSources).toEqual(['/audio/interaction-click.mp3']);

    const soundSwitch = screen.getByRole('switch', { name: '语音提示与交互音效' });
    expect(soundSwitch).toBeChecked();
    await user.click(soundSwitch);
    expect(soundSwitch).not.toBeChecked();
    expect(window.localStorage.getItem('china-study-sound-enabled-v1')).toBe('false');
    expect(playedSources).toHaveLength(1);

    view.unmount();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '设置' }));
    expect(screen.getByRole('switch', { name: '语音提示与交互音效' })).not.toBeChecked();
    expect(playedSources).toHaveLength(1);
  });

  it('playsInteractionCueWhenANumberAnswerInputIsClicked', async () => {
    const user = userEvent.setup();
    window.history.replaceState({}, '', '/grade-2/term-1/math/unit-02/basic/task-01/session-01');
    render(<App />);

    await user.click(screen.getByRole('spinbutton', { name: '输入计算结果' }));

    expect(playedSources).toEqual(['/audio/interaction-click.mp3']);
  });

  it('updatesTheCurrentPageWhenBrowserHistoryChanges', () => {
    render(<App />);

    act(() => {
      window.history.pushState({}, '', '/grade-2/term-1/chinese/unit-01');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(screen.getByRole('heading', { name: '第一单元 · 大自然的秘密' })).toBeInTheDocument();
    expect(screen.getByText(/本课程依据 TapXWorld 固定快照/)).toBeInTheDocument();
  });
});
