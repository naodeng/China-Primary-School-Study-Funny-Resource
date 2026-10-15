import { buildEnglishUnit } from '../buildEnglishUnit';
import { lessonProfile, makeTask, phraseQuestion } from '../questionAuthoring';

const heightWords = lessonProfile(
  [
    { word: 'tall', meaning: '高的' },
    { word: 'short', meaning: '身材较矮的或短的' },
    { word: 'big', meaning: '大的' },
    { word: 'thin', meaning: '瘦的' },
  ],
  [
    phraseQuestion('想说“他个子高”，哪句合适？', ['He is tall.', 'He is short.', 'He is thin.'], 0, 'tall 表示高的。'),
    phraseQuestion('描述一位人物的身高时，哪句表达“她身材较矮”？', ['She is short.', 'She is tall.', 'She is big.'], 0, '描述身高时，short 表示身材较矮。'),
  ],
  ['描述身高', '描述体型'],
  [
    { label: 'tall', categoryIndex: 0 }, { label: 'short', categoryIndex: 0 },
    { label: 'big', categoryIndex: 1 }, { label: 'thin', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成一句描述身高的话。', items: ['tall', 'is', 'He', '.'], correctOrderIndices: [2, 1, 0, 3] },
);

const appearanceWords = lessonProfile(
  [
    { word: 'handsome', meaning: '英俊的' },
    { word: 'pretty', meaning: '漂亮的' },
    { word: 'tall', meaning: '高的' },
    { word: 'thin', meaning: '瘦的' },
  ],
  [
    phraseQuestion('“她很漂亮。”对应哪一句？', ['She is pretty.', 'She is tall.', 'He is handsome.'], 0, 'pretty 表示漂亮的。'),
    phraseQuestion('“他很英俊。”对应哪一句？', ['He is handsome.', 'She is pretty.', 'He is short.'], 0, 'handsome 表示英俊的。'),
  ],
  ['身高描述词', '外貌描述词'],
  [
    { label: 'tall', categoryIndex: 0 }, { label: 'short', categoryIndex: 0 },
    { label: 'handsome', categoryIndex: 1 }, { label: 'pretty', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成一句友善的外貌描述。', items: ['pretty', 'She', '.', 'is'], correctOrderIndices: [1, 3, 0, 2] },
);

const compareClues = lessonProfile(
  [
    { word: 'big', meaning: '大的' },
    { word: 'thin', meaning: '瘦的' },
    { word: 'short', meaning: '身材较矮的或短的' },
    { word: 'tall', meaning: '高的' },
  ],
  [
    phraseQuestion('小树长得很高，可以用哪个词描述？', ['tall', 'short', 'thin'], 0, '描述高度时 tall 表示高的。'),
    phraseQuestion('一个大箱子可以用哪个词描述？', ['big', 'thin', 'short'], 0, 'big 表示大的。'),
  ],
  ['大小或体型', '高度'],
  [
    { label: 'big', categoryIndex: 0 }, { label: 'thin', categoryIndex: 0 },
    { label: 'short', categoryIndex: 1 }, { label: 'tall', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“她个子高”。', items: ['tall', 'She', 'is', '.'], correctOrderIndices: [1, 2, 0, 3] },
);

const kindDescriptions = lessonProfile(
  [
    { word: 'pretty', meaning: '漂亮的' },
    { word: 'handsome', meaning: '英俊的' },
    { word: 'short', meaning: '身材较矮的或短的' },
    { word: 'big', meaning: '大的' },
  ],
  [
    phraseQuestion('描述一位人物的身高时，哪句表达“他身材较矮”？', ['He is short.', 'He is tall.', 'She is pretty.'], 0, '描述身高时，short 表示身材较矮。'),
    phraseQuestion('看到一个很大的球，可以选哪个词？', ['big', 'thin', 'handsome'], 0, 'big 描述大小。'),
  ],
  ['描述大小或身高', '描述外貌'],
  [
    { label: 'short', categoryIndex: 0 }, { label: 'big', categoryIndex: 0 },
    { label: 'pretty', categoryIndex: 1 }, { label: 'handsome', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成一句描述英俊人物的话。', items: ['handsome', 'is', 'He', '.'], correctOrderIndices: [2, 1, 0, 3] },
);

const featureClues = lessonProfile(
  [
    { word: 'tall', meaning: '高的' },
    { word: 'short', meaning: '身材较矮的或短的' },
    { word: 'big', meaning: '大的' },
    { word: 'thin', meaning: '瘦的' },
  ],
  [
    phraseQuestion('描述一个人的身高较高，哪个词合适？', ['tall', 'short', 'thin'], 0, '描述身高时 tall 表示高的。'),
    phraseQuestion('看到一个很大的箱子，可以用哪个词？', ['big', 'thin', 'short'], 0, 'big 表示大的。'),
  ],
  ['身高线索', '体型或大小线索'],
  [
    { label: 'tall', categoryIndex: 0 }, { label: 'short', categoryIndex: 0 },
    { label: 'big', categoryIndex: 1 }, { label: 'thin', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“他个子高”。', items: ['tall', 'He', '.', 'is'], correctOrderIndices: [1, 3, 0, 2] },
);

const kindAndHeight = lessonProfile(
  [
    { word: 'handsome', meaning: '英俊的' },
    { word: 'pretty', meaning: '漂亮的' },
    { word: 'tall', meaning: '高的' },
    { word: 'short', meaning: '身材较矮的或短的' },
  ],
  [
    phraseQuestion('想用英语说“他很英俊”，哪句正确？', ['He is handsome.', 'She is pretty.', 'He is short.'], 0, 'handsome 表示英俊的。'),
    phraseQuestion('描述一位女性的外貌时，哪句表达“她很漂亮”？', ['She is pretty.', 'He is handsome.', 'She is tall.'], 0, 'pretty 表示漂亮的。'),
  ],
  ['描述外貌', '描述身高'],
  [
    { label: 'handsome', categoryIndex: 0 }, { label: 'pretty', categoryIndex: 0 },
    { label: 'tall', categoryIndex: 1 }, { label: 'short', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“她个子矮”。', items: ['short', 'She', 'is', '.'], correctOrderIndices: [1, 2, 0, 3] },
);

export const unit = buildEnglishUnit({
  formalUnitNumber: 3,
  entryId: 'unit-03',
  title: '第三单元 · My Friends',
  sourceTopics: ['big、thin、tall、short', 'handsome 与 pretty', '使用简单形容词描述人物'],
  basicTasks: [
    makeTask('朋友特征观察站', '认识常见描述词，并练习用 tall、short 等词表达特征。', 'companion-02', heightWords),
    makeTask('友善描述练习场', '辨认外貌描述词，并用简短句子表达观察。', 'companion-03', appearanceWords),
  ],
  advancedTasks: [
    makeTask('特征线索挑战', '根据情境选择恰当的描述词，分清身高、大小和外貌词。', 'companion-01', compareClues),
    makeTask('特征词线索分类员', '依据描述对象区分身高、体型和物品大小词，并组织短句。', 'companion-02', featureClues),
  ],
  highTasks: [
    makeTask('我的朋友介绍卡', '综合运用形容词写出简单、清楚且友善的人物介绍。', 'companion-04', kindDescriptions),
    makeTask('友善人物描述策划师', '组合外貌与身高词汇，选择恰当代词完成礼貌、清楚的介绍。', 'companion-03', kindAndHeight),
  ],
});
