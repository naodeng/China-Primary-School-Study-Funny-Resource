import type { ActivityDefinition, CurriculumUnit, Difficulty, LearningSession, LearningTask } from '../../../types';
import type { MathQuestionSpec, MathTaskSpec } from './questionAuthoring';

export interface MathUnitSpec {
  term?: 1 | 2;
  formalUnitNumber: number | null;
  entryId?: string;
  type?: 'unit' | 'integrated-practice';
  title: string;
  sourceTopics: readonly string[];
  basicTasks: readonly [MathTaskSpec, MathTaskSpec, ...MathTaskSpec[]];
  advancedTask: MathTaskSpec;
  highTask: MathTaskSpec;
}

function numberId(value: number): string {
  return String(value).padStart(2, '0');
}

function createActivity(question: MathQuestionSpec, id: string): ActivityDefinition {
  const base = { id, prompt: question.prompt, hint: question.hint, explanation: question.explanation };

  if (question.kind === 'choice') {
    return {
      ...base,
      kind: 'choice',
      options: question.options.map((label, index) => ({ id: `${id}/option-${numberId(index + 1)}`, label })),
      correctOptionId: `${id}/option-${numberId(question.correctOptionIndex + 1)}`,
    };
  }
  if (question.kind === 'arithmetic') {
    return { ...base, kind: 'arithmetic', expression: question.expression, correctAnswer: question.correctAnswer, carryBorrowSteps: question.carryBorrowSteps ? [...question.carryBorrowSteps] : undefined };
  }
  if (question.kind === 'measurement') {
    return { ...base, kind: 'measurement', objectLabel: question.objectLabel, targetLengthCm: question.targetLengthCm, minCm: question.minCm, maxCm: question.maxCm };
  }
  if (question.kind === 'match') {
    return { ...base, kind: 'match', pairs: question.pairs.map(([left, right], index) => ({ id: `${id}/pair-${numberId(index + 1)}`, left, right })) };
  }
  if (question.kind === 'order') {
    return {
      ...base,
      kind: 'order',
      items: question.items.map((label, index) => ({ id: `${id}/item-${numberId(index + 1)}`, label })),
      correctOrder: question.correctOrderIndices.map((index) => `${id}/item-${numberId(index + 1)}`),
    };
  }
  return {
    ...base,
    kind: 'categorize',
    categories: question.categories.map((label, index) => ({ id: `${id}/category-${numberId(index + 1)}`, label })),
    items: question.items.map((item, index) => ({
      id: `${id}/item-${numberId(index + 1)}`,
      label: item.label,
      categoryId: `${id}/category-${numberId(item.categoryIndex + 1)}`,
    })),
  };
}

function createSession(unitId: string, difficulty: Difficulty, taskIndex: number, task: MathTaskSpec): LearningSession {
  const taskId = `${unitId}/${difficulty}/task-${numberId(taskIndex + 1)}`;
  const sessionId = `${taskId}/session-01`;
  return {
    id: sessionId,
    title: task.title,
    durationMinutes: 20,
    objective: task.objective,
    companionId: task.companionId,
    activities: task.questions.map((question, index) => createActivity(question, `${sessionId}/question-${numberId(index + 1)}`)),
  };
}

function createTask(unitId: string, difficulty: Difficulty, taskIndex: number, spec: MathTaskSpec): LearningTask {
  const id = `${unitId}/${difficulty}/task-${numberId(taskIndex + 1)}`;
  return { id, title: spec.title, objective: spec.objective, order: taskIndex + 1, sessions: [createSession(unitId, difficulty, taskIndex, spec)] };
}

function createTrack(unitId: string, difficulty: Difficulty, tasks: readonly MathTaskSpec[]) {
  return { difficulty, tasks: tasks.map((task, index) => createTask(unitId, difficulty, index, task)) };
}

export function buildMathUnit(spec: MathUnitSpec): CurriculumUnit {
  const term = spec.term ?? 1;
  const type = spec.type ?? 'unit';
  const entryId = spec.entryId ?? `unit-${numberId(spec.formalUnitNumber ?? 0)}`;
  const textbookEditionId = `grade-2/term-${term}/math`;
  const id = `${textbookEditionId}/${entryId}`;
  return {
    id,
    subject: 'math',
    title: spec.title,
    type,
    formalUnitNumber: spec.formalUnitNumber,
    achievementEligible: type === 'unit' && spec.formalUnitNumber !== null,
    textbookEditionId,
    sourceTopics: [...spec.sourceTopics],
    difficultyTracks: {
      basic: createTrack(id, 'basic', spec.basicTasks),
      advanced: createTrack(id, 'advanced', [spec.advancedTask]),
      high: createTrack(id, 'high', [spec.highTask]),
    },
  };
}
