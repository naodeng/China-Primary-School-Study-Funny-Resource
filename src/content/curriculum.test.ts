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

const term2ChineseUnits = [
  ['grade-2/term-2/chinese/unit-01', '第一单元 · 春天来了'],
  ['grade-2/term-2/chinese/unit-02', '第二单元 · 关爱与劳动'],
  ['grade-2/term-2/chinese/unit-03', '第三单元 · 传统文化'],
  ['grade-2/term-2/chinese/unit-04', '第四单元 · 童心与想象'],
  ['grade-2/term-2/chinese/unit-05', '第五单元 · 寓言与思考'],
  ['grade-2/term-2/chinese/unit-06', '第六单元 · 自然观察'],
  ['grade-2/term-2/chinese/unit-07', '第七单元 · 动物与成长'],
  ['grade-2/term-2/chinese/unit-08', '第八单元 · 远古故事'],
] as const;

const term1MathEntries = [
  ['grade-2/term-1/math/unit-01', '第一单元 · 长度单位', 'unit', 1, true],
  ['grade-2/term-1/math/unit-02', '第二单元 · 100以内的加法和减法（二）', 'unit', 2, true],
  ['grade-2/term-1/math/unit-03', '第三单元 · 角的初步认识', 'unit', 3, true],
  ['grade-2/term-1/math/unit-04', '第四单元 · 表内乘法（一）', 'unit', 4, true],
  ['grade-2/term-1/math/unit-05', '第五单元 · 观察物体（一）', 'unit', 5, true],
  ['grade-2/term-1/math/unit-06', '第六单元 · 表内乘法（二）', 'unit', 6, true],
  ['grade-2/term-1/math/unit-07', '第七单元 · 认识时间', 'unit', 7, true],
  ['grade-2/term-1/math/unit-08', '第八单元 · 数学广角——搭配（一）', 'unit', 8, true],
  ['grade-2/term-1/math/unit-09', '第九单元 · 总复习', 'unit', 9, true],
  ['grade-2/term-1/math/integrated-practice-01', '综合实践 · 量一量，比一比', 'integrated-practice', null, false],
] as const;

const term2MathEntries = [
  ['grade-2/term-2/math/unit-01', '第一单元 · 数据收集和整理', 'unit', 1, true],
  ['grade-2/term-2/math/unit-02', '第二单元 · 表内除法（一）', 'unit', 2, true],
  ['grade-2/term-2/math/unit-03', '第三单元 · 图形的运动（一）', 'unit', 3, true],
  ['grade-2/term-2/math/unit-04', '第四单元 · 表内除法（二）', 'unit', 4, true],
  ['grade-2/term-2/math/unit-05', '第五单元 · 混合运算', 'unit', 5, true],
  ['grade-2/term-2/math/unit-06', '第六单元 · 有余数的除法', 'unit', 6, true],
  ['grade-2/term-2/math/unit-07', '第七单元 · 万以内数的认识', 'unit', 7, true],
  ['grade-2/term-2/math/unit-08', '第八单元 · 克和千克', 'unit', 8, true],
  ['grade-2/term-2/math/unit-09', '第九单元 · 数学广角——推理', 'unit', 9, true],
  ['grade-2/term-2/math/unit-10', '第十单元 · 总复习', 'unit', 10, true],
  ['grade-2/term-2/math/integrated-practice-01', '综合实践 · 小小设计师', 'integrated-practice', null, false],
] as const;

describe('curriculum registry', () => {
  it('listsAllVerifiedTerm1MathEntries', () => {
    const subject = curriculum.grades[0]?.terms[0]?.subjects.find(({ id }) => id === 'math');
    expect(subject?.units.map(({ id }) => id)).toEqual(term1MathEntries.map(([key]) => key.split('/').at(-1)));
    expect(curriculum.textbooks['grade-2/term-1/math']?.verificationStatus).toBe('verified');

    term1MathEntries.forEach(([unitKey, title, type, formalUnitNumber, achievementEligible], index) => {
      expect(subject?.units[index]).toMatchObject({
        title,
        status: 'active',
        type,
        formalUnitNumber,
        achievementEligible,
        textbookEditionId: 'grade-2/term-1/math',
        curriculumUnitKey: unitKey,
      });
      expect(curriculum.units[unitKey]).toMatchObject({
        id: unitKey,
        subject: 'math',
        type,
        formalUnitNumber,
        achievementEligible,
        textbookEditionId: 'grade-2/term-1/math',
      });
    });
  });

  it('listsAllVerifiedTerm2MathEntries', () => {
    const subject = curriculum.grades[0]?.terms.find(({ id }) => id === 'term-2')?.subjects.find(({ id }) => id === 'math');
    expect(subject?.units.map(({ id }) => id)).toEqual(term2MathEntries.map(([key]) => key.split('/').at(-1)));
    expect(curriculum.textbooks['grade-2/term-2/math']?.verificationStatus).toBe('verified');

    term2MathEntries.forEach(([unitKey, title, type, formalUnitNumber, achievementEligible], index) => {
      expect(subject?.units[index]).toMatchObject({
        title,
        status: 'active',
        type,
        formalUnitNumber,
        achievementEligible,
        textbookEditionId: 'grade-2/term-2/math',
        curriculumUnitKey: unitKey,
      });
      expect(curriculum.units[unitKey]).toMatchObject({
        id: unitKey,
        subject: 'math',
        type,
        formalUnitNumber,
        achievementEligible,
        textbookEditionId: 'grade-2/term-2/math',
      });
    });
  });

  it.each(term2MathEntries.map(([unitKey]) => unitKey))(
    'gives %s three difficulty tracks, basic practice, and eight questions per session',
    (unitKey) => {
      const unit = curriculum.units[unitKey];
      expect(unit.difficultyTracks.basic.tasks.length).toBeGreaterThanOrEqual(2);
      expect(unit.difficultyTracks.advanced.tasks).toHaveLength(1);
      expect(unit.difficultyTracks.high.tasks).toHaveLength(1);
      Object.values(unit.difficultyTracks).forEach(({ tasks }) => tasks.forEach((task) => {
        expect(task.sessions.length).toBeGreaterThan(0);
        task.sessions.forEach((session) => {
          expect(session.durationMinutes).toBe(20);
          expect(session.activities).toHaveLength(8);
        });
      }));
    },
  );

  it.each(term1MathEntries.map(([unitKey]) => unitKey))(
    'gives %s three difficulty tracks, basic practice, and eight questions per session',
    (unitKey) => {
      const unit = curriculum.units[unitKey];
      expect(unit.difficultyTracks.basic.tasks.length).toBeGreaterThanOrEqual(2);
      expect(unit.difficultyTracks.advanced.tasks).toHaveLength(1);
      expect(unit.difficultyTracks.high.tasks).toHaveLength(1);
      Object.values(unit.difficultyTracks).forEach(({ tasks }) => tasks.forEach((task) => {
        expect(task.sessions.length).toBeGreaterThan(0);
        task.sessions.forEach((session) => expect(session.activities).toHaveLength(8));
      }));
    },
  );

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

  it('listsAllVerifiedTerm2ChineseEntries', () => {
    const subject = curriculum.grades[0]?.terms.find(({ id }) => id === 'term-2')?.subjects.find(({ id }) => id === 'chinese');
    expect(subject?.units.map(({ id }) => id)).toEqual(term2ChineseUnits.map(([key]) => key.split('/').at(-1)));
    expect(curriculum.textbooks['grade-2/term-2/chinese']?.verificationStatus).toBe('verified');

    term2ChineseUnits.forEach(([unitKey, title], index) => {
      expect(subject?.units[index]).toMatchObject({
        title,
        status: 'active',
        type: 'unit',
        formalUnitNumber: index + 1,
        achievementEligible: true,
        textbookEditionId: 'grade-2/term-2/chinese',
        curriculumUnitKey: unitKey,
      });
    });
  });

  it.each(term2ChineseUnits.map(([unitKey]) => unitKey))(
    'gives %s two basic tasks and one task at each higher tier with eight questions per session',
    (unitKey) => {
      const unit = curriculum.units[unitKey];
      expect(unit.difficultyTracks.basic.tasks.length).toBeGreaterThanOrEqual(2);
      expect(unit.difficultyTracks.advanced.tasks).toHaveLength(1);
      expect(unit.difficultyTracks.high.tasks).toHaveLength(1);
      Object.values(unit.difficultyTracks).forEach(({ tasks }) => tasks.forEach((task) => {
        expect(task.sessions.length).toBeGreaterThan(0);
        task.sessions.forEach((session) => expect(session.activities).toHaveLength(8));
      }));
    },
  );

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
      expect(book?.verificationStatus).toBe(
        editionId === 'grade-2/term-1/chinese' || editionId === 'grade-2/term-2/chinese' || editionId === 'grade-2/term-1/math' || editionId === 'grade-2/term-2/math'
          ? 'verified'
          : 'pending',
      );
    }

    expect(curriculum.textbooks['grade-2/term-2/chinese']?.isbn).toBe('978-7-107-32383-6');
    expect(curriculum.textbooks['grade-2/term-1/math']?.isbn).toBe('978-7-107-36923-0');
    expect(curriculum.textbooks['grade-2/term-2/english']?.isbn).toBe('978-7-107-27396-4');
    expect(curriculum.textbooks['grade-2/term-1/chinese']?.isbn).toBeNull();
    expect(curriculum.textbooks['grade-2/term-2/math']?.edition).toBeNull();
  });

  it('marks only the fully checked fallback books as verified', () => {
    expect(Object.keys(curriculum.textbooks)).toHaveLength(6);
    expect(curriculum.textbooks['grade-2/term-1/chinese']?.verificationStatus).toBe('verified');
    expect(curriculum.textbooks['grade-2/term-2/chinese']?.verificationStatus).toBe('verified');
    expect(curriculum.textbooks['grade-2/term-1/math']?.verificationStatus).toBe('verified');
    expect(curriculum.textbooks['grade-2/term-2/math']?.verificationStatus).toBe('verified');
    expect(Object.entries(curriculum.textbooks).filter(([id]) => !id.endsWith('/chinese') && id !== 'grade-2/term-1/math' && id !== 'grade-2/term-2/math')
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

  it('creates achievement positions for both verified Chinese terms and upper math units', () => {
    expect(getKnownCurriculumPositions().map(({ key }) => key)).toEqual(
      [
        ...term1ChineseUnits,
        ...term1MathEntries.filter(([, , type]) => type === 'unit'),
        ...term2ChineseUnits,
        ...term2MathEntries.filter(([, , type]) => type === 'unit'),
      ].map(([unitKey]) => unitKey),
    );
  });

  it('keeps basic tasks under full canonical IDs for existing curriculum entries', () => {
    const originalCounts = {
      'grade-2/term-1/chinese/unit-01': 3,
      'grade-2/term-1/chinese/unit-02': 3,
      'grade-2/term-1/math/unit-01': 2,
      'grade-2/term-1/math/unit-02': 2,
      'grade-2/term-2/math/unit-01': 2,
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
