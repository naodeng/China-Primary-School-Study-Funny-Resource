import { useState } from 'react';
import { Button } from 'animal-island-ui';
import type { ChoiceActivityDefinition } from '../../content/types';

interface ChoiceActivityProps {
  activity: ChoiceActivityDefinition;
  disabled: boolean;
  onSubmit: (answer: string) => void;
}

export default function ChoiceActivity({ activity, disabled, onSubmit }: ChoiceActivityProps) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="choice-activity">
      <div className="choice-options" role="group" aria-label="选择一个答案">
        {activity.options.map((option, index) => (
          <Button
            className={`choice-option ${selected === option.id ? 'is-selected' : ''}`}
            key={option.id}
            type={selected === option.id ? 'primary' : 'default'}
            block
            aria-pressed={selected === option.id}
            disabled={disabled}
            onClick={() => setSelected(option.id)}
          >
            <span className="choice-option-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
            <span className="choice-option-label">{option.label}</span>
          </Button>
        ))}
      </div>
      <Button type="primary" className="activity-submit-action" disabled={!selected || disabled} onClick={() => selected && onSubmit(selected)}>
        提交答案
      </Button>
    </div>
  );
}
