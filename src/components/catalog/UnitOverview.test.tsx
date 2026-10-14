import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { curriculum } from '../../content/curriculum';
import UnitOverview from './UnitOverview';

const unitKey = 'grade-2/term-1/chinese/unit-01';
const unit = curriculum.units[unitKey];

describe('UnitOverview', () => {
  it('showsThreeDifficultyTracksAndBasicTasks', () => {
    render(<UnitOverview unitKey={unitKey} unit={unit} completedSessionIds={[]} onNavigate={vi.fn()} />);

    expect(screen.getByText(/家长提示：本课程依据 TapXWorld 固定快照/)).toBeInTheDocument();
    expect(screen.getByText(/可能与人教社后续修订版存在差异/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '基础版任务' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '进阶版任务' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '高阶版任务' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: '查看任务' })).toHaveLength(3);
  });

  it('opensTaskAndStartsItsNestedSession', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    const task = unit.difficultyTracks.basic.tasks[0];

    render(<UnitOverview unitKey={unitKey} unit={unit} selectedDifficulty="basic" selectedTask={task} completedSessionIds={[]} onNavigate={onNavigate} />);

    expect(screen.getByRole('heading', { name: task.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '学习场次' })).toBeInTheDocument();
    const startButton = screen.getByRole('button', { name: '开始第 1 场' });
    startButton.focus();
    await user.keyboard('{Enter}');

    expect(onNavigate).toHaveBeenCalledWith(`/${unitKey}/basic/task-01/session-01`);
  });
});
