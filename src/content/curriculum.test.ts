import { describe, expect, it } from 'vitest';
import { curriculum } from './curriculum';
import { validateCurriculum } from './validateCurriculum';
import { getSessionsForDifficulty } from './sessionUtils';
import { getKnownCurriculumPositions } from '../achievements/position';
import { TAPX_TEXTBOOK_COMMIT } from './textbooks';

describe('curriculum registry', () => {
  it('records each selected TapX fallback separately from the latest PEP evidence', () => {
    const selectedSources = {
      'grade-2/term-1/chinese': {
        path: '小学/语文/统编版/义务教育教科书·语文二年级上册.pdf',
        pep: 'https://www.pep.com.cn/bks/xxyw/jzjd/202507/W020250716532280620290.pdf',
      },
      'grade-2/term-2/chinese': {
        path: '小学/语文/统编版/义务教育教科书·语文二年级下册.pdf',
        pep: 'https://www.pep.com.cn/bks/xxyw/jzjd/202507/W020250716532280620290.pdf',
      },
      'grade-2/term-1/math': {
        path: '小学/数学/人教版/义务教育教科书 · 数学二年级上册.pdf',
        pep: 'https://www.pep.com.cn/rjyx/qnbjsjc/sytj/202605/t20260514_2006676.shtml',
      },
      'grade-2/term-2/math': {
        path: '小学/数学/人教版/义务教育教科书·数学二年级下册.pdf',
        pep: 'https://www.pep.com.cn/rjyx/qnbjsjc/sytj/202605/t20260514_2006676.shtml',
      },
      'grade-2/term-1/english': {
        path: '小学/英语/人教版（一年级起点）（主编：吴欣）/义务教育教科书·英语（一年级起点）二年级上册.pdf',
        pep: 'https://www.pep.com.cn/xw/zt/hd/12/xjcjs/xx/202409/t20240920_1995564.html',
      },
      'grade-2/term-2/english': {
        path: '小学/英语/人教版（一年级起点）（主编：吴欣）/义务教育教科书·英语（一年级起点）二年级下册.pdf',
        pep: 'https://www.pep.com.cn/xw/zt/hd/12/xjcjs/xx/202409/t20240920_1995564.html',
      },
    };

    for (const [editionId, selected] of Object.entries(selectedSources)) {
      const book = curriculum.textbooks[editionId];
      const expectedPath = selected.path.split('/').map(encodeURIComponent).join('/');
      expect(book?.sourceKind).toBe('tapx-fallback');
      expect(book?.sourceUrl).toBe(`https://github.com/TapXWorld/ChinaTextbook/blob/${TAPX_TEXTBOOK_COMMIT}/${expectedPath}`);
      expect(book?.latestPepEvidenceUrl).toBe(selected.pep);
      expect(book?.fallbackReason?.trim().length).toBeGreaterThan(0);
      expect(book?.tapxCommit).toBe(TAPX_TEXTBOOK_COMMIT);
      expect(book?.verificationStatus).toBe('pending');
    }

    expect(curriculum.textbooks['grade-2/term-2/chinese']?.isbn).toBe('978-7-107-32383-6');
    expect(curriculum.textbooks['grade-2/term-1/math']?.isbn).toBe('978-7-107-36923-0');
    expect(curriculum.textbooks['grade-2/term-2/english']?.isbn).toBe('978-7-107-27396-4');
    expect(curriculum.textbooks['grade-2/term-1/chinese']?.isbn).toBeNull();
    expect(curriculum.textbooks['grade-2/term-2/math']?.edition).toBeNull();
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
