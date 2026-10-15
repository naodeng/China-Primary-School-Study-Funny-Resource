import { addedCourseById, type AddedCourseEntry } from '../catalog';
import { buildMathUnit } from '../../grade-2/term-1/math/buildMathUnit';
import { arrange, calculate, choose, chooseNumber, makeTask, pair, q8, sortInto } from '../../grade-2/term-1/math/questionAuthoring';
import type { MathQuestionSpec, MathTaskSpec } from '../../grade-2/term-1/math/questionAuthoring';

type Operator = '+' | '-' | '×' | '÷';
type MathMode = 'arithmetic' | 'count' | 'location' | 'solid-shapes' | 'plane-shapes' | 'place-value' | 'clock' | 'money' | 'measure' | 'patterns' | 'fractions' | 'sets' | 'table' | 'calendar' | 'decimals' | 'combinations' | 'coding' | 'practice' | 'multiples' | 'division' | 'perimeter' | 'area' | 'carry-borrow';
interface MathProfile { mode: MathMode; operator?: Operator; limit?: number; context: string }

const profiles: Record<string, MathProfile> = {
  'count-5': { mode: 'count', limit: 5, context: '不超过 5 的数数与比较' },
  location: { mode: 'location', context: '教室中的位置关系' },
  'add-5': { mode: 'arithmetic', operator: '+', limit: 5, context: '5 以内数的组成、比较和加减法' },
  'solid-shapes': { mode: 'solid-shapes', context: '球、圆柱、正方体和长方体' },
  'add-10': { mode: 'arithmetic', operator: '+', limit: 10, context: '10 以内加减法' },
  'teen-numbers': { mode: 'place-value', limit: 20, context: '11～20 的数位和数序' },
  clock: { mode: 'clock', context: '整时和半时' },
  'make-ten': { mode: 'arithmetic', operator: '+', limit: 20, context: '凑十法和 20 以内进位加法' },
  'g1-math-review': { mode: 'practice', limit: 20, context: '一年级数与运算、图形、位置和时间' },
  'math-park': { mode: 'practice', limit: 10, context: '数学乐园里的数数、比较和简单运算' },
  'plane-shapes': { mode: 'plane-shapes', context: '三角形、长方形、正方形和圆' },
  'subtract-20': { mode: 'arithmetic', operator: '-', limit: 20, context: '20 以内退位减法' },
  classification: { mode: 'sets', context: '按清楚的标准分类并读取结果' },
  hundred: { mode: 'place-value', limit: 100, context: '100 以内的数位、数序和大小比较' },
  money: { mode: 'money', context: '元、角、分和简单换算' },
  'add-sub-100': { mode: 'arithmetic', operator: '+', limit: 100, context: '100 以内整十数和两位数的加减' },
  patterns: { mode: 'patterns', context: '图形和数列的重复或递增规律' },
  'place-value-game': { mode: 'place-value', limit: 20, context: '用棋子表示个位和十位' },
  time: { mode: 'clock', context: '时、分、秒和简单经过时间' },
  'add-sub-1000': { mode: 'arithmetic', operator: '+', limit: 1000, context: '万以内加减法和估算' },
  measurement: { mode: 'measure', context: '毫米、厘米、分米、米和千米的换算' },
  'carry-borrow-1000': { mode: 'carry-borrow', context: '三位数连续进位加法与连续退位减法' },
  multiples: { mode: 'multiples', context: '几倍的含义和简单倍数关系' },
  'multiply-1digit': { mode: 'arithmetic', operator: '×', limit: 9, context: '多位数乘一位数' },
  perimeter: { mode: 'perimeter', context: '长方形和正方形的周长' },
  fractions: { mode: 'fractions', context: '平均分、几分之一和同分母分数比较' },
  sets: { mode: 'sets', context: '集合图中的重复与不重复信息' },
  'g3-math-review': { mode: 'practice', limit: 1000, context: '三年级测量、运算、几何、分数和数据复习' },
  'number-coding': { mode: 'coding', context: '数字编码中的顺序、类别和唯一性' },
  directions: { mode: 'location', context: '方向、路线和方位图' },
  division: { mode: 'division', context: '一位数除法和余数' },
  'two-way-table': { mode: 'table', context: '读取和比较复式统计表中的数据' },
  'multiply-2digit': { mode: 'arithmetic', operator: '×', limit: 99, context: '两位数乘两位数' },
  area: { mode: 'area', context: '长方形和正方形面积及面积单位' },
  calendar: { mode: 'calendar', context: '月份天数、日期和 24 时计时法' },
  decimals: { mode: 'decimals', context: '十分位和简单小数大小比较' },
  combinations: { mode: 'combinations', context: '按顺序枚举搭配方案' },
  'activity-calendar': { mode: 'calendar', context: '活动日历中的日期、星期和时间安排' },
  'school-project': { mode: 'practice', limit: 100, context: '校园测量、统计、面积和路线' },
};

const taskTitles = {
  basic: ['基础概念练习站', '一步应用小队'],
  advanced: ['新情境解题挑战', '方法比较研究员'],
  high: ['多步方案设计师', '检查与解释小专家'],
} as const;
const objectives = {
  basic: ['熟悉本主题的核心概念，完成一步辨认或计算。', '把所学方法用于一个熟悉的小情境，并检查答案。'],
  advanced: ['将本主题方法迁移到新情境，读清条件后选择解法。', '比较两种相关信息或方法，并说明怎样验证结果。'],
  high: ['组合已学信息安排解题步骤，保持运算或推理过程清楚。', '检查可能出现的错误，解释判断依据并修正方案。'],
} as const;

function seedFor(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): number {
  return entry.grade * 17 + entry.term * 11 + (entry.formalUnitNumber ?? taskIndex + 3) * 7 + taskIndex * 13
    + (difficulty === 'basic' ? 0 : difficulty === 'advanced' ? 19 : 37);
}

function orderedValues(items: readonly number[]): number[] {
  return [...items].sort((left, right) => left - right);
}

function varyChoicePositions(questions: readonly MathQuestionSpec[], seed: number): MathQuestionSpec[] {
  return questions.map((question, index) => {
    if (question.kind !== 'choice') return question;
    const shift = (seed + index) % 3;
    if (shift === 0) return question;
    return {
      ...question,
      options: [...question.options.slice(shift), ...question.options.slice(0, shift)] as [string, string, string],
      correctOptionIndex: ((question.correctOptionIndex - shift + 3) % 3) as 0 | 1 | 2,
    };
  });
}

function makeCarryBorrow(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const seed = seedFor(entry, difficulty, taskIndex);
  const additions = [['368 + 257', 625], ['459 + 176', 635], ['578 + 246', 824], ['687 + 158', 845]] as const;
  const subtractions = [['705 - 286', 419], ['803 - 457', 346], ['602 - 275', 327], ['901 - 568', 333]] as const;
  const addition = additions[seed % additions.length]!;
  const subtraction = subtractions[(seed + taskIndex) % subtractions.length]!;
  const otherAddition = additions[(seed + 2) % additions.length]!;
  const otherSubtraction = subtractions[(seed + taskIndex + 2) % subtractions.length]!;
  const calculations = [addition, subtraction, otherAddition, otherSubtraction] as const;
  const [addLeft, addRight] = addition[0].split(' + ').map(Number);
  const [subLeft, subRight] = subtraction[0].split(' - ').map(Number);
  const finalQuestion = difficulty === 'basic'
    ? choose(`减法 ${subtraction[0]} 算完后，怎样检查结果？`, [`用差加上 ${subRight}，看是否回到 ${subLeft}`, '只检查数字写得是否整齐', '把减数再减一次'], 0, '减法可以用加法检查。', `${subtraction[1]} + ${subRight} = ${subLeft}，可以检查原来的减法。`)
    : difficulty === 'advanced'
      ? taskIndex === 0
        ? choose(`计算 ${addition[0]} = ${addition[1]} 后，哪一步能用来核对？`, [`用和减去 ${addRight}，看是否得到 ${addLeft}`, '只看个位数字', '把两个加数相减后当作和'], 0, '加法可以用和减去一个加数来检查。', `${addition[1]} - ${addRight} = ${addLeft}，核对成立。`)
        : choose(`同伴计算 ${subtraction[0]} 得 ${subtraction[1] + 10}。怎样最快发现结果不对？`, [`把这个差加上 ${subRight}，检查是否回到 ${subLeft}`, '只看被减数有几位', '把减数写成加数'], 0, '用逆运算检查是否回到被减数。', `${subtraction[1] + 10} + ${subRight} 不等于 ${subLeft}，所以结果不对。`)
      : taskIndex === 0
        ? choose(`计算 ${subtraction[0]} 时若连续退位，怎样避免漏减？`, ['从个位开始，逐位记录借位并最后用加法验算', '先写答案，再随意改动十位', '只检查最高位'], 0, '连续退位要记录每一位的变化。', '逐位处理借位，再用“差 + 减数 = 被减数”核对。')
        : choose(`要说明 ${addition[0]} 的结果可靠，怎样完整核对？`, [`先估计结果范围，再用 ${addition[1]} - ${addRight} 检查是否得到 ${addLeft}`, '只写出和，不看加数', '把个位相加当作整个答案'], 0, '结合估算和逆运算检查。', `${addition[0]} = ${addition[1]}；${addition[1]} - ${addRight} = ${addLeft}，结果在合理范围内。`);
  return [
    calculate(`计算：${addition[0]} = ?`, addition[0], addition[1], '从个位开始计算，满十向前一位进 1。', `${addition[0]} = ${addition[1]}，个位和十位都需要进位。`),
    calculate(`计算：${subtraction[0]} = ?`, subtraction[0], subtraction[1], '从个位开始，个位不够减时向十位借 1；十位不够时再向百位借。', `${subtraction[0]} = ${subtraction[1]}，需要连续退位。`),
    pair('把三位数算式和得数连起来。', calculations.map(([expression, answer]) => [expression, String(answer)] as const), '先按数位对齐，再从个位开始计算。', '每道题都要按数位逐步进位或退位。'),
    chooseNumber('428 + 397 = ?', 825, [815, 835], '个位相加满十要进位，十位相加后还要继续检查。', '428 + 397 = 825。'),
    sortInto('把算式按“需要进位或退位”和“不需要进退位”分类。', ['需要进位或退位', '不需要进退位'], [{ label: '368 + 257', categoryIndex: 0 }, { label: '705 - 286', categoryIndex: 0 }, { label: '251 + 142', categoryIndex: 1 }, { label: '684 - 231', categoryIndex: 1 }], '检查个位和十位计算时是否需要借位或进位。', '前两题在相邻数位间需要进位或退位；后两题各数位都能直接计算。'),
    arrange('列竖式计算时按步骤排列。', ['从个位开始算', '把相同数位对齐', '检查并处理进位或退位', '写出各数位结果'], [1, 0, 2, 3], '先对齐数位，再从个位计算。', '数位对齐后从个位开始，逐位处理进退位并写出结果。'),
    calculate(`图书角原有 ${addLeft} 本书，又收到 ${addRight} 本，现在有多少本？`, addition[0], addition[1], '把原有数量和收到的数量相加，并逐位进位。', `${addition[0]} = ${addition[1]} 本。`),
    finalQuestion,
  ];
}

function makeArithmetic(entry: AddedCourseEntry, p: MathProfile, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const seed = seedFor(entry, difficulty, taskIndex);
  const operator = p.operator ?? '+';
  const limit = p.limit ?? 100;
  const equations: Array<{ expression: string; answer: number }> = [];
  for (let index = 0; index < 4; index += 1) {
    const currentOperator: Operator = p.context.includes('加减') && index % 2 === 1 ? '-' : operator;
    if (limit <= 10 && (currentOperator === '+' || currentOperator === '-')) {
      const answer = limit <= 5
        ? 1 + ((seed + index) % 4)
        : 2 + ((seed + index) % 8);
      if (currentOperator === '+') {
        const a = (seed + index * 2) % (answer + 1);
        const b = answer - a;
        equations.push({ expression: `${a} + ${b}`, answer });
      } else {
        const maxSubtrahend = limit - answer;
        const b = 1 + ((seed + index * 2) % maxSubtrahend);
        const a = answer + b;
        equations.push({ expression: `${a} - ${b}`, answer });
      }
      continue;
    }
    if (currentOperator === '+') {
      let a: number;
      let b: number;
      if (p.context.includes('凑十')) {
        a = 8 + (seed % 3);
        b = 5 + index;
      } else if (entry.grade === 1 && entry.term === 2 && limit <= 100 && p.context.includes('整十数和两位数')) {
        if (index % 4 === 0) {
          const ones = 1 + (seed % 8);
          a = (2 + (seed % 6)) * 10 + ones;
          b = 1 + ((seed + index) % (9 - ones));
        } else {
          const firstTens = 2 + (seed % 4);
          const secondTens = 1 + ((seed + index) % (8 - firstTens));
          a = firstTens * 10;
          b = secondTens * 10;
        }
      } else if (limit <= 20) {
        a = 6 + index;
        b = 2 + index;
      } else if (limit <= 100) {
        a = 20 + (seed % 3) * 10;
        b = index === 0 ? 10 : 14;
      } else {
        a = 350 + (seed % 4) * 100 + index * 13;
        b = 120 + index * 17;
      }
      equations.push({ expression: `${a} + ${b}`, answer: a + b });
    } else if (currentOperator === '-') {
      let a: number;
      let b: number;
      if (limit <= 20) {
        const ones = 1 + ((seed + index) % 5);
        a = 10 + ones;
        b = ones + index + 1;
      } else if (entry.grade === 1 && entry.term === 2 && limit <= 100 && p.context.includes('整十数和两位数')) {
        if (index % 4 === 1) {
          const ones = 2 + (seed % 7);
          a = (3 + (seed % 6)) * 10 + ones;
          b = 1 + ((seed + index) % ones);
        } else {
          const firstTens = 3 + (seed % 6);
          const subtractedTens = 1 + ((seed + index) % (firstTens - 1));
          a = firstTens * 10;
          b = subtractedTens * 10;
        }
      } else if (limit <= 100) {
        a = 70 + (seed % 3) * 10;
        b = index === 1 ? 12 : 18;
      } else {
        a = 350 + (seed % 4) * 100 + index * 13;
        b = 120 + index * 17;
      }
      equations.push({ expression: `${a} - ${b}`, answer: a - b });
    } else if (operator === '×') {
      if (limit >= 90) {
        const a = 11 + (seed % 28);
        const b = 11 + index * 3;
        equations.push({ expression: `${a} × ${b}`, answer: a * b });
      } else if (p.context.includes('倍')) {
        const a = 2 + (seed % 8);
        const b = 2 + index;
        equations.push({ expression: `${a} × ${b}`, answer: a * b });
      } else {
        const a = 12 + (seed % 60);
        const b = 2 + index;
        equations.push({ expression: `${a} × ${b}`, answer: a * b });
      }
    } else {
      const divisor = 2 + ((seed + index) % 8);
      const quotient = (p.context.includes('余数') ? 11 : 3) + index + (seed % 4);
      const remainder = p.context.includes('余数') ? (seed + index) % divisor : 0;
      const dividend = divisor * quotient + remainder;
      equations.push({ expression: `${dividend} ÷ ${divisor}`, answer: quotient });
    }
  }

  const results = equations.map(({ answer }) => answer);
  const orderedIndexes = results.map((_, index) => index).sort((left, right) => results[left]! - results[right]!);
  const ordered = orderedIndexes.map((index) => results[index]!);
  const threshold = ordered[1]! + Math.floor((ordered[2]! - ordered[1]!) / 2);
  const classifyItems = results.map((value, index) => ({ label: `${equations[index]!.expression} = ${value}`, categoryIndex: value <= threshold ? 0 : 1 }));
  const target = equations[2]!;
  const targetOperator = (['+', '-', '×', '÷'] as const).find((symbol) => target.expression.includes(` ${symbol} `)) ?? operator;
  const [left, right] = target.expression.split(` ${targetOperator} `).map(Number);
  const story = targetOperator === '+'
    ? `书架上原有 ${left} 本书，又放上 ${right} 本，现在有多少本？`
    : targetOperator === '-'
      ? `盒子里原有 ${left} 张卡片，取出 ${right} 张后，还剩多少张？`
      : targetOperator === '÷'
        ? `${left} 个物品平均分给 ${right} 人，每人分到多少个？`
        : `每个盒子装 ${left} 个物品，装 ${right} 个盒子，一共有多少个？`;
  const storyExpression = target.expression;
  const storyAnswer = target.answer;
  const operationQuestion = (equation: { expression: string; answer: number }) => {
    const operation = (['+', '-', '×', '÷'] as const).find((symbol) => equation.expression.includes(` ${symbol} `)) ?? operator;
    const [firstValue, secondValue] = equation.expression.split(` ${operation} `).map(Number);
    const context = operation === '+'
      ? `图书角原有 ${firstValue} 本书，又收到 ${secondValue} 本。`
      : operation === '-'
        ? `文具盒原有 ${firstValue} 支铅笔，拿出 ${secondValue} 支。`
        : operation === '×'
          ? `每组有 ${firstValue} 个物品，一共有 ${secondValue} 组。`
          : `${firstValue} 个物品平均分成 ${secondValue} 份。`;
    const distractors: Record<Operator, [string, string]> = {
      '+': [`${firstValue} - ${secondValue}`, `${firstValue} × ${secondValue}`],
      '-': [`${firstValue} + ${secondValue}`, `${secondValue} - ${firstValue}`],
      '×': [`${firstValue} + ${secondValue}`, `${firstValue} - ${secondValue}`],
      '÷': [`${firstValue} + ${secondValue}`, `${firstValue} - ${secondValue}`],
    };
    const [wrongA, wrongB] = distractors[operation];
    return choose(`${context} 应列哪道算式？`, [equation.expression, wrongA, wrongB], 0,
      '先判断数量是合并、取走、相同份数，还是平均分。', `${context} 对应 ${equation.expression}。`);
  };
  const checkingQuestion = (equation: { expression: string; answer: number }) => {
    const operation = (['+', '-', '×', '÷'] as const).find((symbol) => equation.expression.includes(` ${symbol} `)) ?? operator;
    const checkMethod = operation === '+'
      ? taskIndex === 0
        ? '用和减去其中一个加数，检查是否得到另一个加数'
        : '先估计和的大致范围，再计算并检查结果是否在范围内'
      : operation === '-'
        ? taskIndex === 0
          ? '用差加上减数，检查是否回到被减数'
          : '先估计差的大致范围，再逐位计算并核对结果'
        : operation === '×'
          ? taskIndex === 0
            ? (limit >= 90 ? '把一个因数拆成整十和个位，分别乘后再合并' : '按每组数量逐组相加，检查总数')
            : '先估计积的大致范围，再计算并检查结果是否在范围内'
          : '用商乘除数，再加余数，检查是否回到被除数';
    return choose(`怎样检查 ${equation.expression} 的计算方法是否合理？`, [
      checkMethod,
      '只看答案写得是否整齐',
      '不看数量关系，随便换一个运算符',
    ], 0, '选择能回到原数量关系的检查方法。', `${equation.expression} 可以${checkMethod}。`);
  };
  const inverseCheckQuestion = (equation: { expression: string; answer: number }) => {
    const operation = (['+', '-', '×', '÷'] as const).find((symbol) => equation.expression.includes(` ${symbol} `)) ?? operator;
    const [left, right] = equation.expression.split(` ${operation} `).map(Number);
    const remainder = operation === '÷' ? left! % right! : 0;
    const inverseExpression = operation === '+'
      ? `${equation.answer} - ${right}`
      : operation === '-'
        ? `${equation.answer} + ${right}`
        : operation === '×'
          ? `${equation.answer} ÷ ${right}`
          : `${equation.answer} × ${right}${remainder === 0 ? '' : ` + ${remainder}`}`;
    return chooseNumber(`用逆运算核对：${inverseExpression} = ?`, left!, [left! + 1, Math.max(0, left! - 1)],
      '用相反的运算关系检查能否回到原来的数量。', `${inverseExpression} = ${left}，核对可以回到原来的数量。`);
  };
  const diagnosisQuestion = (equation: { expression: string; answer: number }) => choose(
    `同伴把 ${equation.expression} 算成 ${equation.answer + 1}，怎样检查并改正？`,
    [`重新按本单元方法计算得 ${equation.answer}，再用逆运算或估算核对`, '只看算式有几个数字', '把运算符改成自己喜欢的符号'],
    0,
    '重新计算后，再检查答案是否符合原来的数量关系。', `${equation.expression} = ${equation.answer}；再用逆运算或估算核对，能发现原答案多了 1。`,
  );
  const taskStep = difficulty === 'basic'
    ? '先找出题目给出的两个数量，再做一次计算。'
    : difficulty === 'advanced'
      ? '先读清情境中的数量关系，再列式计算并核对运算符号。'
      : '先列出数量关系，计算后用逆运算或估算检查结果。';

  return [
    taskIndex === 1 && difficulty === 'advanced'
      ? operationQuestion(equations[0]!)
      : taskIndex === 1 && difficulty === 'high'
        ? diagnosisQuestion(equations[0]!)
        : calculate(`计算：${equations[0]!.expression} = ?`, equations[0]!.expression, equations[0]!.answer, '按本单元的方法一步一步计算。', `${equations[0]!.expression} = ${equations[0]!.answer}。`),
    calculate(`再算一算：${equations[1]!.expression} = ?`, equations[1]!.expression, equations[1]!.answer, '先看清运算符号，再核对每一步。', `${equations[1]!.expression} = ${equations[1]!.answer}。`),
    pair('把算式和得数连起来。', equations.map(({ expression, answer }) => [expression, String(answer)] as const), '先独立算出每个得数，再逐项配对。', '每个算式都要和它计算得到的得数对应。'),
    taskIndex === 1 && difficulty !== 'basic'
      ? inverseCheckQuestion(target)
      : chooseNumber(`算式 ${target.expression} 的得数是多少？`, target.answer, [target.answer + 1, Math.max(0, target.answer - 1)], '可以用本单元的计算方法再算一次。', `${target.expression} = ${target.answer}。`),
    taskIndex === 1 && difficulty !== 'basic'
      ? arrange('把“读懂数量关系并核对计算”的步骤排好。', ['列出算式并计算', '先读清已知数量和所求问题', '用逆运算或估算核对', '判断应使用哪种运算'], [1, 3, 0, 2], '先读清问题，再选择方法、计算并检查。', '读清数量和问题后判断运算，计算完成后用逆运算或估算核对。')
      : arrange('按得数从小到大排列这些算式。', equations.map(({ expression, answer }) => `${expression}（${answer}）`), orderedIndexes, '先算出每个算式的得数，再比较大小。', `按从小到大排列后，得数依次为 ${ordered.join('、')}。`),
    sortInto(`按得数是否大于 ${threshold} 分成两组。`, [`不大于 ${threshold}`, `大于 ${threshold}`], classifyItems, '先计算每个算式，再和分类标准比较。', '逐个计算后按同一个标准分类。'),
    calculate(`${story} ${taskStep}`, storyExpression, storyAnswer, '圈出数量和问题，想想它们之间的关系。', `列式 ${storyExpression}，得数是 ${storyAnswer}。`),
    difficulty === 'basic'
      ? chooseNumber(`同学说“${equations[0]!.expression} = ${equations[0]!.answer + 1}”。正确结果应是多少？`, equations[0]!.answer, [equations[0]!.answer + 2, Math.max(0, equations[0]!.answer - 1)], '检查算式中的运算符号和每一步的得数。', `重新计算可知 ${equations[0]!.expression} = ${equations[0]!.answer}。`)
      : difficulty === 'advanced'
        ? operationQuestion(equations[taskIndex]!)
        : checkingQuestion(equations[taskIndex]!),
  ];
}

function makeCount(entry: AddedCourseEntry, p: MathProfile, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const seed = seedFor(entry, difficulty, taskIndex);
  const max = Math.min((p.limit ?? 10) - 1, 19);
  const values = Array.from({ length: 4 }, (_, index) => 1 + ((seed + index * 3) % max));
  const sorted = orderedValues(values);
  const sortedIndexes = values.map((_, index) => index).sort((left, right) => values[left]! - values[right]!);
  const target = values[2]!;
  return [
    chooseNumber(`数一数：${target} 后面的一个数是多少？`, target + 1, [target, target + 2], '从这个数开始再向后数一个。', `${target} 后面的一个数是 ${target + 1}。`),
    calculate(`算一算：${target} + 1 = ?`, `${target} + 1`, target + 1, '从这个数开始向后数一个。', `${target} + 1 = ${target + 1}。`),
    pair('把数和它前面的一个数连起来。', values.map((value) => [String(value), String(value - 1)] as const), '比一个数少 1，就是它前面的一个数。', '每个数前面的一个数都比它少 1。'),
    arrange('把这些数按从小到大排列。', values.map(String), sortedIndexes, '从最小的数开始排。', `从小到大的顺序是 ${sorted.join('、')}。`),
    choose(`哪个数比 ${target} 大 1？`, [String(target + 1), String(target - 1), String(target)], 0, '比一个数大 1，就再数一个。', `${target} 大 1 是 ${target + 1}。`),
    sortInto('按“小于 3”和“3 或更多”分类。', ['小于 3', '3 或更多'], values.map((value) => ({ label: String(value), categoryIndex: value < 3 ? 0 : 1 })), '把每个数和 3 比较。', '小于 3 的数放进第一组，3 或更大的数放进第二组。'),
    chooseNumber(`有 ${target} 个积木，再添 1 个，一共有几个？`, target + 1, [target, target + 2], '把原来的积木和新添的积木合起来数。', `${target} 个再添 1 个是 ${target + 1} 个。`),
    difficulty === 'basic'
      ? taskIndex === 0
        ? chooseNumber('空盘子里一个苹果也没有，用哪个数表示？', 0, [1, 2], '“一个也没有”可以用一个数表示。', '一个也没有，用 0 表示。')
        : choose('数一数桌上的 4 支铅笔，怎样记数更清楚？', ['每支只点一次，并按顺序记录', '同一支点好几次', '不点数，随便猜'], 0, '让每个物品只对应一次点数。', '按顺序点数，每支只记一次，记录才清楚。')
      : difficulty === 'advanced'
        ? taskIndex === 0
          ? choose('桌上有 4 个红积木和 3 个蓝积木，怎样数出总数又不重复？', ['按颜色分组数完，再把两组数量合起来', '每次只数红积木', '数过的积木再数一次'], 0, '先分组点数，再核对每组数量。', '红积木和蓝积木分组数后相加，可以得到总数。')
          : choose('两排各有 3 个圆片，怎样知道一共有多少个？', ['数一排后再数另一排，并把两排数量合起来', '只数第一排', '看到一样多就只记 3 个'], 0, '每一排都要数到，再合并两排数量。', '两排各 3 个，共有 3 + 3 = 6 个圆片。')
        : taskIndex === 0
          ? choose('数一堆散放的积木时，怎样安排步骤更不容易漏数？', ['先排成一行，点一个移开一个，再复数核对', '只估一眼数量', '边数边把数过的再放回原位'], 0, '把数过的和没数的分开，再检查总数。', '先排好、逐个点数并复核，能减少漏数和重复。')
          : choose('两次数数结果不同，怎样查出原因？', ['把物品分成已数和未数两组，再逐个核对', '选一个看起来顺眼的结果', '把两次结果随便相加'], 0, '检查有没有漏数或重复数。', '分组后逐个核对，能找到漏数或重复数的地方。'),
  ];
}

function makePlaceValue(entry: AddedCourseEntry, p: MathProfile, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const seed = seedFor(entry, difficulty, taskIndex);
  const limit = p.limit ?? 100;
  const a = limit <= 20 ? 13 + (seed % 7) : 40 + (seed % 5) * 10 + (seed % 7);
  const b = limit <= 20 ? a - 2 : a - 10;
  const expanded = limit <= 20 ? 10 + (a - 10) : Math.floor(a / 10) * 10 + (a % 10);
  const values = limit <= 20 ? [a, a - 1, a - 2, 10] : [a, b, a + 1, 20];
  const difference = a - b;
  const order = orderedValues(values);
  const orderIndexes = values.map((_, index) => index).sort((left, right) => values[left]! - values[right]!);
  const finalQuestion = difficulty === 'basic'
    ? taskIndex === 0
      ? choose('写数时，十位和个位分别表示什么？', ['十位表示几个十，个位表示几个一', '十位表示几个一，个位表示几个十', '两个数位都只表示几个百'], 0, '回想“十位”和“个位”的计数单位。', '十位上的数表示几个十，个位上的数表示几个一。')
      : choose('数位上有 4 个十，表示多少？', ['40', '4', '400'], 0, '一个十是 10，数位上的 4 表示 4 个十。', '4 个十是 40。')
    : difficulty === 'advanced'
      ? taskIndex === 0
        ? chooseNumber(`小明有 ${b} 张卡片，又拿到 ${difference} 张，现在有多少张？`, a, [a - 1, a + 1], '把原来的数量和新拿到的数量合起来。', `${b} + ${difference} = ${a} 张。`)
        : chooseNumber(`数 ${a} 向前退 ${difference}，得到多少？`, b, [b - 1, b + 1], '从原数中减去题目给出的数量。', `${a} - ${difference} = ${b}。`)
      : choose(`同伴把 ${a} 写成了 ${Math.floor(a / 10) + (a % 10)}，怎样说明这个写法不对？`, [
        `应把 ${Math.floor(a / 10)} 个十和 ${a % 10} 个一合起来，写成 ${a}。`,
        '把十位和个位数字直接相加就能得到原数。',
        '十位和个位表示的都是几个百。',
      ], 0, '个位数字表示几个一，十位数字表示几个十。', `${Math.floor(a / 10)} 个十和 ${a % 10} 个一合起来是 ${a}，不是把两个数字直接相加。`);
  return [
    chooseNumber(`${a} 里面的几个十和几个一合起来是多少？`, expanded, [Math.floor(a / 10) + (a % 10), expanded + 1], '把十位上的数表示成几个十，再加上个位。', `${a} 可以写成 ${Math.floor(a / 10) * 10} + ${a % 10} = ${a}。`),
    calculate(`计算：${Math.floor(a / 10) * 10} + ${a % 10} = ?`, `${Math.floor(a / 10) * 10} + ${a % 10}`, a, '把几个十和几个一合起来。', `几个十和几个一合起来是 ${a}。`),
    pair('把数和它的十位、个位信息连起来。', values.map((value) => [String(value), `十位 ${Math.floor(value / 10)}，个位 ${value % 10}`] as const), '十位表示几个十，个位表示几个一。', '逐个看十位和个位上的数字，再核对组成的数。'),
    choose(`${a} 后面紧挨着的一个数是多少？`, [String(a + 1), String(a + 20), String(Math.max(0, a - 20))], 0, '按数的顺序向后数一个。', `${a} 后面紧挨着的数是 ${a + 1}。`),
    arrange('把这些数按从小到大排列。', values.map(String), orderIndexes, '先比较十位，再比较个位。', `从小到大的顺序是 ${order.join('、')}。`),
    sortInto('按“整十数”和“不是整十数”分类。', ['整十数', '不是整十数'], values.map((value) => ({ label: String(value), categoryIndex: value % 10 === 0 ? 0 : 1 })), '看个位是不是 0。', '个位是 0 的数是整十数。'),
    chooseNumber(`${a} 比 ${b} 大多少？`, a - b, [a - b + 1, Math.max(0, a - b - 1)], '用较大的数减去较小的数。', `${a} - ${b} = ${a - b}。`),
    finalQuestion,
  ];
}

function makeLocation(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const seed = seedFor(entry, difficulty, taskIndex);
  const eastSteps = 1 + seed % 3;
  const northSteps = 1 + (seed + 1) % 3;
  if (entry.grade === 1) {
    return [
      choose('小猫站在小树的左边，小树在小猫的哪边？', ['右边', '左边', '上边'], 0, '从小猫的位置看小树。', '小树在小猫的右边。'),
      choose('书放在桌子的上面，桌子在书的哪边？', ['下面', '上面', '左边'], 0, '把位置关系倒过来想一想。', '书在桌子上面，所以桌子在书下面。'),
      pair('把相对的位置词连起来。', [['上面', '下面'], ['前面', '后面'], ['左边', '右边'], ['里面', '外面']], '每组两个词表示相对的位置。', '上和下、前和后、左和右、里和外分别是相对的位置关系。'),
      arrange('按路线顺序排好：小猫从起点出发，向左走，再向前走，到达小树旁。', ['到达小树旁', '从起点出发', '向前走', '向左走'], [1, 3, 2, 0], '先找起点，再按路线描述中的先后排列。', '先从起点出发，向左走，再向前走，最后到达小树旁。'),
      choose('小狗在小猫的前面，小猫在小狗的哪边？', ['后面', '前面', '右边'], 0, '从小猫的位置看小狗，再倒过来说。', '小狗在小猫前面，所以小猫在小狗后面。'),
      sortInto('把位置关系分到“上下”或“前后”。', ['上下', '前后'], [{ label: '书在桌子上面', categoryIndex: 0 }, { label: '球在椅子下面', categoryIndex: 0 }, { label: '小狗在小猫前面', categoryIndex: 1 }, { label: '小猫排在小狗后面', categoryIndex: 1 }], '看题目说的是高低位置，还是排列先后。', '上面和下面表示上下位置；前面和后面表示前后位置。'),
      difficulty === 'basic'
        ? choose('从教室门口看，书架在你的左边。转向书架看时，书架的位置怎样说？', ['在你前面', '在你后面', '在你右边'], 0, '面向书架后，它就在你面对的方向。', '面向书架时，书架在你前面。')
        : difficulty === 'advanced'
          ? choose(taskIndex === 0 ? '书放在桌子的上面。以桌子为参照，书在哪里？' : '小狗在椅子下面。以小狗为参照，椅子在哪里？', ['上面', '下面', '后面'], 0, '先确定参照物，再判断相对方向。', '书在桌子上面；椅子在小狗的上面。')
          : choose(taskIndex === 0 ? '小猫要从教室门口找到书架，路线说明先写什么？' : '同学只说“书在左边”，伙伴还是找不到。还需要补充什么？', taskIndex === 0
            ? ['起点和相对方向，再按顺序说步骤', '只说书架的颜色', '不说从哪里出发']
            : ['从谁的位置看，以及参照物是什么', '把“左边”改成物品颜色', '让伙伴自己猜'], 0,
          '清楚的位置说明要让别人知道从哪里看、相对什么物体。',
          taskIndex === 0 ? '先说起点和方向，再按先后说明路线。' : '补上观察位置和参照物，方向才明确。'),
      difficulty === 'basic'
        ? taskIndex === 0
          ? choose('说清一个物体的位置，哪种说法更有帮助？', ['说清参照物和它在参照物的哪边', '只说“在那里”', '不说参照物，让别人猜'], 0, '位置要相对于一个看得见的物体来描述。', '说清参照物和方向，别人更容易找到物体。')
          : choose('书放在桌子上面。哪句话说清了书的位置？', ['书在桌子的上面', '书在那里', '书是蓝色的'], 0, '用一个参照物和相对方向说完整。', '“书在桌子的上面”说明了参照物和相对位置。')
        : difficulty === 'advanced'
          ? taskIndex === 0
            ? choose('小红和小明面对面站着，球在小红左边。对小明来说，球在他哪边？', ['右边', '左边', '上边'], 0, '两人面对面时，左右方向相反。', '小红和小明面对面，球在小红左边时，从小明的位置看在右边。')
            : choose('站在桌子这边看，橡皮在书本右边。站到桌子对面看，橡皮在书本哪边？', ['左边', '右边', '上面'], 0, '观察位置换到对面后，左右方向会反过来。', '从桌子对面看，橡皮在书本左边。')
          : difficulty === 'high'
            ? taskIndex === 0
              ? choose('小组要为新同学设计一张路线卡，怎样安排信息更可靠？', ['先标起点和观察方向，再按顺序写每段路线', '只画终点，不标起点', '把方向和步数随意排列'], 0, '路线卡需要统一方向约定并按行走顺序记录。', '标明起点和方向，再依次写路线，别人才能照着走。')
              : choose('伙伴听到“球在左边”还是找不到。补充哪项信息最有帮助？', ['从谁的位置看，并说清参照物', '球是什么颜色', '让伙伴自己猜'], 0, '同一物体从不同位置看，左右可能不同。', '补上观察位置和参照物，方向才明确。')
            : taskIndex === 0
              ? choose('两个人要确认同一个物体的位置，哪种信息能减少误会？', ['说清观察位置、参照物和相对方向', '只说“左边”', '不说观察者站在哪里'], 0, '同一物体从不同位置看，左右可能不同。', '说明观察位置、参照物和方向，伙伴更容易找到物体。')
              : choose('同学说“书在桌子旁边”，怎样补充位置会更清楚？', ['说清从哪里看、书在桌子的哪一边', '只说书的颜色', '省略桌子，让伙伴猜'], 0, '明确观察位置、参照物和方向。', '补上观察位置和相对方向，描述更容易理解。'),
    ];
  }
  return [
    choose('小猫站在小树的左边，小树在小猫的哪边？', ['右边', '左边', '上边'], 0, '两种说法要从观察对象的位置关系来判断。', '小猫在小树左边，所以小树在小猫右边。'),
    choose('地图上约定上方是北，小猫从起点向右走，通常是向哪个方向？', ['东', '西', '北'], 0, '先记住地图上方为北，右方就是东。', '在上北下南的地图中，右方是东。'),
    pair('把地图方向和常用说法连起来。', [['上', '北'], ['下', '南'], ['左', '西'], ['右', '东']], '看清地图已经约定的方向。', '在上北下南、左西右东的地图中，方向对应如题所示。'),
    arrange('小猫先向东走，再向北走。把路线按顺序排好。', ['向北走', '到达终点', '从起点出发', '向东走'], [2, 3, 0, 1], '先确定起点，再依次读每一步。', '路线是从起点出发、向东、向北，最后到达终点。'),
    calculate(`沿路线向东走 ${eastSteps} 格，再向东走 1 格，一共向东走几格？`, `${eastSteps} + 1`, eastSteps + 1, '同一个方向的格数可以合起来数。', `${eastSteps} + 1 = ${eastSteps + 1} 格。`),
    sortInto('把路线卡分成“向北或向南”和“向东或向西”。', ['南北方向', '东西方向'], [{ label: '向北', categoryIndex: 0 }, { label: '向南', categoryIndex: 0 }, { label: '向东', categoryIndex: 1 }, { label: '向西', categoryIndex: 1 }], '判断路线卡属于哪一组相对方向。', '北和南是一组相对方向，东和西是一组相对方向。'),
    choose(`小猫先向东走 ${eastSteps} 格，再向北走 ${northSteps} 格，走过的格数是多少？`, [String(eastSteps + northSteps), String(eastSteps + northSteps + 1), String(Math.abs(eastSteps - northSteps))], 0, '把两段路的格数相加。', `${eastSteps} + ${northSteps} = ${eastSteps + northSteps} 格。`),
    difficulty === 'basic'
      ? taskIndex === 0
        ? choose('描述路线时，哪种说法最清楚？', ['先说从哪里出发，再按顺序说明方向和步数', '只说“走一走”', '不说方向，让别人猜'], 0, '路线需要起点、方向和先后顺序。', '说明起点、方向和步数，别人才能按路线找到位置。')
        : choose('从操场到图书馆的路线卡漏写了方向，伙伴还能准确走到吗？', ['不能，路线卡还要写清每一步的方向', '能，只写“走几格”就够了', '能，只写终点名称就够了'], 0, '路线信息要包含方向和步数。', '没有方向，伙伴无法判断该往哪边走。')
      : difficulty === 'advanced'
        ? taskIndex === 0
          ? choose(`路线是从校门向东走 ${eastSteps} 格，再向北走 ${northSteps} 格。哪种记录更完整？`, [`从校门出发，先向东 ${eastSteps} 格，再向北 ${northSteps} 格`, '只写“向东、向北”', '只写终点名称'], 0, '路线要写起点、方向和每段步数。', `从校门出发并按顺序记录两段方向和步数，伙伴才能复走。`)
          : choose('同学要比较两条去操场的路线，先核对什么条件才公平？', ['两条路线使用同一张方向图和同一起点', '只比较路线卡的颜色', '一条从校门出发，另一条不写起点'], 0, '比较路线前要统一方向和起点。', '同一起点和方向约定一致，路线才可以比较。')
        : taskIndex === 0
          ? choose('小组要为新同学设计一张路线卡，怎样安排信息更可靠？', ['先标起点和地图方向，再按顺序写每段方向与步数', '只画终点，不标起点', '把方向和步数随意排列'], 0, '路线卡需要统一方向约定并按行走顺序记录。', '标明起点和方向，再依次写方向与步数，别人才能照着走。')
          : choose('伙伴照路线卡走错了，发现卡片只写了“向北 2 格、向东 3 格”，漏了什么？', ['从哪里出发以及两步的先后顺序', '目的地的颜色', '路线卡的纸张大小'], 0, '路线要说明起点，也要按实际先后排列步骤。', '补上起点和步骤顺序，伙伴才能复现路线。'),
  ];
}

function makeShapes(p: MathProfile, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  if (p.mode === 'solid-shapes') {
    const finalQuestion = difficulty === 'basic'
      ? taskIndex === 0
        ? choose('想用积木拼出一个稳稳的高塔，先选哪种形状做底座更合适？', ['平平的正方体或长方体积木', '圆球', '细长的圆柱侧面朝下'], 0, '底座要能平稳地放在桌面上。', '平面底部的积木较容易稳稳放在桌面上。')
        : choose('把圆柱体立在桌上时，哪一部分适合贴着桌面？', ['平平的圆形底面', '弯曲的侧面', '圆柱的顶点'], 0, '圆柱有平面底部和弯曲侧面。', '圆柱的平面底部能平稳地接触桌面。')
      : difficulty === 'advanced'
        ? taskIndex === 0
          ? choose('一种积木既能滚动，也能用平平的底面立在桌上。它最可能是什么？', ['圆柱体', '球的弯曲面', '正方体的一个顶点'], 0, '观察圆柱体是否有平面底部和弯曲侧面。', '圆柱体有平面底部，也有弯曲侧面，可以滚动并立放。')
          : choose('同学把骰子和球都说成“能滚的形体”，哪条观察能帮助区分它们？', ['骰子有平平的面和直直的棱，球体没有平面', '它们的颜色不同，所以形状相同', '只看物体大小就能判断形状'], 0, '观察它们的面和边，不要只看是否能滚。', '骰子整体接近正方体，有平面和棱；球体表面弯曲，没有平面。')
        : taskIndex === 0
          ? choose('搭积木高塔时，怎样安排底座更稳？', ['先用平平的正方体或长方体做底座', '用圆球做底座', '把积木放在圆柱体弯曲的侧面上'], 0, '先考虑哪种面能平稳地放在桌面上。', '用有平面底部的积木做底座，较不容易滚动。')
          : choose('小组分享立体图形观察结果，哪条记录最有依据？', ['说出物体像哪种图形，再指出看到的平面或弯曲面', '只说物体的颜色', '只说“我觉得像”，不说明观察'], 0, '把观察到的外形特征和判断连起来。', '指出物体整体形状，并说明看到的面或弯曲部分，别人才能核对判断。');
    return [
      taskIndex === 0
        ? choose('哪种物体最像球？', ['足球', '长方体积木', '圆柱形水杯'], 0, '观察物体的表面形状。', '足球整体是球形。')
        : choose('课桌上的哪件物品最像长方体？', ['一本书', '一个乒乓球', '一只圆柱形水杯'], 0, '观察物品整体像盒子、球，还是圆筒。', '书本的整体外形接近长方体。'),
      taskIndex === 0
        ? choose('哪种物体有两个平平的圆形底面，侧面弯弯的？', ['圆柱体', '球', '长方体'], 0, '想想圆柱形水杯的形状。', '圆柱有两个平的圆形底面，侧面是弯曲的。')
        : choose('观察一个不熟悉的立体物体，哪种办法更有帮助？', ['转一转，从不同方向观察平面和弯曲的部分', '只看颜色来猜', '只比较物体的大小'], 0, '观察形状特征，不要只看颜色或大小。', '从不同方向观察物体的平面和弯曲部分，能帮助辨认整体形状。'),
      pair('把物体和相似的立体图形连起来。', [['骰子', '正方体'], ['橡皮盒', '长方体'], ['球', '球体'], ['纸筒', '圆柱体']], '看一看物体有几个平面或是否能滚动。', '这些常见物体的整体外形分别接近对应的立体图形。'),
      taskIndex === 0
        ? sortInto('把图形放进“能滚动”和“通常不能滚动”两组。', ['能滚动', '通常不能滚动'], [{ label: '球体', categoryIndex: 0 }, { label: '圆柱体', categoryIndex: 0 }, { label: '正方体', categoryIndex: 1 }, { label: '长方体', categoryIndex: 1 }], '想想图形的面是否有弯曲部分。', '球体和圆柱体有弯曲面，通常能滚动；正方体和长方体有平面。')
        : sortInto('把立体图形分成“有平平的一面”和“没有平平的一面”两组。', ['有平平的一面', '没有平平的一面'], [{ label: '圆柱体', categoryIndex: 0 }, { label: '正方体', categoryIndex: 0 }, { label: '长方体', categoryIndex: 0 }, { label: '球体', categoryIndex: 1 }], '观察每种立体图形能不能平平地放在桌面上。', '圆柱体、正方体和长方体都有能平放的一面；球体表面弯弯的，没有平平的一面。'),
      taskIndex === 0
        ? choose('正方体和长方体有什么相同点？', ['都有平平的面和直直的棱', '都有一个圆形底面', '整个表面都是弯曲的'], 0, '观察它们的面和棱。', '正方体和长方体都由平面围成，并有直棱。')
        : choose('哪种立体图形既有平平的面，也有弯弯的面？', ['圆柱体', '球体', '长方体'], 0, '分别想想圆柱、球和长方体的表面。', '圆柱体有平平的圆形底面，也有弯弯的侧面。'),
      taskIndex === 0
        ? arrange('按“观察物体、辨认相似图形、说出理由”的顺序整理步骤。', ['说出相似的立体图形', '观察物体的面和边', '根据外形说明理由', '拿起一个物体'], [3, 1, 0, 2], '先观察实物，再判断和解释。', '先拿起并观察物体，再辨认图形，最后说明依据。')
        : arrange('按“比较球和圆柱能否滚动”的步骤排列。', ['分别轻轻推一下', '把球和圆柱放在同一张平桌面上', '记录观察到的情况', '说出两者相同和不同的地方'], [1, 0, 2, 3], '在相同桌面上分别轻轻推动，再比较现象。', '先把两个物体放在同一桌面上，再分别推动、记录并比较。'),
      taskIndex === 0
        ? choose('圆柱和球都有弯曲的面。哪句话正确？', ['它们的形状相同', '它们都有弯曲的面，但整体形状不同', '它们都只有平平的面'], 1, '相同特点不代表整体形状相同。', '圆柱和球都能滚动，但圆柱还有平面底部，整体形状不同。')
        : choose('骰子和长方形盒子外形不同，哪种说法更合适？', ['骰子整体接近正方体，长方形盒子整体接近长方体', '它们都是球体', '它们都是圆柱体'], 0, '比较物体整体的形状，不看颜色。', '骰子接近正方体，长方形盒子接近长方体。'),
      finalQuestion,
    ];
  }
  return [
    choose('哪个图形有 3 条边？', ['三角形', '长方形', '圆'], 0, '数一数图形的直边。', '三角形有 3 条边。'),
    choose('正方形的四条边有什么特点？', ['四条边一样长', '只有两条边', '没有直角'], 0, '比较正方形的四条边。', '正方形的四条边一样长，四个角都是直角。'),
    pair('把图形和它的边数特点连起来。', [['三角形', '3 条边'], ['正方形', '4 条相等的边'], ['长方形', '两组相对边相等'], ['圆', '没有直边']], '逐个观察直边和边的长度关系。', '三角形有 3 条边；正方形四边相等；长方形的对边相等；圆没有直边。'),
    sortInto('按“有直边”和“没有直边”分类。', ['有直边', '没有直边'], [{ label: '三角形', categoryIndex: 0 }, { label: '长方形', categoryIndex: 0 }, { label: '正方形', categoryIndex: 0 }, { label: '圆', categoryIndex: 1 }], '看图形边缘是直线还是曲线。', '前三种图形都有直边，圆没有直边。'),
    choose('把两个三角形拼在一起，拼出的图形一定是哪一种？', ['不一定相同，要看怎样摆放', '一定是圆', '一定是长方形'], 0, '同样的图形可以用不同方向拼摆。', '拼出的形状会随摆放方向和位置改变。'),
    arrange('拼图时按“选图形、试着摆、看看边是否对齐、说出拼成什么”的顺序操作。', ['看看边是否对齐', '选出要用的图形', '说出拼成什么', '试着摆一摆'], [1, 3, 0, 2], '先选图形，再实际拼摆并观察。', '选择、拼摆、检查、表达是合理的操作顺序。'),
    choose('一个图形有 4 条相等的直边和 4 个直角，它最可能是什么？', ['正方形', '圆', '三角形'], 0, '把边的长度和角的特点一起考虑。', '四边相等且有四个直角的是正方形。'),
    difficulty === 'basic'
      ? taskIndex === 0
        ? choose('想判断一个图形是不是长方形，哪种办法合适？', ['检查它是否有 4 条边和 4 个直角', '只看它的颜色', '只看它画得大不大'], 0, '用图形的边和角来判断，不看颜色。', '边和角的特征能帮助辨认长方形。')
        : choose('长方形的两组对边有什么特点？', ['分别一样长', '四条边一定都一样长', '没有直角'], 0, '比较相对的两条边。', '长方形的两组对边分别相等，四个角都是直角。')
      : difficulty === 'advanced'
        ? choose(taskIndex === 0 ? '做图形卡时，怎样判断卡片是不是正方形？' : '同学说一个四边图形边长都相同就一定是正方形，还要检查什么？', ['四个角是不是直角', '图形是什么颜色', '图形画得有多大'], 0, '判断正方形要同时看边和角。', '四条边相等还不够，还要检查四个角是不是直角。')
        : choose(taskIndex === 0 ? '同伴把长方形认成正方形，怎样检查他的判断？' : '一个图形有四条边和四个直角，但边长不全相等。它是什么图形？', taskIndex === 0
          ? ['再检查四条边是否都相等', '只看图形的颜色', '把图形转个方向']
          : ['长方形', '正方形', '圆'], taskIndex === 0 ? 0 : 0,
        '先找图形的边和角，再按定义核对。', taskIndex === 0 ? '正方形还要求四条边相等；长方形不要求四边都相等。' : '四条边和四个直角符合长方形；边长不全相等，所以不是正方形。'),
  ];
}

function makeClock(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const seed = seedFor(entry, difficulty, taskIndex);
  const hour = 1 + seed % 11;
  const nextHour = hour === 12 ? 1 : hour + 1;
  const elapsed = 10 + (seed % 4) * 5;
  if (entry.grade === 1) {
    const finalQuestion = difficulty === 'basic'
      ? taskIndex === 0
        ? choose('读钟表时，怎样判断是整时还是半时？', ['看分针指向 12 还是 6，再看时针位置', '只看钟表的颜色', '只看时针，不看分针'], 0, '整时和半时的分针位置不同。', '分针指向 12 是整时，指向 6 是半时，再结合时针读时刻。')
        : choose('读出整时时刻时，分针应该指向哪里？', ['12', '6', '3'], 0, '整时的分针指向钟面顶端。', '分针指向 12 表示整时，再看时针读小时。')
      : difficulty === 'advanced'
        ? taskIndex === 0
          ? choose(`时针在 ${hour} 和 ${nextHour} 之间，分针指向 6。怎样读出这个时刻？`, [`${hour} 时半`, `${nextHour} 时半`, `${hour} 时`], 0, '分针指向 6 是半时，时针还没有走到下一个数字。', `这是 ${hour} 时半。`)
          : choose(`时针指向 ${hour}，分针指向 12。应把时刻记成什么？`, [`${hour} 时`, `${hour} 时半`, `${nextHour} 时`], 0, '分针指向 12 表示整时。', `这是 ${hour} 时。`)
        : taskIndex === 0
          ? choose(`同伴把“时针在 ${hour} 和 ${nextHour} 之间、分针指向 6”读成 ${nextHour} 时半，怎样检查？`, [`先看分针确定是半时，再看时针还在哪两个数字之间`, '只看分针指向的数字就是小时', '把分针指向 6 当作时刻中的小时数'], 0, '读时刻要把两根指针的信息合起来。', `分针指向 6 表示半时，时针还在 ${hour} 和 ${nextHour} 之间，所以是 ${hour} 时半。`)
          : choose(`要核对“${hour} 时”是不是整时，先检查哪项？`, ['分针是否指向 12', '时针是否指向 6', '钟面上有没有数字'], 0, '整时和半时由分针位置区分。', `分针指向 12 才表示整时；再根据时针读出 ${hour} 时。`);
    return [
      choose(`钟面上，时针指向 ${hour}，分针指向 12，表示几时？`, [`${hour} 时`, `${hour} 时半`, `${nextHour} 时`], 0, '分针指向 12 表示整时。', `时针指向 ${hour}，分针指向 12，是 ${hour} 时。`),
      choose(`钟面上，时针在 ${hour} 和 ${nextHour} 之间，分针指向 6，表示几时半？`, [`${hour} 时半`, `${hour} 时`, `${nextHour} 时半`], 0, '分针指向 6 表示半时。', `时针在 ${hour} 和 ${nextHour} 之间、分针指向 6，表示 ${hour} 时半。`),
      pair('把钟表特点和说法连起来。', [['整时', '分针指向 12'], ['半时', '分针指向 6'], ['较短的指针', '时针'], ['较长的指针', '分针']], '先看分针的位置，再辨认时针和分针。', '分针指向 12 是整时，指向 6 是半时；较短的是时针，较长的是分针。'),
      choose('读出钟面上的“几时”，主要看哪根指针？', ['时针', '分针', '钟面颜色'], 0, '时针较短，帮助判断小时。', '读“几时”主要看时针的位置。'),
      sortInto('把时刻分到“整时”和“半时”。', ['整时', '半时'], [{ label: '8 时', categoryIndex: 0 }, { label: '6 时', categoryIndex: 0 }, { label: '2 时半', categoryIndex: 1 }, { label: '3 时半', categoryIndex: 1 }], '整时的分钟数是 0，半时的分钟数是 30。', '整时写作“几时”，半时写作“几时半”。'),
      arrange('把看钟表并说出时刻的步骤排好。', ['看时针指向哪里', '先找到钟面上的 12', '看分针指向哪里', '合起来读出时刻'], [1, 2, 0, 3], '先认清钟面，再结合两根指针判断。', '认清钟面后，结合分针和时针的位置读出时刻。'),
      choose(`钟面表示 ${hour} 时半，时针应在什么位置？`, [`${hour} 和 ${nextHour} 之间`, `指向 ${hour}`, `指向 ${nextHour}`], 0, '半时的时针会走到两个数字之间。', `在 ${hour} 时半，时针在 ${hour} 和 ${nextHour} 之间。`),
      finalQuestion,
    ];
  }
  const finalQuestion = difficulty === 'basic'
    ? taskIndex === 0
      ? choose('记录活动时间时，哪种写法最完整？', ['写下开始时间、结束时间和日期', '只写“很久”', '不看钟面随便估一个时间'], 0, '开始和结束时间能帮助算出经过时间。', '记录日期和起止时间，才能核对活动用了多久。')
      : choose('1 分钟和 1 小时各有多长？', ['1 分钟是 60 秒，1 小时是 60 分钟', '1 分钟是 60 小时，1 小时是 60 秒', '两者都是 30 分钟'], 0, '回想分钟和秒、小时和分钟之间的关系。', '1 分钟等于 60 秒，1 小时等于 60 分钟。')
    : difficulty === 'advanced'
      ? taskIndex === 0
        ? choose(`上午 ${hour} 时开始一项活动，经过 30 分钟后，结束钟面上的分针指向哪里？`, ['6', '12', '3'], 0, '30 分钟是半小时，分针走半圈。', `经过 30 分钟是半小时，分针指向 6。`)
        : choose(`活动从 ${hour} 时开始，到 ${nextHour} 时结束，经过了多久？`, ['1 小时', '30 分钟', '2 小时'], 0, '用结束时刻减去开始时刻。', `${nextHour} 时比 ${hour} 时晚 1 小时。`)
      : taskIndex === 0
        ? chooseNumber(`活动 A 用 ${elapsed} 分钟，活动 B 用 ${60 - elapsed} 分钟。B 比 A 多用多少分钟？`, 60 - 2 * elapsed, [70 - 2 * elapsed, Math.max(0, 50 - 2 * elapsed)], '先比较两段时间，再用较长时间减较短时间。', `${60 - elapsed} - ${elapsed} = ${60 - 2 * elapsed} 分钟。`)
        : choose(`同伴把从 ${hour} 时到 ${nextHour} 时的活动记成“30 分钟”，怎样核对并改正？`, ['把两个整时时刻的间隔换成分钟，改记为 60 分钟', '只看活动名称，不检查时刻', '把结束时刻减去日期'], 0, '先求两个时刻相差几小时，再换成分钟。', `${nextHour} 时比 ${hour} 时晚 1 小时，1 小时是 60 分钟。`);
  return [
    choose(`钟面上，时针指向 ${hour}，分针指向 12，表示几时？`, [`${hour} 时`, `${hour} 时半`, `${nextHour} 时`], 0, '分针指向 12 表示整时。', `时针指向 ${hour}，分针指向 12，是 ${hour} 时。`),
    choose(`钟面上，时针在 ${hour} 和 ${nextHour} 之间，分针指向 6，表示几时半？`, [`${hour} 时半`, `${hour} 时`, `${nextHour} 时半`], 0, '分针指向 6 表示 30 分。', `时针在 ${hour} 和 ${nextHour} 之间、分针指向 6，表示 ${hour} 时半。`),
    pair('把钟面和时间连起来。', [[`${hour} 时`, '分针指向 12'], [`${hour} 时半`, '分针指向 6'], ['1 分钟', '60 秒'], ['1 小时', '60 分钟']], '先回想整时、半时和时间单位的对应关系。', '整时分针指向 12，半时分针指向 6；1 分钟是 60 秒，1 小时是 60 分钟。'),
    calculate(`现在是 ${hour} 时，过 1 小时是几时？`, `${hour} + 1`, nextHour, '沿着钟面向后数一个小时。', `过 1 小时是 ${nextHour} 时。`),
    sortInto('把时长分到“不到 1 小时”和“1 小时或更长”。', ['不到 1 小时', '1 小时或更长'], [{ label: '30 分钟', categoryIndex: 0 }, { label: '45 分钟', categoryIndex: 0 }, { label: '60 分钟', categoryIndex: 1 }, { label: '90 分钟', categoryIndex: 1 }], '1 小时等于 60 分钟。', '小于 60 分钟的时长不到 1 小时；60 分钟及以上达到或超过 1 小时。'),
    arrange('把“开始活动、经过一段时间、活动结束”的时间顺序排好。', ['活动结束', '开始活动', '经过一段时间'], [1, 2, 0], '先找开始，再找结束。', '先开始活动，经过一段时间后活动结束。'),
    calculate(`一段活动用了 ${elapsed} 分钟，1 小时后还剩多少分钟才到 1 小时？`, `60 - ${elapsed}`, 60 - elapsed, '把 1 小时换成 60 分钟，再减去已经用的时间。', `60 - ${elapsed} = ${60 - elapsed} 分钟。`),
    finalQuestion,
  ];
}

function makeMoney(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const seed = seedFor(entry, difficulty, taskIndex);
  const tens = 1 + seed % 8;
  const ones = 1 + (seed * 3) % 9;
  const total = tens * 10 + ones;
  const price = tens + ones;
  const payment = (Math.floor(price / 10) + 1) * 10;
  const change = payment - price;
  return [
    chooseNumber(`1 元等于多少角？`, 10, [1, 100], '想想 1 元可以换成几个 1 角。', '1 元等于 10 角。'),
    chooseNumber(`1 元等于多少分？`, 100, [10, 1], '1 元先换成 10 角，每角有 10 分。', '1 元等于 100 分。'),
    pair('把人民币单位和换算关系连起来。', [['1 元换成角', '10 角'], ['1 元换成分', '100 分'], ['5 角换成分', '50 分'], ['2 元换成角', '20 角']], '记住 1 元等于 10 角，1 角等于 10 分。', '按元、角、分之间的十进关系换算。'),
    calculate(`${tens} 角 + ${ones} 角 = ? 角`, `${tens} + ${ones}`, tens + ones, '单位相同，可以直接把角数相加。', `${tens} 角 + ${ones} 角 = ${tens + ones} 角。`),
    choose(`有 ${total} 分，等于多少角和多少分？`, [`${tens} 角 ${ones} 分`, `${ones} 角 ${tens} 分`, `${total} 角`], 0, '每 10 分是 1 角。', `${total} 分可以写成 ${tens} 角 ${ones} 分。`),
    sortInto('按“不到 1 元”和“1 元或更多”分类。', ['不到 1 元', '1 元或更多'], [{ label: '8 角', categoryIndex: 0 }, { label: '9 角', categoryIndex: 0 }, { label: '1 元', categoryIndex: 1 }, { label: '1 元 2 角', categoryIndex: 1 }], '1 元等于 10 角。', '少于 10 角不到 1 元；10 角或更多达到 1 元。'),
    calculate(`买一支 ${tens} 角的铅笔和一块 ${ones} 角的橡皮，一共要几角？`, `${tens} + ${ones}`, price, '两件物品都用角作单位，直接合起来。', `一共需要 ${price} 角。`),
    difficulty === 'basic'
      ? chooseNumber(taskIndex === 0
        ? `两件物品共 ${price} 角，付 ${payment} 角，应找回多少角？`
        : `小明付了 ${payment} 角，买了共 ${price} 角的文具，零钱是多少？`, change, [change + 1, change - 1], '用付款的钱减去商品总价。', `${payment} - ${price} = ${change} 角。`)
      : difficulty === 'advanced'
        ? taskIndex === 0
          ? choose(`怎样核对找回的 ${change} 角是否正确？`, [`商品价 ${price} 角加找零 ${change} 角，应等于付款 ${payment} 角`, '只看找零硬币的颜色', '商品价和找零相减应等于付款'], 0, '把商品价和找零合起来，与付款金额比较。', `${price} + ${change} = ${payment} 角，找零记录正确。`)
          : choose(`商品价 ${price} 角，付款 ${payment} 角，找回 ${change} 角。哪种算式能检验付款记录？`, [`${price} + ${change} = ${payment}`, `${payment} + ${change} = ${price}`, `${price} - ${change} = ${payment}`], 0, '商品价和找零合起来应等于付款金额。', `${price} + ${change} = ${payment} 角，记录一致。`)
        : taskIndex === 0
          ? choose(`商品共 ${price} 角，顾客付 ${payment} 角。收银员说找零 ${change + 1} 角，怎样改正？`, [`应找 ${change} 角，因为付款减去商品价是 ${change}`, `应找 ${change + 2} 角`, '不用检查，照收银员说的记录'], 0, '用付款金额减去商品总价重新计算。', `${payment} - ${price} = ${change} 角，原记录多了 1 角。`)
          : choose(`付款 ${payment} 角、商品价 ${price} 角。哪种记录能让同学检查找零？`, [`先算 ${payment} - ${price}，再用商品价加找零核对付款`, '只写“找回一些钱”', '把商品价和付款金额调换后相减'], 0, '写出计算过程和反向检查关系。', `先算出 ${change} 角，再用 ${price} + ${change} = ${payment} 核对。`),
  ];
}

function makeMeasure(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const seed = seedFor(entry, difficulty, taskIndex);
  const centimeters = 21 + (seed % 7) * 10;
  const meters = 1 + seed % 5;
  const finalQuestion = difficulty === 'basic'
    ? taskIndex === 0
      ? choose('测量课桌长度时，哪种方法更可靠？', ['把尺子的 0 刻度对准一端，再看另一端刻度', '从尺子中间开始量却不记录起点', '只凭感觉说一个长度'], 0, '测量前先对齐 0 刻度。', '从 0 刻度开始并读出另一端的位置，测量更准确。')
      : choose('测量长短时，记录结果还要写清什么？', ['使用的单位', '尺子的颜色', '测量者的名字'], 0, '同一个数字配上不同单位，表示的长度不同。', '写清厘米、米等单位，别人才能正确理解测量结果。')
    : difficulty === 'advanced'
      ? taskIndex === 0
        ? choose(`一根 ${centimeters} 厘米的绳子再接上 10 厘米，合起来是多少分米和厘米？`, [
          `${Math.floor((centimeters + 10) / 10)} 分米 1 厘米`, `${Math.floor((centimeters + 10) / 10)} 分米`, `${Math.floor((centimeters + 10) / 10) + 1} 分米 1 厘米`,
        ], 0, '先合并厘米，再把每 10 厘米换成 1 分米。', `${centimeters + 10} 厘米等于 ${Math.floor((centimeters + 10) / 10)} 分米 1 厘米。`)
        : chooseNumber(`${meters} 米和 10 分米合起来是多少分米？`, meters * 10 + 10, [meters * 10, meters * 100 + 10], '先把米换成分米，再把两段长度相加。', `${meters} 米是 ${meters * 10} 分米；再加 10 分米，共 ${meters * 10 + 10} 分米。`)
      : taskIndex === 0
        ? choose('要比较两根绳子的长度，怎样测量才公平？', ['用同一把尺、同一单位，并从 0 刻度对齐测量', '一根从尺子 0 刻度量，另一根从中间开始量', '一根用厘米记录，另一根不写单位'], 0, '比较前统一工具、起点和单位。', '相同的工具、起点和单位能让两次测量结果可以比较。')
        : choose('同伴说 1 米等于 10 厘米，怎样用单位关系检查并改正？', ['1 米等于 100 厘米；10 厘米是 1 分米', '1 米等于 10 厘米，所以 1 分米等于 1 厘米', '厘米和米不能比较'], 0, '先回想 1 米里有多少个 1 厘米。', '1 米等于 100 厘米，1 分米等于 10 厘米。');
  return [
    chooseNumber('1 米等于多少厘米？', 100, [10, 1000], '1 米里面有 100 个 1 厘米。', '1 米等于 100 厘米。'),
    chooseNumber('1 吨等于多少千克？', 1000, [100, 10000], '吨和千克都是质量单位。', '1 吨等于 1000 千克。'),
    pair('把单位和等值长度或质量连起来。', [['1 厘米', '10 毫米'], ['1 分米', '10 厘米'], ['1 千米', '1000 米'], ['1 吨', '1000 千克']], '先分清题目说的是长度还是质量。', '1 厘米等于 10 毫米，1 分米等于 10 厘米，1 千米等于 1000 米，1 吨等于 1000 千克。'),
    chooseNumber(`${centimeters} 厘米中有几个整分米？`, Math.floor(centimeters / 10), [Math.ceil(centimeters / 10), centimeters % 10], '每 10 厘米是 1 分米，只数完整的 10 厘米。', `${centimeters} 厘米中有 ${Math.floor(centimeters / 10)} 个整分米。`),
    chooseNumber(`${meters} 米等于多少分米？`, meters * 10, [meters * 100, meters], '1 米等于 10 分米。', `${meters} 米等于 ${meters * 10} 分米。`),
    sortInto('把适合用“米”或“千米”表示的距离分类。', ['较短距离：米', '较长距离：千米'], [{ label: '教室的长度', categoryIndex: 0 }, { label: '操场一圈', categoryIndex: 0 }, { label: '两座城市之间', categoryIndex: 1 }, { label: '公路的一段长途', categoryIndex: 1 }], '想想距离是几米，还是远到需要几千米。', '教室和操场常用米；较远的城市间距离常用千米。'),
    calculate(`一根绳子长 ${centimeters} 厘米，又接上 10 厘米，现在长多少厘米？`, `${centimeters} + 10`, centimeters + 10, '先确认长度单位相同，再相加。', `绳子现在长 ${centimeters + 10} 厘米。`),
    finalQuestion,
  ];
}

function makePatterns(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const seed = seedFor(entry, difficulty, taskIndex);
  const step = 1 + seed % 4;
  const start = 1 + seed % 9;
  const sequence = [start, start + step, start + step * 2, start + step * 3];
  const finalQuestion = difficulty === 'basic'
    ? taskIndex === 0
      ? choose('同一组图形可以按颜色或形状找到规律。怎样说明自己的发现？', ['说出观察标准，并举出连续几项', '只说“我觉得是这样”', '不说明标准让别人猜'], 0, '把分类标准和对应项说清楚。', '说明观察标准并举例，别人就能核对规律。')
      : choose(`数列 ${start}、${start + step}、${start + step * 2} 中，每次增加多少？`, [String(step), String(step + 1), String(Math.max(0, step - 1))], 0, '比较相邻两项的差。', `相邻两项都相差 ${step}。`)
    : difficulty === 'advanced'
      ? taskIndex === 0
        ? chooseNumber(`数列 ${start}、${start + step}、${start + step * 2} 中，按相同规律再加 2 次后是多少？`, start + step * 4, [start + step * 3, start + step * 5], '先找每次增加的数，再连续加两次。', `每次增加 ${step}，再加两次得到 ${start + step * 4}。`)
        : choose(`同学用“每次增加 ${step}”说明规律，哪组数最能验证他的说法？`, [`${start}、${start + step}、${start + step * 2}`, `${start}、${start + step + 1}、${start + step * 2 + 2}`, `${start}、${start + step}、${start + step * 2 + 1}`], 0, '检查每一对相邻数是不是都增加同样的数。', `第一组每次都增加 ${step}，符合规律。`)
      : taskIndex === 0
        ? choose(`数列 ${start}、${start + step}、${start + step * 2}、${start + step * 3 + 1} 被说成“每次增加 ${step}”，应怎样检查？`, ['逐对比较相邻两数；最后一次增加了多于规律要求的 1，不符合这个规律', '只看首尾两个数，不检查中间', '把最后一个数当成图形颜色'], 0, '规律要能解释每一次变化。', `最后一步增加了 ${step + 1}，不是 ${step}，所以这组数不符合“每次增加 ${step}”。`)
        : choose('想说明一个数列规律没有漏项或错项，哪种办法更完整？', ['逐对检查相邻两项的变化，并核对每一步都符合规则', '只看第一个数和最后一个数', '只把数列读一遍，不比较变化'], 0, '把规则应用到数列中的每一步。', '逐对检查所有相邻项，才能发现中间是否有错项。');
  return [
    chooseNumber(`数列 ${sequence[0]}、${sequence[1]}、${sequence[2]}、（ ）中，括号里填什么？`, sequence[3]!, [sequence[3]! + 1, sequence[3]! - 1], '比较相邻两个数相差多少。', `每次增加 ${step}，所以括号里是 ${sequence[3]}。`),
    calculate(`从 ${start} 开始，每次加 ${step}，连续加 3 次后是多少？`, `${start} + ${step} + ${step} + ${step}`, sequence[3]!, '沿着规律继续加三次。', `结果是 ${sequence[3]}。`),
    pair('把图形规律和下一个图形连起来。', [['○、△、○、△', '○'], ['□、□、☆、□、□', '☆'], ['△、○、□、△、○', '□'], ['☆、○、△、☆、○', '△']], '找到重复出现的图形顺序，再向后接一个。', '看清每组重复规律后，就能确定下一个图形。'),
    arrange('把数列按规律排好：每次增加相同的数。', [sequence[2]!, sequence[0]!, sequence[3]!, sequence[1]!].map(String), [1, 3, 0, 2], '先比较相邻数的差。', `相邻两数都相差 ${step}。`),
    sortInto('按“每次增加”和“每次减少”分类。', ['增加', '减少'], [{ label: '2、4、6', categoryIndex: 0 }, { label: '3、6、9', categoryIndex: 0 }, { label: '9、7、5', categoryIndex: 1 }, { label: '8、6、4', categoryIndex: 1 }], '比较每组相邻两数的变化。', '前两组逐渐增加，后两组逐渐减少。'),
    choose(`下面哪组数符合“每次增加 ${step}”的规律？`, [`${start}、${start + step}、${start + step * 2}`, `${start}、${start + step + 1}、${start + step * 2 + 2}`, `${start + step}、${start + step}、${start + step}`], 0, '逐组比较相邻两个数的差。', `第一组每次都增加 ${step}。`),
    choose('发现数列规律时，哪种做法更合适？', ['比较相邻数或图形，找出重复或变化方式', '只看最后一个数', '看到两个数相同就停止'], 0, '规律要能说明每一步怎样变化。', '比较相邻项并找出重复或变化方式，才能继续数列。'),
    finalQuestion,
  ];
}

function makeFractions(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const denominator = 2 + (seedFor(entry, difficulty, taskIndex) % 3);
  return [
    choose('把一个同样大小的蛋糕平均分成 2 份，每份是它的几分之一？', ['二分之一', '二分之二', '三分之一'], 0, '平均分成 2 份，其中 1 份就是二分之一。', '把整体平均分成 2 份，每份是整体的二分之一。'),
    choose(`把同样大小的纸平均分成 ${denominator} 份，取其中 1 份，写作几分之一？`, [`${denominator} 分之一`, `1 分之 ${denominator}`, `${denominator + 1} 分之一`], 0, '分母表示平均分成的份数，分子表示取的份数。', `平均分成 ${denominator} 份并取 1 份，是 ${denominator} 分之一。`),
    pair('把分数和“平均分成几份并取几份”连起来。', [['二分之一', '平均分成 2 份，取 1 份'], ['三分之一', '平均分成 3 份，取 1 份'], ['三分之二', '平均分成 3 份，取 2 份'], ['四分之一', '平均分成 4 份，取 1 份']], '先读分母表示的总份数，再看分子表示取了几份。', '分母表示平均分的份数，分子表示其中取的份数。'),
    choose('同样大小的圆，一个平均分成 2 份取 1 份，另一个平均分成 4 份取 1 份。哪个更大？', ['二分之一更大', '四分之一更大', '一样大'], 0, '整体相同，分的份数越少，每一份越大。', '同一个整体平均分成 2 份，每份大于平均分成 4 份后的一份。'),
    sortInto('把“分子是 1”和“分子不是 1”的分数分类。', ['分子是 1', '分子不是 1'], [{ label: '二分之一', categoryIndex: 0 }, { label: '三分之一', categoryIndex: 0 }, { label: '三分之二', categoryIndex: 1 }, { label: '四分之三', categoryIndex: 1 }], '看分数名称中表示取了几份的分子。', '取 1 份的分数分子是 1；取多份时分子不是 1。'),
    arrange('按每份从大到小排列：二分之一、三分之一、四分之一。', ['四分之一', '二分之一', '三分之一'], [1, 2, 0], '比较分母；分子都是 1，分母越大，每份越小。', '从大到小是二分之一、三分之一、四分之一。'),
    choose('把一张纸平均分成 4 份，涂其中 3 份。下面哪项表示涂色部分？', ['四分之三', '三分之四', '四分之一'], 0, '分母写总份数，分子写涂色份数。', '总共 4 份，涂了 3 份，涂色部分是四分之三。'),
    difficulty === 'basic'
      ? taskIndex === 0
        ? choose('判断一块蛋糕能不能表示成“几分之一”，先检查什么？', ['蛋糕是否被平均分成相同大小的份', '每份是否涂成同一种颜色', '盘子是否是圆形'], 0, '每一份需要一样大。', '只有平均分成相同大小的份，才能准确表示分数。')
        : choose('一张纸平均分成 3 份，取其中 1 份，分母表示什么？', ['平均分成的总份数', '取出的份数', '纸的颜色'], 0, '分母在分数名称中表示整体分成几份。', '分母表示平均分成的总份数，所以这里是 3。')
      : difficulty === 'advanced'
        ? taskIndex === 0
          ? choose('同样大小的两张纸，一张平均分成 3 份取 1 份，另一张平均分成 2 份取 1 份。怎样比较？', ['二分之一更大，因为同一整体分得份数更少', '三分之一更大，因为 3 比 2 大', '两份一样大'], 0, '整体相同，平均分的份数越少，每一份越大。', '二分之一大于三分之一。')
          : choose('同样大小的两块巧克力分别平均分成 4 份和 2 份，各取 1 份。哪一份更大？', ['二分之一更大', '四分之一更大', '一样大'], 0, '同一整体分成更少的相等份，每份更大。', '二分之一大于四分之一。')
        : taskIndex === 0
          ? choose('要把一张纸的四分之一涂色，怎样安排步骤更可靠？', ['先把纸平均分成 4 份，再涂其中 1 份', '随意画 4 块大小不同的区域再涂一块', '先涂色，再猜总共分成几份'], 0, '先保证整体平均分，再确定取其中几份。', '平均分成 4 份并取 1 份，才能表示四分之一。')
          : choose('同伴把一块没有平均分的蛋糕说成“二分之一”，应该怎样检查？', ['看两部分是否一样大；不一样大就不能这样表示', '只看蛋糕是否切成两块', '只看盘子的形状'], 0, '分成两块还不够，每一份还要一样大。', '两部分大小不相等，不是平均分，不能直接叫二分之一。'),
  ];
}

function makeClassification(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const seed = seedFor(entry, difficulty, taskIndex);
  const redCount = 3 + (seed % 3);
  const blueCount = redCount + 1 + (seed % 2);
  const total = redCount + blueCount;
  const finalQuestion = difficulty === 'basic'
    ? taskIndex === 0
      ? choose('按颜色整理积木时，怎样分组更清楚？', ['红色积木放一组，蓝色积木放另一组', '不看颜色随便放', '把数过的积木再放进两组'], 0, '先确定一个相同的分类标准。', '按颜色这个标准分组，每块积木只放一次。')
      : choose(`红色 ${redCount} 块、蓝色 ${blueCount} 块，怎样记录才能让同伴核对总数？`, [`写清两组数量，并检查 ${redCount} + ${blueCount} 是否等于 ${total}`, '只写两组中较多的一种颜色', '把两组数量记成一样多'], 0, '分别记录每组数量，再相加检查总数。', `${redCount} + ${blueCount} = ${total}，两组数量合起来与总数一致。`)
    : difficulty === 'advanced'
      ? taskIndex === 0
        ? chooseNumber(`红色积木 ${redCount} 块，蓝色积木 ${blueCount} 块，蓝色比红色多几块？`, blueCount - redCount, [blueCount - redCount + 1, Math.max(0, blueCount - redCount - 1)], '先按颜色分组，再比较两组数量。', `蓝色积木比红色积木多 ${blueCount - redCount} 块。`)
        : choose('同学要比较两盒彩色卡片，怎样整理数据才公平？', ['两盒都按颜色分类，并分别记录每种颜色的数量', '一盒按颜色分，另一盒按大小分', '只比较卡片盒的大小'], 0, '要使用相同分类标准，结果才能比较。', '两盒都按颜色分类并记录数量，比较才有依据。')
      : taskIndex === 0
        ? choose(`红色积木 ${redCount} 块、蓝色积木 ${blueCount} 块，一共 ${total} 块。怎样核对整理记录？`, [`分别点数，再检查 ${redCount} + ${blueCount} 是否等于 ${total}`, '只看蓝色积木，不点数红色积木', '把两组数量写成同一个数'], 0, '分组点数后，再把各组数量相加核对总数。', `${redCount} + ${blueCount} = ${total}，记录与总数一致。`)
        : choose(`同伴记录红色 ${redCount} 块、蓝色 ${blueCount - 1} 块，但清点共有 ${total} 块。怎样找到问题？`, ['重新按颜色分组点数，并把两组数量相加检查', '随便把一个数字改大', '不看积木，保留原记录'], 0, '回到实物按同一标准复点，再核对总数。', '复点后确认两组数量之和是否等于实物总数，才能找到漏记的颜色组。');

  return [
    choose('把积木按颜色分类，哪个标准最合适？', ['看积木的颜色', '看积木摆放的位置', '看谁先拿到积木'], 0, '分类标准要清楚并且能用在每块积木上。', '按照颜色分类，每块积木都能放到相应的一组。'),
    calculate(`${redCount} 块红色积木和 ${blueCount} 块蓝色积木一共有多少块？`, `${redCount} + ${blueCount}`, total, '把两组积木的数量合起来。', `${redCount} + ${blueCount} = ${total} 块。`),
    pair('把分类标准和相应的组连起来。', [['红色', '红色积木组'], ['蓝色', '蓝色积木组'], ['颜色相同', '放在同一组'], ['每块只数一次', '避免重复记录']], '先看分类标准，再看它说明哪一组。', '按颜色分组，并让每块积木只记录一次。'),
    sortInto('把积木分到红色组或蓝色组。', ['红色组', '蓝色组'], [{ label: '红色积木 A', categoryIndex: 0 }, { label: '蓝色积木 A', categoryIndex: 1 }, { label: '红色积木 B', categoryIndex: 0 }, { label: '蓝色积木 B', categoryIndex: 1 }], '看每块积木的颜色。', '红色积木放红色组，蓝色积木放蓝色组。'),
    arrange('按步骤整理积木并记录数量。', ['分别数每组有几块', '先确定按颜色分类', '把相同颜色的积木放在一起', '检查各组数量合起来是否正确'], [1, 2, 0, 3], '先定分类标准，再分组、点数和核对。', '按颜色分组后数一数，最后把各组数量相加检查。'),
    chooseNumber(`蓝色积木有 ${blueCount} 块，红色积木有 ${redCount} 块，蓝色比红色多几块？`, blueCount - redCount, [blueCount - redCount + 1, Math.max(0, blueCount - redCount - 1)], '用较多的一组数量减去较少的一组数量。', `${blueCount} - ${redCount} = ${blueCount - redCount} 块。`),
    choose('同一块积木已经数过一次，记录时应该怎样做？', ['做一个记号，不要再重复数', '放回未数的一堆再数一次', '同时记在两组里'], 0, '每件物品只对应一次点数。', '做记号并移到已数的一边，可以减少重复和漏数。'),
    finalQuestion,
  ];
}

function makeSets(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  if (entry.grade === 1) return makeClassification(entry, difficulty, taskIndex);
  const seed = seedFor(entry, difficulty, taskIndex);
  const both = 2 + seed % 4;
  const onlyA = 3 + (seed + 1) % 5;
  const onlyB = 2 + (seed + 2) % 5;
  const total = onlyA + onlyB + both + 2;
  const groupA = onlyA + both;
  const groupB = onlyB + both;
  const union = onlyA + onlyB + both;
  const finalQuestion = difficulty === 'basic'
    ? taskIndex === 0
      ? choose('比较两组人数时，怎样避免把重复的人多算？', ['把两组重叠的人单独记录，并只计一次', '把重叠的人删掉', '每个重叠的人在每组都算一次'], 0, '集合图中的重叠区域表示两种情况都符合。', '重叠部分的人在总人数中只应计算一次。')
      : chooseNumber(`A 组有 ${groupA} 人、B 组有 ${groupB} 人，其中 ${both} 人两组都参加。至少参加一种的有多少人？`, union, [groupA + groupB, union - 1], '两组相加后，要减去被重复计算的交集人数。', `${groupA} + ${groupB} - ${both} = ${union} 人。`)
    : difficulty === 'advanced'
      ? taskIndex === 0
        ? chooseNumber(`A 组有 ${groupA} 人，B 组有 ${groupB} 人，其中 ${both} 人同时属于两组。至少属于一组的有多少人？`, union, [union + 1, union - 1], '先把两组人数相加，再减去重复计算的交集人数。', `${groupA} + ${groupB} - ${both} = ${union} 人。`)
        : chooseNumber(`调查中 ${groupA} 人参加 A 活动、${groupB} 人参加 B 活动，有 ${both} 人两种都参加。共有多少人至少参加一种？`, union, [groupA + groupB, union - 1], '两组相加后，重叠的人需要减去一次。', `${groupA} + ${groupB} - ${both} = ${union} 人。`)
      : taskIndex === 0
        ? choose(`小组把 A 组 ${groupA} 人和 B 组 ${groupB} 人直接相加，得到 ${groupA + groupB} 人；其中 ${both} 人两组都参加。怎样修正？`, [`减去重复的 ${both} 人，至少参加一种的有 ${union} 人`, '再加上重复的 ${both} 人', '不看重叠人数，直接保留总数'], 0, '重叠的人在两个组人数中被算了两次。', `${groupA} + ${groupB} - ${both} = ${union} 人。`)
        : choose(`要核对“至少参加一种”的人数，哪种解释最完整？`, [`分别统计只参加 A、只参加 B 和两种都参加的人，再与全班人数核对`, '把 A 组和 B 组总数直接相加，不检查重复', '只统计两种都参加的人'], 0, '按集合图的三个区域求和，再检查未参加者。', `把 ${onlyA}、${onlyB} 和 ${both} 相加得到 ${union} 人，再加上两种都不参加的 2 人，正好是 ${total} 人。`);
  return [
    choose('整理调查结果时，同一个同学喜欢两种活动，应该怎样记录？', ['在两组重叠的部分记一次', '在两组各记一次后还当作两个人', '把同学漏掉'], 0, '同一个人只能算一个人，重复喜欢的信息要标清。', '两组交集表示同时属于两组的人，只能在总人数中算一次。'),
    calculate(`${onlyA} 人只喜欢 A，${onlyB} 人只喜欢 B，${both} 人两种都喜欢，共有多少人至少喜欢一种？`, `${onlyA} + ${onlyB} + ${both}`, onlyA + onlyB + both, '把只喜欢 A、只喜欢 B 和两种都喜欢的人数相加。', `至少喜欢一种的有 ${onlyA + onlyB + both} 人。`),
    pair('把集合图区域和含义连起来。', [['A 圈独有部分', '只属于 A 组'], ['B 圈独有部分', '只属于 B 组'], ['两个圈重叠部分', '同时属于 A 和 B'], ['圈外部分', '两组都不属于']], '看清一个区域在圈内还是两个圈的重叠处。', '集合图的不同区域分别表示独有、同时属于或都不属于。'),
    chooseNumber(`全班 ${total} 人，至少喜欢一种活动的有 ${onlyA + onlyB + both} 人，两种都不喜欢的有多少人？`, 2, [1, 3], '用全班人数减去至少喜欢一种的人数。', `${total} - ${onlyA + onlyB + both} = 2 人。`),
    sortInto('把人数放到集合图的四个区域。', ['只喜欢 A', '只喜欢 B', '两种都喜欢', '两种都不喜欢'], [{ label: `只喜欢 A 的 ${onlyA} 人`, categoryIndex: 0 }, { label: `只喜欢 B 的 ${onlyB} 人`, categoryIndex: 1 }, { label: `两种都喜欢的 ${both} 人`, categoryIndex: 2 }, { label: '两种都不喜欢的 2 人', categoryIndex: 3 }], '先判断每个人是否属于 A 组、B 组或两组都不属于。', 'A、B 独有部分、重叠部分和圈外部分各有自己的区域。'),
    arrange('整理调查过程：先问清标准，再记录人数并核对总人数。', ['核对分类人数和全班人数', '确定调查的两种活动', '统计每个区域人数', '向同学说明调查结果'], [1, 2, 0, 3], '先确定分类标准，再进行统计和核对。', '明确活动类别后，统计并核对人数，最后再分享结果。'),
    chooseNumber(`A 组有 ${onlyA + both} 人，其中只属于 A 组的有 ${onlyA} 人。两组都属于的有多少人？`, onlyA + both - onlyA, [both + 1, Math.max(0, both - 1)], 'A 组人数由“只属于 A”和“两组都属于”组成。', `${onlyA + both} - ${onlyA} = ${both} 人属于两组。`),
    finalQuestion,
  ];
}

function makeTable(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const seed = seedFor(entry, difficulty, taskIndex);
  const offset = seed % 3;
  const rows = [
    { activity: '阅读', classOne: 2 + offset, classTwo: 3 + offset },
    { activity: '绘画', classOne: 3 + offset, classTwo: 3 + offset },
    { activity: '跳绳', classOne: 3 + offset, classTwo: 5 + offset },
    { activity: '唱歌', classOne: 6 + offset, classTwo: 3 + offset },
  ];
  const reading = rows[0]!;
  const jumping = rows[2]!;
  const readingTotal = reading.classOne + reading.classTwo;
  const orderedRows = [...rows].sort((left, right) => left.classOne + left.classTwo - right.classOne - right.classTwo);
  const compareClassOne = (row: typeof rows[number]) => row.classOne > row.classTwo ? 0 : row.classOne < row.classTwo ? 1 : 2;
  const finalQuestion = difficulty === 'basic'
    ? taskIndex === 0
      ? choose(`看“${reading.activity}”这一行，哪一班参加人数更多？`, ['二班', '一班', '一样多'], 0, '对照同一活动行中的两个班级数据。', `${reading.classTwo} 人比 ${reading.classOne} 人多。`)
      : choose('读复式统计表时，先看行标题和列标题有什么用？', ['确认每个数字对应的活动和班级', '只看表格颜色', '只看最大数字'], 0, '行和列标题能说明数字代表什么。', '看清行标题和列标题，才能知道数字对应哪项活动和哪个班。')
    : difficulty === 'advanced'
      ? taskIndex === 0
        ? choose(`“${reading.activity}”共有 ${readingTotal} 人参加，怎样从表中得到这个数？`, [`把一班和二班的 ${reading.classOne} 人、${reading.classTwo} 人相加`, '只看一班人数', '把两个班的人数相减'], 0, '按同一活动找到两个班的人数，再合并。', `${reading.classOne} + ${reading.classTwo} = ${readingTotal} 人。`)
        : choose('要找参加人数最多的活动，应怎样利用表格？', ['先把每项活动的两个班人数相加，再比较总数', '只比较第一行的一个班', '按活动名称的长短排序'], 0, '比较活动总人数时，要对每项活动使用相同的方法。', `分别相加后再比较，才能找出总人数最多的活动：${orderedRows.at(-1)!.activity}。`)
      : taskIndex === 0
        ? choose('准备向同学介绍这张复式统计表，怎样安排说明更清楚？', ['先说调查的活动和班级，再按活动逐行比较数据', '只报最大的一个数字', '不说明数字对应哪个班'], 0, '先交代表格记录什么，再按行说明发现。', '说明调查内容和行列信息后，听者能跟着表格核对。')
        : choose(`绘画这一行记录一班 ${rows[1]!.classOne} 人、二班 ${rows[1]!.classTwo} 人，合计却写成 ${rows[1]!.classOne + rows[1]!.classTwo + 1} 人。怎样修正？`, [`合计应为 ${rows[1]!.classOne + rows[1]!.classTwo} 人，并回看记录核实`, '把二班人数也改成合计数', '不检查，保留原合计'], 0, '把两个班的人数相加，再回到记录核实。', `${rows[1]!.classOne} + ${rows[1]!.classTwo} = ${rows[1]!.classOne + rows[1]!.classTwo} 人。`);
  return [
    choose(`“${reading.activity}”有一班 ${reading.classOne} 人、二班 ${reading.classTwo} 人，哪个班更多？`, ['二班', '一班', '一样多'], 0, '对照同一活动行中的两个班级数据。', `二班 ${reading.classTwo} 人，比一班 ${reading.classOne} 人多。`),
    calculate(`“${reading.activity}”两个班一共有多少人？`, `${reading.classOne} + ${reading.classTwo}`, readingTotal, '把同一活动行中的两个班人数相加。', `${reading.classOne} + ${reading.classTwo} = ${readingTotal} 人。`),
    pair('把活动和两个班对应的人数连起来。', rows.map(({ activity, classOne, classTwo }) => [activity, `一班 ${classOne} 人、二班 ${classTwo} 人`] as const), '按活动名称逐行核对两个班的人数。', '每项活动都要和同一行的两个班级数据对应。'),
    sortInto('把活动按“ 一班更多”“二班更多”或“两班一样多”分类。', ['一班更多', '二班更多', '两班一样多'], rows.map((row) => ({ label: row.activity, categoryIndex: compareClassOne(row) })), '比较同一活动行的两个班级人数。', '逐行比较一班和二班的数据，再按人数关系分类。'),
    arrange('按两个班参加人数的总和从少到多排列活动。', rows.map(({ activity }) => activity), orderedRows.map(({ activity }) => rows.findIndex((row) => row.activity === activity)), '先把每项活动的两个班人数相加，再比较总数。', `总人数从少到多的活动是 ${orderedRows.map(({ activity }) => activity).join('、')}。`),
    chooseNumber(`跳绳活动一班 ${jumping.classOne} 人、二班 ${jumping.classTwo} 人，二班比一班多几人？`, jumping.classTwo - jumping.classOne, [jumping.classTwo - jumping.classOne + 1, Math.max(0, jumping.classTwo - jumping.classOne - 1)], '用二班人数减去一班人数。', `${jumping.classTwo} - ${jumping.classOne} = ${jumping.classTwo - jumping.classOne} 人。`),
    choose('想比较两组数据，先看什么？', ['比较项目和统计标准是否相同', '只看表格颜色', '把不同项目的数量直接当成相同项目'], 0, '比较前要确认数据的项目和标准一致。', '比较相同项目、相同口径的数据，结论才有意义。'),
    finalQuestion,
  ];
}

function makeCalendar(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const seed = seedFor(entry, difficulty, taskIndex);
  const month = 1 + seed % 12;
  const days = [4, 6, 9, 11].includes(month) ? 30 : month === 2 ? 28 : 31;
  const day = 5 + seed % Math.max(1, days - 8);
  const hours = 1 + seed % 6;
  return [
    chooseNumber(`${month === 2 ? '平年' : ''}${month} 月有多少天？`, days, days === 31 ? [30, 28] : [31, 29], '回想不同月份的天数。', `${month} 月${month === 2 ? '在平年' : ''}有 ${days} 天。`),
    calculate(`今天是 ${month} 月 ${day} 日，过 1 天是几月几日？`, `${day} + 1`, day + 1, '日期加 1 天，注意本题没有跨月。', `过 1 天是 ${month} 月 ${day + 1} 日。`),
    pair('把时间表示和它的含义连起来。', [['1 天', '24 小时'], ['中午 12 时', '12:00'], ['下午 3 时', '15:00'], ['晚上 8 时', '20:00']], '24 时计时法从 0 时开始连续计时。', '下午和晚上的时刻换成 24 时计时法时，要按时段转换。'),
    chooseNumber(`下午 2 时用 24 时计时法表示是几点？`, 14, [12, 2], '下午时刻加上 12 小时。', '下午 2 时是 14 时。'),
    sortInto('按“有 30 天”和“有 31 天”分类。', ['30 天', '31 天'], [{ label: '4 月', categoryIndex: 0 }, { label: '6 月', categoryIndex: 0 }, { label: '1 月', categoryIndex: 1 }, { label: '8 月', categoryIndex: 1 }], '回想每个月的天数。', '4 月和 6 月各有 30 天，1 月和 8 月各有 31 天。'),
    arrange('把一天中的时刻按先后排好。', ['下午 3 时', '上午 9 时', '晚上 8 时', '中午 12 时'], [1, 3, 0, 2], '先排上午，再排中午、下午和晚上。', '上午 9 时、中午 12 时、下午 3 时、晚上 8 时依次变晚。'),
    calculate(`一项活动从上午 9 时开始，经过 ${hours} 小时后结束，是几点？`, `9 + ${hours}`, 9 + hours, '从开始的时刻向后数经过的小时数。', `活动在 ${9 + hours} 时结束。`),
    difficulty === 'basic'
      ? taskIndex === 0
        ? choose('安排活动日期时，哪种记录最不容易混淆？', ['写清年月日和开始时间', '只写“下周”', '只写星期几，不写日期'], 0, '年月日和时间能准确定位活动。', '写清年月日和开始时间，方便核对具体安排。')
        : choose('查看月份日历时，想知道这个月有多少天，先看哪里？', ['看这个月最后一天的日期', '看第一周有几天', '只看星期标题'], 0, '月份天数由这个月的最后一个日期确定。', `${month} 月的最后一天是 ${days} 日，所以这个月有 ${days} 天。`)
      : difficulty === 'advanced'
        ? taskIndex === 0
          ? choose('下午 5 时用 24 时计时法怎样表示？', ['17:00', '5:00', '15:00'], 0, '下午时刻换成 24 时计时法时，在小时上加 12。', '17:00 表示下午 5 时。')
          : choose('活动从 11 时开始，到 14 时结束，经过了几小时？', ['3 小时', '2 小时', '4 小时'], 0, '用结束时刻减去开始时刻。', '14 - 11 = 3 小时。')
        : taskIndex === 0
          ? choose(`活动从上午 9 时开始，经过 ${hours} 小时结束。怎样检查结束时刻？`, [`从 9 时起向后数 ${hours} 小时，再看是否与记录一致`, '只检查活动名称', '把经过时间加到日期上'], 0, '把开始时刻和经过时间联系起来核对。', `9 + ${hours} = ${9 + hours} 时，可以据此核对结束时间。`)
          : choose('平年 3 月 31 日的第二天是几月几日？', ['4 月 1 日', '3 月 32 日', '4 月 2 日'], 0, '3 月有 31 天，接着进入 4 月。', '3 月 31 日之后是 4 月 1 日。'),
  ];
}

function makeDecimals(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const seed = seedFor(entry, difficulty, taskIndex);
  const tenths = 1 + seed % 7;
  const nextTenth = tenths + 1;
  const finalQuestion = difficulty === 'basic'
    ? taskIndex === 0
      ? choose('比较 0.3 和 0.7 时，应该怎样看？', ['十分位上的 7 比 3 大，所以 0.7 大', '只比较小数点右边数字的个数', '位数少的小数一定大'], 0, '两个数都是十分位小数，直接比较十分位。', '0.7 有 7 个十分之一，0.3 有 3 个十分之一，所以 0.7 大。')
      : choose('同伴说 0.4 比 0.6 大，因为 4 比 6 小。哪种判断正确？', ['0.6 大，6 个十分之一比 4 个多', '0.4 大，因为十分位数字小', '两个数一样大'], 0, '十分位数字表示几个十分之一。', '0.6 有 6 个十分之一，0.4 有 4 个十分之一，所以 0.6 大。')
    : difficulty === 'advanced'
      ? taskIndex === 0
        ? choose(`一段绳子长 0.${tenths} 米，另一段长 0.${nextTenth} 米。哪一段长？`, [`0.${nextTenth} 米，因为它有更多个十分之一`, `0.${tenths} 米，因为十分位数字较小`, '两段一样长'], 0, '把长度都看成“几个十分之一米”再比较。', `0.${nextTenth} 比 0.${tenths} 多 1 个十分之一米，所以第二段更长。`)
        : choose(`0.${tenths} 和 0.${nextTenth} 相差几个十分之一？`, ['1 个', '2 个', '相差 0 个'], 0, '比较十分位数字相差多少。', `十分位数字相差 1，所以相差 1 个十分之一。`)
      : taskIndex === 0
        ? choose(`同伴说 0.${tenths} 比 0.${nextTenth} 大，因为 ${tenths} 比 ${nextTenth} 小。怎样判断？`, [`十分位上 ${nextTenth} 比 ${tenths} 大，所以 0.${nextTenth} 更大`, '位数相同，所以两个数一样大', '小数点右边的数字越小，整个数越大'], 0, '先比较相同数位上的数字。', `十分位上 ${nextTenth} 大于 ${tenths}，因此 0.${nextTenth} 更大。`)
        : choose('要向同学解释两个十分位小数哪个更大，哪种说明最清楚？', ['指出十分位数字并把它们都看成十分之几', '只说自己更喜欢哪个数', '只比较小数点的位置'], 0, '把小数和十分之一联系起来说明。', '说明十分位数字表示几个十分之一，别人能据此核对大小。');
  return [
    chooseNumber(`0.${tenths} 里有几个十分之一？`, tenths, [tenths + 1, tenths - 1], '十分位上的数字表示几个十分之一。', `0.${tenths} 表示 ${tenths} 个十分之一。`),
    choose(`0.4 和 0.5 哪个大？`, ['0.5 大', '0.4 大', '两个数相等'], 0, '比较十分位上的数字。', '5 个十分之一大于 4 个十分之一，所以 0.5 大。'),
    pair('把小数和它的读法连起来。', [['0.2', '零点二'], ['0.5', '零点五'], ['0.8', '零点八'], ['0.3', '零点三']], '小数点右边只有一位，按这一位读。', '0.2、0.5、0.8、0.3 分别读作零点二、零点五、零点八、零点三。'),
    choose(`哪个数比 0.${tenths} 大？`, [`0.${nextTenth}`, `0.${tenths - 1}`, `0.${Math.min(9, nextTenth + 1)}`], 0, '比较十分位上的数字。', `十分位 ${nextTenth} 大于 ${tenths}，所以 0.${nextTenth} 更大。`),
    sortInto('按“十分位是 0”和“十分位不是 0”分类。', ['十分位是 0', '十分位不是 0'], [{ label: '1.0', categoryIndex: 0 }, { label: '2.0', categoryIndex: 0 }, { label: '0.3', categoryIndex: 1 }, { label: '0.7', categoryIndex: 1 }], '十分位是小数点右边第一位。', '1.0、2.0 的十分位是 0；0.3、0.7 的十分位不是 0。'),
    arrange('把这些小数按从小到大排列。', ['0.5', '0.2', '0.8', '0.3'], [1, 3, 0, 2], '比较十分位上的数字。', '从小到大是 0.2、0.3、0.5、0.8。'),
    choose(`0.${tenths} 和 0.${nextTenth} 相比，哪个数更大？`, [`0.${nextTenth}`, `0.${tenths}`, '两个数相等'], 0, '比较小数点右边十分位上的数字。', `${nextTenth} 个十分之一大于 ${tenths} 个十分之一，所以 0.${nextTenth} 更大。`),
    finalQuestion,
  ];
}

function makeCombinations(_entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const firstChoices = taskIndex === 0 ? ['红上衣', '蓝上衣'] : ['牛奶', '果汁', '豆浆'];
  const secondChoices = taskIndex === 0 ? ['黑裤子', '白裤子', '灰裤子'] : ['面包', '饼干'];
  const combinations = firstChoices.flatMap((first) => secondChoices.map((second) => [`${first} + ${second}`, `${first}配${second}`] as const));
  const total = firstChoices.length * secondChoices.length;
  const focusedItems = [`${firstChoices[0]} + ${secondChoices[0]}`, `${firstChoices[0]} + ${secondChoices[1]}`, `${firstChoices[1]} + ${secondChoices[0]}`, `${firstChoices[1]} + ${secondChoices[1]}`];
  const q8 = difficulty === 'basic'
    ? choose(`已经列完“${firstChoices[0]}”的搭配后，下一步怎么做？`, [`换下一种${taskIndex === 0 ? '上衣' : '饮料'}，再分别搭配每一种${taskIndex === 0 ? '裤子' : '点心'}`, '重复写第一种搭配', '停止，不用看其他选择'], 0, '固定第一类中的一种选择，再依次搭配第二类。', '换下一种选择并逐一配对，才能列全。')
    : difficulty === 'advanced'
      ? choose(`有 ${firstChoices.length} 种${taskIndex === 0 ? '上衣' : '饮料'}和 ${secondChoices.length} 种${taskIndex === 0 ? '裤子' : '点心'}，怎样检查搭配数？`, ['把每一种第一类选择分别和所有第二类选择配对', '只数第一类选择', '只写自己最喜欢的一种'], 0, '每一种第一类选择都要逐一搭配第二类的每一种。', `按这个方法列出 ${firstChoices.length} × ${secondChoices.length} 种搭配。`)
      : taskIndex === 0
        ? choose('发现两张搭配卡写成了同一种组合，先检查什么？', ['固定一种上衣，逐一核对它配过的裤子', '把重复的卡留着不管', '只检查上衣颜色'], 0, '重复组合通常来自漏记或重复列卡。', '固定一件上衣逐一核对裤子，能发现漏项和重复项。')
        : choose('准备把搭配结果交给同学核对，怎样整理最清楚？', ['按一种饮料分组，再列出每种点心', '把卡片随意混在一起', '只报一个总数，不展示组合'], 0, '固定一种饮料并列出对应点心，伙伴更容易检查。', '分组列出每种组合，伙伴能检查是否不重不漏。');
  return [
    chooseNumber(`${firstChoices.length} 种${taskIndex === 0 ? '上衣' : '饮料'}和 ${secondChoices.length} 种${taskIndex === 0 ? '裤子' : '点心'}，每次各选一种，有几种搭配？`, total, [total - 1, total + 1], '每种第一类选择都要和第二类的每一种配一次。', `${firstChoices.length} × ${secondChoices.length} = ${total} 种搭配。`),
    calculate(`${secondChoices.length} 种${taskIndex === 0 ? '裤子' : '点心'}分别和 ${firstChoices.length} 种${taskIndex === 0 ? '上衣' : '饮料'}配对，一共多少种？`, `${firstChoices.length} × ${secondChoices.length}`, total, '交换列出顺序，检查每一种组合是否都出现。', `一共是 ${firstChoices.length} × ${secondChoices.length} = ${total} 种。`),
    pair('把每种搭配和它的文字记录连起来。', combinations, '固定一种第一类选择，再逐个核对第二类。', '每一种组合都只出现一次。'),
    arrange(`按顺序列出“${firstChoices[0]}”的前两种搭配。`, [`${firstChoices[0]} + ${secondChoices[1]}`, `${firstChoices[0]} + ${secondChoices[0]}`], [1, 0], '先固定第一类选择，再按题目给出的第二类顺序排列。', `先配 ${secondChoices[0]}，再配 ${secondChoices[1]}。`),
    sortInto('把搭配按第一类选择分类。', [firstChoices[0]!, firstChoices[1]!], focusedItems.map((label) => ({ label, categoryIndex: label.startsWith(firstChoices[0]!) ? 0 : 1 })), '看每个组合中的第一类选择。', '按同一个选择标准分组。'),
    chooseNumber(`固定${firstChoices[0]}，和每一种${taskIndex === 0 ? '裤子' : '点心'}各搭配一次，有几种组合？`, secondChoices.length, [secondChoices.length - 1, secondChoices.length + 1], '第一类选择固定后，逐一数第二类有几种选择。', `固定${firstChoices[0]}，有 ${secondChoices.length} 种${taskIndex === 0 ? '裤子' : '点心'}可选，所以有 ${secondChoices.length} 种组合。`),
    choose('按固定顺序枚举搭配有什么好处？', ['更容易发现有没有漏掉或重复的方案', '可以不用检查结果', '只列自己喜欢的方案'], 0, '按固定顺序逐项尝试每一种组合。', '有顺序地列举，可以更容易做到不重不漏。'),
    q8,
  ];
}

function makeMultiples(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const seed = seedFor(entry, difficulty, taskIndex);
  const groupSize = 2 + seed % 5;
  const factor = 2 + (seed + 1) % 4;
  const product = groupSize * factor;
  const practiceMultiple = factor === 2 ? 3 : 2;
  const facts = [1, 2, 3, 4].map((multiple) => ({ multiple, result: groupSize * multiple }));
  const finalQuestion = difficulty === 'basic'
    ? taskIndex === 0
      ? choose('要判断“甲的数量是乙的几倍”，需要比较什么？', ['甲、乙两个数量以及它们之间的倍数关系', '只看物品颜色', '只看其中一个数量'], 0, '倍数关系要同时知道比较的两个数量。', '用较多的总量和每份数量比较，才能求出几倍。')
      : choose(`${groupSize} 的 ${factor} 倍表示什么？`, [`相同的 ${groupSize} 个物品有 ${factor} 份，合起来是 ${product} 个`, `只取 ${groupSize} 个物品，不重复几份`, `把 ${factor} 个物品平均分成 ${groupSize} 份`], 0, '“几倍”表示相同数量重复几份。', `${groupSize} 的 ${factor} 倍是 ${groupSize} × ${factor} = ${product}。`)
    : difficulty === 'advanced'
      ? taskIndex === 0
        ? chooseNumber(`${product} 个球平均装进每盒 ${groupSize} 个的盒子里，需要几个盒子？`, factor, [factor - 1, factor + 1], '用球的总数除以每盒的数量。', `${product} ÷ ${groupSize} = ${factor} 个盒子。`)
        : chooseNumber(`${groupSize} 个一组，排成 ${factor} 组后又增加 1 组，现在有多少个？`, product + groupSize, [product + 1, product - groupSize], '先求原来几组的总数，再加上新增加的一组。', `${groupSize} × ${factor} + ${groupSize} = ${product + groupSize} 个。`)
      : taskIndex === 0
        ? choose(`同伴把“${groupSize} 的 ${factor} 倍”写成 ${groupSize} + ${factor}。怎样检查并改正？`, [`应算 ${groupSize} × ${factor} = ${product}，表示 ${groupSize} 有 ${factor} 份`, '加法和倍数表示的意思完全相同', '只要把两个数交换位置，不必计算'], 0, '倍数表示相同数量重复几份，不是把两个数相加。', `${groupSize} 的 ${factor} 倍是 ${groupSize} × ${factor} = ${product}。`)
        : choose(`要说明 ${product} 是 ${groupSize} 的几倍，哪种检查最完整？`, [`先算 ${product} ÷ ${groupSize}，再用 ${groupSize} × 商核对总数`, '只比较两个数谁写得大', `把 ${product} 和 ${groupSize} 相加`], 0, '用除法求倍数，再用乘法还原。', `${product} ÷ ${groupSize} = ${factor}，再算 ${groupSize} × ${factor} = ${product}。`);
  return [
    calculate(`${groupSize} 的 ${factor} 倍是多少？`, `${groupSize} × ${factor}`, product, '“几倍”可以用相同数量重复几组来表示。', `${groupSize} × ${factor} = ${product}。`),
    chooseNumber(`${groupSize} 的 ${practiceMultiple} 倍是多少？`, groupSize * practiceMultiple, [groupSize * practiceMultiple - 1, groupSize * practiceMultiple + 1], `${practiceMultiple} 倍就是这样的数量有 ${practiceMultiple} 份。`, `${groupSize} 的 ${practiceMultiple} 倍是 ${groupSize} × ${practiceMultiple} = ${groupSize * practiceMultiple}。`),
    pair(`把“${groupSize} 的几倍”和对应数量连起来。`, facts.map(({ multiple, result }) => [`${groupSize} 的 ${multiple} 倍`, String(result)] as const), '几倍表示相同数量重复几份。', '把每份的数量乘份数，就得到总数量。'),
    choose(`${product} 是 ${groupSize} 的几倍？`, [String(factor), String(factor + 1), String(Math.max(1, factor - 1))], 0, '用总数除以每份的数量。', `${product} ÷ ${groupSize} = ${factor}，所以是 ${factor} 倍。`),
    sortInto(`把“${groupSize} 的倍数”和“不是 ${groupSize} 的倍数”分类。`, [`是 ${groupSize} 的倍数`, `不是 ${groupSize} 的倍数`], facts.map(({ result }) => ({ label: String(result), categoryIndex: 0 })).concat([{ label: String(groupSize * 2 + 1), categoryIndex: 1 }]), `看这个数能不能由相同的 ${groupSize} 份组成。`, `能写成 ${groupSize} 乘整数的数量是它的倍数。`),
    arrange(`把 ${groupSize} 的 1 倍到 4 倍按从小到大排列。`, facts.map(({ result }) => String(result)), [0, 1, 2, 3], `每次增加一份 ${groupSize}。`, `从小到大是 ${facts.map(({ result }) => result).join('、')}。`),
    chooseNumber(`一共装了 ${product} 个球，分在 ${factor} 个相同的盒子里，每盒装多少个？`, groupSize, [groupSize + 1, Math.max(1, groupSize - 1)], '总数平均分成相同的几份。', `${product} ÷ ${factor} = ${groupSize} 个。`),
    finalQuestion,
  ];
}

function makeDivision(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const seed = seedFor(entry, difficulty, taskIndex);
  const divisor = 2 + seed % 6;
  const quotient = 4 + seed % 9;
  const remainder = (seed + 1) % divisor;
  const dividend = divisor * quotient + remainder;
  const facts = [
    ['17 ÷ 3', '商 5 余 2'], ['19 ÷ 3', '商 6 余 1'], ['26 ÷ 4', '商 6 余 2'], ['27 ÷ 4', '商 6 余 3'],
  ] as const;
  return [
    calculate(`${divisor * quotient} ÷ ${divisor} = ?`, `${divisor * quotient} ÷ ${divisor}`, quotient, '想想被除数里有几个这样的除数。', `${divisor * quotient} ÷ ${divisor} = ${quotient}。`),
    choose(`${dividend} ÷ ${divisor} 的商和余数是什么？`, [`商 ${quotient} 余 ${remainder}`, `商 ${quotient + 1} 余 ${remainder}`, `商 ${quotient} 余 ${remainder === 0 ? 1 : remainder - 1}`], 0, '先确定除数乘几最接近被除数但不超过它，再看剩下多少。', `${divisor} × ${quotient} + ${remainder} = ${dividend}，所以商 ${quotient} 余 ${remainder}。`),
    pair('把除法算式和商、余数连起来。', facts, '用“商 × 除数 + 余数 = 被除数”检查。', '每个算式的商乘除数，再加余数，应得到原来的被除数。'),
    calculate(`${divisor * (quotient + 1)} ÷ ${divisor} = ?`, `${divisor * (quotient + 1)} ÷ ${divisor}`, quotient + 1, '除数不变，被除数增加一个除数，商增加 1。', `${divisor * (quotient + 1)} ÷ ${divisor} = ${quotient + 1}。`),
    sortInto('把除法算式分到“没有余数”和“有余数”。', ['没有余数', '有余数'], [{ label: '18 ÷ 3', categoryIndex: 0 }, { label: '20 ÷ 5', categoryIndex: 0 }, { label: '17 ÷ 3', categoryIndex: 1 }, { label: '19 ÷ 4', categoryIndex: 1 }], '看被除数能否被除数平均分完。', '前两题正好分完；后两题分完后还会剩下一些。'),
    arrange('把有余数除法的检查步骤排好。', ['余数要比除数小', '用商乘除数', '再加上余数', '核对是否得到被除数'], [1, 2, 3, 0], '先从商和除数开始还原。', '商乘除数再加余数应等于被除数，并且余数小于除数。'),
    choose(`${dividend} 个物品每 ${divisor} 个装一袋，能装满几袋，还剩几个？`, [`${quotient} 袋，剩 ${remainder} 个`, `${quotient + 1} 袋，剩 ${remainder} 个`, `${quotient} 袋，剩 ${divisor} 个`], 0, '商表示装满的袋数，余数表示剩下的个数。', `${dividend} ÷ ${divisor} = 商 ${quotient} 余 ${remainder}。`),
    difficulty === 'basic'
      ? chooseNumber(`检查这题：${divisor} × ${quotient} + ${remainder} = ?`, dividend, [dividend - 1, dividend + 1], '先算乘法，再加余数。', `${divisor} × ${quotient} + ${remainder} = ${dividend}。`)
      : difficulty === 'advanced'
        ? taskIndex === 0
          ? choose(`要检查 ${dividend} ÷ ${divisor} = 商 ${quotient} 余 ${remainder}，还要确认什么？`, ['商乘除数再加余数等于被除数，且余数小于除数', '余数可以比除数大', '只看商，不看余数'], 0, '检查有余数除法的两个条件。', `${divisor} × ${quotient} + ${remainder} = ${dividend}，且 ${remainder} 小于 ${divisor}。`)
          : choose('把一袋物品平均分给几组后还剩一些，怎样完整记录？', ['写出每组数量和剩余数量', '只写剩下多少', '只写分了几组'], 0, '商和余数各表示一种信息。', '完整记录商和余数，才能说明分组情况。')
        : taskIndex === 0
          ? choose(`同伴说 ${dividend} ÷ ${divisor} = 商 ${quotient} 余 ${divisor}，哪一步要改？`, [`余数必须小于 ${divisor}，应重新计算`, '余数可以等于除数', '只要商对，余数不用检查'], 0, '余数必须比除数小。', `余数 ${divisor} 不小于除数 ${divisor}，这个记录不符合有余数除法。`)
          : choose(`为了说明 ${dividend} ÷ ${divisor} 的结果可靠，哪种解释完整？`, [`${divisor} 乘商 ${quotient} 再加余数 ${remainder} 等于 ${dividend}，且余数小于除数`, '只说商看起来合理', '只检查被除数是偶数还是奇数'], 0, '用逆运算还原被除数，并检查余数。', `${divisor} × ${quotient} + ${remainder} = ${dividend}，且余数小于除数。`),
  ];
}

function makePerimeter(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const seed = seedFor(entry, difficulty, taskIndex);
  const width = 3 + seed % 5;
  const length = width + 2 + seed % 4;
  const perimeter = 2 * (length + width);
  const side = width + 1;
  const facts = [[3, 2], [4, 2], [5, 2], [6, 2]] as const;
  const halfPerimeter = perimeter / 2;
  const finalQuestion = difficulty === 'basic'
    ? taskIndex === 0
      ? choose('长方形的周长怎么求？', ['把四条边的长度合起来', '用长乘宽', '只量其中一条边'], 0, '周长是图形一周的长度。', '把长方形四条边的长度相加，就得到周长。')
      : choose('长 5 厘米、宽 3 厘米的长方形，哪道算式表示它的周长？', ['5 + 3 + 5 + 3', '5 × 3', '5 + 3'], 0, '周长要把围成图形的一周都算进去。', '长方形有两条长边和两条宽边，周长是 5 + 3 + 5 + 3 厘米。')
    : difficulty === 'advanced'
      ? taskIndex === 0
        ? chooseNumber(`长方形周长是 ${perimeter} 厘米，宽 ${width} 厘米，长是多少厘米？`, halfPerimeter - width, [halfPerimeter, halfPerimeter - width + 1], '先用周长除以 2 得到一条长和一条宽的和，再减去宽。', `${perimeter} ÷ 2 - ${width} = ${halfPerimeter - width} 厘米。`)
        : chooseNumber(`正方形周长是 ${side * 4} 厘米，每条边长多少厘米？`, side, [side + 1, side - 1], '四条边一样长，用周长除以 4。', `${side * 4} ÷ 4 = ${side} 厘米。`)
      : taskIndex === 0
        ? chooseNumber(`长 ${length} 米、宽 ${width} 米的花圃周长为 ${perimeter} 米，留出 2 米作入口后，需要多长的围栏？`, perimeter - 2, [perimeter - 1, perimeter + 2], '先求一周的长度，再减去不安装围栏的入口。', `${perimeter} - 2 = ${perimeter - 2} 米。`)
        : choose('同伴用“长 × 宽”计算长方形周长，怎样说明并改正？', ['长 × 宽求面积；周长要把长和宽各算两条', '周长只需要把长和宽相乘', '周长只等于长边的长度'], 0, '先区分围一周的长度和铺满面的大小。', '周长是 2 ×（长 + 宽）；长 × 宽求的是面积。');
  return [
    calculate(`长 ${length} 厘米、宽 ${width} 厘米的长方形，周长是多少？`, `2 × (${length} + ${width})`, perimeter, '把长和宽相加，再乘 2。', `周长是 2 × (${length} + ${width}) = ${perimeter} 厘米。`),
    choose('长方形的周长应该怎样计算？', ['（长 + 宽）× 2', '长 × 宽', '长 + 宽'], 0, '周长是围成图形一周的长度。', '长方形有两条长边和两条宽边，所以是（长 + 宽）× 2。'),
    pair('把长方形边长和周长连起来。', facts.map(([l, w]) => [`长 ${l} 厘米、宽 ${w} 厘米`, String(2 * (l + w))] as const), '周长等于两条长边和两条宽边的总和。', '每个长方形的周长都是 2 ×（长 + 宽）。'),
    calculate(`正方形边长是 ${side} 厘米，周长是多少？`, `${side} × 4`, side * 4, '正方形四条边一样长。', `${side} × 4 = ${side * 4} 厘米。`),
    sortInto('把“周长”或“面积”分类。', ['周长：一周的长度', '面积：平面的大小'], [{ label: '围着花坛边缘装一圈栏杆', categoryIndex: 0 }, { label: '给地面铺地砖', categoryIndex: 1 }, { label: '沿操场边缘跑一圈', categoryIndex: 0 }, { label: '比较两块地面的大小', categoryIndex: 1 }], '周长看边界一圈，面积看平面大小。', '围一圈或跑一圈对应周长；铺地或比较平面大小对应面积。'),
    arrange('计算长方形周长时按步骤排列。', ['把长和宽相加', '想清楚要求一周的长度', '再乘 2', '写上长度单位'], [1, 0, 2, 3], '先明确周长表示一周，再合并相对边。', '长方形周长可以先算长加宽，再乘 2，最后写单位。'),
    calculate(`一块长 ${length} 米、宽 ${width} 米的花圃四周围栏，至少需要多少米？`, `2 × (${length} + ${width})`, perimeter, '围栏沿花圃四周一圈，求的是周长。', `围栏长度等于周长 ${perimeter} 米。`),
    finalQuestion,
  ];
}

function makeArea(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const seed = seedFor(entry, difficulty, taskIndex);
  const width = 3 + seed % 5;
  const length = width + 2 + seed % 4;
  const area = length * width;
  const side = 2 + seed % 7;
  const squareArea = side * side;
  const finalQuestion = difficulty === 'basic'
    ? taskIndex === 0
      ? choose('长方形的面积怎样计算？', ['长乘宽', '把四条边相加', '只看长边'], 0, '面积表示平面的大小。', '长方形面积等于长乘宽。')
      : choose('长 5 厘米、宽 3 厘米的长方形，哪道算式表示它的面积？', ['5 × 3', '(5 + 3) × 2', '5 + 3'], 0, '面积计算把长和宽相乘。', '长方形面积是 5 × 3 = 15 平方厘米。')
    : difficulty === 'advanced'
      ? taskIndex === 0
        ? chooseNumber(`每块地砖铺 1 平方米，铺满长 ${length} 米、宽 ${width} 米的地面需要多少块？`, area, [area + 1, area - 1], '先求地面的面积，再看每块地砖覆盖多少平方米。', `地面面积是 ${length} × ${width} = ${area} 平方米，需要 ${area} 块地砖。`)
        : choose(`长 ${length} 厘米、宽 ${width} 厘米的长方形，与边长 ${side} 厘米的正方形相比，哪个面积更大？`, [
          area > squareArea ? '长方形面积更大' : area < squareArea ? '正方形面积更大' : '两个面积相等',
          area > squareArea ? '正方形面积更大' : area < squareArea ? '长方形面积更大' : '长方形面积更大',
          '只比较周长就能确定面积',
        ], 0, '分别算出长方形和正方形的面积，再比较。', `长方形面积是 ${area} 平方厘米，正方形面积是 ${squareArea} 平方厘米。`)
      : taskIndex === 0
        ? choose('要估算教室地面需要多少块同样大小的地砖，怎样安排步骤？', ['先测量长和宽并算面积，再按每块地砖面积计算块数', '只量教室的一条边就直接猜', '把周长当成地砖块数'], 0, '先明确每块覆盖的面积，再计算总面积。', '测量边长、求地面面积并除以每块地砖的面积，计划才完整。')
        : choose('两块长方形地面周长相同，哪种结论合理？', ['面积不一定相同，要分别根据长和宽计算', '面积一定相同', '只凭周长就能知道面积'], 0, '周长和面积表示不同的信息。', '周长相同的长方形，长和宽仍可能不同，面积也可能不同。');
  return [
    calculate(`长 ${length} 厘米、宽 ${width} 厘米的长方形，面积是多少平方厘米？`, `${length} × ${width}`, area, '长方形面积等于长乘宽。', `${length} × ${width} = ${area} 平方厘米。`),
    choose('计算课桌面的大小，通常应该求什么？', ['面积', '周长', '方向'], 0, '课桌面是一个平面。', '要比较平面大小，应该计算面积。'),
    pair('把图形边长和面积连起来。', [['长 4 厘米、宽 3 厘米', '12 平方厘米'], ['长 5 厘米、宽 3 厘米', '15 平方厘米'], ['边长 4 厘米的正方形', '16 平方厘米'], ['边长 5 厘米的正方形', '25 平方厘米']], '长方形面积用长乘宽，正方形面积用边长乘边长。', '按对应的长、宽或边长计算面积，并注意面积单位。'),
    chooseNumber(`边长为 ${side} 厘米的正方形面积是多少平方厘米？`, side * side, [side * side + 1, side * side - 1], '正方形面积等于边长乘边长。', `${side} × ${side} = ${side * side} 平方厘米。`),
    sortInto('把测量单位分到“长度单位”和“面积单位”。', ['长度单位', '面积单位'], [{ label: '厘米', categoryIndex: 0 }, { label: '米', categoryIndex: 0 }, { label: '平方厘米', categoryIndex: 1 }, { label: '平方米', categoryIndex: 1 }], '看单位名称中有没有“平方”。', '厘米和米是长度单位；平方厘米和平方米是面积单位。'),
    arrange('用面积公式解决问题，按步骤排列。', ['把长和宽相乘', '确定图形的长和宽', '写上平方单位', '说清要求平面的大小'], [3, 1, 0, 2], '先确认问题问平面大小，再找边长。', '确定问题和长宽后计算乘积，并使用平方单位。'),
    calculate(`地面长 ${length} 米、宽 ${width} 米，铺满地面需要覆盖多少平方米？`, `${length} × ${width}`, area, '铺满地面求面积，不是沿边围一圈。', `地面面积是 ${length} × ${width} = ${area} 平方米。`),
    finalQuestion,
  ];
}

function makeCoding(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const seed = seedFor(entry, difficulty, taskIndex);
  const room = 21 + seed % 8;
  const finalQuestion = difficulty === 'basic'
    ? taskIndex === 0
      ? choose('发现两个物品用了同一个编号，应该怎样处理？', ['按规则重新分配一个未使用的编号并核对', '保留重复编号不检查', '把物品名称删掉'], 0, '每个对象需要能被区分。', '避免编号重复并按规则检查，才能正确查找物品。')
      : choose(`编码规则是“班级两位数-顺序两位数”，3 班第 ${room} 个物品应怎样编号？`, [`03-${String(room).padStart(2, '0')}`, `3-${room}`, `03-${String(room + 1).padStart(2, '0')}`], 0, '把班级和顺序分别写成两位数，再按规则连接。', `3 班写作 03，第 ${room} 个物品写作 ${String(room).padStart(2, '0')}，编号为 03-${String(room).padStart(2, '0')}。`)
    : difficulty === 'advanced'
      ? taskIndex === 0
        ? choose(`按“班级两位数-房间顺序两位数”的规则，3 班第 ${room} 个房间怎样编号？`, [`03-${String(room).padStart(2, '0')}`, `3-${room}`, `03-${String(room + 1).padStart(2, '0')}`], 0, '先把班级和房间顺序分别写成两位数，再按约定连接。', `3 班写作 03，第 ${room} 个房间写作 ${String(room).padStart(2, '0')}，编号是 03-${String(room).padStart(2, '0')}。`)
        : choose('两张编码卡要代表不同物品，哪种安排能保持编号唯一？', ['在统一格式中给每个物品分配不同的顺序号', '给所有物品都用 01', '每次随意改变数字含义'], 0, '编码规则要固定，每个对象的编号要不同。', '固定格式并分配不同顺序号，才能区分物品。')
      : taskIndex === 0
        ? choose('小组要给新增物品编号码，怎样检查方案能否继续使用？', ['先约定各部分含义和格式，再核对新增编号是否重复', '只看编号长短，不说明每部分表示什么', '新物品沿用已有编号'], 0, '检查规则能否表达信息，也要确认没有重复。', '明确格式和含义后核对唯一性，编号才可读、可用。')
        : choose(`检查编号时发现两个物品都写成 03-${String(room).padStart(2, '0')}，怎样修正？`, ['保留规则格式，为其中一个物品分配未使用的顺序号', '两个物品继续共用编号', '删除其中一个物品的信息'], 0, '编号既要符合格式，也要能区分对象。', '为重复对象分配一个未使用的编号，并再次核对。');
  return [
    choose('编号从 01 开始，排在第 7 个的物品编号是多少？', ['07', '06', '08'], 0, '编号按顺序增加 1。', '排在第 7 个的物品编号是 07。'),
    choose('给物品编码时，哪种编码方式更容易核对？', ['按事先约定的规则编写，并让每个对象有唯一编号', '每次想到什么就写什么', '不同物品都用同一个编号'], 0, '先约定编码规则，再检查是否重复。', '统一规则和唯一编号有助于识别、查找和核对。'),
    pair('把编码信息和它表示的内容连起来。', [['开头数字', '类别'], ['后续数字', '顺序'], ['不重复的编号', '区分不同物品'], ['完整编码', '一条信息的组合']], '读编码前先知道每一部分的约定。', '编码的不同部分按预先约定表示不同信息。'),
    chooseNumber(`从 1 开始，按顺序给 ${room} 个储物格编号，最后一个编号是多少？`, room, [room - 1, room + 1], '第 1 个储物格标 1，再按顺序给下一个储物格加 1。', `按顺序编号到第 ${room} 个储物格，最后一个编号是 ${room}。`),
    sortInto('把编码信息分成“对象信息”和“核对信息”。', ['对象信息', '核对信息'], [{ label: '班级编号', categoryIndex: 0 }, { label: '物品类别', categoryIndex: 0 }, { label: '编号是否重复', categoryIndex: 1 }, { label: '编号是否符合约定格式', categoryIndex: 1 }], '想想这条信息是在说明对象，还是在检查编码。', '班级和类别说明对象；检查重复和格式有助于核对编码。'),
    arrange('设计编码时按顺序安排步骤。', ['逐个分配不重复的编号', '确定编码要表达哪些信息', '写下每部分的规则', '检查编号能否读懂'], [1, 2, 0, 3], '先确定要表达什么，再约定格式并检查。', '先明确目的，再定义规则、分配编号并核对。'),
    chooseNumber(`已经用了 01 到 08 共 8 个编号，再增加 1 个对象，需要多少个编号？`, 9, [8, 10], '新对象也需要一个没有使用过的编号。', '已有 8 个，再加 1 个，共需要 9 个编号。'),
    finalQuestion,
  ];
}

function makePractice(entry: AddedCourseEntry, p: MathProfile, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const seed = seedFor(entry, difficulty, taskIndex);
  if (entry.grade === 1) {
    const firstSemester = entry.term === 1;
    const smallNumberRange = p.limit !== undefined && p.limit <= 10;
    const a = firstSemester
      ? smallNumberRange ? 4 + (seed % 2) : 8 + (seed % 6)
      : (2 + (seed % 6)) * 10 + (seed % 8);
    const b = firstSemester
      ? smallNumberRange ? 1 + (seed % (a - 1)) : 2 + (seed % 4)
      : 1 + (seed % Math.max(1, 9 - (a % 10)));
    const sum = a + b;
    const reviewFacts = firstSemester
      ? [['2 + 2', '4'], ['4 + 2', '6'], ['4 + 4', '8'], ['6 + 4', '10']] as const
      : [['24 + 6', '30'], ['35 + 20', '55'], ['78 - 8', '70'], ['91 - 30', '61']] as const;
    const sortedValues = [a, b, sum, 0];
    const sortedIndexes = sortedValues.map((_, index) => index).sort((left, right) => sortedValues[left]! - sortedValues[right]!);
    const finalQuestion = difficulty === 'basic'
      ? taskIndex === 0
        ? choose('做完计算后，怎样检查得数？', ['再算一次或用数一数核对', '不看算式就猜', '把数字擦掉'], 0, '检查时回到题目中的数量。', '重新计算或按数量核对，可以发现算错的地方。')
        : choose(`算式 ${a} + ${b} = ${sum}，用哪道减法可以检查？`, [`${sum} - ${b} = ${a}`, `${a} - ${sum} = ${b}`, `${sum} + ${b} = ${a}`], 0, '用和减去一个加数，看看能否回到另一个加数。', `${sum} - ${b} = ${a}，检查成立。`)
      : difficulty === 'advanced'
        ? taskIndex === 0
          ? chooseNumber(`盒里原有 ${a} 个积木，又放入 ${b} 个；如果后来取出 ${a} 个，还剩几个？`, b, [b + 1, Math.max(0, b - 1)], '先算放入后的总数，再减去取出的数量。', `${a} + ${b} - ${a} = ${b} 个。`)
          : choose(`同学算出 ${a} + ${b} = ${sum}，想用另一种方法核对，应该怎样做？`, [`用 ${sum} - ${b} 检查是否得到 ${a}`, '把两个加数再相加一次但不看结果', '只比较算式的长度'], 0, '用和减去一个加数，检查能否回到另一个加数。', `${sum} - ${b} = ${a}，核对成立。`)
        : taskIndex === 0
          ? choose(`小明说 ${a} + ${b} = ${sum + 1}。怎样找到并改正错误？`, [`重新计算后得到 ${sum}，再用 ${sum} - ${b} = ${a} 核对`, '只看答案写得是否整齐', '把两个数的位置交换但不计算'], 0, '重新计算，并用逆运算检查。', `${a} + ${b} = ${sum}，且 ${sum} - ${b} = ${a}。`)
          : choose(`要把 ${a} 个和 ${b} 个积木分成两组并说明总数，怎样讲得清楚？`, ['先说明每组数量，再列加法求总数并用减法核对', '只报一个总数，不说明两组各有多少', '把数量和颜色混在一起'], 0, '清楚说出已知数量、计算方法和核对方法。', `先算 ${a} + ${b} = ${sum}，再用 ${sum} - ${b} = ${a} 核对。`);
    return [
      calculate(`${a} + ${b} = ?`, `${a} + ${b}`, sum, '把两个数量合起来数。', `${a} + ${b} = ${sum}。`),
      choose(`比较 ${a} 和 ${b}，哪句话正确？`, [`${a} 比 ${b} 大`, `${a} 比 ${b} 小`, `${a} 和 ${b} 一样大`], 0, '可以从较小的数开始接着数。', `${a} 大于 ${b}。`),
      pair('把算式和得数连起来。', reviewFacts, '先算出每道题的得数，再连线。', '把每道算式和它的得数配对。'),
      firstSemester
        ? sortInto('把立体图形分成“能滚动”和“通常不能滚动”。', ['能滚动', '通常不能滚动'], [{ label: '球体', categoryIndex: 0 }, { label: '圆柱体', categoryIndex: 0 }, { label: '正方体', categoryIndex: 1 }, { label: '长方体', categoryIndex: 1 }], '观察图形有没有弯曲的面。', '球体和圆柱体有弯曲的面，通常能滚动；正方体和长方体有平面。')
        : sortInto('把图形分成“平面图形”和“立体图形”。', ['平面图形', '立体图形'], [{ label: '三角形', categoryIndex: 0 }, { label: '圆', categoryIndex: 0 }, { label: '球体', categoryIndex: 1 }, { label: '正方体', categoryIndex: 1 }], '看看图形是平平的，还是有立体形状。', '三角形和圆是平面图形；球体和正方体是立体图形。'),
      arrange('把数按从小到大的顺序排好。', sortedValues.map(String), sortedIndexes, '先找最小的数，再比较剩下的数。', `从小到大是 ${sortedIndexes.map((index) => sortedValues[index]).join('、')}。`),
      choose('数一数桌上的积木，怎样做不容易漏数？', ['按顺序点一个就移开一个', '只看一眼就猜', '同一块积木数好几次'], 0, '让每块积木只对应一次点数。', '按顺序点数并移开点过的积木，不容易漏数或重复。'),
      calculate(`盒子里有 ${sum} 个积木，拿出 ${b} 个后，还剩几个？`, `${sum} - ${b}`, a, '用积木总数减去拿出的数量。', `${sum} - ${b} = ${a} 个。`),
      finalQuestion,
    ];
  }
  const a = 12 + seed % 30;
  const b = 5 + seed % 9;
  const side = 2 + seed % 8;
  const termOnePerimeter = entry.term === 1;
  const otherSide = side + 2;
  const surfaceMeasure = termOnePerimeter ? 2 * (otherSide + side) : side * 4;
  const surfacePrompt = termOnePerimeter
    ? `操场一块长 ${otherSide} 米、宽 ${side} 米的长方形区域，周长是多少米？`
    : `操场长方形长 ${side} 米、宽 4 米，面积是多少平方米？`;
  const surfaceHint = termOnePerimeter ? '周长是一周的长度。' : '长方形面积等于长乘宽。';
  const surfaceExplanation = termOnePerimeter
    ? `周长是 2 × (${otherSide} + ${side}) = ${surfaceMeasure} 米。`
    : `${side} × 4 = ${surfaceMeasure} 平方米。`;
  const finalQuestion = difficulty === 'basic'
    ? entry.type === 'integrated-practice' && taskIndex === 1
      ? choose('把从教室到图书馆的路线告诉新同学，怎样记录更清楚？', ['标明起点、方向和路线先后', '只说图书馆的颜色', '不说从哪里出发'], 0, '路线记录要让别人知道从哪里开始、朝哪边走。', '标明起点、方向和先后顺序，别人才能照着路线走。')
      : taskIndex === 0
        ? choose('向同学介绍一个校园数学发现，怎样说更清楚？', ['说出问题、数据和使用的数学方法', '只说“我算出来了”', '不说明单位和条件'], 0, '让听者知道你要解决什么以及依据是什么。', '说明问题、数据、单位和方法，别人更容易理解并核对。')
        : choose('分享一题校园数学结果时，哪种记录最容易让同学复核？', ['写出数量、单位和计算方法', '只说答案，不写单位', '只说自己觉得结果对'], 0, '结果要带上单位和能检查的过程。', '写出数量、单位和计算方法，伙伴可以按记录复查。')
    : difficulty === 'advanced'
      ? taskIndex === 0
        ? choose(`校园长 ${otherSide} 米、宽 ${side} 米的长方形区域，需要围一圈。应该先用哪种方法？`, ['先把长和宽相加，再乘 2 求周长', '用长乘宽求围栏长度', '只量一条边就当作周长'], 0, '围一圈求周长，要把相对的边都计算进去。', `周长是 2 × (${otherSide} + ${side})。`)
        : choose('比较两个班借书人数时，应该怎样保证数据可比较？', ['使用相同的统计时间、分类标准和记录方法', '一个班统计一天，另一个班统计一周', '只比较哪张表的数字更多'], 0, '比较前要统一统计条件和标准。', '相同时间范围、标准和记录方式才能支持公平比较。')
      : taskIndex === 0
        ? choose('要向同学汇报校园测量或统计结果，怎样安排说明最完整？', ['先说问题和条件，再说明数据、计算方法和检查结果', '只报一个数字', '不说单位和统计范围'], 0, '把条件、数据、方法和检查依据都交代清楚。', '说明问题、条件、结果和核对过程，听者才能复查。')
        : choose('测量或统计结果与现场观察不一致时，下一步应该怎样做？', ['回到原始记录，检查起点、单位、分类和漏记后再计算', '把结果改成更好看的数字', '删除不一致的数据'], 0, '先核对原始条件和记录，再决定是否重算。', '检查起点、单位、分类和漏记，才能找到不一致的原因。');
  return [
    calculate(`校园里有 ${a} 名同学，又来了 ${b} 名同学，现在有多少名？`, `${a} + ${b}`, a + b, '把原来的人数和新来的人数相加。', `现在有 ${a + b} 名同学。`),
    chooseNumber(surfacePrompt, surfaceMeasure, [surfaceMeasure + 1, surfaceMeasure - 1], surfaceHint, surfaceExplanation),
    pair(`把“${p.context}”里的信息和合适的数学方法连起来。`, termOnePerimeter
      ? [['钟面时刻', '读出时间'], ['两段路的格数', '合并数量'], ['长方形边线一周', '计算周长'], ['尺上的刻度', '测量长度']]
      : [['活动日期', '读取日历'], ['图书借阅人数', '整理数据'], ['长方形地面', '计算面积'], ['从教室到图书馆', '描述路线']], '先看看问题需要读时刻、测量、计算还是整理信息。', '不同校园问题可以使用不同的数学方法。'),
    sortInto('把校园里的信息按“长度”或“人数”分类。', ['长度', '人数'], [{ label: `${side} 米`, categoryIndex: 0 }, { label: '走廊 18 米', categoryIndex: 0 }, { label: `${a} 名同学`, categoryIndex: 1 }, { label: `${b} 名值日生`, categoryIndex: 1 }], '看单位是米还是人。', '米表示长度，名表示人数。'),
    arrange('按完成校园小调查的顺序排列步骤。', ['整理记录并说明发现', '确定调查问题', '收集数据或进行测量', '核对信息是否完整'], [1, 2, 3, 0], '先明确问题，再收集和整理信息。', '先定问题，再收集、核对、整理并分享结果。'),
    choose(`如果要比较两个班借书的数量，应该先做什么？`, ['用相同的统计时间和记录方法', '一个班数一周，另一个班数一天', '只比较书架大小'], 0, '公平比较需要统一统计条件。', '使用相同的时间范围和记录方法，数据才可比较。'),
    choose('在校园测量中发现数据不合理，怎样处理？', ['回到测量起点和单位重新检查', '把结果改成看起来更大的数', '删除所有记录'], 0, '先检查工具、起点、读数和单位。', '回到原始测量过程核对，才能发现错误来源。'),
    finalQuestion,
  ];
}

function makeGradeThreeReview(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  if (entry.term === 1) {
    const multiplicationProfile = profiles['multiply-1digit']!;
    const multiplicationQuestions = makeArithmetic(entry, multiplicationProfile, difficulty, taskIndex);
    const multiplicationIndex = difficulty === 'basic' ? 0 : difficulty === 'advanced' ? 6 : 7;
    const perimeterQuestions = makePerimeter(entry, difficulty, taskIndex);
    const fractionQuestions = makeFractions(entry, difficulty, taskIndex);
    const setQuestions = makeSets(entry, difficulty, taskIndex);
    const multipleQuestions = makeMultiples(entry, difficulty, taskIndex);
    return [
      makeClock(entry, difficulty, taskIndex)[7]!,
      makeCarryBorrow(entry, difficulty, taskIndex)[taskIndex === 0 ? 0 : 1]!,
      makeMeasure(entry, difficulty, taskIndex)[2]!,
      multiplicationQuestions[multiplicationIndex]!,
      perimeterQuestions[difficulty === 'basic' ? 0 : 7]!,
      fractionQuestions[difficulty === 'basic' ? 0 : difficulty === 'advanced' ? 3 : 7]!,
      setQuestions[difficulty === 'basic' ? 1 : 7]!,
      multipleQuestions[difficulty === 'basic' ? 0 : 7]!,
    ];
  }

  const multiplicationProfile = profiles['multiply-2digit']!;
  const multiplicationQuestions = makeArithmetic(entry, multiplicationProfile, difficulty, taskIndex);
  const multiplicationIndex = difficulty === 'basic' ? 0 : difficulty === 'advanced' ? 6 : 7;
  const locationQuestions = makeLocation(entry, difficulty, taskIndex);
  const divisionQuestions = makeDivision(entry, difficulty, taskIndex);
  const areaQuestions = makeArea(entry, difficulty, taskIndex);
  const calendarQuestions = makeCalendar(entry, difficulty, taskIndex);
  const tableQuestions = makeTable(entry, difficulty, taskIndex);
  const decimalQuestions = makeDecimals(entry, difficulty, taskIndex);
  const combinationQuestions = makeCombinations(entry, difficulty, taskIndex);
  return [
    locationQuestions[difficulty === 'basic' ? 1 : 7]!,
    divisionQuestions[difficulty === 'basic' ? 1 : 7]!,
    multiplicationQuestions[multiplicationIndex]!,
    areaQuestions[difficulty === 'basic' ? 0 : 7]!,
    calendarQuestions[difficulty === 'basic' ? 0 : 7]!,
    tableQuestions[difficulty === 'basic' ? 0 : 7]!,
    decimalQuestions[difficulty === 'basic' ? 0 : 7]!,
    combinationQuestions[7]!,
  ];
}

function createSecondTaskMatchVariant(question: MathQuestionSpec, entry: AddedCourseEntry): MathQuestionSpec {
  if (question.kind !== 'match') return question;

  const variantByProfile: Record<string, MathQuestionSpec> = {
    location: pair('把位置描述和倒过来观察时的位置连起来。', [
      ['书在桌子上面', '桌子在书下面'],
      ['小狗在椅子下面', '椅子在小狗上面'],
      ['球在盒子里面', '盒子在球外面'],
      ['小猫在小树右边', '小树在小猫左边'],
    ], '换一个参照物时，要把相对的位置关系倒过来。', '上面和下面、里面和外面、左边和右边都是相对的位置关系。'),
    'solid-shapes': pair('把立体图形和相似物体的整体外形连起来。', [
      ['正方体', '像骰子，整体接近方方的积木'],
      ['长方体', '像一本书，整体接近长方的盒子'],
      ['圆柱体', '像圆筒，有圆形平平的底'],
      ['球体', '像球一样圆，表面弯弯的'],
    ], '看一看熟悉物体的整体外形，再和图形名称对应。', '骰子接近正方体，书本接近长方体；圆筒接近圆柱体，球的整体外形接近球体。'),
    'add-sub-100': pair('把算式和它对应的计算方法连起来。', [
      ['37 + 2', '两位数加一位数（不进位）'],
      ['40 + 20', '整十数加整十数'],
      ['58 - 4', '两位数减一位数（不退位）'],
      ['70 - 30', '整十数减整十数'],
    ], '先看个位和十位，再判断加减的数属于哪一种。', '这四道题分别练习两位数与一位数、整十数之间的加减。'),
    clock: pair('把钟面时刻和指针位置连起来。', [
      ['3 时整', '分针指向 12'],
      ['6 时整', '时针指向 6'],
      ['7 时半', '时针在 7 和 8 之间'],
      ['10 时半', '分针指向 6'],
    ], '半时的分针指向 6；整时的分针指向 12。', '3 时整的分针指向 12；6 时整的时针指向 6；7 时半和 10 时半的分针指向 6。'),
    'g1-math-review': pair('把复习内容和相应的方法连起来。', entry.term === 1
      ? [['4 + 1', '5 以内加法'], ['9 - 3', '10 以内减法'], ['8 时', '整时读数'], ['小狗在小猫前面', '判断前后位置']]
      : [['14 - 8', '20 以内退位减法'], ['35 + 20', '两位数加整十数'], ['3 元', '30 角'], ['○、△、○、△', '下一个是 ○']],
    '先判断复习内容属于哪个知识主题，再选择合适的方法。', '把每个问题和本册学过的数学方法或概念对应起来。'),
    'math-park': pair('把算式和得数连起来。', [['2 + 3', '5'], ['4 + 5', '9'], ['10 - 3', '7'], ['9 - 5', '4']],
      '先算出每道题的得数，再连线。', '每道算式都与它计算得到的得数对应，结果都在 10 以内。'),
    'plane-shapes': pair('把平面图形和顶点特点连起来。', [
      ['三角形', '有 3 个顶点'],
      ['长方形', '有 4 个顶点'],
      ['正方形', '有 4 个顶点'],
      ['圆', '没有顶点'],
    ], '顶点是图形边相交的地方。', '三角形有 3 个顶点；长方形和正方形有 4 个顶点；圆没有顶点。'),
    classification: pair('把整理记录的方法和作用连起来。', [
      ['红色积木', '放进红色组'],
      ['蓝色积木', '放进蓝色组'],
      ['每块只记录一次', '避免重复计数'],
      ['各组数量相加', '核对总数'],
    ], '按同一个清楚的标准整理，再检查记录。', '按颜色分组，每块积木只记录一次；各组数量相加可以核对总数。'),
    money: pair('把人民币数量和等值金额连起来。', [
      ['3 元', '30 角'],
      ['2 元', '200 分'],
      ['4 角', '40 分'],
      ['6 元', '60 角'],
    ], '1 元等于 10 角，也等于 100 分；1 角等于 10 分。', '按元、角、分之间的十进关系换算。'),
    patterns: pair('把图形或数列规律和下一个图形或数连起来。', [
      ['○、○、△、○、○、△', '○'],
      ['□、☆、□、☆', '□'],
      ['2、5、8、11', '14'],
      ['9、7、5、3', '1'],
    ], '先找出重复顺序或相邻两项的变化，再向后推。', '前两组按重复图形继续；第三组每次加 3，第四组每次减 2。'),
    measurement: pair('把长度或质量和等值数量连起来。', [
      ['3 米', '30 分米'],
      ['2 分米', '20 厘米'],
      ['4 厘米', '40 毫米'],
      ['2 千米', '2000 米'],
    ], '先看单位之间的进率，再按数量换算。', '1 米等于 10 分米，1 分米等于 10 厘米，1 厘米等于 10 毫米，1 千米等于 1000 米。'),
    perimeter: pair('把长方形或正方形的边长和周长连起来。', [
      ['长 5 厘米、宽 3 厘米', '16 厘米'],
      ['长 5 厘米、宽 4 厘米', '18 厘米'],
      ['边长 3 厘米的正方形', '12 厘米'],
      ['边长 7 厘米的正方形', '28 厘米'],
    ], '长方形周长是（长 + 宽）× 2，正方形周长是边长 × 4。', '依次计算得到 16 厘米、18 厘米、12 厘米和 28 厘米。'),
    fractions: pair('把“平均分成几份并取几份”和分数连起来。', [
      ['平均分成 5 份，取 2 份', '五分之二'],
      ['平均分成 4 份，取 3 份', '四分之三'],
      ['平均分成 6 份，取 1 份', '六分之一'],
      ['平均分成 5 份，取 4 份', '五分之四'],
    ], '分母表示平均分的总份数，分子表示取出的份数。', '先读总份数作为分母，再读取出的份数作为分子。'),
    sets: pair('把参加活动的人数和集合图中的区域连起来。', [
      ['只参加跑步的 4 人', '只在跑步组'],
      ['跑步和跳绳都参加的 3 人', '两个圈的重叠部分'],
      ['只参加跳绳的 5 人', '只在跳绳组'],
      ['两项都没参加的 2 人', '两个圈外'],
    ], '先判断一个人属于跑步组、跳绳组、两组还是两组之外。', '只参加一项的人在相应圈内；两项都参加的在重叠处；都没参加的在圈外。'),
    'g3-math-review': pair('把复习情境和合适的数学方法连起来。', entry.term === 1
      ? [['绳子长度', '用厘米或米测量'], ['每组物品的个数和组数', '用乘法求总数'], ['分成相同份数', '理解分数'], ['操场一圈', '计算周长']]
      : [['下午 3 时', '换成 15:00'], ['18 个物品平均分给 3 人', '用除法求每人数量'], ['边长 4 米的正方形', '计算面积'], ['0.6', '读作零点六']],
    '先看问题中的数量和单位，再选择相应的数学方法。', '测量、乘除运算、分数、周长、时间、小数和面积各有相应的表示或计算方法。'),
    'number-coding': pair('把编码中的部分和它表示的信息连起来。', [
      ['编号开头的数字', '物品类别'],
      ['类别后面的数字', '类别内的顺序'],
      ['每件物品不同的编号', '区分不同物品'],
      ['完整编码', '一条完整的标识信息'],
    ], '按事先约定的规则读取编码。', '编码中的数字按规则表示类别、顺序或唯一标识。'),
    directions: pair('把方向和生活中的参照说法连起来。', [
      ['东', '太阳升起的方向'],
      ['西', '太阳落下的方向'],
      ['北', '地图上北下南时的上方'],
      ['南', '地图上北下南时的下方'],
    ], '先确认地图或观察方向的约定。', '地图上北下南、左西右东；生活中太阳从东方升起、从西方落下。'),
    division: pair('把除法算式和商、余数连起来。', [
      ['23 ÷ 5', '商 4 余 3'],
      ['29 ÷ 4', '商 7 余 1'],
      ['32 ÷ 6', '商 5 余 2'],
      ['38 ÷ 7', '商 5 余 3'],
    ], '用“商 × 除数 + 余数 = 被除数”检查，余数要比除数小。', '每题的商乘除数再加余数，都会得到原来的被除数，且余数小于除数。'),
    area: pair('把长方形或正方形的边长和面积连起来。', [
      ['长 6 厘米、宽 4 厘米', '24 平方厘米'],
      ['长 5 厘米、宽 4 厘米', '20 平方厘米'],
      ['边长 3 厘米的正方形', '9 平方厘米'],
      ['边长 6 厘米的正方形', '36 平方厘米'],
    ], '长方形面积用长乘宽；正方形面积用边长乘边长。', '依次计算得到 24、20、9 和 36 平方厘米。'),
    calendar: pair('把时间和 24 时计时法表示连起来。', [
      ['上午 9 时', '09:00'],
      ['下午 4 时', '16:00'],
      ['晚上 9 时', '21:00'],
      ['凌晨 2 时', '02:00'],
    ], '上午时刻通常保留原小时数；中午 12 时后的下午和晚上时刻要按规则换算。', '上午 9 时是 09:00，下午 4 时是 16:00，晚上 9 时是 21:00，凌晨 2 时是 02:00。'),
    decimals: pair('把一位小数和它的读法连起来。', [
      ['0.4', '零点四'],
      ['0.6', '零点六'],
      ['0.7', '零点七'],
      ['0.9', '零点九'],
    ], '小数点右边只有一位时，按这一位读出十分之几。', '0.4、0.6、0.7、0.9 分别读作零点四、零点六、零点七、零点九。'),
    'activity-calendar': pair('把日常时间和 24 时计时法表示连起来。', [
      ['上午 9 时', '09:00'],
      ['下午 4 时', '16:00'],
      ['晚上 9 时', '21:00'],
      ['凌晨 2 时', '02:00'],
    ], '上午时刻通常保留原小时数；中午 12 时后的下午和晚上时刻要按规则换算。', '上午 9 时是 09:00，下午 4 时是 16:00，晚上 9 时是 21:00，凌晨 2 时是 02:00。'),
    'school-project': pair('把校园里的信息和合适的数学方法连起来。', [
      ['走廊的长度', '测量长度'],
      ['值日生人数', '统计人数'],
      ['正方形花圃边长', '计算面积'],
      ['从教室到图书馆', '描述路线'],
    ], '先看问题需要测量、统计、计算还是描述位置。', '长度需要测量，人数需要统计，花圃可计算面积，路线需要说明方向和顺序。'),
  };

  return variantByProfile[entry.profileKey] ?? question;
}

function createQuestions(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): MathQuestionSpec[] {
  const p = profiles[entry.profileKey];
  if (!p) throw new Error(`缺少数学题目配置：${entry.profileKey}`);
  let questions: MathQuestionSpec[];
  if (p.mode === 'carry-borrow') questions = makeCarryBorrow(entry, difficulty, taskIndex);
  else if (p.mode === 'arithmetic') questions = makeArithmetic(entry, p, difficulty, taskIndex);
  else if (p.mode === 'count') questions = makeCount(entry, p, difficulty, taskIndex);
  else if (p.mode === 'location') questions = makeLocation(entry, difficulty, taskIndex);
  else if (p.mode === 'solid-shapes' || p.mode === 'plane-shapes') questions = makeShapes(p, difficulty, taskIndex);
  else if (p.mode === 'place-value') questions = makePlaceValue(entry, p, difficulty, taskIndex);
  else if (p.mode === 'clock') questions = makeClock(entry, difficulty, taskIndex);
  else if (p.mode === 'money') questions = makeMoney(entry, difficulty, taskIndex);
  else if (p.mode === 'measure') questions = makeMeasure(entry, difficulty, taskIndex);
  else if (p.mode === 'patterns') questions = makePatterns(entry, difficulty, taskIndex);
  else if (p.mode === 'fractions') questions = makeFractions(entry, difficulty, taskIndex);
  else if (p.mode === 'sets') questions = makeSets(entry, difficulty, taskIndex);
  else if (p.mode === 'table') questions = makeTable(entry, difficulty, taskIndex);
  else if (p.mode === 'calendar') questions = makeCalendar(entry, difficulty, taskIndex);
  else if (p.mode === 'decimals') questions = makeDecimals(entry, difficulty, taskIndex);
  else if (p.mode === 'combinations') questions = makeCombinations(entry, difficulty, taskIndex);
  else if (p.mode === 'multiples') questions = makeMultiples(entry, difficulty, taskIndex);
  else if (p.mode === 'division') questions = makeDivision(entry, difficulty, taskIndex);
  else if (p.mode === 'perimeter') questions = makePerimeter(entry, difficulty, taskIndex);
  else if (p.mode === 'area') questions = makeArea(entry, difficulty, taskIndex);
  else if (p.mode === 'coding') questions = makeCoding(entry, difficulty, taskIndex);
  else if (entry.grade === 3 && entry.profileKey === 'g3-math-review') questions = makeGradeThreeReview(entry, difficulty, taskIndex);
  else questions = makePractice(entry, p, difficulty, taskIndex);

  if (taskIndex !== 1 || questions[2]?.kind !== 'match') return questions;
  const variedMatch = createSecondTaskMatchVariant(questions[2], entry);
  return questions.map((question, index) => index === 2 ? variedMatch : question);
}

function makeTaskSpec(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', index: number): MathTaskSpec {
  const title = `${entry.title.replace(/^(第[一二三四五六七八九十]+单元 · |综合实践 · )/, '')} · ${taskTitles[difficulty][index]}`;
  const questions = varyChoicePositions(createQuestions(entry, difficulty, index), seedFor(entry, difficulty, index));
  return makeTask(title, objectives[difficulty][index], `companion-0${((index + 2) % 4) + 1}` as MathTaskSpec['companionId'], q8(questions));
}

export function buildAddedMathUnit(id: string) {
  const entry = addedCourseById[id];
  if (!entry || entry.subject !== 'math') throw new Error(`课程目录中没有数学条目：${id}`);
  const tasks = (difficulty: 'basic' | 'advanced' | 'high') => [makeTaskSpec(entry, difficulty, 0), makeTaskSpec(entry, difficulty, 1)] as const;
  return buildMathUnit({
    grade: entry.grade,
    term: entry.term,
    formalUnitNumber: entry.formalUnitNumber,
    entryId: entry.slug,
    type: entry.type as 'unit' | 'integrated-practice',
    title: entry.title,
    sourceTopics: entry.sourceTopics,
    basicTasks: tasks('basic'),
    advancedTasks: tasks('advanced'),
    highTasks: tasks('high'),
  });
}
