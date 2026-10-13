import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ActivityFeedback from './ActivityFeedback';

const callbacks = { onShowHint: vi.fn(), onRetry: vi.fn() };

describe('ActivityFeedback', () => {
  it('showsTheSelectedCorrectMessageAndExplanation', () => {
    render(
      <ActivityFeedback
        status="correct"
        hint="想想线索"
        explanation="答案来自题目中的线索。"
        hintVisible={false}
        message="你发现了关键线索！"
        {...callbacks}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('你发现了关键线索！');
    expect(screen.getByText('答案来自题目中的线索。')).toBeInTheDocument();
  });

  it('showsEncouragingIncorrectMessageHintAndRetryAction', () => {
    render(
      <ActivityFeedback
        status="incorrect"
        hint="再数一数"
        explanation="一共三颗星。"
        hintVisible
        message="换个角度想想，你正在进步。"
        {...callbacks}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('换个角度想想，你正在进步。');
    expect(screen.getByText('小提示：再数一数')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '再试一次' })).toBeInTheDocument();
  });
});
