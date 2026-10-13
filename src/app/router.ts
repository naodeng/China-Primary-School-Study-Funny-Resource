import { curriculum } from '../content/curriculum';
import type { Curriculum, CurriculumUnit, LearningSession, SubjectId } from '../content/types';

export type AppRoute =
  | { kind: 'catalog' }
  | { kind: 'achievements' }
  | { kind: 'unit'; unitKey: string; unit: CurriculumUnit }
  | { kind: 'session'; unitKey: string; unit: CurriculumUnit; session: LearningSession }
  | { kind: 'comingSoon'; title: string; path: string }
  | { kind: 'notFound'; path: string };

export function getUnitPath(unitKey: string): string {
  return `/${unitKey}`;
}

export function getSessionPath(unitKey: string, sessionNumber: number): string {
  return `/${unitKey}/session-${String(sessionNumber).padStart(2, '0')}`;
}

function findCatalogUnit(instance: Curriculum, key: string) {
  for (const grade of instance.grades) {
    for (const term of grade.terms) {
      for (const subject of term.subjects) {
        for (const unit of subject.units) {
          const candidate = `${grade.id}/${term.id}/${subject.id}/${unit.id}`;
          if (candidate === key) return unit;
        }
      }
    }
  }
  return undefined;
}

export function resolveRoute(pathname: string, instance: Curriculum = curriculum): AppRoute {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (normalized === '/') return { kind: 'catalog' };
  if (normalized === '/achievements') return { kind: 'achievements' };

  const segments = normalized.split('/').filter(Boolean);
  if (segments.length !== 4 && segments.length !== 5) {
    return { kind: 'notFound', path: normalized };
  }

  const [gradeId, termId, subjectId, unitId, sessionId] = segments;
  if (!/^grade-\d+$/.test(gradeId) || !/^term-[12]$/.test(termId) || !/^unit-\d{2}$/.test(unitId)) {
    return { kind: 'notFound', path: normalized };
  }
  if (subjectId !== 'chinese' && subjectId !== 'math') {
    return { kind: 'notFound', path: normalized };
  }

  const unitKey = `${gradeId}/${termId}/${subjectId}/${unitId}`;
  const catalogUnit = findCatalogUnit(instance, unitKey);
  if (!catalogUnit) return { kind: 'notFound', path: normalized };
  if (catalogUnit.status === 'comingSoon') {
    return { kind: 'comingSoon', title: catalogUnit.title, path: normalized };
  }

  const unit = instance.units[catalogUnit.curriculumUnitKey ?? unitKey];
  if (!unit) return { kind: 'notFound', path: normalized };
  if (!sessionId) return { kind: 'unit', unitKey, unit };

  if (!/^session-\d{2}$/.test(sessionId)) return { kind: 'notFound', path: normalized };
  const session = unit.sessions.find((candidate) => candidate.id.endsWith(`/${sessionId}`));
  return session ? { kind: 'session', unitKey, unit, session } : { kind: 'notFound', path: normalized };
}

export function getSubjectTitle(subject: SubjectId): string {
  return subject === 'chinese' ? '语文' : '数学';
}
