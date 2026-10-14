import { describe, expect, it } from 'vitest';
import { getAnswerSoundFeedback, SOUND_CUE_ASSETS } from './soundCues';

describe('answer sound cues', () => {
  it('usesCorrectCueAtStart', () => {
    expect(getAnswerSoundFeedback('correct', 0, false)).toEqual({
      cue: 'answer-correct',
      consecutiveCorrectCount: 1,
    });
  });

  it('usesStreakCueAfterConsecutiveAnswers', () => {
    expect(getAnswerSoundFeedback('correct', 1, false)).toEqual({
      cue: 'answer-streak',
      consecutiveCorrectCount: 2,
    });
  });

  it('resetsStreakAfterIncorrectAnswer', () => {
    expect(getAnswerSoundFeedback('incorrect', 4, false)).toEqual({
      cue: 'answer-incorrect',
      consecutiveCorrectCount: 0,
    });
  });

  it('choosesSessionCompleteCueBeforeStreakCue', () => {
    expect(getAnswerSoundFeedback('correct', 6, true)).toEqual({
      cue: 'session-complete',
      consecutiveCorrectCount: 7,
    });
  });

  it('doesNotChooseSessionCompleteForAnIncorrectFinalAttempt', () => {
    expect(getAnswerSoundFeedback('incorrect', 6, true)).toEqual({
      cue: 'answer-incorrect',
      consecutiveCorrectCount: 0,
    });
  });

  it('mapsEachCueToItsLocalMp3Asset', () => {
    expect(SOUND_CUE_ASSETS).toEqual({
      'answer-correct': '/audio/answer-correct.mp3',
      'answer-streak': '/audio/answer-streak.mp3',
      'session-complete': '/audio/session-complete.mp3',
      'answer-incorrect': '/audio/answer-incorrect.mp3',
      'interaction-click': '/audio/interaction-click.mp3',
    });
  });
});
