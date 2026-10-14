import { describe, expect, it } from 'vitest';
import { curriculum } from '../content/curriculum';
import { getSessionsForDifficulty } from '../content/sessionUtils';
import { getEffectiveCompletedSessionIds, getRegisteredCurriculumPositions, getRegisteredLearningPositions, isBeforeLearningPosition } from './position';

describe('curriculum positions', () => {
  it('registersFormalUnitPositionsWithoutInventingMissingGrades', () => {
    expect(getRegisteredLearningPositions()).toEqual([{ grade: 2, term: 1, unit: 1 }, { grade: 2, term: 1, unit: 2 }]);
    expect(getRegisteredCurriculumPositions().every((position) => position.status === 'comingSoon')).toBe(true);
  });

  it('mapsSecondTermPositionsWhenTheyAreRegistered', () => {
    const source = structuredClone(curriculum);
    const term2 = structuredClone(source.grades[0].terms[0]);
    term2.id = 'term-2';
    term2.title = '下学期';
    source.grades[0].terms.push(term2);

    expect(getRegisteredCurriculumPositions(source).filter((position) => position.term === 2).map((position) => position.unit)).toEqual([1, 2, 1, 2]);
    expect(getRegisteredLearningPositions(source)).toContainEqual({ grade: 2, term: 2, unit: 1 });
  });

  it('ignoresReviewIneligibleUnnumberedAndUnlinkedEntries', () => {
    const source = structuredClone(curriculum);
    const chinese = source.grades[0].terms[0].subjects.find((subject) => subject.id === 'chinese')!;
    chinese.units.push(
      { id: 'review-01', title: '复习', status: 'comingSoon', type: 'review', formalUnitNumber: null, achievementEligible: false, textbookEditionId: 'grade-2/term-1/chinese' },
      { id: 'unit-91', title: '非成就单元', status: 'comingSoon', type: 'unit', formalUnitNumber: 91, achievementEligible: false, textbookEditionId: 'grade-2/term-1/chinese', curriculumUnitKey: 'grade-2/term-1/chinese/unit-01' },
      { id: 'unit-92', title: '无正式编号', status: 'comingSoon', type: 'unit', formalUnitNumber: null, achievementEligible: true, textbookEditionId: 'grade-2/term-1/chinese', curriculumUnitKey: 'grade-2/term-1/chinese/unit-01' },
      { id: 'unit-93', title: '无课程内容', status: 'comingSoon', type: 'unit', formalUnitNumber: 93, achievementEligible: true, textbookEditionId: 'grade-2/term-1/chinese', curriculumUnitKey: 'missing/unit' },
    );

    expect(getRegisteredCurriculumPositions(source)).toHaveLength(4);
  });

  it('comparesGradeTermAndUnitOrdering', () => {
    const start = { grade: 2, term: 2 as const, unit: 3 };
    expect(isBeforeLearningPosition({ grade: 1, term: 2, unit: 9 }, start)).toBe(true);
    expect(isBeforeLearningPosition({ grade: 2, term: 1, unit: 9 }, start)).toBe(true);
    expect(isBeforeLearningPosition({ grade: 2, term: 2, unit: 2 }, start)).toBe(true);
    expect(isBeforeLearningPosition(start, start)).toBe(false);
    expect(isBeforeLearningPosition({ grade: 3, term: 1, unit: 1 }, start)).toBe(false);
  });

  it('addsEarlierRegisteredSessionsWithoutDuplicates', () => {
    const start = { grade: 2, term: 1 as const, unit: 2 };
    const earlier = [
      ...getSessionsForDifficulty(curriculum.units['grade-2/term-1/chinese/unit-01'], 'basic'),
      ...getSessionsForDifficulty(curriculum.units['grade-2/term-1/math/unit-01'], 'basic'),
    ].map((session) => session.id);
    const effective = getEffectiveCompletedSessionIds([earlier[0], 'manual-session'], start);

    expect(effective).toEqual([...new Set([earlier[0], 'manual-session', ...earlier])]);
    expect(getEffectiveCompletedSessionIds(earlier, null)).toEqual(earlier);
  });
});
