import { describe, expect, it } from 'vitest';
import { curriculum } from './curriculum';

function promptsFor(unitKey: string, difficulty: 'advanced' | 'high', taskIndex: number) {
  return curriculum.units[unitKey]?.difficultyTracks[difficulty].tasks[taskIndex]?.sessions
    .flatMap((session) => session.activities.map((activity) => activity.prompt)) ?? [];
}

describe('reviewed advanced and high task strategies', () => {
  it('gives the second mass advanced task a distinct missing-mass goal', () => {
    const tasks = curriculum.units['grade-2/term-2/math/unit-08']?.difficultyTracks.advanced.tasks;

    expect(tasks?.[1].title).toBe('质量缺口侦探');
    expect(tasks?.[1].objective).toContain('已知部分');
    expect(tasks?.[1].objective).toContain('加法检验');
    expect(tasks?.[0].objective).not.toContain('缺少的质量');
    expect(promptsFor('grade-2/term-2/math/unit-08', 'advanced', 1).join(' ')).toContain('还差');
  });

  it('separates mass-record error diagnosis from high-tier supply planning', () => {
    const tasks = curriculum.units['grade-2/term-2/math/unit-08']?.difficultyTracks.high.tasks;

    expect(tasks?.[1].title).toBe('称量记录纠错员');
    expect(tasks?.[1].objective).toContain('找出并修正');
    expect(tasks?.[0].objective).toContain('规划');
    expect(promptsFor('grade-2/term-2/math/unit-08', 'high', 1).join(' ')).toContain('记录');
  });

  it('separates English time-message repair from time reporting', () => {
    const tasks = curriculum.units['grade-2/term-2/english/unit-04']?.difficultyTracks.high.tasks;

    expect(tasks?.[1].title).toBe('时间消息修复员');
    expect(tasks?.[1].objective).toContain('找出不一致的信息');
    expect(tasks?.[1].objective).toContain('修正');
    expect(tasks?.[0].objective).toContain('播报');
    expect(promptsFor('grade-2/term-2/english/unit-04', 'high', 1).join(' ')).toContain('错误');
  });
});
