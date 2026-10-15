import { describe, expect, it } from 'vitest';
import { validateCurriculum } from './validateCurriculum';
import type { ActivityDefinition, Curriculum } from './types';

const unitKey = 'grade-2/term-1/chinese/unit-01';
const textbookId = 'textbook-grade-2-term-1-chinese';

function createSession(sessionId: string) {
  return {
    id: sessionId,
    title: '字词观察站',
    durationMinutes: 20 as const,
    objective: '观察字词并发现规律。',
    companionId: 'companion-02' as const,
    activities: Array.from({ length: 8 }, (_, index) => ({
      id: `question-${String(index + 1).padStart(2, '0')}`,
      kind: 'choice' as const,
      prompt: `第 ${index + 1} 题`,
      hint: '再看看题目中的线索。',
      explanation: '找到线索就能一步步解答。',
      options: [
        { id: 'correct', label: '正确线索' },
        { id: 'other', label: '另一个选择' },
      ],
      correctOptionId: 'correct',
    })),
  };
}

function createTask(difficulty: 'basic' | 'advanced' | 'high', number: number) {
  const taskId = `${unitKey}/${difficulty}/task-${String(number).padStart(2, '0')}`;
  return {
    id: taskId,
    title: `${difficulty} 任务 ${number}`,
    objective: '完成一个明确的学习目标。',
    order: number,
    sessions: [createSession(`${taskId}/session-01`)],
  };
}

function createCurriculum(): Curriculum {
  const unit = {
    id: unitKey,
    subject: 'chinese',
    title: '第一单元 · 阅读',
    type: 'unit',
    formalUnitNumber: 1,
    achievementEligible: true,
    textbookEditionId: textbookId,
    sourceTopics: ['看图理解', '根据线索推断'],
    difficultyTracks: {
      basic: { difficulty: 'basic', tasks: [createTask('basic', 1), createTask('basic', 2)] },
      advanced: { difficulty: 'advanced', tasks: [createTask('advanced', 1), createTask('advanced', 2)] },
      high: { difficulty: 'high', tasks: [createTask('high', 1), createTask('high', 2)] },
    },
  };

  return {
    textbooks: {
      [textbookId]: {
        id: textbookId,
        subject: 'chinese',
        grade: 2,
        term: 1,
        series: '人教版统编语文',
        edition: '2025年修订版',
        printing: '2025年6月第1次印刷',
        isbn: '9787100000000',
        sourceKind: 'pep-latest',
        sourceUrl: 'https://www.pep.com.cn/',
        latestPepEvidenceUrl: 'https://www.pep.com.cn/',
        fallbackReason: null,
        checkedAt: '2026-10-13',
        tapxCommit: null,
        verificationStatus: 'verified',
      },
    },
    grades: [{
      id: 'grade-2',
      title: '二年级',
      terms: [{
        id: 'term-1',
        title: '上学期',
        subjects: [{
          id: 'chinese',
          title: '语文',
          units: [{
            id: 'unit-01',
            title: '第一单元 · 阅读',
            status: 'active',
            type: 'unit',
            formalUnitNumber: 1,
            achievementEligible: true,
            textbookEditionId: textbookId,
            curriculumUnitKey: unitKey,
          }],
        }],
      }],
    }],
    units: { [unitKey]: unit },
  } as unknown as Curriculum;
}

function setTierTaskCount(curriculum: Curriculum, difficulty: 'advanced' | 'high', count: number) {
  const tasks = curriculum.units[unitKey].difficultyTracks[difficulty].tasks;
  tasks.splice(0, tasks.length, ...Array.from({ length: count }, (_, index) => createTask(difficulty, index + 1)));
}

function activityBase(id: string) {
  return {
    id,
    prompt: '观察线索并完成挑战。',
    hint: '慢慢寻找题目里的提示。',
    explanation: '你找到了对应的线索。',
  };
}

function createActivitiesForEveryKind(): ActivityDefinition[] {
  return [
    {
      ...activityBase('choice'), kind: 'choice', options: [{ id: 'yes', label: '正确' }, { id: 'no', label: '再想想' }], correctOptionId: 'yes',
    },
    {
      ...activityBase('match'), kind: 'match', pairs: [{ id: 'first', left: '甲', right: '一' }, { id: 'second', left: '乙', right: '二' }],
    },
    {
      ...activityBase('order'), kind: 'order', items: [{ id: 'first', label: '先' }, { id: 'second', label: '后' }], correctOrder: ['first', 'second'],
    },
    {
      ...activityBase('categorize'), kind: 'categorize',
      categories: [{ id: 'living', label: '生物' }, { id: 'other', label: '其他' }],
      items: [{ id: 'plant', label: '花朵', categoryId: 'living' }, { id: 'stone', label: '石头', categoryId: 'other' }],
    },
    {
      ...activityBase('measurement'), kind: 'measurement', objectLabel: '彩带', targetLengthCm: 8, minCm: 7, maxCm: 9,
    },
    {
      ...activityBase('arithmetic'), kind: 'arithmetic', expression: '3 + 4', correctAnswer: 7,
    },
  ];
}

describe('validateCurriculum', () => {
  it('acceptsEverySupportedActivityKindAndReportsUnknownKinds', () => {
    const curriculum = createCurriculum();
    const activities = createActivitiesForEveryKind();
    const session = curriculum.units[unitKey].difficultyTracks.basic.tasks[0].sessions[0];
    session.activities.splice(0, activities.length, ...activities);
    session.activities[6] = { ...activityBase('unknown'), kind: 'unknown' } as unknown as ActivityDefinition;

    expect(validateCurriculum(curriculum)).toContainEqual(expect.objectContaining({
      code: 'UNSUPPORTED_ACTIVITY_KIND',
      path: `${session.id}.activities[6].kind`,
    }));
  });

  it('rejectsMalformedAnswersAndDuplicateActivityIdsAcrossKinds', () => {
    const curriculum = createCurriculum();
    const activities = createActivitiesForEveryKind();
    const [choice, match, order, categorize, measurement, arithmetic] = activities;
    if (choice.kind !== 'choice' || match.kind !== 'match' || order.kind !== 'order'
      || categorize.kind !== 'categorize' || measurement.kind !== 'measurement' || arithmetic.kind !== 'arithmetic') {
      throw new Error('Activity fixture order is inconsistent.');
    }

    choice.options[1].id = choice.options[0].id;
    choice.correctOptionId = 'missing';
    match.pairs.splice(1, 1);
    order.items[1].id = order.items[0].id;
    order.correctOrder = ['missing', 'second'];
    categorize.categories[1].id = categorize.categories[0].id;
    categorize.items[1].id = categorize.items[0].id;
    categorize.items[0].categoryId = 'missing';
    measurement.targetLengthCm = Number.POSITIVE_INFINITY;
    arithmetic.correctAnswer = Number.POSITIVE_INFINITY;

    const session = curriculum.units[unitKey].difficultyTracks.basic.tasks[0].sessions[0];
    session.activities.splice(0, activities.length, ...activities);
    const issues = validateCurriculum(curriculum);

    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'DUPLICATE_ID', path: `${session.id}.activities[0].options[1].id` }),
      expect.objectContaining({ code: 'INVALID_ANSWER_REFERENCE', path: `${session.id}.activities[0].correctOptionId` }),
      expect.objectContaining({ code: 'INVALID_ANSWER_REFERENCE', path: `${session.id}.activities[1].pairs` }),
      expect.objectContaining({ code: 'DUPLICATE_ID', path: `${session.id}.activities[2].items[1].id` }),
      expect.objectContaining({ code: 'INVALID_ANSWER_REFERENCE', path: `${session.id}.activities[2].correctOrder` }),
      expect.objectContaining({ code: 'DUPLICATE_ID', path: `${session.id}.activities[3].categories[1].id` }),
      expect.objectContaining({ code: 'DUPLICATE_ID', path: `${session.id}.activities[3].items[1].id` }),
      expect.objectContaining({ code: 'INVALID_ANSWER_REFERENCE', path: `${session.id}.activities[3].items[0].categoryId` }),
      expect.objectContaining({ code: 'INVALID_ANSWER_REFERENCE', path: `${session.id}.activities[4].targetLengthCm` }),
      expect.objectContaining({ code: 'INVALID_ANSWER_REFERENCE', path: `${session.id}.activities[5].correctAnswer` }),
    ]));
  });

  it('coversNonUnitAchievementEligibilityWithoutTreatingItAsAnError', () => {
    const practice = createCurriculum();
    const entry = practice.grades[0].terms[0].subjects[0].units[0];
    const unit = practice.units[unitKey];
    entry.type = 'review';
    entry.formalUnitNumber = null;
    entry.achievementEligible = false;
    unit.type = 'review';
    unit.formalUnitNumber = null;
    unit.achievementEligible = false;
    expect(validateCurriculum(practice)).toEqual([]);

    const unnumbered = createCurriculum();
    const unnumberedEntry = unnumbered.grades[0].terms[0].subjects[0].units[0];
    const unnumberedUnit = unnumbered.units[unitKey];
    unnumberedEntry.formalUnitNumber = null;
    unnumberedEntry.achievementEligible = false;
    unnumberedUnit.formalUnitNumber = null;
    unnumberedUnit.achievementEligible = false;
    expect(validateCurriculum(unnumbered)).toEqual([]);

    const zeroNumber = createCurriculum();
    const zeroEntry = zeroNumber.grades[0].terms[0].subjects[0].units[0];
    const zeroUnit = zeroNumber.units[unitKey];
    zeroEntry.formalUnitNumber = 0;
    zeroEntry.achievementEligible = false;
    zeroUnit.formalUnitNumber = 0;
    zeroUnit.achievementEligible = false;
    expect(validateCurriculum(zeroNumber)).toEqual([]);
  });

  it('checksCatalogReferencesTaskIdsDifficultyAndInactiveContent', () => {
    const curriculum = createCurriculum() as unknown as {
      grades: Array<{ terms: Array<{ subjects: Array<{ units: Array<Record<string, unknown>> }> }> }>;
      units: Record<string, {
        id: string;
        difficultyTracks: Record<string, { difficulty: string; tasks: Array<{ id: string; order: number; sessions: Array<{ id: string; activities: unknown[] }> }> }>;
      }>;
      textbooks: Record<string, { grade: number }>;
    };
    const entry = curriculum.grades[0].terms[0].subjects[0].units[0];
    const unit = curriculum.units[unitKey];
    const task = unit.difficultyTracks.basic.tasks[0];
    const session = task.sessions[0];
    entry.textbookEditionId = 'missing-book';
    entry.curriculumUnitKey = `${unitKey}/missing`;
    entry.achievementEligible = false;
    entry.formalUnitNumber = null;
    unit.id = 'wrong-unit-id';
    unit.difficultyTracks.basic.difficulty = 'advanced';
    task.id = 'wrong-task-id';
    task.order = 9;
    session.id = 'wrong-session-id';

    const issues = validateCurriculum(curriculum as unknown as Curriculum);
    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'UNKNOWN_TEXTBOOK_EDITION' }),
      expect.objectContaining({ code: 'MISSING_CURRICULUM_UNIT' }),
      expect.objectContaining({ code: 'NON_CANONICAL_ID', path: `units.${unitKey}.id` }),
      expect.objectContaining({ code: 'DIFFICULTY_KEY_MISMATCH' }),
      expect.objectContaining({ code: 'NON_CANONICAL_ID', path: `units.${unitKey}.difficultyTracks.basic.tasks[0].id` }),
      expect.objectContaining({ code: 'TASK_ORDER_MISMATCH' }),
      expect.objectContaining({ code: 'NON_CANONICAL_ID', path: `units.${unitKey}.difficultyTracks.basic.tasks[0].sessions[0].id` }),
    ]));

    const inactive = createCurriculum() as unknown as {
      grades: Array<{ terms: Array<{ subjects: Array<{ units: Array<{ status: string }> }> }> }>;
      units: Record<string, {
        difficultyTracks: {
          basic: {
            tasks: Array<{ sessions: Array<{ activities: unknown[] }> }>;
          };
        };
      }>;
    };
    inactive.grades[0].terms[0].subjects[0].units[0].status = 'comingSoon';
    inactive.units[unitKey].difficultyTracks.basic.tasks[0].sessions[0].activities.pop();
    expect(validateCurriculum(inactive as unknown as Curriculum)).not.toContainEqual(expect.objectContaining({ code: 'SESSION_QUESTION_COUNT' }));

    const mismatchedEdition = createCurriculum();
    mismatchedEdition.textbooks[textbookId].grade = 1;
    expect(validateCurriculum(mismatchedEdition)).toContainEqual(expect.objectContaining({ code: 'TEXTBOOK_REFERENCE_MISMATCH' }));

    const missingUnitKey = createCurriculum();
    missingUnitKey.grades[0].terms[0].subjects[0].units[0].curriculumUnitKey = undefined;
    expect(validateCurriculum(missingUnitKey)).toContainEqual(expect.objectContaining({ code: 'ACTIVE_ENTRY_REQUIRES_CURRICULUM' }));
  });

  it('requiresAllDifficulties', () => {
    const curriculum = createCurriculum() as unknown as { units: Record<string, { difficultyTracks: Record<string, unknown> }> };
    delete curriculum.units[unitKey].difficultyTracks.advanced;

    expect(validateCurriculum(curriculum as unknown as Curriculum)).toContainEqual(expect.objectContaining({
      code: 'MISSING_DIFFICULTY',
      path: `units.${unitKey}.difficultyTracks.advanced`,
    }));
  });

  it('requiresTwoBasicTasks', () => {
    const curriculum = createCurriculum() as unknown as { units: Record<string, { difficultyTracks: { basic: { tasks: unknown[] } } }> };
    curriculum.units[unitKey].difficultyTracks.basic.tasks.pop();

    expect(validateCurriculum(curriculum as unknown as Curriculum)).toContainEqual(expect.objectContaining({
      code: 'BASIC_TASK_MINIMUM',
      path: `units.${unitKey}.difficultyTracks.basic.tasks`,
    }));
  });

  it('requiresExactlyTwoAdvancedTasks', () => {
    const curriculum = createCurriculum();
    setTierTaskCount(curriculum, 'advanced', 2);

    expect(validateCurriculum(curriculum)).not.toContainEqual(expect.objectContaining({
      code: 'TIER_TASK_COUNT',
      path: `units.${unitKey}.difficultyTracks.advanced.tasks`,
    }));
  });

  it('rejectsOneAdvancedTask', () => {
    const curriculum = createCurriculum();
    setTierTaskCount(curriculum, 'advanced', 1);

    expect(validateCurriculum(curriculum)).toContainEqual(expect.objectContaining({
      code: 'TIER_TASK_COUNT',
      path: `units.${unitKey}.difficultyTracks.advanced.tasks`,
      message: '进阶版和高阶版都必须恰好包含两个任务。',
    }));
  });

  it('rejectsThreeAdvancedTasks', () => {
    const curriculum = createCurriculum();
    setTierTaskCount(curriculum, 'advanced', 3);

    expect(validateCurriculum(curriculum)).toContainEqual(expect.objectContaining({
      code: 'TIER_TASK_COUNT',
      path: `units.${unitKey}.difficultyTracks.advanced.tasks`,
      message: '进阶版和高阶版都必须恰好包含两个任务。',
    }));
  });

  it('requiresExactlyTwoHighTasks', () => {
    const curriculum = createCurriculum();
    setTierTaskCount(curriculum, 'high', 2);

    expect(validateCurriculum(curriculum)).not.toContainEqual(expect.objectContaining({
      code: 'TIER_TASK_COUNT',
      path: `units.${unitKey}.difficultyTracks.high.tasks`,
    }));
  });

  it('rejectsOneHighTask', () => {
    const curriculum = createCurriculum();
    setTierTaskCount(curriculum, 'high', 1);

    expect(validateCurriculum(curriculum)).toContainEqual(expect.objectContaining({
      code: 'TIER_TASK_COUNT',
      path: `units.${unitKey}.difficultyTracks.high.tasks`,
      message: '进阶版和高阶版都必须恰好包含两个任务。',
    }));
  });

  it('rejectsThreeHighTasks', () => {
    const curriculum = createCurriculum();
    setTierTaskCount(curriculum, 'high', 3);

    expect(validateCurriculum(curriculum)).toContainEqual(expect.objectContaining({
      code: 'TIER_TASK_COUNT',
      path: `units.${unitKey}.difficultyTracks.high.tasks`,
      message: '进阶版和高阶版都必须恰好包含两个任务。',
    }));
  });

  it('rejectsEmptyTasks', () => {
    const curriculum = createCurriculum() as unknown as { units: Record<string, { difficultyTracks: { basic: { tasks: Array<{ sessions: unknown[] }> } } }> };
    curriculum.units[unitKey].difficultyTracks.basic.tasks[0].sessions = [];

    expect(validateCurriculum(curriculum as unknown as Curriculum)).toContainEqual(expect.objectContaining({
      code: 'TASK_REQUIRES_SESSION',
      path: `units.${unitKey}.difficultyTracks.basic.tasks[0].sessions`,
    }));
  });

  it('requiresEightQuestions', () => {
    const curriculum = createCurriculum() as unknown as { units: Record<string, { difficultyTracks: { basic: { tasks: Array<{ sessions: Array<{ activities: unknown[] }> }> } } }> };
    curriculum.units[unitKey].difficultyTracks.basic.tasks[0].sessions[0].activities.pop();

    expect(validateCurriculum(curriculum as unknown as Curriculum)).toContainEqual(expect.objectContaining({
      code: 'SESSION_QUESTION_COUNT',
      path: `units.${unitKey}.difficultyTracks.basic.tasks[0].sessions[0].activities`,
    }));
  });

  it('rejectsDuplicateIds', () => {
    const curriculum = createCurriculum() as unknown as { units: Record<string, { difficultyTracks: { basic: { tasks: Array<{ id: string }> } } }> };
    curriculum.units[unitKey].difficultyTracks.basic.tasks[1].id = curriculum.units[unitKey].difficultyTracks.basic.tasks[0].id;

    expect(validateCurriculum(curriculum as unknown as Curriculum)).toContainEqual(expect.objectContaining({
      code: 'DUPLICATE_ID',
      path: `units.${unitKey}.difficultyTracks.basic.tasks[1].id`,
    }));
  });

  it('rejectsInvalidAnswerReferences', () => {
    const curriculum = createCurriculum() as unknown as { units: Record<string, { difficultyTracks: { basic: { tasks: Array<{ sessions: Array<{ activities: Array<{ correctOptionId: string }> }> }> } } }> };
    curriculum.units[unitKey].difficultyTracks.basic.tasks[0].sessions[0].activities[0].correctOptionId = 'missing';

    expect(validateCurriculum(curriculum as unknown as Curriculum)).toContainEqual(expect.objectContaining({
      code: 'INVALID_ANSWER_REFERENCE',
      path: `${unitKey}/basic/task-01/session-01.activities[0].correctOptionId`,
    }));
  });

  it('validatesAchievementEligibility', () => {
    const curriculum = createCurriculum() as unknown as { units: Record<string, { achievementEligible: boolean }> };
    curriculum.units[unitKey].achievementEligible = false;

    expect(validateCurriculum(curriculum as unknown as Curriculum)).toContainEqual(expect.objectContaining({
      code: 'ACHIEVEMENT_ELIGIBILITY_MISMATCH',
      path: `units.${unitKey}.achievementEligible`,
    }));
  });

  it('requiresVerifiedEditionForActiveEntry', () => {
    const curriculum = createCurriculum() as unknown as { textbooks: Record<string, { verificationStatus: string }> };
    curriculum.textbooks[textbookId].verificationStatus = 'pending';

    expect(validateCurriculum(curriculum as unknown as Curriculum)).toContainEqual(expect.objectContaining({
      code: 'ACTIVE_ENTRY_REQUIRES_VERIFIED_TEXTBOOK',
      path: 'grades[0].terms[0].subjects[0].units[0].textbookEditionId',
    }));
  });

  it('validatesTapxFallbackMetadata', () => {
    const curriculum = createCurriculum() as unknown as { textbooks: Record<string, Record<string, unknown>> };
    const book = curriculum.textbooks[textbookId];
    book.sourceKind = 'tapx-fallback';
    book.sourceUrl = 'https://github.com/TapXWorld/ChinaTextbook/blob/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/%E5%B0%8F%E5%AD%A6/example.pdf';
    book.latestPepEvidenceUrl = 'https://www.pep.com.cn/bks/evidence.pdf';
    book.fallbackReason = '人教社公开资料未提供本册完整新版学生书和目录。';
    book.tapxCommit = '5a80345f2043ba6f8db8d7be9cf3db82725ff1f7';

    expect(validateCurriculum(curriculum as unknown as Curriculum)).toEqual([]);

    book.sourceUrl = 'https://github.com/TapXWorld/ChinaTextbook/blob/other-commit/%E5%B0%8F%E5%AD%A6/example.pdf';
    book.fallbackReason = '   ';
    book.latestPepEvidenceUrl = 'https://example.com/not-pep';
    const issues = validateCurriculum(curriculum as unknown as Curriculum);

    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'TAPX_SOURCE_COMMIT_MISMATCH', path: `textbooks.${textbookId}.sourceUrl` }),
      expect.objectContaining({ code: 'TAPX_FALLBACK_REASON_REQUIRED', path: `textbooks.${textbookId}.fallbackReason` }),
      expect.objectContaining({ code: 'PEP_EVIDENCE_URL_INVALID', path: `textbooks.${textbookId}.latestPepEvidenceUrl` }),
    ]));
  });

  it('requiresOfficialPepUrlForPepLatestEdition', () => {
    const curriculum = createCurriculum() as unknown as { textbooks: Record<string, Record<string, unknown>> };
    curriculum.textbooks[textbookId].sourceUrl = 'https://example.com/textbook.pdf';

    expect(validateCurriculum(curriculum as unknown as Curriculum)).toContainEqual(expect.objectContaining({
      code: 'PEP_SOURCE_URL_INVALID',
      path: `textbooks.${textbookId}.sourceUrl`,
    }));
  });

  it('rejectsMalformedEvidenceUrls', () => {
    const curriculum = createCurriculum() as unknown as { textbooks: Record<string, Record<string, unknown>> };
    curriculum.textbooks[textbookId].latestPepEvidenceUrl = 'not a URL';

    expect(validateCurriculum(curriculum as unknown as Curriculum)).toContainEqual(expect.objectContaining({
      code: 'PEP_EVIDENCE_URL_INVALID',
      path: `textbooks.${textbookId}.latestPepEvidenceUrl`,
    }));
  });

  it('requiresTapxCommitAndRejectsMalformedValues', () => {
    const curriculum = createCurriculum() as unknown as { textbooks: Record<string, Record<string, unknown>> };
    const book = curriculum.textbooks[textbookId];
    book.sourceKind = 'tapx-fallback';
    book.latestPepEvidenceUrl = 'https://pep.com.cn/evidence';
    book.fallbackReason = '新版学生书完整目录尚未找到。';
    book.tapxCommit = null;
    expect(validateCurriculum(curriculum as unknown as Curriculum)).toContainEqual(expect.objectContaining({
      code: 'TAPX_COMMIT_REQUIRED',
      path: `textbooks.${textbookId}.tapxCommit`,
    }));

    book.tapxCommit = 'not-a-commit';
    expect(validateCurriculum(curriculum as unknown as Curriculum)).toContainEqual(expect.objectContaining({
      code: 'TAPX_COMMIT_INVALID',
      path: `textbooks.${textbookId}.tapxCommit`,
    }));
  });

  it('rejectsTapxDirectoryLinksWithoutAPdf', () => {
    const curriculum = createCurriculum() as unknown as { textbooks: Record<string, Record<string, unknown>> };
    const book = curriculum.textbooks[textbookId];
    book.sourceKind = 'tapx-fallback';
    book.tapxCommit = '5a80345f2043ba6f8db8d7be9cf3db82725ff1f7';
    book.sourceUrl = 'not a URL';
    book.latestPepEvidenceUrl = 'https://pep.com.cn/evidence';
    book.fallbackReason = '新版学生书完整目录尚未找到。';

    expect(validateCurriculum(curriculum as unknown as Curriculum)).toContainEqual(expect.objectContaining({
      code: 'TAPX_SOURCE_COMMIT_MISMATCH',
      path: `textbooks.${textbookId}.sourceUrl`,
    }));

    book.sourceUrl = `https://github.com/TapXWorld/ChinaTextbook/blob/${book.tapxCommit}/directory/`;
    expect(validateCurriculum(curriculum as unknown as Curriculum)).toContainEqual(expect.objectContaining({
      code: 'TAPX_SOURCE_COMMIT_MISMATCH',
      path: `textbooks.${textbookId}.sourceUrl`,
    }));
  });

  it('rejectsFallbackFieldsOnPepLatestAndUnknownSourceKinds', () => {
    const curriculum = createCurriculum() as unknown as { textbooks: Record<string, Record<string, unknown>> };
    const book = curriculum.textbooks[textbookId];
    book.tapxCommit = '5a80345f2043ba6f8db8d7be9cf3db82725ff1f7';
    book.fallbackReason = '旧版本回退';
    expect(validateCurriculum(curriculum as unknown as Curriculum)).toContainEqual(expect.objectContaining({
      code: 'PEP_FALLBACK_METADATA_UNEXPECTED',
      path: `textbooks.${textbookId}`,
    }));

    book.sourceKind = 'unknown-source';
    expect(validateCurriculum(curriculum as unknown as Curriculum)).toContainEqual(expect.objectContaining({
      code: 'TEXTBOOK_SOURCE_KIND_INVALID',
      path: `textbooks.${textbookId}.sourceKind`,
    }));
  });
});
