import { describe, expect, it } from 'vitest';
import { curriculum } from '../../../curriculum';
import type { CurriculumUnit } from '../../../types';

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
  return Object.entries(curriculum.units).filter(([, unit]) => unit.subject === 'math');
}

function activitiesForUnit(unitKey: string) {
  const unit = curriculum.units[unitKey];
  if (!unit) throw new Error(`缺少课程：${unitKey}`);
  return Object.values(unit.difficultyTracks)
    .flatMap(({ tasks }) => tasks)
    .flatMap(({ sessions }) => sessions)
    .flatMap(({ activities }) => activities);
}

describe('registered math answers', () => {
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

  it('keeps grade-one term-two addition and subtraction within the taught no-carry range', () => {
    const unitKeys = [
      'grade-1/term-2/math/unit-06',
      'grade-1/term-2/math/unit-08',
    ];
    const arithmeticQuestions = unitKeys.flatMap(activitiesForUnit)
      .filter((activity) => activity.kind === 'arithmetic');

    expect(arithmeticQuestions.length).toBeGreaterThan(0);
    for (const question of arithmeticQuestions) {
      if (question.kind !== 'arithmetic') continue;
      const match = question.expression.match(/^(\d+) ([+-]) (\d+)$/);
      expect(match, question.expression).not.toBeNull();
      const left = Number(match?.[1]);
      const operator = match?.[2];
      const right = Number(match?.[3]);

      expect(left, question.expression).toBeGreaterThanOrEqual(10);
      expect(left, question.expression).toBeLessThan(100);
      if (operator === '+') {
        const isSingleDigit = right < 10;
        const isMultipleOfTen = right >= 10 && right % 10 === 0;
        expect(isSingleDigit || isMultipleOfTen, question.expression).toBe(true);
        if (isSingleDigit) expect((left % 10) + right, question.expression).toBeLessThan(10);
        expect(left + right, question.expression).toBeLessThanOrEqual(100);
      } else {
        const isSingleDigit = right < 10;
        const isMultipleOfTen = right >= 10 && right % 10 === 0;
        expect(isSingleDigit || isMultipleOfTen, question.expression).toBe(true);
        if (isSingleDigit) expect(left % 10, question.expression).toBeGreaterThanOrEqual(right);
        if (isMultipleOfTen) expect(left % 10, question.expression).toBe(0);
        expect(left, question.expression).toBeGreaterThanOrEqual(right);
      }
    }
  });

  it('uses numeric fields throughout the grade-three number-coding match question', () => {
    const matches = activitiesForUnit('grade-3/term-1/math/integrated-practice-01')
      .filter((activity) => activity.kind === 'match');
    const codingMatch = matches.find((activity) => activity.kind === 'match' && activity.prompt.includes('编码中的部分'));

    expect(codingMatch, 'number-coding match question').toBeDefined();
    if (codingMatch?.kind !== 'match') return;
    expect(codingMatch.pairs.some(({ left, right }) => left === '编号开头的数字' && right === '物品类别')).toBe(true);
    expect(JSON.stringify(codingMatch.pairs)).not.toContain('字母');
  });

  it.each([
    {
      unitKey: 'grade-3/term-1/math/unit-10',
      topics: ['分钟', '进位', '毫米', '×', '周长', '分之一', '集合', '倍'],
    },
    {
      unitKey: 'grade-3/term-2/math/unit-09',
      topics: ['方向', '÷', '一班', '×', '面积', '月', '0.', '搭配'],
    },
  ])('reviews the full grade-three semester topic set in %s', ({ unitKey, topics }) => {
    const serializedActivities = JSON.stringify(activitiesForUnit(unitKey));

    for (const topic of topics) {
      expect(serializedActivities, `${unitKey} should review ${topic}`).toContain(topic);
    }
  });
});
