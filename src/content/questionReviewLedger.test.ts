import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { curriculum } from './curriculum';

type ReviewRow = Record<string, string>;

const ledgerPath = resolve(process.cwd(), 'docs/curriculum/grade-2-question-review.tsv');
const questionIdPattern = /grade-2\/term-[12]\/chinese\/(?:unit-\d{2})\/(?:basic|advanced|high)\/task-\d{2}\/session-\d{2}\/question-\d{2}|grade-2\/term-[12]\/math\/(?:unit-\d{2}|integrated-practice-\d{2})\/(?:basic|advanced|high)\/task-\d{2}\/session-\d{2}\/question-\d{2}|grade-2\/term-[12]\/english\/(?:unit-\d{2}|review-\d{2})\/(?:basic|advanced|high)\/task-\d{2}\/session-\d{2}\/question-\d{2}/;

function readRows(): ReviewRow[] {
  const [headerLine, ...dataLines] = readFileSync(ledgerPath, 'utf8').trim().split(/\r?\n/);
  if (!headerLine) return [];
  const headers = headerLine.replace(/^\uFEFF/, '').split('\t');

  return dataLines.map((line) => Object.fromEntries(
    line.split('\t').map((value, index) => [headers[index] ?? `column-${index}`, value]),
  ));
}

function questionCount(unitKey: string): number {
  return Object.values(curriculum.units[unitKey]?.difficultyTracks ?? {})
    .flatMap(({ tasks }) => tasks)
    .flatMap(({ sessions }) => sessions)
    .reduce((total, session) => total + session.activities.length, 0);
}

describe('curriculum question review ledger', () => {
  it('listsEveryPlayableEntryExactlyOnce', () => {
    const rows = readRows();
    const ids = rows.map(({ '课程ID': id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.toSorted()).toEqual(Object.keys(curriculum.units).toSorted());
  });

  it('requiresEveryQuestionToBeReviewed', () => {
    const rowsById = new Map(readRows().map((row) => [row['课程ID'], row]));

    Object.keys(curriculum.units).forEach((unitKey) => {
      const row = rowsById.get(unitKey);
      const expectedCount = questionCount(unitKey);
      expect(row, `missing review row for ${unitKey}`).toBeDefined();
      expect(Number(row?.['题目总数']), `question total for ${unitKey}`).toBe(expectedCount);
      expect(Number(row?.['已审数量']), `reviewed question total for ${unitKey}`).toBe(expectedCount);
    });
  });

  it('requiresAllEditorialDimensionsComplete', () => {
    readRows().forEach((row) => {
      expect(row['答案正确性'], row['课程ID']).toBe('完成');
      expect(row['题目清晰度'], row['课程ID']).toBe('完成');
      expect(row['年龄适配'], row['课程ID']).toBe('完成');
      expect(row['教材主题对齐'], row['课程ID']).toBe('完成');
      expect(row['难度归属'], row['课程ID']).toBe('完成');
      expect(row['状态'], row['课程ID']).toBe('完成');
    });
  });

  it('recordsQuestionIdsForRepairs', () => {
    const knownQuestionIds = new Set(Object.values(curriculum.units)
      .flatMap(({ difficultyTracks }) => Object.values(difficultyTracks))
      .flatMap(({ tasks }) => tasks)
      .flatMap(({ sessions }) => sessions)
      .flatMap(({ activities }) => activities.map(({ id }) => id)));

    readRows().forEach((row) => {
      const record = row['修复记录']?.trim();
      if (!record || record === '无') return;

      record.split('；').forEach((repair) => {
        const match = repair.match(questionIdPattern);
        expect(match, `repair record needs a complete question ID: ${row['课程ID']} / ${repair}`).not.toBeNull();
        expect(match?.[0].startsWith(`${row['课程ID']}/`), `repair ID must belong to ${row['课程ID']}`).toBe(true);
        expect(knownQuestionIds.has(match?.[0] ?? ''), `repair ID must exist in the curriculum: ${match?.[0]}`).toBe(true);
        expect(repair.replace(questionIdPattern, '').replace(/[：:，,。\s]/g, '').length,
          `repair record needs a reason: ${row['课程ID']} / ${repair}`).toBeGreaterThan(0);
      });
    });
  });
});
