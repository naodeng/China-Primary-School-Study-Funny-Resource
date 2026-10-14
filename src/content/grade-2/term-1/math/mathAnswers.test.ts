import { describe, expect, it } from 'vitest';
import { curriculum } from '../../../curriculum';
import type { CurriculumUnit } from '../../../types';

const mathUnitKeys = [
  ...Array.from({ length: 9 }, (_, index) => `grade-2/term-1/math/unit-${String(index + 1).padStart(2, '0')}`),
  'grade-2/term-1/math/integrated-practice-01',
  ...Array.from({ length: 10 }, (_, index) => `grade-2/term-2/math/unit-${String(index + 1).padStart(2, '0')}`),
  'grade-2/term-2/math/integrated-practice-01',
];

function evaluateArithmeticExpression(expression: string): number {
  const normalized = expression.replace(/\s+/g, '');
  const tokens = normalized.match(/\d+|[()+\-×÷]/g) ?? [];
  if (tokens.join('') !== normalized) throw new Error(`不支持的算式：${expression}`);
  let cursor = 0;

  const factor = (): number => {
    const token = tokens[cursor++];
    if (token === '(') {
      const value = sum();
      if (tokens[cursor++] !== ')') throw new Error(`括号不成对：${expression}`);
      return value;
    }
    const value = Number(token);
    if (!Number.isFinite(value)) throw new Error(`缺少数值：${expression}`);
    return value;
  };

  const product = (): number => {
    let value = factor();
    while (tokens[cursor] === '×' || tokens[cursor] === '÷') {
      const operator = tokens[cursor++];
      const right = factor();
      value = operator === '×' ? value * right : value / right;
    }
    return value;
  };

  const sum = (): number => {
    let value = product();
    while (tokens[cursor] === '+' || tokens[cursor] === '-') {
      const operator = tokens[cursor++];
      const right = product();
      value = operator === '+' ? value + right : value - right;
    }
    return value;
  };

  const answer = sum();
  if (cursor !== tokens.length) throw new Error(`算式未完整读取：${expression}`);
  return answer;
}

function registeredMathUnits(): Array<[string, CurriculumUnit]> {
  return mathUnitKeys.flatMap((key) => {
    const unit = curriculum.units[key];
    expect(unit, `缺少课程数据：${key}`).toBeDefined();
    return unit ? [[key, unit]] : [];
  });
}

describe('grade 2 math answers', () => {
  it('computes every arithmetic answer from its written expression', () => {
    const activities = registeredMathUnits().flatMap(([, unit]) => Object.values(unit.difficultyTracks)
      .flatMap(({ tasks }) => tasks.flatMap(({ sessions }) => sessions.flatMap(({ activities: sessionActivities }) => sessionActivities))))
      .filter((activity) => activity.kind === 'arithmetic');

    expect(activities.length).toBeGreaterThan(0);
    for (const activity of activities) {
      if (activity.kind !== 'arithmetic') continue;
      expect(activity.correctAnswer, activity.expression).toBe(evaluateArithmeticExpression(activity.expression));
    }
  });

  it('keeps every ruler target within the visible measurement range', () => {
    for (const [, unit] of registeredMathUnits()) {
      for (const { tasks } of Object.values(unit.difficultyTracks)) {
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
