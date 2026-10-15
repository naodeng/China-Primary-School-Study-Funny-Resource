import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { curriculum } from '../../content/curriculum';
import UnitOverview from './UnitOverview';

const unitKey = 'grade-2/term-1/chinese/unit-01';
const unit = curriculum.units[unitKey];

describe('UnitOverview', () => {
  it('showsThreeDifficultyTracksAndBasicTasks', async () => {
    const user = userEvent.setup();
    render(<UnitOverview unitKey={unitKey} unit={unit} completedSessionIds={[]} onNavigate={vi.fn()} />);

    expect(screen.getByText(/家长提示：本课程依据 TapXWorld 固定快照/)).not.toBeVisible();
    await user.click(screen.getByRole('button', { name: /教材来源说明/ }));
    expect(screen.getByText(/家长提示：本课程依据 TapXWorld 固定快照/)).toBeInTheDocument();
    expect(screen.getByText(/可能与人教社后续修订版存在差异/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '基础版任务' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '进阶版任务' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '高阶版任务' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: '查看任务' })).toHaveLength(7);
    expect(screen.getByRole('button', { name: /开始基础任务/ })).toBeInTheDocument();
  });

  it('keepsTheUnitLearningMapCollapsedUntilRequested', async () => {
    const user = userEvent.setup();
    render(<UnitOverview unitKey={unitKey} unit={unit} completedSessionIds={[]} onNavigate={vi.fn()} />);

    expect(screen.getByText('《小蝌蚪找妈妈》：成长顺序与观察线索')).not.toBeVisible();
    await user.click(screen.getByRole('button', { name: /查看本单元知识地图/ }));
    expect(screen.getByText('《小蝌蚪找妈妈》：成长顺序与观察线索')).toBeInTheDocument();
  });

  it('exposesCompletionCountThroughProgressbarSemantics', () => {
    const completedSessionIds = unit.difficultyTracks.basic.tasks[0]!.sessions.map((session) => session.id);
    render(<UnitOverview unitKey={unitKey} unit={unit} completedSessionIds={completedSessionIds} onNavigate={vi.fn()} />);

    expect(screen.getByRole('progressbar', { name: /已完成\d+场，共\d+场/ })).toHaveAttribute('aria-valuenow', String(completedSessionIds.length));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemin', '0');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', String(unit.difficultyTracks.basic.tasks.reduce((total, task) => total + task.sessions.length, 0)));
  });

  it('opensTaskAndStartsItsNestedSession', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    const task = unit.difficultyTracks.basic.tasks[0];

    render(<UnitOverview unitKey={unitKey} unit={unit} selectedDifficulty="basic" selectedTask={task} completedSessionIds={[]} onNavigate={onNavigate} />);

    expect(screen.getByRole('heading', { name: task.title, level: 1 })).toBeInTheDocument();
    expect(document.querySelector('.unit-hero .eyebrow')).toHaveTextContent(/2年级.*上学期.*语文.*UNIT 1.*基础版任务/);
    expect(screen.getByRole('heading', { name: '学习场次' })).toBeInTheDocument();
    const startButton = screen.getByRole('button', { name: '开始第 1 场' });
    startButton.focus();
    await user.keyboard('{Enter}');

    expect(onNavigate).toHaveBeenCalledWith(`/${unitKey}/basic/task-01/session-01`);
  });

  it('showsSessionDetailsAndKnowledgeReviewOnlyWhenOpened', async () => {
    const user = userEvent.setup();
    const task = unit.difficultyTracks.basic.tasks[0]!;
    const reviewPoints = ['先观察身体变化。', '先观察身体变化。', '按过程整理线索。', '', '用完整句说明发现。'];
    const reviewTask = {
      ...task,
      sessions: task.sessions.map((session) => ({
        ...session,
        activities: session.activities.map((activity, index) => ({
          ...activity,
          explanation: reviewPoints[index] ?? '',
        })),
      })),
    };

    render(<UnitOverview unitKey={unitKey} unit={unit} selectedDifficulty="basic" selectedTask={reviewTask} completedSessionIds={[]} onNavigate={vi.fn()} />);

    const firstSessionObjective = task.sessions[0]!.objective;
    const firstSessionCard = document.querySelector('.session-card');
    expect(firstSessionCard).not.toBeNull();
    expect(within(firstSessionCard as HTMLElement).getByText(firstSessionObjective)).not.toBeVisible();
    await user.click(within(firstSessionCard as HTMLElement).getByRole('button', { name: /本场学习目标/ }));
    expect(within(firstSessionCard as HTMLElement).getByText(firstSessionObjective)).toBeVisible();

    expect(document.querySelector('.task-review-content')).not.toBeVisible();
    await user.click(screen.getByRole('button', { name: /出发前复习知识点/ }));
    const review = screen.getByRole('region', { name: '本任务知识点回顾' });
    expect(review).toBeInTheDocument();
    expect(within(review).getAllByRole('listitem')).toHaveLength(3);
    expect(within(review).getByText('按过程整理线索。')).toBeInTheDocument();
    expect(within(review).getByText('用完整句说明发现。')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /继续学习第 1 场/ })).toBeInTheDocument();
  });
});
