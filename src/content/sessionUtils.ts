import type { CurriculumUnit, Difficulty, LearningSession, LearningTask } from './types';

export function getSessionsForDifficulty(unit: CurriculumUnit, difficulty: Difficulty): LearningSession[] {
  return unit.difficultyTracks[difficulty].tasks.flatMap((task) => task.sessions);
}

export function createPendingBasicTasks(unitKey: string, sessions: readonly LearningSession[]): LearningTask[] {
  return sessions.map((session, index) => {
    const taskNumber = String(index + 1).padStart(2, '0');
    const taskId = `${unitKey}/basic/task-${taskNumber}`;
    return {
      id: taskId,
      title: session.title,
      objective: session.objective,
      order: index + 1,
      sessions: [{ ...session, id: `${taskId}/session-01` }],
    };
  });
}
