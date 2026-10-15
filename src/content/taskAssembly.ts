import type {
  ActivityDefinition,
  CompanionId,
  Difficulty,
  DifficultyTrack,
  LearningSession,
  LearningTask,
} from './types';

export interface TaskAssemblyInput<Question> {
  title: string;
  objective: string;
  companionId: CompanionId;
  questions: readonly Question[];
}

export interface DifficultyTaskAssemblyInputs<Question> {
  basic: readonly TaskAssemblyInput<Question>[];
  advanced: readonly TaskAssemblyInput<Question>[];
  high: readonly TaskAssemblyInput<Question>[];
}

export function formatCurriculumSequence(value: number): string {
  return String(value).padStart(2, '0');
}

function createTrack<Question>(
  unitId: string,
  difficulty: Difficulty,
  taskSpecs: readonly TaskAssemblyInput<Question>[],
  createActivity: (question: Question, id: string) => ActivityDefinition,
): DifficultyTrack {
  return {
    difficulty,
    tasks: taskSpecs.map((taskSpec, taskIndex) => {
      const taskId = `${unitId}/${difficulty}/task-${formatCurriculumSequence(taskIndex + 1)}`;
      const sessionId = `${taskId}/session-01`;
      const session: LearningSession = {
        id: sessionId,
        title: taskSpec.title,
        durationMinutes: 20,
        objective: taskSpec.objective,
        companionId: taskSpec.companionId,
        activities: taskSpec.questions.map((question, questionIndex) => (
          createActivity(question, `${sessionId}/question-${formatCurriculumSequence(questionIndex + 1)}`)
        )),
      };

      const task: LearningTask = {
        id: taskId,
        title: taskSpec.title,
        objective: taskSpec.objective,
        order: taskIndex + 1,
        sessions: [session],
      };
      return task;
    }),
  };
}

export function buildDifficultyTracks<Question>(
  unitId: string,
  taskSpecs: DifficultyTaskAssemblyInputs<Question>,
  createActivity: (question: Question, id: string) => ActivityDefinition,
): Record<Difficulty, DifficultyTrack> {
  return {
    basic: createTrack(unitId, 'basic', taskSpecs.basic, createActivity),
    advanced: createTrack(unitId, 'advanced', taskSpecs.advanced, createActivity),
    high: createTrack(unitId, 'high', taskSpecs.high, createActivity),
  };
}
