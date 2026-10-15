import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import type { OrderActivityDefinition } from '../../content/types';
import OrderActivity from './OrderActivity';

const activity: OrderActivityDefinition = {
  id: 'order-activity',
  kind: 'order',
  prompt: '把步骤排好。',
  hint: '先看第一步。',
  explanation: '按顺序完成。',
  items: [
    { id: 'first', label: '第一步' },
    { id: 'second', label: '第二步' },
    { id: 'third', label: '第三步' },
  ],
  correctOrder: ['first', 'second', 'third'],
};

describe('OrderActivity', () => {
  it('doesNotStartWithTheCorrectOrderWhenItemsAreAlreadySolved', () => {
    render(<OrderActivity activity={activity} disabled={false} onSubmit={vi.fn()} />);

    const currentLabels = within(screen.getByRole('list', { name: '当前排列顺序' }))
      .getAllByRole('listitem')
      .map((row) => row.querySelector('.order-label')?.textContent);

    expect(currentLabels).not.toEqual(activity.correctOrder.map((id) => activity.items.find((item) => item.id === id)?.label));
  });
});
