import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getCompletedUnitCount, getCosmicRank } from '../../achievements/progress';
import { getExplorationZones } from '../../achievements/exploration';
import AchievementDashboard from './AchievementDashboard';

describe('AchievementDashboard', () => {
  it('showsTheLearnersRankAndTwelveZoneOverviewWithDetailsCollapsed', () => {
    const completedSessionIds: string[] = [];
    const learningStart = null;
    const rank = getCosmicRank(getCompletedUnitCount(completedSessionIds, learningStart));
    const zones = getExplorationZones(completedSessionIds, learningStart);

    render(<AchievementDashboard completedSessionIds={completedSessionIds} learningStart={learningStart} />);

    expect(screen.getByLabelText(`${rank.title}，当前头衔`)).toBeInTheDocument();
    expect(screen.getByLabelText(`${zones.length} 个星区`)).toBeInTheDocument();
    expect(screen.getAllByText(/第\d+星区/)).toHaveLength(zones.length);
    expect(screen.getByRole('progressbar', { name: /距离月球开拓者的进度/ })).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByRole('button', { name: '查看二年级上学期语文进度' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('opensAndClosesAZoneAndCourseGroupOnDemand', async () => {
    const user = userEvent.setup();
    render(<AchievementDashboard completedSessionIds={[]} learningStart={null} />);

    const zoneToggle = screen.getByRole('button', { name: '查看第3星区的单元进度' });
    const zoneDetails = document.getElementById(zoneToggle.getAttribute('aria-controls')!);
    expect(zoneDetails).not.toBeVisible();
    await user.click(zoneToggle);
    expect(zoneToggle).toHaveAttribute('aria-expanded', 'true');
    expect(zoneDetails).toBeVisible();
    await user.click(zoneToggle);
    expect(zoneToggle).toHaveAttribute('aria-expanded', 'false');
    expect(zoneDetails).not.toBeVisible();

    const courseToggle = screen.getByRole('button', { name: '查看二年级上学期语文进度' });
    const courseDetails = document.getElementById(courseToggle.getAttribute('aria-controls')!);
    expect(courseDetails).not.toBeVisible();
    await user.click(courseToggle);
    expect(courseToggle).toHaveAttribute('aria-expanded', 'true');
    expect(courseDetails).toBeVisible();
    expect(courseDetails).toHaveTextContent('待探索');
    await user.click(courseToggle);
    expect(courseToggle).toHaveAttribute('aria-expanded', 'false');
    expect(courseDetails).not.toBeVisible();
  });
});
