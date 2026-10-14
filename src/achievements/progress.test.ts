import { describe, expect, it } from 'vitest';
import { curriculum } from '../content/curriculum';
import { getSessionsForDifficulty } from '../content/sessionUtils';
import type { Curriculum, CurriculumUnit } from '../content/types';
import { getKnownCurriculumPositions, getRegisteredLearningPositions } from './position';
import {
  getCompletedUnitCount,
  getCosmicRank,
  getLearningUnitProgress,
  getNewCosmicRank,
  getTaskProgress,
  isCurriculumUnitComplete,
} from './progress';

const unit = curriculum.units['grade-2/term-1/chinese/unit-01'];
const basicSessions = getSessionsForDifficulty(unit, 'basic');

function createVerifiedCurriculum(unitCount: number): Curriculum {
  const source = structuredClone(curriculum);
  const subject = source.grades.find((grade) => grade.id === 'grade-2')!.terms[0].subjects.find((entry) => entry.id === 'chinese')!;
  const textbookId = 'grade-2/term-1/chinese';
  source.textbooks[textbookId].verificationStatus = 'verified';
  const units: CurriculumUnit[] = [];

  for (let number = 1; number <= unitCount; number += 1) {
    const unitId = `grade-2/term-1/chinese/unit-${String(number).padStart(2, '0')}`;
    const copy = structuredClone(unit);
    copy.id = unitId;
    copy.title = `第 ${number} 单元`;
    copy.formalUnitNumber = number;
    copy.textbookEditionId = textbookId;
    for (const track of Object.values(copy.difficultyTracks)) {
      for (const task of track.tasks) {
        task.id = task.id.replace(unit.id, unitId);
        for (const session of task.sessions) session.id = session.id.replace(unit.id, unitId);
      }
    }
    source.units[unitId] = copy;
    units.push(copy);
  }

  subject.units = units.map((entry) => ({
    id: `unit-${String(entry.formalUnitNumber).padStart(2, '0')}`,
    title: entry.title,
    status: 'active',
    type: 'unit',
    formalUnitNumber: entry.formalUnitNumber,
    achievementEligible: true,
    textbookEditionId: textbookId,
    curriculumUnitKey: entry.id,
  }));
  return source;
}

describe('achievement progress', () => {
  it('doesNotCompleteUnitWhenBasicTaskIsPartial', () => {
    expect(isCurriculumUnitComplete(unit, [basicSessions[0].id])).toBe(false);
  });

  it('completesUnitAfterAllBasicSessions', () => {
    expect(isCurriculumUnitComplete(unit, basicSessions.map((session) => session.id))).toBe(true);
  });

  it('ignoresAdvancedAndHighForUnitCompletion', () => {
    const higherTierIds = [
      ...getSessionsForDifficulty(unit, 'advanced'),
      ...getSessionsForDifficulty(unit, 'high'),
    ].map((session) => session.id);
    expect(isCurriculumUnitComplete(unit, higherTierIds)).toBe(false);
  });

  it('excludesUnnumberedReviewFromRankCount', () => {
    const review = { ...unit, type: 'review' as const, formalUnitNumber: null, achievementEligible: false };
    expect(isCurriculumUnitComplete(review, basicSessions.map((session) => session.id))).toBe(false);
    const source = createVerifiedCurriculum(0);
    const subject = source.grades[0].terms[0].subjects.find((entry) => entry.id === 'chinese')!;
    const reviewId = 'grade-2/term-1/chinese/review-01';
    source.units[reviewId] = { ...review, id: reviewId };
    subject.units.push({
      id: 'review-01', title: '复习', status: 'active', type: 'review', formalUnitNumber: null,
      achievementEligible: false, textbookEditionId: 'grade-2/term-1/chinese', curriculumUnitKey: reviewId,
    });
    expect(getCompletedUnitCount(basicSessions.map((session) => session.id), null, source)).toBe(0);
  });

  it('mapsOnlyVerifiedCurriculum', () => {
    const source = createVerifiedCurriculum(1);
    source.textbooks['grade-2/term-1/chinese'].verificationStatus = 'pending';
    expect(getKnownCurriculumPositions(source)).toEqual([]);
    source.textbooks['grade-2/term-1/chinese'].verificationStatus = 'verified';
    expect(getKnownCurriculumPositions(source).map((position) => position.curriculumUnitKey)).toEqual([
      'grade-2/term-1/chinese/unit-01',
    ]);
    expect(getRegisteredLearningPositions(source)).toEqual([
      { grade: 2, term: 1, unit: 1 },
      { grade: 2, term: 1, unit: 2 },
    ]);
    expect(getKnownCurriculumPositions()).toEqual([]);
  });

  it('unlocksRanksAt1_2_4_8', () => {
    expect([1, 2, 4, 8].map((count) => getCosmicRank(count).unitsRequired)).toEqual([1, 2, 4, 8]);
    expect(getCosmicRank(-1).unitsRequired).toBe(0);
    const source = createVerifiedCurriculum(8);
    expect(getNewCosmicRank([], [], null, source)).toBeNull();
    for (const threshold of [1, 2, 4, 8]) {
      const priorIds = source.grades[0].terms[0].subjects.find((entry) => entry.id === 'chinese')!.units
        .slice(0, threshold - 1)
        .flatMap((entry) => getSessionsForDifficulty(source.units[entry.curriculumUnitKey!], 'basic').map((session) => session.id));
      const nextIds = source.grades[0].terms[0].subjects.find((entry) => entry.id === 'chinese')!.units
        .slice(0, threshold)
        .flatMap((entry) => getSessionsForDifficulty(source.units[entry.curriculumUnitKey!], 'basic').map((session) => session.id));
      expect(getNewCosmicRank(priorIds, nextIds, null, source)?.unitsRequired).toBe(threshold);
    }
  });

  it('reportsTaskProgressFromItsOwnSessions', () => {
    const task = unit.difficultyTracks.basic.tasks[0];
    const [firstSession] = task.sessions;

    expect(getTaskProgress(task, [firstSession.id])).toEqual({ completedSessionCount: 1, totalSessionCount: 1, completed: true });
    expect(getTaskProgress(task, [])).toEqual({ completedSessionCount: 0, totalSessionCount: 1, completed: false });
    expect(getTaskProgress({ ...task, sessions: [] }, [])).toEqual({ completedSessionCount: 0, totalSessionCount: 0, completed: false });
  });

  it('appliesRegisteredStartToVerifiedUnitProgress', () => {
    const source = createVerifiedCurriculum(1);
    const assumedProgress = getLearningUnitProgress([], { grade: 2, term: 1, unit: 2 }, source);

    expect(assumedProgress).toHaveLength(1);
    expect(assumedProgress[0].completed).toBe(true);
    expect(getCompletedUnitCount([], { grade: 2, term: 1, unit: 2 }, source)).toBe(1);
  });

  it('reportsOnlyActuallyCompletedSessionsBeforeTheLearningStart', () => {
    const source = createVerifiedCurriculum(1);
    const firstSession = getSessionsForDifficulty(source.units['grade-2/term-1/chinese/unit-01'], 'basic')[0];
    const partial = getLearningUnitProgress([firstSession.id], null, source);

    expect(partial[0].completedSessionIds).toEqual([firstSession.id]);
    expect(partial[0].completed).toBe(false);
    expect(getCompletedUnitCount([firstSession.id], null, source)).toBe(0);
  });
});
