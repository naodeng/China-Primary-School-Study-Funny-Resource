import { describe, expect, it } from 'vitest';
import type { ActivityDefinition } from '../content/types';
import { submitAnswer } from './answers';

const activities: Array<{ activity: ActivityDefinition; correct: unknown; incorrect: unknown }> = [
  {
    activity: {
      id: 'choice', kind: 'choice', prompt: '选一选', hint: '提示', explanation: '解释',
      options: [{ id: 'yes', label: '是' }, { id: 'no', label: '否' }], correctOptionId: 'yes',
    },
    correct: 'yes', incorrect: 'no',
  },
  {
    activity: {
      id: 'match', kind: 'match', prompt: '配一配', hint: '提示', explanation: '解释',
      pairs: [{ id: 'p1', left: '一', right: '1' }, { id: 'p2', left: '二', right: '2' }],
    },
    correct: { p1: 'p1', p2: 'p2' }, incorrect: { p1: 'p2', p2: 'p1' },
  },
  {
    activity: {
      id: 'order', kind: 'order', prompt: '排一排', hint: '提示', explanation: '解释',
      items: [{ id: 'first', label: '先' }, { id: 'second', label: '后' }], correctOrder: ['first', 'second'],
    },
    correct: ['first', 'second'], incorrect: ['second', 'first'],
  },
  {
    activity: {
      id: 'categorize', kind: 'categorize', prompt: '分一分', hint: '提示', explanation: '解释',
      categories: [{ id: 'warm', label: '暖色' }, { id: 'cool', label: '冷色' }],
      items: [{ id: 'sun', label: '太阳', categoryId: 'warm' }, { id: 'ice', label: '冰块', categoryId: 'cool' }],
    },
    correct: { sun: 'warm', ice: 'cool' }, incorrect: { sun: 'cool', ice: 'warm' },
  },
  {
    activity: {
      id: 'measurement', kind: 'measurement', prompt: '量一量', hint: '提示', explanation: '解释',
      objectLabel: '铅笔', targetLengthCm: 12, minCm: 10, maxCm: 15,
    },
    correct: 12, incorrect: 11,
  },
  {
    activity: {
      id: 'arithmetic', kind: 'arithmetic', prompt: '算一算', hint: '提示', explanation: '解释',
      expression: '3 + 5', correctAnswer: 8,
    },
    correct: 8, incorrect: 7,
  },
];

describe('submitAnswer', () => {
  it('handlesCorrectAndIncorrectAnswerForEachKind', () => {
    for (const { activity, correct, incorrect } of activities) {
      expect(submitAnswer(activity, correct), activity.kind).toBe(true);
      expect(submitAnswer(activity, incorrect), activity.kind).toBe(false);
    }
  });

  it('rejectsMalformedAnswersAndInvalidChoiceReferences', () => {
    for (const { activity } of activities) {
      expect(submitAnswer(activity, null), activity.kind).toBe(false);
    }

    const invalidChoice = { ...activities[0].activity, correctOptionId: 'missing' } as ActivityDefinition;
    expect(submitAnswer(invalidChoice, 'missing')).toBe(false);
    expect(submitAnswer({ kind: 'unknown' } as unknown as ActivityDefinition, 'anything')).toBe(false);
  });
});
