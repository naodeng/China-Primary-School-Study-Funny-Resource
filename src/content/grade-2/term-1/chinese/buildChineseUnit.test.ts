import { describe, expect, it } from 'vitest';
import { buildChineseUnit } from './buildChineseUnit';
import type { ChineseQuestionSpec, ChineseTaskSpec } from './buildChineseUnit';
import type { Difficulty, LearningTask } from '../../../types';

const questions: ChineseQuestionSpec[] = [
  { kind: 'choice', prompt: '选择正确线索。', options: ['甲', '乙', '丙'], correctOptionIndex: 2, hint: '再看一看。', explanation: '这是正确线索。' },
  { kind: 'match', prompt: '找到对应伙伴。', pairs: [{ left: '甲', right: '一' }, { left: '乙', right: '二' }], hint: '观察特点。', explanation: '线索可以配对。' },
  { kind: 'order', prompt: '排好顺序。', items: ['第一步', '第二步', '第三步'], correctOrderIndices: [1, 2, 0], hint: '先后很重要。', explanation: '按线索排好。' },
  { kind: 'categorize', prompt: '分分类。', categories: ['一组', '二组'], items: [{ label: '甲', categoryIndex: 1 }, { label: '乙', categoryIndex: 2 }], hint: '看看共同点。', explanation: '分类让信息更清楚。' },
  { kind: 'choice', prompt: '再选一题。', options: ['甲', '乙', '丙'], correctOptionIndex: 0, hint: '认真比较。', explanation: '找到最合适的选项。' },
  { kind: 'choice', prompt: '继续观察。', options: ['甲', '乙', '丙'], correctOptionIndex: 1, hint: '仔细阅读。', explanation: '证据能帮助判断。' },
  { kind: 'choice', prompt: '读懂意思。', options: ['甲', '乙', '丙'], correctOptionIndex: 2, hint: '想想题意。', explanation: '意思要读完整。' },
  { kind: 'choice', prompt: '完成小挑战。', options: ['甲', '乙', '丙'], correctOptionIndex: 0, hint: '慢慢来。', explanation: '你找到答案啦。' },
];

function task(title: string, goal: number): ChineseTaskSpec {
  return { title, objective: `完成第 ${goal} 个学习目标。`, companionId: 'companion-01', questions };
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

describe('buildChineseUnit', () => {
  it('buildsCanonicalUnitIdsForTheSecondTerm', () => {
    const unit = buildChineseUnit({
      term: 2,
      formalUnitNumber: 1,
      title: '第一单元 · 春天来了',
      sourceTopics: ['春天观察'],
      basicTasks: [task('发现春天', 1), task('介绍春天', 2)],
      advancedTasks: [task('连接线索', 1), task('比较证据', 2)],
      highTasks: [task('创意表达', 1), task('说明推测', 2)],
    });

    expect(unit.id).toBe('grade-2/term-2/chinese/unit-01');
    expect(unit.textbookEditionId).toBe('grade-2/term-2/chinese');
    expect(unit.difficultyTracks.basic.tasks[0]?.sessions[0]?.id)
      .toBe('grade-2/term-2/chinese/unit-01/basic/task-01/session-01');
  });

  it('buildsCanonicalIdsForGradeOneAndThreeWithoutChangingGradeTwoDefaults', () => {
    const make = (grade: 1 | 3) => buildChineseUnit({
      grade,
      term: 2,
      formalUnitNumber: 1,
      title: '主题单元',
      sourceTopics: ['识字与表达'],
      basicTasks: [task('认识主题', 1), task('表达主题', 2)],
      advancedTasks: [task('应用线索', 1), task('比较线索', 2)],
      highTasks: [task('设计表达', 1), task('检查表达', 2)],
    });

    expect(make(1)).toMatchObject({ id: 'grade-1/term-2/chinese/unit-01', textbookEditionId: 'grade-1/term-2/chinese' });
    expect(make(3)).toMatchObject({ id: 'grade-3/term-2/chinese/unit-01', textbookEditionId: 'grade-3/term-2/chinese' });
  });

  it('buildsCanonicalThreeTierTasksWithEightTypedActivities', () => {
    const unit = buildChineseUnit({
      formalUnitNumber: 3,
      title: '第三单元 · 学习与成长',
      sourceTopics: ['故事线索', '观察人物'],
      basicTasks: [task('故事线索', 1), task('人物心情', 2)],
      advancedTasks: [task('连接线索', 1), task('比较证据', 2)],
      highTasks: [task('创意表达', 1), task('说明推测', 2)],
    });

    expect(unit.id).toBe('grade-2/term-1/chinese/unit-03');
    expect(unit.textbookEditionId).toBe('grade-2/term-1/chinese');
    expect(unit.difficultyTracks.basic.tasks).toHaveLength(2);
    expectTwoTasks(unit.difficultyTracks.advanced.tasks, unit.id, 'advanced', ['连接线索', '比较证据']);
    expectTwoTasks(unit.difficultyTracks.high.tasks, unit.id, 'high', ['创意表达', '说明推测']);
    const session = unit.difficultyTracks.basic.tasks[0]?.sessions[0];
    expect(session?.id).toBe(`${unit.id}/basic/task-01/session-01`);
    expect(session?.activities).toHaveLength(8);
    expect(session?.activities.map((activity) => activity.kind)).toEqual([
      'choice', 'match', 'order', 'categorize', 'choice', 'choice', 'choice', 'choice',
    ]);

    const choice = session?.activities[0];
    expect(choice).toMatchObject({
      kind: 'choice',
      correctOptionId: `${session?.id}/question-01/option-03`,
    });
    const match = session?.activities[1];
    expect(match).toMatchObject({
      kind: 'match',
      pairs: [
        { id: `${session?.id}/question-02/pair-01`, left: '甲', right: '一' },
        { id: `${session?.id}/question-02/pair-02`, left: '乙', right: '二' },
      ],
    });
    expect(session?.activities[2]).toMatchObject({
      kind: 'order',
      correctOrder: [
        `${session?.id}/question-03/item-02`,
        `${session?.id}/question-03/item-03`,
        `${session?.id}/question-03/item-01`,
      ],
    });
    expect(session?.activities[3]).toMatchObject({
      kind: 'categorize',
      items: [
        { id: `${session?.id}/question-04/item-01`, label: '甲', categoryId: `${session?.id}/question-04/category-01` },
        { id: `${session?.id}/question-04/item-02`, label: '乙', categoryId: `${session?.id}/question-04/category-02` },
      ],
    });
  });
});
