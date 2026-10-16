import type { CatalogEntryType, SubjectId } from '../types';

export interface AddedCourseEntry {
  id: string;
  grade: 1 | 3;
  term: 1 | 2;
  subject: SubjectId;
  slug: string;
  title: string;
  type: CatalogEntryType;
  formalUnitNumber: number | null;
  sourceTopics: readonly string[];
  profileKey: string;
}

type EntryInput = readonly [
  slug: string,
  title: string,
  formalUnitNumber: number | null,
  sourceTopic: string,
  profileKey: string,
  type?: CatalogEntryType,
];

function book(grade: 1 | 3, term: 1 | 2, subject: SubjectId, rows: readonly EntryInput[]): AddedCourseEntry[] {
  return rows.map(([slug, title, formalUnitNumber, sourceTopic, profileKey, type = 'unit']) => ({
    id: `grade-${grade}/term-${term}/${subject}/${slug}`,
    grade,
    term,
    subject,
    slug,
    title,
    type,
    formalUnitNumber,
    sourceTopics: [sourceTopic],
    profileKey,
  }));
}

const addedCourseEntries: AddedCourseEntry[] = [
  ...book(1, 1, 'chinese', [
    ['unit-01', '主题组 01 · 入学启蒙与识字', null, '校园生活识字、口耳目和常见事物', 'g1-school'],
    ['unit-02', '主题组 02 · 汉语拼音（一）', null, '单韵母、声调和声母拼读', 'pinyin-initials'],
    ['unit-03', '主题组 03 · 汉语拼音（二）', null, '复韵母、鼻韵母和整体认读音节', 'pinyin-finals'],
    ['unit-04', '主题组 04 · 四季与自然', null, '四季、天气和自然观察', 'g1-four-seasons'],
    ['unit-05', '主题组 05 · 日常识字', null, '家庭、校园和生活中的常用字', 'g1-daily'],
    ['unit-06', '主题组 06 · 影子与动物', null, '影子、方位和动物特点', 'g1-animals'],
    ['unit-07', '主题组 07 · 成长体验', null, '远近、大小和日常成长表达', 'g1-growth'],
    ['unit-08', '主题组 08 · 自然想象与故事', null, '自然现象、故事顺序和想象表达', 'g1-nature-story'],
  ]),
  ...book(1, 1, 'math', [
    ['unit-01', '第一单元 · 准备课', 1, '数一数、比一比和 0 的初步认识', 'count-5'],
    ['unit-02', '第二单元 · 位置', 2, '上下、前后、左右等位置关系', 'location'],
    ['unit-03', '第三单元 · 5 以内数的认识和加减法', 3, '5 以内数的组成、比较和加减法', 'add-5'],
    ['unit-04', '第四单元 · 认识图形（一）', 4, '长方体、正方体、圆柱和球的直观认识', 'solid-shapes'],
    ['unit-05', '第五单元 · 6～10 的认识和加减法', 5, '6～10 的数及其加减法', 'add-10'],
    ['unit-06', '第六单元 · 11～20 各数的认识', 6, '十和几个一、数序及大小比较', 'teen-numbers'],
    ['unit-07', '第七单元 · 认识钟表', 7, '整时和半时的初步认识', 'clock'],
    ['unit-08', '第八单元 · 20 以内的进位加法', 8, '凑十法和 20 以内进位加法', 'make-ten'],
    ['unit-09', '第九单元 · 总复习', 9, '本册数与运算、图形、位置和钟表复习', 'g1-math-review'],
    ['integrated-practice-01', '综合实践 · 数学乐园', null, '在游戏情境中综合运用数数、比较和简单运算', 'math-park', 'integrated-practice'],
  ]),
  ...book(1, 1, 'english', [
    ['unit-01', '第一单元 · School', 1, 'Starter 校园问候、课堂指令、学习用品和学校生活', 'school'],
    ['unit-02', '第二单元 · Face', 2, '眼、耳、鼻、口等面部词汇', 'face'],
    ['unit-03', '第三单元 · Animals', 3, '常见动物名称和简单描述', 'animals'],
    ['unit-04', '第四单元 · Numbers', 4, '1～10 数词和数量表达', 'numbers'],
    ['review-01', '复习一 · Units 1–3', null, '复习校园、面部和动物主题词汇', 'review-school-face-animals', 'review'],
    ['unit-05', '第五单元 · Colours', 5, '常见颜色词和颜色描述', 'colours'],
    ['unit-06', '第六单元 · Fruit', 6, '常见水果名称及喜好表达', 'fruit'],
    ['review-02', '复习二 · Units 4–6', null, '复习数词、颜色和水果主题词汇', 'review-numbers-colours-fruit', 'review'],
  ]),
  ...book(1, 2, 'chinese', [
    ['unit-01', '主题组 01 · 春夏秋冬与识字', null, '四季、天气和常见自然现象', 'g1-seasons'],
    ['unit-02', '主题组 02 · 家庭与愿望', null, '家庭、家乡和愿望表达', 'g1-family'],
    ['unit-03', '主题组 03 · 友谊与游戏', null, '伙伴关系、互助和游戏规则', 'g1-friends'],
    ['unit-04', '主题组 04 · 夜色与节日', null, '夜晚观察、节日习俗和礼貌表达', 'g1-festival'],
    ['unit-05', '主题组 05 · 动物与校园', null, '动物特点、校园活动和生活识字', 'g1-animal-campus'],
    ['unit-06', '主题组 06 · 池塘与雨天', null, '池塘生物、天气变化和连续观察', 'g1-pond'],
    ['unit-07', '主题组 07 · 生活习惯', null, '文具管理、时间顺序和做事习惯', 'g1-habits'],
    ['unit-08', '主题组 08 · 动物故事', null, '动物特点、故事线索和因果表达', 'g1-animal-story'],
  ]),
  ...book(1, 2, 'math', [
    ['unit-01', '第一单元 · 认识图形（二）', 1, '平面图形的辨认和简单拼组', 'plane-shapes'],
    ['unit-02', '第二单元 · 20 以内的退位减法', 2, '破十法、平十法和退位减法', 'subtract-20'],
    ['unit-03', '第三单元 · 分类与整理', 3, '按标准分类、整理并读取简单结果', 'classification'],
    ['unit-04', '第四单元 · 100 以内数的认识', 4, '数位、数序、大小比较和整十数', 'hundred'],
    ['unit-05', '第五单元 · 认识人民币', 5, '元、角、分的认识和简单换算', 'money'],
    ['unit-06', '第六单元 · 100 以内的加法和减法（一）', 6, '整十数及两位数加减一位数或整十数', 'add-sub-100'],
    ['unit-07', '第七单元 · 找规律', 7, '图形和数列中的重复与变化规律', 'patterns'],
    ['unit-08', '第八单元 · 总复习', 8, '本册图形、退位减法、分类、数与运算复习', 'g1-math-review'],
    ['integrated-practice-01', '综合实践 · 摆一摆，想一想', null, '用有限数量的棋子表示不同数位组合', 'place-value-game', 'integrated-practice'],
  ]),
  ...book(1, 2, 'english', [
    ['unit-01', '第一单元 · Classroom', 1, '课堂指令和常见学习用品', 'classroom'],
    ['unit-02', '第二单元 · Room', 2, '房间、家具和位置表达', 'room'],
    ['unit-03', '第三单元 · Toys', 3, '玩具名称、颜色和简单数量', 'toys'],
    ['unit-04', '第四单元 · Food', 4, '常见食物及喜好表达', 'food-g1'],
    ['review-01', '复习一 · Units 1–3', null, '复习课堂、房间和玩具主题词汇', 'review-classroom-room-toys', 'review'],
    ['unit-05', '第五单元 · Drink', 5, '常见饮品和礼貌请求表达', 'drink'],
    ['unit-06', '第六单元 · Clothes', 6, '常见衣物名称和颜色描述', 'clothes-g1'],
    ['review-02', '复习二 · Units 4–6', null, '复习食物、饮品和衣物主题词汇', 'review-food-drink-clothes', 'review'],
  ]),
  ...book(3, 1, 'chinese', [
    ['unit-01', '第一单元 · 校园生活', 1, '校园生活、阅读方法和交流表达', 'g3-school'],
    ['unit-02', '第二单元 · 金秋与观察', 2, '秋天景物、观察顺序和词语积累', 'g3-autumn'],
    ['unit-03', '第三单元 · 童话与想象', 3, '童话人物、想象和故事情节', 'g3-fairy'],
    ['unit-04', '第四单元 · 预测与续写', 4, '依据题目、插图和线索预测故事', 'g3-prediction'],
    ['unit-05', '第五单元 · 自然观察记录', 5, '细致观察、连续记录和交流发现', 'g3-observation'],
    ['unit-06', '第六单元 · 祖国山河', 6, '山川景物、方位和景物特点', 'g3-landscape'],
    ['unit-07', '第七单元 · 自然声音与发现', 7, '自然声音、现象和观察表达', 'g3-nature'],
    ['unit-08', '第八单元 · 人物故事', 8, '人物行为、原因和乐于助人的品质', 'g3-people'],
  ]),
  ...book(3, 1, 'math', [
    ['unit-01', '第一单元 · 时、分、秒', 1, '时间单位、钟面读数和经过时间', 'time'],
    ['unit-02', '第二单元 · 万以内的加法和减法（一）', 2, '三位数加减和估算', 'add-sub-1000'],
    ['unit-03', '第三单元 · 测量', 3, '毫米、厘米、分米、米、千米及质量单位', 'measurement'],
    ['unit-04', '第四单元 · 万以内加减法（二）', 4, '三位数连续进位加法和连续退位减法', 'carry-borrow-1000'],
    ['unit-05', '第五单元 · 倍的认识', 5, '倍的含义及简单倍数关系', 'multiples'],
    ['unit-06', '第六单元 · 多位数乘一位数', 6, '整十、整百和多位数乘一位数', 'multiply-1digit'],
    ['unit-07', '第七单元 · 长方形和正方形', 7, '周长、边长关系和图形周长计算', 'perimeter'],
    ['unit-08', '第八单元 · 分数的初步认识', 8, '平均分、几分之一、几分之几和简单比较', 'fractions'],
    ['unit-09', '第九单元 · 数学广角——集合', 9, '用集合图整理重复与不重复信息', 'sets'],
    ['unit-10', '第十单元 · 总复习', 10, '本册测量、运算、倍、周长、分数和集合复习', 'g3-math-review'],
    ['integrated-practice-01', '综合实践 · 数字编码', null, '用数字编码表达顺序、类别和校验信息', 'number-coding', 'integrated-practice'],
  ]),
  ...book(3, 1, 'english', [
    ['unit-01', '第一单元 · Myself', 1, '姓名、年龄和自我介绍', 'myself'],
    ['unit-02', '第二单元 · My Body', 2, '身体部位和简单描述', 'body'],
    ['unit-03', '第三单元 · Food', 3, '食物、饮食喜好和简单请求', 'food-g3'],
    ['unit-04', '第四单元 · Pets', 4, '宠物、动物特点和照料', 'pets'],
    ['review-01', '复习一 · Units 1–3', null, '复习自我介绍、身体和食物主题词汇', 'review-myself-body-food', 'review'],
    ['unit-05', '第五单元 · Clothes', 5, '衣物名称、颜色和穿着表达', 'clothes-g3'],
    ['unit-06', '第六单元 · Birthdays', 6, '生日、日期和祝福表达', 'birthdays'],
    ['review-02', '复习二 · Units 4–6', null, '复习宠物、衣物和生日主题词汇', 'review-pets-clothes-birthdays', 'review'],
  ]),
  ...book(3, 2, 'chinese', [
    ['unit-01', '第一单元 · 春日与植物', 1, '春天景物、植物生长和观察表达', 'g3-spring'],
    ['unit-02', '第二单元 · 寓言与判断', 2, '寓言线索、人物行为和道理判断', 'g3-fable'],
    ['unit-03', '第三单元 · 传统节日与桥梁', 3, '传统节日、民间故事和桥梁特点', 'g3-culture'],
    ['unit-04', '第四单元 · 观察与实验', 4, '观察记录、实验步骤和结果表达', 'g3-experiment'],
    ['unit-05', '第五单元 · 奇妙想象', 5, '大胆想象、事物特点和创意表达', 'g3-imagination'],
    ['unit-06', '第六单元 · 童年与诚信', 6, '童年经历、人物选择和诚实表达', 'g3-honesty'],
    ['unit-07', '第七单元 · 自然世界', 7, '自然现象、事物特点和资料整理', 'g3-world'],
    ['unit-08', '第八单元 · 故事讲述', 8, '故事顺序、人物语言和完整讲述', 'g3-story'],
  ]),
  ...book(3, 2, 'math', [
    ['unit-01', '第一单元 · 位置与方向（一）', 1, '方向辨认、路线描述和简单方位图', 'directions'],
    ['unit-02', '第二单元 · 除数是一位数的除法', 2, '平均分、除法计算和余数含义', 'division'],
    ['unit-03', '第三单元 · 复式统计表', 3, '读取、比较和整理两类数据', 'two-way-table'],
    ['unit-04', '第四单元 · 两位数乘两位数', 4, '拆分十位和个位进行乘法计算', 'multiply-2digit'],
    ['unit-05', '第五单元 · 面积', 5, '面积单位、长方形与正方形面积', 'area'],
    ['unit-06', '第六单元 · 年、月、日', 6, '月份天数、日期和 24 时计时法', 'calendar'],
    ['unit-07', '第七单元 · 小数的初步认识', 7, '十分位和简单小数比较', 'decimals'],
    ['unit-08', '第八单元 · 数学广角——搭配（二）', 8, '按顺序枚举两类要素的搭配', 'combinations'],
    ['unit-09', '第九单元 · 总复习', 9, '本册方向、除法、统计、乘法、面积、日期和小数复习', 'g3-math-review'],
    ['integrated-practice-01', '综合实践 · 制作活动日历', null, '整理日期、星期和活动安排', 'activity-calendar', 'integrated-practice'],
    ['integrated-practice-02', '综合实践 · 我们的校园', null, '用测量、统计、面积和路线信息介绍校园', 'school-project', 'integrated-practice'],
  ]),
  ...book(3, 2, 'english', [
    ['unit-01', '第一单元 · School Subjects', 1, '学科名称和课程喜好', 'school-subjects'],
    ['unit-02', '第二单元 · My School', 2, '校园地点、设施和简单方位', 'my-school'],
    ['unit-03', '第三单元 · After School Activities', 3, '课后活动和日常安排', 'after-school'],
    ['unit-04', '第四单元 · My Family', 4, '家庭成员和家庭关系', 'family'],
    ['review-01', '复习一 · Units 1–3', null, '复习学科、校园和课后活动主题词汇', 'review-subjects-school-activities', 'review'],
    ['unit-05', '第五单元 · Family Activities', 5, '家庭活动和日常动作', 'family-activities'],
    ['unit-06', '第六单元 · My Home', 6, '房间、家具和家中位置', 'my-home'],
    ['review-02', '复习二 · Units 4–6', null, '复习家庭成员、活动和家中物品主题词汇', 'review-family-activities-home', 'review'],
  ]),
];

export const addedCourseCatalog = addedCourseEntries;
export const addedCourseById = Object.fromEntries(addedCourseEntries.map((entry) => [entry.id, entry])) as Record<string, AddedCourseEntry>;
