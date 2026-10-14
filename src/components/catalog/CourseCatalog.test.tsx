import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CourseCatalog from './CourseCatalog';
import ThemeProvider from '../../theme/ThemeProvider';

const progress = { schemaVersion: 3 as const, completedSessionIds: [], learningStart: null };

describe('CourseCatalog', () => {
  it('offersRegistryDrivenGradeAndTermControls', () => {
    render(<ThemeProvider><CourseCatalog progress={progress} onNavigate={vi.fn()} onApplyLearningStart={vi.fn()} /></ThemeProvider>);

    expect(screen.getByRole('combobox', { name: '年级' })).toHaveValue('grade-2');
    expect(screen.getByRole('combobox', { name: '学期' })).toHaveValue('term-1');
    expect(screen.getByRole('button', { name: '语文' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '数学' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '英语' })).toBeInTheDocument();
  });

  it('opensVerifiedChineseAndMathUnits', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<ThemeProvider><CourseCatalog progress={progress} onNavigate={onNavigate} onApplyLearningStart={vi.fn()} /></ThemeProvider>);

    expect(screen.getAllByRole('button', { name: /进入单元/ })).toHaveLength(8);
    expect(screen.queryByText('筹备中')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '数学' }));
    expect(screen.getByText('数学', { selector: '.catalog-subject-name' })).toBeInTheDocument();
    expect(screen.queryByText('筹备中')).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /进入单元/ })).toHaveLength(10);
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('opensAllVerifiedSecondTermMathEntries', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><CourseCatalog progress={progress} onNavigate={vi.fn()} onApplyLearningStart={vi.fn()} /></ThemeProvider>);

    await user.selectOptions(screen.getByRole('combobox', { name: '学期' }), 'term-2');
    await user.click(screen.getByRole('button', { name: '数学' }));

    expect(screen.getAllByRole('button', { name: /进入单元/ })).toHaveLength(11);
    expect(screen.getByText('第十单元 · 总复习')).toBeInTheDocument();
    expect(screen.getByText('综合实践 · 小小设计师')).toBeInTheDocument();
  });

  it('showsTheSchoolOfferingNoticeForPreparatoryEnglish', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><CourseCatalog progress={progress} onNavigate={vi.fn()} onApplyLearningStart={vi.fn()} /></ThemeProvider>);

    await user.click(screen.getByRole('button', { name: '英语' }));

    expect(screen.getByText('英语预备级是否属于学校本学期实际开设课程，请以学校安排为准。')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /进入单元/ })).toHaveLength(8);
    expect(screen.getAllByText('复习站')).toHaveLength(2);
    expect(screen.queryByText('UNIT w-1')).not.toBeInTheDocument();
  });

  it('showsSecondTermEnglishWithItsSchoolOfferingNotice', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><CourseCatalog progress={progress} onNavigate={vi.fn()} onApplyLearningStart={vi.fn()} /></ThemeProvider>);

    await user.selectOptions(screen.getByRole('combobox', { name: '学期' }), 'term-2');
    await user.click(screen.getByRole('button', { name: '英语' }));

    expect(screen.getByText('英语预备级是否属于学校本学期实际开设课程，请以学校安排为准。')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /进入单元/ })).toHaveLength(8);
    expect(screen.getAllByText('复习站')).toHaveLength(2);
    expect(screen.getByText('第一单元 · Playtime')).toBeInTheDocument();
  });
});
