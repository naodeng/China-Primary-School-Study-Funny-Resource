import { curriculum } from '../content/curriculum';
import { getSessionsForDifficulty } from '../content/sessionUtils';
import { getAssumedCompletedSessionIds, getRegisteredLearningPositions } from '../achievements/position';
import type { LearningPosition } from '../achievements/position';

export interface ProgressState {
  schemaVersion: 3;
  completedSessionIds: string[];
  learningStart: LearningPosition | null;
}

const STORAGE_KEY = 'china-study-progress-v1';
let memoryProgress: ProgressState = createEmptyProgress();

function createEmptyProgress(): ProgressState {
  return { schemaVersion: 3, completedSessionIds: [], learningStart: null };
}

function copyProgress(progress: ProgressState): ProgressState {
  return {
    schemaVersion: 3,
    completedSessionIds: [...progress.completedSessionIds],
    learningStart: progress.learningStart ? { ...progress.learningStart } : null,
  };
}

function getCurrentSessionIds(): Set<string> {
  return new Set(Object.values(curriculum.units).flatMap((unit) => (
    (['basic', 'advanced', 'high'] as const).flatMap((difficulty) => getSessionsForDifficulty(unit, difficulty).map((session) => session.id))
  )));
}

function parseLearningStart(value: unknown): LearningPosition | null {
  if (value === null || value === undefined) return null;
  if (!value || typeof value !== 'object') return null;
  const position = value as { grade?: unknown; term?: unknown; unit?: unknown };
  if (!Number.isInteger(position.grade) || Number(position.grade) < 1 || Number(position.grade) > 6
    || (position.term !== 1 && position.term !== 2)
    || !Number.isSafeInteger(position.unit) || Number(position.unit) < 1) return null;
  return { grade: Number(position.grade), term: position.term, unit: Number(position.unit) };
}

function parseProgress(value: unknown): ProgressState | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as {
    schemaVersion?: unknown;
    completedSessionIds?: unknown;
    learningStart?: unknown;
  };
  if ((candidate.schemaVersion !== 1 && candidate.schemaVersion !== 2 && candidate.schemaVersion !== 3)
    || !Array.isArray(candidate.completedSessionIds)) return null;

  const currentSessionIds = getCurrentSessionIds();
  const completedSessionIds = [...new Set(candidate.completedSessionIds.filter((id): id is string => (
    typeof id === 'string' && currentSessionIds.has(id)
  )))];
  const learningStart = parseLearningStart(candidate.learningStart);
  if (candidate.learningStart !== null && candidate.learningStart !== undefined && learningStart === null) return null;

  return { schemaVersion: 3, completedSessionIds, learningStart };
}

export function loadProgress(): ProgressState {
  try {
    if (typeof window === 'undefined') return copyProgress(memoryProgress);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return copyProgress(memoryProgress);
    const parsed = parseProgress(JSON.parse(raw) as unknown);
    if (!parsed) {
      memoryProgress = createEmptyProgress();
      window.localStorage.removeItem(STORAGE_KEY);
      return copyProgress(memoryProgress);
    }
    memoryProgress = parsed;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    return copyProgress(memoryProgress);
  } catch {
    return copyProgress(memoryProgress);
  }
}

export function saveProgress(progress: ProgressState): ProgressState {
  const normalized = parseProgress(progress) ?? createEmptyProgress();
  memoryProgress = normalized;
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // Keep this session's progress in memory when browser storage is unavailable.
  }
  return copyProgress(memoryProgress);
}

export function completeSession(progress: ProgressState, sessionId: string): ProgressState {
  if (!sessionId.trim() || progress.completedSessionIds.includes(sessionId)) return saveProgress(progress);
  return saveProgress({
    schemaVersion: 3,
    completedSessionIds: [...progress.completedSessionIds, sessionId],
    learningStart: progress.learningStart,
  });
}

export function setLearningStart(startAt: LearningPosition): ProgressState {
  const isRegistered = getRegisteredLearningPositions().some((position) => (
    position.grade === startAt.grade && position.term === startAt.term && position.unit === startAt.unit
  ));
  if (!isRegistered) return loadProgress();
  return saveProgress({ schemaVersion: 3, completedSessionIds: getAssumedCompletedSessionIds(startAt), learningStart: startAt });
}
