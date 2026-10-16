import { describe, expect, it } from 'vitest';
import { curriculum } from '../../curriculum';
import { addedCourseCatalog } from '../catalog';

function evaluateArithmetic(expression: string): number {
  const tokens = expression.replace(/×/g, '*').replace(/÷/g, '/')
    .match(/\d+(?:\.\d+)?|[()+*/-]/g);
  if (!tokens) throw new Error(`No arithmetic tokens found in: ${expression}`);
  let cursor = 0;

  const parsePrimary = (): number => {
    const token = tokens[cursor++];
    if (token === undefined) throw new Error(`Unexpected end of expression: ${expression}`);
    if (token === '(') {
      const value = parseExpression();
      if (tokens[cursor++] !== ')') throw new Error(`Missing closing parenthesis: ${expression}`);
      return value;
    }
    if (token === '-') return -parsePrimary();
    const value = Number(token);
    if (!Number.isFinite(value)) throw new Error(`Invalid number ${token} in: ${expression}`);
    return value;
  };

  const parseProduct = (): number => {
    let value = parsePrimary();
    while (tokens[cursor] === '*' || tokens[cursor] === '/') {
      const operator = tokens[cursor++];
      const right = parsePrimary();
      value = operator === '*' ? value * right : value / right;
    }
    return value;
  };

  const parseExpression = (): number => {
    let value = parseProduct();
    while (tokens[cursor] === '+' || tokens[cursor] === '-') {
      const operator = tokens[cursor++];
      const right = parseProduct();
      value = operator === '+' ? value + right : value - right;
    }
    return value;
  };

  const answer = parseExpression();
  if (cursor !== tokens.length) throw new Error(`Unexpected token ${tokens[cursor]} in: ${expression}`);
  return answer;
}

function questionFingerprint(activity: (typeof curriculum.units)[string]['difficultyTracks']['basic']['tasks'][number]['sessions'][number]['activities'][number]): string {
  if (activity.kind === 'choice') {
    const correct = activity.options.find(({ id }) => id === activity.correctOptionId)?.label;
    return JSON.stringify([activity.kind, activity.prompt, activity.hint, activity.explanation,
      [...activity.options.map(({ label }) => label)].sort(), correct]);
  }
  if (activity.kind === 'arithmetic') {
    return JSON.stringify([activity.kind, activity.prompt, activity.hint, activity.explanation,
      activity.expression, activity.correctAnswer]);
  }
  if (activity.kind === 'match') {
    return JSON.stringify([activity.kind, activity.prompt, activity.hint, activity.explanation,
      activity.pairs.map(({ left, right }) => [left, right]).sort(([left], [right]) => left.localeCompare(right))]);
  }
  if (activity.kind === 'order') {
    const labelById = new Map(activity.items.map(({ id, label }) => [id, label]));
    return JSON.stringify([activity.kind, activity.prompt, activity.hint, activity.explanation,
      activity.correctOrder.map((id) => labelById.get(id)), [...activity.items.map(({ label }) => label)].sort()]);
  }
  if (activity.kind === 'categorize') {
    const categoryById = new Map(activity.categories.map(({ id, label }) => [id, label]));
    return JSON.stringify([activity.kind, activity.prompt, activity.hint, activity.explanation,
      activity.items.map(({ label, categoryId }) => [label, categoryById.get(categoryId)] as const)
        .sort((left, right) => left[0].localeCompare(right[0])), activity.categories.map(({ label }) => label)]);
  }
  return JSON.stringify(activity);
}

function choiceAnswerSignature(unitId: string, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number, questionIndex: number): string {
  const question = curriculum.units[unitId]?.difficultyTracks[difficulty].tasks[taskIndex]?.sessions[0]?.activities[questionIndex];
  if (!question || question.kind !== 'choice') throw new Error(`Expected a choice question: ${unitId}/${difficulty}/${taskIndex + 1}/${questionIndex + 1}`);
  const correct = question.options.find(({ id }) => id === question.correctOptionId)?.label;
  return JSON.stringify([[...question.options.map(({ label }) => label)].sort(), correct]);
}

describe('added math question quality', () => {
  it('does not repeat a complete question within a task', () => {
    for (const entry of addedCourseCatalog.filter(({ subject }) => subject === 'math')) {
      const unit = curriculum.units[entry.id];
      expect(unit, `Missing math curriculum unit ${entry.id}`).toBeDefined();
      if (!unit) continue;

      for (const [difficulty, track] of Object.entries(unit.difficultyTracks)) {
        for (const [taskIndex, task] of track.tasks.entries()) {
          const activities = task.sessions.flatMap(({ activities: sessionActivities }) => sessionActivities);
          const fingerprints = activities.map(questionFingerprint);
          expect(new Set(fingerprints).size, `${entry.id} ${difficulty} task ${taskIndex + 1} repeats a complete question`)
            .toBe(fingerprints.length);
        }
      }
    }
  });

  it('does not reuse a complete question across the two tasks of the same course and tier', () => {
    const failures: string[] = [];
    for (const entry of addedCourseCatalog.filter(({ subject }) => subject === 'math')) {
      const unit = curriculum.units[entry.id];
      expect(unit, `Missing math curriculum unit ${entry.id}`).toBeDefined();
      if (!unit) continue;

      for (const [difficulty, track] of Object.entries(unit.difficultyTracks)) {
        const [firstTask, secondTask] = track.tasks;
        const first = firstTask?.sessions.flatMap(({ activities }) => activities) ?? [];
        const second = secondTask?.sessions.flatMap(({ activities }) => activities) ?? [];
        const firstQuestions = new Set(first.map(questionFingerprint));
        second.forEach((activity, index) => {
          if (firstQuestions.has(questionFingerprint(activity))) {
            failures.push(`${entry.id} ${difficulty} q${index + 1}`);
          }
        });
      }
    }
    expect(failures).toEqual([]);
  });

  it('keeps similar-looking checkpoints focused on different information or reasoning', () => {
    const comparisons = [
      ['grade-1/term-1/math/unit-01', 'basic', 0, 0, 6],
      ['grade-1/term-1/math/unit-07', 'advanced', 0, 1, 7],
      ['grade-1/term-2/math/unit-03', 'advanced', 0, 5, 7],
      ['grade-3/term-1/math/unit-05', 'advanced', 0, 3, 6],
      ['grade-3/term-1/math/unit-05', 'advanced', 0, 3, 7],
      ['grade-3/term-1/math/unit-08', 'advanced', 1, 3, 7],
      ['grade-3/term-2/math/unit-03', 'basic', 0, 0, 7],
    ] as const;
    for (const [unitId, difficulty, taskIndex, leftIndex, rightIndex] of comparisons) {
      expect(choiceAnswerSignature(unitId, difficulty, taskIndex, leftIndex), `${unitId} ${difficulty} task ${taskIndex + 1}`)
        .not.toBe(choiceAnswerSignature(unitId, difficulty, taskIndex, rightIndex));
    }
  });

  it('keeps every choice question answerable with three distinct options', () => {
    for (const entry of addedCourseCatalog.filter(({ subject }) => subject === 'math')) {
      const unit = curriculum.units[entry.id];
      expect(unit, `Missing math curriculum unit ${entry.id}`).toBeDefined();
      if (!unit) continue;
      for (const track of Object.values(unit.difficultyTracks)) {
        for (const task of track.tasks) {
          for (const activity of task.sessions.flatMap(({ activities }) => activities)) {
            if (activity.kind !== 'choice') continue;
            expect(new Set(activity.options.map(({ label }) => label)).size,
              `${activity.id} has repeated answer choices`).toBe(3);
            expect(activity.options.some(({ id }) => id === activity.correctOptionId),
              `${activity.id} answer key is not one of its options`).toBe(true);
          }
        }
      }
    }
  });

  it('recomputes every generated arithmetic answer', () => {
    const arithmeticActivities = addedCourseCatalog.filter(({ subject }) => subject === 'math')
      .flatMap(({ id }) => {
        const unit = curriculum.units[id];
        return unit ? Object.values(unit.difficultyTracks).flatMap(({ tasks }) => tasks)
          .flatMap(({ sessions }) => sessions).flatMap(({ activities }) => activities)
          .filter((activity) => activity.kind === 'arithmetic') : [];
      });
    expect(arithmeticActivities).toHaveLength(366);
    for (const activity of arithmeticActivities) {
      if (activity.kind !== 'arithmetic') continue;
      expect(evaluateArithmetic(activity.expression), activity.id).toBe(activity.correctAnswer);
    }
  });

  it('keeps perimeter questions inside perimeter and side-length content', () => {
    for (const unitId of ['grade-3/term-1/math/unit-07', 'grade-3/term-1/math/unit-10']) {
      const unit = curriculum.units[unitId];
      expect(unit, `Missing perimeter curriculum unit ${unitId}`).toBeDefined();
      if (!unit) continue;
      const content = Object.values(unit.difficultyTracks).flatMap(({ tasks }) => tasks)
        .flatMap(({ sessions }) => sessions).flatMap(({ activities }) => activities)
        .flatMap((activity) => [activity.prompt, activity.hint, activity.explanation,
          ...(activity.kind === 'choice' ? activity.options.map(({ label }) => label) : [])]).join('\n');
      expect(content, unitId).not.toMatch(/面积|长\s*[×x*]\s*宽/);
    }
  });

  it('covers unit and non-unit fractions within the grade-three textbook topic', () => {
    const unit = curriculum.units['grade-3/term-1/math/unit-08'];
    expect(unit).toBeDefined();
    if (!unit) return;
    expect(unit.sourceTopics.join(' ')).toMatch(/几分之一、几分之几/);
    const content = Object.values(unit.difficultyTracks).flatMap(({ tasks }) => tasks)
      .flatMap(({ sessions }) => sessions).flatMap(({ activities }) => activities)
      .flatMap((activity) => [activity.prompt, activity.hint, activity.explanation,
        ...(activity.kind === 'choice' ? activity.options.map(({ label }) => label) : [])]).join('\n');
    expect(content).toMatch(/几分之几|分子不是 1|分子是 1/);
  });

  it('lists all but one pairing before asking which combination is missing', () => {
    const unit = curriculum.units['grade-3/term-2/math/unit-08'];
    expect(unit).toBeDefined();
    if (!unit) return;

    for (const difficulty of ['basic', 'advanced', 'high'] as const) {
      const question = unit.difficultyTracks[difficulty].tasks[1]?.sessions[0]?.activities[6];
      expect(question?.kind).toBe('choice');
      if (question?.kind !== 'choice') continue;

      const expected = ['牛奶 + 面包', '牛奶 + 饼干', '果汁 + 面包', '果汁 + 饼干', '豆浆 + 面包', '豆浆 + 饼干'];
      const listed = expected.filter((combination) => question.prompt.includes(`“${combination}”`));
      expect(listed).toHaveLength(5);
      const answer = question.options.find(({ id }) => id === question.correctOptionId)?.label;
      expect(answer).toBe('豆浆 + 饼干');
      expect(question.prompt).not.toContain(`“${answer}”`);
      expect(question.explanation).toMatch(/每种饮料都和每种点心搭配过，共 6 种/);
    }
  });

  it('uses the finite-counter enumeration described by 摆一摆，想一想', () => {
    const unit = curriculum.units['grade-1/term-2/math/integrated-practice-01'];
    expect(unit).toBeDefined();
    if (!unit) return;
    for (const [difficulty, track] of Object.entries(unit.difficultyTracks)) {
      for (const [taskIndex, task] of track.tasks.entries()) {
        for (const activity of task.sessions.flatMap(({ activities }) => activities)) {
          const content = [activity.prompt, activity.hint, activity.explanation].join(' ');
          expect(content, `${difficulty} task ${taskIndex + 1} ${activity.id}`).toMatch(/棋子|摆法|十位|个位|数位组合/);
        }
      }
    }

    const basicTasks = unit.difficultyTracks.basic.tasks;
    for (const [taskIndex, task] of basicTasks.entries()) {
      const counterCount = taskIndex + 2;
      const activities = task.sessions[0]?.activities ?? [];
      const countQuestion = activities[0];
      expect(countQuestion?.kind).toBe('choice');
      if (countQuestion?.kind === 'choice') {
        const correct = countQuestion.options.find(({ id }) => id === countQuestion.correctOptionId)?.label;
        expect(Number(correct)).toBe(counterCount + 1);
      }

      const matchingQuestion = activities[2];
      expect(matchingQuestion?.kind).toBe('match');
      if (matchingQuestion?.kind === 'match') {
        const expectedValues = Array.from({ length: counterCount + 1 }, (_, tens) => String(tens * 10 + counterCount - tens));
        expect(matchingQuestion.pairs.map(({ right }) => right).sort((left, right) => Number(left) - Number(right)))
          .toEqual(expectedValues);
        for (const { left, right } of matchingQuestion.pairs) {
          const match = left.match(/十位放 (\d+) 枚，个位放 (\d+) 枚/);
          expect(match).not.toBeNull();
          expect(Number(match?.[1]) + Number(match?.[2])).toBe(counterCount);
          expect(Number(match?.[1]) * 10 + Number(match?.[2])).toBe(Number(right));
        }
      }
    }
  });

  it('keeps advanced and high ordering questions faithful to numeric ordering', () => {
    const unit = curriculum.units['grade-1/term-2/math/integrated-practice-01'];
    expect(unit).toBeDefined();
    if (!unit) return;

    for (const [difficulty, counterCounts] of [
      ['advanced', [3, 4]],
      ['high', [4, 5]],
    ] as const) {
      unit.difficultyTracks[difficulty].tasks.forEach((task, taskIndex) => {
        const question = task.sessions[0]?.activities[3];
        expect(question?.kind, `${difficulty} task ${taskIndex + 1}`).toBe('choice');
        if (question?.kind !== 'choice') return;

        const counterCount = counterCounts[taskIndex]!;
        const expectedOrder = Array.from({ length: counterCount + 1 }, (_, tens) => String(tens * 10 + counterCount - tens))
          .join(' → ');
        const correctLabel = question.options.find(({ id }) => id === question.correctOptionId)?.label;
        expect(question.prompt).toMatch(/从小到大/);
        expect(correctLabel, `${difficulty} task ${taskIndex + 1} must preserve the full ordered result`).toBe(expectedOrder);
      });
    }
  });

  it('meaningfully differentiates math tasks and difficulty tracks', () => {
    for (const entry of addedCourseCatalog.filter(({ subject }) => subject === 'math')) {
      const unit = curriculum.units[entry.id];
      expect(unit, `Missing math curriculum unit ${entry.id}`).toBeDefined();
      if (!unit) continue;
      for (let taskIndex = 0; taskIndex < 2; taskIndex += 1) {
        for (const [leftName, rightName] of [['basic', 'advanced'], ['basic', 'high'], ['advanced', 'high']] as const) {
          const left = unit.difficultyTracks[leftName].tasks[taskIndex]?.sessions[0]?.activities ?? [];
          const right = unit.difficultyTracks[rightName].tasks[taskIndex]?.sessions[0]?.activities ?? [];
          const distinctSlots = left.reduce((count, activity, index) =>
            count + (questionFingerprint(activity) === questionFingerprint(right[index]!) ? 0 : 1), 0);
          expect(distinctSlots, `${entry.id} task ${taskIndex + 1} ${leftName}/${rightName} only differs in ${distinctSlots}/8 question prompts`)
            .toBeGreaterThanOrEqual(4);
        }
      }
    }
  });
});
