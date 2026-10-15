import type { FeedbackStatus } from '../learning/feedback';

export type SoundCue = 'answer-correct' | 'answer-streak' | 'session-complete' | 'answer-incorrect' | 'interaction-click';

export const SOUND_CUE_ASSETS: Record<SoundCue, string> = {
  'answer-correct': '/audio/answer-correct.mp3',
  'answer-streak': '/audio/answer-streak.mp3',
  'session-complete': '/audio/session-complete.mp3',
  'answer-incorrect': '/audio/answer-incorrect.mp3',
  'interaction-click': '/audio/interaction-click.mp3',
};

export interface AnswerSoundFeedback {
  cue: SoundCue;
  consecutiveCorrectCount: number;
}

export function getAnswerSoundFeedback(
  status: FeedbackStatus,
  previousConsecutiveCorrectCount: number,
  sessionComplete: boolean,
): AnswerSoundFeedback {
  if (status === 'incorrect') return { cue: 'answer-incorrect', consecutiveCorrectCount: 0 };

  const previousCount = Number.isSafeInteger(previousConsecutiveCorrectCount) && previousConsecutiveCorrectCount > 0
    ? previousConsecutiveCorrectCount
    : 0;
  const consecutiveCorrectCount = previousCount + 1;
  if (sessionComplete) return { cue: 'session-complete', consecutiveCorrectCount };
  return {
    cue: previousCount > 0 ? 'answer-streak' : 'answer-correct',
    consecutiveCorrectCount,
  };
}
