import type { ActivityDefinition, CompanionId, CurriculumUnit } from '../../../types';
import { buildDifficultyTracks, formatCurriculumSequence } from '../../../taskAssembly';

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
  grade?: 1 | 2 | 3;
  term?: 1 | 2;
  formalUnitNumber: number | null;
  entryId?: string;
  type?: 'unit' | 'review' | 'integrated-practice';
  title: string;
  sourceTopics: readonly string[];
  basicTasks: readonly [ChineseTaskSpec, ChineseTaskSpec, ...ChineseTaskSpec[]];
  advancedTasks: readonly [ChineseTaskSpec, ChineseTaskSpec];
  highTasks: readonly [ChineseTaskSpec, ChineseTaskSpec];
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
      options: question.options.map((label, index) => ({ id: `${id}/option-${formatCurriculumSequence(index + 1)}`, label })),
      correctOptionId: `${id}/option-${formatCurriculumSequence(question.correctOptionIndex + 1)}`,
    };
  }

  if (question.kind === 'match') {
    return {
      ...base,
      kind: 'match',
      pairs: question.pairs.map((pair, index) => ({
        id: `${id}/pair-${formatCurriculumSequence(index + 1)}`,
        left: pair.left,
        right: pair.right,
      })),
    };
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
      categoryId: `${id}/category-${formatCurriculumSequence(item.categoryIndex)}`,
    })),
  };
}

export function buildChineseUnit(spec: ChineseUnitSpec): CurriculumUnit {
  const grade = spec.grade ?? 2;
  const term = spec.term ?? 1;
  const type = spec.type ?? 'unit';
  const textbookEditionId = `grade-${grade}/term-${term}/chinese`;
  const entryId = spec.entryId ?? `unit-${formatCurriculumSequence(spec.formalUnitNumber ?? 0)}`;
  const id = `${textbookEditionId}/${entryId}`;
  return {
    id,
    subject: 'chinese',
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
