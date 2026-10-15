import { describe, expect, it } from 'vitest';
import { createPendingBasicTasks, getSessionsForDifficulty } from './sessionUtils';
import type { CurriculumUnit, LearningSession } from './types';

const unitKey = 'grade-2/term-1/chinese/unit-01';

function createSession(id: string, title: string): LearningSession {
  return {
    id,
    title,
    durationMinutes: 20,
    objective: `练习${title}。`,
    companionId: 'companion-02',
    activities: [],
  };
}

describe('sessionUtils', () => {
  it('returns sessions in task order for only the requested difficulty', () => {
    const unit = {
      difficultyTracks: {
        basic: {
          difficulty: 'basic',
          tasks: [
            { id: `${unitKey}/basic/task-01`, title: '任务一', objective: '目标一', order: 1, sessions: [createSession('s-1', '第一场')] },
            { id: `${unitKey}/basic/task-02`, title: '任务二', objective: '目标二', order: 2, sessions: [createSession('s-2', '第二场')] },
          ],
        },
        advanced: {
          difficulty: 'advanced',
          tasks: [{ id: `${unitKey}/advanced/task-01`, title: '进阶任务', objective: '进阶目标', order: 1, sessions: [createSession('s-3', '进阶场')] }],
        },
        high: { difficulty: 'high', tasks: [] },
      },
    } as unknown as CurriculumUnit;

    expect(getSessionsForDifficulty(unit, 'basic').map((session) => session.title)).toEqual(['第一场', '第二场']);
    expect(getSessionsForDifficulty(unit, 'advanced').map((session) => session.title)).toEqual(['进阶场']);
  });

  it('creates pending basic tasks with canonical task and session IDs', () => {
    const session = createSession('old-unit/session-01', '看图找线索');

    expect(createPendingBasicTasks(unitKey, [session])).toEqual([{
      id: `${unitKey}/basic/task-01`,
      title: '看图找线索',
      objective: '练习看图找线索。',
      order: 1,
      sessions: [{ ...session, id: `${unitKey}/basic/task-01/session-01` }],
    }]);
  });
});
