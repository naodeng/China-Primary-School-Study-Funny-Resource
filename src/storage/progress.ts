export interface ProgressState {
  schemaVersion: 1;
  completedSessionIds: string[];
}

const STORAGE_KEY = 'china-study-progress-v1';
let memoryProgress: ProgressState = createEmptyProgress();

function createEmptyProgress(): ProgressState {
  return { schemaVersion: 1, completedSessionIds: [] };
}

function copyProgress(progress: ProgressState): ProgressState {
  return { schemaVersion: 1, completedSessionIds: [...progress.completedSessionIds] };
}

function parseProgress(value: unknown): ProgressState | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as { schemaVersion?: unknown; completedSessionIds?: unknown };
  if (candidate.schemaVersion !== 1 || !Array.isArray(candidate.completedSessionIds)) return null;
  const completedSessionIds = [...new Set(candidate.completedSessionIds.filter((id): id is string => typeof id === 'string' && id.trim().length > 0))];
  return { schemaVersion: 1, completedSessionIds };
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
    schemaVersion: 1,
    completedSessionIds: [...progress.completedSessionIds, sessionId],
  });
}
