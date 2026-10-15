import { describe, expect, it, vi } from 'vitest';
import { curriculum } from '../content/curriculum';
import * as unitLoader from '../content/unitLoader';
import type { Curriculum } from '../content/types';
import { getSessionPath, getSubjectTitle, getTaskPath, resolveAppRoute, resolveRoute } from './router';

const unitKey = 'grade-2/term-1/chinese/unit-01';

function createPlayableCurriculum(): Curriculum {
  const copy = structuredClone(curriculum);
  const entry = copy.grades.find((grade) => grade.id === 'grade-2')!.terms[0].subjects.find((subject) => subject.id === 'chinese')!.units[0];
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
    expect(resolveRoute('/achievements', instance)).toEqual({ kind: 'achievements' });
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

  it('rejectsMalformedCoursePathLengthsAndIdentifiers', () => {
    const instance = createPlayableCurriculum();
    expect(resolveRoute('/grade-2', instance).kind).toBe('notFound');
    expect(resolveRoute('/grade-x/term-1/chinese/unit-01', instance).kind).toBe('notFound');
    expect(resolveRoute('/grade-2/term-x/chinese/unit-01', instance).kind).toBe('notFound');
    expect(resolveRoute('/grade-2/term-1/chinese/Unit-01', instance).kind).toBe('notFound');
  });

  it('rejectsMissingCurriculumAndLegacySessionLinks', () => {
    const instance = createPlayableCurriculum();
    expect(resolveRoute(`/${unitKey}/invalid`, instance).kind).toBe('notFound');
    expect(resolveRoute(`/${unitKey}/session-99`, instance).kind).toBe('notFound');

    const entry = instance.grades.find((grade) => grade.id === 'grade-2')!.terms[0].subjects.find((subject) => subject.id === 'chinese')!.units[0];
    entry.curriculumUnitKey = `${unitKey}/missing`;
    expect(resolveRoute(`/${unitKey}`, instance).kind).toBe('notFound');
  });

  it('usesTheUnitKeyFallbackWhenAnEntryDoesNotSetItsCurriculumKey', () => {
    const instance = createPlayableCurriculum();
    const entry = instance.grades.find((grade) => grade.id === 'grade-2')!.terms[0].subjects.find((subject) => subject.id === 'chinese')!.units[0];
    entry.curriculumUnitKey = undefined;

    expect(resolveRoute(`/${unitKey}`, instance).kind).toBe('unit');
  });

  it('returnsTheLocalizedTitleForEverySubject', () => {
    expect(getSubjectTitle('chinese')).toBe('语文');
    expect(getSubjectTitle('math')).toBe('数学');
    expect(getSubjectTitle('english')).toBe('英语');
  });

  it('distinguishesComingSoonFromUnknownCourses', async () => {
    expect((await resolveAppRoute('/grade-2/term-1/math/unit-01')).kind).toBe('unit');
    expect((await resolveAppRoute('/grade-2/term-1/math/unit-99')).kind).toBe('notFound');
    expect((await resolveAppRoute('/grade-2/term-1/math/integrated-practice-01')).kind).toBe('unit');
    expect((await resolveAppRoute('/grade-2/term-1/english/unit-01')).kind).toBe('unit');
    expect((await resolveAppRoute('/grade-2/term-1/english/review-01')).kind).toBe('unit');
    expect((await resolveAppRoute('/grade-2/term-2/chinese/unit-01')).kind).toBe('unit');
    expect((await resolveAppRoute('/grade-2/term-2/chinese/unit-99')).kind).toBe('notFound');
    expect((await resolveAppRoute('/grade-2/term-2/math/unit-01')).kind).toBe('unit');
    expect((await resolveAppRoute('/grade-2/term-2/math/unit-10')).kind).toBe('unit');
    expect((await resolveAppRoute('/grade-2/term-2/math/integrated-practice-01')).kind).toBe('unit');
    expect((await resolveAppRoute('/grade-2/term-2/english/unit-01')).kind).toBe('unit');
    expect((await resolveAppRoute('/grade-2/term-2/english/review-01')).kind).toBe('unit');
  });

  it('doesNotOpenAnActiveCatalogEntryWithAnUnverifiedEdition', () => {
    const copy = structuredClone(curriculum);
    const entry = copy.grades.find((grade) => grade.id === 'grade-2')!.terms[0].subjects.find((subject) => subject.id === 'math')!.units[0];
    entry.status = 'active';
    copy.textbooks[entry.textbookEditionId].verificationStatus = 'pending';

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

describe('asynchronous curriculum routes', () => {
  it('loads a directly opened course session from its unit module', async () => {
    const unitKey = 'grade-2/term-1/chinese/unit-01';
    const route = await resolveAppRoute(`/${unitKey}/basic/task-01/session-01`);

    expect(route).toMatchObject({
      kind: 'session',
      unitKey,
      difficulty: 'basic',
      task: { id: `${unitKey}/basic/task-01` },
      session: { id: `${unitKey}/basic/task-01/session-01` },
    });
  });

  it('keeps unknown unit URLs as not-found routes without loading course data', async () => {
    await expect(resolveAppRoute('/grade-2/term-1/chinese/unit-99')).resolves.toMatchObject({ kind: 'notFound' });
  });

  it('returns a recoverable load error when a unit module fails to load', async () => {
    vi.spyOn(unitLoader, 'loadUnit').mockRejectedValueOnce(new Error('module unavailable'));

    await expect(resolveAppRoute('/grade-2/term-1/chinese/unit-01')).resolves.toEqual({
      kind: 'loadError',
      path: '/grade-2/term-1/chinese/unit-01',
    });
  });

  it('returns not found when a registered unit module resolves without a unit', async () => {
    vi.spyOn(unitLoader, 'loadUnit').mockResolvedValueOnce(undefined);

    await expect(resolveAppRoute('/grade-2/term-1/chinese/unit-01')).resolves.toEqual({
      kind: 'notFound',
      path: '/grade-2/term-1/chinese/unit-01',
    });
  });
});
