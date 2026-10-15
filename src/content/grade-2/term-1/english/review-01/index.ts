import { buildEnglishUnit } from '../buildEnglishUnit';
import { lessonProfile, makeTask, phraseQuestion } from '../questionAuthoring';

const familyAndPeople = lessonProfile(
  [
    { word: 'father', meaning: '爸爸' },
    { word: 'mother', meaning: '妈妈' },
    { word: 'boy', meaning: '男孩' },
    { word: 'girl', meaning: '女孩' },
  ],
  [
    phraseQuestion('想介绍妈妈，应该选择哪句？', ['This is my mother.', 'This is my father.', 'He is a boy.'], 0, 'mother 表示妈妈。'),
    phraseQuestion('想说“她是一个女孩”，应该选哪句？', ['She is a girl.', 'He is a boy.', 'She is a mother.'], 0, '介绍女孩时可以用 she。'),
  ],
  ['家庭成员', '男孩或女孩'],
  [
    { label: 'father', categoryIndex: 0 }, { label: 'mother', categoryIndex: 0 },
    { label: 'boy', categoryIndex: 1 }, { label: 'girl', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“他是一个男孩”。', items: ['boy', '.', 'a', 'He', 'is'], correctOrderIndices: [3, 4, 2, 0, 1] },
);

const friendsAndFeatures = lessonProfile(
  [
    { word: 'friend', meaning: '朋友' },
    { word: 'classmate', meaning: '同班同学' },
    { word: 'tall', meaning: '高的' },
    { word: 'short', meaning: '矮的或短的' },
  ],
  [
    phraseQuestion('“他是我的朋友。”对应哪句？', ['He is my friend.', 'She is my classmate.', 'He is tall.'], 0, 'friend 表示朋友。'),
    phraseQuestion('想说“她个子高”，哪句合适？', ['She is tall.', 'She is short.', 'He is my friend.'], 0, 'tall 描述身高较高。'),
  ],
  ['关系词', '描述词'],
  [
    { label: 'friend', categoryIndex: 0 }, { label: 'classmate', categoryIndex: 0 },
    { label: 'tall', categoryIndex: 1 }, { label: 'short', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“她是我的同班同学”。', items: ['classmate', 'She', 'my', 'is', '.'], correctOrderIndices: [1, 3, 2, 0, 4] },
);

const reviewPronouns = lessonProfile(
  [
    { word: 'sister', meaning: '姐姐或妹妹' },
    { word: 'brother', meaning: '哥哥或弟弟' },
    { word: 'man', meaning: '男人' },
    { word: 'woman', meaning: '女人' },
  ],
  [
    phraseQuestion('介绍哥哥或弟弟时，哪句正确？', ['He is my brother.', 'She is my sister.', 'He is a woman.'], 0, 'brother 表示哥哥或弟弟，介绍他时用 he。'),
    phraseQuestion('介绍女士时，哪句合适？', ['She is a woman.', 'He is a man.', 'She is my brother.'], 0, 'woman 表示女人或女士。'),
  ],
  ['he 开头的介绍', 'she 开头的介绍'],
  [
    { label: 'He is my brother.', categoryIndex: 0 }, { label: 'He is a man.', categoryIndex: 0 },
    { label: 'She is my sister.', categoryIndex: 1 }, { label: 'She is a woman.', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“她是我的姐姐或妹妹”。', items: ['my', 'is', 'sister', 'She', '.'], correctOrderIndices: [3, 1, 0, 2, 4] },
);

const friendIntroduction = lessonProfile(
  [
    { word: 'classmate', meaning: '同班同学' },
    { word: 'friend', meaning: '朋友' },
    { word: 'pretty', meaning: '漂亮的' },
    { word: 'handsome', meaning: '英俊的' },
  ],
  [
    phraseQuestion('想友好地说“她是我的朋友”，哪句正确？', ['She is my friend.', 'He is my friend.', 'She is handsome.'], 0, 'friend 表示朋友。'),
    phraseQuestion('想说“他很英俊”，哪句正确？', ['He is handsome.', 'She is pretty.', 'He is short.'], 0, 'handsome 表示英俊的。'),
  ],
  ['人物关系词', '外貌描述词'],
  [
    { label: 'classmate', categoryIndex: 0 }, { label: 'friend', categoryIndex: 0 },
    { label: 'pretty', categoryIndex: 1 }, { label: 'handsome', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“他是我的朋友”。', items: ['friend', 'He', '.', 'my', 'is'], correctOrderIndices: [1, 4, 3, 0, 2] },
);

const peopleAndDescriptions = lessonProfile(
  [
    { word: 'father', meaning: '爸爸' },
    { word: 'sister', meaning: '姐姐或妹妹' },
    { word: 'tall', meaning: '高的' },
    { word: 'handsome', meaning: '英俊的' },
  ],
  [
    phraseQuestion('介绍爸爸时，哪句正确？', ['This is my father.', 'This is my sister.', 'She is my father.'], 0, 'father 表示爸爸；介绍家人可以用 This is my...。'),
    phraseQuestion('“他很高。”可以怎样说？', ['He is tall.', 'She is tall.', 'He is handsome.'], 0, 'tall 表示高的；he 指男性。'),
  ],
  ['家庭成员或人物', '外貌或身高描述'],
  [
    { label: 'father', categoryIndex: 0 }, { label: 'sister', categoryIndex: 0 },
    { label: 'tall', categoryIndex: 1 }, { label: 'handsome', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“她是我的妹妹”。', items: ['my', 'sister', 'She', '.', 'is'], correctOrderIndices: [2, 4, 0, 1, 3] },
);

const friendsAndKindWords = lessonProfile(
  [
    { word: 'classmate', meaning: '同班同学' },
    { word: 'friend', meaning: '朋友' },
    { word: 'pretty', meaning: '漂亮的' },
    { word: 'short', meaning: '矮的或短的' },
  ],
  [
    phraseQuestion('“她是我的朋友。”对应哪句？', ['She is my friend.', 'He is my friend.', 'She is short.'], 0, 'friend 表示朋友；she 指女性。'),
    phraseQuestion('想表达“她很漂亮”，应该选哪句？', ['She is pretty.', 'He is pretty.', 'She is tall.'], 0, 'pretty 表示漂亮的；she 指女性。'),
  ],
  ['人物关系词', '人物描述词'],
  [
    { label: 'classmate', categoryIndex: 0 }, { label: 'friend', categoryIndex: 0 },
    { label: 'pretty', categoryIndex: 1 }, { label: 'short', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“他是我的同班同学”。', items: ['my', 'classmate', 'He', '.', 'is'], correctOrderIndices: [2, 4, 0, 1, 3] },
);

export const unit = buildEnglishUnit({
  formalUnitNumber: null,
  entryId: 'review-01',
  type: 'review',
  title: '复习一 · Units 1–3',
  sourceTopics: ['复习 Unit 1 家庭成员', '复习 Unit 2 人物与同伴', '复习 Unit 3 友善描述人物'],
  basicTasks: [
    makeTask('人物与家庭复习站', '复习家庭成员、男孩女孩词汇，并练习 he 和 she。', 'companion-02', familyAndPeople),
    makeTask('朋友特征配对站', '综合回顾朋友、同学与简单描述词。', 'companion-03', friendsAndFeatures),
  ],
  advancedTasks: [
    makeTask('代词与人物线索挑战', '根据人物线索选择 he 或 she，并正确介绍家庭成员。', 'companion-01', reviewPronouns),
    makeTask('人物与描述分类赛', '区分人物关系词和外貌身高描述词，并练习完整介绍。', 'companion-02', peopleAndDescriptions),
  ],
  highTasks: [
    makeTask('前三单元综合播报', '把人物关系词与友善描述词组合成简短介绍。', 'companion-04', friendIntroduction),
    makeTask('朋友介绍拼图', '综合运用朋友、同学和人物描述词整理完整句子。', 'companion-03', friendsAndKindWords),
  ],
});
