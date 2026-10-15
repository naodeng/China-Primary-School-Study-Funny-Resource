import { curriculumManifest } from '../content/curriculumManifest';
import type { CurriculumProgressSource } from '../content/curriculumManifest';
import { getRegisteredCurriculumPositions } from './position';
import type { LearningPosition } from './position';
import { getLearningUnitProgress } from './progress';

export interface ExplorationUnitNode {
  id: string;
  title: string;
  subjectTitle: string;
  state: 'complete' | 'available' | 'comingSoon';
  completedSessions: number;
  totalSessions: number;
  grade: number;
  term: 1 | 2;
  unit: number;
}

export interface ExplorationZone {
  id: string;
  gradeId: string;
  termId: string;
  gradeTitle: string;
  termTitle: string;
  number: number;
  title: string;
  visualStyle: string;
  unitArtifact: string;
  units: ExplorationUnitNode[];
  availableUnitCount: number;
  completedUnitCount: number;
  hasCurriculum: boolean;
  isStartZone: boolean;
  startUnit?: number;
  isOpen: boolean;
}

const ZONE_DESIGNS = [
  { grade: 1, term: 1, title: '月球空港', visualStyle: '萌系卡通、温暖明亮', unitArtifact: '月球基地' },
  { grade: 1, term: 2, title: '红色火星', visualStyle: '荒漠开拓、极客初现', unitArtifact: '火星运河 / 地下城' },
  { grade: 2, term: 1, title: '小行星带', visualStyle: '乱石穿空、极速闪避', unitArtifact: '发光矿石' },
  { grade: 2, term: 2, title: '木星风暴', visualStyle: '气态巨星、科幻震撼', unitArtifact: '稳定锚点' },
  { grade: 3, term: 1, title: '半人马座', visualStyle: '深空幽蓝、异星文明', unitArtifact: '量子通信密码' },
  { grade: 3, term: 2, title: '猎户旋臂', visualStyle: '星云绚丽、航线绵长', unitArtifact: '星际灯塔' },
  { grade: 4, term: 1, title: '天鹅座X1', visualStyle: '引力扭曲、神秘硬核', unitArtifact: '反物质收集器' },
  { grade: 4, term: 2, title: '织女星云', visualStyle: '晶莹剔透、几何美感', unitArtifact: '星际水晶' },
  { grade: 5, term: 1, title: '超星系团', visualStyle: '宏大叙事、星系熔炉', unitArtifact: '星系核心' },
  { grade: 5, term: 2, title: '流浪星域', visualStyle: '冰冷孤寂、寻找家园', unitArtifact: '恒星引力弹弓' },
  { grade: 6, term: 1, title: '引力波源', visualStyle: '高维空间、线条极简', unitArtifact: '维度碎片' },
  { grade: 6, term: 2, title: '宇宙终点', visualStyle: '终极荣耀、黄金圣殿', unitArtifact: '神级文明进化阶梯' },
] as const;

export function getExplorationZones(completedSessionIds: string[], startAt?: LearningPosition | null, source: CurriculumProgressSource = curriculumManifest): ExplorationZone[] {
  const progress = getLearningUnitProgress(completedSessionIds, startAt, source);
  const registeredPositions = getRegisteredCurriculumPositions(source);

  return ZONE_DESIGNS.map((design, index) => {
    const gradeId = `grade-${design.grade}`;
    const termId = `term-${design.term}`;
    const grade = source.grades.find((entry) => entry.id === gradeId);
    const term = grade?.terms.find((entry) => entry.id === termId);
    const gradeTitle = grade?.title ?? `${design.grade}年级`;
    const termTitle = term?.title ?? (design.term === 1 ? '上学期' : '下学期');
    const isStartZone = startAt?.grade === design.grade && startAt.term === design.term;
    const units = registeredPositions
      .filter((position) => position.grade === design.grade && position.term === design.term)
      .map((position) => {
        const unitProgress = progress.find((candidate) => candidate.key === position.curriculumUnitKey);
        const state = unitProgress ? (unitProgress.completed ? 'complete' : 'available') : 'comingSoon';
        return {
          id: `${position.subject}-${position.gradeId}-${position.termId}-unit-${String(position.unit).padStart(2, '0')}`,
          title: position.title,
          subjectTitle: position.subjectTitle,
          state,
          completedSessions: unitProgress?.completedSessionIds.length ?? 0,
          totalSessions: unitProgress?.basicSessions.length ?? 0,
          grade: position.grade,
          term: position.term,
          unit: position.unit,
        } satisfies ExplorationUnitNode;
      });
    const availableUnitCount = units.filter((unit) => unit.state === 'available' || unit.state === 'complete').length;
    const completedUnitCount = units.filter((unit) => unit.state === 'complete').length;

    return {
      id: `grade-${design.grade}-term-${design.term}`,
      gradeId,
      termId,
      gradeTitle,
      termTitle,
      number: index + 1,
      title: design.title,
      visualStyle: design.visualStyle,
      unitArtifact: design.unitArtifact,
      units,
      availableUnitCount,
      completedUnitCount,
      hasCurriculum: units.length > 0,
      isStartZone,
      startUnit: isStartZone ? startAt?.unit : undefined,
      isOpen: availableUnitCount > 0 || isStartZone,
    };
  });
}
