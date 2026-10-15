import type {
  ActivityDefinition,
  CatalogEntryType,
  CatalogUnitEntry,
  Curriculum,
  CurriculumUnit,
  Difficulty,
  LearningTask,
  TextbookEdition,
} from './types';

export interface ValidationIssue {
  code: string;
  path: string;
  message: string;
}

const DIFFICULTIES: readonly Difficulty[] = ['basic', 'advanced', 'high'];

function expectedAchievementEligibility(type: CatalogEntryType, formalUnitNumber: number | null): boolean {
  return type === 'unit'
    && formalUnitNumber !== null
    && Number.isSafeInteger(formalUnitNumber)
    && formalUnitNumber > 0;
}

function addIssue(issues: ValidationIssue[], code: string, path: string, message: string): void {
  issues.push({ code, path, message });
}

function registerId(id: string, path: string, seenIds: Map<string, string>, issues: ValidationIssue[]): void {
  const previousPath = seenIds.get(id);
  if (previousPath) {
    addIssue(issues, 'DUPLICATE_ID', path, `ID 已在 ${previousPath} 使用。`);
  } else {
    seenIds.set(id, path);
  }
}

function validateUniqueLocalIds<T extends { id: string }>(items: readonly T[], path: string, issues: ValidationIssue[]): void {
  const seen = new Set<string>();
  items.forEach((item, index) => {
    if (seen.has(item.id)) {
      addIssue(issues, 'DUPLICATE_ID', `${path}[${index}].id`, `同一列表中的 ID ${item.id} 重复。`);
    }
    seen.add(item.id);
  });
}

function validateActivity(activity: ActivityDefinition, path: string, issues: ValidationIssue[]): void {
  switch (activity.kind) {
    case 'choice': {
      validateUniqueLocalIds(activity.options, `${path}.options`, issues);
      if (!activity.options.some((option) => option.id === activity.correctOptionId)) {
        addIssue(issues, 'INVALID_ANSWER_REFERENCE', `${path}.correctOptionId`, '正确选项必须引用本题中的一个选项。');
      }
      break;
    }
    case 'match':
      validateUniqueLocalIds(activity.pairs, `${path}.pairs`, issues);
      if (activity.pairs.length < 2) {
        addIssue(issues, 'INVALID_ANSWER_REFERENCE', `${path}.pairs`, '配对题至少需要两组配对。');
      }
      break;
    case 'order': {
      validateUniqueLocalIds(activity.items, `${path}.items`, issues);
      const itemIds = activity.items.map((item) => item.id);
      if (activity.correctOrder.length !== itemIds.length
        || new Set(activity.correctOrder).size !== itemIds.length
        || activity.correctOrder.some((id) => !itemIds.includes(id))) {
        addIssue(issues, 'INVALID_ANSWER_REFERENCE', `${path}.correctOrder`, '正确顺序必须恰好引用题目中的全部项目。');
      }
      break;
    }
    case 'categorize': {
      validateUniqueLocalIds(activity.categories, `${path}.categories`, issues);
      validateUniqueLocalIds(activity.items, `${path}.items`, issues);
      const categoryIds = new Set(activity.categories.map((category) => category.id));
      activity.items.forEach((item, index) => {
        if (!categoryIds.has(item.categoryId)) {
          addIssue(issues, 'INVALID_ANSWER_REFERENCE', `${path}.items[${index}].categoryId`, '分类项目必须引用本题中的一个分类。');
        }
      });
      break;
    }
    case 'measurement':
      if (!Number.isFinite(activity.targetLengthCm)
        || !Number.isFinite(activity.minCm)
        || !Number.isFinite(activity.maxCm)
        || activity.minCm > activity.targetLengthCm
        || activity.targetLengthCm > activity.maxCm) {
        addIssue(issues, 'INVALID_ANSWER_REFERENCE', `${path}.targetLengthCm`, '测量答案必须位于题目允许的范围内。');
      }
      break;
    case 'arithmetic':
      if (!Number.isFinite(activity.correctAnswer)) {
        addIssue(issues, 'INVALID_ANSWER_REFERENCE', `${path}.correctAnswer`, '算式答案必须是有限数值。');
      }
      break;
    default: {
      addIssue(issues, 'UNSUPPORTED_ACTIVITY_KIND', `${path}.kind`, '题型暂不支持，请检查课程数据。');
      break;
    }
  }
}

function flattenCatalogEntries(curriculum: Curriculum): Array<{
  entry: CatalogUnitEntry;
  path: string;
  gradeId: string;
  termId: string;
  subjectId: string;
}> {
  const entries: Array<{ entry: CatalogUnitEntry; path: string; gradeId: string; termId: string; subjectId: string }> = [];
  curriculum.grades.forEach((grade, gradeIndex) => {
    grade.terms.forEach((term, termIndex) => {
      term.subjects.forEach((subject, subjectIndex) => {
        subject.units.forEach((entry, entryIndex) => {
          entries.push({
            entry,
            path: `grades[${gradeIndex}].terms[${termIndex}].subjects[${subjectIndex}].units[${entryIndex}]`,
            gradeId: grade.id,
            termId: term.id,
            subjectId: subject.id,
          });
        });
      });
    });
  });
  return entries;
}

function validateEligibility(
  type: CatalogEntryType,
  formalUnitNumber: number | null,
  achievementEligible: boolean,
  path: string,
  issues: ValidationIssue[],
): void {
  if (achievementEligible !== expectedAchievementEligibility(type, formalUnitNumber)) {
    addIssue(issues, 'ACHIEVEMENT_ELIGIBILITY_MISMATCH', path, '只有带正式编号的正式单元计入单元成就。');
  }
}

function isOfficialPepUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:'
      && (url.hostname === 'pep.com.cn' || url.hostname.endsWith('.pep.com.cn'));
  } catch {
    return false;
  }
}

function matchesTapxCommit(sourceUrl: string, commit: string): boolean {
  try {
    const url = new URL(sourceUrl);
    const expectedPrefix = `/TapXWorld/ChinaTextbook/blob/${commit}/`;
    const filePath = url.pathname.startsWith(expectedPrefix)
      ? url.pathname.slice(expectedPrefix.length)
      : '';

    return url.protocol === 'https:'
      && url.hostname === 'github.com'
      && filePath.length > 0
      && !filePath.endsWith('/')
      && filePath.toLowerCase().endsWith('.pdf');
  } catch {
    return false;
  }
}

function validateTextbookSource(book: TextbookEdition, path: string, issues: ValidationIssue[]): void {
  if (!isOfficialPepUrl(book.latestPepEvidenceUrl)) {
    addIssue(issues, 'PEP_EVIDENCE_URL_INVALID', `${path}.latestPepEvidenceUrl`, '最新版证据链接必须来自人教社官方网站。');
  }

  if (book.sourceKind === 'tapx-fallback') {
    if (!book.tapxCommit) {
      addIssue(issues, 'TAPX_COMMIT_REQUIRED', `${path}.tapxCommit`, 'TapX 回退来源必须记录固定提交号。');
    } else if (!/^[a-f0-9]{40}$/i.test(book.tapxCommit)) {
      addIssue(issues, 'TAPX_COMMIT_INVALID', `${path}.tapxCommit`, 'TapX 提交号必须是 40 位 Git SHA。');
    } else if (!matchesTapxCommit(book.sourceUrl, book.tapxCommit)) {
      addIssue(issues, 'TAPX_SOURCE_COMMIT_MISMATCH', `${path}.sourceUrl`, 'TapX 文件链接必须指向元数据中记录的固定提交号。');
    }
    if (!book.fallbackReason?.trim()) {
      addIssue(issues, 'TAPX_FALLBACK_REASON_REQUIRED', `${path}.fallbackReason`, 'TapX 回退来源必须说明采用原因。');
    }
    return;
  }

  if (book.sourceKind === 'pep-latest') {
    if (!isOfficialPepUrl(book.sourceUrl)) {
      addIssue(issues, 'PEP_SOURCE_URL_INVALID', `${path}.sourceUrl`, '人教社最新版教材来源必须来自人教社官方网站。');
    }
    if (book.tapxCommit !== null || book.fallbackReason !== null) {
      addIssue(issues, 'PEP_FALLBACK_METADATA_UNEXPECTED', path, '人教社最新版来源不能包含 TapX 回退提交号或回退原因。');
    }
    return;
  }

  addIssue(issues, 'TEXTBOOK_SOURCE_KIND_INVALID', `${path}.sourceKind`, '教材来源类型必须是 pep-latest 或 tapx-fallback。');
}

function validateTask(
  unit: CurriculumUnit,
  task: LearningTask,
  difficulty: Difficulty,
  taskIndex: number,
  path: string,
  active: boolean,
  seenIds: Map<string, string>,
  issues: ValidationIssue[],
): void {
  registerId(task.id, `${path}.id`, seenIds, issues);
  if (!task.id.startsWith(`${unit.id}/${difficulty}/task-`)) {
    addIssue(issues, 'NON_CANONICAL_ID', `${path}.id`, '任务 ID 必须包含完整课程路径和难度。');
  }
  if (task.sessions.length === 0) {
    addIssue(issues, 'TASK_REQUIRES_SESSION', `${path}.sessions`, '每个任务至少需要一场学习活动。');
  }
  task.sessions.forEach((session, sessionIndex) => {
    const sessionPath = `${path}.sessions[${sessionIndex}]`;
    registerId(session.id, `${sessionPath}.id`, seenIds, issues);
    if (!session.id.startsWith(`${task.id}/session-`)) {
      addIssue(issues, 'NON_CANONICAL_ID', `${sessionPath}.id`, '场次 ID 必须包含完整任务路径。');
    }
    if (!active) return;
    if (session.activities.length !== 8) {
      addIssue(issues, 'SESSION_QUESTION_COUNT', `${sessionPath}.activities`, '每场必须恰好包含 8 道题。');
    }
    session.activities.forEach((activity, activityIndex) => {
      validateActivity(activity, `${session.id}.activities[${activityIndex}]`, issues);
    });
  });
  if (task.order !== taskIndex + 1) {
    addIssue(issues, 'TASK_ORDER_MISMATCH', `${path}.order`, '任务顺序需与目录顺序一致。');
  }
}

export function validateCurriculum(curriculum: Curriculum): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenIds = new Map<string, string>();
  const activeUnitKeys = new Set<string>();
  const catalogEntries = flattenCatalogEntries(curriculum);

  Object.entries(curriculum.textbooks).forEach(([textbookId, book]) => {
    validateTextbookSource(book, `textbooks.${textbookId}`, issues);
  });

  for (const { entry, path, gradeId, termId, subjectId } of catalogEntries) {
    const textbook = curriculum.textbooks[entry.textbookEditionId];
    validateEligibility(entry.type, entry.formalUnitNumber, entry.achievementEligible, `${path}.achievementEligible`, issues);

    if (!textbook) {
      addIssue(issues, 'UNKNOWN_TEXTBOOK_EDITION', `${path}.textbookEditionId`, '目录项必须引用已登记的教材版本。');
    } else {
      const gradeNumber = Number(gradeId.replace('grade-', ''));
      const termNumber = Number(termId.replace('term-', ''));
      if (textbook.subject !== subjectId || textbook.grade !== gradeNumber || textbook.term !== termNumber) {
        addIssue(issues, 'TEXTBOOK_REFERENCE_MISMATCH', `${path}.textbookEditionId`, '教材学科、年级和学期必须与目录位置一致。');
      }
      if (entry.status === 'active' && textbook.verificationStatus !== 'verified') {
        addIssue(issues, 'ACTIVE_ENTRY_REQUIRES_VERIFIED_TEXTBOOK', `${path}.textbookEditionId`, '课程所依据的教材版本和目录未核实，不能开放游玩。');
      }
    }

    if (entry.status === 'active') {
      if (!entry.curriculumUnitKey) {
        addIssue(issues, 'ACTIVE_ENTRY_REQUIRES_CURRICULUM', `${path}.curriculumUnitKey`, '开放游玩的目录项必须指向课程数据。');
      } else {
        activeUnitKeys.add(entry.curriculumUnitKey);
      }
    }

    if (entry.curriculumUnitKey) {
      const unit = curriculum.units[entry.curriculumUnitKey];
      if (!unit) {
        addIssue(issues, 'MISSING_CURRICULUM_UNIT', `${path}.curriculumUnitKey`, '目录项引用的课程数据不存在。');
        continue;
      }
      if (unit.subject !== subjectId
        || unit.type !== entry.type
        || unit.formalUnitNumber !== entry.formalUnitNumber
        || unit.achievementEligible !== entry.achievementEligible
        || unit.textbookEditionId !== entry.textbookEditionId) {
        addIssue(issues, 'CATALOG_UNIT_MISMATCH', `${path}.curriculumUnitKey`, '目录项与课程数据的学科、类型、编号或教材元数据不一致。');
      }
    }
  }

  for (const [unitKey, unit] of Object.entries(curriculum.units)) {
    const active = activeUnitKeys.has(unitKey);
    if (unit.id !== unitKey) {
      addIssue(issues, 'NON_CANONICAL_ID', `units.${unitKey}.id`, '课程 ID 必须与完整目录路径一致。');
    }
    registerId(unit.id, `units.${unitKey}.id`, seenIds, issues);
    validateEligibility(unit.type, unit.formalUnitNumber, unit.achievementEligible, `units.${unitKey}.achievementEligible`, issues);

    for (const difficulty of DIFFICULTIES) {
      const track = unit.difficultyTracks?.[difficulty];
      const trackPath = `units.${unitKey}.difficultyTracks.${difficulty}`;
      if (!track) {
        addIssue(issues, 'MISSING_DIFFICULTY', trackPath, `课程必须包含 ${difficulty} 难度。`);
        continue;
      }
      if (track.difficulty !== difficulty) {
        addIssue(issues, 'DIFFICULTY_KEY_MISMATCH', `${trackPath}.difficulty`, '难度数据必须与目录键一致。');
      }

      if (active && difficulty === 'basic' && track.tasks.length < 2) {
        addIssue(issues, 'BASIC_TASK_MINIMUM', `${trackPath}.tasks`, '基础版至少需要两个知识目标明确的任务。');
      }
      if (active && difficulty !== 'basic' && track.tasks.length !== 1) {
        addIssue(issues, 'TIER_TASK_COUNT', `${trackPath}.tasks`, '进阶版和高阶版各需要一个任务。');
      }

      track.tasks.forEach((task, taskIndex) => {
        validateTask(unit, task, difficulty, taskIndex, `${trackPath}.tasks[${taskIndex}]`, active, seenIds, issues);
      });
    }
  }

  return issues;
}
