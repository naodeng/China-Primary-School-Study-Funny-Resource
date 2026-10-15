import { useState } from 'react';
import { Button } from 'animal-island-ui';
import { CheckIcon } from 'naive-icons';
import type { CategorizeActivityDefinition } from '../../content/types';

interface CategorizeActivityProps {
  activity: CategorizeActivityDefinition;
  disabled: boolean;
  onSubmit: (answer: Record<string, string>) => void;
}

export default function CategorizeActivity({ activity, disabled, onSubmit }: CategorizeActivityProps) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  return (
    <div className="categorize-activity">
      <div className="categorize-list">
        {activity.items.map((item) => (
          <div className="categorize-row" key={item.id}>
            <strong>{item.label}</strong>
            <div className="category-choice-list" role="group" aria-label={`为${item.label}选择分类`}>
              {activity.categories.map((category) => (
                <Button
                  type={assignments[item.id] === category.id ? 'primary' : 'default'}
                  className="category-choice"
                  key={category.id}
                  aria-pressed={assignments[item.id] === category.id}
                  disabled={disabled}
                  icon={assignments[item.id] === category.id ? <CheckIcon size={16} aria-hidden="true" /> : undefined}
                  onClick={() => setAssignments((current) => ({ ...current, [item.id]: category.id }))}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="match-count" aria-live="polite">已整理 {Object.keys(assignments).length}/{activity.items.length} 项</p>
      <Button type="primary" className="activity-submit-action" disabled={disabled || Object.keys(assignments).length !== activity.items.length} onClick={() => onSubmit(assignments)}>
        检查分类
      </Button>
    </div>
  );
}
