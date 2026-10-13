import { describe, expect, it } from 'vitest';
import { FEEDBACK_MESSAGES, selectFeedbackMessage } from './feedback';

describe('selectFeedbackMessage', () => {
  it('selectsOnlyStatusMessages', () => {
    for (const status of ['correct', 'incorrect'] as const) {
      for (const random of [() => 0, () => 0.999999, () => 1]) {
        expect(FEEDBACK_MESSAGES[status]).toContain(selectFeedbackMessage(status, null, random));
      }
    }
    expect(FEEDBACK_MESSAGES.correct).not.toEqual(FEEDBACK_MESSAGES.incorrect);
  });

  it('avoidsPreviousMessage', () => {
    for (const status of ['correct', 'incorrect'] as const) {
      const previous = FEEDBACK_MESSAGES[status][0];
      expect(selectFeedbackMessage(status, previous, () => 0)).not.toBe(previous);
    }
  });

  it('keepsMessagesInTheirOwnStatusPool', () => {
    const incorrectMessage = FEEDBACK_MESSAGES.incorrect[1];
    expect(selectFeedbackMessage('correct', incorrectMessage, () => 0)).toBe(FEEDBACK_MESSAGES.correct[0]);
  });

  it('usesSafeIndicesForNonFiniteRandomValues', () => {
    expect(FEEDBACK_MESSAGES.correct).toContain(selectFeedbackMessage('correct', null, () => Number.NaN));
    expect(FEEDBACK_MESSAGES.incorrect.at(-1)).toBe(selectFeedbackMessage('incorrect', null, () => 1));
  });
});
