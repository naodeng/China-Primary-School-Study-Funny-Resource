import { addedCourseById, type AddedCourseEntry } from '../catalog';
import { buildEnglishUnit } from '../../grade-2/term-1/english/buildEnglishUnit';
import { arrange, choose, pair, q8, sortInto } from '../../grade-2/term-1/english/questionAuthoring';
import type { EnglishQuestionSpec, EnglishTaskSpec } from '../../grade-2/term-1/english/questionAuthoring';

type Word = readonly [word: string, meaning: string];
interface Phrase {
  prompt: string;
  options: readonly [string, string, string];
  correct: 0 | 1 | 2;
  hint: string;
  explanation: string;
  orderItems: readonly string[];
  correctOrder: readonly number[];
}
interface EnglishProfile {
  words: readonly [Word, Word, Word, Word];
  categories: readonly [string, string];
  classified: ReadonlyArray<{ label: string; categoryIndex: 0 | 1 }>;
  phrases: readonly [Phrase, Phrase];
}

function phrase(
  prompt: string,
  options: readonly [string, string, string],
  correct: 0 | 1 | 2,
  hint: string,
  explanation: string,
  orderItems: readonly string[],
  correctOrder: readonly number[],
): Phrase {
  return { prompt, options, correct, hint, explanation, orderItems, correctOrder };
}

function profile(
  words: EnglishProfile['words'],
  categories: EnglishProfile['categories'],
  classified: EnglishProfile['classified'],
  phrases: EnglishProfile['phrases'],
): EnglishProfile {
  return { words, categories, classified, phrases };
}

const profiles: Record<string, EnglishProfile> = {
  school: profile(
    [['book', '书'], ['ruler', '尺子'], ['pencil', '铅笔'], ['schoolbag', '书包']], ['课堂人物', '学习用品'],
    [
      { label: 'teacher', categoryIndex: 0 }, { label: 'book', categoryIndex: 1 }, { label: 'ruler', categoryIndex: 1 },
      { label: 'pencil', categoryIndex: 1 }, { label: 'schoolbag', categoryIndex: 1 },
    ],
    [
      phrase('想说“我有一把尺子”，应该选哪句话？', ['I have a ruler.', 'I have a book.', 'I have a pencil.'], 0, 'ruler 表示“尺子”。', 'I have a ruler. 的意思是“我有一把尺子”。', ['a', 'ruler', 'I', '.', 'have'], [2, 4, 0, 1, 3]),
      phrase('想说“我有一个书包”，应该选哪句话？', ['I have a schoolbag.', 'I have a ruler.', 'I have a book.'], 0, 'schoolbag 表示“书包”。', 'I have a schoolbag. 的意思是“我有一个书包”。', ['schoolbag', 'I', 'have', 'a', '.'], [1, 2, 3, 0, 4]),
    ],
  ),
  face: profile(
    [['eye', '眼睛'], ['ear', '耳朵'], ['nose', '鼻子'], ['mouth', '嘴']], ['看或听的部位', '其他面部部位'],
    [{ label: 'eye', categoryIndex: 0 }, { label: 'ear', categoryIndex: 0 }, { label: 'nose', categoryIndex: 1 }, { label: 'mouth', categoryIndex: 1 }],
    [
      phrase('“Touch your nose.” 的意思是什么？', ['摸摸你的鼻子。', '摸摸你的耳朵。', '看看你的书。'], 0, 'nose 表示“鼻子”。', 'Touch your nose. 是“摸摸你的鼻子”。', ['nose', 'your', 'Touch', '.'], [2, 1, 0, 3]),
      phrase('想说“这是我的眼睛”，应该选哪句？', ['This is my eye.', 'This is my ear.', 'This is my mouth.'], 0, 'eye 表示“眼睛”。', 'This is my eye. 的意思是“这是我的眼睛”。', ['eye', '.', 'my', 'This', 'is'], [3, 4, 2, 0, 1]),
    ],
  ),
  animals: profile(
    [['cat', '猫'], ['dog', '狗'], ['bird', '鸟'], ['tiger', '老虎']], ['鸟类', '其他动物'],
    [
      { label: 'cat', categoryIndex: 1 }, { label: 'dog', categoryIndex: 1 }, { label: 'bird', categoryIndex: 0 },
      { label: 'tiger', categoryIndex: 1 }, { label: 'monkey', categoryIndex: 1 },
    ],
    [
      phrase('“I like cats.” 表示什么？', ['我喜欢猫。', '我有一条鱼。', '这是一只鸟。'], 0, 'I like… 表示“我喜欢……”。', 'I like cats. 的意思是“我喜欢猫”。', ['cats', 'like', 'I', '.'], [2, 1, 0, 3]),
      phrase('看到一只狗，哪句话合适？', ['It is a dog.', 'It is a fish.', 'It is a book.'], 0, 'dog 表示“狗”。', 'It is a dog. 的意思是“它是一只狗”。', ['a', 'dog', 'It', 'is', '.'], [2, 3, 0, 1, 4]),
    ],
  ),
  numbers: profile(
    [['one', '一'], ['two', '二'], ['three', '三'], ['four', '四']], ['one to five', 'six to ten'],
    [
      { label: 'one', categoryIndex: 0 }, { label: 'two', categoryIndex: 0 }, { label: 'three', categoryIndex: 0 },
      { label: 'four', categoryIndex: 0 }, { label: 'five', categoryIndex: 0 }, { label: 'six', categoryIndex: 1 },
      { label: 'seven', categoryIndex: 1 }, { label: 'eight', categoryIndex: 1 }, { label: 'nine', categoryIndex: 1 },
      { label: 'ten', categoryIndex: 1 },
    ],
    [
      phrase('“How many books?” 是在问什么？', ['有多少本书？', '是什么颜色？', '你叫什么名字？'], 0, 'many 和数量有关，books 表示“书”。', 'How many books? 是在询问有多少本书。', ['books', 'many', 'How', '?'], [2, 1, 0, 3]),
      phrase('three 后面接哪个数词？', ['four', 'one', 'two'], 0, '按数数的顺序接着往后数。', 'three 后面的数词是 four。', ['books', 'three', 'I', 'have', '.'], [2, 3, 1, 0, 4]),
    ],
  ),
  colours: profile(
    [['red', '红色'], ['blue', '蓝色'], ['yellow', '黄色'], ['green', '绿色']], ['红色或黄色', '蓝色或绿色'],
    [{ label: 'red', categoryIndex: 0 }, { label: 'blue', categoryIndex: 1 }, { label: 'yellow', categoryIndex: 0 }, { label: 'green', categoryIndex: 1 }],
    [
      phrase('“What colour is it?” 是在问什么？', ['它是什么颜色？', '它有几个？', '它在哪里？'], 0, 'colour 是“颜色”。', 'What colour is it? 是在询问颜色。', ['colour', 'it', 'What', 'is', '?'], [2, 0, 3, 1, 4]),
      phrase('想说“它是蓝色的”，应该选哪句？', ["It's blue.", "It's red.", "It's green."], 0, 'blue 表示“蓝色”。', "It's blue. 的意思是“它是蓝色的”。", ['blue', "It's", '.'], [1, 0, 2]),
    ],
  ),
  fruit: profile(
    [['apple', '苹果'], ['pear', '梨'], ['banana', '香蕉'], ['orange', '橙子']], ['苹果', '其他水果'],
    [{ label: 'apple', categoryIndex: 0 }, { label: 'pear', categoryIndex: 1 }, { label: 'banana', categoryIndex: 1 }, { label: 'orange', categoryIndex: 1 }],
    [
      phrase('想说“我喜欢香蕉”，应该选哪句？', ['I like bananas.', 'I like apples.', 'I like pears.'], 0, 'banana 表示“香蕉”，复数 bananas 表示香蕉这一类。', 'I like bananas. 的意思是“我喜欢香蕉”。', ['bananas', 'I', '.', 'like'], [1, 3, 0, 2]),
      phrase('“What fruit do you like?” 是在问什么？', ['你喜欢什么水果？', '你有几本书？', '你住在哪里？'], 0, 'fruit 表示“水果”。', 'What fruit do you like? 是在询问喜欢的水果。', ['you', 'What', 'like', 'fruit', 'do', '?'], [1, 3, 4, 0, 2, 5]),
    ],
  ),
  classroom: profile(
    [['chair', '椅子'], ['desk', '书桌'], ['blackboard', '黑板'], ['under', '在……下面']], ['教室物品', '位置词'],
    [
      { label: 'chair', categoryIndex: 0 }, { label: 'desk', categoryIndex: 0 }, { label: 'blackboard', categoryIndex: 0 },
      { label: 'on', categoryIndex: 1 }, { label: 'under', categoryIndex: 1 }, { label: 'in', categoryIndex: 1 },
    ],
    [
      phrase('想说“椅子在桌子下面”，应该选哪句话？', ['The chair is under the desk.', 'The chair is on the desk.', 'The chair is in the desk.'], 0, 'under 表示“在……下面”。', 'The chair is under the desk. 的意思是“椅子在桌子下面”。', ['desk', 'The', 'under', 'chair', 'the', 'is', '.'], [1, 3, 5, 2, 4, 0, 6]),
      phrase('“Where is the desk?” 是在问什么？', ['桌子在哪里？', '桌子是什么颜色？', '桌子有几本？'], 0, 'where 用来询问地点。', 'Where is the desk? 是在询问桌子的位置。', ['desk', 'Where', 'the', '?', 'is'], [1, 4, 2, 0, 3]),
    ],
  ),
  room: profile(
    [['light', '灯'], ['bed', '床'], ['door', '门'], ['box', '盒子']], ['房间物品', '位置词'],
    [
      { label: 'light', categoryIndex: 0 }, { label: 'bed', categoryIndex: 0 }, { label: 'door', categoryIndex: 0 },
      { label: 'box', categoryIndex: 0 }, { label: 'near', categoryIndex: 1 }, { label: 'behind', categoryIndex: 1 },
    ],
    [
      phrase('想说“盒子在床旁边”，应该选哪句话？', ['The box is near the bed.', 'The box is behind the bed.', 'The light is near the bed.'], 0, 'near 表示“靠近”。', 'The box is near the bed. 的意思是“盒子在床旁边”。', ['bed', 'The', 'box', 'near', 'the', 'is', '.'], [1, 2, 5, 3, 4, 0, 6]),
      phrase('想说“盒子在门后面”，应该选哪句话？', ['The box is behind the door.', 'The box is near the bed.', 'The bed is behind the door.'], 0, 'behind 表示“在……后面”。', 'The box is behind the door. 的意思是“盒子在门后面”。', ['behind', 'the', 'The', 'door', 'is', 'box', '.'], [2, 5, 4, 0, 1, 3, 6]),
    ],
  ),
  toys: profile(
    [['ball', '球'], ['doll', '玩偶'], ['train', '火车'], ['plane', '飞机']], ['球、玩偶或动物玩具', '交通工具玩具'],
    [
      { label: 'ball', categoryIndex: 0 }, { label: 'doll', categoryIndex: 0 }, { label: 'bear', categoryIndex: 0 },
      { label: 'train', categoryIndex: 1 }, { label: 'car', categoryIndex: 1 }, { label: 'plane', categoryIndex: 1 },
    ],
    [
      phrase('“This is a ball.” 表示什么？', ['这是一个球。', '这是一列火车。', '这是一只玩具熊。'], 0, 'ball 表示“球”。', 'This is a ball. 的意思是“这是一个球”。', ['ball', 'a', 'This', '.', 'is'], [2, 4, 1, 0, 3]),
      phrase('想说“它是一架飞机”，应该选哪句话？', ['It is a plane.', 'It is a train.', 'It is a car.'], 0, 'plane 表示“飞机”。', 'It is a plane. 的意思是“它是一架飞机”。', ['a', 'It', 'plane', 'is', '.'], [1, 3, 0, 2, 4]),
    ],
  ),
  'food-g1': profile(
    [['rice', '米饭'], ['noodles', '面条'], ['chicken', '鸡肉'], ['egg', '鸡蛋']], ['米饭或面条', '其他食物'],
    [
      { label: 'rice', categoryIndex: 0 }, { label: 'noodles', categoryIndex: 0 }, { label: 'vegetable', categoryIndex: 1 },
      { label: 'fish', categoryIndex: 1 }, { label: 'chicken', categoryIndex: 1 }, { label: 'egg', categoryIndex: 1 },
    ],
    [
      phrase('“Do you like noodles?” 是在问什么？', ['你喜欢面条吗？', '你喜欢茶吗？', '你喜欢玩具吗？'], 0, 'Do you like…? 可以询问喜好，noodles 表示“面条”。', 'Do you like noodles? 是在询问是否喜欢面条。', ['noodles', 'Do', 'you', 'like', '?'], [1, 2, 3, 0, 4]),
      phrase('想回答“是的，我喜欢面条”，哪句话合适？', ['Yes, yes, I do.', 'No, no, I don’t.', 'Thank you.'], 0, 'Yes, yes, I do. 用来肯定回答 Do you like…?。', 'Yes, yes, I do. 的意思是“是的，我喜欢”。', ['do.', 'Yes,', 'I', 'yes,'], [1, 3, 2, 0]),
    ],
  ),
  'food-g3': profile(
    [['bread', '面包'], ['cake', '蛋糕'], ['potato', '土豆'], ['tomato', '西红柿']], ['食物', '饮品'],
    [
      { label: 'bread', categoryIndex: 0 }, { label: 'cake', categoryIndex: 0 }, { label: 'fruit', categoryIndex: 0 },
      { label: 'ice cream', categoryIndex: 0 }, { label: 'potato', categoryIndex: 0 }, { label: 'tomato', categoryIndex: 0 },
      { label: 'meat', categoryIndex: 0 }, { label: 'rice', categoryIndex: 0 }, { label: 'noodles', categoryIndex: 0 },
      { label: 'vegetables', categoryIndex: 0 }, { label: 'fish', categoryIndex: 0 }, { label: 'chicken', categoryIndex: 0 },
      { label: 'egg', categoryIndex: 0 }, { label: 'cola', categoryIndex: 1 },
    ],
    [
      phrase('想说“我想要面包”，应该选哪句话？', ['I want bread.', 'I want a potato.', 'I want cola.'], 0, 'bread 表示“面包”。', 'I want bread. 的意思是“我想要面包”。', ['bread', 'I', 'want', '.'], [1, 2, 0, 3]),
      phrase('想说“我想要蛋糕”，应该选哪句话？', ['I want cake.', 'I want tomato.', 'I want fish.'], 0, 'cake 表示“蛋糕”。', 'I want cake. 的意思是“我想要蛋糕”。', ['cake', '.', 'I', 'want'], [2, 3, 0, 1]),
    ],
  ),
  drink: profile(
    [['water', '水'], ['juice', '果汁'], ['milk', '牛奶'], ['tea', '茶']], ['有字母 e', '没有字母 e'],
    [{ label: 'water', categoryIndex: 0 }, { label: 'milk', categoryIndex: 1 }, { label: 'juice', categoryIndex: 0 }, { label: 'tea', categoryIndex: 0 }],
    [
      phrase('想礼貌地要水喝，应该选哪句话？', ['Can I have water?', 'Can I have a book?', 'Can I have a ruler?'], 0, 'water 表示“水”，Can I have…? 可以礼貌地提出请求。', 'Can I have water? 的意思是“我可以喝点水吗？”', ['water', 'I', '?', 'Can', 'have'], [3, 1, 4, 0, 2]),
      phrase('想礼貌地要茶喝，应该选哪句话？', ['Can I have tea?', 'Can I have a chair?', 'Can I have a pencil?'], 0, 'tea 表示“茶”。', 'Can I have tea? 的意思是“我可以喝点茶吗？”', ['tea', 'Can', 'have', '?', 'I'], [1, 4, 2, 0, 3]),
    ],
  ),
  'clothes-g1': profile(
    [['shirt', '衬衫'], ['T-shirt', 'T恤衫'], ['skirt', '裙子'], ['dress', '连衣裙']], ['上衣', '其他衣物'],
    [
      { label: 'shirt', categoryIndex: 0 }, { label: 'T-shirt', categoryIndex: 0 }, { label: 'skirt', categoryIndex: 1 },
      { label: 'dress', categoryIndex: 1 }, { label: 'socks', categoryIndex: 1 }, { label: 'shorts', categoryIndex: 1 },
    ],
    [
      phrase('想说“这是我的衬衫”，应该选哪句话？', ['This is my shirt.', 'This is my skirt.', 'This is my dress.'], 0, 'shirt 表示“衬衫”。', 'This is my shirt. 的意思是“这是我的衬衫”。', ['my', 'This', 'shirt', '.', 'is'], [1, 4, 0, 2, 3]),
      phrase('想说“这是我的 T 恤衫”，应该选哪句话？', ['This is my T-shirt.', 'This is my skirt.', 'This is my dress.'], 0, 'T-shirt 表示“T 恤衫”。', 'This is my T-shirt. 的意思是“这是我的 T 恤衫”。', ['T-shirt', 'This', 'my', 'is', '.'], [1, 3, 2, 0, 4]),
    ],
  ),
  'clothes-g3': profile(
    [['sweater', '毛衣'], ['jacket', '夹克'], ['cap', '帽子'], ['shoes', '鞋子']], ['上身、头部或手部衣物', '下身衣物和鞋'],
    [
      { label: 'cap', categoryIndex: 0 }, { label: 'coat', categoryIndex: 0 }, { label: 'sweater', categoryIndex: 0 },
      { label: 'jacket', categoryIndex: 0 }, { label: 'gloves', categoryIndex: 0 }, { label: 'shoes', categoryIndex: 1 },
      { label: 'trousers', categoryIndex: 1 },
    ],
    [
      phrase('想说“这是我的夹克”，应该选哪句话？', ['This is my jacket.', 'This is my sweater.', 'This is my cap.'], 0, 'jacket 表示“夹克”。', 'This is my jacket. 的意思是“这是我的夹克”。', ['jacket', 'This', 'my', '.', 'is'], [1, 4, 2, 0, 3]),
      phrase('想说“我有一顶帽子”，应该选哪句话？', ['I have a cap.', 'I have some shoes.', 'I have a jacket.'], 0, 'cap 表示“帽子”。', 'I have a cap. 的意思是“我有一顶帽子”。', ['cap', 'I', 'have', 'a', '.'], [1, 2, 3, 0, 4]),
    ],
  ),
  myself: profile(
    [['my', '我的'], ['name', '名字'], ['age', '年龄'], ['class', '班级']], ['姓名与称呼', '年龄与班级'],
    [
      { label: 'my', categoryIndex: 0 }, { label: 'your', categoryIndex: 0 }, { label: 'name', categoryIndex: 0 },
      { label: 'dear', categoryIndex: 0 }, { label: 'age', categoryIndex: 1 }, { label: 'old', categoryIndex: 1 },
      { label: 'year', categoryIndex: 1 }, { label: 'class', categoryIndex: 1 }, { label: 'grade', categoryIndex: 1 },
    ],
    [
      phrase('“My name is Amy.” 表示什么？', ['我的名字叫 Amy。', '我有一个苹果。', '我喜欢蓝色。'], 0, 'name 表示“名字”。', 'My name is Amy. 是自我介绍姓名的表达。', ['Amy', 'name', 'is', 'My', '.'], [3, 1, 2, 0, 4]),
      phrase('别人问 “How old are you?”，是在问什么？', ['你几岁？', '你叫什么？', '你喜欢什么？'], 0, 'old 在这里和年龄有关。', 'How old are you? 是在询问年龄。', ['old', 'How', 'you', 'are', '?'], [1, 0, 3, 2, 4]),
    ],
  ),
  body: profile(
    [['head', '头'], ['hand', '手'], ['leg', '腿'], ['foot', '脚']], ['上半身', '下半身'],
    [{ label: 'head', categoryIndex: 0 }, { label: 'hand', categoryIndex: 0 }, { label: 'leg', categoryIndex: 1 }, { label: 'foot', categoryIndex: 1 }],
    [
      phrase('“Raise your hand.” 的意思是什么？', ['举起你的手。', '跺跺你的脚。', '摸摸你的头。'], 0, 'hand 表示“手”。', 'Raise your hand. 是“举起你的手”。', ['your', 'Raise', 'hand', '.'], [1, 0, 2, 3]),
      phrase('“This is my foot.” 表示什么？', ['这是我的脚。', '这是我的手。', '这是我的腿。'], 0, 'foot 表示“脚”。', 'This is my foot. 的意思是“这是我的脚”。', ['my', 'foot', 'This', 'is', '.'], [2, 3, 0, 1, 4]),
    ],
  ),
  pets: profile(
    [['rabbit', '兔子'], ['duck', '鸭子'], ['turtle', '乌龟'], ['pet', '宠物']], ['类别词', '具体动物名称'],
    [{ label: 'pet', categoryIndex: 0 }, { label: 'rabbit', categoryIndex: 1 }, { label: 'duck', categoryIndex: 1 }, { label: 'turtle', categoryIndex: 1 }],
    [
      phrase('“I have a pet.” 表示什么？', ['我有一只宠物。', '我喜欢一把尺子。', '我有一杯水。'], 0, 'pet 表示“宠物”。', 'I have a pet. 的意思是“我有一只宠物”。', ['pet', 'a', 'I', 'have', '.'], [2, 3, 1, 0, 4]),
      phrase('照料宠物时，哪种做法合适？', ['Give it clean water.', 'Leave it in the sun all day.', 'Forget to feed it.'], 0, '宠物需要适当的食物和干净的水。', '给宠物干净的水是照料它的一种方式。', ['clean', 'Give', 'water', 'it', '.'], [1, 3, 0, 2, 4]),
    ],
  ),
  birthdays: profile(
    [['January', '一月'], ['June', '六月'], ['July', '七月'], ['December', '十二月']], ['一月至六月', '七月至十二月'],
    [
      { label: 'January', categoryIndex: 0 }, { label: 'February', categoryIndex: 0 }, { label: 'March', categoryIndex: 0 },
      { label: 'April', categoryIndex: 0 }, { label: 'May', categoryIndex: 0 }, { label: 'June', categoryIndex: 0 },
      { label: 'July', categoryIndex: 1 }, { label: 'August', categoryIndex: 1 }, { label: 'September', categoryIndex: 1 },
      { label: 'October', categoryIndex: 1 }, { label: 'November', categoryIndex: 1 }, { label: 'December', categoryIndex: 1 },
    ],
    [
      phrase('“Which month comes after January?” 是在问什么？', ['一月之后是哪个月？', '一月之前是哪个月？', '六月之后是哪个月？'], 0, '按月份顺序接着往后数。', 'January 之后的月份是 February。', ['after', 'Which', 'January', 'month', '?', 'comes'], [1, 3, 5, 0, 2, 4]),
      phrase('想说“我的生日在六月”，应该选哪句话？', ['My birthday is in June.', 'My birthday is in January.', 'My birthday is in July.'], 0, 'June 表示“六月”。', 'My birthday is in June. 的意思是“我的生日在六月”。', ['June', 'My', 'is', 'birthday', 'in', '.'], [1, 3, 2, 4, 0, 5]),
    ],
  ),
  'school-subjects': profile(
    [['English', '英语'], ['maths', '数学'], ['music', '音乐'], ['art', '美术']], ['语言课', '其他课程'],
    [
      { label: 'Chinese', categoryIndex: 0 }, { label: 'English', categoryIndex: 0 }, { label: 'maths', categoryIndex: 1 },
      { label: 'science', categoryIndex: 1 }, { label: 'PE', categoryIndex: 1 }, { label: 'music', categoryIndex: 1 },
      { label: 'art', categoryIndex: 1 }, { label: 'computer class', categoryIndex: 1 },
    ],
    [
      phrase('“I like music.” 表示什么？', ['我喜欢音乐。', '我有一本数学书。', '我在美术教室。'], 0, 'music 表示“音乐”。', 'I like music. 的意思是“我喜欢音乐”。', ['music', 'like', 'I', '.'], [2, 1, 0, 3]),
      phrase('想询问“你喜欢哪门课？”，应该选哪句？', ['What subject do you like?', 'Where is my book?', 'How old are you?'], 0, 'subject 表示“学科”。', 'What subject do you like? 是在询问喜欢的学科。', ['subject', 'do', 'What', 'you', 'like', '?'], [2, 0, 1, 3, 4, 5]),
    ],
  ),
  'my-school': profile(
    [['toilet', '厕所'], ['library', '图书馆'], ['classroom', '教室'], ['playground', '操场']], ['楼内地点或楼层', '室外活动地点'],
    [
      { label: 'library', categoryIndex: 0 }, { label: 'classroom', categoryIndex: 0 }, { label: 'toilet', categoryIndex: 0 },
      { label: 'first floor', categoryIndex: 0 }, { label: 'second floor', categoryIndex: 0 }, { label: 'third floor', categoryIndex: 0 },
      { label: 'playground', categoryIndex: 1 },
    ],
    [
      phrase('“Where is the toilet?” 是在问什么？', ['厕所在哪里？', '你喜欢哪门课？', '你几岁？'], 0, 'where 用来询问地点。', 'Where is the toilet? 是在询问厕所的位置。', ['the', 'Where', 'toilet', 'is', '?'], [1, 3, 0, 2, 4]),
      phrase('想说“图书馆在一楼”，应该选哪句话？', ['The library is on the first floor.', 'The library is on the second floor.', 'The playground is in the library.'], 0, 'first floor 表示“一楼”。', 'The library is on the first floor. 的意思是“图书馆在一楼”。', ['first', 'The', 'floor', 'library', 'is', 'on', 'the', '.'], [1, 3, 4, 5, 6, 0, 2, 7]),
    ],
  ),
  'after-school': profile(
    [['read books', '读书'], ['draw pictures', '画画'], ['sing songs', '唱歌'], ['play chess', '下棋']], ['安静或桌面活动', '唱跳或运动'],
    [
      { label: 'read books', categoryIndex: 0 }, { label: 'draw pictures', categoryIndex: 0 }, { label: 'play chess', categoryIndex: 0 },
      { label: 'dance', categoryIndex: 1 }, { label: 'sing songs', categoryIndex: 1 }, { label: 'play sports', categoryIndex: 1 },
      { label: 'play football', categoryIndex: 1 }, { label: 'fly a kite', categoryIndex: 1 }, { label: 'ride a bike', categoryIndex: 1 },
      { label: 'swim', categoryIndex: 1 },
    ],
    [
      phrase('“I read books after school.” 表示什么？', ['我放学后读书。', '我放学后游泳。', '我放学后踢足球。'], 0, 'read books 表示“读书”，after school 表示“放学后”。', 'I read books after school. 的意思是“我放学后读书”。', ['school', 'books', 'I', 'after', 'read', '.'], [2, 4, 1, 3, 0, 5]),
      phrase('想说“我放学后下棋”，应该选哪句话？', ['I play chess after school.', 'I draw pictures after school.', 'I sing songs after school.'], 0, 'play chess 表示“下棋”。', 'I play chess after school. 的意思是“我放学后下棋”。', ['after', 'I', 'chess', 'school', 'play', '.'], [1, 4, 2, 0, 3, 5]),
    ],
  ),
  family: profile(
    [['uncle', '叔叔或舅舅'], ['aunt', '阿姨或姑姑'], ['cousin', '堂或表兄弟姐妹'], ['family', '家庭']], ['家庭整体称呼', '亲属称呼'],
    [
      { label: 'family', categoryIndex: 0 }, { label: 'uncle', categoryIndex: 1 }, { label: 'aunt', categoryIndex: 1 },
      { label: 'cousin', categoryIndex: 1 },
    ],
    [
      phrase('想介绍阿姨，哪句话正确？', ['This is my aunt.', 'This is my uncle.', 'This is my cousin.'], 0, 'aunt 表示“阿姨、姑姑或舅妈”。', 'This is my aunt. 的意思是“这是我的阿姨”。', ['aunt', 'This', 'my', '.', 'is'], [1, 4, 2, 0, 3]),
      phrase('“He is my uncle.” 表示什么？', ['他是我的叔叔或舅舅。', '她是我的阿姨。', '他是我的表兄弟姐妹。'], 0, 'uncle 表示“叔叔或舅舅”。', 'He is my uncle. 的意思是“他是我的叔叔或舅舅”。', ['uncle', 'He', 'is', 'my', '.'], [1, 2, 3, 0, 4]),
    ],
  ),
  'family-activities': profile(
    [['cooking dinner', '做晚饭'], ['walking the dog', '遛狗'], ['watering the plants', '给植物浇水'], ['cleaning the room', '打扫房间']], ['家务或照料活动', '休闲活动'],
    [
      { label: 'cooking dinner', categoryIndex: 0 }, { label: 'walking the dog', categoryIndex: 0 },
      { label: 'watering the plants', categoryIndex: 0 }, { label: 'cleaning the room', categoryIndex: 0 },
      { label: 'feeding the fish', categoryIndex: 0 }, { label: 'listening to music', categoryIndex: 1 },
      { label: 'watching TV', categoryIndex: 1 },
    ],
    [
      phrase('“She is cooking dinner.” 表示什么？', ['她正在做晚饭。', '她正在给植物浇水。', '她正在听音乐。'], 0, 'cooking dinner 表示“做晚饭”。', 'She is cooking dinner. 的意思是“她正在做晚饭”。', ['dinner', 'is', 'She', 'cooking', '.'], [2, 1, 3, 0, 4]),
      phrase('想说“他正在遛狗”，应该选哪句话？', ['He is walking the dog.', 'He is cleaning the room.', 'He is watching TV.'], 0, 'walking the dog 表示“遛狗”。', 'He is walking the dog. 的意思是“他正在遛狗”。', ['the', 'He', 'dog', 'is', 'walking', '.'], [1, 3, 4, 0, 2, 5]),
    ],
  ),
  'my-home': profile(
    [['bedroom', '卧室'], ['kitchen', '厨房'], ['dining room', '餐厅'], ['study', '书房']], ['家或房间名称', '家具或家中用品'],
    [
      { label: 'home', categoryIndex: 0 }, { label: 'bedroom', categoryIndex: 0 }, { label: 'living room', categoryIndex: 0 },
      { label: 'bathroom', categoryIndex: 0 }, { label: 'dining room', categoryIndex: 0 }, { label: 'study', categoryIndex: 0 },
      { label: 'kitchen', categoryIndex: 0 }, { label: 'sofa', categoryIndex: 1 }, { label: 'light', categoryIndex: 1 },
      { label: 'bed', categoryIndex: 1 }, { label: 'door', categoryIndex: 1 }, { label: 'box', categoryIndex: 1 },
    ],
    [
      phrase('“This is the kitchen.” 表示什么？', ['这是厨房。', '这是卧室。', '这是操场。'], 0, 'kitchen 表示“厨房”。', 'This is the kitchen. 的意思是“这是厨房”。', ['the', 'kitchen', 'This', 'is', '.'], [2, 3, 0, 1, 4]),
      phrase('想询问书房在哪里，应该选哪句话？', ['Where is the study?', 'Where is the kitchen?', 'Where is the bedroom?'], 0, 'study 表示“书房”。', 'Where is the study? 是在询问书房的位置。', ['study', 'Where', 'the', 'is', '?'], [1, 3, 2, 0, 4]),
    ],
  ),
  'review-school-face-animals': profile(
    [['teacher', '老师'], ['eye', '眼睛'], ['cat', '猫'], ['book', '书']], ['人物或动物', '身体或学习用品'],
    [{ label: 'teacher', categoryIndex: 0 }, { label: 'cat', categoryIndex: 0 }, { label: 'eye', categoryIndex: 1 }, { label: 'book', categoryIndex: 1 }],
    [
      phrase('想介绍一只猫，哪句合适？', ['It is a cat.', 'It is an eye.', 'It is a teacher.'], 0, 'cat 表示“猫”。', 'It is a cat. 的意思是“它是一只猫”。', ['cat', 'a', 'It', 'is', '.'], [2, 3, 1, 0, 4]),
      phrase('“Touch your eye.” 的意思是什么？', ['摸摸你的眼睛。', '打开你的书。', '看一看老师。'], 0, 'eye 表示“眼睛”。', 'Touch your eye. 是“摸摸你的眼睛”。', ['eye', 'your', 'Touch', '.'], [2, 1, 0, 3]),
    ],
  ),
  'review-numbers-colours-fruit': profile(
    [['one', '一'], ['red', '红色'], ['apple', '苹果'], ['three', '三']], ['数词', '颜色或水果'],
    [{ label: 'one', categoryIndex: 0 }, { label: 'three', categoryIndex: 0 }, { label: 'red', categoryIndex: 1 }, { label: 'apple', categoryIndex: 1 }],
    [
      phrase('“I have three apples.” 表示什么？', ['我有三个苹果。', '我喜欢红色。', '我有一本书。'], 0, 'three 表示“三”，apples 表示“苹果”。', 'I have three apples. 的意思是“我有三个苹果”。', ['apples', 'three', 'I', 'have', '.'], [2, 3, 1, 0, 4]),
      phrase('想说“苹果是红色的”，哪句合适？', ['The apple is red.', 'The apple is blue.', 'The apple is a book.'], 0, 'red 表示“红色”。', 'The apple is red. 表示“苹果是红色的”。', ['red', 'The', 'apple', 'is', '.'], [1, 2, 3, 0, 4]),
    ],
  ),
  'review-classroom-room-toys': profile(
    [['chair', '椅子'], ['light', '灯'], ['doll', '玩偶'], ['train', '火车']], ['课堂或房间物品', '玩具'],
    [
      { label: 'chair', categoryIndex: 0 }, { label: 'desk', categoryIndex: 0 }, { label: 'blackboard', categoryIndex: 0 },
      { label: 'light', categoryIndex: 0 }, { label: 'bed', categoryIndex: 0 }, { label: 'door', categoryIndex: 0 },
      { label: 'box', categoryIndex: 0 }, { label: 'doll', categoryIndex: 1 }, { label: 'train', categoryIndex: 1 },
      { label: 'car', categoryIndex: 1 }, { label: 'bear', categoryIndex: 1 }, { label: 'plane', categoryIndex: 1 },
      { label: 'ball', categoryIndex: 1 },
    ],
    [
      phrase('想介绍一把椅子，哪句话正确？', ['This is a chair.', 'This is a bed.', 'This is a ball.'], 0, 'chair 表示“椅子”。', 'This is a chair. 的意思是“这是一把椅子”。', ['a', 'This', 'chair', 'is', '.'], [1, 3, 0, 2, 4]),
      phrase('“Where is the ball?” 是在问什么？', ['球在哪里？', '球是什么颜色？', '球有几本？'], 0, 'where 用来询问地点。', 'Where is the ball? 是在询问球的位置。', ['the', 'ball', 'Where', 'is', '?'], [2, 3, 0, 1, 4]),
    ],
  ),
  'review-food-drink-clothes': profile(
    [['noodles', '面条'], ['water', '水'], ['shirt', '衬衫'], ['milk', '牛奶']], ['食物或饮品', '衣物'],
    [
      { label: 'rice', categoryIndex: 0 }, { label: 'noodles', categoryIndex: 0 }, { label: 'vegetable', categoryIndex: 0 },
      { label: 'fish', categoryIndex: 0 }, { label: 'chicken', categoryIndex: 0 }, { label: 'egg', categoryIndex: 0 },
      { label: 'water', categoryIndex: 0 }, { label: 'juice', categoryIndex: 0 }, { label: 'milk', categoryIndex: 0 },
      { label: 'tea', categoryIndex: 0 }, { label: 'shirt', categoryIndex: 1 }, { label: 'T-shirt', categoryIndex: 1 },
      { label: 'skirt', categoryIndex: 1 }, { label: 'dress', categoryIndex: 1 }, { label: 'socks', categoryIndex: 1 },
      { label: 'shorts', categoryIndex: 1 },
    ],
    [
      phrase('“I want milk.” 表示什么？', ['我想要牛奶。', '我有一件衬衫。', '我喜欢面包。'], 0, 'milk 表示“牛奶”。', 'I want milk. 的意思是“我想要牛奶”。', ['milk', 'I', 'want', '.'], [1, 2, 0, 3]),
      phrase('想说“这是我的衬衫”，应该选哪句？', ['This is my shirt.', 'This is my bread.', 'This is my water.'], 0, 'shirt 表示“衬衫”。', 'This is my shirt. 表示“这是我的衬衫”。', ['my', 'shirt', 'This', '.', 'is'], [2, 4, 0, 1, 3]),
    ],
  ),
  'review-myself-body-food': profile(
    [['name', '名字'], ['hand', '手'], ['rice', '米饭'], ['age', '年龄']], ['自我或身体信息', '食物'],
    [{ label: 'name', categoryIndex: 0 }, { label: 'age', categoryIndex: 0 }, { label: 'hand', categoryIndex: 0 }, { label: 'rice', categoryIndex: 1 }],
    [
      phrase('别人问 “What is your name?”，是在问什么？', ['你叫什么名字？', '你喜欢米饭吗？', '你的手在哪里？'], 0, 'name 表示“名字”。', 'What is your name? 是在询问姓名。', ['your', 'What', 'name', 'is', '?'], [1, 3, 0, 2, 4]),
      phrase('“Raise your hand.” 的意思是什么？', ['举起你的手。', '吃米饭。', '说出你的年龄。'], 0, 'hand 表示“手”。', 'Raise your hand. 是“举起你的手”。', ['hand', 'Raise', 'your', '.'], [1, 2, 0, 3]),
    ],
  ),
  'review-pets-clothes-birthdays': profile(
    [['rabbit', '兔子'], ['jacket', '夹克'], ['January', '一月'], ['June', '六月']], ['动物或衣物', '月份'],
    [
      { label: 'rabbit', categoryIndex: 0 }, { label: 'duck', categoryIndex: 0 }, { label: 'turtle', categoryIndex: 0 },
      { label: 'cap', categoryIndex: 0 }, { label: 'coat', categoryIndex: 0 }, { label: 'shoes', categoryIndex: 0 },
      { label: 'sweater', categoryIndex: 0 }, { label: 'jacket', categoryIndex: 0 }, { label: 'gloves', categoryIndex: 0 },
      { label: 'trousers', categoryIndex: 0 }, { label: 'January', categoryIndex: 1 }, { label: 'February', categoryIndex: 1 },
      { label: 'March', categoryIndex: 1 }, { label: 'April', categoryIndex: 1 }, { label: 'May', categoryIndex: 1 },
      { label: 'June', categoryIndex: 1 }, { label: 'July', categoryIndex: 1 }, { label: 'August', categoryIndex: 1 },
      { label: 'September', categoryIndex: 1 }, { label: 'October', categoryIndex: 1 }, { label: 'November', categoryIndex: 1 },
      { label: 'December', categoryIndex: 1 },
    ],
    [
      phrase('“I have a rabbit.” 表示什么？', ['我有一只兔子。', '我有一件夹克。', '我有一个生日。'], 0, 'rabbit 表示“兔子”。', 'I have a rabbit. 的意思是“我有一只兔子”。', ['rabbit', 'I', 'a', '.', 'have'], [1, 4, 2, 0, 3]),
      phrase('想说“我的生日在六月”，应该选哪句话？', ['My birthday is in June.', 'My birthday is in January.', 'My birthday is in July.'], 0, 'June 表示“六月”。', 'My birthday is in June. 的意思是“我的生日在六月”。', ['June', 'My', 'is', 'birthday', 'in', '.'], [1, 3, 2, 4, 0, 5]),
    ],
  ),
  'review-subjects-school-activities': profile(
    [['maths', '数学'], ['toilet', '厕所'], ['read books', '读书'], ['play chess', '下棋']], ['学科或校园地点', '课后活动'],
    [
      { label: 'Chinese', categoryIndex: 0 }, { label: 'English', categoryIndex: 0 }, { label: 'maths', categoryIndex: 0 },
      { label: 'science', categoryIndex: 0 }, { label: 'PE', categoryIndex: 0 }, { label: 'music', categoryIndex: 0 },
      { label: 'art', categoryIndex: 0 }, { label: 'computer class', categoryIndex: 0 }, { label: 'classroom', categoryIndex: 0 },
      { label: 'library', categoryIndex: 0 }, { label: 'toilet', categoryIndex: 0 }, { label: 'playground', categoryIndex: 0 },
      { label: 'first floor', categoryIndex: 0 }, { label: 'second floor', categoryIndex: 0 }, { label: 'third floor', categoryIndex: 0 },
      { label: 'read books', categoryIndex: 1 }, { label: 'draw pictures', categoryIndex: 1 }, { label: 'play chess', categoryIndex: 1 },
      { label: 'dance', categoryIndex: 1 }, { label: 'sing songs', categoryIndex: 1 }, { label: 'play sports', categoryIndex: 1 },
      { label: 'play football', categoryIndex: 1 }, { label: 'fly a kite', categoryIndex: 1 }, { label: 'ride a bike', categoryIndex: 1 },
      { label: 'swim', categoryIndex: 1 },
    ],
    [
      phrase('“I read books after school.” 表示什么？', ['我放学后读书。', '我放学后游泳。', '我放学后踢足球。'], 0, 'read books 表示“读书”。', 'I read books after school. 的意思是“我放学后读书”。', ['after', 'I', 'school', 'books', 'read', '.'], [1, 4, 3, 0, 2, 5]),
      phrase('想说“我喜欢数学”，哪句话合适？', ['I like maths.', 'I like English.', 'I like music.'], 0, 'maths 表示“数学”。', 'I like maths. 的意思是“我喜欢数学”。', ['maths', 'like', 'I', '.'], [2, 1, 0, 3]),
    ],
  ),
  'review-family-activities-home': profile(
    [['aunt', '阿姨或姑姑'], ['cooking dinner', '做晚饭'], ['study', '书房'], ['walking the dog', '遛狗']], ['家庭与亲属称呼', '家庭活动或居家词汇'],
    [
      { label: 'family', categoryIndex: 0 }, { label: 'aunt', categoryIndex: 0 }, { label: 'mother', categoryIndex: 0 },
      { label: 'sister', categoryIndex: 0 }, { label: 'cousin', categoryIndex: 0 },
      { label: 'grandmother', categoryIndex: 0 }, { label: 'uncle', categoryIndex: 0 }, { label: 'father', categoryIndex: 0 },
      { label: 'brother', categoryIndex: 0 }, { label: 'grandfather', categoryIndex: 0 }, { label: 'cooking dinner', categoryIndex: 1 },
      { label: 'walking the dog', categoryIndex: 1 }, { label: 'watering the plants', categoryIndex: 1 },
      { label: 'cleaning the room', categoryIndex: 1 }, { label: 'listening to music', categoryIndex: 1 },
      { label: 'watching TV', categoryIndex: 1 }, { label: 'feeding the fish', categoryIndex: 1 }, { label: 'home', categoryIndex: 1 },
      { label: 'bedroom', categoryIndex: 1 }, { label: 'living room', categoryIndex: 1 }, { label: 'bathroom', categoryIndex: 1 },
      { label: 'dining room', categoryIndex: 1 }, { label: 'study', categoryIndex: 1 }, { label: 'kitchen', categoryIndex: 1 },
      { label: 'sofa', categoryIndex: 1 }, { label: 'light', categoryIndex: 1 }, { label: 'bed', categoryIndex: 1 },
      { label: 'door', categoryIndex: 1 }, { label: 'box', categoryIndex: 1 },
    ],
    [
      phrase('“My aunt is cooking dinner.” 表示什么？', ['我的阿姨正在做晚饭。', '我的书房正在遛狗。', '我的叔叔正在看电视。'], 0, 'aunt 表示“阿姨、姑姑或舅妈”，cooking dinner 表示“做晚饭”。', 'My aunt is cooking dinner. 的意思是“我的阿姨正在做晚饭”。', ['dinner', 'My', 'cooking', 'is', 'aunt', '.'], [1, 4, 3, 2, 0, 5]),
      phrase('“Where is the study?” 是在问什么？', ['书房在哪里？', '阿姨在做什么？', '你喜欢什么课？'], 0, 'study 表示“书房”。', 'Where is the study? 是在询问书房的位置。', ['study', 'Where', 'the', 'is', '?'], [1, 3, 2, 0, 4]),
    ],
  ),
};

const taskTitles = {
  basic: ['词汇认读小队', '短句练习站'],
  advanced: ['情境选句挑战', '词义连线任务'],
  high: ['英语小小表达家', '主题对话策划员'],
} as const;
const objectives = {
  basic: ['认读主题词汇，并把英文单词和中文意思对应起来。', '理解简单指令或句子，并按正确词序排列词卡。'],
  advanced: ['根据熟悉情境选择合适的英文表达，并理解关键词。', '综合词汇、分类和句子顺序完成主题表达。'],
  high: ['比较相近表达，根据语境组织完整、清楚的句子。', '围绕主题设计简短交流，并检查词义和语序。'],
} as const;

function rotate<T>(items: readonly T[], offset: number): T[] {
  const start = offset % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

const classificationItemsPerQuestion = 8;
const classificationQuestionsPerTask = 2;

function chunkClassifications(items: EnglishProfile['classified']): EnglishProfile['classified'][] {
  if (items.length <= classificationItemsPerQuestion) return [[...items]];

  const groups: [Array<EnglishProfile['classified'][number]>, Array<EnglishProfile['classified'][number]>] = [
    items.filter(({ categoryIndex }) => categoryIndex === 0),
    items.filter(({ categoryIndex }) => categoryIndex === 1),
  ];
  const chunkCount = Math.ceil(items.length / classificationItemsPerQuestion);
  const baseChunkSize = Math.floor(items.length / chunkCount);
  const largerChunkCount = items.length % chunkCount;
  const chunkSizes = Array.from({ length: chunkCount }, (_, index) => baseChunkSize + Number(index < largerChunkCount));
  const chunks = chunkSizes.map(() => [] as Array<EnglishProfile['classified'][number]>);
  const categoryCounts = chunkSizes.map(() => [0, 0] as [number, number]);

  for (const categoryIndex of [0, 1] as const) {
    for (const item of groups[categoryIndex]) {
      const chunkIndex = chunkSizes
        .map((_, index) => index)
        .filter((index) => chunks[index]!.length < chunkSizes[index]!)
        .sort((left, right) => categoryCounts[left]![categoryIndex]
          - categoryCounts[right]![categoryIndex]
          || chunks[left]!.length - chunks[right]!.length
          || left - right)[0];
      if (chunkIndex === undefined) throw new Error('分类词卡分组在拆分过程中意外耗尽容量。');
      chunks[chunkIndex]!.push(item);
      categoryCounts[chunkIndex]![categoryIndex] += 1;
    }
  }

  if (chunks.some((chunk, index) => chunk.length !== chunkSizes[index])) {
    throw new Error('分类词卡拆分后未完整放入各题。');
  }

  return chunks;
}

function varyChoicePositions(questions: readonly EnglishQuestionSpec[], seed: number): EnglishQuestionSpec[] {
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

function courseSeed(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): number {
  const idSeed = [...entry.id].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return idSeed + taskIndex * 13 + (difficulty === 'basic' ? 0 : difficulty === 'advanced' ? 19 : 37);
}

function createQuestions(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): EnglishQuestionSpec[] {
  const selected = profiles[entry.profileKey];
  if (!selected) throw new Error(`缺少英语题目配置：${entry.profileKey}`);
  const wordOffset = taskIndex * 2 + (difficulty === 'basic' ? 0 : difficulty === 'advanced' ? 1 : 2);
  const words = rotate(selected.words, wordOffset);
  const [first, second, third, fourth] = words;
  const phraseOffset = (taskIndex + (difficulty === 'high' ? 1 : 0)) % selected.phrases.length;
  const firstPhrase = selected.phrases[phraseOffset]!;
  const secondPhrase = selected.phrases[(phraseOffset + 1) % selected.phrases.length]!;
  const categoryGroups = selected.categories.map((label, categoryIndex) => ({
    label,
    categoryIndex,
    words: selected.classified.filter((item) => item.categoryIndex === categoryIndex).map(({ label: word }) => word),
  }));
  const classificationChunks = chunkClassifications(selected.classified);
  if (classificationChunks.length > classificationQuestionsPerTask * 2) {
    throw new Error(`分类词卡超过单元可拆分容量：${entry.id}（${selected.classified.length} 项）`);
  }
  const firstTaskClassificationChunkCount = Math.max(1, Math.floor(classificationChunks.length / 2));
  const taskClassificationChunkIndex = taskIndex === 0 ? 0 : firstTaskClassificationChunkCount;
  const taskClassificationChunks = taskIndex === 0
    ? classificationChunks.slice(0, firstTaskClassificationChunkCount)
    : classificationChunks.slice(firstTaskClassificationChunkCount);
  const primaryClassificationChunk = taskClassificationChunks[0];
  const secondaryClassificationChunk = taskClassificationChunks[1];
  const classifyChunk = (items: EnglishProfile['classified'], chunkIndex: number): EnglishQuestionSpec => sortInto(
    classificationChunks.length > 1 ? `把第${chunkIndex + 1}组词卡放进合适的小组。` : '把词卡放进合适的小组。',
    selected.categories,
    items,
    '读懂每张词卡，再按本组名称分类。',
    '每张词卡都按同一个分类标准放入一组。',
  );
  const multiWordGroups = categoryGroups.filter(({ words: groupWords }) => groupWords.length >= 2);
  const advancedGroup = multiWordGroups[taskIndex % multiWordGroups.length];
  const pairStart = advancedGroup && taskIndex > 0 && advancedGroup.words.length > 2 ? 1 : 0;
  const advancedPair = advancedGroup
    ? [advancedGroup.words[pairStart]!, advancedGroup.words[(pairStart + 1) % advancedGroup.words.length]!]
    : words.slice(0, 2).map(([word]) => word);
  const outsideWords = selected.classified
    .filter((item) => item.categoryIndex !== advancedGroup?.categoryIndex)
    .map(({ label: word }) => word);
  const advancedOptions = [
    advancedPair.join(' and '),
    `${advancedPair[0]} and ${outsideWords[0] ?? words[2]![0]}`,
    `${outsideWords[0] ?? words[2]![0]} and ${advancedPair[1]}`,
  ] as [string, string, string];
  const wordMeaningCheck = `“${first[0]}”表示“${first[1]}”，“${second[0]}”表示“${second[1]}”。`;
  const matchPairs = taskIndex === 0
    ? words.map(([word, meaning]) => [word, meaning] as const)
    : words.map(([word, meaning]) => [meaning, word] as const);
  const phraseRepair = (target: Phrase): EnglishQuestionSpec => {
    if (taskIndex === 0) return choose(target.prompt, target.options, target.correct, target.hint, target.explanation);
    const wrongIndex = (target.correct + 1) % target.options.length;
    const otherWrongIndex = (target.correct + 2) % target.options.length;
    return choose(`同伴为“${target.prompt}”选了“${target.options[wrongIndex]}”，应该改成哪一项？`, [
      target.options[target.correct],
      target.options[otherWrongIndex],
      '不看题意，保留原来的选择。',
    ], 0, '回到题目中的英文和中文线索，核对选项是否符合要求。', `${target.options[target.correct]}符合“${target.prompt}”的要求。`);
  };
  const classificationQuestion: EnglishQuestionSpec = primaryClassificationChunk
    ? classifyChunk(primaryClassificationChunk, taskClassificationChunkIndex)
    : (() => {
      const { label, categoryIndex } = selected.classified[selected.classified.length - 1]!;
      return choose(`“${label}”belongs to which group?`, [selected.categories[categoryIndex]!, selected.categories[1 - categoryIndex]!, '两组都不符合'], 0, '读懂这个英文词，再对照两个小组的名称。', `“${label}”属于“${selected.categories[categoryIndex]}”这一组。`);
    })();
  const wordStudyOrder: EnglishQuestionSpec = taskIndex === 0
    ? arrange('Put the word cards in the correct order.', firstPhrase.orderItems, firstPhrase.correctOrder, '先找句子的开头，再检查词序和句末标点。', `正确表达是：${firstPhrase.correctOrder.map((index) => firstPhrase.orderItems[index]).join(' ')}。`)
    : arrange('Plan a short English introduction. Put the steps in order.', [
      'Choose word cards that fit the topic',
      'Check what each word means',
      'Use the words in a simple expression',
      'Read it aloud and check the word order',
    ], [0, 1, 2, 3], '先选符合主题的词卡，再核对词义和表达顺序。', '先选词卡、确认词义，再组成简单表达并检查词序。');
  const phraseStrategy: EnglishQuestionSpec = taskIndex === 0
    ? choose(secondPhrase.prompt, secondPhrase.options, secondPhrase.correct, secondPhrase.hint, secondPhrase.explanation)
    : choose(`要判断“${secondPhrase.options[secondPhrase.correct]}”是否符合“${secondPhrase.prompt}”，先做什么？`, [
      secondPhrase.hint,
      '只比较选项的长短，不看英文词义。',
      '不读题目和词卡，直接猜答案。',
    ], 0, '把题意和词卡线索放在一起核对。', secondPhrase.hint);
  const secondaryClassificationQuestion = secondaryClassificationChunk
    ? classifyChunk(secondaryClassificationChunk, taskClassificationChunkIndex + 1)
    : phraseStrategy;
  const highQuestion = taskIndex === 0
    ? choose('向伙伴介绍句子前，先检查什么？', [
      '核对关键词的意思，再按正确词序读一遍。',
      '不核对词义，先加上更多词。',
      '省略词序，请伙伴猜一猜。',
    ], 0, '检查词语意思和排列顺序。', '核对词义和词序，伙伴更容易听懂句子。')
    : choose(`同伴把“${first[0]}”的意思说成“${second[1]}”，哪条词卡能改正？`, [
      wordMeaningCheck,
      `“${first[0]}”表示“${second[1]}”，“${second[0]}”表示“${first[1]}”。`,
      `“${first[0]}”表示“${first[1]}”，“${second[0]}”也表示“${first[1]}”。`,
    ], 0, '对照两张词卡，分别核对英文和中文意思。', wordMeaningCheck);

  const questions: EnglishQuestionSpec[] = [
    choose(`Which word means “${first[1]}”?`, [first[0], second[0], third[0]], 0, '先想一想本单元词卡里的英文单词。', `${first[0]} means “${first[1]}”.`),
    choose(`Which word means “${second[1]}”?`, [third[0], second[0], fourth[0]], 1, '把中文意思和你学过的词卡逐个核对。', `${second[0]} means “${second[1]}”.`),
    pair(taskIndex === 0 ? 'Match each English word with its Chinese meaning.' : 'Match each Chinese meaning with its English word.', matchPairs, '先读清词语或意思，再逐个核对对应关系。', '每个英文单词都和对应的中文意思配成一组。'),
    phraseRepair(firstPhrase),
    classificationQuestion,
    wordStudyOrder,
    secondaryClassificationQuestion,
    difficulty === 'basic'
      ? choose(`Which sentence matches “${fourth[1]}”?`, [
        `${fourth[0]} means “${fourth[1]}”.`, `${first[0]} means “${fourth[1]}”.`, `${third[0]} means “${second[1]}”.`,
      ], 0, '把题目中的中文意思和三个英文词义说明逐项核对。', `${fourth[0]} means “${fourth[1]}”.`)
      : difficulty === 'advanced'
        ? taskIndex === 0
          ? choose(`想用英文词卡介绍“${advancedGroup?.label ?? selected.categories[0]}”，哪组词都符合？`, [
            ...advancedOptions,
          ], 0, '逐个核对两个英文词是否都符合分类名称。', `${advancedPair.join(' and ')} 都属于“${advancedGroup?.label ?? selected.categories[0]}”。`)
          : choose(`比较“${first[0]}”和“${second[0]}”两张词卡，哪种记录把词义配对正确？`, [
            wordMeaningCheck,
            `“${first[0]}”表示“${second[1]}”，“${second[0]}”表示“${first[1]}”。`,
            `“${first[0]}”表示“${first[1]}”，“${second[0]}”也表示“${first[1]}”。`,
          ], 0, '逐张核对英文单词和中文意思，再检查两张卡。', wordMeaningCheck)
        : highQuestion,
  ];
  return varyChoicePositions(questions, courseSeed(entry, difficulty, taskIndex));
}

function makeTaskSpec(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', index: number): EnglishTaskSpec {
  const title = `${entry.title.replace(/^(第一|第二|第三|第四|第五|第六)单元 · /, '')} · ${taskTitles[difficulty][index]}`;
  return {
    title,
    objective: objectives[difficulty][index],
    companionId: `companion-0${((index + 1) % 4) + 1}` as EnglishTaskSpec['companionId'],
    questions: q8(createQuestions(entry, difficulty, index)),
  };
}

export function buildAddedEnglishUnit(id: string) {
  const entry = addedCourseById[id];
  if (!entry || entry.subject !== 'english') throw new Error(`课程目录中没有英语条目：${id}`);
  const tasks = (difficulty: 'basic' | 'advanced' | 'high') => [makeTaskSpec(entry, difficulty, 0), makeTaskSpec(entry, difficulty, 1)] as const;
  return buildEnglishUnit({
    grade: entry.grade,
    term: entry.term,
    formalUnitNumber: entry.formalUnitNumber,
    entryId: entry.slug,
    type: entry.type as 'unit' | 'review',
    title: entry.title,
    sourceTopics: entry.sourceTopics,
    basicTasks: tasks('basic'),
    advancedTasks: tasks('advanced'),
    highTasks: tasks('high'),
  });
}
