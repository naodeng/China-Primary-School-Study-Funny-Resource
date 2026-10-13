import { useState } from 'react';
import { Button } from 'animal-island-ui';
import type { MatchActivityDefinition } from '../../content/types';

interface MatchActivityProps {
  activity: MatchActivityDefinition;
  disabled: boolean;
  onSubmit: (answer: Record<string, string>) => void;
}

export default function MatchActivity({ activity, disabled, onSubmit }: MatchActivityProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const takenRightIds = Object.entries(assignments)
    .filter(([leftId]) => leftId !== selectedLeft)
    .map(([, rightId]) => rightId);

  function selectRight(rightId: string) {
    if (!selectedLeft || disabled) return;
    setAssignments((current) => ({ ...current, [selectedLeft]: rightId }));
    setSelectedLeft(null);
  }

  return (
    <div className="match-activity">
      <p className="interaction-instruction" aria-live="polite">
        {selectedLeft ? '现在帮它找到右侧的伙伴。' : '选一个左侧词语，再找找它的伙伴。'}
      </p>
      <div className="match-columns">
        <div className="match-column" role="group" aria-label="左侧词语">
          {activity.pairs.map((pair) => (
            <button
              className={`match-choice ${selectedLeft === pair.id ? 'is-selected' : ''} ${assignments[pair.id] ? 'is-linked' : ''}`}
              type="button"
              key={pair.id}
              aria-pressed={selectedLeft === pair.id}
              disabled={disabled}
              onClick={() => setSelectedLeft(pair.id)}
            >
              <span>{pair.left}</span>
              {assignments[pair.id] && <small>已配对</small>}
            </button>
          ))}
        </div>
        <div className="match-column" role="group" aria-label="右侧词语">
          {activity.pairs.map((pair) => (
            <button
              className={`match-choice ${takenRightIds.includes(pair.id) ? 'is-linked' : ''}`}
              type="button"
              key={pair.id}
              aria-pressed={assignments[selectedLeft ?? ''] === pair.id}
              disabled={disabled || !selectedLeft || takenRightIds.includes(pair.id)}
              onClick={() => selectRight(pair.id)}
            >
              {pair.right}
            </button>
          ))}
        </div>
      </div>
      <p className="match-count" aria-live="polite">已配好 {Object.keys(assignments).length}/{activity.pairs.length} 组</p>
      <Button type="primary" disabled={disabled || Object.keys(assignments).length !== activity.pairs.length} onClick={() => onSubmit(assignments)}>
        检查配对
      </Button>
    </div>
  );
}
