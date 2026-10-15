import type { CompanionId } from '../../../types';

interface QuestionBase {
  prompt: string;
  hint: string;
  explanation: string;
}

export type MathQuestionSpec = QuestionBase & (
  | { kind: 'choice'; options: readonly [string, string, string]; correctOptionIndex: 0 | 1 | 2 }
  | { kind: 'arithmetic'; expression: string; correctAnswer: number; carryBorrowSteps?: readonly string[] }
  | { kind: 'measurement'; objectLabel: string; targetLengthCm: number; minCm: number; maxCm: number }
  | { kind: 'match'; pairs: ReadonlyArray<readonly [string, string]> }
  | { kind: 'order'; items: readonly string[]; correctOrderIndices: readonly number[] }
  | { kind: 'categorize'; categories: readonly string[]; items: ReadonlyArray<{ label: string; categoryIndex: number }> }
);

export type EightMathQuestions = readonly [
  MathQuestionSpec, MathQuestionSpec, MathQuestionSpec, MathQuestionSpec,
  MathQuestionSpec, MathQuestionSpec, MathQuestionSpec, MathQuestionSpec,
];

export interface MathTaskSpec {
  title: string;
  objective: string;
  companionId: CompanionId;
  questions: EightMathQuestions;
}

export function choose(
  prompt: string,
  options: readonly [string, string, string],
  correctOptionIndex: 0 | 1 | 2,
  hint: string,
  explanation: string,
): MathQuestionSpec {
  return { kind: 'choice', prompt, options, correctOptionIndex, hint, explanation };
}

export function chooseNumber(
  prompt: string,
  answer: number,
  distractors: readonly [number, number],
  hint: string,
  explanation: string,
): MathQuestionSpec {
  const correctOptionIndex = Math.abs(answer) % 3 as 0 | 1 | 2;
  const options = [...distractors] as number[];
  options.splice(correctOptionIndex, 0, answer);
  return choose(prompt, options.map(String) as [string, string, string], correctOptionIndex, hint, explanation);
}

export function calculate(
  prompt: string,
  expression: string,
  correctAnswer: number,
  hint: string,
  explanation: string,
  carryBorrowSteps?: readonly string[],
): MathQuestionSpec {
  return { kind: 'arithmetic', prompt, expression, correctAnswer, hint, explanation, carryBorrowSteps };
}

export function measure(
  prompt: string,
  objectLabel: string,
  targetLengthCm: number,
  maxCm: number,
  hint: string,
  explanation: string,
): MathQuestionSpec {
  return { kind: 'measurement', prompt, objectLabel, targetLengthCm, minCm: 0, maxCm, hint, explanation };
}

export function pair(
  prompt: string,
  pairs: ReadonlyArray<readonly [string, string]>,
  hint: string,
  explanation: string,
): MathQuestionSpec {
  return { kind: 'match', prompt, pairs, hint, explanation };
}

export function arrange(
  prompt: string,
  items: readonly string[],
  correctOrderIndices: readonly number[],
  hint: string,
  explanation: string,
): MathQuestionSpec {
  return { kind: 'order', prompt, items, correctOrderIndices, hint, explanation };
}

export function sortInto(
  prompt: string,
  categories: readonly string[],
  items: ReadonlyArray<{ label: string; categoryIndex: number }>,
  hint: string,
  explanation: string,
): MathQuestionSpec {
  return { kind: 'categorize', prompt, categories, items, hint, explanation };
}

export function makeTask(
  title: string,
  objective: string,
  companionId: CompanionId,
  questions: EightMathQuestions,
): MathTaskSpec {
  return { title, objective, companionId, questions };
}

export function q8(questions: readonly MathQuestionSpec[]): EightMathQuestions {
  if (questions.length !== 8) throw new Error(`数学场次需要 8 道题，当前收到 ${questions.length} 道。`);
  return questions as unknown as EightMathQuestions;
}
