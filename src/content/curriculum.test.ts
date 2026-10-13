import { describe, expect, it } from 'vitest';
import { curriculum } from './curriculum';
import { validateCurriculum } from './validateCurriculum';
import { getSessionsForDifficulty } from './sessionUtils';
import { getKnownCurriculumPositions } from '../achievements/position';

describe('curriculum registry', () => {
  it('keeps all six school textbook editions pending until their contents are verified', () => {
    expect(Object.keys(curriculum.textbooks)).toHaveLength(6);
    expect(Object.values(curriculum.textbooks).every((book) => book.verificationStatus === 'pending')).toBe(true);
  });

  it('doesNotExposeUnverifiedCourseEntries', () => {
    for (const grade of curriculum.grades) {
      for (const term of grade.terms) {
        for (const subject of term.subjects) {
          for (const entry of subject.units) {
            expect(entry.status).toBe('comingSoon');
            expect(curriculum.textbooks[entry.textbookEditionId]?.verificationStatus).toBe('pending');
          }
        }
      }
    }
  });

  it('doesNotCreateAchievementPositionsForUnverifiedCourseEntries', () => {
    expect(getKnownCurriculumPositions()).toEqual([]);
  });

  it('preserves existing sessions as non-playable basic tasks with full canonical IDs', () => {
    const originalCounts = {
      'grade-2/term-1/chinese/unit-01': 3,
      'grade-2/term-1/chinese/unit-02': 3,
      'grade-2/term-1/math/unit-01': 2,
      'grade-2/term-1/math/unit-02': 4,
    };

    for (const [unitKey, expectedTaskCount] of Object.entries(originalCounts)) {
      const unit = curriculum.units[unitKey];
      expect(unit.id).toBe(unitKey);
      expect(unit.difficultyTracks.basic.tasks).toHaveLength(expectedTaskCount);
      expect(getSessionsForDifficulty(unit, 'basic').every((session) => session.id.startsWith(`${unitKey}/basic/task-`))).toBe(true);
      expect(unit.achievementEligible).toBe(true);
    }
  });

  it('accepts the pending MVP registry without treating its placeholder tasks as playable', () => {
    expect(validateCurriculum(curriculum)).toEqual([]);
  });
});
