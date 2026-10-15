import { addedCourseById, type AddedCourseEntry } from '../catalog';
import { buildChineseUnit } from '../../grade-2/term-1/chinese/buildChineseUnit';
import { arrange, choose, makeTask, pair, sortInto } from '../../grade-2/term-1/chinese/questionAuthoring';
import type { ChineseQuestionSpec, ChineseTaskSpec } from '../../grade-2/term-1/chinese/buildChineseUnit';

interface ChineseProfile {
  concepts: readonly [readonly [string, string], readonly [string, string], readonly [string, string], readonly [string, string]];
  categories: readonly [string, string];
  classified: ReadonlyArray<readonly [string, 0 | 1]>;
  sequence: readonly [string, string, string, string];
  scenario: { prompt: string; options: readonly [string, string, string]; correct: 0 | 1 | 2; explanation: string };
}

function profile(
  concepts: ChineseProfile['concepts'],
  categories: ChineseProfile['categories'],
  classified: ChineseProfile['classified'],
  sequence: ChineseProfile['sequence'],
  scenario: ChineseProfile['scenario'],
): ChineseProfile {
  return { concepts, categories, classified, sequence, scenario };
}

const commonObservation = {
  prompt: '读完观察卡后，哪种做法最合适？',
  options: ['先说清看到了什么，再说自己的想法', '把还没看到的事情说成已经发生', '不看记录就下结论'],
  correct: 0,
  explanation: '先说观察到的事实，再说想法，表达更清楚也更有根据。',
} as const;

const profiles: Record<string, ChineseProfile> = {
  'g1-school': profile(
    [['天', '我们抬头能看到的天空'], ['地', '我们脚下的土地'], ['人', '生活中的每一个人'], ['口耳目', '嘴、耳朵和眼睛']],
    ['身体部位', '身边环境'], [['口', 0], ['耳', 0], ['天', 1], ['地', 1]],
    ['先看看校园和教室', '再认一认身边的事物', '把新认识的字读一读', '和同伴说说发现'],
    { prompt: '看见同伴把“口”和“耳”认反了，怎样帮助他？', options: ['指着相应部位一起辨认', '说两个字没有区别', '把字卡收起来不再看'], correct: 0, explanation: '把字和对应部位联系起来观察，能帮助辨认。' },
  ),
  'g1-four-seasons': profile(
    [['春天', '一年中春暖花开的季节'], ['夏天', '一年中天气较热的季节'], ['秋天', '一年中天气渐凉的季节'], ['冬天', '一年中天气较冷的季节']],
    ['春夏季节', '秋冬季节'], [['春天', 0], ['夏天', 0], ['秋天', 1], ['冬天', 1]],
    ['看看当天的天气', '观察周围景物', '记下季节里的变化', '用季节词说一说'],
    { prompt: '想比较同一棵树在春天和秋天的变化，怎样做？', options: ['在不同时间观察并记录叶子的变化', '只看一片叶子就判断全年', '把树叶的颜色猜出来'], correct: 0, explanation: '在不同时间观察并记录，才能比较变化。' },
  ),
  'pinyin-initials': profile(
    [['b', '发音时双唇闭合、气流较轻的声母'], ['p', '发音时双唇闭合、气流较强的声母'], ['m', '发音时双唇闭合、气流从鼻腔出来的声母'], ['f', '发音时上齿轻触下唇的声母']],
    ['声母', '韵母'], [['b', 0], ['m', 0], ['a', 1], ['o', 1]],
    ['看清声母字形', '读准声母发音', '找到相配的韵母', '合起来拼读音节'],
    { prompt: '拼读 ba 时，先读哪个部分？', options: ['声母 b', '韵母 a', '先读句号'], correct: 0, explanation: '拼读音节时，先认清声母，再和韵母合起来读。' },
  ),
  'pinyin-finals': profile(
    [['ai', '由 a 和 i 组成的复韵母'], ['an', '以 n 收尾的前鼻韵母'], ['ang', '以 ng 收尾的后鼻韵母'], ['zhi', '可以直接认读的整体认读音节']],
    ['韵母', '整体认读音节'], [['ai', 0], ['an', 0], ['ang', 0], ['zhi', 1]],
    ['看清音节中的字母', '按顺序读出字母音', '把声调标在正确位置', '连起来读完整音节'],
    { prompt: '看到音节 zhi，应该怎样读？', options: ['作为整体认读音节直接认读', '拆成声母 z 和韵母 hi 再拼', '只读最后一个字母'], correct: 0, explanation: 'zhi 属于整体认读音节，直接整体认读。' },
  ),
  'g1-seasons': profile(
    [['春风', '春天吹来的风'], ['夏雨', '夏天常见的雨'], ['秋叶', '秋天树上的叶子'], ['冬雪', '冬天可能出现的雪']],
    ['天气现象', '植物或自然景物'], [['春风', 0], ['夏雨', 0], ['秋叶', 1], ['冬雪', 0]],
    ['看看当天的天气', '观察周围景物', '记下看到的变化', '用季节词说一说'],
    { prompt: '想比较同一棵树在春天和秋天的变化，怎样做？', options: ['在不同时间观察并记录叶子的变化', '只看一片叶子就判断全年', '把树叶的颜色猜出来'], correct: 0, explanation: '在不同时间观察并记录，才能比较变化。' },
  ),
  'g1-daily': profile(
    [['日', '太阳或白天'], ['月', '夜空中常见的月亮'], ['水', '可以流动的水'], ['火', '能发光发热的火']],
    ['自然事物', '生活用具'], [['日', 0], ['月', 0], ['水', 0], ['水杯', 1]],
    ['看一看字形', '想一想字义', '把字和事物连起来', '在生活中找一找'],
    { prompt: '在校园里看见一个不认识的字，怎么做更合适？', options: ['请教老师或查识字卡，再试着认读', '随便猜一个意思', '把它和相似的字当成同一个字'], correct: 0, explanation: '借助老师或识字卡核对，能减少认错字。' },
  ),
  'g1-animals': profile(
    [['影子', '物体挡住光后，在另一边形成的暗影'], ['长（cháng）', '从一端到另一端的距离较大'], ['短', '从一端到另一端的距离较小'], ['尾巴', '动物身体后部的一部分']],
    ['影子观察', '动物特点'], [['影子', 0], ['长', 1], ['短', 1], ['尾巴', 1]],
    ['观察光和物体的位置', '找到影子在哪里', '比较动物尾巴的长短', '用合适的词说出发现'],
    { prompt: '比较两只动物尾巴的长短，哪种说法最清楚？', options: ['先指出比较的是尾巴，再说哪条长或短', '只说它们不一样', '不看尾巴就猜'], correct: 0, explanation: '说清比较对象和长短，别人才能明白观察结果。' },
  ),
  'g1-animal-campus': profile(
    [['操场', '学校里做操或活动的场地'], ['同学', '一起学习的伙伴'], ['小鸟', '一种有羽毛的动物'], ['树', '有树干和树枝的植物']],
    ['校园生活', '动植物'], [['操场', 0], ['同学', 0], ['小鸟', 1], ['树', 1]],
    ['找到校园里的活动场地', '看看同学在做什么', '留意周围的小鸟或树', '用学过的词语说发现'],
    { prompt: '在操场边观察小鸟，哪种做法合适？', options: ['安静地在稍远处观察，不追赶小鸟', '跑过去抓住小鸟', '大声喊叫把小鸟吓走'], correct: 0, explanation: '安静观察、不追赶小鸟，既能看清也能保护小动物。' },
  ),
  'g1-growth': profile(
    [['大', '比同类事物更大的样子'], ['小', '比同类事物更小的样子'], ['远', '距离较长'], ['近', '距离较短']],
    ['大小比较', '远近比较'], [['大', 0], ['小', 0], ['远', 1], ['近', 1]],
    ['先说比较的对象', '找出相同的地方', '比较大小或远近', '把结果说完整'],
    { prompt: '两个物体大小不同，怎样比较才公平？', options: ['把两个物体放在一起，用同一个标准观察', '一个看近处，一个看远处', '只说自己喜欢哪个'], correct: 0, explanation: '用相同标准比较，结果才清楚。' },
  ),
  'g1-nature-story': profile(
    [['月亮', '夜空中常见的自然景物'], ['星星', '夜空中看起来亮亮的小点'], ['想象', '根据熟悉的事物想到新内容'], ['故事', '按先后顺序讲一件事情']],
    ['自然景物', '故事表达'], [['月亮', 0], ['星星', 0], ['想象', 1], ['故事', 1]],
    ['观察夜空或自然景物', '说说看到的样子', '想象一种有趣的变化', '把想法讲成小故事'],
    { prompt: '看到月亮像一只小船，怎样把这个想法说清楚？', options: ['先说月亮像什么，再讲一讲自己想到的画面', '只说“很有趣”不解释', '把月亮说成白天的太阳'], correct: 0, explanation: '把观察到的事物和想到的画面联系起来，想象更清楚。' },
  ),
  'g1-animal-story': profile(
    [['动物', '有生命、会活动的一类事物'], ['线索', '帮助我们理解故事的信息'], ['因为', '说明事情原因时常用的词'], ['所以', '说明事情结果时常用的词']],
    ['故事信息', '表示原因或结果'], [['动物', 0], ['线索', 0], ['因为', 1], ['所以', 1]],
    ['找到故事里的动物', '看看它做了什么', '想一想事情的原因', '说出后来发生的结果'],
    { prompt: '故事里的小动物做了一件事，后来出现了结果。怎样说明前后关系？', options: ['先说小动物做了什么，再说后来发生的结果', '只说结果，不提前面发生的事', '不看故事线索，随便猜原因'], correct: 0, explanation: '联系动物的做法和后来的结果，才能把故事关系说清楚。' },
  ),
  'g1-family': profile(
    [['家', '家人一起生活的地方'], ['爸', '对父亲的亲切称呼'], ['妈', '对母亲的亲切称呼'], ['愿望', '希望实现的想法']],
    ['家庭成员称呼', '家庭生活或愿望'], [['爸', 0], ['妈', 0], ['家', 1], ['愿望', 1]],
    ['想一想要介绍谁或说什么愿望', '选一个合适的称呼或愿望词', '说出共同经历或自己的希望', '听听对方的回应'],
    { prompt: '想介绍家人，哪句话更完整？', options: ['这是我的家人，我们常一起散步。', '这是一个，不知道是什么。', '我不说是谁，请你猜。'], correct: 0, explanation: '说出人物关系和一件具体事情，介绍更完整。' },
  ),
  'g1-friends': profile(
    [['同', '一起或相同'], ['学', '学习或学会'], ['玩', '进行有趣的活动'], ['让', '给别人留出机会']],
    ['友好相处', '游戏活动'], [['同学', 0], ['让一让', 0], ['玩耍', 1], ['游戏', 1]],
    ['听清游戏规则', '轮流参加活动', '遇到分歧先商量', '结束后一起整理'],
    { prompt: '两位同学都想先玩同一个玩具，怎样解决？', options: ['商量轮流玩，并约好顺序', '谁声音大就一直玩', '把玩具藏起来'], correct: 0, explanation: '商量和轮流能让伙伴都有机会。' },
  ),
  'g1-festival': profile(
    [['夜', '天黑以后的一段时间'], ['节', '有特别意义的日子'], ['粽子', '端午节常见的一种食物'], ['月', '夜空中常见的月亮']],
    ['时间或节日', '节日食物或景物'], [['夜', 0], ['节', 0], ['粽子', 1], ['月', 1]],
    ['了解节日名称', '观察节日里的事物', '听家人介绍习俗', '用自己的话分享'],
    { prompt: '想介绍一个节日习俗，哪种做法更尊重事实？', options: ['先问家人或查可靠资料，再说明自己知道的内容', '把听来的所有说法都当成事实', '只凭想象说一定如此'], correct: 0, explanation: '向家人了解并核对资料，介绍会更准确。' },
  ),
  'g1-pond': profile(
    [['池', '蓄水的地方'], ['荷', '常在池塘生长的植物'], ['雨', '从云中落下的水滴'], ['晴', '天空少云、阳光较多的天气']],
    ['池塘事物', '天气词'], [['池', 0], ['荷', 0], ['雨', 1], ['晴', 1]],
    ['先看池塘和天气', '记下水面或植物的样子', '过一会儿再观察', '比较前后的记录'],
    { prompt: '想知道雨后池塘边有什么变化，最合适的办法是什么？', options: ['雨前雨后各观察一次并记下变化', '只在晴天猜一猜', '把昨天的记录当作今天的观察'], correct: 0, explanation: '对照雨前雨后的观察记录，才能发现变化。' },
  ),
  'g1-habits': profile(
    [['文具', '学习时会用到的用品'], ['整理', '把物品放回合适的位置'], ['分钟', '表示较短时间的单位'], ['先后', '事情发生的顺序']],
    ['物品管理', '时间信息'], [['文具', 0], ['整理', 0], ['分钟', 1], ['先后', 1]],
    ['看清今天要做的事', '按顺序完成一件小事', '把物品放回原处', '检查有没有遗漏'],
    { prompt: '要减少忘带文具的情况，哪种办法更有帮助？', options: ['放学前对照清单检查书包', '把文具随手放在不同地方', '第二天到了学校再想'], correct: 0, explanation: '对照清单检查，能帮助养成整理习惯。' },
  ),
  'g3-school': profile(
    [['阅读', '读懂文字并思考意思'], ['交流', '把自己的想法说给别人听'], ['标点', '帮助表达停顿和语气的符号'], ['段落', '围绕内容组成的一组句子']],
    ['阅读方法', '表达形式'], [['阅读', 0], ['交流', 0], ['标点', 1], ['段落', 1]],
    ['读一遍文章', '圈出不明白的地方', '联系上下文想一想', '用完整句子交流发现'],
    { prompt: '读一段话时遇到不熟悉的词，怎样做更有帮助？', options: ['联系前后句和熟悉的词语推想，再核对', '不看上下文就随意确定意思', '跳过整段不再读'], correct: 0, explanation: '联系上下文推想，再核对，能帮助理解新词。' },
  ),
  'g3-autumn': profile(
    [['金黄', '像成熟稻谷或落叶的颜色'], ['凉爽', '温度较舒适、不炎热'], ['观察', '有目的地看并留意细节'], ['记录', '把看到或想到的内容写下来']],
    ['景物特点', '观察方法'], [['金黄', 0], ['凉爽', 0], ['观察', 1], ['记录', 1]],
    ['确定观察地点', '按顺序看看周围景物', '记下颜色和变化', '整理词语并交流'],
    { prompt: '比较校园里两棵树的秋叶，哪条记录最有用？', options: ['写明树的位置、叶子颜色和观察日期', '只写“很漂亮”', '把别处的照片当成本次观察'], correct: 0, explanation: '具体记录地点、特征和日期，方便比较。' },
  ),
  'g3-fairy': profile(
    [['角色', '故事里的人物或动物'], ['情节', '故事中事情发展的经过'], ['想象', '根据已知事物展开新的设想'], ['结尾', '故事最后的部分']],
    ['故事要素', '想象活动'], [['角色', 0], ['情节', 0], ['结尾', 0], ['想象', 1]],
    ['认识故事角色', '发现角色遇到的问题', '看看角色怎样行动', '说说故事结果'],
    { prompt: '续编童话时想让情节容易听懂，应该怎样做？', options: ['让新发生的事和前面的角色、问题有关', '突然换成毫无关系的话题', '只重复故事标题'], correct: 0, explanation: '续编内容和前文有联系，故事听起来更连贯。' },
  ),
  'g3-prediction': profile(
    [['题目', '文章或故事的名称'], ['线索', '帮助理解或判断的信息'], ['预测', '根据线索猜想接下来可能发生什么'], ['核对', '回到内容中检查想法是否合适']],
    ['阅读线索', '阅读方法'], [['题目', 0], ['线索', 0], ['预测', 1], ['核对', 1]],
    ['先读题目和开头', '找出人物和事情线索', '说出接下来可能发生什么', '继续阅读并核对预测'],
    { prompt: '预测和故事后文不一样时，怎样做？', options: ['读下去，找新线索并调整预测', '不读后文，坚持原来的想法', '把故事内容改成自己的预测'], correct: 0, explanation: '预测是根据线索作出的猜想，可以随着新线索调整。' },
  ),
  'g3-observation': profile(
    [['变化', '和原来不一样的地方'], ['顺序', '事情发生的先后'], ['细节', '事物具体的小特点'], ['证据', '能够支持判断的信息']],
    ['观察内容', '推理依据'], [['变化', 0], ['细节', 0], ['顺序', 0], ['证据', 1]],
    ['确定同一个观察对象', '按时间留意细节', '写下变化和条件', '比较记录后说发现'],
    commonObservation,
  ),
  'g3-landscape': profile(
    [['山峰', '山上较高的部分'], ['河流', '有水流动的自然水道'], ['远处', '离观察位置较远的地方'], ['近处', '离观察位置较近的地方']],
    ['自然景物', '观察方位'], [['山峰', 0], ['河流', 0], ['远处', 1], ['近处', 1]],
    ['先确定自己站的位置', '从近处看到远处', '找出景物特点', '按观察顺序介绍'],
    { prompt: '介绍一幅山水图，怎样安排内容更清楚？', options: ['按从近到远或从上到下的顺序介绍', '景物想到哪个就说哪个', '不说明景物在哪里'], correct: 0, explanation: '按一个清楚的观察顺序介绍，听者更容易想象画面。' },
  ),
  'g3-nature': profile(
    [['声音', '人、动物或自然事物发出的声响'], ['发现', '通过观察或思考得到的新认识'], ['轻声', '较小的声音'], ['变化', '事物和原来出现不同']],
    ['听觉线索', '观察结果'], [['声音', 0], ['轻声', 0], ['发现', 1], ['变化', 1]],
    ['选一个安全的观察地点', '安静听一听周围声音', '记下声音和时间', '比较不同时间的发现'],
    { prompt: '想比较早晨和傍晚的鸟鸣，怎样记录更可靠？', options: ['在相近地点分别记录时间和听到的声音', '只记下自己喜欢的那一次', '把没有听到的声音也补进去'], correct: 0, explanation: '记录地点、时间和实际听到的内容，比较才有依据。' },
  ),
  'g3-people': profile(
    [['帮助', '给别人支持或协助'], ['主动', '自己愿意先去做'], ['困难', '不容易解决的事情'], ['感谢', '对别人的帮助表示谢意']],
    ['人物行动或回应', '人物处境'], [['帮助', 0], ['主动', 0], ['感谢', 0], ['困难', 1]],
    ['了解人物遇到什么事', '找出人物做了什么', '想一想行动带来的结果', '用线索说明人物特点'],
    { prompt: '判断故事人物是否乐于助人，哪条线索最有用？', options: ['他主动陪遇到困难的同学找老师', '他衣服的颜色', '故事发生在星期几'], correct: 0, explanation: '人物帮助同学的行动能支持“乐于助人”的判断。' },
  ),
  'g3-spring': profile(
    [['发芽', '种子或植物长出新芽'], ['嫩叶', '刚长出、较柔软的叶子'], ['花苞', '尚未开放的花'], ['生长', '逐渐变大或发展']],
    ['植物部位', '植物变化'], [['嫩叶', 0], ['花苞', 0], ['发芽', 1], ['生长', 1]],
    ['选定一株植物', '记下起初的样子', '隔一段时间再观察', '按先后整理生长变化'],
    { prompt: '想知道一株植物怎样长高，哪种记录最有用？', options: ['在相同位置、相近时间记录高度和新叶', '只在最后一天看一次', '把另一株植物的高度记过来'], correct: 0, explanation: '持续观察同一株植物并记录条件，能看出变化。' },
  ),
  'g3-fable': profile(
    [['寓言', '借故事表达想法的一类文章'], ['行为', '人物做出的事情'], ['结果', '事情发展后出现的情况'], ['道理', '从事情中得到的认识']],
    ['故事及其内容', '读后认识'], [['行为', 0], ['结果', 0], ['寓言', 0], ['道理', 1]],
    ['读清人物做法', '找到事情结果', '比较做法和结果', '用自己的话说认识'],
    { prompt: '读寓言时想说明自己从故事中想到什么，怎样说更有根据？', options: ['先指出人物做法和结果，再说自己的认识', '只抄故事题目', '不看故事就给人物下结论'], correct: 0, explanation: '用故事中的行为和结果支持自己的认识，理由更充分。' },
  ),
  'g3-culture': profile(
    [['习俗', '人们在生活中形成的做法'], ['节日', '有特别纪念或庆祝意义的日子'], ['桥梁', '跨过河流或道路的建筑'], ['结构', '事物各部分的安排和连接方式']],
    ['传统生活', '建筑特点'], [['习俗', 0], ['节日', 0], ['桥梁', 1], ['结构', 1]],
    ['先了解对象的名称', '找出它的特点或做法', '询问资料来源', '用自己的话介绍'],
    { prompt: '介绍一种不熟悉的节日习俗，怎样做更稳妥？', options: ['查可靠资料或请教家人，并说明自己核对过', '把不同地方的习俗说成完全一样', '只凭一张图片推断所有情况'], correct: 0, explanation: '习俗可能因地区而不同，核对来源能让介绍更准确。' },
  ),
  'g3-experiment': profile(
    [['问题', '想要弄明白的事情'], ['条件', '观察或实验时需要说明的情况'], ['记录', '按过程记下观察结果'], ['结论', '根据结果作出的判断']],
    ['实验步骤', '实验信息'], [['提出问题', 0], ['记录结果', 0], ['观察条件', 1], ['结论想法', 1]],
    ['提出能观察的问题', '说明观察条件', '按步骤观察并记录', '根据记录整理结论'],
    { prompt: '两次实验结果不同，下一步怎样检查？', options: ['比较两次的条件和步骤，再补充观察', '只保留一个结果并删掉另一个', '不看记录就认定谁做错了'], correct: 0, explanation: '核对条件和步骤，能帮助解释结果为什么不同。' },
  ),
  'g3-imagination': profile(
    [['想象', '根据已有事物展开新的设想'], ['特点', '事物与其他事物不同的地方'], ['变化', '原有事物出现新的样子'], ['表达', '把想法有条理地说或写出来']],
    ['想象过程', '表达内容'], [['想象', 0], ['变化', 0], ['特点', 1], ['表达', 1]],
    ['选一个熟悉的事物', '说出它原来的特点', '想象一种新变化', '讲清变化后的作用'],
    { prompt: '想象一种新奇事物，怎样让别人听懂？', options: ['先说它像什么，再说新特点和用途', '只说“很神奇”', '把几个不相关的词放在一起'], correct: 0, explanation: '说明原有事物、新特点和用途，想象更清楚。' },
  ),
  'g3-honesty': profile(
    [['诚实', '如实说明情况，不故意隐瞒'], ['承认', '说明自己做过或发生过的事'], ['道歉', '做错事后表达歉意'], ['改正', '把不合适的做法调整好']],
    ['诚实表达', '解决办法'], [['如实说明', 0], ['承认', 0], ['道歉', 1], ['改正', 1]],
    ['先弄清发生了什么', '如实说明自己的做法', '向受影响的人道歉', '想办法改正并避免再发生'],
    { prompt: '不小心弄坏了借来的书，怎样做更合适？', options: ['告诉书的主人并一起商量修补办法', '藏起来说自己没看过', '把责任推给别人'], correct: 0, explanation: '如实说明并商量补救办法，是负责的做法。' },
  ),
  'g3-world': profile(
    [['资料', '帮助了解事物的信息'], ['特点', '事物明显或特别的地方'], ['比较', '把事物放在一起看相同和不同'], ['整理', '按一定方式归类或安排']],
    ['资料内容', '整理方法'], [['资料', 0], ['特点', 0], ['比较', 1], ['整理', 1]],
    ['提出想了解的问题', '查找相关资料或观察', '比较不同信息', '整理后分享发现'],
    { prompt: '两条资料说法不一致，怎样继续查证？', options: ['看清来源和日期，再找另一条可靠资料核对', '只选看起来有趣的一条', '把两种说法拼在一起'], correct: 0, explanation: '核对来源、时间并寻找更多证据，判断会更可靠。' },
  ),
  'g3-story': profile(
    [['开端', '故事开始交代人物或事情的部分'], ['经过', '故事中事情发展的部分'], ['转折', '故事情节出现重要变化的地方'], ['结局', '故事最后的结果']],
    ['故事顺序', '情节变化'], [['开端', 0], ['经过', 0], ['转折', 1], ['结局', 1]],
    ['交代人物和事情', '讲清事情怎样发展', '说明出现了什么变化', '说出最后的结果'],
    { prompt: '讲故事时伙伴听不出事情的转折，怎样补充？', options: ['指出转折前后的变化和原因', '只把故事标题再说一次', '把结局放到开头但不说明'], correct: 0, explanation: '说明前后的变化和原因，能让转折更清楚。' },
  ),
};

const taskTitles: Record<'basic' | 'advanced' | 'high', readonly [string, string]> = {
  basic: ['词卡发现员', '主题表达练习场'],
  advanced: ['线索连接挑战', '情境表达小助手'],
  high: ['阅读分享策划师', '主题探究讲解员'],
};

const objectives: Record<'basic' | 'advanced' | 'high', readonly [string, string]> = {
  basic: ['认读本组关键字词，并将词语与简单意思对应。', '根据熟悉情境选择合适的词语或表达顺序。'],
  advanced: ['联系词义和情境线索，判断怎样表达更准确。', '综合词语、顺序和观察信息，解释自己的选择。'],
  high: ['自主整理主题信息，安排清楚的阅读与表达步骤。', '依据线索检查表达是否完整，并说明可以怎样改进。'],
} as const;

function rotated<T>(items: readonly T[], offset: number): T[] {
  return [...items.slice(offset % items.length), ...items.slice(0, offset % items.length)];
}

function varyChoicePositions(questions: readonly ChineseQuestionSpec[], seed: number): ChineseQuestionSpec[] {
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

function createQuestions(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', taskIndex: number): ChineseQuestionSpec[] {
  const selected = profiles[entry.profileKey];
  if (!selected) throw new Error(`缺少语文题目配置：${entry.profileKey}`);
  const cards = rotated(selected.concepts, taskIndex * 2 + (difficulty === 'basic' ? 0 : difficulty === 'advanced' ? 1 : 2));
  const [first, second] = cards;
  const distractorMeanings = cards.filter((_, index) => index !== 0).map(([, meaning]) => meaning);
  const distractorWords = cards.filter((_, index) => index !== 1).map(([word]) => word);
  const sequence = taskIndex % 2 === 0
    ? selected.sequence
    : [selected.sequence[2], selected.sequence[0], selected.sequence[3], selected.sequence[1]] as const;
  const correctOrder = taskIndex % 2 === 0 ? [0, 1, 2, 3] : [1, 3, 0, 2];
  const [, , scenarioWrongB] = selected.scenario.options;
  const scenarioWrongIndex = selected.scenario.options.findIndex((_, index) => index !== selected.scenario.correct);
  const scenarioOtherWrongIndex = selected.scenario.options.findIndex((_, index) => index !== selected.scenario.correct && index !== scenarioWrongIndex);
  const scenarioRepair = taskIndex === 0
    ? choose(selected.scenario.prompt, selected.scenario.options, selected.scenario.correct, '回想本组主题和观察、表达的要求。', selected.scenario.explanation)
    : choose(`同学建议“${selected.scenario.options[scenarioWrongIndex]}”，但这可能无法解决“${selected.scenario.prompt}”中的问题。哪种做法更合适？`, [
      selected.scenario.options[selected.scenario.correct]!,
      selected.scenario.options[scenarioOtherWrongIndex]!,
      '不再看问题，也不核对任何线索。',
    ], 0, '回到问题要求，比较哪种办法能提供需要的信息。', selected.scenario.explanation);
  const classificationQuestion = taskIndex === 0
    ? sortInto(`把词语分到“${selected.categories[0]}”或“${selected.categories[1]}”一栏。`, selected.categories, selected.classified.map(([label, categoryIndex]) => [label, categoryIndex + 1] as const), '先看每个词语的意思，再按相同特点分类。', '分类时要用同一个标准检查每个词语。')
    : (() => {
      const [label, categoryIndex] = selected.classified[0]!;
      return choose(`“${label}”应放在哪一栏？`, [selected.categories[categoryIndex]!, selected.categories[1 - categoryIndex]!, '两栏都不合适'], 0, '先读懂词语，再对照两栏的分类标准。', `“${label}”符合“${selected.categories[categoryIndex]}”这一栏的标准。`);
    })();
  const expressionOrderQuestion = taskIndex === 0
    ? arrange('把主题学习卡按合适的先后顺序排好。', sequence, correctOrder, '先找开始的一步，再逐步检查后面的顺序。', `本次主题卡的顺序是：${correctOrder.map((index) => sequence[index]).join('，')}。`)
    : arrange(`向同伴介绍“${first[0]}”和“${second[0]}”，按清楚的表达步骤排列。`, [
      '先说清本组主题',
      `解释“${first[0]}”的意思`,
      `联系“${second[0]}”补充信息`,
      '检查词义和表达是否清楚',
    ], [0, 1, 2, 3], '先说明主题，再解释词语并检查表达。', `先介绍主题，再解释“${first[0]}”并联系“${second[0]}”，最后检查表达。`);
  const themeApplicationQuestion = taskIndex === 0
    ? choose('读主题词卡时，遇到不熟悉的词义，哪种办法更有帮助？', [
      '联系本单元主题和实际线索，再核对词义。',
      '只看字形猜意思。',
      '跳过不看，也不核对。',
    ], 0, '把词语放回主题情境中理解，再检查是否合适。', '联系主题和实际线索，再核对词义，有助于理解词语。')
    : choose('向伙伴介绍本组内容，怎样让意思更清楚？', [
      '先说主题，再用词卡或例子说明。',
      '只读词语，不说意思。',
      '随意替换词语的意思。',
    ], 0, '先让伙伴知道主题，再用词语或例子解释。', '先说主题并举例说明，伙伴更容易听懂本组内容。');
  const nextStep = selected.sequence[Math.min(taskIndex + 1, selected.sequence.length - 1)];
  const previousStep = selected.sequence[taskIndex]!;
  const matchPairs = taskIndex === 0
    ? cards
    : cards.map(([word, meaning]) => [meaning, word] as const);
  const firstCategory = selected.classified.find(([label]) => label === first[0])?.[1] ?? 0;
  const secondCategory = selected.classified.find(([label]) => label === second[0])?.[1] ?? 1;

  const questions: ChineseQuestionSpec[] = [
    choose(`“${first[0]}”在本组词卡中表示什么？`, [first[1], distractorMeanings[0]!, distractorMeanings[1]!], 0, '先把词语和本组主题联系起来，再读一读三个意思。', `“${first[0]}”表示“${first[1]}”。`),
    choose(`哪一个词语表示“${second[1]}”？`, [distractorWords[0]!, second[0], distractorWords[1]!], 1, '逐个读词语，再和题目中的意思核对。', `“${second[0]}”表示“${second[1]}”。`),
    pair(taskIndex === 0 ? '把词语和意思连起来。' : '根据意思找出相应的词语。', matchPairs, '先读清词语或意思，再逐个核对对应关系。', '每个词语都要和它自己的意思配对。'),
    classificationQuestion,
    expressionOrderQuestion,
    scenarioRepair,
    themeApplicationQuestion,
    difficulty === 'basic'
      ? choose(`已完成“${previousStep}”，下一步可以先做什么？`, [selected.sequence[0], nextStep, scenarioWrongB], 1, '根据学习顺序，先想想紧接着的一步。', `完成“${previousStep}”后，接下来可以${nextStep}。`)
      : difficulty === 'advanced'
        ? taskIndex === 0
          ? choose(`把“${first[0]}”用在新的${selected.categories[firstCategory]}情境中，怎样判断用得合适？`, [
            '把词语意思和实际线索一起核对。',
            scenarioWrongB,
            '不看意思和线索，只凭字形判断。',
          ], 0, '换到新情境时，词义和上下文都要对得上。', `结合“${first[0]}”的词义和情境线索核对，才能判断表达是否合适。`)
          : choose(`介绍“${first[0]}”和“${second[0]}”时，怎样比较两条信息是否准确？`, [
            `分别核对词义，再按同一标准判断它们属于哪一类。`,
            `只核对“${first[0]}”，不看“${second[0]}”。`,
            '按自己喜欢哪个来决定意思。',
          ], 0, '逐项核对词义，并使用同一个分类标准。', `先核对两个词的意思，再根据“${selected.categories[firstCategory]}”和“${selected.categories[secondCategory]}”的标准判断。`)
        : taskIndex === 0
        ? choose('想把本组内容介绍给同学，怎样说更准确也更有条理？', [
          `按“${selected.sequence[0]}、${selected.sequence[1]}”的顺序介绍，再用词义或主题线索说明依据。`,
          scenarioWrongB,
          '只说结论，不提词语或主题线索。',
        ], 0, '先安排表达顺序，再说清支持想法的线索。', '先按主题步骤组织内容，再用词义或主题线索说明依据。')
        : choose(`同伴把“${first[0]}”理解成“${second[1]}”，怎样检查并改进他的介绍？`, [
          `对照“${first[0]}”的词义“${first[1]}”，再回到主题线索核对。`,
          scenarioWrongB,
          '不检查词义，只把这句话说得更长。',
        ], 0, '先核对词语本身的意思，再检查它和主题是否相符。', `“${first[0]}”表示“${first[1]}”；回到词义和主题线索核对，能改正误解。`)
  ];
  return varyChoicePositions(questions, courseSeed(entry, difficulty, taskIndex));
}

function makeTaskSpec(entry: AddedCourseEntry, difficulty: 'basic' | 'advanced' | 'high', index: number): ChineseTaskSpec {
  const sessionTitles = taskTitles[difficulty];
  const objective = objectives[difficulty];
  const title = `${entry.title.replace(/^(第一|第二|第三|第四|第五|第六|第七|第八|第九|第十)单元 · /, '')} · ${sessionTitles[index]}`;
  return makeTask(title, objective[index], `companion-0${(index % 4) + 1}` as ChineseTaskSpec['companionId'], createQuestions(entry, difficulty, index) as unknown as Parameters<typeof makeTask>[3]);
}

export function buildAddedChineseUnit(id: string) {
  const entry = addedCourseById[id];
  if (!entry || entry.subject !== 'chinese') throw new Error(`课程目录中没有语文条目：${id}`);
  const formalUnitNumber = entry.formalUnitNumber;
  const tasks = (difficulty: 'basic' | 'advanced' | 'high') => [makeTaskSpec(entry, difficulty, 0), makeTaskSpec(entry, difficulty, 1)] as const;
  return buildChineseUnit({
    grade: entry.grade,
    term: entry.term,
    formalUnitNumber,
    entryId: entry.slug,
    type: entry.type,
    title: entry.title,
    sourceTopics: entry.sourceTopics,
    basicTasks: tasks('basic'),
    advancedTasks: tasks('advanced'),
    highTasks: tasks('high'),
  });
}
