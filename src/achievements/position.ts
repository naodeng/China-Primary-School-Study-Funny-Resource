import { curriculum } from '../content/curriculum';
import type { CatalogStatus, SubjectId } from '../content/types';

export interface LearningPosition {
  grade: number;
  term: 1 | 2;
  unit: number;
}

export interface KnownCurriculumPosition extends LearningPosition {
  key: string;
  gradeId: string;
  termId: string;
  subject: SubjectId;
  subjectTitle: string;
  title: string;
  curriculumUnitKey?: string;
  status: CatalogStatus | 'planned';
}

const GRADE_TWO_TERM_ONE_OUTLINES: Record<SubjectId, string[]> = {
  chinese: [
    '第一单元 · 阅读',
    '第二单元 · 识字',
    '第三单元 · 阅读',
    '第四单元 · 阅读',
    '第五单元 · 阅读',
    '第六单元 · 阅读',
    '第七单元 · 阅读',
    '第八单元 · 阅读',
  ],
  math: [
    '第一单元 · 长度单位',
    '第二单元 · 100以内的加法和减法（二）',
    '第三单元 · 角的初步认识',
    '第四单元 · 表内乘法（一）',
    '第五单元 · 观察物体（一）',
    '第六单元 · 表内乘法（二）',
    '第七单元 · 认识时间',
    '第八单元 · 数学广角——搭配（一）',
    '第九单元 · 总复习',
  ],
};

export function getKnownCurriculumPositions(): KnownCurriculumPosition[] {
  return curriculum.grades.flatMap((grade) => grade.terms.flatMap((term) => term.subjects.flatMap((subject) => {
    if (grade.id === 'grade-2' && term.id === 'term-1') {
      return GRADE_TWO_TERM_ONE_OUTLINES[subject.id].map((title, index) => {
        const unitNumber = index + 1;
        const unitId = `unit-${String(unitNumber).padStart(2, '0')}`;
        const entry = subject.units.find((candidate) => candidate.id === unitId);
        return {
          grade: 2,
          term: 1 as 1 | 2,
          unit: unitNumber,
          key: `${grade.id}/${term.id}/${subject.id}/${unitId}`,
          gradeId: grade.id,
          termId: term.id,
          subject: subject.id,
          subjectTitle: subject.title,
          title,
          curriculumUnitKey: entry?.curriculumUnitKey,
          status: entry?.status ?? 'planned',
        } satisfies KnownCurriculumPosition;
      });
    }

    return subject.units.map((entry) => ({
      grade: Number(grade.id.slice('grade-'.length)),
      term: term.id === 'term-1' ? 1 : 2,
      unit: Number(entry.id.slice('unit-'.length)),
      key: `${grade.id}/${term.id}/${subject.id}/${entry.id}`,
      gradeId: grade.id,
      termId: term.id,
      subject: subject.id,
      subjectTitle: subject.title,
      title: entry.title,
      curriculumUnitKey: entry.curriculumUnitKey,
      status: entry.status,
    } satisfies KnownCurriculumPosition));
  })));
}

export function isBeforeLearningPosition(position: LearningPosition, startAt: LearningPosition): boolean {
  if (position.grade !== startAt.grade) return position.grade < startAt.grade;
  if (position.term !== startAt.term) return position.term < startAt.term;
  return position.unit < startAt.unit;
}

export function getAssumedCompletedSessionIds(startAt?: LearningPosition | null): string[] {
  if (!startAt) return [];
  return getKnownCurriculumPositions()
    .filter((position) => position.curriculumUnitKey && isBeforeLearningPosition(position, startAt))
    .flatMap((position) => curriculum.units[position.curriculumUnitKey!]?.sessions.map((session) => session.id) ?? []);
}

export function getEffectiveCompletedSessionIds(completedSessionIds: string[], startAt?: LearningPosition | null): string[] {
  return [...new Set([...completedSessionIds, ...getAssumedCompletedSessionIds(startAt)])];
}
