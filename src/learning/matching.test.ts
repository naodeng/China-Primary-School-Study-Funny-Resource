import { describe, expect, it } from 'vitest';
import type { MatchPair } from '../content/types';
import { shuffleMatchAnswers } from './matching';

const pairs: MatchPair[] = [
  { id: 'one', left: '一颗星', right: '数字 1' },
  { id: 'two', left: '两颗星', right: '数字 2' },
  { id: 'three', left: '三颗星', right: '数字 3' },
];

describe('shuffleMatchAnswers', () => {
  it('shufflesMatchAnswersWithoutChangingPairIdentity', () => {
    const shuffled = shuffleMatchAnswers(pairs, () => 0);

    expect(shuffled.map((pair) => pair.id)).not.toEqual(pairs.map((pair) => pair.id));
    expect(shuffled.map((pair) => pair.id).sort()).toEqual(pairs.map((pair) => pair.id).sort());
    expect(shuffled.map((pair) => pair.right)).toEqual(shuffled.map((pair) => pairs.find((item) => item.id === pair.id)!.right));
    expect(pairs.map((pair) => pair.id)).toEqual(['one', 'two', 'three']);
  });

  it('fallsBackFromIdentityOrder', () => {
    const shuffled = shuffleMatchAnswers(pairs, () => 0.999999);

    expect(shuffled.map((pair) => pair.id)).not.toEqual(pairs.map((pair) => pair.id));
  });

  it('returnsCopiesForZeroAndOnePair', () => {
    expect(shuffleMatchAnswers([], () => 0)).toEqual([]);
    const single = [pairs[0]];
    expect(shuffleMatchAnswers(single, () => 0)).toEqual(single);
    expect(shuffleMatchAnswers(single, () => 0)).not.toBe(single);
  });

  it('handlesOutOfRangeAndNonFiniteRandomValues', () => {
    expect(shuffleMatchAnswers(pairs, () => Number.NaN).map((pair) => pair.id)).not.toEqual(pairs.map((pair) => pair.id));
    expect(shuffleMatchAnswers(pairs, () => 1).map((pair) => pair.id)).not.toEqual(pairs.map((pair) => pair.id));
  });
});
