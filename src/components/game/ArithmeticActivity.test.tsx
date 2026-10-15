import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ArithmeticActivityDefinition } from '../../content/types';
import ArithmeticActivity from './ArithmeticActivity';

const activity: ArithmeticActivityDefinition = {
  id: 'large-arithmetic',
  kind: 'arithmetic',
  prompt: '一袋苹果重600克，另一袋重300克，两袋共重多少克？',
  hint: '把相同单位的质量相加。',
  explanation: '600克加300克等于900克。',
  expression: '600 + 300',
  correctAnswer: 900,
};

describe('ArithmeticActivity', () => {
  it('showsHundredsTensAndOnesForThreeDigitOperands', () => {
    const { container } = render(<ArithmeticActivity activity={activity} disabled={false} showSteps={false} onSubmit={vi.fn()} />);
    const [hundreds, hundredsAdded] = container.querySelectorAll('.place-number');

    expect(hundreds).toBeInTheDocument();
    expect(hundredsAdded).toBeInTheDocument();
    expect(within(hundreds as HTMLElement).getByText('百位')).toBeInTheDocument();
    expect(within(hundreds as HTMLElement).getByText('6')).toBeInTheDocument();
    expect(within(hundreds as HTMLElement).getByText('十位')).toBeInTheDocument();
    expect(within(hundreds as HTMLElement).getAllByText('0')).toHaveLength(2);
    expect(within(hundredsAdded as HTMLElement).getByText('百位')).toBeInTheDocument();
    expect(within(hundredsAdded as HTMLElement).getByText('3')).toBeInTheDocument();
  });

  it('acceptsAThreeDigitResultWithinTheExpandedInputRange', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ArithmeticActivity activity={activity} disabled={false} showSteps={false} onSubmit={onSubmit} />);
    const answer = screen.getByRole('spinbutton', { name: '输入计算结果' });
    const submit = screen.getByRole('button', { name: '检查答案' });

    expect(answer).toHaveAttribute('max', '999');
    await user.type(answer, '900');

    expect(submit).toBeEnabled();
    await user.click(submit);
    expect(onSubmit).toHaveBeenCalledWith(900);
  });
});
