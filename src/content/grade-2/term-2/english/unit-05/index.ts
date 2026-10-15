import { buildEnglishUnit } from '../../../term-1/english/buildEnglishUnit';
import { lessonProfile, makeTask, phraseQuestion } from '../../../term-1/english/questionAuthoring';

const morningRoutine = lessonProfile(
  [
    { word: 'get up', meaning: '起床' },
    { word: 'eat breakfast', meaning: '吃早餐' },
    { word: 'go to school', meaning: '去上学' },
    { word: 'go home', meaning: '回家' },
  ],
  [
    phraseQuestion('想问朋友每天什么时候吃早餐，哪句合适？', ['When do you eat breakfast every day?', 'What day do you eat breakfast every day?', 'Where do you eat breakfast every day?'], 0, '用 When do you…every day? 询问每天做某件事的时间。'),
    phraseQuestion('“我七点吃早餐。”可以怎样说？', ['I eat breakfast at seven.', 'I get up at seven breakfast.', 'I go to school at breakfast.'], 0, 'eat breakfast 表示吃早餐；at 后面接时间。'),
  ],
  ['早晨活动', '放学后的活动'],
  [
    { label: 'get up', categoryIndex: 0 }, { label: 'eat breakfast', categoryIndex: 0 },
    { label: 'go to school', categoryIndex: 0 }, { label: 'go home', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我六点半起床”。', items: ['6:30', 'up', '.', 'I', 'get', 'at'], correctOrderIndices: [3, 4, 1, 5, 0, 2] },
);

const daySchedule = lessonProfile(
  [
    { word: 'go to school', meaning: '去上学' },
    { word: 'go home', meaning: '回家' },
    { word: 'get up', meaning: '起床' },
    { word: 'eat breakfast', meaning: '吃早餐' },
  ],
  [
    phraseQuestion('我每天七点半去上学，哪句表达清楚？', ['I go to school at 7:30.', 'I get up at 7:30 school.', 'I eat breakfast at school 7:30.'], 0, 'go to school 表示去上学，at 后面接时间。'),
    phraseQuestion('“我放学后回家。”可以怎样说？', ['I go home after school.', 'I go school after home.', 'I have home after school.'], 0, 'go home 表示回家。'),
  ],
  ['起床和早餐', '上学和回家'],
  [
    { label: 'get up', categoryIndex: 0 }, { label: 'eat breakfast', categoryIndex: 0 },
    { label: 'go to school', categoryIndex: 1 }, { label: 'go home', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我八点去上学”。', items: ['at 8:00', 'school', 'I', '.', 'to', 'go'], correctOrderIndices: [2, 5, 4, 1, 0, 3] },
);

const askAboutRoutines = lessonProfile(
  [
    { word: 'get up', meaning: '起床' },
    { word: 'eat breakfast', meaning: '吃早餐' },
    { word: 'go to school', meaning: '去上学' },
    { word: 'go home', meaning: '回家' },
  ],
  [
    phraseQuestion('想问朋友每天什么时候起床，哪句合适？', ['When do you get up every day?', 'When do you get up at every day?', 'What day do you get up every day?'], 0, '用 When do you…every day? 询问日常活动时间。'),
    phraseQuestion('“我六点四十分起床。”哪句表达正确？', ['I get up at 6:40.', 'I get up 6:40 at.', 'I get at 6:40 up.'], 0, 'get up 表示起床；at 后接时间。'),
  ],
  ['日常活动问句', '日常安排回答'],
  [
    { label: 'When do you eat breakfast every day?', categoryIndex: 0 }, { label: 'When do you get up every day?', categoryIndex: 0 },
    { label: 'I eat breakfast at 7:00.', categoryIndex: 1 }, { label: 'I go to school at 8:00.', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我七点吃早餐”。', items: ['7:00', 'breakfast', 'I', '.', 'eat', 'at'], correctOrderIndices: [2, 4, 1, 5, 0, 3] },
);

const routinePlanner = lessonProfile(
  [
    { word: 'eat breakfast', meaning: '吃早餐' },
    { word: 'get up', meaning: '起床' },
    { word: 'go home', meaning: '回家' },
    { word: 'go to school', meaning: '去上学' },
  ],
  [
    phraseQuestion('小队要问每天什么时候回家，哪句最合适？', ['When do you go home every day?', 'What day do you go home every day?', 'Where do you go home every day?'], 0, '用 When do you…every day? 询问日常活动时间。'),
    phraseQuestion('“我四点回家。”哪句正确？', ['I go home at four.', 'I go to school at four home.', 'I get up at four home.'], 0, 'go home 表示回家，at four 表示四点。'),
  ],
  ['询问日常时间', '报告日常时间'],
  [
    { label: 'When do you eat breakfast every day?', categoryIndex: 0 }, { label: 'When do you get up every day?', categoryIndex: 0 },
    { label: 'I go home at four.', categoryIndex: 1 }, { label: 'I go to school at eight.', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我八点去上学”。', items: ['school', 'at 8:00', 'go', '.', 'I', 'to'], correctOrderIndices: [4, 2, 5, 0, 1, 3] },
);

export const unit = buildEnglishUnit({
  term: 2,
  formalUnitNumber: 5,
  entryId: 'unit-05',
  title: '第五单元 · My Day',
  sourceTopics: ['get up、eat breakfast、go to school、go home', 'When do you…every day? 日常活动问答', '用 at 加时间介绍一天安排'],
  basicTasks: [
    makeTask('我的早晨时间表', '认读起床、早餐、上学和回家等日常活动词组。', 'companion-02', morningRoutine),
    makeTask('一天安排配对站', '把日常活动与合适的时间表达连起来。', 'companion-01', daySchedule),
  ],
  advancedTask: makeTask('日常时间问答挑战', '用 When 问句和 at 时间回答介绍日常安排。', 'companion-04', askAboutRoutines),
  highTask: makeTask('我的一天规划师', '综合排序一天中的活动，并准确说出活动时间。', 'companion-03', routinePlanner),
});
