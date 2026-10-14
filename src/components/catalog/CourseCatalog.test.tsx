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
  });

  it('keepsUnverifiedCourseEntriesUnavailable', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<ThemeProvider><CourseCatalog progress={progress} onNavigate={onNavigate} onApplyLearningStart={vi.fn()} /></ThemeProvider>);

    expect(screen.getAllByText('筹备中').length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: /进入单元/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '数学' }));
    expect(screen.getByText('数学', { selector: '.catalog-subject-name' })).toBeInTheDocument();
    expect(onNavigate).not.toHaveBeenCalled();
  });
});
