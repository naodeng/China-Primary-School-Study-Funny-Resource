import { buildEnglishUnit } from '../../../term-1/english/buildEnglishUnit';
import { lessonProfile, makeTask, phraseQuestion } from '../../../term-1/english/questionAuthoring';

const weekDays = lessonProfile(
  [
    { word: 'Monday', meaning: '星期一' },
    { word: 'Tuesday', meaning: '星期二' },
    { word: 'Saturday', meaning: '星期六' },
    { word: 'Sunday', meaning: '星期日' },
  ],
  [
    phraseQuestion('今天是星期日，哪句报告了今天是星期几？', ["It's Sunday today.", "It's Monday today.", "It's Saturday today."], 0, 'Sunday 表示星期日。'),
    phraseQuestion('星期六的下一天是星期几？', ['Sunday', 'Monday', 'Tuesday'], 0, 'Sunday 接在 Saturday 后面。'),
  ],
  ['工作日', '周末'],
  [
    { label: 'Monday', categoryIndex: 0 }, { label: 'Tuesday', categoryIndex: 0 },
    { label: 'Saturday', categoryIndex: 1 }, { label: 'Sunday', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“今天是星期一”。', items: ['Monday', 'Today', '.', 'is'], correctOrderIndices: [1, 3, 0, 2] },
);

const weekdayNames = lessonProfile(
  [
    { word: 'Wednesday', meaning: '星期三' },
    { word: 'Thursday', meaning: '星期四' },
    { word: 'Friday', meaning: '星期五' },
    { word: 'Sunday', meaning: '星期日' },
  ],
  [
    phraseQuestion('星期三的下一天是星期几？', ['Thursday', 'Friday', 'Sunday'], 0, 'Wednesday 后面是 Thursday。'),
    phraseQuestion('想说“今天是星期五”，哪句正确？', ["It's Friday today.", "It's Thursday today.", "It's Sunday today."], 0, 'Friday 表示星期五。'),
  ],
  ['星期一到星期五', '周末'],
  [
    { label: 'Wednesday', categoryIndex: 0 }, { label: 'Thursday', categoryIndex: 0 },
    { label: 'Friday', categoryIndex: 0 }, { label: 'Sunday', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“今天是星期四”。', items: ['today', 'Thursday', '.', "It's"], correctOrderIndices: [3, 1, 0, 2] },
);

const dayQuestions = lessonProfile(
  [
    { word: 'Monday', meaning: '星期一' },
    { word: 'Wednesday', meaning: '星期三' },
    { word: 'Saturday', meaning: '星期六' },
    { word: 'Sunday', meaning: '星期日' },
  ],
  [
    phraseQuestion('想问今天是星期几，哪句合适？', ['What day is it today?', 'What time is it today?', 'What is the weather today?'], 0, 'day 在这里表示星期几。'),
    phraseQuestion('“今天是星期六。”可以怎样说？', ["It's Saturday today.", "It's Sunday today.", "It's Monday today."], 0, 'Saturday 表示星期六。'),
  ],
  ['星期几问句', '星期几回答'],
  [
    { label: 'What day is it today?', categoryIndex: 0 }, { label: 'What day is it?', categoryIndex: 0 },
    { label: "It's Wednesday today.", categoryIndex: 1 }, { label: "It's Sunday today.", categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“今天是星期日”。', items: ['Sunday', '.', 'today', "It's"], correctOrderIndices: [3, 0, 2, 1] },
);

const weeklyPlanner = lessonProfile(
  [
    { word: 'Tuesday', meaning: '星期二' },
    { word: 'Thursday', meaning: '星期四' },
    { word: 'Saturday', meaning: '星期六' },
    { word: 'Sunday', meaning: '星期日' },
  ],
  [
    phraseQuestion('小朋友想在星期日和伙伴踢球，哪句安排合适？', ["Let's play football on Sunday.", "Let's play football at Sunday.", "Let's Sunday football play."], 0, 'on 可以放在星期名称前，表示在星期几。'),
    phraseQuestion('上学日里，哪一天排在星期二之后？', ['Wednesday', 'Monday', 'Saturday'], 0, 'Tuesday 的下一天是 Wednesday。'),
  ],
  ['上学日', '周末日'],
  [
    { label: 'Tuesday', categoryIndex: 0 }, { label: 'Thursday', categoryIndex: 0 },
    { label: 'Saturday', categoryIndex: 1 }, { label: 'Sunday', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我们星期日去踢足球”。', items: ['football', 'on Sunday', 'play', '.', "Let's"], correctOrderIndices: [4, 2, 0, 1, 3] },
);

const weekdaySequence = lessonProfile(
  [
    { word: 'Monday', meaning: '星期一' },
    { word: 'Tuesday', meaning: '星期二' },
    { word: 'Thursday', meaning: '星期四' },
    { word: 'Saturday', meaning: '星期六' },
  ],
  [
    phraseQuestion('星期二的下一天是星期几？', ['Wednesday', 'Monday', 'Saturday'], 0, 'Tuesday 后面是 Wednesday。'),
    phraseQuestion('想询问今天是星期几，哪句合适？', ['What day is it today?', 'What time is it?', 'What is the weather like today?'], 0, '用 What day is it today? 询问星期。'),
  ],
  ['星期名称', '星期表达句'],
  [
    { label: 'Monday', categoryIndex: 0 }, { label: 'Saturday', categoryIndex: 0 },
    { label: "It's Tuesday today.", categoryIndex: 1 }, { label: 'What day is it today?', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“今天是星期四”。', items: ['Thursday', "It's", 'today', '.'], correctOrderIndices: [1, 0, 2, 3] },
);

const weekendPlanCheck = lessonProfile(
  [
    { word: 'Saturday', meaning: '星期六' },
    { word: 'Sunday', meaning: '星期日' },
    { word: 'Monday', meaning: '星期一' },
    { word: 'Wednesday', meaning: '星期三' },
  ],
  [
    phraseQuestion('小队计划星期日踢足球，哪句正确？', ["Let's play football on Sunday.", "Let's play football at Sunday.", "Let's Sunday play a football."], 0, '星期名称前用 on 表示在星期几。'),
    phraseQuestion('星期一的下一天是星期几？', ['Tuesday', 'Thursday', 'Sunday'], 0, 'Tuesday 接在 Monday 后面。'),
  ],
  ['工作日', '周末'],
  [
    { label: 'Monday', categoryIndex: 0 }, { label: 'Wednesday', categoryIndex: 0 },
    { label: 'Saturday', categoryIndex: 1 }, { label: 'Sunday', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我们星期六踢足球”。', items: ['on Saturday', 'football', '.', 'play', "Let's"], correctOrderIndices: [4, 3, 1, 0, 2] },
);

export const unit = buildEnglishUnit({
  term: 2,
  formalUnitNumber: 6,
  entryId: 'unit-06',
  title: '第六单元 · My Week',
  sourceTopics: ['星期一至星期日', '询问和回答今天是星期几', '在星期安排简单活动'],
  basicTasks: [
    makeTask('星期词卡星历', '认读常见星期名称，区分工作日和周末。', 'companion-03', weekDays),
    makeTask('一周顺序练习站', '回顾星期名称和相邻日期的先后顺序。', 'companion-01', weekdayNames),
  ],
  advancedTasks: [
    makeTask('今天星期几挑战', '根据日历线索提问和回答今天是星期几。', 'companion-02', dayQuestions),
    makeTask('星期顺序解码站', '辨认星期名称，利用相邻日期线索完成问答。', 'companion-01', weekdaySequence),
  ],
  highTasks: [
    makeTask('一周活动规划师', '按星期安排活动，练习使用 on 加星期名称。', 'companion-04', weeklyPlanner),
    makeTask('周末活动计划校对', '区分工作日和周末，并检查活动安排中的星期表达。', 'companion-03', weekendPlanCheck),
  ],
});
