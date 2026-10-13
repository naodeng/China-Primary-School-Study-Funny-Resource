import type { MatchPair } from '../content/types';

export function shuffleMatchAnswers(pairs: readonly MatchPair[], random: () => number = Math.random): MatchPair[] {
  if (pairs.length < 2) return [...pairs];

  const shuffled = [...pairs];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const sampled = random();
    const safeSample = Number.isFinite(sampled) ? Math.max(0, Math.min(1, sampled)) : 0;
    const swapIndex = Math.min(index, Math.floor(safeSample * (index + 1)));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  const isIdentityOrder = shuffled.every((pair, index) => pair.id === pairs[index].id);
  return isIdentityOrder ? [...shuffled.slice(1), shuffled[0]] : shuffled;
}
