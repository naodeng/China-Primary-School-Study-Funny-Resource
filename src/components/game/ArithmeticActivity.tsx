import { useState } from 'react';
import { Button, Input } from 'animal-island-ui';
import type { ArithmeticActivityDefinition } from '../../content/types';

interface ArithmeticActivityProps {
  activity: ArithmeticActivityDefinition;
  disabled: boolean;
  showSteps: boolean;
  onSubmit: (answer: number) => void;
}

const PLACE_NAMES = ['个位', '十位', '百位', '千位', '万位', '十万位', '百万位', '千万位', '亿位'];

export default function ArithmeticActivity({ activity, disabled, showSteps, onSubmit }: ArithmeticActivityProps) {
  const [answer, setAnswer] = useState('');
  const operands = activity.expression.match(/\d+/g)?.map(Number) ?? [];
  const largestValue = Math.max(0, activity.correctAnswer, ...operands);
  const placeCount = Math.max(2, String(Math.trunc(largestValue)).length);
  const placeColumns = Array.from({ length: placeCount }, (_, index) => {
    const power = placeCount - index - 1;
    return {
      label: PLACE_NAMES[power] ?? `${10 ** power}位`,
      divisor: 10 ** power,
    };
  });
  const maxAnswer = 10 ** placeCount - 1;
  const numericAnswer = Number(answer);
  const validAnswer = answer.trim() !== ''
    && Number.isInteger(numericAnswer)
    && numericAnswer >= 0
    && numericAnswer <= maxAnswer;

  return (
    <div className="arithmetic-activity">
      <div className="arithmetic-expression" aria-label={`算式 ${activity.expression}`}>
        {activity.expression}
      </div>
      <div className="place-value-board" aria-label="数位提示">
        {operands.map((operand, index) => (
          <div className="place-number" key={`${operand}-${index}`}>
            <span className="place-number-value">{operand}</span>
            <div className="place-digit-grid">
              {placeColumns.map(({ label, divisor }) => (
                <span key={label}><small>{label}</small><strong>{Math.floor(operand / divisor) % 10}</strong></span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <label className="arithmetic-answer-label" htmlFor={`answer-${activity.id}`}>你的答案</label>
      <div className="arithmetic-answer-row">
        <Input
          id={`answer-${activity.id}`}
          className="arithmetic-answer-input"
          size="large"
          shadow={false}
          type="number"
          inputMode="numeric"
          min="0"
          max={String(maxAnswer)}
          step="1"
          value={answer}
          disabled={disabled}
          aria-label="输入计算结果"
          placeholder="输入数字"
          onChange={(event) => setAnswer(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && validAnswer && !disabled) onSubmit(Number(answer));
          }}
        />
        <span>按题目中的单位作答</span>
      </div>
      <p className="arithmetic-keyboard-hint">可以使用键盘数字键输入，按回车提交。</p>
      <Button type="primary" className="activity-submit-action" disabled={disabled || !validAnswer} onClick={() => onSubmit(Number(answer))}>检查答案</Button>
      {showSteps && activity.carryBorrowSteps && (
        <div className="calculation-steps" role="status">
          <strong>一步一步看</strong>
          <ol>{activity.carryBorrowSteps.map((step) => <li key={step}>{step}</li>)}</ol>
        </div>
      )}
    </div>
  );
}
