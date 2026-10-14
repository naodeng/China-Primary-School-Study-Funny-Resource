import { describe, expect, it } from 'vitest';
import { curriculum } from '../content/curriculum';
import { getSessionsForDifficulty } from '../content/sessionUtils';
import type { Curriculum } from '../content/types';
import { getExplorationZones } from './exploration';

function createOneVerifiedUnit(): Curriculum {
  const source = structuredClone(curriculum);
  const entry = source.grades[0].terms[0].subjects.find((subject) => subject.id === 'chinese')!.units[0];
  entry.status = 'active';
  source.textbooks[entry.textbookEditionId].verificationStatus = 'verified';
  return source;
}

describe('exploration map', () => {
  it('showsCompletedPlayableNodesAndKeepsUnverifiedNodesDimmed', () => {
    const source = createOneVerifiedUnit();
    const unit = source.units['grade-2/term-1/chinese/unit-01'];
    const completedSessionIds = getSessionsForDifficulty(unit, 'basic').map((session) => session.id);
    const zones = getExplorationZones(completedSessionIds, { grade: 2, term: 1, unit: 2 }, source);

    expect(zones).toHaveLength(12);
    expect(zones[0]).toMatchObject({ gradeTitle: '1年级', termTitle: '上学期', hasCurriculum: false, isOpen: false });
    expect(zones[2]).toMatchObject({ hasCurriculum: true, isStartZone: true, isOpen: true, completedUnitCount: 1 });
    expect(zones[2].units.find((node) => node.subjectTitle === '语文')).toMatchObject({ state: 'complete', completedSessions: completedSessionIds.length });
    expect(zones[2].units.filter((node) => node.state === 'comingSoon')).toHaveLength(3);
    const incompleteZones = getExplorationZones([], null, source);
    expect(incompleteZones[2].units.find((node) => node.subjectTitle === '语文')).toMatchObject({ state: 'available', completedSessions: 0 });
  });

  it('opensAStartZoneEvenWhenNoCourseNodesAreRegisteredThere', () => {
    const zones = getExplorationZones([], { grade: 6, term: 2, unit: 1 });

    expect(zones[11]).toMatchObject({ hasCurriculum: false, isStartZone: true, startUnit: 1, isOpen: true });
  });
});
