import type { CompanionId } from '../../../types';

interface QuestionBase {
  prompt: string;
  hint: string;
  explanation: string;
}

export type EnglishQuestionSpec = QuestionBase & (
  | { kind: 'choice'; options: readonly [string, string, string]; correctOptionIndex: 0 | 1 | 2 }
  | { kind: 'match'; pairs: ReadonlyArray<readonly [string, string]> }
  | { kind: 'order'; items: readonly string[]; correctOrderIndices: readonly number[] }
  | { kind: 'categorize'; categories: readonly [string, string]; items: ReadonlyArray<{ label: string; categoryIndex: 0 | 1 }> }
);

export type EightEnglishQuestions = readonly [
  EnglishQuestionSpec, EnglishQuestionSpec, EnglishQuestionSpec, EnglishQuestionSpec,
  EnglishQuestionSpec, EnglishQuestionSpec, EnglishQuestionSpec, EnglishQuestionSpec,
];

export interface EnglishTaskSpec {
  title: string;
  objective: string;
  companionId: CompanionId;
  questions: EightEnglishQuestions;
}

export interface EnglishWordCard {
  word: string;
  meaning: string;
}

export interface EnglishChoiceQuestion {
  prompt: string;
  options: readonly [string, string, string];
  correctOptionIndex: 0 | 1 | 2;
  hint: string;
  explanation: string;
}

export interface EnglishLessonProfile {
  words: readonly [EnglishWordCard, EnglishWordCard, EnglishWordCard, EnglishWordCard];
  phraseQuestions: readonly [EnglishChoiceQuestion, EnglishChoiceQuestion];
  categories: readonly [string, string];
  categorizedWords: ReadonlyArray<{ label: string; categoryIndex: 0 | 1 }>;
  orderedSentence: {
    prompt: string;
    items: readonly string[];
    correctOrderIndices: readonly number[];
  };
}

export function phraseQuestion(
  prompt: string,
  options: readonly [string, string, string],
  correctOptionIndex: 0 | 1 | 2,
  explanation: string,
): EnglishChoiceQuestion {
  return {
    prompt,
    options,
    correctOptionIndex,
    hint: '先读一读每个选项，想想哪一句最符合题意。',
    explanation,
  };
}

export function lessonProfile(
  words: EnglishLessonProfile['words'],
  phraseQuestions: EnglishLessonProfile['phraseQuestions'],
  categories: EnglishLessonProfile['categories'],
  categorizedWords: EnglishLessonProfile['categorizedWords'],
  orderedSentence: EnglishLessonProfile['orderedSentence'],
): EnglishLessonProfile {
  return { words, phraseQuestions, categories, categorizedWords, orderedSentence };
}

export function choose(
  prompt: string,
  options: readonly [string, string, string],
  correctOptionIndex: 0 | 1 | 2,
  hint: string,
  explanation: string,
): EnglishQuestionSpec {
  return { kind: 'choice', prompt, options, correctOptionIndex, hint, explanation };
}

export function pair(
  prompt: string,
  pairs: ReadonlyArray<readonly [string, string]>,
  hint: string,
  explanation: string,
): EnglishQuestionSpec {
  return { kind: 'match', prompt, pairs, hint, explanation };
}

export function arrange(
  prompt: string,
  items: readonly string[],
  correctOrderIndices: readonly number[],
  hint: string,
  explanation: string,
): EnglishQuestionSpec {
  return { kind: 'order', prompt, items, correctOrderIndices, hint, explanation };
}

export function sortInto(
  prompt: string,
  categories: readonly [string, string],
  items: ReadonlyArray<{ label: string; categoryIndex: 0 | 1 }>,
  hint: string,
  explanation: string,
): EnglishQuestionSpec {
  return { kind: 'categorize', prompt, categories, items, hint, explanation };
}

export function makeTask(
  title: string,
  objective: string,
  companionId: CompanionId,
  profile: EnglishLessonProfile,
): EnglishTaskSpec {
  const [first, second, third, fourth] = profile.words;
  return {
    title,
    objective,
    companionId,
    questions: q8([
      choose(`单词或词组 “${first.word}” 的意思是什么？`, [first.meaning, second.meaning, third.meaning], 0, '先读一读英文词卡，再回想它的中文意思。', `“${first.word}”表示“${first.meaning}”。`),
      choose(`哪个英文单词表示“${second.meaning}”？`, [first.word, second.word, third.word], 1, '在词卡中找到对应的中文意思。', `“${second.meaning}”对应单词 “${second.word}”。`),
      pair('把英文词卡和中文意思连起来。', profile.words.map(({ word, meaning }) => [word, meaning] as const), '先认出熟悉的词，再逐个配对。', '对照词义检查每一组是否匹配。'),
      choose(`“${fourth.word}”表示什么？`, [first.meaning, fourth.meaning, second.meaning], 1, '看看这个词是否出现在本次的目标词卡里。', `“${fourth.word}”表示“${fourth.meaning}”。`),
      choose(profile.phraseQuestions[0].prompt, profile.phraseQuestions[0].options, profile.phraseQuestions[0].correctOptionIndex, profile.phraseQuestions[0].hint, profile.phraseQuestions[0].explanation),
      choose(profile.phraseQuestions[1].prompt, profile.phraseQuestions[1].options, profile.phraseQuestions[1].correctOptionIndex, profile.phraseQuestions[1].hint, profile.phraseQuestions[1].explanation),
      sortInto('把词卡放进合适的词语小队。', profile.categories, profile.categorizedWords, '先读懂每张词卡，再按小队名称分类。', '逐项对照词义完成分类，再检查一次。'),
      arrange(profile.orderedSentence.prompt, profile.orderedSentence.items, profile.orderedSentence.correctOrderIndices, '先找句子的开头，再看结尾标点或末尾的词。', '把词卡排成自然、完整的英文表达。'),
    ]),
  };
}

export function q8(questions: readonly EnglishQuestionSpec[]): EightEnglishQuestions {
  if (questions.length !== 8) throw new Error(`英语场次需要 8 道题，当前收到 ${questions.length} 道。`);
  return questions as unknown as EightEnglishQuestions;
}
