import { buildMathUnit } from '../buildMathUnit';
import { calculate, choose, chooseNumber, makeTask, pair, q8, sortInto } from '../questionAuthoring';

const times = (left: number, right: number) => calculate(
  `每组有${right}个，${left}组一共有多少个？`, `${left} × ${right}`, left * right,
  `把${right}个一组重复数${left}次。`, `${left}组${right}个可以写成${left}乘${right}，结果是${left * right}。`,
);

export const unit = buildMathUnit({
  formalUnitNumber: 4,
  title: '第四单元 · 表内乘法（一）',
  sourceTopics: ['理解乘法表示几个相同加数的和', '练习2、3、4、5、6的乘法口诀及简单应用'],
  basicTasks: [
    makeTask('相同加数转换器', '用几个相同的加数认识乘法，读懂乘法算式表示的意思。', 'companion-02', q8([
      times(2, 3), times(3, 2), times(4, 2), times(5, 2), times(2, 4),
      chooseNumber('4个盒子，每盒有3颗星，一共有多少颗？', 12, [7, 16], '用4个3相加，也可以写成乘法。', '4乘3等于12颗。'),
      pair('把相同加数和乘法算式配起来。', [['2 + 2 + 2', '3 × 2'], ['4 + 4', '2 × 4'], ['5 + 5 + 5', '3 × 5']], '数一数相同的加数出现了几次。', '加数相同，可以用乘法表示重复相加。'),
      sortInto('把题目分到“加数相同”或“加数不同”。', ['加数相同', '加数不同'], [
        { label: '3 + 3 + 3', categoryIndex: 0 }, { label: '2 + 4 + 2', categoryIndex: 1 },
        { label: '5 + 5', categoryIndex: 0 }, { label: '1 + 3 + 5', categoryIndex: 1 },
      ], '检查每一项是不是相同的数。', '几个相同加数的和可以用乘法表示。'),
    ])),
    makeTask('2到6的口诀练习场', '用乘法口诀计算，并在平均分组的情境中求总数。', 'companion-03', q8([
      times(2, 6), times(3, 4), times(4, 5), times(5, 6),
      times(6, 3), times(4, 4),
      chooseNumber('每辆车坐5人，6辆车可以坐多少人？', 30, [11, 35], '6个5相加。', '6乘5等于30人。'),
      choose('3×4表示什么？', ['3个4相加', '3和4相加', '4个3相减'], 0, '乘法表示相同数的重复相加。', '3乘4表示3个4相加，结果是12。'),
    ])),
  ],
  advancedTask: makeTask('乘法规律探索挑战', '比较乘法算式和相同加数，发现交换因数后积不变。', 'companion-04', q8([
    times(6, 4), times(4, 6), times(3, 5), times(5, 3),
    pair('把乘法算式和相同的积配起来。', [['2 × 6', '12'], ['3 × 4', '12'], ['5 × 4', '20']], '使用乘法口诀逐个计算。', '不同算式有时会得到相同的积。'),
    chooseNumber('6×4和4×6的积有什么关系？', 24, [10, 20], '交换两个因数后再用口诀算一算。', '两道算式的积都是24。'),
    sortInto('把算式分到“积是12”或“积不是12”。', ['积是12', '积不是12'], [
      { label: '3 × 4', categoryIndex: 0 }, { label: '2 × 5', categoryIndex: 1 },
      { label: '6 × 2', categoryIndex: 0 }, { label: '4 × 4', categoryIndex: 1 },
    ], '用口诀计算每一道算式。', '3乘4和6乘2的积是12。'),
    choose('表示4个5相加，哪道乘法算式合适？', ['4 × 5', '4 + 5', '5 - 4'], 0, '第一个数表示有几组。', '4个5相加写成4乘5。'),
  ])),
  highTask: makeTask('星岛分组任务设计', '为物品分组创编乘法问题，选择算式并解释口诀依据。', 'companion-01', q8([
    chooseNumber('6个小组每组有4张任务卡，一共多少张？', 24, [20, 28], '用6个4相加。', '6乘4等于24张。'),
    chooseNumber('6张桌子每张坐3人，可以坐多少人？', 18, [9, 21], '数一数有几组相同的人数。', '6乘3等于18人。'),
    times(5, 4), times(3, 6),
    pair('把故事和算式配起来。', [['4袋，每袋2个', '4 × 2'], ['3排，每排5盆', '3 × 5'], ['6组，每组4人', '6 × 4']], '组数和每组数量对应两个因数。', '按组数乘每组数量列式。'),
    sortInto('把情境分到“适合乘法”或“还不是相同分组”。', ['适合乘法', '还不是相同分组'], [
      { label: '4盘，每盘3个点心', categoryIndex: 0 }, { label: '一篮2个苹果和3个梨', categoryIndex: 1 },
      { label: '5排，每排6把椅子', categoryIndex: 0 }, { label: '3本不同页数的书', categoryIndex: 1 },
    ], '乘法情境里每组的数量相同。', '相同数量的分组适合用乘法求总数。'),
    choose('你怎样解释4×3=12？', ['4组，每组3个，合起来12个', '4和3合起来是12', '12组，每组4个'], 0, '把算式中的两个因数放回分组情境。', '4组、每组3个，共有12个。'),
    chooseNumber('5排座位，每排有5个座位，一共有多少个？', 25, [20, 30], '用5个5相加，也可以用乘法口诀。', '5乘5等于25个座位。'),
  ])),
});
