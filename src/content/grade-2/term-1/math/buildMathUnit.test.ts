import { describe, expect, it } from 'vitest';
import type { Difficulty, LearningTask } from '../../../types';
import { buildMathUnit } from './buildMathUnit';
import { calculate, makeTask, q8 } from './questionAuthoring';

const questions = q8([
  calculate('算一算 1 + 1。', '1 + 1', 2, '从1开始再数1个。', '1加1等于2。'),
  calculate('算一算 2 + 3。', '2 + 3', 5, '把两个数合起来。', '2加3等于5。'),
  calculate('算一算 8 - 4。', '8 - 4', 4, '从8里面去掉4。', '8减4等于4。'),
  calculate('算一算 6 + 2。', '6 + 2', 8, '接着6往后数2个。', '6加2等于8。'),
  calculate('算一算 9 - 3。', '9 - 3', 6, '从9里面去掉3。', '9减3等于6。'),
  calculate('算一算 5 + 5。', '5 + 5', 10, '两个5合起来是多少？', '5加5等于10。'),
  calculate('算一算 7 - 2。', '7 - 2', 5, '从7里面去掉2。', '7减2等于5。'),
  calculate('算一算 3 + 4。', '3 + 4', 7, '从3开始再数4个。', '3加4等于7。'),
]);

function task(title: string, goal: number) {
  return makeTask(title, `完成第 ${goal} 个学习目标。`, 'companion-02', questions);
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

describe('buildMathUnit', () => {
  it('buildsTwoAdvancedAndHighTasksWithIndependentIds', () => {
    const unit = buildMathUnit({
      formalUnitNumber: 2,
      title: '第二单元 · 加减练习',
      sourceTopics: ['两位数加减'],
      basicTasks: [task('合并数量', 1), task('比较数量', 2)],
      advancedTasks: [task('解决购物问题', 1), task('比较两种算法', 2)],
      highTasks: [task('规划分组方案', 1), task('检查方案是否合理', 2)],
    });

    expectTwoTasks(unit.difficultyTracks.advanced.tasks, unit.id, 'advanced', ['解决购物问题', '比较两种算法']);
    expectTwoTasks(unit.difficultyTracks.high.tasks, unit.id, 'high', ['规划分组方案', '检查方案是否合理']);
  });
});
