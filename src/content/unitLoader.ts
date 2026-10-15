import type { CurriculumUnit } from './types';

const unitModules = import.meta.glob<{ unit: CurriculumUnit }>('./grade-2/**/index.ts');
const loadedUnits = new Map<string, Promise<CurriculumUnit | undefined>>();

export function loadUnit(unitKey: string): Promise<CurriculumUnit | undefined> {
  const cached = loadedUnits.get(unitKey);
  if (cached) return cached;

  const modulePath = `./${unitKey}/index.ts`;
  const loader = unitModules[modulePath];
  if (!loader) return Promise.resolve(undefined);

  const pendingUnit = loader().then((module) => module.unit).catch((error: unknown) => {
    loadedUnits.delete(unitKey);
    throw error;
  });
  loadedUnits.set(unitKey, pendingUnit);
  return pendingUnit;
}
