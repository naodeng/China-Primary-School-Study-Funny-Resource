import { buildEnglishUnit } from '../../../term-1/english/buildEnglishUnit';
import { lessonProfile, makeTask, phraseQuestion } from '../../../term-1/english/questionAuthoring';

const seasons = lessonProfile(
  [
    { word: 'spring', meaning: '春天' },
    { word: 'summer', meaning: '夏天' },
    { word: 'autumn', meaning: '秋天' },
    { word: 'winter', meaning: '冬天' },
  ],
  [
    phraseQuestion('“我最喜欢春天。”可以怎样说？', ['I like spring best.', 'I like winter best.', 'I like autumn best.'], 0, 'spring 表示春天。'),
    phraseQuestion('一年中比较冷的季节是哪一个？', ['winter', 'summer', 'spring'], 0, 'winter 表示冬天，很多地方冬天比较冷。'),
  ],
  ['春天和夏天', '秋天和冬天'],
  [
    { label: 'spring', categoryIndex: 0 }, { label: 'summer', categoryIndex: 0 },
    { label: 'autumn', categoryIndex: 1 }, { label: 'winter', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我喜欢秋天”。', items: ['autumn', '.', 'like', 'I'], correctOrderIndices: [3, 2, 0, 1] },
);

const seasonWeather = lessonProfile(
  [
    { word: 'summer', meaning: '夏天' },
    { word: 'winter', meaning: '冬天' },
    { word: 'spring', meaning: '春天' },
    { word: 'autumn', meaning: '秋天' },
  ],
  [
    phraseQuestion('春天来了，天气暖和并且有风，哪句合适？', ['It is warm and windy in spring.', 'It is cold in summer.', 'It is rainy in winter.'], 0, 'warm 表示暖和，windy 表示有风。'),
    phraseQuestion('夏天到了，哪句话符合常见季节感受？', ['It is hot in summer.', 'It is cold in summer.', 'It is winter in summer.'], 0, '很多地方夏天比较热。'),
  ],
  ['天气较暖的季节', '天气较凉的季节'],
  [
    { label: 'spring', categoryIndex: 0 }, { label: 'summer', categoryIndex: 0 },
    { label: 'autumn', categoryIndex: 1 }, { label: 'winter', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“春天有风”。', items: ['windy', 'It', 'spring', '.', 'is', 'in'], correctOrderIndices: [1, 4, 0, 5, 2, 3] },
);

const chooseASeason = lessonProfile(
  [
    { word: 'autumn', meaning: '秋天' },
    { word: 'spring', meaning: '春天' },
    { word: 'winter', meaning: '冬天' },
    { word: 'summer', meaning: '夏天' },
  ],
  [
    phraseQuestion('小朋友喜欢秋天，怎样介绍这个喜好？', ['My favourite season is autumn.', 'My favourite season is winter.', 'My favourite season is summer.'], 0, 'favourite 表示最喜欢的。'),
    phraseQuestion('“春天暖和。”对应哪句？', ['Spring is warm.', 'Winter is warm.', 'Summer is winter.'], 0, 'warm 表示暖和的。'),
  ],
  ['最喜欢的季节表达', '季节名称'],
  [
    { label: 'My favourite season is autumn.', categoryIndex: 0 }, { label: 'My favourite season is summer.', categoryIndex: 0 },
    { label: 'spring', categoryIndex: 1 }, { label: 'winter', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我最喜欢的季节是冬天”。', items: ['winter', 'season', 'My', 'is', 'favourite', '.'], correctOrderIndices: [2, 4, 1, 3, 0, 5] },
);

const seasonGuide = lessonProfile(
  [
    { word: 'spring', meaning: '春天' },
    { word: 'summer', meaning: '夏天' },
    { word: 'autumn', meaning: '秋天' },
    { word: 'winter', meaning: '冬天' },
  ],
  [
    phraseQuestion('“秋天凉爽。”可以怎样说？', ['Autumn is cool.', 'Autumn is hot.', 'Winter is summer.'], 0, 'cool 表示凉爽的。'),
    phraseQuestion('“冬天冷。”对应哪一句？', ['Winter is cold.', 'Summer is cold.', 'Spring is autumn.'], 0, 'cold 表示冷的。'),
  ],
  ['暖和或炎热的季节', '凉爽或寒冷的季节'],
  [
    { label: 'spring', categoryIndex: 0 }, { label: 'summer', categoryIndex: 0 },
    { label: 'autumn', categoryIndex: 1 }, { label: 'winter', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“夏天很热”。', items: ['hot', 'Summer', '.', 'is'], correctOrderIndices: [1, 3, 0, 2] },
);

export const unit = buildEnglishUnit({
  term: 2,
  formalUnitNumber: 3,
  entryId: 'unit-03',
  title: '第三单元 · Seasons',
  sourceTopics: ['春、夏、秋、冬四季', '描述季节常见的天气', '介绍自己喜欢的季节'],
  basicTasks: [
    makeTask('四季词卡收藏册', '认读四季名称，练习说出自己喜欢的季节。', 'companion-03', seasons),
    makeTask('季节天气观察站', '把常见天气特点与季节联系起来，用简单句描述。', 'companion-02', seasonWeather),
  ],
  advancedTask: makeTask('最喜欢的季节挑战', '根据喜好选择季节，练习 favourite 与季节表达。', 'companion-04', chooseASeason),
  highTask: makeTask('四季小向导', '综合使用四季词汇和天气描述，为伙伴介绍季节特点。', 'companion-01', seasonGuide),
});
