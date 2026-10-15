export type FeedbackStatus = 'correct' | 'incorrect';

export const FEEDBACK_MESSAGES: Record<FeedbackStatus, readonly string[]> = {
  correct: [
    '答对了！你刚刚又点亮了一颗知识星星。',
    '真棒！你认真观察，发现了关键线索。',
    '太好了！每一步思考都在积累能量。',
    '成功啦！你愿意动脑尝试，真的很棒。',
    '这道题被你成功破解啦！继续保持好奇心！',
  ],
  incorrect: [
    '这次还没对上，没关系！看看线索，换个想法再试试。',
    '勇敢尝试很棒！再找找题目里的小提示吧。',
    '还差一点点！换个角度想想，你正在进步。',
    '先别着急，发现新线索就离答案更近一步。',
    '每一次尝试都在帮大脑升级，继续试试看！',
  ],
};

export function selectFeedbackMessage(
  status: FeedbackStatus,
  previousMessage: string | null,
  random: () => number = Math.random,
): string {
  const messages = FEEDBACK_MESSAGES[status];
  const candidates = previousMessage && messages.length > 1
    ? messages.filter((message) => message !== previousMessage)
    : messages;
  const sampled = random();
  const safeSample = Number.isFinite(sampled) ? Math.max(0, Math.min(1, sampled)) : 0;
  const index = Math.min(candidates.length - 1, Math.floor(safeSample * candidates.length));
  return candidates[index];
}
