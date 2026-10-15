import { describe, expect, it } from 'vitest';
import type { Difficulty, LearningTask } from '../../../types';
import { buildEnglishUnit } from './buildEnglishUnit';
import { choose, q8 } from './questionAuthoring';
import type { EnglishTaskSpec } from './questionAuthoring';

const questions = q8([
  choose('Which word means “cat”?', ['cat', 'dog', 'book'], 0, 'Look at the first word.', 'Cat means “猫”.'),
  choose('Which word means “书”?', ['pen', 'book', 'bag'], 1, 'Find the word for reading.', 'Book means “书”.'),
  choose('Choose the greeting word.', ['hello', 'red', 'desk'], 0, 'Say it when you meet a friend.', 'Hello is a greeting.'),
  choose('Choose the word for “狗”.', ['bird', 'dog', 'fish'], 1, 'Think of a pet that barks.', 'Dog means “狗”.'),
  choose('Choose the color word.', ['blue', 'apple', 'chair'], 0, 'It is the color of a clear sky.', 'Blue is a color.'),
  choose('Which word means “铅笔”?', ['pencil', 'window', 'mother'], 0, 'You can write with it.', 'Pencil means “铅笔”.'),
  choose('Choose the number word.', ['seven', 'green', 'father'], 0, 'It comes after six.', 'Seven means “七”.'),
  choose('Choose the classroom word.', ['classroom', 'banana', 'happy'], 0, 'Students learn there.', 'Classroom means “教室”.'),
]);

function task(title: string, goal: number): EnglishTaskSpec {
  return { title, objective: `完成第 ${goal} 个学习目标。`, companionId: 'companion-04', questions };
}

function expectTwoTasks(tasks: LearningTask[], unitId: string, difficulty: Difficulty, titles: string[]) {
  expect(tasks).toHaveLength(2);
  expect(tasks.map((item) => item.title)).toEqual(titles);
  expect(tasks.map((item) => item.order)).toEqual([1, 2]);
  expect(tasks.map((item) => item.objective)).toEqual(['完成第 1 个学习目标。', '完成第 2 个学习目标。']);
  const allIds = tasks.flatMap((item, index) => {
    const session = item.sessions[0];
    expect(item.id).toBe(`${unitId}/${difficulty}/task-${String(index + 1).padStart(2, '0')}`);
    expect(session?.id).toBe(`${item.id}/session-01`);
    expect(session?.durationMinutes).toBe(20);
    expect(session?.activities).toHaveLength(8);
    return [item.id, ...(session ? [session.id, ...session.activities.map((activity) => activity.id)] : [])];
  });
  expect(new Set(allIds).size).toBe(allIds.length);
}

describe('buildEnglishUnit', () => {
  it('buildsTwoAdvancedAndHighTasksWithIndependentIds', () => {
    const unit = buildEnglishUnit({
      formalUnitNumber: 1,
      entryId: 'unit-01',
      title: '第一单元 · My Family',
      sourceTopics: ['家庭成员词汇'],
      basicTasks: [task('认读家庭成员', 1), task('介绍家庭成员', 2)],
      advancedTasks: [task('听线索找家人', 1), task('用完整句子介绍', 2)],
      highTasks: [task('设计家庭介绍卡', 1), task('连贯介绍家庭成员', 2)],
    });

    expectTwoTasks(unit.difficultyTracks.advanced.tasks, unit.id, 'advanced', ['听线索找家人', '用完整句子介绍']);
    expectTwoTasks(unit.difficultyTracks.high.tasks, unit.id, 'high', ['设计家庭介绍卡', '连贯介绍家庭成员']);
  });

  it('buildsCanonicalIdsForGradeOneAndThree', () => {
    for (const grade of [1, 3] as const) {
      const unit = buildEnglishUnit({
        grade,
        term: 2,
        formalUnitNumber: 1,
        entryId: 'unit-01',
        title: 'English theme',
        sourceTopics: ['Vocabulary'],
        basicTasks: [task('Recognize', 1), task('Introduce', 2)],
        advancedTasks: [task('Apply', 1), task('Compare', 2)],
        highTasks: [task('Plan', 1), task('Review', 2)],
      });
      expect(unit.id).toBe(`grade-${grade}/term-2/english/unit-01`);
      expect(unit.textbookEditionId).toBe(`grade-${grade}/term-2/english`);
    }
  });
});
