import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MeasurementActivityDefinition } from '../../content/types';
import MeasurementActivity from './MeasurementActivity';

const activity: MeasurementActivityDefinition = {
  id: 'measurement-activity',
  kind: 'measurement',
  prompt: '测量虚拟铅笔。',
  hint: '从0刻度开始。',
  explanation: '读出终点对应的刻度。',
  objectLabel: '虚拟铅笔',
  targetLengthCm: 8,
  minCm: 0,
  maxCm: 12,
};

describe('MeasurementActivity', () => {
  it('keepsTheDisplayedTargetLengthIndependentFromTheLearnersStepperAnswer', async () => {
    const user = userEvent.setup();
    const { container } = render(<MeasurementActivity activity={activity} disabled={false} onSubmit={vi.fn()} />);
    const object = container.querySelector('.measurement-object-shape');
    const targetWidth = object?.getAttribute('style');

    for (let tick = 0; tick < 4; tick += 1) await user.click(screen.getByRole('button', { name: '增加 1 厘米' }));

    expect(screen.getByText('4 厘米')).toBeInTheDocument();
    expect(object?.getAttribute('style')).toBe(targetWidth);
  });
});
