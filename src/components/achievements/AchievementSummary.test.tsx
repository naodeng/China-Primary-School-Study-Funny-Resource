import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getCompletedUnitCount, getCosmicRank } from '../../achievements/progress';
import AchievementSummary from './AchievementSummary';

describe('AchievementSummary', () => {
  it('showsCompactExplorationProgressAndOpensAchievementDetails', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    const completedSessionIds: string[] = [];
    const learningStart = { grade: 2, term: 1 as const, unit: 1 };
    const completedCount = getCompletedUnitCount(completedSessionIds, learningStart);

    render(<AchievementSummary completedSessionIds={completedSessionIds} learningStart={learningStart} onNavigate={onNavigate} />);

    expect(screen.getByRole('heading', { name: getCosmicRank(completedCount).title })).toBeInTheDocument();
    expect(screen.getByText(/完成第一个完整单元/)).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: /距离月球开拓者的进度/ })).toHaveAttribute('aria-valuenow', '0');
    await user.click(screen.getByRole('button', { name: /成就详情/ }));
    expect(onNavigate).toHaveBeenCalledWith('/achievements');
  });
});
