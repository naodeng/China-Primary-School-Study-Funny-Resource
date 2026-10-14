import { describe, expect, it } from 'vitest';
import { curriculum } from '../../../curriculum';

const mathUnitKeys = [
  ...Array.from({ length: 9 }, (_, index) => `grade-2/term-1/math/unit-${String(index + 1).padStart(2, '0')}`),
  'grade-2/term-1/math/integrated-practice-01',
];

describe('grade 2 term 1 math answers', () => {
  it('computes every arithmetic answer from its written expression', () => {
    const activities = mathUnitKeys.flatMap((key) => Object.values(curriculum.units[key].difficultyTracks)
      .flatMap(({ tasks }) => tasks.flatMap(({ sessions }) => sessions.flatMap(({ activities: sessionActivities }) => sessionActivities))))
      .filter((activity) => activity.kind === 'arithmetic');

    expect(activities.length).toBeGreaterThan(0);
    for (const activity of activities) {
      if (activity.kind !== 'arithmetic') continue;
      const match = activity.expression.match(/^\s*(\d+)\s*([+\-×])\s*(\d+)\s*$/);
      expect(match, activity.expression).not.toBeNull();
      const left = Number(match?.[1]);
      const operator = match?.[2];
      const right = Number(match?.[3]);
      const answer = operator === '+' ? left + right : operator === '-' ? left - right : left * right;
      expect(activity.correctAnswer, activity.expression).toBe(answer);
    }
  });

  it('keeps every ruler target within the visible measurement range', () => {
    for (const key of mathUnitKeys) {
      for (const { tasks } of Object.values(curriculum.units[key].difficultyTracks)) {
        for (const { sessions } of tasks) {
          for (const { activities } of sessions) {
            for (const activity of activities) {
              if (activity.kind !== 'measurement') continue;
              expect(activity.targetLengthCm).toBeGreaterThanOrEqual(activity.minCm);
              expect(activity.targetLengthCm).toBeLessThanOrEqual(activity.maxCm);
            }
          }
        }
      }
    }
  });
});
