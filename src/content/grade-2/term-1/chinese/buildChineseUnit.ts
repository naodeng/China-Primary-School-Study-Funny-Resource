import type {
  ActivityDefinition,
  CompanionId,
  CurriculumUnit,
  Difficulty,
  LearningSession,
  LearningTask,
} from '../../../types';

type QuestionBase = {
  prompt: string;
  hint: string;
  explanation: string;
};

export type ChineseQuestionSpec = QuestionBase & (
  | { kind: 'choice'; options: readonly [string, string, string]; correctOptionIndex: 0 | 1 | 2 }
  | { kind: 'match'; pairs: ReadonlyArray<{ left: string; right: string }> }
  | { kind: 'order'; items: readonly string[]; correctOrderIndices: readonly number[] }
  | { kind: 'categorize'; categories: readonly string[]; items: ReadonlyArray<{ label: string; categoryIndex: number }> }
);

export interface ChineseTaskSpec {
  title: string;
  objective: string;
  companionId: CompanionId;
  questions: readonly ChineseQuestionSpec[];
}

export interface ChineseUnitSpec {
  term?: 1 | 2;
  formalUnitNumber: number;
  title: string;
  sourceTopics: readonly string[];
  basicTasks: readonly [ChineseTaskSpec, ChineseTaskSpec, ...ChineseTaskSpec[]];
  advancedTasks?: readonly [ChineseTaskSpec, ChineseTaskSpec];
  highTasks?: readonly [ChineseTaskSpec, ChineseTaskSpec];
  advancedTask?: ChineseTaskSpec;
  highTask?: ChineseTaskSpec;
}

function numberId(value: number): string {
  return String(value).padStart(2, '0');
}

function createActivity(question: ChineseQuestionSpec, id: string): ActivityDefinition {
  const base = {
    id,
    prompt: question.prompt,
    hint: question.hint,
    explanation: question.explanation,
  };

  if (question.kind === 'choice') {
    return {
      ...base,
      kind: 'choice',
      options: question.options.map((label, index) => ({ id: `${id}/option-${numberId(index + 1)}`, label })),
      correctOptionId: `${id}/option-${numberId(question.correctOptionIndex + 1)}`,
    };
  }

  if (question.kind === 'match') {
    return {
      ...base,
      kind: 'match',
      pairs: question.pairs.map((pair, index) => ({
        id: `${id}/pair-${numberId(index + 1)}`,
        left: pair.left,
        right: pair.right,
      })),
    };
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
      categoryId: `${id}/category-${numberId(item.categoryIndex)}`,
    })),
  };
}

function createSession(unitId: string, difficulty: Difficulty, taskIndex: number, task: ChineseTaskSpec): LearningSession {
  const taskId = `${unitId}/${difficulty}/task-${numberId(taskIndex + 1)}`;
  const sessionId = `${taskId}/session-01`;
  return {
    id: sessionId,
    title: task.title,
    durationMinutes: 20,
    objective: task.objective,
    companionId: task.companionId,
    activities: task.questions.map((question, index) => (
      createActivity(question, `${sessionId}/question-${numberId(index + 1)}`)
    )),
  };
}

function createTask(unitId: string, difficulty: Difficulty, taskIndex: number, spec: ChineseTaskSpec): LearningTask {
  const id = `${unitId}/${difficulty}/task-${numberId(taskIndex + 1)}`;
  return {
    id,
    title: spec.title,
    objective: spec.objective,
    order: taskIndex + 1,
    sessions: [createSession(unitId, difficulty, taskIndex, spec)],
  };
}

function createTrack(unitId: string, difficulty: Difficulty, specs: readonly ChineseTaskSpec[]) {
  return {
    difficulty,
    tasks: specs.map((spec, index) => createTask(unitId, difficulty, index, spec)),
  };
}

export function buildChineseUnit(spec: ChineseUnitSpec): CurriculumUnit {
  const term = spec.term ?? 1;
  const textbookEditionId = `grade-2/term-${term}/chinese`;
  const id = `${textbookEditionId}/unit-${numberId(spec.formalUnitNumber)}`;
  return {
    id,
    subject: 'chinese',
    title: spec.title,
    type: 'unit',
    formalUnitNumber: spec.formalUnitNumber,
    achievementEligible: true,
    textbookEditionId,
    sourceTopics: [...spec.sourceTopics],
    difficultyTracks: {
      basic: createTrack(id, 'basic', spec.basicTasks),
      advanced: createTrack(id, 'advanced', spec.advancedTasks ?? (spec.advancedTask ? [spec.advancedTask] : [])),
      high: createTrack(id, 'high', spec.highTasks ?? (spec.highTask ? [spec.highTask] : [])),
    },
  };
}
