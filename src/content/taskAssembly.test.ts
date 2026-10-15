import { describe, expect, it } from 'vitest';
import { buildDifficultyTracks, type TaskAssemblyInput } from './taskAssembly';

type Question = { prompt: string; hint: string; explanation: string };

const question: Question = { prompt: '看清线索。', hint: '再看一遍。', explanation: '线索说明了答案。' };

function task(title: string, objective: string): TaskAssemblyInput<Question> {
  return { title, objective, companionId: 'companion-03', questions: [question, question] };
}

function createActivity(item: Question, id: string) {
  return {
    id,
    kind: 'arithmetic' as const,
    prompt: item.prompt,
    hint: item.hint,
    explanation: item.explanation,
    expression: '1 + 1',
    correctAnswer: 2,
  };
}

describe('buildDifficultyTracks', () => {
  it('createsIndependentOrderedTasksSessionsAndQuestionIdsForEveryTier', () => {
    const unitId = 'grade-2/term-1/math/unit-01';
    const tracks = buildDifficultyTracks(unitId, {
      basic: [task('基础一', '认识线索。'), task('基础二', '应用线索。')],
      advanced: [task('进阶一', '连接线索。'), task('进阶二', '比较线索。')],
      high: [task('高阶一', '设计方案。'), task('高阶二', '检查方案。')],
    }, createActivity);

    expect(tracks.advanced).toMatchObject({
      difficulty: 'advanced',
      tasks: [
        {
          id: `${unitId}/advanced/task-01`,
          title: '进阶一',
          objective: '连接线索。',
          order: 1,
          sessions: [{
            id: `${unitId}/advanced/task-01/session-01`,
            durationMinutes: 20,
            companionId: 'companion-03',
            activities: [
              { id: `${unitId}/advanced/task-01/session-01/question-01`, kind: 'arithmetic' },
              { id: `${unitId}/advanced/task-01/session-01/question-02`, kind: 'arithmetic' },
            ],
          }],
        },
        {
          id: `${unitId}/advanced/task-02`,
          title: '进阶二',
          objective: '比较线索。',
          order: 2,
          sessions: [{ id: `${unitId}/advanced/task-02/session-01` }],
        },
      ],
    });
    expect(tracks.basic.tasks).toHaveLength(2);
    expect(tracks.high.tasks.map(({ id }) => id)).toEqual([
      `${unitId}/high/task-01`,
      `${unitId}/high/task-02`,
    ]);
  });
});
