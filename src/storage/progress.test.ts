import { beforeEach, describe, expect, it, vi } from 'vitest';
import { curriculum } from '../content/curriculum';
import { getSessionsForDifficulty } from '../content/sessionUtils';
import { completeSession, loadProgress, saveProgress, setLearningStart } from './progress';

const STORAGE_KEY = 'china-study-progress-v1';
const unit01 = curriculum.units['grade-2/term-1/chinese/unit-01'];
const unit02 = curriculum.units['grade-2/term-1/chinese/unit-02'];
const currentSessionId = getSessionsForDifficulty(unit01, 'basic')[0].id;
const laterSessionId = getSessionsForDifficulty(unit02, 'basic')[0].id;

describe('progress storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    saveProgress({ schemaVersion: 3, completedSessionIds: [], learningStart: null });
    window.localStorage.clear();
  });

  it('migratesV1AndV2PreservingStart', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      schemaVersion: 1,
      completedSessionIds: [currentSessionId, 'grade-2/term-1/chinese/unit-01/session-01'],
    }));

    expect(loadProgress()).toEqual({ schemaVersion: 3, completedSessionIds: [currentSessionId], learningStart: null });
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)!)).toMatchObject({ schemaVersion: 3 });

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      schemaVersion: 2,
      completedSessionIds: [currentSessionId],
      learningStart: { grade: 2, term: 1, unit: 2 },
    }));
    expect(loadProgress()).toEqual({
      schemaVersion: 3,
      completedSessionIds: [currentSessionId],
      learningStart: { grade: 2, term: 1, unit: 2 },
    });
  });

  it('ignoresLegacyCompletionsForNewSessions', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      schemaVersion: 2,
      completedSessionIds: ['grade-2/term-1/chinese/unit-01/session-01', currentSessionId],
      learningStart: null,
    }));

    expect(loadProgress().completedSessionIds).toEqual([currentSessionId]);
  });

  it('fallsBackOnCorruptOrUnavailableStorage', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not json');
    expect(loadProgress()).toEqual({ schemaVersion: 3, completedSessionIds: [], learningStart: null });

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 99, completedSessionIds: [] }));
    expect(loadProgress()).toEqual({ schemaVersion: 3, completedSessionIds: [], learningStart: null });
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      schemaVersion: 3,
      completedSessionIds: [currentSessionId],
      learningStart: { grade: 2, term: 1, unit: 0.5 },
    }));
    expect(loadProgress()).toEqual({ schemaVersion: 3, completedSessionIds: [], learningStart: null });

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      schemaVersion: 3,
      completedSessionIds: [],
      learningStart: { grade: 2, term: 1, unit: 0 },
    }));
    expect(loadProgress().learningStart).toBeNull();

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 3, completedSessionIds: [], learningStart: 'invalid' }));
    expect(loadProgress()).toEqual({ schemaVersion: 3, completedSessionIds: [], learningStart: null });

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      schemaVersion: 3,
      completedSessionIds: [],
      learningStart: { grade: 7, term: 1, unit: 1 },
    }));
    expect(loadProgress().learningStart).toBeNull();

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      schemaVersion: 3,
      completedSessionIds: [],
      learningStart: { grade: 2, term: 3, unit: 1 },
    }));
    expect(loadProgress().learningStart).toBeNull();

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 3, completedSessionIds: null }));
    expect(loadProgress()).toEqual({ schemaVersion: 3, completedSessionIds: [], learningStart: null });

    window.localStorage.setItem(STORAGE_KEY, 'null');
    expect(loadProgress()).toEqual({ schemaVersion: 3, completedSessionIds: [], learningStart: null });

    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('storage blocked'); });
    expect(loadProgress()).toEqual({ schemaVersion: 3, completedSessionIds: [], learningStart: null });
    getItem.mockRestore();
  });

  it('usesInMemoryProgressWhenStorageIsMissingOrUnavailable', () => {
    const expected = saveProgress({ schemaVersion: 3, completedSessionIds: [currentSessionId], learningStart: null });
    window.localStorage.clear();
    expect(loadProgress()).toEqual(expected);

    vi.stubGlobal('window', undefined);
    try {
      expect(loadProgress()).toEqual(expected);
      expect(saveProgress({ schemaVersion: 3, completedSessionIds: [], learningStart: null })).toEqual({
        schemaVersion: 3,
        completedSessionIds: [],
        learningStart: null,
      });
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('keepsSavedProgressInMemoryWhenStorageWritesFail', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('storage blocked'); });
    const next = saveProgress({ schemaVersion: 3, completedSessionIds: [currentSessionId], learningStart: null });
    expect(next.completedSessionIds).toEqual([currentSessionId]);
    setItem.mockRestore();
  });

  it('rejectsInvalidProgressShapesWhenSaving', () => {
    const invalid = saveProgress({ schemaVersion: 3, completedSessionIds: null, learningStart: null } as unknown as Parameters<typeof saveProgress>[0]);
    expect(invalid).toEqual({ schemaVersion: 3, completedSessionIds: [], learningStart: null });
  });

  it('completeSessionIsIdempotent', () => {
    const initial = { schemaVersion: 3 as const, completedSessionIds: [], learningStart: null };
    const once = completeSession(initial, currentSessionId);
    const twice = completeSession(once, currentSessionId);

    expect(twice.completedSessionIds).toEqual([currentSessionId]);
    expect(completeSession(twice, '   ').completedSessionIds).toEqual([currentSessionId]);
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)!)).toMatchObject({ completedSessionIds: [currentSessionId] });
  });

  it('setLearningStartReplacesLaterProgress', () => {
    saveProgress({ schemaVersion: 3, completedSessionIds: [laterSessionId], learningStart: null });

    const next = setLearningStart({ grade: 2, term: 1, unit: 2 });
    const expectedEarlierSessions = [
      ...getSessionsForDifficulty(curriculum.units['grade-2/term-1/chinese/unit-01'], 'basic'),
      ...getSessionsForDifficulty(curriculum.units['grade-2/term-1/math/unit-01'], 'basic'),
    ].map((session) => session.id);

    expect(next.learningStart).toEqual({ grade: 2, term: 1, unit: 2 });
    expect(next.completedSessionIds).toEqual(expect.arrayContaining(expectedEarlierSessions));
    expect(next.completedSessionIds).not.toContain(laterSessionId);

    const rejected = setLearningStart({ grade: 2, term: 1, unit: 99 });
    expect(rejected).toEqual(next);
  });
});
