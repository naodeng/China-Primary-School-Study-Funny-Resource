import { buildEnglishUnit } from '../buildEnglishUnit';
import { lessonProfile, makeTask, phraseQuestion } from '../questionAuthoring';

const parkWords = lessonProfile(
  [
    { word: 'lake', meaning: '湖' },
    { word: 'boat', meaning: '小船' },
    { word: 'tree', meaning: '树' },
    { word: 'flower', meaning: '花' },
  ],
  [
    phraseQuestion('看到一艘小船，可以怎样说？', ['I can see a boat.', 'I can see a tree.', 'I can see a flower.'], 0, 'boat 表示小船。'),
    phraseQuestion('“这是什么？”对应哪句话？', ['What is this?', 'Where are you going?', 'Who is she?'], 0, '询问眼前的东西是什么，可以说 What is this?'),
  ],
  ['水边词语', '植物词语'],
  [
    { label: 'lake', categoryIndex: 0 }, { label: 'boat', categoryIndex: 0 },
    { label: 'tree', categoryIndex: 1 }, { label: 'flower', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我能看见一棵树”。', items: ['tree', 'a', 'see', 'I', '.', 'can'], correctOrderIndices: [3, 5, 2, 1, 0, 4] },
);

const natureWords = lessonProfile(
  [
    { word: 'grass', meaning: '草' },
    { word: 'hill', meaning: '小山' },
    { word: 'lake', meaning: '湖' },
    { word: 'boat', meaning: '小船' },
  ],
  [
    phraseQuestion('看到一片草，可以选哪句话？', ['I can see grass.', 'I can see a boat.', 'I can see a hill.'], 0, 'grass 表示草，通常不在前面加 a。'),
    phraseQuestion('“我能看见一座小山。”可以怎样说？', ['I can see a hill.', 'I can see a lake.', 'I can see grass.'], 0, 'hill 表示小山。'),
  ],
  ['水边景物', '陆地景物'],
  [
    { label: 'lake', categoryIndex: 0 }, { label: 'boat', categoryIndex: 0 },
    { label: 'hill', categoryIndex: 1 }, { label: 'grass', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我能看见一个湖”。', items: ['a', 'lake', '.', 'I', 'see', 'can'], correctOrderIndices: [3, 5, 4, 0, 1, 2] },
);

const askAndObserve = lessonProfile(
  [
    { word: 'flower', meaning: '花' },
    { word: 'tree', meaning: '树' },
    { word: 'grass', meaning: '草' },
    { word: 'hill', meaning: '小山' },
  ],
  [
    phraseQuestion('看到一朵花，可以怎样说？', ['I can see a flower.', 'I can see a tree.', 'I can see a hill.'], 0, 'flower 表示花。'),
    phraseQuestion('“你能看见什么？”对应哪句话？', ['What can you see?', 'Where are you?', 'Who is your friend?'], 0, '询问能看见什么，可以说 What can you see?'),
  ],
  ['植物', '地形'],
  [
    { label: 'flower', categoryIndex: 0 }, { label: 'grass', categoryIndex: 0 },
    { label: 'hill', categoryIndex: 1 }, { label: 'lake', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“你能看见什么？”', items: ['see', 'What', '?', 'can', 'you'], correctOrderIndices: [1, 3, 4, 0, 2] },
);

const parkReporter = lessonProfile(
  [
    { word: 'boat', meaning: '小船' },
    { word: 'lake', meaning: '湖' },
    { word: 'flower', meaning: '花' },
    { word: 'tree', meaning: '树' },
  ],
  [
    phraseQuestion('小船在湖上，可以选择哪个地点词？', ['lake', 'tree', 'flower'], 0, 'lake 表示湖。'),
    phraseQuestion('“我能看见一朵花。”对应哪句话？', ['I can see a flower.', 'I can see a boat.', 'I can see a tree.'], 0, 'flower 表示花。'),
  ],
  ['可以看见的植物', '可以看见的水景或物品'],
  [
    { label: 'flower', categoryIndex: 0 }, { label: 'tree', categoryIndex: 0 },
    { label: 'lake', categoryIndex: 1 }, { label: 'boat', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我能看见一艘船”。', items: ['boat', 'a', 'can', 'I', '.', 'see'], correctOrderIndices: [3, 2, 5, 1, 0, 4] },
);

const landAndWaterClues = lessonProfile(
  [
    { word: 'grass', meaning: '草' },
    { word: 'hill', meaning: '小山' },
    { word: 'lake', meaning: '湖' },
    { word: 'boat', meaning: '小船' },
  ],
  [
    phraseQuestion('“我能看见草。”应该选哪句？', ['I can see grass.', 'I can see a boat.', 'I can see a hill.'], 0, 'grass 表示草，通常不在前面加 a。'),
    phraseQuestion('“我能看见一个湖。”对应哪句？', ['I can see a lake.', 'I can see a tree.', 'I can see grass.'], 0, 'lake 表示湖，是可数名词，前面用 a。'),
  ],
  ['陆地上的景物', '水面或水上物品'],
  [
    { label: 'grass', categoryIndex: 0 }, { label: 'hill', categoryIndex: 0 },
    { label: 'lake', categoryIndex: 1 }, { label: 'boat', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我能看见一座小山”。', items: ['hill', 'I', 'a', 'see', '.', 'can'], correctOrderIndices: [1, 5, 3, 2, 0, 4] },
);

const parkPictureTalk = lessonProfile(
  [
    { word: 'flower', meaning: '花' },
    { word: 'tree', meaning: '树' },
    { word: 'boat', meaning: '小船' },
    { word: 'lake', meaning: '湖' },
  ],
  [
    phraseQuestion('“你能看见什么？”可以怎样问？', ['What can you see?', 'What is this?', 'Where are you?'], 0, 'What can you see? 用来询问看见了什么。'),
    phraseQuestion('看到一朵花，应该选哪句？', ['I can see a flower.', 'I can see a boat.', 'I can see a lake.'], 0, 'flower 表示花；单数前使用 a。'),
  ],
  ['植物', '水边景物或物品'],
  [
    { label: 'flower', categoryIndex: 0 }, { label: 'tree', categoryIndex: 0 },
    { label: 'boat', categoryIndex: 1 }, { label: 'lake', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我能看见一棵树”。', items: ['tree', 'a', 'see', 'I', '.', 'can'], correctOrderIndices: [3, 5, 2, 1, 0, 4] },
);

export const unit = buildEnglishUnit({
  formalUnitNumber: 5,
  entryId: 'unit-05',
  title: '第五单元 · In the Park',
  sourceTopics: ['lake、boat、tree、grass、flower、hill', 'What is this?', 'What can you see?'],
  basicTasks: [
    makeTask('公园词卡漫步', '认读公园与自然景物词汇，练习表达自己看见的事物。', 'companion-03', parkWords),
    makeTask('自然观察练习场', '分辨水边、植物与陆地景物，并用简单句表达观察。', 'companion-01', natureWords),
  ],
  advancedTasks: [
    makeTask('公园观察问答', '根据公园景物练习提问和回答，选择准确的名词。', 'companion-02', askAndObserve),
    makeTask('陆地与水边线索赛', '按景物特点分类，并用看见句型表达观察结果。', 'companion-01', landAndWaterClues),
  ],
  highTasks: [
    makeTask('自然小播报员', '综合运用地点、景物词汇和观察句式进行简短介绍。', 'companion-04', parkReporter),
    makeTask('公园图景表达挑战', '综合辨认公园景物、组织提问并表达观察内容。', 'companion-03', parkPictureTalk),
  ],
});
