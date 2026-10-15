import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CourseCatalog from './CourseCatalog';
import ThemeProvider from '../../theme/ThemeProvider';
import { SoundProvider } from '../../sound/SoundProvider';

const progress = { schemaVersion: 3 as const, completedSessionIds: [], learningStart: null };

function renderCatalog(onNavigate = vi.fn()) {
  return render(
    <SoundProvider>
      <ThemeProvider>
        <CourseCatalog progress={progress} onNavigate={onNavigate} onApplyLearningStart={vi.fn()} />
      </ThemeProvider>
    </SoundProvider>,
  );
}

describe('CourseCatalog', () => {
  it('highlightsTheCurrentCourseAndLetsLearnersJumpToCourseSelection', async () => {
    const user = userEvent.setup();
    renderCatalog();

    const route = screen.getByText('当前探索航线').parentElement?.parentElement;
    expect(route).toHaveTextContent('二年级');
    expect(route).toHaveTextContent('上学期');
    expect(route).toHaveTextContent('语文');
    expect(route).toHaveTextContent('人教版');

    const selection = screen.getByRole('group', { name: '选择学习年级和学期' });
    await user.click(screen.getByRole('button', { name: /调整课程选择/ }));
    expect(selection).toHaveFocus();

    await user.click(screen.getByRole('button', { name: '英语' }));
    expect(route).toHaveTextContent('英语');
  });

  it('offersRegistryDrivenGradeAndTermControls', () => {
    renderCatalog();

    expect(screen.getByRole('combobox', { name: '年级' })).toHaveTextContent('二年级');
    expect(screen.getByRole('combobox', { name: '学期' })).toHaveTextContent('上学期');
    expect(screen.getByRole('button', { name: '语文' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '数学' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '英语' })).toBeInTheDocument();
  });

  it('opensVerifiedChineseAndMathUnits', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    renderCatalog(onNavigate);

    expect(screen.getAllByRole('button', { name: /进入单元/ })).toHaveLength(8);
    expect(screen.queryByText('筹备中')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '数学' }));
    expect(screen.getByText('数学', { selector: '.catalog-route-subject' })).toBeInTheDocument();
    expect(screen.queryByText('筹备中')).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /进入单元/ })).toHaveLength(10);
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('opensAllVerifiedSecondTermMathEntries', async () => {
    const user = userEvent.setup();
    renderCatalog();

    await user.click(screen.getByRole('combobox', { name: '学期' }));
    await user.click(await screen.findByRole('option', { name: '下学期' }));
    await user.click(screen.getByRole('button', { name: '数学' }));

    expect(screen.getAllByRole('button', { name: /进入单元/ })).toHaveLength(11);
    expect(screen.getByText('第十单元 · 总复习')).toBeInTheDocument();
    expect(screen.getByText('综合实践 · 小小设计师')).toBeInTheDocument();
  });

  it('showsTheSchoolOfferingNoticeForPreparatoryEnglish', async () => {
    const user = userEvent.setup();
    renderCatalog();

    await user.click(screen.getByRole('button', { name: '英语' }));

    expect(screen.getByText('英语预备级是否属于学校本学期实际开设课程，请以学校安排为准。')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /进入单元/ })).toHaveLength(8);
    expect(screen.getAllByText('复习站')).toHaveLength(2);
    expect(screen.queryByText('UNIT w-1')).not.toBeInTheDocument();
  });

  it('showsSecondTermEnglishWithItsSchoolOfferingNotice', async () => {
    const user = userEvent.setup();
    renderCatalog();

    await user.click(screen.getByRole('combobox', { name: '学期' }));
    await user.click(await screen.findByRole('option', { name: '下学期' }));
    await user.click(screen.getByRole('button', { name: '英语' }));

    expect(screen.getByText('英语预备级是否属于学校本学期实际开设课程，请以学校安排为准。')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /进入单元/ })).toHaveLength(8);
    expect(screen.getAllByText('复习站')).toHaveLength(2);
    expect(screen.getByText('第一单元 · Playtime')).toBeInTheDocument();
  });
});
