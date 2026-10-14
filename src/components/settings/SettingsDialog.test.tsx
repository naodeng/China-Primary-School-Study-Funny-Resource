import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeProvider from '../../theme/ThemeProvider';
import ThemeSwitcher from '../theme/ThemeSwitcher';
import SettingsDialog from './SettingsDialog';

describe('SettingsDialog', () => {
  beforeEach(() => window.localStorage.clear());

  it('changesThemeAndAppliesOnlyARegisteredLearningStart', async () => {
    const user = userEvent.setup();
    const onApplyLearningStart = vi.fn();
    const onNavigate = vi.fn();
    render(
      <ThemeProvider>
        <SettingsDialog
          open
          progress={{ schemaVersion: 3, completedSessionIds: [], learningStart: null }}
          onClose={vi.fn()}
          onApplyLearningStart={onApplyLearningStart}
          onNavigate={onNavigate}
        />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('radio', { name: '深色' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(window.localStorage.getItem('china-study-theme-v1')).toBe('dark');

    await user.click(screen.getByRole('radio', { name: '跟随系统' }));
    expect(window.localStorage.getItem('china-study-theme-v1')).toBe('system');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(screen.getByText(/应用后会替换当前进度记录/)).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: '年级' }), '2');
    await user.selectOptions(screen.getByRole('combobox', { name: '学期' }), '1');
    await user.selectOptions(screen.getByRole('combobox', { name: '从第几单元开始' }), '2');
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

  it('doesNotApplyAnUnregisteredLearningStart', () => {
    const onApplyLearningStart = vi.fn();
    const { container } = render(
      <ThemeProvider>
        <SettingsDialog
          open
          progress={{ schemaVersion: 3, completedSessionIds: [], learningStart: null }}
          onClose={vi.fn()}
          onApplyLearningStart={onApplyLearningStart}
          onNavigate={vi.fn()}
        />
      </ThemeProvider>,
    );
    const unitSelect = screen.getByRole('combobox', { name: '从第几单元开始' });
    fireEvent.change(unitSelect, { target: { value: '99' } });
    fireEvent.submit(container.querySelector('form')!);
    expect(onApplyLearningStart).not.toHaveBeenCalled();
  });

  it('keepsAnOlderValidStartVisibleUntilItsCourseIsRegistered', () => {
    render(
      <ThemeProvider>
        <SettingsDialog
          open
          progress={{ schemaVersion: 3, completedSessionIds: [], learningStart: { grade: 3, term: 2, unit: 1 } }}
          onClose={vi.fn()}
          onApplyLearningStart={vi.fn()}
          onNavigate={vi.fn()}
        />
      </ThemeProvider>,
    );

    expect(screen.getByRole('combobox', { name: '年级' })).toHaveValue('3');
    expect(screen.getByRole('combobox', { name: '学期' })).toHaveValue('2');
    expect(screen.getByRole('combobox', { name: '从第几单元开始' })).toHaveValue('1');
    expect(screen.getByRole('status')).toHaveTextContent(/尚未登记到课程目录/);
    expect(screen.getByRole('button', { name: '应用学习起点' })).toBeDisabled();
  });
});
