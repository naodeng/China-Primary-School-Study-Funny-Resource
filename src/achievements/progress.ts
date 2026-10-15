import { curriculumManifest, getUnitManifest } from '../content/curriculumManifest';
import type { CurriculumProgressSource, CurriculumSessionSummary } from '../content/curriculumManifest';
import type { CurriculumUnit, LearningTask, SubjectId } from '../content/types';
import { getKnownCurriculumPositions, isBeforeLearningPosition } from './position';
import type { LearningPosition } from './position';

export interface LearningUnitProgress {
  key: string;
  title: string;
  subject: SubjectId;
  subjectTitle: string;
  gradeTitle: string;
  termTitle: string;
  basicSessions: CurriculumSessionSummary[];
  completedSessionIds: string[];
  completed: boolean;
}

export interface CosmicRank {
  id: string;
  title: string;
  description: string;
  unitsRequired: number;
}

export const COSMIC_RANKS: CosmicRank[] = [
  { id: 'trainee-astronaut', title: '预备宇航员', description: '整装待发，第一座知识岛正在等你', unitsRequired: 0 },
  { id: 'moon-pioneer', title: '月球开拓者', description: '完整点亮第一座知识岛', unitsRequired: 1 },
  { id: 'mars-explorer', title: '火星探险家', description: '完整点亮两座知识岛', unitsRequired: 2 },
  { id: 'galaxy-captain', title: '银河系舰长', description: '完整点亮四座知识岛', unitsRequired: 4 },
  { id: 'ultimate-explorer', title: '宇宙终极探索官', description: '累计探索八座知识岛', unitsRequired: 8 },
];

export interface TaskProgress {
  completedSessionCount: number;
  totalSessionCount: number;
  completed: boolean;
}

export function getTaskProgress(task: LearningTask, completedSessionIds: readonly string[]): TaskProgress {
  const totalSessionCount = task.sessions.length;
  const completedSessionCount = task.sessions.filter((session) => completedSessionIds.includes(session.id)).length;
  return {
    completedSessionCount,
    totalSessionCount,
    completed: totalSessionCount > 0 && completedSessionCount === totalSessionCount,
  };
}

export function isCurriculumUnitComplete(unit: CurriculumUnit, completedSessionIds: readonly string[]): boolean {
  if (unit.type !== 'unit' || unit.formalUnitNumber === null || !unit.achievementEligible) return false;
  const basicTasks = unit.difficultyTracks.basic.tasks;
  return basicTasks.length > 0 && basicTasks.every((task) => getTaskProgress(task, completedSessionIds).completed);
}

export function getLearningUnitProgress(completedSessionIds: string[], startAt?: LearningPosition | null, source: CurriculumProgressSource = curriculumManifest): LearningUnitProgress[] {
  return getKnownCurriculumPositions(source).map((position) => {
    const key = position.curriculumUnitKey!;
    // Known positions are backed by a unit manifest and a verified textbook.
    const basicSessions = getUnitManifest(key, source)!.basicSessions;
    const grade = source.grades.find((entry) => entry.id === position.gradeId)!;
    const term = grade.terms.find((entry) => entry.id === position.termId)!;
    const assumedComplete = Boolean(startAt && isBeforeLearningPosition(position, startAt));
    const sessionIds = assumedComplete
      ? basicSessions.map((session) => session.id)
      : basicSessions.filter((session) => completedSessionIds.includes(session.id)).map((session) => session.id);
    return {
      key,
      title: position.title,
      subject: position.subject,
      subjectTitle: position.subjectTitle,
      gradeTitle: grade.title,
      termTitle: term.title,
      basicSessions,
      completedSessionIds: sessionIds,
      completed: basicSessions.length > 0 && basicSessions.every((session) => sessionIds.includes(session.id)),
    };
  });
}

export function getCompletedUnitCount(completedSessionIds: string[], startAt?: LearningPosition | null, source: CurriculumProgressSource = curriculumManifest): number {
  return getKnownCurriculumPositions(source).filter((position) => {
    if (startAt && isBeforeLearningPosition(position, startAt)) return true;
    // Known positions are backed by a unit manifest and a verified textbook.
    const basicSessions = getUnitManifest(position.curriculumUnitKey!, source)!.basicSessions;
    return basicSessions.length > 0 && basicSessions.every((session) => completedSessionIds.includes(session.id));
  }).length;
}

export function getCosmicRank(completedUnitCount: number): CosmicRank {
  return [...COSMIC_RANKS].reverse().find((rank) => completedUnitCount >= rank.unitsRequired) ?? COSMIC_RANKS[0];
}

export function getNewCosmicRank(previousIds: string[], nextIds: string[], startAt?: LearningPosition | null, source: CurriculumProgressSource = curriculumManifest): CosmicRank | null {
  const previousCount = getCompletedUnitCount(previousIds, startAt, source);
  const nextCount = getCompletedUnitCount(nextIds, startAt, source);
  return COSMIC_RANKS.find((rank) => rank.unitsRequired > 0 && previousCount < rank.unitsRequired && nextCount >= rank.unitsRequired) ?? null;
}
