import { describe, expect, it } from 'vitest';
import { curriculum } from './curriculum';
import { curriculumManifest } from './curriculumManifest';

describe('runtime curriculum manifest', () => {
  it('contains a lightweight progress index for every published unit', () => {
    expect(Object.keys(curriculumManifest.units).sort()).toEqual(Object.keys(curriculum.units).sort());

    for (const [key, unit] of Object.entries(curriculum.units)) {
      const manifestUnit = curriculumManifest.units[key];
      expect(manifestUnit.sessionIds.basic).toEqual(unit.difficultyTracks.basic.tasks.flatMap((task) => task.sessions.map((session) => session.id)));
      expect(manifestUnit.sessionIds.advanced).toEqual(unit.difficultyTracks.advanced.tasks.flatMap((task) => task.sessions.map((session) => session.id)));
      expect(manifestUnit.sessionIds.high).toEqual(unit.difficultyTracks.high.tasks.flatMap((task) => task.sessions.map((session) => session.id)));
      expect(manifestUnit.basicSessions).toEqual(unit.difficultyTracks.basic.tasks.flatMap((task) => task.sessions.map(({ id, title }) => ({ id, title }))));
    }
  });
});
