import { getAssumedCompletedSessionIds } from '../achievements/position';
import type { LearningPosition } from '../achievements/position';

export interface ProgressState {
  schemaVersion: 2;
  completedSessionIds: string[];
  learningStart: LearningPosition | null;
}

const STORAGE_KEY = 'china-study-progress-v1';
let memoryProgress: ProgressState = createEmptyProgress();

function createEmptyProgress(): ProgressState {
  return { schemaVersion: 2, completedSessionIds: [], learningStart: null };
}

function copyProgress(progress: ProgressState): ProgressState {
  return {
    schemaVersion: 2,
    completedSessionIds: [...progress.completedSessionIds],
    learningStart: progress.learningStart ? { ...progress.learningStart } : null,
  };
}

function parseProgress(value: unknown): ProgressState | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as { schemaVersion?: unknown; completedSessionIds?: unknown; learningStart?: unknown };
  if ((candidate.schemaVersion !== 1 && candidate.schemaVersion !== 2) || !Array.isArray(candidate.completedSessionIds)) return null;
  const completedSessionIds = [...new Set(candidate.completedSessionIds.filter((id): id is string => typeof id === 'string' && id.trim().length > 0))];
  let learningStart: LearningPosition | null = null;
  if (candidate.schemaVersion === 2 && candidate.learningStart !== null && candidate.learningStart !== undefined) {
    if (!candidate.learningStart || typeof candidate.learningStart !== 'object') return null;
    const position = candidate.learningStart as { grade?: unknown; term?: unknown; unit?: unknown };
    if (!Number.isInteger(position.grade) || Number(position.grade) < 1 || Number(position.grade) > 6
      || (position.term !== 1 && position.term !== 2)
      || !Number.isInteger(position.unit) || Number(position.unit) < 1) return null;
    learningStart = { grade: Number(position.grade), term: position.term, unit: Number(position.unit) };
  }
  return { schemaVersion: 2, completedSessionIds, learningStart };
}

export function loadProgress(): ProgressState {
  try {
    if (typeof window === 'undefined') return copyProgress(memoryProgress);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return copyProgress(memoryProgress);
    const parsed = parseProgress(JSON.parse(raw) as unknown);
    if (!parsed) {
      memoryProgress = createEmptyProgress();
      return copyProgress(memoryProgress);
    }
    memoryProgress = parsed;
    return copyProgress(memoryProgress);
  } catch {
    return copyProgress(memoryProgress);
  }
}

export function saveProgress(progress: ProgressState): ProgressState {
  const normalized = parseProgress(progress) ?? createEmptyProgress();
  memoryProgress = normalized;
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
  } catch {
    // Keep this session's progress in memory when browser storage is unavailable.
  }
  return copyProgress(memoryProgress);
}

export function completeSession(progress: ProgressState, sessionId: string): ProgressState {
  if (!sessionId.trim() || progress.completedSessionIds.includes(sessionId)) {
    return saveProgress(progress);
  }
  return saveProgress({
    schemaVersion: 2,
    completedSessionIds: [...progress.completedSessionIds, sessionId],
    learningStart: progress.learningStart,
  });
}

export function setLearningStart(startAt: LearningPosition): ProgressState {
  const completedSessionIds = getAssumedCompletedSessionIds(startAt);

  return saveProgress({ schemaVersion: 2, completedSessionIds, learningStart: startAt });
}
