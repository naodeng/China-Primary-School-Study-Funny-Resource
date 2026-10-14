import { buildEnglishUnit } from '../buildEnglishUnit';
import { lessonProfile, makeTask, phraseQuestion } from '../questionAuthoring';

const holidayWords = lessonProfile(
  [
    { word: 'card', meaning: '卡片' },
    { word: 'present', meaning: '礼物' },
    { word: 'Christmas tree', meaning: '圣诞树' },
    { word: 'Father Christmas', meaning: '圣诞老人' },
  ],
  [
    phraseQuestion('“圣诞快乐！”可以怎样说？', ['Merry Christmas!', 'Happy New Year!', 'Thank you!'], 0, 'Merry Christmas! 是圣诞节的祝福语。'),
    phraseQuestion('“新年快乐！”对应哪一句？', ['Happy New Year!', 'Merry Christmas!', 'Good night!'], 0, 'Happy New Year! 是新年祝福语。'),
  ],
  ['节日物品', '节日人物'],
  [
    { label: 'card', categoryIndex: 0 }, { label: 'present', categoryIndex: 0 },
    { label: 'Christmas tree', categoryIndex: 0 }, { label: 'Father Christmas', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成一句新年祝福。', items: ['New', 'Happy', 'Year', '!'], correctOrderIndices: [1, 0, 2, 3] },
);

const giveAndThank = lessonProfile(
  [
    { word: 'present', meaning: '礼物' },
    { word: 'card', meaning: '卡片' },
    { word: 'Father Christmas', meaning: '圣诞老人' },
    { word: 'Christmas tree', meaning: '圣诞树' },
  ],
  [
    phraseQuestion('收到礼物后，哪句可以表达感谢？', ['Thank you.', 'Happy New Year!', 'Where are you going?'], 0, 'Thank you. 表示“谢谢你”。'),
    phraseQuestion('别人送来一张卡片，可以怎样说？', ['Thank you.', 'Good morning.', 'What is this?'], 0, '收到礼物或卡片时可以礼貌地说 Thank you.。'),
  ],
  ['礼物或装饰', '节日祝福或礼貌用语'],
  [
    { label: 'present', categoryIndex: 0 }, { label: 'Christmas tree', categoryIndex: 0 },
    { label: 'Merry Christmas!', categoryIndex: 1 }, { label: 'Thank you.', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“谢谢你”。', items: ['you', '.', 'Thank'], correctOrderIndices: [2, 0, 1] },
);

const holidayGreetings = lessonProfile(
  [
    { word: 'Christmas tree', meaning: '圣诞树' },
    { word: 'card', meaning: '卡片' },
    { word: 'present', meaning: '礼物' },
    { word: 'Father Christmas', meaning: '圣诞老人' },
  ],
  [
    phraseQuestion('节日里想祝朋友圣诞快乐，选哪句？', ['Merry Christmas!', 'Happy New Year!', 'Thank you!'], 0, '圣诞节祝福可以说 Merry Christmas!'),
    phraseQuestion('朋友祝你新年快乐，你可以怎样回应？', ['Happy New Year to you, too!', 'Merry Christmas!', 'What can you see?'], 0, 'to you, too 表示“你也一样”，用于友好回应祝福。'),
  ],
  ['节日装饰或礼物', '节日人物'],
  [
    { label: 'Christmas tree', categoryIndex: 0 }, { label: 'card', categoryIndex: 0 },
    { label: 'present', categoryIndex: 0 }, { label: 'Father Christmas', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“圣诞快乐！”', items: ['Christmas', 'Merry', '!'], correctOrderIndices: [1, 0, 2] },
);

const holidayKindness = lessonProfile(
  [
    { word: 'card', meaning: '卡片' },
    { word: 'present', meaning: '礼物' },
    { word: 'Christmas tree', meaning: '圣诞树' },
    { word: 'Father Christmas', meaning: '圣诞老人' },
  ],
  [
    phraseQuestion('听到“Thank you.”，哪句回应最礼貌？', ['You are welcome.', 'Good night.', 'Where is the park?'], 0, 'You are welcome. 可以回应别人的感谢。'),
    phraseQuestion('收到节日礼物时，哪句话最合适？', ['Thank you.', 'I am a tree.', 'Where are you going?'], 0, '收到礼物时说 Thank you.，表达感谢。'),
  ],
  ['用来表达感谢', '节日物品'],
  [
    { label: 'Thank you.', categoryIndex: 0 }, { label: 'You are welcome.', categoryIndex: 0 },
    { label: 'card', categoryIndex: 1 }, { label: 'present', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“欢迎你”。', items: ['welcome', 'You', 'are', '.'], correctOrderIndices: [1, 2, 0, 3] },
);

export const unit = buildEnglishUnit({
  formalUnitNumber: 6,
  entryId: 'unit-06',
  title: '第六单元 · Happy Holidays',
  sourceTopics: ['Father Christmas、card、Christmas tree、present', '圣诞节与新年问候', '表达感谢和礼貌回应'],
  basicTasks: [
    makeTask('节日词卡礼物盒', '认读节日物品与人物词汇，学会选择合适的节日祝福。', 'companion-04', holidayWords),
    makeTask('感谢与分享练习场', '认识礼物和卡片，练习收到礼物时表达感谢。', 'companion-02', giveAndThank),
  ],
  advancedTask: makeTask('节日问候挑战', '根据节日情境选择祝福语，练习友好回应。', 'companion-03', holidayGreetings),
  highTask: makeTask('节日礼貌小使者', '综合运用节日词汇、祝福和礼貌用语完成情境交流。', 'companion-01', holidayKindness),
});
