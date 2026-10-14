import { describe, expect, it } from 'vitest';
import { curriculum } from './curriculum';
import { validateCurriculum } from './validateCurriculum';
import { getSessionsForDifficulty } from './sessionUtils';
import { getKnownCurriculumPositions } from '../achievements/position';

describe('curriculum registry', () => {
  it('points each textbook edition to its selected current PEP evidence while keeping unverified books pending', () => {
    const currentPepEvidence = {
      'grade-2/term-1/chinese': 'https://www.pep.com.cn/bks/xxyw/jzjd/202507/W020250716532280620290.pdf',
      'grade-2/term-2/chinese': 'https://www.pep.com.cn/bks/xxyw/jzjd/202507/W020250716532280620290.pdf',
      'grade-2/term-1/math': 'https://www.pep.com.cn/rjyx/qnbjsjc/sytj/202605/t20260514_2006676.shtml',
      'grade-2/term-2/math': 'https://www.pep.com.cn/rjyx/qnbjsjc/sytj/202605/t20260514_2006676.shtml',
      'grade-2/term-1/english': 'https://www.pep.com.cn/xw/zt/hd/12/xjcjs/xx/202409/t20240920_1995564.html',
      'grade-2/term-2/english': 'https://www.pep.com.cn/xw/zt/hd/12/xjcjs/xx/202409/t20240920_1995564.html',
    };

    for (const [editionId, sourceUrl] of Object.entries(currentPepEvidence)) {
      expect(curriculum.textbooks[editionId]?.sourceUrl).toBe(sourceUrl);
      expect(curriculum.textbooks[editionId]?.verificationStatus).toBe('pending');
    }
  });

  it('keeps all six selected textbook editions pending until their contents are verified', () => {
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
