import { buildEnglishUnit } from '../buildEnglishUnit';
import { lessonProfile, makeTask, phraseQuestion } from '../questionAuthoring';

const familyBasics = lessonProfile(
  [
    { word: 'father', meaning: '爸爸' },
    { word: 'mother', meaning: '妈妈' },
    { word: 'sister', meaning: '姐姐或妹妹' },
    { word: 'brother', meaning: '哥哥或弟弟' },
  ],
  [
    phraseQuestion('“这是我的姐姐或妹妹。”可以怎样说？', ['This is my sister.', 'This is my brother.', 'This is my father.'], 0, 'sister 表示姐姐或妹妹。'),
    phraseQuestion('想介绍妈妈，哪句话合适？', ['This is my mother.', 'This is my sister.', 'This is my brother.'], 0, '介绍妈妈时用 mother。'),
  ],
  ['男性家人', '女性家人'],
  [
    { label: 'father', categoryIndex: 0 }, { label: 'brother', categoryIndex: 0 },
    { label: 'mother', categoryIndex: 1 }, { label: 'sister', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成一句完整的介绍。', items: ['sister', '.', 'This', 'my', 'is'], correctOrderIndices: [2, 4, 3, 0, 1] },
);

const familyClues = lessonProfile(
  [
    { word: 'grandfather', meaning: '爷爷或外公' },
    { word: 'grandmother', meaning: '奶奶或外婆' },
    { word: 'father', meaning: '爸爸' },
    { word: 'mother', meaning: '妈妈' },
  ],
  [
    phraseQuestion('介绍爷爷或外公，哪句话合适？', ['This is my grandfather.', 'This is my grandmother.', 'This is my mother.'], 0, 'grandfather 表示爷爷或外公。'),
    phraseQuestion('“她是我的奶奶或外婆。”对应哪一句？', ['She is my grandmother.', 'He is my grandfather.', 'She is my mother.'], 0, 'grandmother 表示奶奶或外婆，介绍她时可用 she。'),
  ],
  ['男性家人', '女性家人'],
  [
    { label: 'grandfather', categoryIndex: 0 }, { label: 'father', categoryIndex: 0 },
    { label: 'grandmother', categoryIndex: 1 }, { label: 'mother', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成一句介绍家人的话。', items: ['my', 'mother', '.', 'This', 'is'], correctOrderIndices: [3, 4, 0, 1, 2] },
);

const introduceFamily = lessonProfile(
  [
    { word: 'sister', meaning: '姐姐或妹妹' },
    { word: 'father', meaning: '爸爸' },
    { word: 'mother', meaning: '妈妈' },
    { word: 'brother', meaning: '哥哥或弟弟' },
  ],
  [
    phraseQuestion('“这是我的哥哥或弟弟。”可以怎样说？', ['This is my brother.', 'This is my father.', 'This is my sister.'], 0, 'brother 表示哥哥或弟弟。'),
    phraseQuestion('介绍爸爸时，应选择哪一句？', ['This is my father.', 'This is my mother.', 'This is my sister.'], 0, 'father 表示爸爸。'),
  ],
  ['介绍男性家人', '介绍女性家人'],
  [
    { label: 'father', categoryIndex: 0 }, { label: 'brother', categoryIndex: 0 },
    { label: 'mother', categoryIndex: 1 }, { label: 'sister', categoryIndex: 1 },
  ],
  { prompt: '给词卡排队，介绍一位家人。', items: ['my', 'father', '.', 'This', 'is'], correctOrderIndices: [3, 4, 0, 1, 2] },
);

const familySentence = lessonProfile(
  [
    { word: 'mother', meaning: '妈妈' },
    { word: 'brother', meaning: '哥哥或弟弟' },
    { word: 'father', meaning: '爸爸' },
    { word: 'sister', meaning: '姐姐或妹妹' },
  ],
  [
    phraseQuestion('想说“他是我的哥哥或弟弟”，哪句正确？', ['He is my brother.', 'She is my sister.', 'He is my father.'], 0, '介绍一位男孩时可用 he。'),
    phraseQuestion('想说“她是我的姐姐或妹妹”，哪句正确？', ['She is my sister.', 'He is my brother.', 'She is my mother.'], 0, '介绍一位女孩时可用 she。'),
  ],
  ['he 开头的介绍', 'she 开头的介绍'],
  [
    { label: 'He is my father.', categoryIndex: 0 }, { label: 'He is my brother.', categoryIndex: 0 },
    { label: 'She is my mother.', categoryIndex: 1 }, { label: 'She is my sister.', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“她是我的姐姐或妹妹”。', items: ['sister', 'my', 'She', '.', 'is'], correctOrderIndices: [2, 4, 1, 0, 3] },
);

export const unit = buildEnglishUnit({
  formalUnitNumber: 1,
  entryId: 'unit-01',
  title: '第一单元 · My Family',
  sourceTopics: ['家庭成员词汇', '介绍家人', 'he 与 she 的初步表达'],
  basicTasks: [
    makeTask('家庭词卡收集站', '认读常见家庭成员词汇，并用 This is my… 介绍家人。', 'companion-03', familyBasics),
    makeTask('家人介绍练习场', '辨认父母与祖辈称呼，练习用简单句介绍一位家人。', 'companion-02', familyClues),
  ],
  advancedTask: makeTask('家庭成员线索挑战', '根据人物线索选择合适的家庭成员词，并完成简短介绍。', 'companion-04', introduceFamily),
  highTask: makeTask('我的家庭小播报', '综合运用家庭成员词汇与 he、she，完成清楚友善的家庭介绍。', 'companion-01', familySentence),
});
