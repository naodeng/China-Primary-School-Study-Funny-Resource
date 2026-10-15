import { curriculumManifest } from '../content/curriculumManifest';
import { loadUnit } from '../content/unitLoader';
import { getSessionsForDifficulty } from '../content/sessionUtils';
import type { Curriculum, CurriculumUnit, Difficulty, LearningSession, LearningTask, SubjectId } from '../content/types';

export type AppRoute =
  | { kind: 'catalog' }
  | { kind: 'achievements' }
  | { kind: 'loading'; path: string; unitKey: string; curriculumUnitKey: string }
  | { kind: 'loadError'; path: string }
  | { kind: 'unit'; unitKey: string; unit: CurriculumUnit }
  | { kind: 'task'; unitKey: string; unit: CurriculumUnit; difficulty: Difficulty; task: LearningTask }
  | { kind: 'session'; unitKey: string; unit: CurriculumUnit; difficulty: Difficulty; task: LearningTask; session: LearningSession }
  | { kind: 'comingSoon'; title: string; path: string }
  | { kind: 'notFound'; path: string };

const DIFFICULTIES: readonly Difficulty[] = ['basic', 'advanced', 'high'];
type CurriculumCatalog = Pick<Curriculum, 'grades' | 'textbooks'>;

function lastPathSegment(id: string): string {
  return id.slice(id.lastIndexOf('/') + 1);
}

export function getUnitPath(unitKey: string): string {
  return `/${unitKey}`;
}

export function getTaskPath(unitKey: string, difficulty: Difficulty, taskId: string): string {
  return `/${unitKey}/${difficulty}/${lastPathSegment(taskId)}`;
}

export function getSessionPath(unitKey: string, difficulty: Difficulty, taskId: string, sessionId: string): string {
  return `${getTaskPath(unitKey, difficulty, taskId)}/${lastPathSegment(sessionId)}`;
}

function findCatalogUnit(instance: CurriculumCatalog, key: string) {
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

function findTask(unit: CurriculumUnit, difficulty: Difficulty, slug: string): LearningTask | undefined {
  const canonicalId = `${unit.id}/${difficulty}/${slug}`;
  return unit.difficultyTracks[difficulty].tasks.find((task) => task.id === canonicalId);
}

function findSession(task: LearningTask, slug: string): LearningSession | undefined {
  const canonicalId = `${task.id}/${slug}`;
  return task.sessions.find((session) => session.id === canonicalId);
}

function mapLegacySession(unit: CurriculumUnit, unitKey: string, legacySessionSlug: string): AppRoute {
  if (!/^session-\d{2}$/.test(legacySessionSlug)) return { kind: 'notFound', path: `/${unitKey}/${legacySessionSlug}` };
  const index = Number(legacySessionSlug.slice('session-'.length)) - 1;
  const session = getSessionsForDifficulty(unit, 'basic')[index];
  const task = session && unit.difficultyTracks.basic.tasks.find((candidate) => candidate.sessions.includes(session));
  return session && task
    ? { kind: 'session', unitKey, unit, difficulty: 'basic', task, session }
    : { kind: 'notFound', path: `/${unitKey}/${legacySessionSlug}` };
}

export function resolveRoute(pathname: string, instance?: Curriculum, loadedUnit?: CurriculumUnit): AppRoute {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (normalized === '/') return { kind: 'catalog' };
  if (normalized === '/achievements') return { kind: 'achievements' };

  const segments = normalized.split('/').filter(Boolean);
  if (segments.length !== 4 && segments.length !== 5 && segments.length !== 6 && segments.length !== 7) {
    return { kind: 'notFound', path: normalized };
  }

  const [gradeId, termId, subjectId, unitId] = segments;
  if (!/^grade-\d+$/.test(gradeId) || !/^term-\d+$/.test(termId) || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(unitId)) {
    return { kind: 'notFound', path: normalized };
  }
  if (subjectId !== 'chinese' && subjectId !== 'math' && subjectId !== 'english') {
    return { kind: 'notFound', path: normalized };
  }

  const unitKey = `${gradeId}/${termId}/${subjectId}/${unitId}`;
  const catalog = instance ?? curriculumManifest;
  const catalogUnit = findCatalogUnit(catalog, unitKey);
  if (!catalogUnit) return { kind: 'notFound', path: normalized };
  const textbook = catalog.textbooks[catalogUnit.textbookEditionId];
  if (catalogUnit.status !== 'active' || textbook?.verificationStatus !== 'verified') {
    return { kind: 'comingSoon', title: catalogUnit.title, path: normalized };
  }

  const curriculumUnitKey = catalogUnit.curriculumUnitKey ?? unitKey;
  const unit = loadedUnit ?? instance?.units[curriculumUnitKey];
  if (!unit && !instance) return { kind: 'loading', path: normalized, unitKey, curriculumUnitKey };
  if (!unit) return { kind: 'notFound', path: normalized };
  if (segments.length === 4) return { kind: 'unit', unitKey, unit };
  if (segments.length === 5) return mapLegacySession(unit, unitKey, segments[4]);

  const difficultySlug = segments[4];
  if (!DIFFICULTIES.includes(difficultySlug as Difficulty)) return { kind: 'notFound', path: normalized };
  const difficulty = difficultySlug as Difficulty;
  const task = findTask(unit, difficulty, segments[5]);
  if (!task) return { kind: 'notFound', path: normalized };
  if (segments.length === 6) return { kind: 'task', unitKey, unit, difficulty, task };

  const session = findSession(task, segments[6]);
  return session
    ? { kind: 'session', unitKey, unit, difficulty, task, session }
    : { kind: 'notFound', path: normalized };
}

export async function resolveAppRoute(pathname: string): Promise<AppRoute> {
  const initialRoute = resolveRoute(pathname);
  if (initialRoute.kind !== 'loading') return initialRoute;
  try {
    const unit = await loadUnit(initialRoute.curriculumUnitKey);
    if (!unit) return { kind: 'notFound', path: initialRoute.path };
    return resolveRoute(pathname, undefined, unit);
  } catch {
    return { kind: 'loadError', path: initialRoute.path };
  }
}

export function getSubjectTitle(subject: SubjectId): string {
  if (subject === 'chinese') return '语文';
  if (subject === 'math') return '数学';
  return '英语';
}
