import { describe, expect, it } from 'vitest';
import { curriculum } from '../content/curriculum';
import type { Curriculum } from '../content/types';
import { getSessionPath, getTaskPath, resolveRoute } from './router';

const unitKey = 'grade-2/term-1/chinese/unit-01';

function createPlayableCurriculum(): Curriculum {
  const copy = structuredClone(curriculum);
  const entry = copy.grades[0].terms[0].subjects.find((subject) => subject.id === 'chinese')!.units[0];
  entry.status = 'active';
  copy.textbooks[entry.textbookEditionId].verificationStatus = 'verified';
  return copy;
}

describe('router', () => {
  it('getTaskPathAndSessionPathUseCanonicalIds', () => {
    const taskId = `${unitKey}/basic/task-01`;
    const sessionId = `${taskId}/session-01`;

    expect(getTaskPath(unitKey, 'basic', taskId)).toBe(`/${unitKey}/basic/task-01`);
    expect(getSessionPath(unitKey, 'basic', taskId, sessionId)).toBe(`/${unitKey}/basic/task-01/session-01`);
  });

  it('resolvesCatalogUnitTaskAndSessionRoutes', () => {
    const instance = createPlayableCurriculum();
    const taskPath = `/${unitKey}/basic/task-01`;
    const sessionPath = `${taskPath}/session-01`;

    expect(resolveRoute('/', instance)).toEqual({ kind: 'catalog' });
    expect(resolveRoute(`/${unitKey}`, instance)).toMatchObject({ kind: 'unit', unitKey });
    expect(resolveRoute(taskPath, instance)).toMatchObject({
      kind: 'task',
      unitKey,
      difficulty: 'basic',
      task: { id: `${unitKey}/basic/task-01` },
    });
    expect(resolveRoute(sessionPath, instance)).toMatchObject({
      kind: 'session',
      unitKey,
      difficulty: 'basic',
      task: { id: `${unitKey}/basic/task-01` },
      session: { id: `${unitKey}/basic/task-01/session-01` },
    });
  });

  it('rejectsUnknownSubjectsAndMalformedNestedSlugs', () => {
    const instance = createPlayableCurriculum();

    expect(resolveRoute('/grade-2/term-1/science/unit-01', instance).kind).toBe('notFound');
    expect(resolveRoute(`/${unitKey}/expert/task-01`, instance).kind).toBe('notFound');
    expect(resolveRoute(`/${unitKey}/basic/task-one`, instance).kind).toBe('notFound');
    expect(resolveRoute(`/${unitKey}/basic/task-01/session-one`, instance).kind).toBe('notFound');
    expect(resolveRoute('/grade-2/term-1/chinese/unit-99', instance).kind).toBe('notFound');
  });

  it('distinguishesComingSoonFromUnknownCourses', () => {
    expect(resolveRoute('/grade-2/term-1/math/unit-01').kind).toBe('comingSoon');
    expect(resolveRoute('/grade-2/term-2/chinese/unit-01').kind).toBe('notFound');
  });

  it('doesNotOpenAnActiveCatalogEntryWithAnUnverifiedEdition', () => {
    const copy = structuredClone(curriculum);
    const entry = copy.grades[0].terms[0].subjects.find((subject) => subject.id === 'math')!.units[0];
    entry.status = 'active';

    expect(resolveRoute('/grade-2/term-1/math/unit-01', copy).kind).toBe('comingSoon');
  });

  it('mapsLegacySessionLinksToTheirOrdinalBasicSession', () => {
    const route = resolveRoute(`/${unitKey}/session-02`, createPlayableCurriculum());

    expect(route).toMatchObject({
      kind: 'session',
      difficulty: 'basic',
      task: { id: `${unitKey}/basic/task-02` },
      session: { id: `${unitKey}/basic/task-02/session-01` },
    });
  });
});
