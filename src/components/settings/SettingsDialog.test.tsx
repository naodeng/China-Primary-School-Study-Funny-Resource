import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeProvider from '../../theme/ThemeProvider';
import ThemeSwitcher from '../theme/ThemeSwitcher';
import { SoundProvider } from '../../sound/SoundProvider';
import SettingsDialog from './SettingsDialog';

describe('SettingsDialog', () => {
  beforeEach(() => window.localStorage.clear());

  it('changesThemeAndAppliesOnlyARegisteredLearningStart', async () => {
    const user = userEvent.setup();
    const onApplyLearningStart = vi.fn();
    const onNavigate = vi.fn();
    render(
      <SoundProvider>
        <ThemeProvider>
          <SettingsDialog
            open
            progress={{ schemaVersion: 3, completedSessionIds: [], learningStart: null }}
            onClose={vi.fn()}
            onApplyLearningStart={onApplyLearningStart}
            onNavigate={onNavigate}
          />
        </ThemeProvider>
      </SoundProvider>,
    );

    const soundSwitch = screen.getByRole('switch', { name: '语音提示与交互音效' });
    expect(soundSwitch).toBeChecked();
    await user.click(soundSwitch);
    expect(soundSwitch).not.toBeChecked();
    expect(window.localStorage.getItem('china-study-sound-enabled-v1')).toBe('false');
    await user.click(soundSwitch);
    expect(soundSwitch).toBeChecked();
    expect(window.localStorage.getItem('china-study-sound-enabled-v1')).toBe('true');

    await user.click(screen.getByRole('radio', { name: '深色' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(window.localStorage.getItem('china-study-theme-v1')).toBe('dark');

    await user.click(screen.getByRole('radio', { name: '跟随系统' }));
    expect(window.localStorage.getItem('china-study-theme-v1')).toBe('system');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(screen.getByText(/应用后会替换当前进度记录/)).toBeInTheDocument();

    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getByRole('contentinfo', { name: '版权与许可' })).toHaveTextContent('© 2026 naodeng All Rights Reserved.');
    expect(dialog.getByRole('link', { name: 'naodeng 的个人网站' })).toHaveAttribute('href', 'https://inaodeng.com');
    expect(dialog.getByRole('link', { name: 'PolyForm Noncommercial License 1.0.0' })).toHaveAttribute('href', 'https://polyformproject.org/licenses/noncommercial/1.0.0/');
    await user.click(dialog.getByRole('combobox', { name: '年级' }));
    await user.click(await dialog.findByRole('option', { name: '2 年级' }));
    await user.click(dialog.getByRole('combobox', { name: '学期' }));
    await user.click(await dialog.findByRole('option', { name: '上学期' }));
    await user.click(dialog.getByRole('combobox', { name: '从第几单元开始' }));
    await user.click(await dialog.findByRole('option', { name: '第 2 单元' }));
    await user.click(screen.getByRole('button', { name: '应用学习起点' }));
    expect(onApplyLearningStart).toHaveBeenCalledWith({ grade: 2, term: 1, unit: 2 });

    await user.click(screen.getByRole('button', { name: /查看成就详情/ }));
    expect(onNavigate).toHaveBeenCalledWith('/achievements');
  });

  it('updatesTheResolvedThemeWhenTheSystemPreferenceChanges', () => {
    let onSystemThemeChange: ((event: MediaQueryListEvent) => void) | undefined;
    vi.spyOn(window, 'matchMedia').mockImplementation(() => ({
      matches: false,
      addEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => {
        onSystemThemeChange = listener as (event: MediaQueryListEvent) => void;
      },
      removeEventListener: vi.fn(),
    }) as unknown as MediaQueryList);

    render(<ThemeProvider><ThemeSwitcher /></ThemeProvider>);
    expect(document.documentElement.dataset.theme).toBe('light');
    act(() => onSystemThemeChange?.({ matches: true } as MediaQueryListEvent));
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('fallsBackToLightWhenSystemThemeDetectionThrows', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(() => { throw new Error('media query unavailable'); });
    expect(() => render(<ThemeProvider><ThemeSwitcher /></ThemeProvider>)).not.toThrow();
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('doesNotApplyAnUnregisteredLearningStart', async () => {
    const onApplyLearningStart = vi.fn();
    const user = userEvent.setup();
    render(
      <SoundProvider>
        <ThemeProvider>
          <SettingsDialog
            open
            progress={{ schemaVersion: 3, completedSessionIds: [], learningStart: { grade: 4, term: 2, unit: 1 } }}
            onClose={vi.fn()}
            onApplyLearningStart={onApplyLearningStart}
            onNavigate={vi.fn()}
          />
        </ThemeProvider>
      </SoundProvider>,
    );
    expect(screen.getByRole('button', { name: '应用学习起点' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: '应用学习起点' }));
    expect(onApplyLearningStart).not.toHaveBeenCalled();
  });

  it('keepsAnUnregisteredSavedStartVisibleUntilItsCourseIsRegistered', () => {
    render(
      <SoundProvider>
        <ThemeProvider>
          <SettingsDialog
            open
            progress={{ schemaVersion: 3, completedSessionIds: [], learningStart: { grade: 4, term: 2, unit: 1 } }}
            onClose={vi.fn()}
            onApplyLearningStart={vi.fn()}
            onNavigate={vi.fn()}
          />
        </ThemeProvider>
      </SoundProvider>,
    );

    expect(screen.getByRole('combobox', { name: '年级' })).toHaveTextContent('4 年级');
    expect(screen.getByRole('combobox', { name: '学期' })).toHaveTextContent('下学期');
    expect(screen.getByRole('combobox', { name: '从第几单元开始' })).toHaveTextContent('第 1 单元');
    expect(screen.getByText(/尚未登记到课程目录/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '应用学习起点' })).toBeDisabled();
  });
});
