import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
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
  it('keepsTheDisplayedTargetLengthIndependentFromTheLearnersSliderAnswer', () => {
    const { container } = render(<MeasurementActivity activity={activity} disabled={false} onSubmit={vi.fn()} />);
    const object = container.querySelector('.measurement-object-shape');
    const targetWidth = object?.getAttribute('style');

    fireEvent.change(screen.getByRole('slider'), { target: { value: '4' } });

    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '4厘米');
    expect(object?.getAttribute('style')).toBe(targetWidth);
  });
});
