import { buildEnglishUnit } from '../buildEnglishUnit';
import { lessonProfile, makeTask, phraseQuestion } from '../questionAuthoring';

const places = lessonProfile(
  [
    { word: 'bookshop', meaning: '书店' },
    { word: 'supermarket', meaning: '超市' },
    { word: 'zoo', meaning: '动物园' },
    { word: 'park', meaning: '公园' },
  ],
  [
    phraseQuestion('“我正要去公园。”可以怎样说？', ['I am going to the park.', 'I am going to the zoo.', 'I am at the bookshop.'], 0, 'going to 表示正要前往某地。'),
    phraseQuestion('“你要去哪里？”对应哪句？', ['Where are you going?', 'What can you see?', 'Who is your friend?'], 0, '询问要去哪里，可以用 Where are you going?'),
  ],
  ['买书或购物', '看动物或休闲'],
  [
    { label: 'bookshop', categoryIndex: 0 }, { label: 'supermarket', categoryIndex: 0 },
    { label: 'zoo', categoryIndex: 1 }, { label: 'park', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我正要去动物园”。', items: ['the', 'zoo', '.', 'I', 'going', 'to', 'am'], correctOrderIndices: [3, 6, 4, 5, 0, 1, 2] },
);

const communityPlaces = lessonProfile(
  [
    { word: 'school', meaning: '学校' },
    { word: 'hospital', meaning: '医院' },
    { word: 'bookshop', meaning: '书店' },
    { word: 'supermarket', meaning: '超市' },
  ],
  [
    phraseQuestion('“他在学校。”对应哪一句？', ['He is at school.', 'He is at the hospital.', 'She is at school.'], 0, 'at school 表示在学校。'),
    phraseQuestion('想问“她在哪里？”，应该选哪句？', ['Where is she?', 'Where are you going?', 'What is this?'], 0, '询问她在哪里，可以说 Where is she?'),
  ],
  ['学习或就医地点', '购物地点'],
  [
    { label: 'school', categoryIndex: 0 }, { label: 'hospital', categoryIndex: 0 },
    { label: 'bookshop', categoryIndex: 1 }, { label: 'supermarket', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“她在医院”。', items: ['hospital', 'the', 'She', '.', 'at', 'is'], correctOrderIndices: [2, 5, 4, 1, 0, 3] },
);

const askForDirections = lessonProfile(
  [
    { word: 'zoo', meaning: '动物园' },
    { word: 'park', meaning: '公园' },
    { word: 'school', meaning: '学校' },
    { word: 'hospital', meaning: '医院' },
  ],
  [
    phraseQuestion('“我们要去学校。”可以怎样说？', ['We are going to school.', 'We are at the zoo.', 'We are going to the park.'], 0, 'going to 表示前往，school 前通常不加 the。'),
    phraseQuestion('“你在哪里？”对应哪句话？', ['Where are you?', 'Where is she?', 'Where are you going?'], 0, '询问对方在哪里，可以说 Where are you?'),
  ],
  ['go to 表示前往', 'at 表示所在地点'],
  [
    { label: 'I am going to the zoo.', categoryIndex: 0 }, { label: 'We are going to the park.', categoryIndex: 0 },
    { label: 'She is at school.', categoryIndex: 1 }, { label: 'He is at the hospital.', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我们正要去公园”。', items: ['park', 'going', 'We', 'the', '.', 'to', 'are'], correctOrderIndices: [2, 6, 1, 5, 3, 0, 4] },
);

const placeHelpers = lessonProfile(
  [
    { word: 'supermarket', meaning: '超市' },
    { word: 'bookshop', meaning: '书店' },
    { word: 'hospital', meaning: '医院' },
    { word: 'zoo', meaning: '动物园' },
  ],
  [
    phraseQuestion('买东西可以去哪里？', ['the supermarket', 'the zoo', 'the hospital'], 0, 'supermarket 表示超市。'),
    phraseQuestion('看动物可以去哪里？', ['the zoo', 'the bookshop', 'the school'], 0, 'zoo 表示动物园。'),
  ],
  ['买东西的地方', '学习或服务地点'],
  [
    { label: 'supermarket', categoryIndex: 0 }, { label: 'bookshop', categoryIndex: 0 },
    { label: 'hospital', categoryIndex: 1 }, { label: 'school', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“他正要去超市”。', items: ['the', 'supermarket', 'He', 'to', 'going', '.', 'is'], correctOrderIndices: [2, 6, 4, 3, 0, 1, 5] },
);

const purposeAndPlaces = lessonProfile(
  [
    { word: 'school', meaning: '学校' },
    { word: 'hospital', meaning: '医院' },
    { word: 'park', meaning: '公园' },
    { word: 'zoo', meaning: '动物园' },
  ],
  [
    phraseQuestion('“我正要去公园。”应该选哪句？', ['I am going to the park.', 'I am at the zoo.', 'I can see a hospital.'], 0, 'going to 表示前往；park 前加 the。'),
    phraseQuestion('“他在医院。”对应哪句？', ['He is at the hospital.', 'He is at school.', 'She is going to the park.'], 0, 'hospital 前用 the；句子主语是 he。'),
  ],
  ['学习或服务地点', '休闲或游览地点'],
  [
    { label: 'school', categoryIndex: 0 }, { label: 'hospital', categoryIndex: 0 },
    { label: 'park', categoryIndex: 1 }, { label: 'zoo', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我正要去学校”。', items: ['school', 'to', 'I', 'going', '.', 'am'], correctOrderIndices: [2, 5, 3, 1, 0, 4] },
);

const communitySentenceBuilder = lessonProfile(
  [
    { word: 'bookshop', meaning: '书店' },
    { word: 'supermarket', meaning: '超市' },
    { word: 'zoo', meaning: '动物园' },
    { word: 'park', meaning: '公园' },
  ],
  [
    phraseQuestion('“我正要去书店。”可以怎样说？', ['I am going to the bookshop.', 'I am at the bookshop.', 'I can see a bookshop.'], 0, 'going to 表示正要前往。'),
    phraseQuestion('想询问“你在哪里？”，应该选哪句？', ['Where are you?', 'Where are you going?', 'What can you see?'], 0, 'Where are you? 询问当前位置。'),
  ],
  ['购物或办事地点', '休闲游览地点'],
  [
    { label: 'bookshop', categoryIndex: 0 }, { label: 'supermarket', categoryIndex: 0 },
    { label: 'zoo', categoryIndex: 1 }, { label: 'park', categoryIndex: 1 },
  ],
  { prompt: '把词卡排成“我正要去动物园”。', items: ['the', 'zoo', '.', 'I', 'going', 'to', 'am'], correctOrderIndices: [3, 6, 4, 5, 0, 1, 2] },
);

export const unit = buildEnglishUnit({
  formalUnitNumber: 4,
  entryId: 'unit-04',
  title: '第四单元 · In the Community',
  sourceTopics: ['bookshop、supermarket、zoo、park', 'school 与 hospital', '询问地点和表达前往某地'],
  basicTasks: [
    makeTask('社区地点发现站', '认读常见地点词汇，练习询问去哪里和表达前往。', 'companion-01', places),
    makeTask('公共地点寻路图', '分辨学校、医院、书店和超市，并练习简单地点问答。', 'companion-04', communityPlaces),
  ],
  advancedTasks: [
    makeTask('社区路线挑战', '根据人物目的辨认地点，正确使用 go to 与 at 表达。', 'companion-03', askForDirections),
    makeTask('地点用途分类赛', '根据学习、服务和游览目的区分地点，并练习前往某地的表达。', 'companion-01', purposeAndPlaces),
  ],
  highTasks: [
    makeTask('社区小向导', '综合运用地点词与问路句式，为同伴选择合适的目的地。', 'companion-02', placeHelpers),
    makeTask('路线句子拼图', '综合辨认社区地点并整理完整的地点问答句。', 'companion-04', communitySentenceBuilder),
  ],
});
