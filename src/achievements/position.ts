import { curriculum } from '../content/curriculum';
import { getSessionsForDifficulty } from '../content/sessionUtils';
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

export function getKnownCurriculumPositions(): KnownCurriculumPosition[] {
  return curriculum.grades.flatMap((grade) => grade.terms.flatMap((term) => term.subjects.flatMap((subject) => {
    return subject.units
      .filter((entry) => entry.status === 'active' && entry.curriculumUnitKey)
      .map((entry) => ({
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
    .flatMap((position) => {
      const unit = curriculum.units[position.curriculumUnitKey!];
      return unit ? getSessionsForDifficulty(unit, 'basic').map((session) => session.id) : [];
    });
}

export function getEffectiveCompletedSessionIds(completedSessionIds: string[], startAt?: LearningPosition | null): string[] {
  return [...new Set([...completedSessionIds, ...getAssumedCompletedSessionIds(startAt)])];
}
