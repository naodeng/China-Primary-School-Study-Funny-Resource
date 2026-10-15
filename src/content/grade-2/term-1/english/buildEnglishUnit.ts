import type { ActivityDefinition, CatalogEntryType, CurriculumUnit } from '../../../types';
import { buildDifficultyTracks, formatCurriculumSequence } from '../../../taskAssembly';
import type { EnglishQuestionSpec, EnglishTaskSpec } from './questionAuthoring';

export interface EnglishUnitSpec {
  grade?: 1 | 2 | 3;
  term?: 1 | 2;
  formalUnitNumber: number | null;
  entryId: string;
  type?: 'unit' | 'review';
  title: string;
  sourceTopics: readonly string[];
  basicTasks: readonly [EnglishTaskSpec, EnglishTaskSpec, ...EnglishTaskSpec[]];
  advancedTasks: readonly [EnglishTaskSpec, EnglishTaskSpec];
  highTasks: readonly [EnglishTaskSpec, EnglishTaskSpec];
}

function createActivity(question: EnglishQuestionSpec, id: string): ActivityDefinition {
  const base = { id, prompt: question.prompt, hint: question.hint, explanation: question.explanation };
  if (question.kind === 'choice') {
    return {
      ...base,
      kind: 'choice',
      options: question.options.map((label, index) => ({ id: `${id}/option-${formatCurriculumSequence(index + 1)}`, label })),
      correctOptionId: `${id}/option-${formatCurriculumSequence(question.correctOptionIndex + 1)}`,
    };
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

export function buildEnglishUnit(spec: EnglishUnitSpec): CurriculumUnit {
  const grade = spec.grade ?? 2;
  const term = spec.term ?? 1;
  const type: CatalogEntryType = spec.type ?? 'unit';
  const textbookEditionId = `grade-${grade}/term-${term}/english`;
  const id = `${textbookEditionId}/${spec.entryId}`;
  return {
    id,
    subject: 'english',
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
