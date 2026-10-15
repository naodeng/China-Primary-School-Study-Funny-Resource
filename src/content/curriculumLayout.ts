const canonicalEntryPattern = /^grade-\d+\/term-[12]\/(?:chinese|math|english)\/(?:unit|review|integrated-practice)-\d{2}$/;

export interface LayoutReport {
  missing: string[];
  missingEntryModules: string[];
  unregistered: string[];
  invalid: string[];
}

export function entryDirectoriesFromFiles(paths: readonly string[]): string[] {
  return [...new Set(paths.flatMap((path) => {
    const segments = path.replace(/^\.\//, '').split('/');
    return segments.length >= 5 ? [segments.slice(0, 4).join('/')] : [];
  }))].sort();
}

export function inspectLayout(
  expectedDirectories: readonly string[],
  actualDirectories: readonly string[],
  entryModuleDirectories: readonly string[] = actualDirectories,
): LayoutReport {
  const expected = new Set(expectedDirectories);
  const actual = new Set(actualDirectories);
  const modules = new Set(entryModuleDirectories);

  return {
    missing: [...expected].filter((directory) => !actual.has(directory)).sort(),
    missingEntryModules: [...expected].filter((directory) => !modules.has(directory)).sort(),
    unregistered: [...actual].filter((directory) => !expected.has(directory)).sort(),
    invalid: [...actual].filter((directory) => !canonicalEntryPattern.test(directory)).sort(),
  };
}
