import { buildEnglishUnit } from '../buildEnglishUnit';
import { lessonProfile, makeTask, phraseQuestion } from '../questionAuthoring';

const placesAndPark = lessonProfile(
  [
    { word: 'supermarket', meaning: '超市' },
    { word: 'zoo', meaning: '动物园' },
    { word: 'lake', meaning: '湖' },
    { word: 'boat', meaning: '小船' },
  ],
  [
    phraseQuestion('想说“我正要去动物园”，哪句合适？', ['I am going to the zoo.', 'I am going to the lake.', 'I can see a supermarket.'], 0, 'zoo 表示动物园；going to 表示前往。'),
    phraseQuestion('“我能看见一艘船。”对应哪句？', ['I can see a boat.', 'I can see a lake.', 'I am at the zoo.'], 0, 'boat 表示小船。'),
  ],
  ['社区地点', '公园景物'],
  [
    { label: 'supermarket', categoryIndex: 0 }, { label: 'zoo', categoryIndex: 0 },
    { label: 'lake', categoryIndex: 1 }, { label: 'boat', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我正要去超市”。', items: ['supermarket', 'I', 'to', 'am', '.', 'going', 'the'], correctOrderIndices: [1, 3, 5, 2, 6, 0, 4] },
);

const natureAndPlaces = lessonProfile(
  [
    { word: 'tree', meaning: '树' },
    { word: 'flower', meaning: '花' },
    { word: 'park', meaning: '公园' },
    { word: 'hospital', meaning: '医院' },
  ],
  [
    phraseQuestion('“我能看见一棵树。”可以怎样说？', ['I can see a tree.', 'I can see a flower.', 'I am going to a hospital.'], 0, 'tree 表示树。'),
    phraseQuestion('需要看病时，哪个地点词合适？', ['hospital', 'park', 'bookshop'], 0, 'hospital 表示医院。'),
  ],
  ['公园里的景物', '社区服务地点'],
  [
    { label: 'tree', categoryIndex: 0 }, { label: 'flower', categoryIndex: 0 },
    { label: 'hospital', categoryIndex: 1 }, { label: 'school', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我能看见一朵花”。', items: ['flower', 'see', 'I', 'a', '.', 'can'], correctOrderIndices: [2, 5, 1, 3, 0, 4] },
);

const holidaysAndGreetings = lessonProfile(
  [
    { word: 'card', meaning: '卡片' },
    { word: 'present', meaning: '礼物' },
    { word: 'Christmas tree', meaning: '圣诞树' },
    { word: 'Father Christmas', meaning: '圣诞老人' },
  ],
  [
    phraseQuestion('节日里收到礼物，可以说什么？', ['Thank you.', 'Where are you going?', 'What can you see?'], 0, 'Thank you. 表示谢谢。'),
    phraseQuestion('“圣诞快乐！”对应哪句？', ['Merry Christmas!', 'Happy New Year!', 'Good morning!'], 0, 'Merry Christmas! 是圣诞节的祝福。'),
  ],
  ['节日物品', '礼貌表达'],
  [
    { label: 'card', categoryIndex: 0 }, { label: 'present', categoryIndex: 0 },
    { label: 'Thank you.', categoryIndex: 1 }, { label: 'Merry Christmas!', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成一句新年祝福。', items: ['Year', 'New', 'Happy', '!'], correctOrderIndices: [2, 1, 0, 3] },
);

const combinedAdventure = lessonProfile(
  [
    { word: 'bookshop', meaning: '书店' },
    { word: 'grass', meaning: '草' },
    { word: 'present', meaning: '礼物' },
    { word: 'hill', meaning: '小山' },
  ],
  [
    phraseQuestion('想说“我正要去书店”，哪句正确？', ['I am going to the bookshop.', 'I can see the bookshop.', 'Happy New Year!'], 0, 'going to 表示前往。'),
    phraseQuestion('“我能看见一座小山。”对应哪句？', ['I can see a hill.', 'I can see a present.', 'I am at the bookshop.'], 0, 'hill 表示小山。'),
  ],
  ['社区地点或自然景物', '节日物品'],
  [
    { label: 'bookshop', categoryIndex: 0 }, { label: 'hill', categoryIndex: 0 },
    { label: 'present', categoryIndex: 1 }, { label: 'card', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我能看见一份礼物”。', items: ['present', 'a', 'I', 'see', '.', 'can'], correctOrderIndices: [2, 5, 3, 1, 0, 4] },
);

export const unit = buildEnglishUnit({
  formalUnitNumber: null,
  entryId: 'review-02',
  type: 'review',
  title: '复习二 · Units 4–6',
  sourceTopics: ['复习 Unit 4 社区地点', '复习 Unit 5 公园与自然景物', '复习 Unit 6 节日词汇与问候'],
  basicTasks: [
    makeTask('社区与公园复习站', '回顾社区地点、公园景物和“我能看见……”表达。', 'companion-01', placesAndPark),
    makeTask('自然与地点分类站', '分辨公园景物和社区服务地点，练习简单句。', 'companion-03', natureAndPlaces),
  ],
  advancedTask: makeTask('节日问候复习挑战', '回顾节日物品词汇，并选择礼貌、合适的节日祝福。', 'companion-04', holidaysAndGreetings),
  highTask: makeTask('后半学期英语大探险', '串联社区、自然和节日词汇，完成情境表达。', 'companion-02', combinedAdventure),
});
