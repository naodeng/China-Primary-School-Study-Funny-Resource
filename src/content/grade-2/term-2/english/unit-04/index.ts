import { buildEnglishUnit } from '../../../term-1/english/buildEnglishUnit';
import { arrange, choose, lessonProfile, makeTask, pair, phraseQuestion, q8, sortInto, type EnglishTaskSpec } from '../../../term-1/english/questionAuthoring';

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

const timeReportAudit: EnglishTaskSpec = {
  title: '时间消息修复员',
  objective: '对照钟面、英文问答和时间记录，找出不一致的信息并修正。',
  companionId: 'companion-02',
  questions: q8([
    choose(`钟面是7:40，时间消息有错误：“It's 5:00.”。应把消息改成哪句？`, ["It's 7:40.", 'What time is it?', "It's 5:00."], 0, '逐位对照钟面和报时句中的数字。', "钟面显示7:40，正确报时是“It's 7:40.”。"),
    choose("时间卡写着“It's 11:30.”，要检查哪一面钟？", ['11:30', '2:50', '5:00'], 0, '报时句里的数字就是要核对的时刻。', '“11:30”与报时句完全一致。'),
    pair('把发现的时间消息问题和处理方法配起来。', [
      ["钟面7:40，消息是“It's 2:50.”", "改为“It's 7:40.”"],
      ["钟面5:00，消息是“It's 5:00.”", '保留原句'],
      ['想询问现在几点', '使用“What time is it?”'],
    ], '先判断信息是询问还是报时，再核对时间数字。', '钟面与报时数字相同就保留；不同就改成正确时间；提问用“What time is it?”。'),
    sortInto('把时间消息分到“信息一致”或“需要修正”。', ['信息一致', '需要修正'], [
      { label: "钟面11:30，消息“It's 11:30.”", categoryIndex: 0 },
      { label: "钟面2:50，消息“It's 5:00.”", categoryIndex: 1 },
      { label: "钟面5:00，消息“It's 5:00.”", categoryIndex: 0 },
      { label: "钟面7:40，消息“It's 11:30.”", categoryIndex: 1 },
    ], '把钟面上的时刻和句子里的时刻逐一对照。', '两边时刻相同，信息才一致；时刻不同就需要修正。'),
    choose('伙伴看见钟面2:50，想问现在几点，应该先说哪句？', ['What time is it?', "It's 2:50.", 'What day is it?'], 0, '想知道时间时，先使用时间问句。', '“What time is it?”的意思是“现在几点？”。'),
    arrange('按顺序检查一条报时消息。', ['把钟面数字和句子数字对照', '读清钟面上的时刻', '如果不一致，就改正报时句', '再读一遍检查'], [1, 0, 2, 3], '先分别读清钟面和报时句，再比较。', '先读时间，再比对，发现错误后修正并重新检查。'),
    choose('钟面显示5:00，伙伴问“What time is it?”。哪句回答合适？', ["It's 5:00.", 'What time is it?', "It's 7:40."], 0, '回答要报出钟面显示的时刻。', "钟面是5:00，合适的回答是“It's 5:00.”。"),
    sortInto('检查报时句是否和钟面相符。', ['可以发送', '先修改'], [
      { label: "钟面7:40，报时“It's 7:40.”", categoryIndex: 0 },
      { label: "钟面11:30，报时“It's 2:50.”", categoryIndex: 1 },
      { label: "钟面2:50，报时“It's 2:50.”", categoryIndex: 0 },
      { label: "钟面5:00，报时“It's 11:30.”", categoryIndex: 1 },
    ], '检查每条消息里的时间数字。', '钟面与报时一致可以发送；不一致时先修正。'),
  ]),
};

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
    makeTask('星岛时间播报员', '读出钟面数字并用英文报时句准确播报，完成简短时间问答。', 'companion-04', timeReporter),
    timeReportAudit,
  ],
});
