import { describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { LearningSession } from '../../content/types';
import SessionPlayer from './SessionPlayer';

const session: LearningSession = {
  id: 'grade-2/term-1/chinese/unit-01/basic/task-01/session-01',
  title: '星星线索训练场',
  durationMinutes: 20,
  objective: '读懂题目里的线索，再一步一步找到答案。',
  companionId: 'companion-02',
  activities: Array.from({ length: 8 }, (_, index) => ({
    id: `question-${index + 1}`,
    kind: 'choice' as const,
    prompt: `第 ${index + 1} 题：哪一个选项是正确线索？`,
    hint: '再观察一下选项。',
    explanation: '你认真读题，就能发现这条线索。',
    options: [
      { id: 'wrong', label: `错误选项 ${index + 1}` },
      { id: 'correct', label: `正确选项 ${index + 1}` },
    ],
    correctOptionId: 'correct',
  })),
};

describe('SessionPlayer', () => {
  it('keepsProgressAtEightQuestionsAndCompletesOnlyAfterEachCorrectAnswer', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<SessionPlayer session={session} subject="chinese" newlyUnlockedRank={null} onComplete={onComplete} onExit={vi.fn()} />);
    const progressBar = screen.getByRole('progressbar', { name: '本场完成进度' });
    const nextButton = screen.getByRole('button', { name: /^继续下一题/ });

    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    expect(nextButton).toBeDisabled();
    await user.click(screen.getByRole('button', { name: '错误选项 1' }));
    await user.click(screen.getByRole('button', { name: '提交答案' }));
    expect(screen.getByRole('status')).toHaveTextContent(/没关系|勇敢尝试|换个角度|别着急|每一次尝试/);
    expect(nextButton).toBeDisabled();
    await user.click(screen.getByRole('button', { name: '再试一次' }));
    await user.click(screen.getByRole('button', { name: '正确选项 1' }));
    await user.click(screen.getByRole('button', { name: '提交答案' }));
    expect(progressBar).toHaveAttribute('aria-valuenow', '13');
    await user.click(nextButton);

    for (let index = 1; index < session.activities.length - 1; index += 1) {
      expect(screen.getByText(`挑战 ${index + 1} / 8`)).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: `正确选项 ${index + 1}` }));
      await user.click(screen.getByRole('button', { name: '提交答案' }));
      await user.click(screen.getByRole('button', { name: /^继续下一题/ }));
    }

    expect(screen.getByText('挑战 8 / 8')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '正确选项 8' }));
    await user.click(screen.getByRole('button', { name: '提交答案' }));
    const finishButton = screen.getByRole('button', { name: /^完成本场/ });
    act(() => {
      finishButton.click();
      finishButton.click();
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith(session.id);
    expect(screen.getByRole('heading', { name: '太棒了，能量收集完成！' })).toBeInTheDocument();
    expect(screen.getByText(/里的 8 个小挑战/)).toBeInTheDocument();
  });
});
