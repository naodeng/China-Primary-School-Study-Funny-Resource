export interface SessionState {
  activityIds: readonly string[];
  currentIndex: number;
  solvedActivityIds: readonly string[];
  completed: boolean;
}

export function createSessionState(activityIds: readonly string[]): SessionState {
  return {
    activityIds: [...activityIds],
    currentIndex: 0,
    solvedActivityIds: [],
    completed: false,
  };
}

export function isCurrentActivitySolved(state: SessionState): boolean {
  const currentId = state.activityIds[state.currentIndex];
  return currentId !== undefined && state.solvedActivityIds.includes(currentId);
}

export function markCurrentActivitySolved(state: SessionState, activityId: string): SessionState {
  if (state.completed || state.activityIds[state.currentIndex] !== activityId || state.solvedActivityIds.includes(activityId)) {
    return state;
  }
  return { ...state, solvedActivityIds: [...state.solvedActivityIds, activityId] };
}

export function advanceSession(state: SessionState): SessionState {
  if (state.completed || !isCurrentActivitySolved(state)) return state;
  if (state.currentIndex === state.activityIds.length - 1) return { ...state, completed: true };
  return { ...state, currentIndex: state.currentIndex + 1 };
}

export function getSessionProgress(state: SessionState): number {
  return state.activityIds.length === 0
    ? 0
    : Math.round((state.solvedActivityIds.length / state.activityIds.length) * 100);
}
