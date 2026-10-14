export type SubjectId = 'chinese' | 'math' | 'english';
export type TermNumber = 1 | 2;
export type TermId = `term-${TermNumber}`;
export type CatalogStatus = 'active' | 'comingSoon';
export type CatalogEntryType = 'unit' | 'review' | 'integrated-practice';
export type Difficulty = 'basic' | 'advanced' | 'high';
export type TextbookSourceKind = 'pep-latest' | 'tapx-fallback';
export type TextbookVerificationStatus = 'pending' | 'verified';
export type SchoolOfferingStatus = 'confirmed' | 'unconfirmed';
export type CurriculumUnitKey = string;
export type CompanionId = 'companion-01' | 'companion-02' | 'companion-03' | 'companion-04';

export interface TextbookEdition {
  id: string;
  subject: SubjectId;
  grade: number;
  term: TermNumber;
  series: string;
  edition: string | null;
  printing: string | null;
  isbn: string | null;
  sourceKind: TextbookSourceKind;
  sourceUrl: string;
  latestPepEvidenceUrl: string;
  fallbackReason: string | null;
  checkedAt: string;
  tapxCommit: string | null;
  verificationStatus: TextbookVerificationStatus;
  schoolOfferingStatus?: SchoolOfferingStatus;
}

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

export interface LearningTask {
  id: string;
  title: string;
  objective: string;
  order: number;
  sessions: LearningSession[];
}

export interface DifficultyTrack {
  difficulty: Difficulty;
  tasks: LearningTask[];
}

export interface CurriculumUnit {
  id: CurriculumUnitKey;
  subject: SubjectId;
  title: string;
  type: CatalogEntryType;
  formalUnitNumber: number | null;
  achievementEligible: boolean;
  textbookEditionId: string;
  sourceTopics: string[];
  difficultyTracks: Record<Difficulty, DifficultyTrack>;
}

export interface CatalogUnitEntry {
  id: string;
  title: string;
  status: CatalogStatus;
  type: CatalogEntryType;
  formalUnitNumber: number | null;
  achievementEligible: boolean;
  textbookEditionId: string;
  curriculumUnitKey?: CurriculumUnitKey;
}

export interface CatalogSubjectEntry {
  id: SubjectId;
  title: string;
  units: CatalogUnitEntry[];
}

export interface CatalogTermEntry {
  id: TermId;
  title: string;
  subjects: CatalogSubjectEntry[];
}

export interface CatalogGradeEntry {
  id: `grade-${number}`;
  title: string;
  terms: CatalogTermEntry[];
}

export interface Curriculum {
  textbooks: Record<string, TextbookEdition>;
  grades: CatalogGradeEntry[];
  units: Record<CurriculumUnitKey, CurriculumUnit>;
}
