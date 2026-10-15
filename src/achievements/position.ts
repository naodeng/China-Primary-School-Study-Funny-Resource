import { curriculumManifest, getUnitManifest } from '../content/curriculumManifest';
import type { CurriculumProgressSource } from '../content/curriculumManifest';
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
  textbookEditionId: string;
  curriculumUnitKey?: string;
  status: CatalogStatus;
}

export function getRegisteredCurriculumPositions(source: CurriculumProgressSource = curriculumManifest): KnownCurriculumPosition[] {
  return source.grades.flatMap((grade) => grade.terms.flatMap((term) => term.subjects.flatMap((subject) => (
    subject.units
      .filter((entry) => entry.type === 'unit'
        && entry.achievementEligible
        && entry.formalUnitNumber !== null
        && entry.curriculumUnitKey
        && getUnitManifest(entry.curriculumUnitKey, source))
      .map((entry) => ({
        grade: Number(grade.id.slice('grade-'.length)),
        term: term.id === 'term-1' ? 1 : 2,
        unit: entry.formalUnitNumber!,
        key: `${grade.id}/${term.id}/${subject.id}/${entry.id}`,
        gradeId: grade.id,
        termId: term.id,
        subject: subject.id,
        subjectTitle: subject.title,
        title: entry.title,
        textbookEditionId: entry.textbookEditionId,
        curriculumUnitKey: entry.curriculumUnitKey,
        status: entry.status,
      } satisfies KnownCurriculumPosition))
  ))));
}

export function getRegisteredLearningPositions(source: CurriculumProgressSource = curriculumManifest): LearningPosition[] {
  const unique = new Map<string, LearningPosition>();
  for (const entry of getRegisteredCurriculumPositions(source)) {
    const { grade, term, unit } = entry;
    unique.set(`${grade}-${term}-${unit}`, { grade, term, unit });
  }
  return [...unique.values()].sort((left, right) => left.grade - right.grade || left.term - right.term || left.unit - right.unit);
}

export function getKnownCurriculumPositions(source: CurriculumProgressSource = curriculumManifest): KnownCurriculumPosition[] {
  return getRegisteredCurriculumPositions(source).filter((position) => position.status === 'active'
    && position.curriculumUnitKey
    && source.textbooks[position.textbookEditionId]?.verificationStatus === 'verified');
}

export function isBeforeLearningPosition(position: LearningPosition, startAt: LearningPosition): boolean {
  if (position.grade !== startAt.grade) return position.grade < startAt.grade;
  if (position.term !== startAt.term) return position.term < startAt.term;
  return position.unit < startAt.unit;
}

export function getAssumedCompletedSessionIds(startAt?: LearningPosition | null, source: CurriculumProgressSource = curriculumManifest): string[] {
  if (!startAt) return [];
  return getRegisteredCurriculumPositions(source)
    .filter((position) => isBeforeLearningPosition(position, startAt))
    .flatMap((position) => {
      // Registered positions are filtered through getUnitManifest above.
      return getUnitManifest(position.curriculumUnitKey!, source)!.sessionIds.basic;
    });
}

export function getEffectiveCompletedSessionIds(completedSessionIds: string[], startAt?: LearningPosition | null, source: CurriculumProgressSource = curriculumManifest): string[] {
  return [...new Set([...completedSessionIds, ...getAssumedCompletedSessionIds(startAt, source)])];
}
