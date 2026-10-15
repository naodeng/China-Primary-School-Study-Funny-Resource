import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor, within } from '@testing-library/react';
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

    expect(await screen.findByRole('heading', { name: '星岛学园 · Starry Island' })).toBeInTheDocument();
    await waitFor(() => expect(document.title).toBe('星岛学园 | Starry Island'));
    expect(screen.getByRole('contentinfo', { name: '版权与许可' })).toHaveTextContent('© 2026 naodeng All Rights Reserved.');
    expect(screen.getByRole('link', { name: 'naodeng 的个人网站' })).toHaveAttribute('href', 'https://inaodeng.com');
    await user.click(await screen.findByRole('button', { name: '设置' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '显示主题' })).toBeInTheDocument();
  });

  it('appliesTheChosenLearningStartToTheVisibleCourseCatalog', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole('button', { name: '设置' }));
    const dialog = within(screen.getByRole('dialog'));
    await user.click(dialog.getByRole('combobox', { name: '学期' }));
    await user.click(await dialog.findByRole('option', { name: '下学期' }));
    await user.click(screen.getByRole('button', { name: '应用学习起点' }));
    await user.click(screen.getByRole('button', { name: '关闭设置' }));

    expect(screen.getByRole('combobox', { name: '学期' })).toHaveTextContent('下学期');
    expect(window.localStorage.getItem('china-study-progress-v1')).toContain('"term":2');
  });

  it('returnsFromASessionThroughHistoryAndMovesFocusToEachRouteHeading', async () => {
    const user = userEvent.setup();
    render(<App />);
    const pushState = vi.spyOn(window.history, 'pushState');
    const historyBack = vi.spyOn(window.history, 'back').mockImplementation(() => {});

    await user.click((await screen.findAllByRole('button', { name: /进入单元/ }))[0]);
    await screen.findAllByRole('button', { name: /查看任务/ });
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toHaveFocus());
    expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();
    expect(document.title).toBe(`${screen.getByRole('heading', { level: 1 }).textContent} | 星岛学园`);

    await user.click(screen.getAllByRole('button', { name: /查看任务/ })[0]);
    await screen.findByRole('button', { name: /开始第 1 场/ });
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toHaveFocus());
    expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: /开始第 1 场/ }));
    await screen.findByRole('button', { name: /提交答案|检查配对|检查顺序|检查分类|检查测量/ });
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toHaveFocus());
    expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();

    const navigationPushCount = pushState.mock.calls.length;
    await user.click(screen.getByRole('button', { name: /返回单元/ }));

    expect(historyBack).toHaveBeenCalledOnce();
    expect(pushState).toHaveBeenCalledTimes(navigationPushCount);
  });

  it('persistsTheSoundSwitchAndKeepsItselfSilentWhenSoundIsDisabled', async () => {
    const user = userEvent.setup();
    const view = render(<App />);
    await user.click(await screen.findByRole('button', { name: '设置' }));
    expect(playedSources).toEqual(['/audio/interaction-click.mp3']);

    const soundSwitch = screen.getByRole('switch', { name: '语音提示与交互音效' });
    expect(soundSwitch).toBeChecked();
    await user.click(soundSwitch);
    expect(soundSwitch).not.toBeChecked();
    expect(window.localStorage.getItem('china-study-sound-enabled-v1')).toBe('false');
    expect(playedSources).toHaveLength(1);

    view.unmount();
    render(<App />);
    await user.click(await screen.findByRole('button', { name: '设置' }));
    expect(screen.getByRole('switch', { name: '语音提示与交互音效' })).not.toBeChecked();
    expect(playedSources).toHaveLength(1);
  });

  it('playsInteractionCueWhenANumberAnswerInputIsClicked', async () => {
    const user = userEvent.setup();
    window.history.replaceState({}, '', '/grade-2/term-1/math/unit-02/basic/task-01/session-01');
    render(<App />);

    await user.click(await screen.findByRole('spinbutton', { name: '输入计算结果' }));

    expect(playedSources).toEqual(['/audio/interaction-click.mp3']);
  });

  it('updatesTheCurrentPageWhenBrowserHistoryChanges', async () => {
    render(<App />);

    act(() => {
      window.history.pushState({}, '', '/grade-2/term-1/chinese/unit-01');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(await screen.findByRole('heading', { name: '第一单元 · 大自然的秘密' })).toHaveFocus();
    expect(screen.getByText(/本课程依据 TapXWorld 固定快照/)).toBeInTheDocument();
  });
});
