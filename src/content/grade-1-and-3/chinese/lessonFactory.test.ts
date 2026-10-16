import { describe, expect, it } from 'vitest';
import { curriculum } from '../../curriculum';

const chineseUnits = Object.entries(curriculum.units)
  .filter(([id, unit]) => (id.startsWith('grade-1/') || id.startsWith('grade-3/')) && unit.subject === 'chinese');

function questionFingerprint(question: (typeof chineseUnits)[number][1]['difficultyTracks']['basic']['tasks'][number]['sessions'][number]['activities'][number]): string {
  if (question.kind === 'choice') {
    const correctLabel = question.options.find(({ id }) => id === question.correctOptionId)?.label;
    return JSON.stringify([question.kind, question.prompt, question.hint, question.explanation,
      [...question.options.map(({ label }) => label)].sort(), correctLabel]);
  }
  if (question.kind === 'match') {
    return JSON.stringify([question.kind, question.prompt, question.hint, question.explanation,
      question.pairs.map(({ left, right }) => [left, right]).sort(([left], [right]) => left.localeCompare(right))]);
  }
  if (question.kind === 'order') {
    const labelById = new Map(question.items.map(({ id, label }) => [id, label]));
    return JSON.stringify([question.kind, question.prompt, question.hint, question.explanation,
      question.correctOrder.map((id) => labelById.get(id)), question.items.map(({ label }) => label).sort()]);
  }
  if (question.kind === 'categorize') {
    const labelById = new Map(question.categories.map(({ id, label }) => [id, label]));
    return JSON.stringify([question.kind, question.prompt, question.hint, question.explanation,
      question.items.map(({ label, categoryId }) => [label, labelById.get(categoryId)] as const)
        .sort((left, right) => left[0].localeCompare(right[0])),
      question.categories.map(({ label }) => label)]);
  }
  return JSON.stringify(question);
}

function activitiesFor(unitId: string) {
  const unit = curriculum.units[unitId];
  if (!unit) throw new Error(`Missing curriculum unit: ${unitId}`);
  return Object.values(unit.difficultyTracks)
    .flatMap(({ tasks }) => tasks)
    .flatMap(({ sessions }) => sessions)
    .flatMap(({ activities }) => activities);
}

function categorizedLabels(unitId: string): Set<string> {
  return new Set(activitiesFor(unitId).flatMap((question) =>
    question.kind === 'categorize' ? question.items.map(({ label }) => label)
      : question.kind === 'match' && question.prompt === '把补充拼音卡和类别连起来。'
        ? question.pairs.map(({ left }) => left) : [],
  ));
}

describe('grade 1 and 3 Chinese course review', () => {
  it('does not repeat the same category as two separate standards in an answer', () => {
    const duplicateCategoryStandard = /“([^”]+)”和“\1”的标准/;
    const failures = chineseUnits.flatMap(([unitId]) => activitiesFor(unitId)
      .filter((activity) => activity.kind === 'choice')
      .flatMap((activity) => {
        const answer = activity.options.find(({ id }) => id === activity.correctOptionId)?.label ?? '';
        return duplicateCategoryStandard.test(answer) ? [`${activity.id}: ${answer}`] : [];
      }));

    expect(failures).toEqual([]);
  });

  it('does not reuse a complete question across the two tasks of the same course and tier', () => {
    const failures: string[] = [];
    for (const [unitId, unit] of chineseUnits) {
      for (const [difficulty, track] of Object.entries(unit.difficultyTracks)) {
        const [firstTask, secondTask] = track.tasks;
        const first = firstTask?.sessions.flatMap(({ activities }) => activities) ?? [];
        const second = secondTask?.sessions.flatMap(({ activities }) => activities) ?? [];
        const firstQuestions = new Set(first.map(questionFingerprint));
        second.forEach((question, index) => {
          if (firstQuestions.has(questionFingerprint(question))) {
            failures.push(`${unitId} ${difficulty} q${index + 1}`);
          }
        });
      }
    }
    expect(failures).toEqual([]);
  });

  it('varies at least half of each task across every pair of difficulty levels', () => {
    const tierPairs = [['basic', 'advanced'], ['basic', 'high'], ['advanced', 'high']] as const;
    const failures: string[] = [];

    for (const [unitId, unit] of chineseUnits) {
      for (const taskIndex of [0, 1]) {
        for (const [leftTier, rightTier] of tierPairs) {
          const left = unit.difficultyTracks[leftTier].tasks[taskIndex]!.sessions[0]!.activities;
          const right = unit.difficultyTracks[rightTier].tasks[taskIndex]!.sessions[0]!.activities;
          const distinctSlots = left.filter((question, index) =>
            questionFingerprint(question) !== questionFingerprint(right[index]!),
          ).length;
          if (distinctSlots < 4) failures.push(`${unitId} task ${taskIndex + 1} ${leftTier}/${rightTier}: ${distinctSlots}/8`);
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it('covers the textbook single finals and initial groups in the first pinyin unit', () => {
    expect(categorizedLabels('grade-1/term-1/chinese/unit-02')).toEqual(new Set([
      'a', 'o', 'e', 'i', 'u', 'ü', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h',
      'j', 'q', 'x', 'z', 'c', 's', 'zh', 'ch', 'sh', 'r', 'y', 'w',
    ]));
  });

  it('covers the textbook compound finals, nasal finals, and whole syllables in the second pinyin unit', () => {
    expect(categorizedLabels('grade-1/term-1/chinese/unit-03')).toEqual(new Set([
      'ai', 'ei', 'ui', 'ao', 'ou', 'iu', 'ie', 'üe', 'er', 'an', 'en', 'in', 'un', 'ün',
      'ang', 'eng', 'ing', 'ong', 'zhi', 'chi', 'shi', 'ri', 'zi', 'ci', 'si', 'yi', 'wu',
      'yu', 'ye', 'yue', 'yuan', 'yin', 'yun', 'ying',
    ]));
  });

  it('limits pinyin card sorts to eight items and keeps the unit-two explanation in scope', () => {
    const firstUnit = activitiesFor('grade-1/term-1/chinese/unit-02');
    const secondUnit = activitiesFor('grade-1/term-1/chinese/unit-03');
    for (const activity of [...firstUnit, ...secondUnit]) {
      if (activity.kind === 'categorize') expect(activity.items.length).toBeLessThanOrEqual(8);
    }
    const firstUnitText = firstUnit.flatMap((activity) => [activity.prompt, activity.hint, activity.explanation]).join('\n');
    expect(firstUnitText).not.toContain('整体认读音节');
  });

  it('classifies “交流” as an expression and communication activity', () => {
    const questions = activitiesFor('grade-3/term-1/chinese/unit-01');
    const communication = questions.flatMap((question) => {
      if (question.kind !== 'categorize') return [];
      const card = question.items.find(({ label }) => label === '交流');
      if (!card) return [];
      const category = question.categories.find(({ id }) => id === card.categoryId);
      return category ? [category.label] : [];
    });
    expect(communication.length).toBeGreaterThan(0);
    expect(new Set(communication)).toEqual(new Set(['表达形式']));
  });

  it('does not present whole syllables as letter-by-letter spelling or dictionary meanings', () => {
    const pinyinQuestions = activitiesFor('grade-1/term-1/chinese/unit-03');
    const text = pinyinQuestions.flatMap((question) => [
      question.prompt,
      question.hint,
      question.explanation,
      ...(question.kind === 'order' ? question.items.map(({ label }) => label) : []),
    ]).join('\n');
    expect(text).not.toMatch(/按顺序读出字母音/);
    expect(text).not.toMatch(/解释.{0,8}(zhi|ang).{0,8}意思/i);
  });

  it('uses pinyin-specific language in advanced and high application questions', () => {
    for (const unitId of ['grade-1/term-1/chinese/unit-02', 'grade-1/term-1/chinese/unit-03']) {
      const unit = curriculum.units[unitId];
      expect(unit).toBeDefined();
      if (!unit) continue;

      for (const difficulty of ['advanced', 'high'] as const) {
        for (const task of unit.difficultyTracks[difficulty].tasks) {
          const question = task.sessions[0]?.activities[7];
          expect(question?.kind).toBe('choice');
          if (!question || question.kind !== 'choice') continue;
          const text = [question.prompt, question.hint, question.explanation, ...question.options.map(({ label }) => label)]
            .join('\n');
          expect(text).not.toMatch(/词义|词语意思|主题线索|用在新的.{0,12}情境/);
        }
      }
    }
  });

  it('keeps the grade-three imagination task about coherent creative ideas', () => {
    const unit = curriculum.units['grade-3/term-2/chinese/unit-05'];
    expect(unit).toBeDefined();
    if (!unit) return;

    for (const difficulty of ['advanced', 'high'] as const) {
      const question = unit.difficultyTracks[difficulty].tasks[1]?.sessions[0]?.activities[5];
      expect(question?.kind).toBe('choice');
      if (question?.kind !== 'choice') continue;
      const text = [question.prompt, question.hint, question.explanation, ...question.options.map(({ label }) => label)].join('\n');
      expect(text).toMatch(/想象|新奇事物/);
      expect(text).not.toMatch(/观察到的具体线索|回看实际线索|观察到什么/);
    }
  });
});
