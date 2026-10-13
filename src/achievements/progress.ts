import { curriculum } from '../content/curriculum';
import type { CurriculumUnit, SubjectId } from '../content/types';
import { getKnownCurriculumPositions, isBeforeLearningPosition } from './position';
import type { LearningPosition } from './position';

export interface LearningUnitProgress {
  key: string;
  title: string;
  subject: SubjectId;
  subjectTitle: string;
  gradeTitle: string;
  termTitle: string;
  unit: CurriculumUnit;
  completedSessionIds: string[];
  completed: boolean;
}

export interface CosmicRank {
  id: string;
  title: string;
  description: string;
  unitsRequired: number;
  symbol: string;
}

export const COSMIC_RANKS: CosmicRank[] = [
  { id: 'trainee-astronaut', title: '预备宇航员', description: '整装待发，第一座知识岛正在等你', unitsRequired: 0, symbol: '🧑‍🚀' },
  { id: 'moon-pioneer', title: '月球开拓者', description: '完整点亮第一座知识岛', unitsRequired: 1, symbol: '🌙' },
  { id: 'mars-explorer', title: '火星探险家', description: '完整点亮两座知识岛', unitsRequired: 2, symbol: '🚀' },
  { id: 'galaxy-captain', title: '银河系舰长', description: '完整点亮四座知识岛', unitsRequired: 4, symbol: '🌌' },
  { id: 'ultimate-explorer', title: '宇宙终极探索官', description: '累计探索八座知识岛', unitsRequired: 8, symbol: '🛸' },
];

export function getLearningUnitProgress(completedSessionIds: string[], startAt?: LearningPosition | null): LearningUnitProgress[] {
  return curriculum.grades.flatMap((grade) => grade.terms.flatMap((term) => term.subjects.flatMap((subject) => (
    subject.units
      .filter((entry) => entry.status === 'active' && entry.curriculumUnitKey)
      .map((entry) => {
        const key = entry.curriculumUnitKey!;
        const unit = curriculum.units[key];
        const position = {
          grade: Number(grade.id.slice('grade-'.length)),
          term: term.id === 'term-1' ? 1 : 2,
          unit: Number(entry.id.slice('unit-'.length)),
        } as const;
        const assumedComplete = Boolean(startAt && isBeforeLearningPosition(position, startAt));
        const sessionIds = assumedComplete
          ? unit.sessions.map((session) => session.id)
          : unit.sessions.filter((session) => completedSessionIds.includes(session.id)).map((session) => session.id);
        const completed = unit.sessions.length > 0 && sessionIds.length === unit.sessions.length;
        return {
          key,
          title: entry.title,
          subject: subject.id,
          subjectTitle: subject.title,
          gradeTitle: grade.title,
          termTitle: term.title,
          unit,
          completedSessionIds: sessionIds,
          completed,
        };
      })
  ))));
}

export function getCompletedUnitCount(completedSessionIds: string[], startAt?: LearningPosition | null): number {
  return getKnownCurriculumPositions().filter((position) => {
    if (startAt && isBeforeLearningPosition(position, startAt)) return true;
    if (!position.curriculumUnitKey) return false;
    const unit = curriculum.units[position.curriculumUnitKey];
    return Boolean(unit && unit.sessions.length > 0 && unit.sessions.every((session) => completedSessionIds.includes(session.id)));
  }).length;
}

export function getCosmicRank(completedUnitCount: number): CosmicRank {
  return [...COSMIC_RANKS].reverse().find((rank) => completedUnitCount >= rank.unitsRequired) ?? COSMIC_RANKS[0];
}

export function getNewCosmicRank(previousIds: string[], nextIds: string[], startAt?: LearningPosition | null): CosmicRank | null {
  const previousCount = getCompletedUnitCount(previousIds, startAt);
  const nextCount = getCompletedUnitCount(nextIds, startAt);
  return COSMIC_RANKS.find((rank) => rank.unitsRequired > 0 && previousCount < rank.unitsRequired && nextCount >= rank.unitsRequired) ?? null;
}
