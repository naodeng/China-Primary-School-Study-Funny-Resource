import type { ChineseQuestionSpec, ChineseTaskSpec } from './buildChineseUnit';

export function choose(
  prompt: string,
  options: readonly [string, string, string],
  correctOptionIndex: 0 | 1 | 2,
  hint: string,
  explanation: string,
): ChineseQuestionSpec {
  return { kind: 'choice', prompt, options, correctOptionIndex, hint, explanation };
}

export function pair(
  prompt: string,
  pairs: ReadonlyArray<readonly [string, string]>,
  hint: string,
  explanation: string,
): ChineseQuestionSpec {
  return { kind: 'match', prompt, pairs: pairs.map(([left, right]) => ({ left, right })), hint, explanation };
}

export function arrange(
  prompt: string,
  items: readonly string[],
  correctOrderIndices: readonly number[],
  hint: string,
  explanation: string,
): ChineseQuestionSpec {
  return { kind: 'order', prompt, items, correctOrderIndices, hint, explanation };
}

export function sortInto(
  prompt: string,
  categories: readonly string[],
  items: ReadonlyArray<readonly [string, number]>,
  hint: string,
  explanation: string,
): ChineseQuestionSpec {
  return {
    kind: 'categorize',
    prompt,
    categories,
    items: items.map(([label, categoryIndex]) => ({ label, categoryIndex })),
    hint,
    explanation,
  };
}

export function makeTask(
  title: string,
  objective: string,
  companionId: ChineseTaskSpec['companionId'],
  questions: readonly [ChineseQuestionSpec, ChineseQuestionSpec, ChineseQuestionSpec, ChineseQuestionSpec,
    ChineseQuestionSpec, ChineseQuestionSpec, ChineseQuestionSpec, ChineseQuestionSpec],
): ChineseTaskSpec {
  return { title, objective, companionId, questions };
}
