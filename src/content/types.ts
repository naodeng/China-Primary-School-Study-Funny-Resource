export type SubjectId = 'chinese' | 'math';
export type CatalogStatus = 'active' | 'comingSoon';
export type CurriculumUnitKey = string;
export type CompanionId = 'companion-01' | 'companion-02' | 'companion-03' | 'companion-04';

export interface ActivityBase {
  id: string;
  prompt: string;
  hint: string;
  explanation: string;
}

export interface ChoiceOption {
  id: string;
  label: string;
}

export interface ChoiceActivityDefinition extends ActivityBase {
  kind: 'choice';
  options: ChoiceOption[];
  correctOptionId: string;
}

export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

export interface MatchActivityDefinition extends ActivityBase {
  kind: 'match';
  pairs: MatchPair[];
}

export interface OrderItem {
  id: string;
  label: string;
}

export interface OrderActivityDefinition extends ActivityBase {
  kind: 'order';
  items: OrderItem[];
  correctOrder: string[];
}

export interface CategorizeCategory {
  id: string;
  label: string;
}

export interface CategorizeItem {
  id: string;
  label: string;
  categoryId: string;
}

export interface CategorizeActivityDefinition extends ActivityBase {
  kind: 'categorize';
  categories: CategorizeCategory[];
  items: CategorizeItem[];
}

export interface MeasurementActivityDefinition extends ActivityBase {
  kind: 'measurement';
  objectLabel: string;
  targetLengthCm: number;
  minCm: number;
  maxCm: number;
}

export interface ArithmeticActivityDefinition extends ActivityBase {
  kind: 'arithmetic';
  expression: string;
  correctAnswer: number;
  carryBorrowSteps?: string[];
}

export type ActivityDefinition =
  | ChoiceActivityDefinition
  | MatchActivityDefinition
  | OrderActivityDefinition
  | CategorizeActivityDefinition
  | MeasurementActivityDefinition
  | ArithmeticActivityDefinition;

export interface LearningSession {
  id: string;
  title: string;
  durationMinutes: 20;
  objective: string;
  companionId: CompanionId;
  activities: ActivityDefinition[];
}

export interface CurriculumUnit {
  id: string;
  subject: SubjectId;
  title: string;
  sourceTopics: string[];
  sessions: LearningSession[];
}

export interface CatalogUnitEntry {
  id: string;
  title: string;
  status: CatalogStatus;
  curriculumUnitKey?: CurriculumUnitKey;
}

export interface CatalogSubjectEntry {
  id: SubjectId;
  title: string;
  units: CatalogUnitEntry[];
}

export interface CatalogTermEntry {
  id: 'term-1' | 'term-2';
  title: string;
  subjects: CatalogSubjectEntry[];
}

export interface CatalogGradeEntry {
  id: `grade-${number}`;
  title: string;
  terms: CatalogTermEntry[];
}

export interface Curriculum {
  grades: CatalogGradeEntry[];
  units: Record<CurriculumUnitKey, CurriculumUnit>;
}
