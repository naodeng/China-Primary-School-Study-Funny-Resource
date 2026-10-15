import { describe, expect, it } from 'vitest';
import { curriculum } from '../../curriculum';

interface EnglishAlignmentCase {
  unitId: string;
  matchedWords: readonly string[];
  classifiedWords: readonly string[];
  orderedSentences: readonly string[];
}

const alignmentCases: readonly EnglishAlignmentCase[] = [
  {
    unitId: 'grade-1/term-1/english/unit-01',
    matchedWords: ['book', 'ruler', 'pencil', 'schoolbag'],
    classifiedWords: ['teacher', 'book', 'ruler', 'pencil', 'schoolbag'],
    orderedSentences: ['I have a ruler.', 'I have a schoolbag.'],
  },
  {
    unitId: 'grade-1/term-1/english/unit-03',
    matchedWords: ['cat', 'dog', 'bird', 'tiger'],
    classifiedWords: ['cat', 'dog', 'bird', 'tiger', 'monkey'],
    orderedSentences: ['I like cats.', 'It is a dog.'],
  },
  {
    unitId: 'grade-1/term-2/english/unit-01',
    matchedWords: ['chair', 'desk', 'blackboard', 'under'],
    classifiedWords: ['chair', 'desk', 'blackboard', 'on', 'under', 'in'],
    orderedSentences: ['The chair is under the desk.', 'Where is the desk?'],
  },
  {
    unitId: 'grade-1/term-2/english/unit-02',
    matchedWords: ['light', 'bed', 'door', 'box'],
    classifiedWords: ['light', 'bed', 'door', 'box', 'near', 'behind'],
    orderedSentences: ['The box is near the bed.', 'The box is behind the door.'],
  },
  {
    unitId: 'grade-1/term-2/english/unit-03',
    matchedWords: ['ball', 'doll', 'train', 'plane'],
    classifiedWords: ['doll', 'train', 'car', 'bear', 'plane', 'ball'],
    orderedSentences: ['This is a ball.', 'It is a plane.'],
  },
  {
    unitId: 'grade-1/term-2/english/unit-04',
    matchedWords: ['rice', 'noodles', 'chicken', 'egg'],
    classifiedWords: ['rice', 'noodles', 'vegetable', 'fish', 'chicken', 'egg'],
    orderedSentences: ['Do you like noodles?', 'Yes, yes, I do.'],
  },
  {
    unitId: 'grade-1/term-2/english/unit-05',
    matchedWords: ['water', 'juice', 'milk', 'tea'],
    classifiedWords: ['water', 'juice', 'milk', 'tea'],
    orderedSentences: ['Can I have water?', 'Can I have tea?'],
  },
  {
    unitId: 'grade-1/term-2/english/unit-06',
    matchedWords: ['shirt', 'T-shirt', 'skirt', 'dress'],
    classifiedWords: ['shirt', 'T-shirt', 'skirt', 'dress', 'socks', 'shorts'],
    orderedSentences: ['This is my shirt.', 'This is my T-shirt.'],
  },
  {
    unitId: 'grade-1/term-2/english/review-01',
    matchedWords: ['chair', 'light', 'doll', 'train'],
    classifiedWords: ['chair', 'desk', 'blackboard', 'light', 'bed', 'door', 'box', 'doll', 'train', 'car', 'bear', 'plane', 'ball'],
    orderedSentences: ['This is a chair.', 'Where is the ball?'],
  },
  {
    unitId: 'grade-1/term-2/english/review-02',
    matchedWords: ['noodles', 'water', 'shirt', 'milk'],
    classifiedWords: ['rice', 'noodles', 'vegetable', 'fish', 'chicken', 'egg', 'water', 'juice', 'milk', 'tea', 'shirt', 'T-shirt', 'skirt', 'dress', 'socks', 'shorts'],
    orderedSentences: ['I want milk.', 'This is my shirt.'],
  },
  {
    unitId: 'grade-3/term-1/english/unit-01',
    matchedWords: ['my', 'name', 'age', 'class'],
    classifiedWords: ['my', 'your', 'name', 'dear', 'age', 'old', 'year', 'class', 'grade'],
    orderedSentences: ['My name is Amy.', 'How old are you?'],
  },
  {
    unitId: 'grade-3/term-1/english/unit-03',
    matchedWords: ['bread', 'cake', 'potato', 'tomato'],
    classifiedWords: ['bread', 'cake', 'fruit', 'ice cream', 'potato', 'tomato', 'meat', 'cola', 'rice', 'noodles', 'vegetables', 'fish', 'chicken', 'egg'],
    orderedSentences: ['I want bread.', 'I want cake.'],
  },
  {
    unitId: 'grade-3/term-1/english/unit-05',
    matchedWords: ['sweater', 'jacket', 'cap', 'shoes'],
    classifiedWords: ['cap', 'coat', 'shoes', 'sweater', 'jacket', 'gloves', 'trousers'],
    orderedSentences: ['This is my jacket.', 'I have a cap.'],
  },
  {
    unitId: 'grade-3/term-1/english/unit-06',
    matchedWords: ['January', 'June', 'July', 'December'],
    classifiedWords: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    orderedSentences: ['Which month comes after January?', 'My birthday is in June.'],
  },
  {
    unitId: 'grade-3/term-1/english/review-02',
    matchedWords: ['rabbit', 'jacket', 'January', 'June'],
    classifiedWords: ['rabbit', 'duck', 'turtle', 'cap', 'coat', 'shoes', 'sweater', 'jacket', 'gloves', 'trousers', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    orderedSentences: ['I have a rabbit.', 'My birthday is in June.'],
  },
  {
    unitId: 'grade-3/term-2/english/unit-01',
    matchedWords: ['English', 'maths', 'music', 'art'],
    classifiedWords: ['Chinese', 'English', 'maths', 'science', 'PE', 'music', 'art', 'computer class'],
    orderedSentences: ['I like music.', 'What subject do you like?'],
  },
  {
    unitId: 'grade-3/term-2/english/unit-02',
    matchedWords: ['toilet', 'library', 'classroom', 'playground'],
    classifiedWords: ['classroom', 'library', 'toilet', 'playground', 'first floor', 'second floor', 'third floor'],
    orderedSentences: ['Where is the toilet?', 'The library is on the first floor.'],
  },
  {
    unitId: 'grade-3/term-2/english/unit-03',
    matchedWords: ['read books', 'draw pictures', 'sing songs', 'play chess'],
    classifiedWords: ['read books', 'draw pictures', 'play chess', 'dance', 'sing songs', 'play sports', 'play football', 'fly a kite', 'ride a bike', 'swim'],
    orderedSentences: ['I read books after school.', 'I play chess after school.'],
  },
  {
    unitId: 'grade-3/term-2/english/unit-04',
    matchedWords: ['uncle', 'aunt', 'cousin', 'family'],
    classifiedWords: ['family', 'uncle', 'aunt', 'cousin'],
    orderedSentences: ['This is my aunt.', 'He is my uncle.'],
  },
  {
    unitId: 'grade-3/term-2/english/review-01',
    matchedWords: ['maths', 'toilet', 'read books', 'play chess'],
    classifiedWords: ['Chinese', 'English', 'maths', 'science', 'PE', 'music', 'art', 'computer class', 'classroom', 'library', 'toilet', 'playground', 'first floor', 'second floor', 'third floor', 'read books', 'draw pictures', 'play chess', 'dance', 'sing songs', 'play sports', 'play football', 'fly a kite', 'ride a bike', 'swim'],
    orderedSentences: ['I read books after school.', 'I like maths.'],
  },
  {
    unitId: 'grade-3/term-2/english/unit-05',
    matchedWords: ['cooking dinner', 'walking the dog', 'watering the plants', 'cleaning the room'],
    classifiedWords: ['cooking dinner', 'walking the dog', 'watering the plants', 'cleaning the room', 'listening to music', 'watching TV', 'feeding the fish'],
    orderedSentences: ['She is cooking dinner.', 'He is walking the dog.'],
  },
  {
    unitId: 'grade-3/term-2/english/unit-06',
    matchedWords: ['bedroom', 'kitchen', 'dining room', 'study'],
    classifiedWords: ['home', 'bedroom', 'living room', 'bathroom', 'dining room', 'study', 'kitchen', 'sofa', 'light', 'bed', 'door', 'box'],
    orderedSentences: ['This is the kitchen.', 'Where is the study?'],
  },
  {
    unitId: 'grade-3/term-2/english/review-02',
    matchedWords: ['aunt', 'cooking dinner', 'study', 'walking the dog'],
    classifiedWords: ['family', 'aunt', 'mother', 'sister', 'cousin', 'grandmother', 'uncle', 'father', 'brother', 'grandfather', 'cooking dinner', 'walking the dog', 'watering the plants', 'cleaning the room', 'listening to music', 'watching TV', 'feeding the fish', 'home', 'bedroom', 'living room', 'bathroom', 'dining room', 'study', 'kitchen', 'sofa', 'light', 'bed', 'door', 'box'],
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

describe('added English vocabulary and textbook alignment', () => {
  it.each(alignmentCases)('$unitId uses the matching book vocabulary and phrases', (alignment) => {
    const activities = activitiesFor(alignment.unitId);
    const classifications = activities.filter((activity) => activity.kind === 'categorize');
    expect(classifications.length).toBeGreaterThan(0);
    const classifiedWords = new Set(classifications.flatMap(({ items }) => items.map(({ label }) => label)));
    expect(classifiedWords).toEqual(new Set(alignment.classifiedWords));

    const matchingActivities = activities.filter((activity) => activity.kind === 'match');
    const matchedTerms = new Set(matchingActivities.flatMap(({ pairs }) => pairs.flatMap(({ left, right }) => [left, right])));
    alignment.matchedWords.forEach((word) => expect(matchedTerms).toContain(word));

    const orderedSentences = activities.filter((activity) => activity.kind === 'order').map((activity) => {
      if (activity.kind !== 'order') return '';
      return activity.correctOrder.map((id) => activity.items.find((item) => item.id === id)?.label ?? '')
        .join(' ')
        .replace(/ ([?.!,])/g, '$1');
    });
    alignment.orderedSentences.forEach((sentence) => expect(orderedSentences).toContain(sentence));
  });
});
