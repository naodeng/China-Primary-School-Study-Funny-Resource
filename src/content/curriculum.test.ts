import { describe, expect, it } from 'vitest';
import { curriculum } from './curriculum';
import { validateCurriculum } from './validateCurriculum';
import { getSessionsForDifficulty } from './sessionUtils';
import { getKnownCurriculumPositions } from '../achievements/position';
import { TAPX_TEXTBOOK_COMMIT } from './textbooks';

const term1ChineseUnits = [
  ['grade-2/term-1/chinese/unit-01', '第一单元 · 大自然的秘密'],
  ['grade-2/term-1/chinese/unit-02', '第二单元 · 场景识字'],
  ['grade-2/term-1/chinese/unit-03', '第三单元 · 学习与成长'],
  ['grade-2/term-1/chinese/unit-04', '第四单元 · 山水风光'],
  ['grade-2/term-1/chinese/unit-05', '第五单元 · 观察与思考'],
  ['grade-2/term-1/chinese/unit-06', '第六单元 · 人物与故事'],
  ['grade-2/term-1/chinese/unit-07', '第七单元 · 四季与自然'],
  ['grade-2/term-1/chinese/unit-08', '第八单元 · 童话与成长'],
] as const;

describe('curriculum registry', () => {
  it('listsAllVerifiedTerm1ChineseEntries', () => {
    const subject = curriculum.grades[0]?.terms[0]?.subjects.find(({ id }) => id === 'chinese');
    expect(subject?.units.map(({ id }) => id)).toEqual(term1ChineseUnits.map(([key]) => key.split('/').at(-1)));
    expect(curriculum.textbooks['grade-2/term-1/chinese']?.verificationStatus).toBe('verified');

    term1ChineseUnits.forEach(([unitKey, title], index) => {
      const entry = subject?.units[index];
      expect(entry).toMatchObject({
        title,
        status: 'active',
        type: 'unit',
        formalUnitNumber: index + 1,
        achievementEligible: true,
        textbookEditionId: 'grade-2/term-1/chinese',
        curriculumUnitKey: unitKey,
      });
    });
  });

  it.each(term1ChineseUnits.map(([unitKey]) => unitKey))(
    'gives %s two basic tasks and one task at each higher tier with eight questions per session',
    (unitKey) => {
      const unit = curriculum.units[unitKey];
      expect(unit.difficultyTracks.basic.tasks.length).toBeGreaterThanOrEqual(2);
      expect(unit.difficultyTracks.advanced.tasks).toHaveLength(1);
      expect(unit.difficultyTracks.high.tasks).toHaveLength(1);

      Object.values(unit.difficultyTracks).forEach(({ tasks }) => {
        tasks.forEach((task) => {
          expect(task.sessions.length).toBeGreaterThan(0);
          task.sessions.forEach((session) => expect(session.activities).toHaveLength(8));
        });
      });
    },
  );

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
      expect(book?.verificationStatus).toBe(editionId === 'grade-2/term-1/chinese' ? 'verified' : 'pending');
    }

    expect(curriculum.textbooks['grade-2/term-2/chinese']?.isbn).toBe('978-7-107-32383-6');
    expect(curriculum.textbooks['grade-2/term-1/math']?.isbn).toBe('978-7-107-36923-0');
    expect(curriculum.textbooks['grade-2/term-2/english']?.isbn).toBe('978-7-107-27396-4');
    expect(curriculum.textbooks['grade-2/term-1/chinese']?.isbn).toBeNull();
    expect(curriculum.textbooks['grade-2/term-2/math']?.edition).toBeNull();
  });

  it('marks only the fully checked term-1 Chinese fallback as verified', () => {
    expect(Object.keys(curriculum.textbooks)).toHaveLength(6);
    expect(curriculum.textbooks['grade-2/term-1/chinese']?.verificationStatus).toBe('verified');
    expect(Object.entries(curriculum.textbooks).filter(([id]) => id !== 'grade-2/term-1/chinese')
      .every(([, book]) => book.verificationStatus === 'pending')).toBe(true);
  });

  it('opens only entries with verified selected content', () => {
    for (const grade of curriculum.grades) {
      for (const term of grade.terms) {
        for (const subject of term.subjects) {
          for (const entry of subject.units) {
            const edition = curriculum.textbooks[entry.textbookEditionId];
            if (entry.status === 'active') {
              expect(edition?.verificationStatus).toBe('verified');
              expect(entry.curriculumUnitKey).toBeTruthy();
            } else {
              expect(edition?.verificationStatus).toBe('pending');
            }
          }
        }
      }
    }
  });

  it('creates achievement positions only for the eight verified term-1 Chinese units', () => {
    expect(getKnownCurriculumPositions().map(({ key }) => key)).toEqual(
      term1ChineseUnits.map(([unitKey]) => unitKey),
    );
  });

  it('keeps basic tasks under full canonical IDs for existing curriculum entries', () => {
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

  it('accepts the selected curriculum registry after validating all open entries', () => {
    expect(validateCurriculum(curriculum)).toEqual([]);
  });
});
