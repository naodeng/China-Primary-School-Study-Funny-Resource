import { describe, expect, it } from 'vitest';
import { curriculum } from '../../curriculum';
import { addedCourseCatalog } from '../catalog';

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
    unitId: 'grade-1/term-1/english/unit-02',
    matchedWords: ['eye', 'ear', 'nose', 'mouth'],
    categories: ['看或听的部位', '其他面部部位'],
    classificationGroups: [['eye', 'ear'], ['nose', 'mouth']],
    orderedSentences: ['Touch your nose.', 'This is my eye.'],
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
    unitId: 'grade-1/term-1/english/unit-05',
    matchedWords: ['red', 'blue', 'yellow', 'green'],
    categories: ['红色或黄色', '蓝色或绿色'],
    classificationGroups: [['red', 'yellow'], ['blue', 'green']],
    orderedSentences: ['What colour is it?', "It's blue."],
  },
  {
    unitId: 'grade-1/term-1/english/unit-06',
    matchedWords: ['apple', 'pear', 'banana', 'orange'],
    categories: ['苹果', '其他水果'],
    classificationGroups: [['apple'], ['pear', 'banana', 'orange']],
    orderedSentences: ['I like bananas.', 'What fruit do you like?'],
  },
  {
    unitId: 'grade-1/term-1/english/review-01',
    matchedWords: ['teacher', 'eye', 'cat', 'book'],
    categories: ['人物或动物', '身体或学习用品'],
    classificationGroups: [['teacher', 'cat'], ['eye', 'book']],
    orderedSentences: ['It is a cat.', 'Touch your eye.'],
  },
  {
    unitId: 'grade-1/term-1/english/review-02',
    matchedWords: ['one', 'red', 'apple', 'three'],
    categories: ['数词', '颜色或水果'],
    classificationGroups: [['one', 'three'], ['red', 'apple']],
    orderedSentences: ['I have three apples.', 'The apple is red.'],
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
    orderedSentences: ['Do you like noodles?', 'Yes, I do.'],
  },
  {
    unitId: 'grade-1/term-2/english/unit-05',
    matchedWords: ['water', 'juice', 'milk', 'tea'],
    categories: ['饮品词语', '礼貌请求句'],
    classificationGroups: [['water', 'juice', 'milk', 'tea'], ['Can I have water?', 'Can I have tea?']],
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
    unitId: 'grade-3/term-1/english/unit-02',
    matchedWords: ['head', 'hand', 'leg', 'foot'],
    categories: ['上半身', '下半身'],
    classificationGroups: [['head', 'hand'], ['leg', 'foot']],
    orderedSentences: ['Raise your hand.', 'This is my foot.'],
  },
  {
    unitId: 'grade-3/term-1/english/unit-03',
    matchedWords: ['bread', 'cake', 'potato', 'tomato'],
    categories: ['食物', '饮品'],
    classificationGroups: [['bread', 'cake', 'fruit', 'ice cream', 'potato', 'tomato', 'meat', 'rice', 'noodles', 'vegetables', 'fish', 'chicken', 'egg'], ['cola']],
    orderedSentences: ['I want bread.', 'I want cake.'],
  },
  {
    unitId: 'grade-3/term-1/english/unit-04',
    matchedWords: ['rabbit', 'duck', 'turtle', 'pet'],
    categories: ['类别词', '具体动物名称'],
    classificationGroups: [['pet'], ['rabbit', 'duck', 'turtle']],
    orderedSentences: ['I have a pet.', 'Give it clean water.'],
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
    unitId: 'grade-3/term-1/english/review-01',
    matchedWords: ['name', 'hand', 'rice', 'age'],
    categories: ['自我或身体信息', '食物'],
    classificationGroups: [['name', 'age', 'hand'], ['rice']],
    orderedSentences: ['What is your name?', 'Raise your hand.'],
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

function answerSignature(activity: ReturnType<typeof activitiesFor>[number]): string {
  if (activity.kind === 'choice') {
    const correct = activity.options.find(({ id }) => id === activity.correctOptionId)?.label;
    return JSON.stringify([activity.kind, [...activity.options.map(({ label }) => label)].sort(), correct]);
  }
  if (activity.kind === 'match') {
    return JSON.stringify([activity.kind, activity.pairs.map(({ left, right }) => [left, right])
      .sort(([left], [right]) => left.localeCompare(right))]);
  }
  if (activity.kind === 'order') {
    const labelById = new Map(activity.items.map(({ id, label }) => [id, label]));
    return JSON.stringify([activity.kind, activity.correctOrder.map((id) => labelById.get(id))]);
  }
  if (activity.kind === 'categorize') {
    const categoryById = new Map(activity.categories.map(({ id, label }) => [id, label]));
    return JSON.stringify([activity.kind, activity.items.map(({ label, categoryId }) => [label, categoryById.get(categoryId)] as const)
      .sort((left, right) => left[0].localeCompare(right[0]))]);
  }
  return JSON.stringify(activity);
}

function semanticAnswerSignature(activity: ReturnType<typeof activitiesFor>[number]): string {
  return JSON.stringify([answerSignature(activity), activity.explanation]);
}

function questionFingerprint(activity: ReturnType<typeof activitiesFor>[number]): string {
  return JSON.stringify([activity.prompt, activity.hint, activity.explanation, answerSignature(activity)]);
}

const maxClassificationItemsPerActivity = 8;

describe('added English vocabulary and textbook alignment', () => {
  it('has an alignment fixture for every added English course entry', () => {
    const expectedIds = addedCourseCatalog.filter(({ subject }) => subject === 'english').map(({ id }) => id).sort();
    expect(alignmentCases.map(({ unitId }) => unitId).sort()).toEqual(expectedIds);
  });

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
        const isFoodSubcategorySort = alignment.unitId === 'grade-3/term-1/english/unit-03'
          && activity.items.some(({ label }) => label === 'fruit')
          && activity.items.every(({ label }) => expectedCategoryByWord[label] === 0);
        expect(activity.categories.map(({ label }) => label)).toEqual(isFoodSubcategorySort
          ? ['水果', '其他食物']
          : alignment.categories);
        const categoryIndexById = new Map(activity.categories.map(({ id }, index) => [id, index] as const));
        return activity.items.map(({ label, categoryId }) => [label,
          isFoodSubcategorySort ? 0 : categoryIndexById.get(categoryId)] as const);
      });
      expect(new Set(classifiedEntries.map(([label]) => label)).size).toBe(classifiedEntries.length);
      expect(Object.fromEntries(classifiedEntries.sort(([left], [right]) => left.localeCompare(right))))
        .toEqual(expectedCategoryByWord);
    });

    const matchingActivities = activities.filter((activity) => activity.kind === 'match');
    expect(matchingActivities).toHaveLength(2);
    matchingActivities.forEach((activity) => {
      if (activity.kind !== 'match') return;
      const matchedEnglishWords = new Set(activity.pairs.flatMap(({ left, right }) => [left, right])
        .filter((term) => /^[\x00-\x7F]+$/.test(term)));
      expect(matchedEnglishWords).toEqual(new Set(alignment.matchedWords));
    });

    const orderedSentences = activities.filter((activity) => activity.kind === 'order').map((activity) => {
      if (activity.kind !== 'order') return '';
      return activity.correctOrder.map((id) => activity.items.find((item) => item.id === id)?.label ?? '')
        .join(' ')
        .replace(/ ([?.!,])/g, '$1');
    });
    expect(new Set(orderedSentences)).toEqual(new Set(alignment.orderedSentences));
  });

  it('meaningfully differentiates the two tasks and three difficulty tracks', () => {
    for (const entry of addedCourseCatalog.filter(({ subject }) => subject === 'english')) {
      const unit = curriculum.units[entry.id];
      expect(unit, `Missing English curriculum unit ${entry.id}`).toBeDefined();
      if (!unit) continue;

      const taskObjectives = Object.values(unit.difficultyTracks).flatMap(({ tasks }) => tasks.map(({ objective }) => objective));
      expect(new Set(taskObjectives).size, `${entry.id} repeats task objectives`).toBe(taskObjectives.length);

      const tracks = unit.difficultyTracks;
      for (let taskIndex = 0; taskIndex < 2; taskIndex += 1) {
        for (const [leftName, rightName] of [['basic', 'advanced'], ['basic', 'high'], ['advanced', 'high']] as const) {
          const left = tracks[leftName].tasks[taskIndex]?.sessions[0]?.activities ?? [];
          const right = tracks[rightName].tasks[taskIndex]?.sessions[0]?.activities ?? [];
          const distinctSlots = left.reduce((count, activity, index) =>
            count + (questionFingerprint(activity) === questionFingerprint(right[index]!) ? 0 : 1), 0);
          expect(distinctSlots, `${entry.id} task ${taskIndex + 1} ${leftName}/${rightName} only differs in ${distinctSlots}/8 question prompts`)
            .toBeGreaterThanOrEqual(4);
        }
      }
    }
  });

  it('does not repeat an identical answer pattern within an English task', () => {
    for (const entry of addedCourseCatalog.filter(({ subject }) => subject === 'english')) {
      const unit = curriculum.units[entry.id];
      expect(unit, `Missing English curriculum unit ${entry.id}`).toBeDefined();
      if (!unit) continue;

      for (const [difficulty, track] of Object.entries(unit.difficultyTracks)) {
        for (const [taskIndex, task] of track.tasks.entries()) {
          const activities = task.sessions[0]?.activities ?? [];
          expect(activities.length, `${entry.id} ${difficulty} task ${taskIndex + 1}`).toBe(8);
          const signatures = activities.map(answerSignature);
          expect(new Set(signatures).size, `${entry.id} ${difficulty} task ${taskIndex + 1} repeats an answer pattern`)
            .toBe(signatures.length);
        }
      }
    }
  });

  it('does not reuse the same answer target and explanation in a sibling task', () => {
    const failures: string[] = [];
    for (const entry of addedCourseCatalog.filter(({ subject }) => subject === 'english')) {
      const unit = curriculum.units[entry.id];
      expect(unit, `Missing English curriculum unit ${entry.id}`).toBeDefined();
      if (!unit) continue;

      for (const [difficulty, track] of Object.entries(unit.difficultyTracks)) {
        const [firstTask, secondTask] = track.tasks;
        const first = firstTask?.sessions.flatMap(({ activities }) => activities) ?? [];
        const second = secondTask?.sessions.flatMap(({ activities }) => activities) ?? [];
        const firstTargets = new Set(first.map(semanticAnswerSignature));
        second.forEach((activity, index) => {
          if (firstTargets.has(semanticAnswerSignature(activity))) {
            failures.push(`${entry.id} ${difficulty} q${index + 1}`);
          }
        });
      }
    }
    expect(failures).toEqual([]);
  });

  it('checks three opening-unit English targets with textbook-fit expressions', () => {
    const school = curriculum.units['grade-1/term-1/english/unit-01'];
    const classroom = curriculum.units['grade-1/term-2/english/unit-01'];
    expect(school).toBeDefined();
    expect(classroom).toBeDefined();
    if (!school || !classroom) return;

    const textOf = (unit: typeof school) => Object.values(unit.difficultyTracks).flatMap(({ tasks }) => tasks)
      .flatMap(({ sessions }) => sessions).flatMap(({ activities }) => activities)
      .flatMap((activity) => [activity.prompt, activity.explanation,
        ...(activity.kind === 'choice' ? activity.options.map(({ label }) => label) : [])]).join('\n');
    const schoolText = textOf(school);
    const classroomText = textOf(classroom);
    expect(schoolText).toMatch(/Good morning/);
    expect(schoolText).toMatch(/Good afternoon/);
    expect(schoolText).toMatch(/Bye|Goodbye/);
    expect(classroomText).toMatch(/under/);
    expect(classroomText).toMatch(/on/);
    expect(classroomText).toMatch(/in/);
  });

  it('covers the first grade-one English unit classroom commands without unrelated phrases', () => {
    const school = curriculum.units['grade-1/term-1/english/unit-01'];
    expect(school).toBeDefined();
    if (!school) return;

    const text = activitiesFor('grade-1/term-1/english/unit-01').flatMap((activity) => [activity.prompt, activity.hint, activity.explanation,
      ...(activity.kind === 'choice' ? activity.options.map(({ label }) => label) : [])]).join('\n');
    for (const phrase of ['Stand up.', 'Show me your pencil.', 'Sit down, please.', 'Close your eyes.', 'Open your eyes.', "What’s missing?", 'Good morning!', 'Good afternoon!', 'Bye!']) {
      expect(text).toContain(phrase);
    }
    expect(text).not.toContain('Thank you!');
  });

  it('gives every English classification question a non-empty group', () => {
    for (const entry of addedCourseCatalog.filter(({ subject }) => subject === 'english')) {
      for (const activity of activitiesFor(entry.id).filter((question) => question.kind === 'categorize')) {
        if (activity.kind !== 'categorize') continue;
        const counts = activity.categories.map(({ id }) => activity.items.filter(({ categoryId }) => categoryId === id).length);
        expect(counts.every((count) => count > 0), `${entry.id} ${activity.id}`).toBe(true);
      }
    }
  });

  it('uses inference in high-tier word reasoning while advanced checks two mappings', () => {
    const unit = curriculum.units['grade-3/term-1/english/unit-01'];
    expect(unit).toBeDefined();
    if (!unit) return;

    for (const taskIndex of [0, 1]) {
      const advanced = unit.difficultyTracks.advanced.tasks[taskIndex]?.sessions[0]?.activities[2];
      const high = unit.difficultyTracks.high.tasks[taskIndex]?.sessions[0]?.activities[2];
      expect(advanced?.kind).toBe('choice');
      expect(high?.kind).toBe('choice');
      if (advanced?.kind !== 'choice' || high?.kind !== 'choice') continue;
      expect(advanced.prompt).toContain('两张词卡');
      expect(high.prompt).toContain('已知');
      expect(high.prompt).toContain('应对应哪个意思');
      expect(high.prompt).not.toBe(advanced.prompt);
    }
  });

  it('uses both groups in each Food classification chunk', () => {
    const classifications = activitiesFor('grade-3/term-1/english/unit-03')
      .filter((activity) => activity.kind === 'categorize');
    expect(classifications.length).toBeGreaterThan(0);
    for (const activity of classifications) {
      if (activity.kind !== 'categorize') continue;
      const counts = activity.categories.map(({ id }) => activity.items.filter(({ categoryId }) => categoryId === id).length);
      expect(counts.every((count) => count > 0)).toBe(true);
    }
  });

  it('uses natural affirmative replies and classifies drinks by learning purpose', () => {
    const foodActivities = activitiesFor('grade-1/term-2/english/unit-04');
    const orderedReplies = foodActivities.filter((activity) => activity.kind === 'order').map((activity) => {
      if (activity.kind !== 'order') return '';
      return activity.correctOrder.map((id) => activity.items.find((item) => item.id === id)?.label ?? '').join(' ')
        .replace(/ ([?.!,])/g, '$1');
    });
    expect(orderedReplies).toContain('Yes, I do.');

    const drinkActivities = activitiesFor('grade-1/term-2/english/unit-05');
    const categories = drinkActivities.filter((activity) => activity.kind === 'categorize');
    expect(categories.length).toBeGreaterThan(0);
    const grouped = categories.flatMap((activity) => activity.kind === 'categorize'
      ? activity.items.map(({ label, categoryId }) => [label, activity.categories.find(({ id }) => id === categoryId)?.label] as const)
      : []);
    expect(Object.fromEntries(grouped)).toEqual({
      'water': '饮品词语', 'juice': '饮品词语', 'milk': '饮品词语', 'tea': '饮品词语',
      'Can I have water?': '礼貌请求句', 'Can I have tea?': '礼貌请求句',
    });
  });
});
