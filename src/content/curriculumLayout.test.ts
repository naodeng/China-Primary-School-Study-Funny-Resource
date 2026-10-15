import { describe, expect, it } from 'vitest';
import { curriculum } from './curriculum';
import { entryDirectoriesFromFiles, inspectLayout } from './curriculumLayout';

const courseFiles = import.meta.glob('./grade-*/term-*/**/*', { query: '?raw', import: 'default' });
const courseEntryModules = import.meta.glob('./grade-*/term-*/**/index.ts');

interface RegisteredEntry {
  id: string;
  subjectId: string;
  curriculumUnitKey: string;
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

describe('curriculum directory layout', () => {
  it('matchesEveryPlayableRegistryEntryToOneCanonicalDirectory', () => {
    const entries = getPlayableEntries();
    const expectedDirectories = entries.map((entry) => entry.curriculumUnitKey);
    const actualDirectories = entryDirectoriesFromFiles(Object.keys(courseFiles));
    const entryModuleDirectories = entryDirectoriesFromFiles(Object.keys(courseEntryModules));

    expect(entries).toHaveLength(53);
    expect(entries.filter((entry) => entry.subjectId === 'chinese')).toHaveLength(16);
    expect(entries.filter((entry) => entry.subjectId === 'math')).toHaveLength(21);
    expect(entries.filter((entry) => entry.subjectId === 'english')).toHaveLength(16);
    expect(new Set(expectedDirectories).size).toBe(expectedDirectories.length);
    expect(inspectLayout(expectedDirectories, actualDirectories, entryModuleDirectories)).toEqual({
      missing: [],
      missingEntryModules: [],
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

  it('reportsRegisteredEntryDirectoriesWithoutAnIndexModule', () => {
    const directory = 'grade-2/term-1/chinese/unit-01';

    expect(inspectLayout([directory], [directory], [])).toEqual({
      missing: [],
      missingEntryModules: [directory],
      unregistered: [],
      invalid: [],
    });
  });

  it('groupsNestedFilesByEntryDirectoryAndIgnoresSubjectLevelSources', () => {
    expect(entryDirectoriesFromFiles([
      './grade-2/term-1/chinese/unit-01/lesson.md',
      './grade-2/term-1/chinese/unit-01/examples/note.json',
      './grade-2/term-1/chinese/questionAuthoring.ts',
    ])).toEqual(['grade-2/term-1/chinese/unit-01']);
  });

  it('usesExpectedGradeTermSubjectAndEntrySlugs', () => {
    const registeredDirectories = getPlayableEntries().map((entry) => entry.curriculumUnitKey);
    const invalidDirectory = 'grade-2/term-1/chinese/topic-01';

    expect(inspectLayout([], registeredDirectories).invalid).toEqual([]);
    expect(inspectLayout([], [invalidDirectory]).invalid).toEqual([invalidDirectory]);
  });
});
