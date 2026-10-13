import type { ActivityDefinition } from '../content/types';

function isStringRecord(value: unknown): value is Record<string, string> {
  return typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
    && Object.values(value).every((item) => typeof item === 'string');
}

export function submitAnswer(activity: ActivityDefinition, answer: unknown): boolean {
  switch (activity.kind) {
    case 'choice':
      return typeof answer === 'string'
        && answer === activity.correctOptionId
        && activity.options.some((option) => option.id === answer);
    case 'match':
      return isStringRecord(answer)
        && Object.keys(answer).length === activity.pairs.length
        && activity.pairs.every((pair) => answer[pair.id] === pair.id);
    case 'order':
      return Array.isArray(answer)
        && answer.length === activity.correctOrder.length
        && answer.every((item, index) => item === activity.correctOrder[index]);
    case 'categorize':
      return isStringRecord(answer)
        && Object.keys(answer).length === activity.items.length
        && activity.items.every((item) => answer[item.id] === item.categoryId);
    case 'measurement':
      return typeof answer === 'number' && Number.isFinite(answer) && answer === activity.targetLengthCm;
    case 'arithmetic':
      return typeof answer === 'number' && Number.isFinite(answer) && answer === activity.correctAnswer;
  }
  return false;
}
