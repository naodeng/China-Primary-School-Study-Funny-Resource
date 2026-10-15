import { buildEnglishUnit } from '../../../term-1/english/buildEnglishUnit';
import { lessonProfile, makeTask, phraseQuestion } from '../../../term-1/english/questionAuthoring';

const timeAndWeek = lessonProfile(
  [
    { word: '7:40', meaning: '七点四十分' },
    { word: '11:30', meaning: '十一点三十分' },
    { word: 'Monday', meaning: '星期一' },
    { word: 'Sunday', meaning: '星期日' },
  ],
  [
    phraseQuestion('日历上标着星期一，钟面显示 7:40，哪组信息匹配？', ['Monday and 7:40', 'Sunday and 11:30', 'Monday and 11:30'], 0, '先分别核对星期和时间。'),
    phraseQuestion('想询问今天是星期几，应该选哪句？', ['What day is it today?', 'What time is it today?', 'What is the season today?'], 0, '询问星期名称用 What day…?'),
  ],
  ['星期名称', '数字时间'],
  [
    { label: 'Monday', categoryIndex: 0 }, { label: 'Sunday', categoryIndex: 0 },
    { label: '7:40', categoryIndex: 1 }, { label: '11:30', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“今天是星期一”。', items: ['Monday', '.', "It's", 'today'], correctOrderIndices: [2, 0, 3, 1] },
);

const routinesAndTimes = lessonProfile(
  [
    { word: 'get up', meaning: '起床' },
    { word: 'eat breakfast', meaning: '吃早餐' },
    { word: 'go to school', meaning: '去上学' },
    { word: 'go home', meaning: '回家' },
  ],
  [
    phraseQuestion('想问朋友每天什么时候吃早餐，哪句合适？', ['When do you eat breakfast every day?', 'What day do you eat breakfast every day?', 'Where do you eat breakfast every day?'], 0, '用 When do you…every day? 询问日常活动时间。'),
    phraseQuestion('“我八点去上学。”可以怎样说？', ['I go to school at eight.', 'I go school on eight.', 'I go home at school.'], 0, 'go to school 表示去上学。'),
  ],
  ['早晨活动', '放学后的活动'],
  [
    { label: 'get up', categoryIndex: 0 }, { label: 'eat breakfast', categoryIndex: 0 },
    { label: 'go to school', categoryIndex: 0 }, { label: 'go home', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我四点回家”。', items: ['home', 'at four', '.', 'go', 'I'], correctOrderIndices: [4, 3, 0, 1, 2] },
);

const planTheDay = lessonProfile(
  [
    { word: 'Monday', meaning: '星期一' },
    { word: 'Sunday', meaning: '星期日' },
    { word: 'get up', meaning: '起床' },
    { word: 'go home', meaning: '回家' },
  ],
  [
    phraseQuestion('星期日的早晨，哪句可以介绍起床时间？', ['I get up at 8:00 on Sunday.', 'I get up Monday at Sunday.', 'I Sunday get 8:00 up.'], 0, 'on Sunday 表示在星期日，at 8:00 表示八点。'),
    phraseQuestion('放学以后要回家，哪句合适？', ['I go home after school.', 'I go school after home.', 'I get up after school home.'], 0, 'after school 表示放学后。'),
  ],
  ['星期安排', '日常活动'],
  [
    { label: 'Monday', categoryIndex: 0 }, { label: 'Sunday', categoryIndex: 0 },
    { label: 'get up', categoryIndex: 1 }, { label: 'go home', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我星期一去上学”。', items: ['school', 'on Monday', 'to', 'I', '.', 'go'], correctOrderIndices: [3, 5, 2, 0, 1, 4] },
);

const weekPlanner = lessonProfile(
  [
    { word: 'Tuesday', meaning: '星期二' },
    { word: 'Saturday', meaning: '星期六' },
    { word: '7:40', meaning: '七点四十分' },
    { word: '2:50', meaning: '两点五十分' },
  ],
  [
    phraseQuestion('星期六下午活动卡写着 2:50，哪句信息完全匹配？', ['Saturday at 2:50', 'Tuesday at 7:40', 'Saturday at 7:40'], 0, '同时核对星期名称和时间数字。'),
    phraseQuestion('想约星期二一起活动，哪句包含正确的星期名称？', ["Let's play on Tuesday.", "Let's Tuesday on play.", "Let's play at Tuesday."], 0, '星期名称前用 on 表示在星期几。'),
  ],
  ['星期名称', '活动时间'],
  [
    { label: 'Tuesday', categoryIndex: 0 }, { label: 'Saturday', categoryIndex: 0 },
    { label: '7:40', categoryIndex: 1 }, { label: '2:50', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我们星期二一起玩”。', items: ['on Tuesday', '.', "Let's", 'play'], correctOrderIndices: [2, 3, 0, 1] },
);

export const unit = buildEnglishUnit({
  term: 2,
  formalUnitNumber: null,
  entryId: 'review-02',
  type: 'review',
  title: '复习二 · Units 4–6',
  sourceTopics: ['复习 Unit 4 Time', '复习 Unit 5 My Day：get up、eat breakfast', '复习 Unit 6 My Week'],
  basicTasks: [
    makeTask('星期与时间复习站', '回顾数字时间和星期名称，练习读出日历提示。', 'companion-02', timeAndWeek),
    makeTask('日常时间表复习', '回顾一天中的活动词组和简单时间表达。', 'companion-01', routinesAndTimes),
  ],
  advancedTask: makeTask('我的一天线索挑战', '综合星期和日常活动，为一周中的一天安排计划。', 'companion-03', planTheDay),
  highTask: makeTask('时间与星期综合规划', '根据日期、时刻和活动信息安排一周小队计划。', 'companion-04', weekPlanner),
});
