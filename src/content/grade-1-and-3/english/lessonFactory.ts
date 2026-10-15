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
    [['teacher', '老师'], ['book', '书'], ['bag', '书包'], ['desk', '课桌']], ['人物', '校园物品'],
    [{ label: 'teacher', categoryIndex: 0 }, { label: 'book', categoryIndex: 1 }, { label: 'bag', categoryIndex: 1 }, { label: 'desk', categoryIndex: 1 }],
    [
      phrase('想介绍一本书，应该选哪句话？', ['This is a book.', 'This is a teacher.', 'This is a bag.'], 0, 'book 表示“书”。', 'This is a book. 的意思是“这是一本书”。', ['book', 'a', 'This', 'is', '.'], [2, 3, 1, 0, 4]),
      phrase('老师说“Open your book.”，应该做什么？', ['打开你的书。', '背上你的书包。', '坐到课桌下面。'], 0, 'book 是“书”，open 是“打开”。', 'Open your book. 是“打开你的书”。', ['your', 'Open', '.', 'book'], [1, 0, 3, 2]),
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
    [['cat', '猫'], ['dog', '狗'], ['bird', '鸟'], ['fish', '鱼']], ['猫、狗或鸟', '鱼类'],
    [{ label: 'cat', categoryIndex: 0 }, { label: 'dog', categoryIndex: 0 }, { label: 'bird', categoryIndex: 0 }, { label: 'fish', categoryIndex: 1 }],
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
    [['pencil', '铅笔'], ['ruler', '尺子'], ['eraser', '橡皮'], ['book', '书']], ['文具', '学习材料'],
    [{ label: 'pencil', categoryIndex: 0 }, { label: 'ruler', categoryIndex: 0 }, { label: 'eraser', categoryIndex: 0 }, { label: 'book', categoryIndex: 1 }],
    [
      phrase('老师说“Show me your ruler.”，应该做什么？', ['把尺子给老师看。', '把橡皮放进书里。', '拿出一只玩具。'], 0, 'ruler 表示“尺子”。', 'Show me your ruler. 是“把你的尺子给我看”。', ['your', 'Show', 'ruler', 'me', '.'], [1, 3, 0, 2, 4]),
      phrase('“This is my pencil.” 表示什么？', ['这是我的铅笔。', '这是我的尺子。', '这是我的书。'], 0, 'pencil 表示“铅笔”。', 'This is my pencil. 的意思是“这是我的铅笔”。', ['pencil', 'my', 'This', '.', 'is'], [2, 4, 1, 0, 3]),
    ],
  ),
  room: profile(
    [['bed', '床'], ['desk', '书桌'], ['chair', '椅子'], ['door', '门']], ['家具', '房间部位'],
    [{ label: 'bed', categoryIndex: 0 }, { label: 'desk', categoryIndex: 0 }, { label: 'chair', categoryIndex: 0 }, { label: 'door', categoryIndex: 1 }],
    [
      phrase('“Where is the chair?” 是在问什么？', ['椅子在哪里？', '椅子是什么颜色？', '椅子有几本？'], 0, 'where 用来询问地点。', 'Where is the chair? 是在询问椅子的位置。', ['the', 'Where', 'chair', 'is', '?'], [1, 3, 0, 2, 4]),
      phrase('想说“床在房间里”，应该选哪句？', ['The bed is in the room.', 'The chair is on the desk.', 'The door is blue.'], 0, 'bed 是“床”，room 是“房间”。', 'The bed is in the room. 表示“床在房间里”。', ['in', 'The', 'room', 'bed', 'the', 'is', '.'], [1, 3, 5, 0, 4, 2, 6]),
    ],
  ),
  toys: profile(
    [['ball', '球'], ['kite', '风筝'], ['doll', '玩偶'], ['car', '小汽车']], ['球类或飞行玩具', '其他玩具'],
    [{ label: 'ball', categoryIndex: 0 }, { label: 'kite', categoryIndex: 0 }, { label: 'doll', categoryIndex: 1 }, { label: 'car', categoryIndex: 1 }],
    [
      phrase('“I have a ball.” 表示什么？', ['我有一个球。', '我喜欢一只猫。', '我有一把尺子。'], 0, 'have 表示“有”。', 'I have a ball. 的意思是“我有一个球”。', ['a', 'ball', 'I', '.', 'have'], [2, 4, 0, 1, 3]),
      phrase('想询问“这是风筝吗？”，应该选哪句？', ['Is this a kite?', 'Is this a book?', 'Is this a doll?'], 0, 'kite 表示“风筝”。', 'Is this a kite? 是“这是风筝吗？”', ['a', 'this', 'Is', 'kite', '?'], [2, 1, 0, 3, 4]),
    ],
  ),
  food: profile(
    [['rice', '米饭'], ['bread', '面包'], ['egg', '鸡蛋'], ['fish', '鱼肉']], ['主食', '其他食物'],
    [{ label: 'rice', categoryIndex: 0 }, { label: 'bread', categoryIndex: 0 }, { label: 'egg', categoryIndex: 1 }, { label: 'fish', categoryIndex: 1 }],
    [
      phrase('“I like rice.” 表示什么？', ['我喜欢米饭。', '我有一杯牛奶。', '这是一个鸡蛋。'], 0, 'rice 表示“米饭”。', 'I like rice. 的意思是“我喜欢米饭”。', ['rice', 'I', 'like', '.'], [1, 2, 0, 3]),
      phrase('想礼貌地问“你喜欢鸡蛋吗？”，应该选哪句？', ['Do you like eggs?', 'Where is the bread?', 'How many books?'], 0, 'Do you like…? 可以询问喜好。', 'Do you like eggs? 是在询问是否喜欢鸡蛋。', ['eggs', 'Do', 'like', 'you', '?'], [1, 3, 2, 0, 4]),
    ],
  ),
  drink: profile(
    [['water', '水'], ['milk', '牛奶'], ['juice', '果汁'], ['tea', '茶']], ['含字母 e', '不含字母 e'],
    [{ label: 'water', categoryIndex: 0 }, { label: 'milk', categoryIndex: 1 }, { label: 'juice', categoryIndex: 0 }, { label: 'tea', categoryIndex: 0 }],
    [
      phrase('想说“我想要水”，应该选哪句？', ['I want water.', 'I want a book.', 'I like a chair.'], 0, 'water 表示“水”。', 'I want water. 的意思是“我想要水”。', ['water', '.', 'I', 'want'], [2, 3, 0, 1]),
      phrase('别人递来果汁时，哪句可以表达感谢？', ['Thank you.', 'Good night.', 'How many?'], 0, '接受帮助或物品后可以表示感谢。', 'Thank you. 的意思是“谢谢你”。', ['you', 'Thank', '.'], [1, 0, 2]),
    ],
  ),
  clothes: profile(
    [['shirt', '衬衫'], ['coat', '外套'], ['shoes', '鞋子'], ['hat', '帽子']], ['上身或头部衣物', '鞋类'],
    [{ label: 'shirt', categoryIndex: 0 }, { label: 'coat', categoryIndex: 0 }, { label: 'hat', categoryIndex: 0 }, { label: 'shoes', categoryIndex: 1 }],
    [
      phrase('想说“我的外套是红色的”，应该选哪句？', ['My coat is red.', 'My shoes are a book.', 'My hat is a ruler.'], 0, 'coat 表示“外套”。', 'My coat is red. 的意思是“我的外套是红色的”。', ['red', 'coat', 'My', 'is', '.'], [2, 1, 3, 0, 4]),
      phrase('天气冷时，哪件衣物通常更适合穿在外面？', ['a coat', 'a pencil', 'a pear'], 0, 'coat 是外套。', '外套可以穿在衣服外面保暖。', ['a', 'coat', 'This', 'is', '.'], [2, 3, 0, 1, 4]),
    ],
  ),
  myself: profile(
    [['name', '名字'], ['age', '年龄'], ['I', '我'], ['friend', '朋友']], ['自我信息', '人际关系'],
    [{ label: 'name', categoryIndex: 0 }, { label: 'age', categoryIndex: 0 }, { label: 'I', categoryIndex: 0 }, { label: 'friend', categoryIndex: 1 }],
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
    [['birthday', '生日'], ['cake', '蛋糕'], ['gift', '礼物'], ['happy', '快乐的']], ['庆祝活动', '祝福词'],
    [{ label: 'cake', categoryIndex: 0 }, { label: 'gift', categoryIndex: 0 }, { label: 'birthday', categoryIndex: 0 }, { label: 'happy', categoryIndex: 1 }],
    [
      phrase('生日时想送上祝福，哪句话合适？', ['Happy birthday!', 'Good morning!', 'Open your book!'], 0, 'birthday 表示“生日”。', 'Happy birthday! 是“生日快乐！”', ['birthday', 'Happy', '!'], [1, 0, 2]),
      phrase('“This is a gift.” 表示什么？', ['这是一份礼物。', '这是一个蛋糕。', '这是我的生日。'], 0, 'gift 表示“礼物”。', 'This is a gift. 的意思是“这是一份礼物”。', ['gift', 'a', 'This', 'is', '.'], [2, 3, 1, 0, 4]),
    ],
  ),
  'school-subjects': profile(
    [['English', '英语'], ['math', '数学'], ['music', '音乐'], ['art', '美术']], ['语言和数学学科', '艺术学科'],
    [{ label: 'English', categoryIndex: 0 }, { label: 'math', categoryIndex: 0 }, { label: 'music', categoryIndex: 1 }, { label: 'art', categoryIndex: 1 }],
    [
      phrase('“I like music.” 表示什么？', ['我喜欢音乐。', '我有一本数学书。', '我在美术教室。'], 0, 'music 表示“音乐”。', 'I like music. 的意思是“我喜欢音乐”。', ['music', 'like', 'I', '.'], [2, 1, 0, 3]),
      phrase('想询问“你喜欢哪门课？”，应该选哪句？', ['What subject do you like?', 'Where is my book?', 'How old are you?'], 0, 'subject 表示“学科”。', 'What subject do you like? 是在询问喜欢的学科。', ['subject', 'do', 'What', 'you', 'like', '?'], [2, 0, 1, 3, 4, 5]),
    ],
  ),
  'my-school': profile(
    [['school', '学校'], ['library', '图书馆'], ['classroom', '教室'], ['playground', '操场']], ['学校、教室或图书馆', '操场'],
    [{ label: 'library', categoryIndex: 0 }, { label: 'classroom', categoryIndex: 0 }, { label: 'school', categoryIndex: 0 }, { label: 'playground', categoryIndex: 1 }],
    [
      phrase('想说“图书馆在学校里”，应该选哪句？', ['The library is in the school.', 'The school is a pencil.', 'The classroom is a cake.'], 0, 'library 表示“图书馆”。', 'The library is in the school. 表示“图书馆在学校里”。', ['school', 'The', 'in', 'library', 'is', 'the', '.'], [1, 3, 4, 2, 5, 0, 6]),
      phrase('“Where is the playground?” 是在问什么？', ['操场在哪里？', '你喜欢哪门课？', '你几岁？'], 0, 'where 用来询问地点。', 'Where is the playground? 是在询问操场的位置。', ['the', 'Where', 'playground', 'is', '?'], [1, 3, 0, 2, 4]),
    ],
  ),
  'after-school': profile(
    [['read', '阅读'], ['draw', '画画'], ['sing', '唱歌'], ['play', '玩耍或参加游戏']], ['安静活动', '表演或游戏活动'],
    [{ label: 'read', categoryIndex: 0 }, { label: 'draw', categoryIndex: 0 }, { label: 'sing', categoryIndex: 1 }, { label: 'play', categoryIndex: 1 }],
    [
      phrase('“I read after school.” 表示什么？', ['我放学后阅读。', '我在学校里睡觉。', '我正在吃一个书包。'], 0, 'after school 表示“放学后”。', 'I read after school. 的意思是“我放学后阅读”。', ['school', 'after', 'read', 'I', '.'], [3, 2, 1, 0, 4]),
      phrase('想询问朋友放学后喜欢什么活动，哪句合适？', ['What do you like after school?', 'What colour is your bag?', 'How many apples?'], 0, 'like 表示“喜欢”，after school 表示“放学后”。', 'What do you like after school? 是在询问放学后喜欢什么。', ['after', 'What', 'do', 'school', 'you', 'like', '?'], [1, 2, 4, 5, 0, 3, 6]),
    ],
  ),
  family: profile(
    [['mother', '妈妈'], ['father', '爸爸'], ['sister', '姐姐或妹妹'], ['brother', '哥哥或弟弟']], ['女性家人称呼', '男性家人称呼'],
    [{ label: 'mother', categoryIndex: 0 }, { label: 'sister', categoryIndex: 0 }, { label: 'father', categoryIndex: 1 }, { label: 'brother', categoryIndex: 1 }],
    [
      phrase('想介绍爸爸，哪句话正确？', ['This is my father.', 'This is my mother.', 'This is my sister.'], 0, 'father 表示“爸爸”。', 'This is my father. 的意思是“这是我的爸爸”。', ['father', 'my', 'This', 'is', '.'], [2, 3, 1, 0, 4]),
      phrase('“She is my sister.” 表示什么？', ['她是我的姐姐或妹妹。', '他是我的哥哥或弟弟。', '她是我的妈妈。'], 0, 'sister 表示姐姐或妹妹。', 'She is my sister. 是“她是我的姐姐或妹妹”。', ['my', 'sister', 'She', '.', 'is'], [2, 4, 0, 1, 3]),
    ],
  ),
  'family-activities': profile(
    [['cook', '做饭'], ['clean', '打扫'], ['read', '阅读'], ['walk', '散步']], ['家务活动', '休闲活动'],
    [{ label: 'cook', categoryIndex: 0 }, { label: 'clean', categoryIndex: 0 }, { label: 'read', categoryIndex: 1 }, { label: 'walk', categoryIndex: 1 }],
    [
      phrase('“We clean the room.” 表示什么？', ['我们打扫房间。', '我们在房间里游泳。', '我们有一辆汽车。'], 0, 'clean 表示“打扫”。', 'We clean the room. 的意思是“我们打扫房间”。', ['room', 'the', 'We', 'clean', '.'], [2, 3, 1, 0, 4]),
      phrase('想说“我们一起散步”，哪句合适？', ['We walk together.', 'We drink a chair.', 'We read a shoe.'], 0, 'walk 表示“散步或走路”。', 'We walk together. 表示“我们一起散步”。', ['together', 'We', 'walk', '.'], [1, 2, 0, 3]),
    ],
  ),
  'my-home': profile(
    [['bedroom', '卧室'], ['kitchen', '厨房'], ['living room', '客厅'], ['bathroom', '浴室']], ['休息或起居的房间', '其他房间'],
    [{ label: 'bedroom', categoryIndex: 0 }, { label: 'living room', categoryIndex: 0 }, { label: 'kitchen', categoryIndex: 1 }, { label: 'bathroom', categoryIndex: 1 }],
    [
      phrase('“This is the kitchen.” 表示什么？', ['这是厨房。', '这是卧室。', '这是操场。'], 0, 'kitchen 表示“厨房”。', 'This is the kitchen. 的意思是“这是厨房”。', ['the', 'kitchen', 'This', 'is', '.'], [2, 3, 0, 1, 4]),
      phrase('想询问客厅在哪里，应该选哪句？', ['Where is the living room?', 'What is your name?', 'How many books?'], 0, 'where 用来询问地点。', 'Where is the living room? 是在询问客厅的位置。', ['living', 'Where', 'room', 'is', 'the', '?'], [1, 3, 4, 0, 2, 5]),
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
    [['pencil', '铅笔'], ['chair', '椅子'], ['ball', '球'], ['bed', '床']], ['学习用品', '家具或玩具'],
    [{ label: 'pencil', categoryIndex: 0 }, { label: 'chair', categoryIndex: 1 }, { label: 'ball', categoryIndex: 1 }, { label: 'bed', categoryIndex: 1 }],
    [
      phrase('想介绍一支铅笔，哪句正确？', ['This is a pencil.', 'This is a bed.', 'This is a ball.'], 0, 'pencil 表示“铅笔”。', 'This is a pencil. 的意思是“这是一支铅笔”。', ['a', 'This', 'pencil', 'is', '.'], [1, 3, 0, 2, 4]),
      phrase('“Where is the ball?” 是在问什么？', ['球在哪里？', '球是什么颜色？', '球有几本？'], 0, 'where 用来询问地点。', 'Where is the ball? 是在询问球的位置。', ['the', 'ball', 'Where', 'is', '?'], [2, 3, 0, 1, 4]),
    ],
  ),
  'review-food-drink-clothes': profile(
    [['bread', '面包'], ['water', '水'], ['shirt', '衬衫'], ['milk', '牛奶']], ['食物或饮品', '衣物'],
    [{ label: 'bread', categoryIndex: 0 }, { label: 'water', categoryIndex: 0 }, { label: 'milk', categoryIndex: 0 }, { label: 'shirt', categoryIndex: 1 }],
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
    [['rabbit', '兔子'], ['coat', '外套'], ['cake', '蛋糕'], ['gift', '礼物']], ['动物或衣物', '生日物品'],
    [{ label: 'rabbit', categoryIndex: 0 }, { label: 'coat', categoryIndex: 0 }, { label: 'cake', categoryIndex: 1 }, { label: 'gift', categoryIndex: 1 }],
    [
      phrase('生日时收到礼物，可以说什么？', ['Thank you.', 'Where is the rabbit?', 'Open your coat.'], 0, '收到礼物后可以礼貌地表示感谢。', 'Thank you. 的意思是“谢谢你”。', ['you', 'Thank', '.'], [1, 0, 2]),
      phrase('“This is my coat.” 表示什么？', ['这是我的外套。', '这是我的兔子。', '这是一个蛋糕。'], 0, 'coat 表示“外套”。', 'This is my coat. 的意思是“这是我的外套”。', ['coat', 'This', '.', 'is', 'my'], [1, 3, 4, 0, 2]),
    ],
  ),
  'review-subjects-school-activities': profile(
    [['math', '数学'], ['school', '学校'], ['read', '阅读'], ['music', '音乐']], ['学科或学校', '课后活动'],
    [{ label: 'math', categoryIndex: 0 }, { label: 'music', categoryIndex: 0 }, { label: 'school', categoryIndex: 0 }, { label: 'read', categoryIndex: 1 }],
    [
      phrase('“I read after school.” 表示什么？', ['我放学后阅读。', '我喜欢数学。', '我在音乐教室。'], 0, 'read 表示“阅读”。', 'I read after school. 的意思是“我放学后阅读”。', ['after', 'I', 'school', 'read', '.'], [1, 3, 0, 2, 4]),
      phrase('想说“我喜欢数学”，哪句合适？', ['I like math.', 'I like a school.', 'I like a ruler.'], 0, 'math 表示“数学”。', 'I like math. 表示“我喜欢数学”。', ['math', 'like', 'I', '.'], [2, 1, 0, 3]),
    ],
  ),
  'review-family-activities-home': profile(
    [['mother', '妈妈'], ['cook', '做饭'], ['bedroom', '卧室'], ['walk', '散步']], ['家人称呼', '家庭活动或房间'],
    [{ label: 'mother', categoryIndex: 0 }, { label: 'cook', categoryIndex: 1 }, { label: 'bedroom', categoryIndex: 1 }, { label: 'walk', categoryIndex: 1 }],
    [
      phrase('“My mother can cook.” 表示什么？', ['我的妈妈会做饭。', '我的卧室会走路。', '我的书在厨房。'], 0, 'mother 表示“妈妈”，cook 表示“做饭”。', 'My mother can cook. 的意思是“我的妈妈会做饭”。', ['cook', 'My', 'can', 'mother', '.'], [1, 3, 2, 0, 4]),
      phrase('“Where is the bedroom?” 是在问什么？', ['卧室在哪里？', '妈妈几岁？', '你喜欢散步吗？'], 0, 'where 用来询问地点。', 'Where is the bedroom? 是在询问卧室的位置。', ['bedroom', 'Where', 'the', 'is', '?'], [1, 3, 2, 0, 4]),
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
  const classificationQuestion: EnglishQuestionSpec = taskIndex === 0
    ? sortInto('把词卡放进合适的小组。', selected.categories, selected.classified, '读懂每张词卡，再按本组名称分类。', '每张词卡都按同一个分类标准放入一组。')
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
    phraseStrategy,
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
