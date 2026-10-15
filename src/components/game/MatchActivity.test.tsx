import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MatchActivityDefinition } from '../../content/types';
import ActivityRenderer from './ActivityRenderer';
import MatchActivity from './MatchActivity';

const activity: MatchActivityDefinition = {
  id: 'star-match',
  kind: 'match',
  prompt: '把星星数量和数字配起来。',
  hint: '先看看每一组星星有几颗。',
  explanation: '数清星星的数量，就能找到对应数字。',
  pairs: [
    { id: 'one', left: '一颗星星', right: '数字 1' },
    { id: 'two', left: '两颗星星', right: '数字 2' },
    { id: 'three', left: '三颗星星', right: '数字 3' },
  ],
};

function getRightAnswerOrder() {
  return within(screen.getByRole('group', { name: '右侧词语' }))
    .getAllByRole('button')
    .map((button) => button.textContent);
}

describe('MatchActivity', () => {
  it('shufflesOnlyTheRightColumnAndKeepsItsOrderDuringRerenders', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const { rerender } = render(<MatchActivity activity={activity} disabled={false} onSubmit={onSubmit} random={() => 0} />);
    const left = within(screen.getByRole('group', { name: '左侧词语' }));
    const initialRightOrder = getRightAnswerOrder();

    expect(left.getAllByRole('button').map((button) => button.textContent?.replace('已配对', '').trim())).toEqual(activity.pairs.map((pair) => pair.left));
    expect(initialRightOrder).not.toEqual(activity.pairs.map((pair) => pair.right));
    await user.click(left.getByRole('button', { name: /一颗星星/ }));
    rerender(<MatchActivity activity={activity} disabled={false} onSubmit={onSubmit} random={() => 0.99} />);
    expect(getRightAnswerOrder()).toEqual(initialRightOrder);

    for (const pair of activity.pairs) {
      await user.click(left.getByRole('button', { name: new RegExp(pair.left) }));
      await user.click(within(screen.getByRole('group', { name: '右侧词语' })).getByRole('button', { name: pair.right }));
    }
    await user.click(screen.getByRole('button', { name: '检查配对' }));

    expect(onSubmit).toHaveBeenCalledWith({ one: 'one', two: 'two', three: 'three' });
  });

  it('reshufflesWhenAnIncorrectAttemptIsRetried', async () => {
    const user = userEvent.setup();
    const randomValues = [0.999, 0.999, 0, 0.999];
    let randomIndex = 0;
    const random = vi.fn(() => randomValues[randomIndex++] ?? 0.999);
    render(<ActivityRenderer activity={activity} onSolved={vi.fn()} random={random} selectMessage={() => '继续找线索，再试一次。'} />);
    const beforeRetry = getRightAnswerOrder();
    const left = within(screen.getByRole('group', { name: '左侧词语' }));
    const wrongPairs = [
      { left: '一颗星星', right: '数字 2' },
      { left: '两颗星星', right: '数字 3' },
      { left: '三颗星星', right: '数字 1' },
    ];

    for (const pair of wrongPairs) {
      await user.click(left.getByRole('button', { name: new RegExp(pair.left) }));
      await user.click(within(screen.getByRole('group', { name: '右侧词语' })).getByRole('button', { name: pair.right }));
    }
    await user.click(screen.getByRole('button', { name: '检查配对' }));
    await user.click(screen.getByRole('button', { name: '再试一次' }));

    expect(random).toHaveBeenCalledTimes(4);
    expect(getRightAnswerOrder()).not.toEqual(beforeRetry);
  });
});
