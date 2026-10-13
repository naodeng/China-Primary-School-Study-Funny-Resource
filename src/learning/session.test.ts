import { describe, expect, it } from 'vitest';
import { advanceSession, createSessionState, getSessionProgress, markCurrentActivitySolved } from './session';

describe('session state', () => {
  it('completesOnlyAfterLastCorrectAnswer', () => {
    let state = createSessionState(['question-1', 'question-2', 'question-3']);

    expect(advanceSession(state)).toBe(state);
    expect(markCurrentActivitySolved(state, 'unknown')).toBe(state);
    state = markCurrentActivitySolved(state, 'question-1');
    expect(state.completed).toBe(false);
    expect(getSessionProgress(state)).toBe(33);
    state = advanceSession(state);
    expect(state.currentIndex).toBe(1);
    expect(markCurrentActivitySolved(state, 'question-1')).toBe(state);
    state = markCurrentActivitySolved(state, 'question-2');
    state = advanceSession(state);
    expect(state.currentIndex).toBe(2);
    state = markCurrentActivitySolved(state, 'question-3');
    expect(state.completed).toBe(false);
    state = advanceSession(state);

    expect(state.completed).toBe(true);
    expect(getSessionProgress(state)).toBe(100);
    expect(advanceSession(state)).toBe(state);
  });

  it('doesNotCompleteAnEmptySession', () => {
    const state = createSessionState([]);

    expect(state.completed).toBe(false);
    expect(getSessionProgress(state)).toBe(0);
    expect(advanceSession(state)).toBe(state);
  });

  it('doesNotCountTheSameCorrectAnswerTwice', () => {
    const initial = createSessionState(['question-1', 'question-2']);
    const solved = markCurrentActivitySolved(initial, 'question-1');

    expect(markCurrentActivitySolved(solved, 'question-1')).toBe(solved);
    expect(solved.solvedActivityIds).toEqual(['question-1']);
  });
});
