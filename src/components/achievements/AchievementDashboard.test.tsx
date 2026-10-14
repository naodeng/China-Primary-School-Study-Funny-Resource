import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getCompletedUnitCount, getCosmicRank } from '../../achievements/progress';
import { getExplorationZones } from '../../achievements/exploration';
import AchievementDashboard from './AchievementDashboard';

describe('AchievementDashboard', () => {
  it('showsTheLearnersRankAndExpandableTwelveZoneMap', () => {
    const completedSessionIds: string[] = [];
    const learningStart = null;
    const rank = getCosmicRank(getCompletedUnitCount(completedSessionIds, learningStart));
    const zones = getExplorationZones(completedSessionIds, learningStart);

    render(<AchievementDashboard completedSessionIds={completedSessionIds} learningStart={learningStart} />);

    expect(screen.getByLabelText(`${rank.title}，当前头衔`)).toBeInTheDocument();
    expect(screen.getByLabelText(`${zones.length} 个星区`)).toBeInTheDocument();
    expect(screen.getAllByText(/第\d+星区/)).toHaveLength(zones.length);
  });
});
