import { buildEnglishUnit } from '../buildEnglishUnit';
import { lessonProfile, makeTask, phraseQuestion } from '../questionAuthoring';

const peopleWords = lessonProfile(
  [
    { word: 'boy', meaning: '男孩' },
    { word: 'girl', meaning: '女孩' },
    { word: 'man', meaning: '男人' },
    { word: 'woman', meaning: '女人' },
  ],
  [
    phraseQuestion('“他是一个男孩。”可以怎样说？', ['He is a boy.', 'She is a girl.', 'He is a man.'], 0, '男孩是 boy，介绍男孩时用 he。'),
    phraseQuestion('“她是一个女孩。”对应哪一句？', ['She is a girl.', 'He is a boy.', 'She is a woman.'], 0, '女孩是 girl，介绍女孩时用 she。'),
  ],
  ['he 开头的人物词', 'she 开头的人物词'],
  [
    { label: 'boy', categoryIndex: 0 }, { label: 'man', categoryIndex: 0 },
    { label: 'girl', categoryIndex: 1 }, { label: 'woman', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成一句介绍男孩的话。', items: ['boy', 'a', 'He', '.', 'is'], correctOrderIndices: [2, 4, 1, 0, 3] },
);

const classmates = lessonProfile(
  [
    { word: 'classmate', meaning: '同班同学' },
    { word: 'friend', meaning: '朋友' },
    { word: 'boy', meaning: '男孩' },
    { word: 'girl', meaning: '女孩' },
  ],
  [
    phraseQuestion('“她是我的朋友。”可以怎样说？', ['She is my friend.', 'He is my friend.', 'She is my classmate.'], 0, 'friend 表示朋友。'),
    phraseQuestion('“他是我的同班同学。”对应哪一句？', ['He is my classmate.', 'She is my classmate.', 'He is a girl.'], 0, 'classmate 表示同班同学。'),
  ],
  ['人物身份词', '人物关系词'],
  [
    { label: 'boy', categoryIndex: 0 }, { label: 'girl', categoryIndex: 0 },
    { label: 'classmate', categoryIndex: 1 }, { label: 'friend', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成一句介绍朋友的话。', items: ['friend', 'my', 'She', 'is', '.'], correctOrderIndices: [2, 3, 1, 0, 4] },
);

const describePeople = lessonProfile(
  [
    { word: 'man', meaning: '男人' },
    { word: 'woman', meaning: '女人' },
    { word: 'boy', meaning: '男孩' },
    { word: 'girl', meaning: '女孩' },
  ],
  [
    phraseQuestion('看见一位女士，哪句话合适？', ['She is a woman.', 'He is a man.', 'She is a boy.'], 0, 'woman 表示女人或女士。'),
    phraseQuestion('看见一位男士，哪句话合适？', ['He is a man.', 'She is a woman.', 'He is a girl.'], 0, 'man 表示男人或男士。'),
  ],
  ['男性人物词', '女性人物词'],
  [
    { label: 'man', categoryIndex: 0 }, { label: 'boy', categoryIndex: 0 },
    { label: 'woman', categoryIndex: 1 }, { label: 'girl', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成一句介绍女士的话。', items: ['woman', 'a', 'She', '.', 'is'], correctOrderIndices: [2, 4, 1, 0, 3] },
);

const friendlyIntroductions = lessonProfile(
  [
    { word: 'friend', meaning: '朋友' },
    { word: 'classmate', meaning: '同班同学' },
    { word: 'girl', meaning: '女孩' },
    { word: 'boy', meaning: '男孩' },
  ],
  [
    phraseQuestion('要说“他是我的朋友”，应该选哪句？', ['He is my friend.', 'She is my friend.', 'He is a girl.'], 0, 'friend 是朋友，he 指他。'),
    phraseQuestion('要说“她是我的同班同学”，应该选哪句？', ['She is my classmate.', 'He is my classmate.', 'She is a boy.'], 0, 'classmate 表示同班同学，she 指她。'),
  ],
  ['he 开头的句子', 'she 开头的句子'],
  [
    { label: 'He is my friend.', categoryIndex: 0 }, { label: 'He is my classmate.', categoryIndex: 0 },
    { label: 'She is my friend.', categoryIndex: 1 }, { label: 'She is my classmate.', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“他是我的同班同学”。', items: ['classmate', 'my', 'He', 'is', '.'], correctOrderIndices: [2, 3, 1, 0, 4] },
);

export const unit = buildEnglishUnit({
  formalUnitNumber: 2,
  entryId: 'unit-02',
  title: '第二单元 · Boys and Girls',
  sourceTopics: ['男孩、女孩、男人、女人', '同班同学与朋友', 'he 与 she 的人物表达'],
  basicTasks: [
    makeTask('人物词卡观察站', '认读常见人物词汇，并练习用 he 或 she 介绍人物。', 'companion-01', peopleWords),
    makeTask('同学与朋友任务', '理解 classmate 和 friend 的意思，完成简单人物介绍。', 'companion-03', classmates),
  ],
  advancedTask: makeTask('人物分类挑战', '综合辨认人物词汇、性别代词和同学关系表达。', 'companion-02', describePeople),
  highTask: makeTask('友善介绍小主播', '根据人物线索组织完整句子，介绍同学或朋友。', 'companion-04', friendlyIntroductions),
});
