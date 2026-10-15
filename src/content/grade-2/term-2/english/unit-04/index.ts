import { buildEnglishUnit } from '../../../term-1/english/buildEnglishUnit';
import { lessonProfile, makeTask, phraseQuestion } from '../../../term-1/english/questionAuthoring';

const clockTimes = lessonProfile(
  [
    { word: '7:40', meaning: '七点四十分' },
    { word: '11:30', meaning: '十一点三十分' },
    { word: '2:50', meaning: '两点五十分' },
    { word: '5:00', meaning: '五点整' },
  ],
  [
    phraseQuestion('钟面显示 11:30，哪句话报出了这个时间？', ["It's 11:30.", "It's 7:40.", "It's 2:50."], 0, '按钟面显示的数字选择相同时间。'),
    phraseQuestion('想询问钟面上的时间，可以说哪句？', ['What time is it?', 'What day is it?', 'What is the weather like?'], 0, '询问时间可以用 What time is it?'),
  ],
  ['整点', '不是整点'],
  [
    { label: '5:00', categoryIndex: 0 }, { label: '7:40', categoryIndex: 1 },
    { label: '11:30', categoryIndex: 1 }, { label: '2:50', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“现在是七点四十分”。', items: ['7:40', "It's", '.'], correctOrderIndices: [1, 0, 2] },
);

const readTheClock = lessonProfile(
  [
    { word: '2:50', meaning: '两点五十分' },
    { word: '5:00', meaning: '五点整' },
    { word: '7:40', meaning: '七点四十分' },
    { word: '11:30', meaning: '十一点三十分' },
  ],
  [
    phraseQuestion('小闹钟显示 2:50，选择正确的时间表达。', ["It's 2:50.", "It's 5:00.", "It's 11:30."], 0, '先对照数字，再检查时和分。'),
    phraseQuestion('“现在是五点整。”哪句正确？', ["It's 5:00.", "It's 7:40.", "It's 2:50."], 0, '5:00 表示五点整。'),
  ],
  ['整点时间', '非整点时间'],
  [
    { label: '5:00', categoryIndex: 0 }, { label: '7:40', categoryIndex: 1 },
    { label: '2:50', categoryIndex: 1 }, { label: '11:30', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“现在是两点五十分”。', items: ['2:50', '.', "It's"], correctOrderIndices: [2, 0, 1] },
);

const timeQuestion = lessonProfile(
  [
    { word: '11:30', meaning: '十一点三十分' },
    { word: '7:40', meaning: '七点四十分' },
    { word: '5:00', meaning: '五点整' },
    { word: '2:50', meaning: '两点五十分' },
  ],
  [
    phraseQuestion('练习卡上的钟面是 7:40，哪句时间相同？', ["It's 7:40.", "It's 11:30.", "It's 5:00."], 0, '把钟面数字与句子中的数字一一对照。'),
    phraseQuestion('小队要问“现在几点？”，选择合适的问题。', ['What time is it?', 'What season is it?', 'What can you do?'], 0, 'time 是时间。'),
  ],
  ['时间数字', '时间句子'],
  [
    { label: '7:40', categoryIndex: 0 }, { label: '11:30', categoryIndex: 0 },
    { label: 'What time is it?', categoryIndex: 1 }, { label: "It's 5:00.", categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“现在是十一点三十分”。', items: ['11:30', "It's", '.'], correctOrderIndices: [1, 0, 2] },
);

const timeReporter = lessonProfile(
  [
    { word: '5:00', meaning: '五点整' },
    { word: '2:50', meaning: '两点五十分' },
    { word: '11:30', meaning: '十一点三十分' },
    { word: '7:40', meaning: '七点四十分' },
  ],
  [
    phraseQuestion('钟面显示 5:00，哪句话报告准确？', ["It's 5:00.", "It's 2:50.", "It's 7:40."], 0, '报告时间时，句子里的数字要与钟面一致。'),
    phraseQuestion("时间卡片写着“It's 11:30.”，钟面应显示什么？", ['11:30', '7:40', '2:50'], 0, '把句子里的数字和钟面逐项核对。'),
  ],
  ['问题或回答', '时间数字'],
  [
    { label: 'What time is it?', categoryIndex: 0 }, { label: "It's 5:00.", categoryIndex: 0 },
    { label: '7:40', categoryIndex: 1 }, { label: '2:50', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“现在是七点四十分”。', items: ['7:40', '.', "It's"], correctOrderIndices: [2, 0, 1] },
);

const clockReadingChallenge = lessonProfile(
  [
    { word: '7:40', meaning: '七点四十分' },
    { word: '11:30', meaning: '十一点三十分' },
    { word: '2:50', meaning: '两点五十分' },
    { word: '5:00', meaning: '五点整' },
  ],
  [
    phraseQuestion('钟面显示 11:30，哪句时间相同？', ["It's 11:30.", "It's 2:50.", "It's 5:00."], 0, '逐位核对钟面和句子里的数字。'),
    phraseQuestion('想问钟面显示的时间，哪句正确？', ['What time is it?', 'What day is it?', 'What is the weather like?'], 0, '用 What time is it? 询问时间。'),
  ],
  ['时间问句', '时间回答'],
  [
    { label: 'What time is it?', categoryIndex: 0 }, { label: 'What time is it today?', categoryIndex: 0 },
    { label: "It's 7:40.", categoryIndex: 1 }, { label: "It's 5:00.", categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“现在是两点五十分”。', items: ['2:50', "It's", '.'], correctOrderIndices: [1, 0, 2] },
);

const timeReportAudit = lessonProfile(
  [
    { word: '5:00', meaning: '五点整' },
    { word: '2:50', meaning: '两点五十分' },
    { word: '11:30', meaning: '十一点三十分' },
    { word: '7:40', meaning: '七点四十分' },
  ],
  [
    phraseQuestion('小钟显示 7:40，哪句报告正确？', ["It's 7:40.", "It's 11:30.", "It's 5:00."], 0, '时间报告中的数字要与钟面一致。'),
    phraseQuestion('想问“现在几点？”，应该选哪句？', ['What time is it?', 'What season is it?', 'What day is it?'], 0, 'time 表示时间。'),
  ],
  ['时间数字', '完整时间问答句'],
  [
    { label: '7:40', categoryIndex: 0 }, { label: '2:50', categoryIndex: 0 },
    { label: "It's 11:30.", categoryIndex: 1 }, { label: 'What time is it?', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“现在是五点整”。', items: ['5:00', '.', "It's"], correctOrderIndices: [2, 0, 1] },
);

export const unit = buildEnglishUnit({
  term: 2,
  formalUnitNumber: 4,
  entryId: 'unit-04',
  title: '第四单元 · Time',
  sourceTopics: ['认识和读出数字时间', 'What time is it?', '用简短句子报告钟面显示的时间'],
  basicTasks: [
    makeTask('钟面数字观察站', '读懂简单数字时间，练习询问和报告钟面上的时间。', 'companion-01', clockTimes),
    makeTask('时间读数练习场', '对照钟面数字辨认整点与非整点时间。', 'companion-02', readTheClock),
  ],
  advancedTasks: [
    makeTask('时间问答挑战', '根据钟面线索选择准确的时间回答，分清问题与回答。', 'companion-03', timeQuestion),
    makeTask('钟面读数挑战', '准确读取数字时间，并区分询问时间和报告时间的表达。', 'companion-01', clockReadingChallenge),
  ],
  highTasks: [
    makeTask('星岛时间播报员', '把时间数字和英文报告句对应起来，检查读数是否一致。', 'companion-04', timeReporter),
    makeTask('时间报告校验员', '检查钟面数字、时间问句和时间报告是否相互匹配。', 'companion-02', timeReportAudit),
  ],
});
