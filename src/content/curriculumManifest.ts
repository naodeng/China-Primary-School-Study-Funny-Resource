import rawManifest from './curriculum-manifest.json';
import type { Curriculum, Difficulty, LearningSession } from './types';

export type CurriculumSessionSummary = Pick<LearningSession, 'id' | 'title'>;

export interface CurriculumManifestUnit {
  sessionIds: Record<Difficulty, string[]>;
  basicSessions: CurriculumSessionSummary[];
}

export interface CurriculumManifest {
  textbooks: Curriculum['textbooks'];
  grades: Curriculum['grades'];
  units: Record<string, CurriculumManifestUnit>;
}

export type CurriculumProgressSource = Pick<Curriculum, 'textbooks' | 'grades'> & {
  units: Record<string, CurriculumManifestUnit | Curriculum['units'][string]>;
};

export const curriculumManifest = rawManifest as CurriculumManifest;

export function getUnitManifest(key: string, source: CurriculumProgressSource = curriculumManifest): CurriculumManifestUnit | undefined {
  const entry = source.units[key];
  if (!entry) return undefined;
  if ('sessionIds' in entry) return entry;

  return {
    sessionIds: {
      basic: entry.difficultyTracks.basic.tasks.flatMap((task) => task.sessions.map((session) => session.id)),
      advanced: entry.difficultyTracks.advanced.tasks.flatMap((task) => task.sessions.map((session) => session.id)),
      high: entry.difficultyTracks.high.tasks.flatMap((task) => task.sessions.map((session) => session.id)),
    },
    basicSessions: entry.difficultyTracks.basic.tasks.flatMap((task) => task.sessions.map(({ id, title }) => ({ id, title }))),
  };
}
