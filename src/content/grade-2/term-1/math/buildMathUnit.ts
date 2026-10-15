import type { ActivityDefinition, CurriculumUnit } from '../../../types';
import { buildDifficultyTracks, formatCurriculumSequence } from '../../../taskAssembly';
import type { MathQuestionSpec, MathTaskSpec } from './questionAuthoring';

export interface MathUnitSpec {
  grade?: 1 | 2 | 3;
  term?: 1 | 2;
  formalUnitNumber: number | null;
  entryId?: string;
  type?: 'unit' | 'integrated-practice';
  title: string;
  sourceTopics: readonly string[];
  basicTasks: readonly [MathTaskSpec, MathTaskSpec, ...MathTaskSpec[]];
  advancedTasks: readonly [MathTaskSpec, MathTaskSpec];
  highTasks: readonly [MathTaskSpec, MathTaskSpec];
}

function createActivity(question: MathQuestionSpec, id: string): ActivityDefinition {
  const base = { id, prompt: question.prompt, hint: question.hint, explanation: question.explanation };

  if (question.kind === 'choice') {
    return {
      ...base,
      kind: 'choice',
      options: question.options.map((label, index) => ({ id: `${id}/option-${formatCurriculumSequence(index + 1)}`, label })),
      correctOptionId: `${id}/option-${formatCurriculumSequence(question.correctOptionIndex + 1)}`,
    };
  }
  if (question.kind === 'arithmetic') {
    return { ...base, kind: 'arithmetic', expression: question.expression, correctAnswer: question.correctAnswer, carryBorrowSteps: question.carryBorrowSteps ? [...question.carryBorrowSteps] : undefined };
  }
  if (question.kind === 'measurement') {
    return { ...base, kind: 'measurement', objectLabel: question.objectLabel, targetLengthCm: question.targetLengthCm, minCm: question.minCm, maxCm: question.maxCm };
  }
  if (question.kind === 'match') {
    return { ...base, kind: 'match', pairs: question.pairs.map(([left, right], index) => ({ id: `${id}/pair-${formatCurriculumSequence(index + 1)}`, left, right })) };
  }
  if (question.kind === 'order') {
    return {
      ...base,
      kind: 'order',
      items: question.items.map((label, index) => ({ id: `${id}/item-${formatCurriculumSequence(index + 1)}`, label })),
      correctOrder: question.correctOrderIndices.map((index) => `${id}/item-${formatCurriculumSequence(index + 1)}`),
    };
  }
  return {
    ...base,
    kind: 'categorize',
    categories: question.categories.map((label, index) => ({ id: `${id}/category-${formatCurriculumSequence(index + 1)}`, label })),
    items: question.items.map((item, index) => ({
      id: `${id}/item-${formatCurriculumSequence(index + 1)}`,
      label: item.label,
      categoryId: `${id}/category-${formatCurriculumSequence(item.categoryIndex + 1)}`,
    })),
  };
}

export function buildMathUnit(spec: MathUnitSpec): CurriculumUnit {
  const grade = spec.grade ?? 2;
  const term = spec.term ?? 1;
  const type = spec.type ?? 'unit';
  const entryId = spec.entryId ?? `unit-${formatCurriculumSequence(spec.formalUnitNumber ?? 0)}`;
  const textbookEditionId = `grade-${grade}/term-${term}/math`;
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
    difficultyTracks: buildDifficultyTracks(id, {
      basic: spec.basicTasks,
      advanced: spec.advancedTasks,
      high: spec.highTasks,
    }, createActivity),
  };
}
