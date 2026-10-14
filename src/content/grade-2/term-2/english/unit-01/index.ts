import { buildEnglishUnit } from '../../../term-1/english/buildEnglishUnit';
import { lessonProfile, makeTask, phraseQuestion } from '../../../term-1/english/questionAuthoring';

const playtimeWords = lessonProfile(
  [
    { word: 'play football', meaning: '踢足球' },
    { word: 'swim', meaning: '游泳' },
    { word: 'ride a bike', meaning: '骑自行车' },
    { word: 'fly a kite', meaning: '放风筝' },
  ],
  [
    phraseQuestion('想问朋友会不会骑自行车，哪句是在询问能力？', ['Can your friend ride a bike?', 'Where is your bike?', 'Do you have a bike?'], 0, '询问会不会做某事，可以用 Can…?'),
    phraseQuestion('“我会游泳。”可以怎样说？', ['I can swim.', 'I can fly a kite.', 'I cannot ride a bike.'], 0, 'can 表示会或能够。'),
  ],
  ['球类活动', '其他户外活动'],
  [
    { label: 'play football', categoryIndex: 0 }, { label: 'swim', categoryIndex: 1 },
    { label: 'ride a bike', categoryIndex: 1 }, { label: 'fly a kite', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我会放风筝”。', items: ['a kite', 'I', '.', 'fly', 'can'], correctOrderIndices: [1, 4, 3, 0, 2] },
);

const canAndCannot = lessonProfile(
  [
    { word: 'swim', meaning: '游泳' },
    { word: 'play football', meaning: '踢足球' },
    { word: 'fly a kite', meaning: '放风筝' },
    { word: 'ride a bike', meaning: '骑自行车' },
  ],
  [
    phraseQuestion('想表达“她不会踢足球”，哪句正确？', ['She cannot play football.', 'She can play football.', 'She is a football.'], 0, 'cannot 或 can’t 表示不会或不能。'),
    phraseQuestion('朋友会放风筝，应该选哪句？', ['He can fly a kite.', 'He cannot fly a kite.', 'He can swim a kite.'], 0, 'fly a kite 表示放风筝。'),
  ],
  ['会做的活动', '还不会的活动'],
  [
    { label: 'I can swim.', categoryIndex: 0 }, { label: 'She can ride a bike.', categoryIndex: 0 },
    { label: 'He cannot play football.', categoryIndex: 1 }, { label: 'They cannot fly a kite.', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“她不会游泳”。', items: ['swim', 'cannot', 'She', '.'], correctOrderIndices: [2, 1, 0, 3] },
);

const playtimeQuestions = lessonProfile(
  [
    { word: 'ride a bike', meaning: '骑自行车' },
    { word: 'swim', meaning: '游泳' },
    { word: 'play football', meaning: '踢足球' },
    { word: 'fly a kite', meaning: '放风筝' },
  ],
  [
    phraseQuestion('小队要问“你会游泳吗？”，哪句合适？', ['Can you swim?', 'Do you swim yesterday?', 'What is swimming?'], 0, '用 Can you…? 询问对方会不会做某事。'),
    phraseQuestion('小队要回答“我们会踢足球。”，哪句正确？', ['We can play football.', 'We cannot play football.', 'We are a football.'], 0, 'can 后面接活动的动词或词组。'),
  ],
  ['Can 开头的问句', 'can 或 cannot 开头的表达'],
  [
    { label: 'Can you ride a bike?', categoryIndex: 0 }, { label: 'Can she swim?', categoryIndex: 0 },
    { label: 'He can fly a kite.', categoryIndex: 1 }, { label: 'We cannot play football.', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我们会踢足球”。', items: ['football', 'We', 'play', '.', 'can'], correctOrderIndices: [1, 4, 2, 0, 3] },
);

const activityPlanner = lessonProfile(
  [
    { word: 'swim', meaning: '游泳' },
    { word: 'ride a bike', meaning: '骑自行车' },
    { word: 'fly a kite', meaning: '放风筝' },
    { word: 'play football', meaning: '踢足球' },
  ],
  [
    phraseQuestion('问队友“你会放风筝吗？”，应该选哪句？', ['Can you fly a kite?', 'Can you ride a football?', 'Where is your kite?'], 0, 'fly a kite 表示放风筝。'),
    phraseQuestion('想说“我还不会骑自行车”，哪句表达清楚？', ['I cannot ride a bike yet.', 'I can ride a bike.', 'I cannot swim a bike.'], 0, 'cannot 表示不会；yet 表示目前还没有。'),
  ],
  ['会做某项活动', '目前还不会某项活动'],
  [
    { label: 'She can swim.', categoryIndex: 0 }, { label: 'He can play football.', categoryIndex: 0 },
    { label: 'I cannot ride a bike yet.', categoryIndex: 1 }, { label: 'We cannot fly a kite yet.', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“他会骑自行车”。', items: ['a bike', 'can', 'He', '.', 'ride'], correctOrderIndices: [2, 1, 4, 0, 3] },
);

export const unit = buildEnglishUnit({
  term: 2,
  formalUnitNumber: 1,
  entryId: 'unit-01',
  title: '第一单元 · Playtime',
  sourceTopics: ['游泳、踢足球、骑自行车和放风筝', '用 can 与 cannot 表达能力', '询问和回答会不会做某项活动'],
  basicTasks: [
    makeTask('运动词卡探险', '认读常见活动词组，并用 can 表达自己会做的活动。', 'companion-01', playtimeWords),
    makeTask('会做还是还不会', '练习 can 与 cannot，听懂并表达活动能力。', 'companion-03', canAndCannot),
  ],
  advancedTask: makeTask('活动能力问答挑战', '根据情境询问和回答能力，留意 can 后的动词形式。', 'companion-02', playtimeQuestions),
  highTask: makeTask('小队活动规划师', '综合运用活动词组与肯定、否定表达，帮助小队安排活动。', 'companion-04', activityPlanner),
});
