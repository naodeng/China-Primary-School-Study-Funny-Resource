import { describe, expect, it } from 'vitest';
import { curriculum } from './curriculum';

const canonicalEntryPattern = /^grade-\d+\/term-[12]\/(?:chinese|math|english)\/(?:unit|review|integrated-practice)-\d{2}$/;
const courseEntryModules = import.meta.glob('./grade-*/term-*/**/index.ts');

interface RegisteredEntry {
  id: string;
  subjectId: string;
  curriculumUnitKey: string;
}

interface LayoutReport {
  missing: string[];
  unregistered: string[];
  invalid: string[];
}

function getPlayableEntries(): RegisteredEntry[] {
  return curriculum.grades.flatMap((grade) =>
    grade.terms.flatMap((term) =>
      term.subjects.flatMap((subject) =>
        subject.units.flatMap((entry) =>
          entry.status === 'active' && entry.curriculumUnitKey
            ? [{ id: entry.id, subjectId: subject.id, curriculumUnitKey: entry.curriculumUnitKey }]
            : [],
        ),
      ),
    ),
  );
}

function inspectLayout(expectedDirectories: string[], actualDirectories: string[]): LayoutReport {
  const expected = new Set(expectedDirectories);
  const actual = new Set(actualDirectories);

  return {
    missing: [...expected].filter((directory) => !actual.has(directory)).sort(),
    unregistered: [...actual].filter((directory) => !expected.has(directory)).sort(),
    invalid: [...actual].filter((directory) => !canonicalEntryPattern.test(directory)).sort(),
  };
}

describe('curriculum directory layout', () => {
  it('matchesEveryPlayableRegistryEntryToOneCanonicalDirectory', () => {
    const entries = getPlayableEntries();
    const expectedDirectories = entries.map((entry) => entry.curriculumUnitKey);
    const actualDirectories = Object.keys(courseEntryModules).map((path) => path.replace(/^\.\//, '').replace(/\/index\.ts$/, ''));

    expect(entries).toHaveLength(53);
    expect(entries.filter((entry) => entry.subjectId === 'chinese')).toHaveLength(16);
    expect(entries.filter((entry) => entry.subjectId === 'math')).toHaveLength(21);
    expect(entries.filter((entry) => entry.subjectId === 'english')).toHaveLength(16);
    expect(new Set(expectedDirectories).size).toBe(expectedDirectories.length);
    expect(inspectLayout(expectedDirectories, actualDirectories)).toEqual({
      missing: [],
      unregistered: [],
      invalid: [],
    });
  });

  it('rejectsMissingEntryFilesAndUnregisteredEntryDirectories', () => {
    const registered = ['grade-2/term-1/chinese/unit-01'];

    expect(inspectLayout(registered, [])).toMatchObject({
      missing: registered,
      unregistered: [],
    });
    expect(inspectLayout(registered, [...registered, 'grade-2/term-1/chinese/unit-99'])).toMatchObject({
      missing: [],
      unregistered: ['grade-2/term-1/chinese/unit-99'],
    });
  });

  it('usesExpectedGradeTermSubjectAndEntrySlugs', () => {
    const registeredDirectories = getPlayableEntries().map((entry) => entry.curriculumUnitKey);
    const invalidDirectory = 'grade-2/term-1/chinese/topic-01';

    expect(registeredDirectories.every((directory) => canonicalEntryPattern.test(directory))).toBe(true);
    expect(inspectLayout([], [invalidDirectory]).invalid).toEqual([invalidDirectory]);
  });
});
