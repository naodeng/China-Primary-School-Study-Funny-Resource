import { buildEnglishUnit } from '../../../term-1/english/buildEnglishUnit';
import { lessonProfile, makeTask, phraseQuestion } from '../../../term-1/english/questionAuthoring';

const weatherWords = lessonProfile(
  [
    { word: 'sunny', meaning: '晴朗的' },
    { word: 'rainy', meaning: '下雨的' },
    { word: 'windy', meaning: '有风的' },
    { word: 'cloudy', meaning: '多云的' },
  ],
  [
    phraseQuestion('天空布满云，哪句描述天气最合适？', ["It's cloudy.", "It's sunny.", "It's windy."], 0, 'cloudy 表示多云的。'),
    phraseQuestion('想询问今天的天气，可以说哪句？', ["What's the weather like today?", 'What time is it today?', 'What day is it today?'], 0, 'weather 表示天气。'),
  ],
  ['有阳光或下雨', '有风或多云'],
  [
    { label: 'sunny', categoryIndex: 0 }, { label: 'rainy', categoryIndex: 0 },
    { label: 'windy', categoryIndex: 1 }, { label: 'cloudy', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“今天天气晴朗”。', items: ['sunny', 'today', '.', "It's"], correctOrderIndices: [3, 0, 1, 2] },
);

const weatherReports = lessonProfile(
  [
    { word: 'rainy', meaning: '下雨的' },
    { word: 'sunny', meaning: '晴朗的' },
    { word: 'cloudy', meaning: '多云的' },
    { word: 'windy', meaning: '有风的' },
  ],
  [
    phraseQuestion('窗外正在下雨，天气预报可以怎样说？', ["It's rainy.", "It's sunny.", "It's cloudy."], 0, 'rainy 表示下雨的。'),
    phraseQuestion('天气晴朗，哪句适合放在天气小卡片上？', ["It's sunny today.", "It's rainy today.", "It's windy today."], 0, 'sunny 表示晴朗的。'),
  ],
  ['晴天或雨天', '多云或刮风'],
  [
    { label: 'sunny', categoryIndex: 0 }, { label: 'rainy', categoryIndex: 0 },
    { label: 'cloudy', categoryIndex: 1 }, { label: 'windy', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“天气正在下雨”。', items: ['rainy', "It's", '.', 'today'], correctOrderIndices: [1, 0, 3, 2] },
);

const chooseForWeather = lessonProfile(
  [
    { word: 'cloudy', meaning: '多云的' },
    { word: 'windy', meaning: '有风的' },
    { word: 'sunny', meaning: '晴朗的' },
    { word: 'rainy', meaning: '下雨的' },
  ],
  [
    phraseQuestion('云很多、太阳被遮住，哪个天气词更符合？', ['cloudy', 'sunny', 'rainy'], 0, 'cloudy 表示多云。'),
    phraseQuestion('风吹动了树叶，哪句描述天气？', ["It's windy.", "It's rainy.", "It's sunny."], 0, 'windy 表示有风的。'),
  ],
  ['天气晴朗或下雨', '天气多云或有风'],
  [
    { label: 'sunny', categoryIndex: 0 }, { label: 'rainy', categoryIndex: 0 },
    { label: 'cloudy', categoryIndex: 1 }, { label: 'windy', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“今天有风”。', items: ['windy', 'today', '.', "It's"], correctOrderIndices: [3, 0, 1, 2] },
);

const weatherReporter = lessonProfile(
  [
    { word: 'sunny', meaning: '晴朗的' },
    { word: 'cloudy', meaning: '多云的' },
    { word: 'rainy', meaning: '下雨的' },
    { word: 'windy', meaning: '有风的' },
  ],
  [
    phraseQuestion('天气卡片写着“有风”，应该选哪个单词？', ['windy', 'cloudy', 'sunny'], 0, 'windy 表示有风的。'),
    phraseQuestion('想说“上海今天下雨”，哪句合适？', ["It's rainy in Shanghai today.", "It's sunny in Shanghai today.", "It's windy in Shanghai today."], 0, '地点可以放在天气描述中，说明天气发生在哪里。'),
  ],
  ['天气报告中的地点', '天气特征词'],
  [
    { label: 'Shanghai', categoryIndex: 0 }, { label: 'Beijing', categoryIndex: 0 },
    { label: 'sunny', categoryIndex: 1 }, { label: 'rainy', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“北京今天多云”。', items: ['cloudy', "It's", 'today', 'Beijing', '.', 'in'], correctOrderIndices: [1, 0, 5, 3, 2, 4] },
);

export const unit = buildEnglishUnit({
  term: 2,
  formalUnitNumber: 2,
  entryId: 'unit-02',
  title: '第二单元 · Weather',
  sourceTopics: ['sunny、rainy、windy、cloudy', '询问并描述天气', '把天气词放进简单的日常表达'],
  basicTasks: [
    makeTask('天气词卡观测站', '认读常见天气词汇，练习描述今天的天气。', 'companion-02', weatherWords),
    makeTask('天气小播报练习', '从生活线索判断天气，选择准确的描述词。', 'companion-01', weatherReports),
  ],
  advancedTask: makeTask('天气线索挑战', '根据天空和风雨线索判断天气，并说出完整句子。', 'companion-03', chooseForWeather),
  highTask: makeTask('小小天气播报员', '把地点与天气信息连起来，完成清楚的简短天气报告。', 'companion-04', weatherReporter),
});
