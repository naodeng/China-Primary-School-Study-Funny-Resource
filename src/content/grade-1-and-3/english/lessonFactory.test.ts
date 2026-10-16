import { describe, expect, it } from 'vitest';
import { curriculum } from '../../curriculum';

interface EnglishAlignmentCase {
  unitId: string;
  matchedWords: readonly string[];
  categories: readonly [string, string];
  classificationGroups: readonly [readonly string[], readonly string[]];
  orderedSentences: readonly string[];
}

const alignmentCases: readonly EnglishAlignmentCase[] = [
  {
    unitId: 'grade-1/term-1/english/unit-01',
    matchedWords: ['book', 'ruler', 'pencil', 'schoolbag'],
    categories: ['课堂人物', '学习用品'],
    classificationGroups: [['teacher'], ['book', 'ruler', 'pencil', 'schoolbag']],
    orderedSentences: ['I have a ruler.', 'I have a schoolbag.'],
  },
  {
    unitId: 'grade-1/term-1/english/unit-03',
    matchedWords: ['cat', 'dog', 'bird', 'tiger'],
    categories: ['鸟类', '其他动物'],
    classificationGroups: [['bird'], ['cat', 'dog', 'tiger', 'monkey']],
    orderedSentences: ['I like cats.', 'It is a dog.'],
  },
  {
    unitId: 'grade-1/term-1/english/unit-04',
    matchedWords: ['one', 'two', 'three', 'four'],
    categories: ['one to five', 'six to ten'],
    classificationGroups: [['one', 'two', 'three', 'four', 'five'], ['six', 'seven', 'eight', 'nine', 'ten']],
    orderedSentences: ['How many books?', 'I have three books.'],
  },
  {
    unitId: 'grade-1/term-2/english/unit-01',
    matchedWords: ['chair', 'desk', 'blackboard', 'under'],
    categories: ['教室物品', '位置词'],
    classificationGroups: [['chair', 'desk', 'blackboard'], ['on', 'under', 'in']],
    orderedSentences: ['The chair is under the desk.', 'Where is the desk?'],
  },
  {
    unitId: 'grade-1/term-2/english/unit-02',
    matchedWords: ['light', 'bed', 'door', 'box'],
    categories: ['房间物品', '位置词'],
    classificationGroups: [['light', 'bed', 'door', 'box'], ['near', 'behind']],
    orderedSentences: ['The box is near the bed.', 'The box is behind the door.'],
  },
  {
    unitId: 'grade-1/term-2/english/unit-03',
    matchedWords: ['ball', 'doll', 'train', 'plane'],
    categories: ['球、玩偶或动物玩具', '交通工具玩具'],
    classificationGroups: [['ball', 'doll', 'bear'], ['train', 'car', 'plane']],
    orderedSentences: ['This is a ball.', 'It is a plane.'],
  },
  {
    unitId: 'grade-1/term-2/english/unit-04',
    matchedWords: ['rice', 'noodles', 'chicken', 'egg'],
    categories: ['米饭或面条', '其他食物'],
    classificationGroups: [['rice', 'noodles'], ['vegetable', 'fish', 'chicken', 'egg']],
    orderedSentences: ['Do you like noodles?', 'Yes, yes, I do.'],
  },
  {
    unitId: 'grade-1/term-2/english/unit-05',
    matchedWords: ['water', 'juice', 'milk', 'tea'],
    categories: ['有字母 e', '没有字母 e'],
    classificationGroups: [['water', 'juice', 'tea'], ['milk']],
    orderedSentences: ['Can I have water?', 'Can I have tea?'],
  },
  {
    unitId: 'grade-1/term-2/english/unit-06',
    matchedWords: ['shirt', 'T-shirt', 'skirt', 'dress'],
    categories: ['上衣', '其他衣物'],
    classificationGroups: [['shirt', 'T-shirt'], ['skirt', 'dress', 'socks', 'shorts']],
    orderedSentences: ['This is my shirt.', 'This is my T-shirt.'],
  },
  {
    unitId: 'grade-1/term-2/english/review-01',
    matchedWords: ['chair', 'light', 'doll', 'train'],
    categories: ['课堂或房间物品', '玩具'],
    classificationGroups: [['chair', 'desk', 'blackboard', 'light', 'bed', 'door', 'box'], ['doll', 'train', 'car', 'bear', 'plane', 'ball']],
    orderedSentences: ['This is a chair.', 'Where is the ball?'],
  },
  {
    unitId: 'grade-1/term-2/english/review-02',
    matchedWords: ['noodles', 'water', 'shirt', 'milk'],
    categories: ['食物或饮品', '衣物'],
    classificationGroups: [['rice', 'noodles', 'vegetable', 'fish', 'chicken', 'egg', 'water', 'juice', 'milk', 'tea'], ['shirt', 'T-shirt', 'skirt', 'dress', 'socks', 'shorts']],
    orderedSentences: ['I want milk.', 'This is my shirt.'],
  },
  {
    unitId: 'grade-3/term-1/english/unit-01',
    matchedWords: ['my', 'name', 'age', 'class'],
    categories: ['姓名与称呼', '年龄与班级'],
    classificationGroups: [['my', 'your', 'name', 'dear'], ['age', 'old', 'year', 'class', 'grade']],
    orderedSentences: ['My name is Amy.', 'How old are you?'],
  },
  {
    unitId: 'grade-3/term-1/english/unit-03',
    matchedWords: ['bread', 'cake', 'potato', 'tomato'],
    categories: ['食物', '饮品'],
    classificationGroups: [['bread', 'cake', 'fruit', 'ice cream', 'potato', 'tomato', 'meat', 'rice', 'noodles', 'vegetables', 'fish', 'chicken', 'egg'], ['cola']],
    orderedSentences: ['I want bread.', 'I want cake.'],
  },
  {
    unitId: 'grade-3/term-1/english/unit-05',
    matchedWords: ['sweater', 'jacket', 'cap', 'shoes'],
    categories: ['上身、头部或手部衣物', '下身衣物和鞋'],
    classificationGroups: [['cap', 'coat', 'sweater', 'jacket', 'gloves'], ['shoes', 'trousers']],
    orderedSentences: ['This is my jacket.', 'I have a cap.'],
  },
  {
    unitId: 'grade-3/term-1/english/unit-06',
    matchedWords: ['January', 'June', 'July', 'December'],
    categories: ['一月至六月', '七月至十二月'],
    classificationGroups: [['January', 'February', 'March', 'April', 'May', 'June'], ['July', 'August', 'September', 'October', 'November', 'December']],
    orderedSentences: ['Which month comes after January?', 'My birthday is in June.'],
  },
  {
    unitId: 'grade-3/term-1/english/review-02',
    matchedWords: ['rabbit', 'jacket', 'January', 'June'],
    categories: ['动物或衣物', '月份'],
    classificationGroups: [['rabbit', 'duck', 'turtle', 'cap', 'coat', 'shoes', 'sweater', 'jacket', 'gloves', 'trousers'], ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']],
    orderedSentences: ['I have a rabbit.', 'My birthday is in June.'],
  },
  {
    unitId: 'grade-3/term-2/english/unit-01',
    matchedWords: ['English', 'maths', 'music', 'art'],
    categories: ['语言课', '其他课程'],
    classificationGroups: [['Chinese', 'English'], ['maths', 'science', 'PE', 'music', 'art', 'computer class']],
    orderedSentences: ['I like music.', 'What subject do you like?'],
  },
  {
    unitId: 'grade-3/term-2/english/unit-02',
    matchedWords: ['toilet', 'library', 'classroom', 'playground'],
    categories: ['楼内地点或楼层', '室外活动地点'],
    classificationGroups: [['library', 'classroom', 'toilet', 'first floor', 'second floor', 'third floor'], ['playground']],
    orderedSentences: ['Where is the toilet?', 'The library is on the first floor.'],
  },
  {
    unitId: 'grade-3/term-2/english/unit-03',
    matchedWords: ['read books', 'draw pictures', 'sing songs', 'play chess'],
    categories: ['安静或桌面活动', '唱跳或运动'],
    classificationGroups: [['read books', 'draw pictures', 'play chess'], ['dance', 'sing songs', 'play sports', 'play football', 'fly a kite', 'ride a bike', 'swim']],
    orderedSentences: ['I read books after school.', 'I play chess after school.'],
  },
  {
    unitId: 'grade-3/term-2/english/unit-04',
    matchedWords: ['uncle', 'aunt', 'cousin', 'family'],
    categories: ['家庭整体称呼', '亲属称呼'],
    classificationGroups: [['family'], ['uncle', 'aunt', 'cousin']],
    orderedSentences: ['This is my aunt.', 'He is my uncle.'],
  },
  {
    unitId: 'grade-3/term-2/english/review-01',
    matchedWords: ['maths', 'toilet', 'read books', 'play chess'],
    categories: ['学科或校园地点', '课后活动'],
    classificationGroups: [['Chinese', 'English', 'maths', 'science', 'PE', 'music', 'art', 'computer class', 'classroom', 'library', 'toilet', 'playground', 'first floor', 'second floor', 'third floor'], ['read books', 'draw pictures', 'play chess', 'dance', 'sing songs', 'play sports', 'play football', 'fly a kite', 'ride a bike', 'swim']],
    orderedSentences: ['I read books after school.', 'I like maths.'],
  },
  {
    unitId: 'grade-3/term-2/english/unit-05',
    matchedWords: ['cooking dinner', 'walking the dog', 'watering the plants', 'cleaning the room'],
    categories: ['家务或照料活动', '休闲活动'],
    classificationGroups: [['cooking dinner', 'walking the dog', 'watering the plants', 'cleaning the room', 'feeding the fish'], ['listening to music', 'watching TV']],
    orderedSentences: ['She is cooking dinner.', 'He is walking the dog.'],
  },
  {
    unitId: 'grade-3/term-2/english/unit-06',
    matchedWords: ['bedroom', 'kitchen', 'dining room', 'study'],
    categories: ['家或房间名称', '家具或家中用品'],
    classificationGroups: [['home', 'bedroom', 'living room', 'bathroom', 'dining room', 'study', 'kitchen'], ['sofa', 'light', 'bed', 'door', 'box']],
    orderedSentences: ['This is the kitchen.', 'Where is the study?'],
  },
  {
    unitId: 'grade-3/term-2/english/review-02',
    matchedWords: ['aunt', 'cooking dinner', 'study', 'walking the dog'],
    categories: ['家庭与亲属称呼', '家庭活动或居家词汇'],
    classificationGroups: [['family', 'aunt', 'mother', 'sister', 'cousin', 'grandmother', 'uncle', 'father', 'brother', 'grandfather'], ['cooking dinner', 'walking the dog', 'watering the plants', 'cleaning the room', 'listening to music', 'watching TV', 'feeding the fish', 'home', 'bedroom', 'living room', 'bathroom', 'dining room', 'study', 'kitchen', 'sofa', 'light', 'bed', 'door', 'box']],
    orderedSentences: ['My aunt is cooking dinner.', 'Where is the study?'],
  },
];

function activitiesFor(unitId: string) {
  const unit = curriculum.units[unitId];
  if (!unit) throw new Error(`Missing curriculum unit: ${unitId}`);
  return Object.values(unit.difficultyTracks)
    .flatMap(({ tasks }) => tasks)
    .flatMap(({ sessions }) => sessions)
    .flatMap(({ activities }) => activities);
}

const maxClassificationItemsPerActivity = 8;

describe('added English vocabulary and textbook alignment', () => {
  it.each(alignmentCases)('$unitId uses the matching book vocabulary and phrases', (alignment) => {
    const activities = activitiesFor(alignment.unitId);
    const classifications = activities.filter((activity) => activity.kind === 'categorize');
    expect(classifications.length).toBeGreaterThan(0);
    const expectedCategoryByWord = Object.fromEntries(alignment.classificationGroups.flatMap((words, categoryIndex) =>
      words.map((word) => [word, categoryIndex] as const),
    ).sort(([left], [right]) => left.localeCompare(right)));
    const unit = curriculum.units[alignment.unitId];
    if (!unit) throw new Error(`Missing curriculum unit: ${alignment.unitId}`);
    Object.values(unit.difficultyTracks).forEach((track) => {
      const taskClassificationCounts = track.tasks.map(({ sessions }) => sessions
        .flatMap(({ activities: sessionActivities }) => sessionActivities)
        .reduce((count, activity) => count + (activity.kind === 'categorize' ? activity.items.length : 0), 0));
      if (Object.keys(expectedCategoryByWord).length > maxClassificationItemsPerActivity) {
        expect(taskClassificationCounts.every((count) => count > 0)).toBe(true);
        expect(Math.max(...taskClassificationCounts) - Math.min(...taskClassificationCounts))
          .toBeLessThanOrEqual(maxClassificationItemsPerActivity);
      }
      const trackActivities = track.tasks
        .flatMap(({ sessions }) => sessions)
        .flatMap(({ activities: sessionActivities }) => sessionActivities);
      const trackClassifications = trackActivities.filter((activity) => activity.kind === 'categorize');
      const classifiedEntries = trackClassifications.flatMap((activity) => {
        if (activity.kind !== 'categorize') return [];
        expect(activity.items.length).toBeLessThanOrEqual(maxClassificationItemsPerActivity);
        if (Object.keys(expectedCategoryByWord).length > maxClassificationItemsPerActivity) {
          expect(activity.items.length).toBeGreaterThanOrEqual(4);
        }
        expect(activity.categories.map(({ label }) => label)).toEqual(alignment.categories);
        const categoryIndexById = new Map(activity.categories.map(({ id }, index) => [id, index] as const));
        return activity.items.map(({ label, categoryId }) => [label, categoryIndexById.get(categoryId)] as const);
      });
      expect(new Set(classifiedEntries.map(([label]) => label)).size).toBe(classifiedEntries.length);
      expect(Object.fromEntries(classifiedEntries.sort(([left], [right]) => left.localeCompare(right))))
        .toEqual(expectedCategoryByWord);
    });

    const matchingActivities = activities.filter((activity) => activity.kind === 'match');
    expect(matchingActivities).toHaveLength(6);
    matchingActivities.forEach((activity) => {
      if (activity.kind !== 'match') return;
      const matchedEnglishWords = new Set(activity.pairs.flatMap(({ left, right }) => [left, right])
        .filter((term) => /^[\x00-\x7F]+$/.test(term)));
      expect(matchedEnglishWords).toEqual(new Set(alignment.matchedWords));
    });

    const orderedSentences = activities.filter((activity) =>
      activity.kind === 'order' && !activity.prompt.startsWith('Plan a short English introduction.'),
    ).map((activity) => {
      if (activity.kind !== 'order') return '';
      return activity.correctOrder.map((id) => activity.items.find((item) => item.id === id)?.label ?? '')
        .join(' ')
        .replace(/ ([?.!,])/g, '$1');
    });
    expect(new Set(orderedSentences)).toEqual(new Set(alignment.orderedSentences));
  });
});
