import { buildEnglishUnit } from '../../../term-1/english/buildEnglishUnit';
import { lessonProfile, makeTask, phraseQuestion } from '../../../term-1/english/questionAuthoring';

const activitiesAndWeather = lessonProfile(
  [
    { word: 'play football', meaning: '踢足球' },
    { word: 'swim', meaning: '游泳' },
    { word: 'sunny', meaning: '晴朗的' },
    { word: 'rainy', meaning: '下雨的' },
  ],
  [
    phraseQuestion('天气晴朗，小队想去踢足球，哪句表达合适？', ["It's sunny. We can play football.", "It's rainy. We can play football.", "It's sunny. We can play a weather."], 0, 'sunny 表示晴朗的；can 表示会或能够。'),
    phraseQuestion('想问朋友会不会游泳，哪句正确？', ['Can your friend swim?', 'What time is your friend?', 'Can your friend weather?'], 0, 'Can…? 可以询问会不会做某事。'),
  ],
  ['天气词', '活动词组'],
  [
    { label: 'sunny', categoryIndex: 0 }, { label: 'rainy', categoryIndex: 0 },
    { label: 'swim', categoryIndex: 1 }, { label: 'play football', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我们会游泳”。', items: ['swim', 'We', '.', 'can'], correctOrderIndices: [1, 3, 0, 2] },
);

const seasonsAndPlay = lessonProfile(
  [
    { word: 'spring', meaning: '春天' },
    { word: 'summer', meaning: '夏天' },
    { word: 'autumn', meaning: '秋天' },
    { word: 'winter', meaning: '冬天' },
  ],
  [
    phraseQuestion('“我最喜欢的季节是夏天。”可以怎样说？', ['My favourite season is summer.', 'My favourite season is winter.', 'My favourite season is autumn.'], 0, 'summer 表示夏天。'),
    phraseQuestion('想说春天可以放风筝，哪句通顺？', ['I can fly a kite in spring.', 'I can spring a kite.', 'I can fly a season.'], 0, 'in spring 表示在春天。'),
  ],
  ['季节名称', '四季中的活动表达'],
  [
    { label: 'spring', categoryIndex: 0 }, { label: 'winter', categoryIndex: 0 },
    { label: 'I can fly a kite in spring.', categoryIndex: 1 }, { label: 'I can play football in summer.', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“夏天很热”。', items: ['hot', 'Summer', 'is', '.'], correctOrderIndices: [1, 2, 0, 3] },
);

const weatherSeasonClues = lessonProfile(
  [
    { word: 'windy', meaning: '有风的' },
    { word: 'cloudy', meaning: '多云的' },
    { word: 'spring', meaning: '春天' },
    { word: 'winter', meaning: '冬天' },
  ],
  [
    phraseQuestion('“春天暖和又有风。”哪句表达完整？', ['It is warm and windy in spring.', 'It is autumn in windy.', 'It is winter and warm in a season.'], 0, 'warm 和 windy 描述天气，in spring 说明季节。'),
    phraseQuestion('天空有很多云，哪一个天气词更符合？', ['cloudy', 'sunny', 'spring'], 0, 'cloudy 表示多云。'),
  ],
  ['季节词', '天气词'],
  [
    { label: 'spring', categoryIndex: 0 }, { label: 'winter', categoryIndex: 0 },
    { label: 'windy', categoryIndex: 1 }, { label: 'cloudy', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“冬天很冷”。', items: ['cold', '.', 'is', 'Winter'], correctOrderIndices: [3, 2, 0, 1] },
);

const playtimeSeasons = lessonProfile(
  [
    { word: 'fly a kite', meaning: '放风筝' },
    { word: 'play football', meaning: '踢足球' },
    { word: 'autumn', meaning: '秋天' },
    { word: 'summer', meaning: '夏天' },
  ],
  [
    phraseQuestion('小队会踢足球，哪句话表达了这个能力？', ['We can play football.', 'We can play autumn.', 'We cannot a football.'], 0, 'can 后面接活动词组。'),
    phraseQuestion('想问同伴最喜欢哪个季节，可以怎么问？', ['Which season do you like best?', 'Which football is the season?', 'What time do you like best?'], 0, '询问喜欢哪个季节，可以用 Which season…?'),
  ],
  ['活动词组', '季节名称'],
  [
    { label: 'fly a kite', categoryIndex: 0 }, { label: 'play football', categoryIndex: 0 },
    { label: 'autumn', categoryIndex: 1 }, { label: 'summer', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我会放风筝”。', items: ['a kite', 'can', '.', 'I', 'fly'], correctOrderIndices: [3, 1, 4, 0, 2] },
);

const activityWeatherReview = lessonProfile(
  [
    { word: 'play football', meaning: '踢足球' },
    { word: 'fly a kite', meaning: '放风筝' },
    { word: 'sunny', meaning: '晴朗的' },
    { word: 'windy', meaning: '有风的' },
  ],
  [
    phraseQuestion('天气晴朗，想说“我们会踢足球”，哪句合适？', ["It's sunny. We can play football.", "It's windy. We cannot a football.", "It's sunny. We can play a weather."], 0, 'sunny 描述天气，can play football 表达会做的活动。'),
    phraseQuestion('想问朋友会不会放风筝，哪句正确？', ['Can you fly a kite?', "What's the weather like today?", 'What time is it today?'], 0, '用 Can you…? 询问活动能力。'),
  ],
  ['天气词', '活动表达'],
  [
    { label: 'sunny', categoryIndex: 0 }, { label: 'windy', categoryIndex: 0 },
    { label: 'I can play football.', categoryIndex: 1 }, { label: 'We can fly a kite.', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我们会踢足球”。', items: ['football', 'We', '.', 'can', 'play'], correctOrderIndices: [1, 3, 4, 0, 2] },
);

const seasonAbilityReview = lessonProfile(
  [
    { word: 'spring', meaning: '春天' },
    { word: 'winter', meaning: '冬天' },
    { word: 'swim', meaning: '游泳' },
    { word: 'fly a kite', meaning: '放风筝' },
  ],
  [
    phraseQuestion('“春天有风。”哪句天气表达合适？', ['It is windy in spring.', 'It is spring in windy.', 'It is rainy in winter.'], 0, 'windy 描述天气，in spring 表示在春天。'),
    phraseQuestion('小朋友会游泳，哪句正确？', ['I can swim.', 'I cannot swim.', 'I can swim a kite.'], 0, 'can 后面直接接活动词。'),
  ],
  ['季节或天气', '活动能力句子'],
  [
    { label: 'spring', categoryIndex: 0 }, { label: 'windy in winter', categoryIndex: 0 },
    { label: 'She can swim.', categoryIndex: 1 }, { label: 'He cannot fly a kite.', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我会在春天放风筝”。', items: ['in spring', 'a kite', '.', 'I', 'can', 'fly'], correctOrderIndices: [3, 4, 5, 1, 0, 2] },
);

export const unit = buildEnglishUnit({
  term: 2,
  formalUnitNumber: null,
  entryId: 'review-01',
  type: 'review',
  title: '复习一 · Units 1–3',
  sourceTopics: ['复习 Unit 1 Playtime', '复习 Unit 2 Weather', '复习 Unit 3 Seasons'],
  basicTasks: [
    makeTask('活动与天气复习站', '回顾活动能力表达和常见天气词汇。', 'companion-01', activitiesAndWeather),
    makeTask('四季与活动复习站', '整理四季名称，练习介绍季节和适合的活动。', 'companion-03', seasonsAndPlay),
  ],
  advancedTasks: [
    makeTask('天气季节线索挑战', '结合天气词和季节词理解完整描述。', 'companion-04', weatherSeasonClues),
    makeTask('活动天气复习任务', '把天气线索和活动能力表达搭配起来完成简单问答。', 'companion-01', activityWeatherReview),
  ],
  highTasks: [
    makeTask('前三单元综合小队任务', '把活动能力与季节表达结合起来完成情境问答。', 'companion-02', playtimeSeasons),
    makeTask('季节能力组合挑战', '综合使用季节、天气和活动能力句子介绍合适的活动。', 'companion-03', seasonAbilityReview),
  ],
});
